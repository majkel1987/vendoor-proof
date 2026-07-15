import {
  BellRing,
  CalendarSearch,
  CloudUpload,
  MailCheck,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const workflowSteps = [
  { key: "detect", icon: CalendarSearch },
  { key: "request", icon: MailCheck },
  { key: "followUp", icon: BellRing },
  { key: "upload", icon: CloudUpload },
  { key: "review", icon: UserCheck },
  { key: "escalation", icon: ShieldAlert },
] as const;

export async function ProcessSection() {
  const workflowT = await getTranslations("landing.workflow");

  return (
    <section
      aria-labelledby="workflow-heading"
      className="section-shell border-border bg-surface scroll-mt-28 border-b"
      id="workflow"
    >
      <Container>
        <SectionHeading
          eyebrow={
            <p className="text-primary text-sm font-bold tracking-[0.14em] uppercase">
              {workflowT("eyebrow")}
            </p>
          }
          lead={workflowT("lead")}
          title={<span id="workflow-heading">{workflowT("title")}</span>}
        />

        <figure className="mt-10">
          <div className="border-primary/20 bg-background hidden overflow-hidden rounded-xl border shadow-[0_18px_50px_-28px_rgba(8,97,92,0.42)] ring-1 ring-white/80 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_26px_64px_-30px_rgba(8,97,92,0.5)] motion-reduce:transform-none motion-reduce:transition-none lg:-mx-10 lg:block xl:-mx-20">
            <Image
              alt={workflowT("diagramAlt")}
              className="h-auto w-full"
              height={914}
              sizes="(min-width: 1280px) 1216px, 100vw"
              src="/illustrations/Image 11 lip 2026, 19_52_37.png"
              unoptimized
              width={1716}
            />
          </div>

          <ol
            aria-label={workflowT("diagramAriaLabel")}
            className="grid gap-4 md:grid-cols-3 lg:sr-only"
          >
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  className="border-border bg-background relative rounded-xl border p-5 pl-16 md:pl-5"
                  key={step.key}
                >
                  <span className="bg-primary-subtle text-primary absolute top-5 left-5 flex size-9 items-center justify-center rounded-lg md:static md:mb-5">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <p className="text-primary text-xs font-bold tracking-[0.08em]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-foreground mt-1 text-lg font-semibold">
                    {workflowT(`steps.${step.key}.label`)}
                  </h3>
                  <p className="text-foreground-muted mt-2 text-sm leading-6">
                    {workflowT(`steps.${step.key}.summary`)}
                  </p>
                </li>
              );
            })}
          </ol>

          <figcaption className="text-primary mt-5 flex items-center justify-center gap-2 text-sm font-semibold">
            <RefreshCcw aria-hidden="true" className="size-4" />
            {workflowT("continuousMonitoring")}
          </figcaption>
        </figure>

        <div className="border-primary/20 bg-primary-subtle/65 mt-8 rounded-lg border px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="border-primary/20 bg-surface text-primary flex size-10 shrink-0 items-center justify-center rounded-md border">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <p className="text-foreground text-sm leading-6 font-semibold">
              {workflowT("controlNote")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
