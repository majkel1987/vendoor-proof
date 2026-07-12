import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex min-h-8 items-center gap-2 rounded-md border px-3 py-1 text-sm font-semibold",
  {
    variants: {
      variant: {
        neutral:
          "border-border bg-surface-muted text-foreground-muted",
        success:
          "border-success/25 bg-success-subtle text-foreground",
        attention:
          "border-attention/35 bg-attention/10 text-foreground",
        danger:
          "border-danger/25 bg-danger/10 text-foreground",
        info: "border-info/25 bg-info/10 text-foreground"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
);

type StatusBadgeProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof statusBadgeVariants>;

export function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant, className }))}
      {...props}
    />
  );
}
