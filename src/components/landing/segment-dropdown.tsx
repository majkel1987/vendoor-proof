"use client";

import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { analyticsEvents } from "@/config/analytics-events";
import { campaigns } from "@/config/landing-campaigns";
import { segmentNavigation } from "@/config/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CampaignSegment } from "@/types/landing";

type SegmentDropdownProps = {
  compact?: boolean;
  fullWidth?: boolean;
  locale: Locale;
  pathname: string;
  segment: CampaignSegment;
};

export function SegmentDropdown({
  compact = false,
  fullWidth = false,
  locale,
  pathname,
  segment,
}: SegmentDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const t = useTranslations("header.segment");

  const activeItem =
    segmentNavigation.find((item) => item.segment === segment) ??
    segmentNavigation[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen((previous) => !previous);
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
      return;
    }

    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={cn("relative", fullWidth && "w-full")} ref={containerRef}>
      <div
        className={cn(
          "border-primary/12 bg-surface/[0.58] inline-flex rounded-lg border p-1",
          compact && "bg-surface/[0.72]",
          fullWidth && "w-full",
        )}
      >
        <button
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`${t("label")}: ${t(activeItem.labelKey)}`}
          className={cn(
            "focus-ring bg-foreground text-background inline-flex min-w-[8.5rem] cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-[background-color,transform] duration-200 hover:-translate-y-px",
            fullWidth && "w-full",
          )}
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
          type="button"
        >
          <span className="truncate">{t(activeItem.labelKey)}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      {open ? (
        <ul
          aria-label={t("label")}
          className={cn(
            "border-border/70 ring-border/[0.55] absolute top-[calc(100%+0.45rem)] z-50 overflow-hidden rounded-[1.15rem] border bg-white p-1.5 shadow-[0_18px_50px_rgb(15_23_42/0.12)] ring-1",
            fullWidth ? "inset-x-0 w-full" : "right-0 min-w-[12.5rem]",
          )}
          id={listboxId}
          role="listbox"
        >
          {segmentNavigation.map((item) => {
            const isActive = item.segment === segment;

            return (
              <li key={item.segment} role="presentation">
                <Link
                  aria-selected={isActive}
                  className={cn(
                    "focus-ring flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[0.85rem] px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200",
                    isActive
                      ? "bg-primary-subtle text-foreground"
                      : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
                  )}
                  href={campaigns[item.segment].path}
                  onClick={() => {
                    setOpen(false);

                    if (isActive) {
                      return;
                    }

                    trackEvent(analyticsEvents.campaignSegmentChanged, {
                      locale,
                      campaign_segment: segment,
                      page_path: pathname,
                      target_campaign_segment: item.segment,
                    });
                  }}
                  role="option"
                >
                  <span>{t(item.labelKey)}</span>
                  {isActive ? (
                    <Check
                      aria-hidden="true"
                      className="text-primary size-4 shrink-0"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
