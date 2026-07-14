import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { validateLegalConfig } from "@/config/legal";
import type { Locale } from "@/i18n/routing";

const policyFiles = {
  en: "privacy-policy.en.md",
  pl: "privacy-policy.pl.md",
} as const satisfies Record<Locale, string>;

export function getPrivacyPolicyMarkdown(locale: Locale) {
  const config = validateLegalConfig();
  const source = readFileSync(
    join(process.cwd(), "content", "legal", policyFiles[locale]),
    "utf8",
  );
  const vendorListLine = config.vendorOrSubprocessorListUrl
    ? locale === "pl"
      ? `Aktualna lista dostawców i podmiotów przetwarzających jest dostępna [tutaj](${config.vendorOrSubprocessorListUrl}).`
      : `The current vendor and subprocessor list is available [here](${config.vendorOrSubprocessorListUrl}).`
    : "";

  const replacements: Record<string, string> = {
    controllerLegalName: config.controllerLegalName,
    privacyEmail: config.privacyEmail,
    vendorListLine,
  };

  const rendered = Object.entries(replacements).reduce(
    (markdown, [key, value]) =>
      markdown.replaceAll(`{{${key}}}`, escapeMarkdown(value)),
    source,
  );
  const withoutFrontmatter = rendered.replace(
    /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
    "",
  );
  const withoutDuplicateTitle = withoutFrontmatter.replace(
    /^\s*# .+\r?\n+/,
    "",
  );

  if (
    withoutDuplicateTitle.includes("[[") ||
    /\{\{[^}]+\}\}/.test(withoutDuplicateTitle)
  ) {
    throw new Error(
      `Privacy policy ${locale} contains an unresolved legal placeholder.`,
    );
  }

  return withoutDuplicateTitle;
}

function escapeMarkdown(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}
