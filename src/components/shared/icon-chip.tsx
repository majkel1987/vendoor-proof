import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type IconChipProps = ComponentPropsWithoutRef<"span"> & {
  icon: ElementType;
};

export function IconChip({ icon: Icon, className, ...props }: IconChipProps) {
  return (
    <span
      className={cn(
        "bg-primary-subtle text-primary inline-flex size-10 items-center justify-center rounded-md",
        className
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
    </span>
  );
}
