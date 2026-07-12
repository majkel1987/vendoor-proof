"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ariaLabel?: string;
  title: ReactNode;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function Sheet({
  open,
  onOpenChange,
  ariaLabel,
  title,
  closeLabel,
  children,
  footer,
}: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const panel = panelRef.current;
      const firstFocusable =
        panel?.querySelector<HTMLElement>(focusableSelector);
      (firstFocusable ?? panel)?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      const focusable = Array.from(
        panel?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label={closeLabel}
        className="bg-foreground/24 absolute inset-0 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <div
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-modal="true"
        className={cn(
          "border-border bg-surface shadow-elevated fixed inset-y-0 right-0 flex w-full max-w-[24rem] flex-col border-l",
          "focus-ring p-5",
        )}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="border-border flex items-center justify-between gap-4 border-b pb-4">
          <h2 className="text-foreground text-base font-semibold" id={titleId}>
            {title}
          </h2>
          <Button
            aria-label={closeLabel}
            onClick={() => onOpenChange(false)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-6">{children}</div>
        {footer ? (
          <div className="border-border border-t pt-5">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
