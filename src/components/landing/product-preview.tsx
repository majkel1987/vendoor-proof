import {
  BellRing,
  CheckCircle2,
  FileCheck2,
  MailCheck,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const benefitKeys = [
  { key: "automation", Icon: BellRing },
  { key: "uploads", Icon: FileCheck2 },
  { key: "exceptions", Icon: ShieldAlert },
] as const;

const workflowStepKeys = [
  { key: "request", Icon: MailCheck },
  { key: "collect", Icon: FileCheck2 },
  { key: "verify", Icon: CheckCircle2 },
  { key: "escalate", Icon: ShieldAlert },
] as const;

export async function ProductPreview() {
  const t = await getTranslations("landing.productPreview");

  return (
    <section
      aria-labelledby="operational-visibility-heading"
      className="border-border bg-surface overflow-hidden border-b py-16 md:py-24"
    >
      <Container className="max-w-[77.5rem]">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:items-center lg:gap-20 xl:gap-24">
          <div className="max-w-xl">
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

            <p className="border-primary bg-primary-subtle text-foreground mt-8 border-l-4 px-5 py-4 text-base leading-7 font-semibold">
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

          <figure className="relative min-w-0">
            <div
              aria-hidden="true"
              className="bg-primary-subtle absolute -top-7 -right-8 size-40 rounded-full blur-3xl"
            />
            <div
              aria-hidden="true"
              className="bg-info-subtle absolute -bottom-8 -left-7 size-36 rounded-full blur-3xl"
            />

            <div className="border-border bg-surface-muted shadow-elevated relative overflow-hidden rounded-2xl border p-2 sm:p-3">
              <Image
                alt={t("imageAlt")}
                className="aspect-[3/2] w-full rounded-xl object-cover"
                height={1366}
                loading="lazy"
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
                src="/illustrations/vendor-document-workflow.webp"
                width={2048}
              />
            </div>

            <figcaption>
              <ol
                aria-label={t("workflowAriaLabel")}
                className="relative mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-3"
              >
                {workflowStepKeys.map(({ Icon, key }, index) => (
                  <li
                    className={cn(
                      "relative border-t-2 pt-3",
                      index === workflowStepKeys.length - 1
                        ? "border-danger/55"
                        : "border-primary/45",
                    )}
                    key={key}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0",
                          index === workflowStepKeys.length - 1
                            ? "text-danger"
                            : "text-primary",
                        )}
                      />
                      <p className="text-foreground text-xs font-bold tracking-[0.06em]">
                        <span className="text-foreground-muted mr-1">
                          {t(`steps.${key}.number`)}
                        </span>
                        {t(`steps.${key}.label`)}
                      </p>
                    </div>
                    <p className="text-foreground-muted mt-1.5 text-xs leading-5">
                      {t(`steps.${key}.copy`)}
                    </p>
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
