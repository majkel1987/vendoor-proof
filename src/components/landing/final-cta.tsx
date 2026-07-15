import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ScrollRevealDiv } from "@/components/landing/motion-reveal";
import { TrackedAnchor } from "@/components/landing/tracked-anchor";
import { Container } from "@/components/shared/container";
import { analyticsEvents } from "@/config/analytics-events";
import type { CampaignConfig } from "@/types/landing";

type FinalCtaProps = {
  campaign: CampaignConfig;
};

export async function FinalCta({ campaign }: FinalCtaProps) {
  const locale = await getLocale();
  const t = await getTranslations("landing.finalCta");

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="section-shell bg-foreground text-background"
    >
      <Container>
        <ScrollRevealDiv className="max-w-[58rem]">
          <h2
            className="type-section-compact font-semibold"
            id="final-cta-heading"
          >
            {t("title")}
          </h2>
          <p className="text-background/78 mt-5 max-w-[62ch] text-base leading-7 md:text-lg md:leading-8">
            {t("copy")}
          </p>
          <TrackedAnchor
            className="bg-background text-foreground hover:bg-background/90 mt-8"
            eventName={analyticsEvents.pilotCtaClicked}
            eventSource="final_cta"
            href="#pilot-form"
            locale={locale}
            segment={campaign.segment}
          >
            {t("primary")}
            <ArrowRight aria-hidden="true" />
          </TrackedAnchor>
        </ScrollRevealDiv>
      </Container>
    </section>
  );
}
