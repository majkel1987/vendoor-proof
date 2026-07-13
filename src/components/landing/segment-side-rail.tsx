"use client";

import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { analyticsEvents } from "@/config/analytics-events";
import { campaigns } from "@/config/landing-campaigns";
import { segmentNavigation } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { CampaignSegment } from "@/types/landing";

type SegmentSideRailProps = {
  locale: Locale;
  pathname: string;
  segment: CampaignSegment;
};

export function SegmentSideRail({
  locale,
  pathname,
  segment,
}: SegmentSideRailProps) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const t = useTranslations("header.segment");

  const activeItem =
    segmentNavigation.find((item) => item.segment === segment) ??
    segmentNavigation[0];

  useEffect(() => {
    if (!open && !revealed) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setRevealed(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setRevealed(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, revealed]);

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
    <div
      className="group/rail fixed top-1/2 left-0 z-50 flex -translate-y-1/2 items-stretch"
      ref={containerRef}
    >
      <button
        aria-label={t("label")}
        className="bg-foreground focus-ring h-16 w-2.5 shrink-0 rounded-r-full shadow-[4px_0_16px_-6px_rgb(9_33_29/0.35)]"
        onClick={() => setRevealed(true)}
        type="button"
      />

      <div
        className={cn(
          "overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "max-w-0 opacity-0",
          "group-hover/rail:max-w-[14rem] group-hover/rail:opacity-100",
          "group-focus-within/rail:max-w-[14rem] group-focus-within/rail:opacity-100",
          (revealed || open) && "max-w-[14rem] opacity-100",
        )}
      >
        <div className="border-primary/15 relative rounded-r-xl border border-l-0 bg-white/[0.92] p-1.5 shadow-[8px_16px_40px_-20px_rgb(7_44_39/0.45)] backdrop-blur-xl">
          <button
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={`${t("label")}: ${t(activeItem.labelKey)}`}
            className="focus-ring bg-foreground text-background inline-flex min-w-[9.5rem] cursor-pointer items-center justify-between gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-[background-color,transform] duration-200 hover:-translate-y-px"
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

          {open ? (
            <ul
              aria-label={t("label")}
              className="border-border/70 ring-border/[0.55] absolute top-0 left-[calc(100%+0.5rem)] z-50 min-w-[12.5rem] overflow-hidden rounded-[1.15rem] border bg-white p-1.5 shadow-[0_18px_50px_rgb(15_23_42/0.12)] ring-1"
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
                        setRevealed(false);

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
      </div>
    </div>
  );
}
