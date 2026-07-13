import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type WorkflowStepTone = "primary" | "info" | "attention" | "danger";

export type ProductWorkflowStep = {
  key: string;
  number: string;
  label: string;
  copy: string;
  tone: WorkflowStepTone;
  Icon: LucideIcon;
};

type ProductWorkflowPanelProps = {
  imageAlt: string;
  workflowAriaLabel: string;
  steps: ProductWorkflowStep[];
};

const toneStyles: Record<
  WorkflowStepTone,
  {
    badge: string;
    border: string;
    icon: string;
  }
> = {
  primary: {
    badge:
      "border-primary/25 bg-surface/95 text-primary shadow-[0_10px_28px_rgb(15_83_79/0.14)]",
    border: "border-primary/55",
    icon: "text-primary",
  },
  info: {
    badge:
      "border-info/25 bg-surface/95 text-info shadow-[0_10px_28px_rgb(37_99_235/0.12)]",
    border: "border-info/55",
    icon: "text-info",
  },
  attention: {
    badge:
      "border-attention/30 bg-surface/95 text-[oklch(0.52_0.12_77)] shadow-[0_10px_28px_rgb(180_120_20/0.12)]",
    border: "border-attention/55",
    icon: "text-[oklch(0.52_0.12_77)]",
  },
  danger: {
    badge:
      "border-danger/25 bg-surface/95 text-danger shadow-[0_10px_28px_rgb(185_60_40/0.14)]",
    border: "border-danger/55",
    icon: "text-danger",
  },
};

const overlayAlignment = [
  "items-start justify-start",
  "items-start justify-end",
  "items-end justify-start",
  "items-end justify-end",
] as const;

export function ProductWorkflowPanel({
  imageAlt,
  steps,
  workflowAriaLabel,
}: ProductWorkflowPanelProps) {
  return (
    <figure className="relative min-w-0">
      <div className="border-border bg-surface-muted shadow-elevated relative overflow-hidden rounded-2xl border p-2 sm:p-3">
        <div className="bg-background relative overflow-hidden rounded-xl">
          <Image
            alt={imageAlt}
            className="h-auto w-full"
            height={1366}
            loading="lazy"
            sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
            src="/illustrations/vendor-document-workflow.webp"
            width={2048}
          />

          <ol
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden grid-cols-2 grid-rows-2 gap-1 p-2 sm:grid sm:p-3 md:p-4"
          >
            {steps.map((step, index) => (
              <li
                className={cn("flex p-1 sm:p-2", overlayAlignment[index])}
                key={step.key}
              >
                <span
                  className={cn(
                    "inline-flex max-w-[min(100%,11.5rem)] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left backdrop-blur-sm sm:max-w-[min(100%,13rem)] sm:px-3 sm:py-2",
                    toneStyles[step.tone].badge,
                  )}
                >
                  <step.Icon
                    aria-hidden="true"
                    className={cn("size-3.5 shrink-0 sm:size-4", toneStyles[step.tone].icon)}
                  />
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[0.625rem] font-bold tracking-[0.08em] uppercase opacity-80 sm:text-[0.6875rem]">
                      {step.number}
                    </span>
                    <span className="text-foreground block text-[0.6875rem] font-bold sm:text-xs">
                      {step.label}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="mt-5">
        <ol
          aria-label={workflowAriaLabel}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <li
              className={cn(
                "border-border bg-surface rounded-xl border p-4",
                "border-t-[3px]",
                toneStyles[step.tone].border,
              )}
              key={step.key}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-lg",
                    toneStyles[step.tone].icon,
                  )}
                >
                  <step.Icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-bold tracking-[0.02em]">
                    <span className="text-foreground-muted mr-1.5">
                      {step.number}
                    </span>
                    {step.label}
                  </p>
                  <p className="text-foreground-muted mt-1.5 text-sm leading-6">
                    {step.copy}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
