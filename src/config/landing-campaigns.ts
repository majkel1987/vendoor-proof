import type { CampaignConfig, CampaignSegment } from "@/types/landing";

export const campaigns: Record<CampaignSegment, CampaignConfig> = {
  "property-management": {
    segment: "property-management",
    path: "/property-management",
    primaryCtaEvent: "pilot_apply_clicked",
    heroVisualMode: "portfolio",
    leadMagnet: "follow-up-cadence",
    formDefaults: {
      companyType: "Property management"
    }
  },
  contractors: {
    segment: "contractors",
    path: "/contractors",
    primaryCtaEvent: "pilot_request_clicked",
    heroVisualMode: "mobilization",
    leadMagnet: "document-checklist",
    formDefaults: {
      companyType: "General contractor"
    }
  }
};

export const campaignSegments = Object.keys(campaigns) as CampaignSegment[];

export function getCampaign(segment: CampaignSegment) {
  return campaigns[segment];
}
