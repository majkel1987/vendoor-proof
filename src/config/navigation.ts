import type { CampaignSegment } from "@/types/landing";

export type SegmentNavItem = {
  segment: CampaignSegment;
  labelKey: "propertyTeams" | "contractors";
};

export const segmentNavigation: SegmentNavItem[] = [
  {
    segment: "property-management",
    labelKey: "propertyTeams"
  },
  {
    segment: "contractors",
    labelKey: "contractors"
  }
];
