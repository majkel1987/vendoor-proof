import {
  ArrowDown,
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileCheck2,
  MailCheck,
  ShieldAlert,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ScrollRevealDiv } from "@/components/landing/motion-reveal";
import {
  ProductWorkflowPanel,
  type ProductWorkflowStep,
} from "@/components/landing/product-workflow-panel";
import { TrackedAnchor } from "@/components/landing/tracked-anchor";
import { Container } from "@/components/shared/container";
import { analyticsEvents } from "@/config/analytics-events";
import type { CampaignSegment } from "@/types/landing";

const benefitKeys = [
  { key: "automation", Icon: BellRing },
  { key: "uploads", Icon: FileCheck2 },
  { key: "exceptions", Icon: ShieldAlert },
] as const;

const workflowStepKeys = [
  { key: "request", Icon: MailCheck, tone: "primary" },
  { key: "collect", Icon: FileCheck2, tone: "info" },
  { key: "verify", Icon: CheckCircle2, tone: "attention" },
  { key: "escalate", Icon: ShieldAlert, tone: "danger" },
] as const satisfies ReadonlyArray<{
  key: "request" | "collect" | "verify" | "escalate";
  Icon: typeof MailCheck;
  tone: ProductWorkflowStep["tone"];
}>;

type ProductPreviewProps = {
  segment: CampaignSegment;
};

export async function ProductPreview({ segment }: ProductPreviewProps) {
  const locale = await getLocale();
  const t = await getTranslations("landing.productPreview");

  const workflowSteps: ProductWorkflowStep[] = workflowStepKeys.map(
    ({ Icon, key, tone }) => ({
      Icon,
      copy: t(`steps.${key}.copy`),
      key,
      label: t(`steps.${key}.label`),
      number: t(`steps.${key}.number`),
      tone,
    }),
  );

  return (
    <section
      aria-labelledby="operational-visibility-heading"
      className="border-border bg-surface overflow-hidden border-b py-16 md:py-20 lg:py-24"
    >
      <Container className="max-w-[77.5rem]">
        <div className="grid gap-y-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] lg:items-center lg:gap-14 xl:gap-20">
          <div className="contents lg:block lg:max-w-[30rem]">
            <ScrollRevealDiv className="order-1">
              <p className="text-primary text-sm font-bold tracking-[0.1em] uppercase">
                {t("eyebrow")}
              </p>
              <h2
                className="text-foreground mt-4 text-[clamp(2.35rem,4vw,3.35rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance"
                id="operational-visibility-heading"
              >
                {t("title")}
              </h2>
              <p className="text-foreground-muted mt-5 max-w-[34rem] text-lg leading-8 text-pretty">
                {t("lead")}
              </p>
            </ScrollRevealDiv>

            <ScrollRevealDiv className="order-4 lg:mt-7" delay={0.05}>
              <ul className="grid gap-4">
                {benefitKeys.map(({ Icon, key }) => (
                  <li className="flex gap-4" key={key}>
                    <span className="bg-surface-muted text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-transparent">
                      <Icon aria-hidden="true" className="size-[1.125rem]" />
                    </span>
                    <div>
                      <h3 className="text-foreground text-sm font-bold">
                        {t(`benefits.${key}.title`)}
                      </h3>
                      <p className="text-foreground-muted mt-1 text-sm leading-6">
                        {t(`benefits.${key}.copy`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollRevealDiv>

            <ScrollRevealDiv className="order-5 lg:mt-7" delay={0.08}>
              <p className="border-primary/20 bg-primary-subtle/70 text-foreground rounded-lg border px-4 py-3 text-sm leading-6 font-semibold">
                {t("principle")}
              </p>
            </ScrollRevealDiv>

            <ScrollRevealDiv
              className="order-2 flex flex-col gap-3 sm:flex-row lg:mt-7 lg:flex-col xl:flex-row"
              delay={0.11}
            >
              <TrackedAnchor
                className="group w-full sm:w-auto"
                eventName={analyticsEvents.workflowCtaClicked}
                eventSource="product_preview_primary"
                href="#pilot-form"
                locale={locale}
                segment={segment}
              >
                {t("primaryCta")}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </TrackedAnchor>
              <TrackedAnchor
                className="w-full sm:w-auto"
                eventName={analyticsEvents.workflowCtaClicked}
                eventSource="product_preview_secondary"
                href="#workflow"
                locale={locale}
                segment={segment}
                variant="secondary"
              >
                <ArrowDown aria-hidden="true" />
                {t("secondaryCta")}
              </TrackedAnchor>
            </ScrollRevealDiv>
          </div>

          <ScrollRevealDiv
            className="order-3 min-w-0 lg:order-none"
            delay={0.08}
          >
            <ProductWorkflowPanel
              imageAlt={t("imageAlt")}
              steps={workflowSteps}
              workflowAriaLabel={t("workflowAriaLabel")}
            />
          </ScrollRevealDiv>
        </div>
      </Container>
    </section>
  );
}
