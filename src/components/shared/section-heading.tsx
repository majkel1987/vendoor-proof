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
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow}
      <h2 className="type-section-compact text-foreground mt-4 font-semibold">
        {title}
      </h2>
      {lead ? (
        <p className="type-lead text-foreground-muted mt-5">{lead}</p>
      ) : null}
    </div>
  );
}
