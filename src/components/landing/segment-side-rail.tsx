"use client";

import { Check, ChevronDown, ChevronLeft } from "lucide-react";
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

  const isExpanded = revealed || open;

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
    setRevealed(true);
    setOpen((previous) => !previous);
  };

  const handleTabClick = () => {
    setRevealed(true);
    setOpen(true);
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
      setRevealed(true);
      setOpen(true);
    }
  };

  return (
    <div
      className="group/rail fixed top-3 right-0 z-50 h-16 w-10"
      ref={containerRef}
    >
      <div className="relative flex h-full items-center justify-end">
        <div
          className={cn(
            "absolute top-1/2 right-2.5 -translate-y-1/2 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            "pointer-events-none translate-x-3 opacity-0",
            "group-hover/rail:pointer-events-auto group-hover/rail:translate-x-0 group-hover/rail:opacity-100",
            "group-focus-within/rail:pointer-events-auto group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100",
            isExpanded &&
              "pointer-events-auto translate-x-0 opacity-100",
          )}
        >
          <div className="border-primary/15 relative rounded-l-xl border border-r-0 bg-white/[0.92] p-1.5 shadow-[-8px_16px_40px_-20px_rgb(7_44_39/0.45)] backdrop-blur-xl">
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
                className="border-border/70 ring-border/[0.55] absolute top-[calc(100%+0.45rem)] right-0 z-50 min-w-[12.5rem] overflow-hidden rounded-[1.15rem] border bg-white p-1.5 shadow-[0_18px_50px_rgb(15_23_42/0.12)] ring-1"
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

        {!isExpanded ? (
          <ChevronLeft
            aria-hidden="true"
            className="text-background/75 pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 animate-[segment-hint_2.4s_ease-in-out_infinite] motion-reduce:animate-none"
          />
        ) : null}

        <button
          aria-label={t("label")}
          className="bg-foreground focus-ring relative z-10 h-16 w-2.5 shrink-0 rounded-l-full shadow-[-4px_0_16px_-6px_rgb(9_33_29/0.35)]"
          onClick={handleTabClick}
          type="button"
        />
      </div>
    </div>
  );
}
