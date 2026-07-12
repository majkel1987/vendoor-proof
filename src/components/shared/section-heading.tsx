import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow}
      <h2 className="mt-4 text-3xl leading-[1.08] font-semibold tracking-[-0.01em] text-foreground md:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-5 max-w-[62ch] text-lg leading-8 text-foreground-muted">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
