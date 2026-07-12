import type { AnalyticsEventName } from "@/config/analytics-events";
import type { CampaignSegment } from "@/types/landing";

import { track } from "@vercel/analytics";

export type AnalyticsContext = {
  locale: string;
  campaign_segment: CampaignSegment;
  page_path: string;
  event_source?: string;
  [key: string]: string | number | boolean | undefined;
};

export function trackEvent(
  eventName: AnalyticsEventName,
  context: AnalyticsContext
) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("coi:analytics", {
        detail: {
          eventName,
          context
        }
      })
    );
  }

  track(eventName, context);
}
