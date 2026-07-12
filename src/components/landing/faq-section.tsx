"use client";

import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ScrollRevealDiv } from "@/components/landing/motion-reveal";
import { TrackedAnchor } from "@/components/landing/tracked-anchor";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/shared/container";
import { analyticsEvents } from "@/config/analytics-events";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "@/i18n/navigation";
import type { CampaignSegment } from "@/types/landing";

type FaqSectionProps = {
  segment: CampaignSegment;
};

const faqItems = [
  "emails",
  "approval",
  "vendorAccount",
  "noResponse",
  "otherDocuments",
  "startSmall"
] as const;

export function FaqSection({ segment }: FaqSectionProps) {
  const t = useTranslations("landing.faq");
  const locale = useLocale();
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState("faq-emails");
  const items = faqItems.map((item) => ({
    id: `faq-${item}`,
    trigger: t(`items.${item}.question`),
    content: t(`items.${item}.answer`)
  }));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.trigger,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content
      }
    }))
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="border-border bg-background relative isolate overflow-x-clip border-b py-16 md:py-24"
      id="faq"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_18%_0%,oklch(0.83_0.08_184_/_0.22),transparent_62%)]"
      />

      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-14 xl:gap-20">
          <ScrollRevealDiv className="lg:sticky lg:top-28">
            <div className="border-primary/20 bg-primary-subtle/50 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold">
              <MessageCircleQuestion aria-hidden="true" className="size-4" />
              <span>{t("topicCount", { count: items.length })}</span>
            </div>

            <h2
              className="font-display text-foreground mt-6 max-w-[14ch] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance"
              id="faq-heading"
            >
              {t("title")}
            </h2>

            <p className="text-foreground-muted mt-5 max-w-[34ch] text-lg leading-8 text-pretty">
              {t("lead")}
            </p>

            <div className="border-border bg-surface mt-8 max-w-md rounded-xl border p-5 shadow-card">
              <p className="text-foreground text-sm leading-6 font-semibold">
                {t("contactPrompt")}
              </p>
              <TrackedAnchor
                className="mt-4 w-full sm:w-auto"
                eventName={analyticsEvents.pilotCtaClicked}
                eventSource="faq_sidebar"
                href="#pilot-form"
                locale={locale}
                segment={segment}
                size="default"
              >
                {t("contactLink")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </TrackedAnchor>
            </div>
          </ScrollRevealDiv>

          <div className="min-w-0">
            <Accordion
              items={items}
              onOpenChange={(itemId) => {
                setOpenItem(itemId);
                if (!itemId) {
                  return;
                }

                trackEvent(analyticsEvents.faqOpened, {
                  locale,
                  campaign_segment: segment,
                  page_path: pathname,
                  faq_item: itemId
                });
              }}
              openItem={openItem}
              variant="cards"
            />
          </div>
        </div>
      </Container>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        type="application/ld+json"
      />
    </section>
  );
}
