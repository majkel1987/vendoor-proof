import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type EyebrowProps = ComponentPropsWithoutRef<"p">;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-primary text-xs font-bold tracking-[0.14em] uppercase",
        className
      )}
      {...props}
    />
  );
}
