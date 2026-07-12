"use client";

import { useLocale, useTranslations } from "next-intl";

import { analyticsEvents } from "@/config/analytics-events";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { CampaignSegment } from "@/types/landing";

type LanguageSwitcherProps = {
  segment: CampaignSegment;
  compact?: boolean;
};

export function LanguageSwitcher({
  segment,
  compact = false,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("header.language");

  return (
    <div
      aria-label={t("label")}
      className={cn(
        "border-primary/12 bg-surface/[0.58] inline-flex rounded-lg border p-1",
        compact && "bg-surface/[0.72]",
      )}
      role="group"
    >
      {routing.locales.map((targetLocale) => {
        const isActive = targetLocale === locale;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "focus-ring min-w-9 rounded-md px-2.5 py-1.5 text-center text-sm font-semibold transition-[background-color,color,transform] duration-200 hover:-translate-y-px",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
            )}
            href={pathname}
            key={targetLocale}
            locale={targetLocale}
            onClick={() => {
              if (targetLocale === locale) {
                return;
              }

              trackEvent(analyticsEvents.languageChanged, {
                locale,
                campaign_segment: segment,
                page_path: pathname,
                target_locale: targetLocale,
              });
            }}
          >
            {t(targetLocale)}
          </Link>
        );
      })}
    </div>
  );
}
