import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { HeroWorkflowPreview } from "@/components/landing/hero-workflow-preview";
import { ScrollRevealDiv } from "@/components/landing/motion-reveal";
import { TrackedAnchor } from "@/components/landing/tracked-anchor";
import { Container } from "@/components/shared/container";
import { analyticsEvents } from "@/config/analytics-events";
import type { CampaignConfig } from "@/types/landing";

type HeroSectionProps = {
  campaign: CampaignConfig;
};

export async function HeroSection({ campaign }: HeroSectionProps) {
  const locale = await getLocale();
  const campaignT = await getTranslations(`campaigns.${campaign.segment}`);
  const trustItems = campaignT("hero.trustLine")
    .split(/\s*(?:·|Â·)\s*/u)
    .filter(Boolean);

  return (
    <section className="hero-surface border-border/70 relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="hero-orb hero-orb-left pointer-events-none absolute rounded-full"
      />
      <div
        aria-hidden="true"
        className="hero-orb hero-orb-right pointer-events-none absolute rounded-full"
      />
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0"
      />

      <Container className="relative z-10 max-w-[84rem] pt-28 pb-14 md:pt-32 md:pb-16 lg:pt-32">
        <div className="mx-auto grid max-w-[84rem] justify-items-center text-center">
          <ScrollRevealDiv className="grid justify-items-center">
            <p className="hero-kicker inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase backdrop-blur-xl">
              {campaignT("hero.eyebrow")}
            </p>

            <h1 className="font-display mt-6 max-w-[68rem] text-[clamp(2.85rem,6.1vw,5.6rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-balance text-white">
              {campaignT("hero.title")}
            </h1>

            <p className="mt-6 max-w-[45rem] text-lg leading-8 text-white/76 md:text-xl md:leading-9">
              {campaignT("hero.lead")}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold tracking-[0.08em] text-white/74 uppercase">
              {trustItems.map((item) => (
                <span
                  className="hero-trust-item inline-flex items-center gap-2"
                  key={item}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="text-primary-subtle size-4"
                  />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <TrackedAnchor
                className="group text-primary hover:bg-primary-subtle h-12 w-full rounded-full bg-white px-7 pr-2 shadow-[0_18px_44px_rgb(0_0_0/0.18)] sm:w-auto"
                eventName={analyticsEvents.heroCtaClicked}
                eventSource="hero_primary"
                href="#pilot-form"
                locale={locale}
                segment={campaign.segment}
              >
                {campaignT("hero.primaryCta")}
                <span
                  aria-hidden="true"
                  className="bg-primary ml-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <ArrowRight className="size-4" />
                </span>
              </TrackedAnchor>

              <TrackedAnchor
                className="hero-secondary-cta h-12 w-full rounded-full px-7 text-white focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-auto"
                eventName={analyticsEvents.navAnchorClicked}
                eventSource="hero_secondary"
                href="#workflow"
                locale={locale}
                segment={campaign.segment}
                variant="ghost"
              >
                <ArrowDown aria-hidden="true" className="size-4 shrink-0" />
                {campaignT("hero.secondaryCta")}
              </TrackedAnchor>
            </div>
          </ScrollRevealDiv>

          <ScrollRevealDiv
            className="relative mt-14 mb-8 w-[min(84rem,calc(100vw-2rem))] justify-self-center opacity-[0.97] md:mt-16 md:mb-10 lg:mt-20"
            delay={0.08}
          >
            <HeroWorkflowPreview />
          </ScrollRevealDiv>

          <ScrollRevealDiv className="mt-14 md:mt-16" delay={0.14}>
            <TrackedAnchor
              className="hero-scroll-cue size-14 rounded-full p-0 text-white"
              eventName={analyticsEvents.navAnchorClicked}
              eventSource="hero_scroll_cue"
              href="#trust"
              locale={locale}
              segment={campaign.segment}
              size="icon"
              variant="ghost"
            >
              <ArrowDown aria-hidden="true" className="size-5" />
              <span className="sr-only">{campaignT("hero.scrollCta")}</span>
            </TrackedAnchor>
          </ScrollRevealDiv>
        </div>
      </Container>
    </section>
  );
}

