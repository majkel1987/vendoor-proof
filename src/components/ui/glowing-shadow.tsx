import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type GlowingShadowProps = {
  children: ReactNode;
  className?: string;
};

export function GlowingShadow({ children, className }: GlowingShadowProps) {
  return (
    <div
      className={cn(
        "glowing-shadow group/glow relative isolate h-full rounded-xl transition-transform duration-[350ms] ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
