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
    icon: string;
    ring: string;
  }
> = {
  primary: {
    icon: "text-primary",
    ring: "border-primary/25 group-hover:border-primary/50",
  },
  info: {
    icon: "text-info",
    ring: "border-info/25 group-hover:border-info/50",
  },
  attention: {
    icon: "text-[oklch(0.52_0.12_77)]",
    ring: "border-attention/30 group-hover:border-attention/60",
  },
  danger: {
    icon: "text-danger",
    ring: "border-danger/25 group-hover:border-danger/50",
  },
};

export function ProductWorkflowPanel({
  imageAlt,
  steps,
  workflowAriaLabel,
}: ProductWorkflowPanelProps) {
  return (
    <figure className="relative min-w-0">
      <div className="border-border bg-surface-muted shadow-elevated relative overflow-hidden rounded-[1.75rem] border p-3 sm:p-4">
        <div className="bg-background relative overflow-hidden rounded-[1.15rem]">
          <Image
            alt={imageAlt}
            className="h-auto w-full"
            height={1366}
            loading="lazy"
            sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
            src="/illustrations/vendor-document-workflow.webp"
            width={2048}
          />
        </div>
      </div>

      <figcaption className="mt-6">
        <ol
          aria-label={workflowAriaLabel}
          className="sm:before:bg-border relative grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-3 sm:before:absolute sm:before:top-5 sm:before:right-[12.5%] sm:before:left-[12.5%] sm:before:h-px"
        >
          {steps.map((step) => (
            <li
              className={cn(
                "group relative grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-2.5 sm:grid-cols-1 sm:justify-items-center sm:gap-2 sm:text-center",
              )}
              key={step.key}
            >
              <span
                className={cn(
                  "bg-surface relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border transition-[border-color,transform] duration-200 group-hover:-translate-y-0.5",
                  toneStyles[step.tone].icon,
                  toneStyles[step.tone].ring,
                )}
              >
                <step.Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 pt-0.5 sm:pt-0">
                <p className="text-foreground text-xs leading-5 font-bold sm:text-sm">
                  <span className="text-foreground-muted mr-1 tabular-nums">
                    {step.number}
                  </span>
                  {step.label}
                </p>
                <p className="text-foreground-muted mt-0.5 text-xs leading-5">
                  {step.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
