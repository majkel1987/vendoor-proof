type LeadEmailField = {
  label: string;
  value: string;
};

type LeadEmailPayload = {
  firstName?: string;
  workEmail: string;
  company: string;
  role?: string;
  companyType: string;
  activeVendors: string;
  currentProcess: string;
  monthlyFollowUps?: string;
  biggestPain?: string;
  campaignSegment: string;
  locale: string;
  source?: string;
  referrer?: string;
  receivedAt: string;
};

const BRAND = {
  primary: "#0d7a6f",
  primaryDark: "#0a5f57",
  foreground: "#1a2332",
  muted: "#5c6678",
  border: "#e2e8f0",
  surface: "#f8fafb",
  white: "#ffffff"
} as const;

function displayValue(value: string | undefined, fallback = "Not provided") {
  return value?.trim() ? value.trim() : fallback;
}

function buildFields(payload: LeadEmailPayload): LeadEmailField[] {
  return [
    { label: "Name", value: displayValue(payload.firstName) },
    { label: "Work email", value: displayValue(payload.workEmail, "Unknown") },
    { label: "Company", value: displayValue(payload.company, "Unknown") },
    { label: "Role", value: displayValue(payload.role) },
    { label: "Company type", value: displayValue(payload.companyType, "Unknown") },
    { label: "Active vendors", value: displayValue(payload.activeVendors, "Unknown") },
    { label: "Current process", value: displayValue(payload.currentProcess, "Unknown") },
    {
      label: "Monthly follow-ups",
      value: displayValue(payload.monthlyFollowUps)
    },
    { label: "Biggest pain", value: displayValue(payload.biggestPain) }
  ];
}

function buildMetaFields(payload: LeadEmailPayload): LeadEmailField[] {
  return [
    { label: "Campaign", value: displayValue(payload.campaignSegment, "Unknown") },
    { label: "Locale", value: displayValue(payload.locale, "Unknown") },
    { label: "Source", value: displayValue(payload.source) },
    { label: "Referrer", value: displayValue(payload.referrer) },
    { label: "Received at", value: displayValue(payload.receivedAt, "Unknown") }
  ];
}

export function buildLeadEmailText(payload: LeadEmailPayload) {
  const lines = [
    "New COI Tracker early access submission",
    "",
    ...buildFields(payload).map((field) => `${field.label}: ${field.value}`),
    "",
    ...buildMetaFields(payload).map((field) => `${field.label}: ${field.value}`)
  ];

  return lines.join("\n");
}

export function buildLeadEmailHtml(payload: LeadEmailPayload) {
  const leadFields = buildFields(payload);
  const metaFields = buildMetaFields(payload);
  const company = displayValue(payload.company, "Unknown company");
  const receivedLabel = new Date(payload.receivedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC"
  });

  const renderRow = (field: LeadEmailField, highlight = false) => {
    const valueColor = highlight ? BRAND.primary : BRAND.foreground;
    const valueWeight = highlight ? "600" : "500";

    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};width:38%;font-size:13px;line-height:1.5;color:${BRAND.muted};font-weight:600;vertical-align:top;">
          ${escapeHtml(field.label)}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};font-size:14px;line-height:1.55;color:${valueColor};font-weight:${valueWeight};vertical-align:top;">
          ${field.label === "Work email" && field.value !== "Not provided" && field.value !== "Unknown"
            ? `<a href="mailto:${escapeHtml(field.value)}" style="color:${BRAND.primary};text-decoration:none;">${escapeHtml(field.value)}</a>`
            : escapeHtml(field.value)}
        </td>
      </tr>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New COI Tracker lead</title>
  </head>
  <body style="margin:0;padding:0;background-color:#eef2f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background-color:${BRAND.white};border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(26,35,50,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,${BRAND.primaryDark} 0%,${BRAND.primary} 100%);padding:28px 28px 24px;">
                <p style="margin:0 0 8px;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.78);font-weight:700;">
                  COI Tracker
                </p>
                <h1 style="margin:0;font-size:24px;line-height:1.25;color:#ffffff;font-weight:700;">
                  New early access lead
                </h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.88);">
                  ${escapeHtml(company)} submitted the pilot form on ${escapeHtml(receivedLabel)} UTC.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;">
                <p style="margin:0 0 12px;font-size:13px;line-height:1.5;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};">
                  Submission details
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;background-color:${BRAND.surface};">
                  ${leadFields.map((field) => renderRow(field, field.label === "Work email")).join("")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 24px;">
                <p style="margin:0 0 12px;font-size:13px;line-height:1.5;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};">
                  Attribution
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
                  ${metaFields.map((field) => renderRow(field)).join("")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background-color:${BRAND.primary};">
                      <a href="mailto:${escapeHtml(payload.workEmail)}" style="display:inline-block;padding:12px 18px;font-size:14px;line-height:1.4;font-weight:700;color:#ffffff;text-decoration:none;">
                        Reply to ${escapeHtml(displayValue(payload.firstName, "lead"))}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:${BRAND.muted};">
            Internal notification from COI Tracker pilot form.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
