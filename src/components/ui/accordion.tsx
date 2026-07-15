"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AccordionItem = {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  openItem: string;
  onOpenChange: (itemId: string) => void;
  allowCollapse?: boolean;
  variant?: "stacked" | "cards";
};

const panelTransition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function Accordion({
  items,
  openItem,
  onOpenChange,
  allowCollapse = true,
  variant = "cards",
}: AccordionProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (itemId: string) => {
    if (allowCollapse && itemId === openItem) {
      onOpenChange("");
      return;
    }

    onOpenChange(itemId);
  };

  return (
    <div
      className={cn(
        variant === "cards"
          ? "flex flex-col gap-3"
          : "divide-border border-border bg-surface shadow-card divide-y rounded-lg border",
      )}
    >
      {items.map((item) => {
        const isOpen = item.id === openItem;
        const panelId = `${item.id}-panel`;
        const buttonId = `${item.id}-trigger`;

        return (
          <div
            className={cn(
              variant === "cards" &&
                "bg-surface shadow-card overflow-hidden rounded-xl border transition-[border-color,background-color,box-shadow] duration-200",
              variant === "cards" && isOpen
                ? "border-primary/35 bg-primary-subtle/35 shadow-[0_14px_40px_oklch(0.46_0.095_184_/_0.08)]"
                : variant === "cards"
                  ? "border-border hover:border-primary/20 hover:bg-surface-muted/40"
                  : undefined,
            )}
            key={item.id}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className={cn(
                  "group focus-ring flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-5 text-left transition-colors duration-200",
                  variant === "stacked" && "rounded-none",
                )}
                id={buttonId}
                onClick={() => handleToggle(item.id)}
                type="button"
              >
                <span className="text-base leading-6 font-semibold md:text-[1.05rem] md:leading-7">
                  {item.trigger}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-200",
                    isOpen
                      ? "border-primary/25 bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground-muted group-hover:border-primary/20",
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isOpen ? "rotate-180" : undefined,
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <m.div
                  animate={{ opacity: 1, height: "auto" }}
                  aria-labelledby={buttonId}
                  exit={{ opacity: 0, height: 0 }}
                  id={panelId}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, height: 0 }
                  }
                  role="region"
                  transition={panelTransition}
                >
                  <div className="border-primary/15 text-foreground-muted mx-5 mb-5 border-t pt-4 text-base leading-7">
                    {item.content}
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
