import "server-only";

import type { Locale } from "@/i18n/routing";

export type LegalConfig = {
  serviceProviderLegalName: string;
  legalForm: string;
  registeredAddress: string;
  vatNumber: string;
  registrationNumber: string;
  contactEmail: string;
  complaintsEmail: string;
  securityEmail: string;
  illegalContentOrAbuseEmail: string;
  privacyEmail: string;
  dpoDetails: string | null;
  vendorOrSubprocessorListUrl: string | null;
  privacyPolicyUrl: Record<Locale, string>;
  termsUrl: Record<Locale, string>;
  termsArchiveUrl: string | null;
  technicalRequirementsUrl: string | null;
  supportPolicyUrl: string | null;
  paymentTermDays: number | null;
  noticePeriodDays: number | null;
  exportWindowDays: number | null;
  primaryDeletionDays: number | null;
  backupRetentionDays: number | null;
  freeServiceLiabilityCapPln: number | null;
  privacyEffectiveDate: "2026-07-13";
  effectiveDate: "2026-07-14";
  version: "1.0";
};

const serviceProviderLegalName =
  process.env.LEGAL_SERVICE_PROVIDER_NAME?.trim() ??
  process.env.LEGAL_CONTROLLER_NAME?.trim() ??
  "";
const contactEmail = process.env.LEGAL_CONTACT_EMAIL?.trim() ?? "";

export const legalConfig = {
  serviceProviderLegalName,
  legalForm: process.env.LEGAL_FORM?.trim() ?? "",
  registeredAddress: process.env.LEGAL_REGISTERED_ADDRESS?.trim() ?? "",
  vatNumber: process.env.LEGAL_VAT_NUMBER?.trim() ?? "",
  registrationNumber: process.env.LEGAL_REGISTRATION_NUMBER?.trim() ?? "",
  contactEmail,
  complaintsEmail: process.env.LEGAL_COMPLAINTS_EMAIL?.trim() ?? "",
  securityEmail: process.env.LEGAL_SECURITY_EMAIL?.trim() ?? "",
  illegalContentOrAbuseEmail:
    process.env.LEGAL_ILLEGAL_CONTENT_EMAIL?.trim() ?? "",
  privacyEmail: process.env.LEGAL_PRIVACY_EMAIL?.trim() || contactEmail,
  dpoDetails: process.env.LEGAL_DPO_DETAILS?.trim() || null,
  vendorOrSubprocessorListUrl:
    process.env.LEGAL_VENDOR_LIST_URL?.trim() || null,
  privacyPolicyUrl: {
    pl: "/pl/privacy",
    en: "/privacy",
  },
  termsUrl: {
    pl: "/pl/terms",
    en: "/terms",
  },
  termsArchiveUrl: process.env.LEGAL_TERMS_ARCHIVE_URL?.trim() || null,
  technicalRequirementsUrl:
    process.env.LEGAL_TECHNICAL_REQUIREMENTS?.trim() || null,
  supportPolicyUrl: process.env.LEGAL_SUPPORT_POLICY?.trim() || null,
  paymentTermDays: optionalPositiveInteger("LEGAL_PAYMENT_TERM_DAYS"),
  noticePeriodDays: optionalPositiveInteger("LEGAL_NOTICE_PERIOD_DAYS"),
  exportWindowDays: optionalPositiveInteger("LEGAL_EXPORT_WINDOW_DAYS"),
  primaryDeletionDays: optionalPositiveInteger("LEGAL_PRIMARY_DELETION_DAYS"),
  backupRetentionDays: optionalPositiveInteger("LEGAL_BACKUP_RETENTION_DAYS"),
  freeServiceLiabilityCapPln: optionalPositiveInteger(
    "LEGAL_FREE_SERVICE_LIABILITY_CAP_PLN",
  ),
  privacyEffectiveDate: "2026-07-13",
  effectiveDate: "2026-07-14",
  version: "1.0",
} satisfies LegalConfig;

const privacyRequiredFields = [
  "serviceProviderLegalName",
  "privacyEmail",
] as const satisfies ReadonlyArray<keyof LegalConfig>;

const termsRequiredFields = [
  "serviceProviderLegalName",
  "legalForm",
  "registeredAddress",
  "vatNumber",
  "registrationNumber",
  "contactEmail",
  "complaintsEmail",
  "securityEmail",
  "illegalContentOrAbuseEmail",
  "termsArchiveUrl",
  "technicalRequirementsUrl",
  "supportPolicyUrl",
  "paymentTermDays",
  "noticePeriodDays",
  "exportWindowDays",
  "primaryDeletionDays",
  "backupRetentionDays",
  "freeServiceLiabilityCapPln",
] as const satisfies ReadonlyArray<keyof LegalConfig>;

export function validatePrivacyLegalConfig(config: LegalConfig = legalConfig) {
  validateRequiredFields(config, privacyRequiredFields, "privacy policy");

  if (
    (process.env.LEAD_CRM_WEBHOOK_URL || process.env.LEAD_EMAIL_WEBHOOK_URL) &&
    !config.vendorOrSubprocessorListUrl
  ) {
    throw new Error(
      "An external lead webhook is configured. Set LEGAL_VENDOR_LIST_URL after verifying and documenting that processor.",
    );
  }

  return config;
}

export function validateTermsLegalConfig(config: LegalConfig = legalConfig) {
  validateNoPlaceholderTokens(config);
  return config;
}

export function getMissingTermsLegalFields(config: LegalConfig = legalConfig) {
  return termsRequiredFields.filter((field) => {
    const value = config[field];
    return value === "" || value === null || value === undefined;
  });
}

export function validateLegalConfig(config: LegalConfig = legalConfig) {
  validatePrivacyLegalConfig(config);
  validateTermsLegalConfig(config);
  return config;
}

function validateRequiredFields(
  config: LegalConfig,
  fields: ReadonlyArray<keyof LegalConfig>,
  documentName: string,
) {
  const missing = fields.filter((field) => {
    const value = config[field];
    return value === "" || value === null || value === undefined;
  });

  if (missing.length > 0) {
    throw new Error(
      `Legal configuration for the ${documentName} is incomplete. Set the owner-approved values documented in .env.example. Missing fields: ${missing.join(
        ", ",
      )}.`,
    );
  }

  validateNoPlaceholderTokens(config);
}

function validateNoPlaceholderTokens(config: LegalConfig) {
  const invalidFields = Object.entries(config)
    .filter(([, value]) =>
      typeof value === "string" ? value.includes("[[") : false,
    )
    .map(([field]) => field);

  if (invalidFields.length > 0) {
    throw new Error(
      `Legal configuration must not contain [[...]] placeholders. Invalid fields: ${invalidFields.join(
        ", ",
      )}.`,
    );
  }
}

function optionalPositiveInteger(name: string) {
  const rawValue = process.env[name]?.trim();

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);

  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return value;
}
