import { ClipboardCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ProblemPhotoPanel } from "@/components/landing/problem-photo-panel";
import { ScrollRevealDiv } from "@/components/landing/motion-reveal";
import { Container } from "@/components/shared/container";

export async function ProblemSection() {
  const t = await getTranslations("landing.problem");

  return (
    <section
      aria-labelledby="problem-heading"
      className="section-shell border-border bg-background relative isolate overflow-x-clip border-b"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_76%_0%,oklch(0.83_0.08_184_/_0.24),transparent_64%)]"
      />

      <Container className="max-w-[var(--container-wide)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-12 lg:gap-y-7 xl:gap-x-16">
          <ScrollRevealDiv className="max-w-[36rem] lg:col-start-1 lg:row-start-1 lg:pt-5">
            <p className="text-primary text-sm leading-6 font-bold tracking-[0.1em] uppercase">
              {t("eyebrow")}
            </p>
            <h2
              className="type-section text-foreground mt-5 max-w-[13ch] font-semibold"
              id="problem-heading"
            >
              {t("title")}
            </h2>
            <p className="type-lead text-foreground-muted mt-7 max-w-[35rem]">
              {t("lead")}
            </p>
          </ScrollRevealDiv>

          <ScrollRevealDiv className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <ProblemPhotoPanel
              alt={t("photo.alt")}
              documentChecked={t("photo.documentChecked")}
              monitoringActive={t("photo.monitoringActive")}
              nextCheck={t("photo.nextCheck")}
            />
          </ScrollRevealDiv>

          <ScrollRevealDiv className="border-primary/18 bg-surface flex max-w-[36rem] items-start gap-3 rounded-lg border p-4 lg:col-start-1 lg:row-start-2">
            <ClipboardCheck
              aria-hidden="true"
              className="text-primary mt-0.5 size-5 shrink-0"
            />
            <p className="text-foreground text-sm leading-6 font-semibold">
              {t("microcopy")}
            </p>
          </ScrollRevealDiv>
        </div>
      </Container>
    </section>
  );
}
