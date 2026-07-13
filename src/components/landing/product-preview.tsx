import {
  BellRing,
  CheckCircle2,
  FileCheck2,
  MailCheck,
  ShieldAlert,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  ProductWorkflowPanel,
  type ProductWorkflowStep,
} from "@/components/landing/product-workflow-panel";
import { Container } from "@/components/shared/container";

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

export async function ProductPreview() {
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
      className="border-border bg-surface overflow-hidden border-b py-16 md:py-24"
    >
      <Container className="max-w-[77.5rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-20">
          <div className="max-w-xl lg:sticky lg:top-28">
            <p className="text-primary text-sm font-bold tracking-[0.1em] uppercase">
              {t("eyebrow")}
            </p>
            <h2
              className="text-foreground mt-5 text-4xl leading-[1.06] font-semibold tracking-[-0.025em] text-balance md:text-5xl"
              id="operational-visibility-heading"
            >
              {t("title")}
            </h2>
            <p className="text-foreground-muted mt-6 text-lg leading-8 text-pretty">
              {t("lead")}
            </p>

            <p className="border-primary/20 bg-primary-subtle text-foreground mt-8 rounded-lg border px-5 py-4 text-base leading-7 font-semibold">
              {t("principle")}
            </p>

            <ul className="mt-8 grid gap-5">
              {benefitKeys.map(({ Icon, key }) => (
                <li className="flex gap-4" key={key}>
                  <span className="bg-surface-muted text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
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
          </div>

          <ProductWorkflowPanel
            imageAlt={t("imageAlt")}
            steps={workflowSteps}
            workflowAriaLabel={t("workflowAriaLabel")}
          />
        </div>
      </Container>
    </section>
  );
}
