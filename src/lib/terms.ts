import "server-only";

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  getMissingTermsLegalFields,
  validateTermsLegalConfig,
} from "@/config/legal";
import type { Locale } from "@/i18n/routing";

const termsVersions = {
  "1.0": {
    effectiveDate: "2026-07-14",
    files: {
      en: "terms.en.md",
      pl: "terms.pl.md",
    },
  },
} as const;

export const currentTermsVersion = "1.0" as const;

export function getTermsDocument(locale: Locale) {
  const config = validateTermsLegalConfig();
  const missingFields = getMissingTermsLegalFields(config);

  if (missingFields.length > 0) {
    const markdown =
      locale === "pl"
        ? "## Regulamin nie został jeszcze opublikowany\n\nDokument zostanie udostępniony przed uruchomieniem usługi wymagającej jego akceptacji."
        : "## The Terms have not been published yet\n\nThe document will be made available before any service requiring its acceptance is launched.";

    return {
      effectiveDate: null,
      hash: createHash("sha256").update(markdown).digest("hex"),
      markdown,
      status: "unpublished" as const,
      version: null,
    };
  }

  const version = termsVersions[currentTermsVersion];
  const source = readFileSync(
    join(process.cwd(), "content", "legal", version.files[locale]),
    "utf8",
  );
  const metadata = readFrontmatter(source);

  if (
    metadata.version !== config.version ||
    metadata.effective_date !== config.effectiveDate
  ) {
    throw new Error(
      `Terms ${locale} metadata does not match the central legal configuration.`,
    );
  }

  const replacements = replacementValues(locale, config);
  const rendered = Object.entries(replacements).reduce(
    (markdown, [token, value]) =>
      markdown.replaceAll(`[[${token}]]`, escapeMarkdown(String(value))),
    source,
  );
  const withoutFrontmatter = rendered.replace(
    /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
    "",
  );
  const withoutComments = withoutFrontmatter.replace(/<!--[\s\S]*?-->/g, "");
  const markdown = withoutComments.replace(/^\s*# .+\r?\n+/, "");

  if (markdown.includes("[[")) {
    const unresolved = [...new Set(markdown.match(/\[\[[^\]]+\]\]/g) ?? [])];
    throw new Error(
      `Terms ${locale} contains unresolved legal placeholders: ${unresolved.join(
        ", ",
      )}.`,
    );
  }

  return {
    effectiveDate: config.effectiveDate,
    hash: createHash("sha256").update(markdown).digest("hex"),
    markdown,
    status: "published" as const,
    version: config.version,
  };
}

export type TermsDocument = ReturnType<typeof getTermsDocument>;

function replacementValues(
  locale: Locale,
  config: ReturnType<typeof validateTermsLegalConfig>,
) {
  const common = {
    BACKUP_RETENTION_DAYS: config.backupRetentionDays,
    COMPLAINTS_EMAIL: config.complaintsEmail,
    CONTACT_EMAIL: config.contactEmail,
    EXPORT_WINDOW_DAYS: config.exportWindowDays,
    FREE_SERVICE_LIABILITY_CAP_PLN: config.freeServiceLiabilityCapPln,
    ILLEGAL_CONTENT_OR_ABUSE_EMAIL: config.illegalContentOrAbuseEmail,
    NOTICE_PERIOD_DAYS: config.noticePeriodDays,
    PAYMENT_TERM_DAYS: config.paymentTermDays,
    PRIMARY_DELETION_DAYS: config.primaryDeletionDays,
    SECURITY_EMAIL: config.securityEmail,
    SUPPORT_POLICY_URL_OR_DESCRIPTION: config.supportPolicyUrl,
  } as const;

  if (locale === "pl") {
    return {
      ...common,
      ADRES: config.registeredAddress,
      FORMA_PRAWNA: config.legalForm,
      LINK_DO_WYMAGAŃ_TECHNICZNYCH_LUB_OPIS: config.technicalRequirementsUrl,
      NIP: config.vatNumber,
      NUMER_KRS_LUB_INFORMACJA_O_CEIDG: config.registrationNumber,
      PEŁNA_NAZWA_PRAWNA_USŁUGODAWCY: config.serviceProviderLegalName,
      PUBLICZNY_URL_REGULAMINU_PL: config.termsUrl.pl,
      URL_ARCHIWUM_REGULAMINÓW: config.termsArchiveUrl,
      URL_POLITYKI_PRYWATNOŚCI_PL: config.privacyPolicyUrl.pl,
    };
  }

  return {
    ...common,
    ADDRESS: config.registeredAddress,
    FULL_LEGAL_NAME_OF_SERVICE_PROVIDER: config.serviceProviderLegalName,
    LEGAL_FORM: config.legalForm,
    PRIVACY_POLICY_URL_EN: config.privacyPolicyUrl.en,
    PUBLIC_TERMS_URL_EN: config.termsUrl.en,
    REGISTRATION_NUMBER: config.registrationNumber,
    TECHNICAL_REQUIREMENTS_URL_OR_DESCRIPTION: config.technicalRequirementsUrl,
    TERMS_ARCHIVE_URL: config.termsArchiveUrl,
    VAT_NUMBER: config.vatNumber,
  };
}

function readFrontmatter(source: string) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    throw new Error("Terms document is missing YAML frontmatter.");
  }

  return Object.fromEntries(
    frontmatter[1].split(/\r?\n/).flatMap((line) => {
      const separator = line.indexOf(":");

      if (separator < 0) {
        return [];
      }

      return [
        [
          line.slice(0, separator).trim(),
          line
            .slice(separator + 1)
            .trim()
            .replace(/^['"]|['"]$/g, ""),
        ],
      ];
    }),
  );
}

function escapeMarkdown(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}
