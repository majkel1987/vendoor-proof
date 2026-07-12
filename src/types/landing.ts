export type CampaignSegment = "property-management" | "contractors";

export type CampaignConfig = {
  segment: CampaignSegment;
  path: string;
  primaryCtaEvent: "pilot_apply_clicked" | "pilot_request_clicked";
  heroVisualMode: "portfolio" | "mobilization";
  leadMagnet: "follow-up-cadence" | "document-checklist";
  formDefaults: {
    companyType: "Property management" | "General contractor";
  };
};

export type LandingPageParams = {
  locale: string;
};
