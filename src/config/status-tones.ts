export const complianceMetricTones = {
  expiringSoon: "attention",
  awaitingReview: "info",
  followUp: "attention",
} as const;

export type ComplianceMetricKey = keyof typeof complianceMetricTones;

export const complianceMetricValueClass = {
  expiringSoon: "text-attention",
  awaitingReview: "text-info",
  followUp: "text-attention",
} as const satisfies Record<ComplianceMetricKey, string>;
