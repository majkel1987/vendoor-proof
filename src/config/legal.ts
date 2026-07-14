import "server-only";

export type LegalConfig = {
  controllerLegalName: string;
  privacyEmail: string;
  dpoDetails: string | null;
  vendorOrSubprocessorListUrl: string | null;
  backupRetentionDays: number | null;
  effectiveDate: "2026-07-13";
};

export const legalConfig: LegalConfig = {
  controllerLegalName: process.env.LEGAL_CONTROLLER_NAME?.trim() ?? "",
  privacyEmail: process.env.LEGAL_PRIVACY_EMAIL?.trim() ?? "",
  dpoDetails: process.env.LEGAL_DPO_DETAILS?.trim() || null,
  vendorOrSubprocessorListUrl:
    process.env.LEGAL_VENDOR_LIST_URL?.trim() || null,
  backupRetentionDays: null,
  effectiveDate: "2026-07-13",
};

const requiredFields = [
  "controllerLegalName",
  "privacyEmail",
] as const satisfies ReadonlyArray<keyof LegalConfig>;

export function validateLegalConfig(config: LegalConfig = legalConfig) {
  const missing = requiredFields.filter((field) => !config[field]);

  if (missing.length > 0) {
    throw new Error(
      `Legal configuration is incomplete. Set the required environment variables documented in .env.example. Missing fields: ${missing.join(
        ", ",
      )}.`,
    );
  }

  const invalidToken = Object.values(config).find(
    (value) => typeof value === "string" && value.includes("[["),
  );

  if (invalidToken) {
    throw new Error(
      "Legal configuration must not contain [[...]] placeholders.",
    );
  }

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
