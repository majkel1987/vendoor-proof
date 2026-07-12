"use client";

import { ArrowRight, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { SegmentDropdown } from "@/components/landing/segment-dropdown";
import {
  TrackedAnchor,
  trackNavAnchor,
} from "@/components/landing/tracked-anchor";
import { Container } from "@/components/shared/container";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { analyticsEvents } from "@/config/analytics-events";
import { campaigns } from "@/config/landing-campaigns";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CampaignSegment } from "@/types/landing";

type SiteHeaderProps = {
  segment: CampaignSegment;
};

const navItems = [
  { href: "#workflow", key: "howItWorks" },
  { href: "#automation-highlights", key: "whatItAutomates" },
  { href: "#pilot-form", key: "pilot" },
  { href: "#faq", key: "faq" },
] as const;

export function SiteHeader({ segment }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("header");

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-3">
      <Container className="max-w-[96rem]">
        <div className="border-primary/15 flex h-16 items-center justify-between gap-4 rounded-xl border bg-white/[0.86] px-3.5 shadow-[0_12px_36px_-24px_rgb(7_44_39/0.38)] backdrop-blur-xl md:px-4">
          <LogoLink brand={t("brand")} segment={segment} />

          <nav
            aria-label={t("primaryNavLabel")}
            className="hidden items-center gap-0.5 xl:flex"
          >
            {navItems.map((item) => (
              <a
                className="focus-ring text-foreground-muted hover:bg-primary-subtle/70 hover:text-foreground rounded-lg px-3 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-200 hover:-translate-y-px"
                href={item.href}
                key={item.key}
                onClick={(event) => {
                  event.preventDefault();
                  trackNavAnchor(item.href, locale, segment, pathname);
                }}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <SegmentDropdown
              locale={locale}
              pathname={pathname}
              segment={segment}
            />
            <LanguageSwitcher segment={segment} />
            <TrackedAnchor
              className="group bg-foreground text-background hover:bg-primary h-10 rounded-full px-4 pr-1.5 shadow-[0_10px_24px_-14px_rgb(9_33_29/0.55)] transition-[background-color,transform] duration-200 hover:-translate-y-px"
              eventName={analyticsEvents.headerCtaClicked}
              eventSource="header"
              href="#pilot-form"
              locale={locale}
              segment={segment}
              size="default"
            >
              {t("primaryCta")}
              <span
                aria-hidden="true"
                className="text-background ml-1 inline-flex size-7 items-center justify-center rounded-full bg-white/[0.12] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <ArrowRight className="size-4" />
              </span>
            </TrackedAnchor>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <LanguageSwitcher compact segment={segment} />
            <Button
              aria-label={t("mobile.open")}
              className="border-primary/15 bg-surface/[0.72] text-foreground hover:bg-primary-subtle size-10 rounded-lg shadow-none"
              onClick={() => setMenuOpen(true)}
              size="icon"
              type="button"
              variant="secondary"
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Container>

      <Sheet
        ariaLabel={t("mobile.title")}
        closeLabel={t("mobile.close")}
        onOpenChange={setMenuOpen}
        open={menuOpen}
        title={<BrandLogo ariaLabel={t("brand")} size="sm" />}
        footer={
          <TrackedAnchor
            className="w-full"
            eventName={analyticsEvents.headerCtaClicked}
            eventSource="mobile_header"
            href="#pilot-form"
            locale={locale}
            onTrackedClick={() => setMenuOpen(false)}
            segment={segment}
            size="lg"
          >
            {t("primaryCta")}
          </TrackedAnchor>
        }
      >
        <nav aria-label={t("primaryNavLabel")} className="grid gap-2">
          {navItems.map((item) => (
            <a
              className="focus-ring text-foreground hover:bg-surface-muted rounded-md px-3 py-3 text-base font-semibold transition-colors"
              href={item.href}
              key={item.key}
              onClick={(event) => {
                event.preventDefault();
                trackNavAnchor(item.href, locale, segment, pathname, () =>
                  setMenuOpen(false),
                );
              }}
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="mt-8 grid gap-4">
          <p className="text-foreground-muted text-sm font-semibold">
            {t("segment.label")}
          </p>
          <SegmentDropdown
            compact
            fullWidth
            locale={locale}
            pathname={pathname}
            segment={segment}
          />
        </div>

        <div className="mt-8 grid gap-4">
          <p className="text-foreground-muted text-sm font-semibold">
            {t("language.label")}
          </p>
          <LanguageSwitcher compact segment={segment} />
        </div>
      </Sheet>
    </header>
  );
}

function LogoLink({
  brand,
  segment,
}: {
  brand: string;
  segment: CampaignSegment;
}) {
  return (
    <Link
      aria-label={brand}
      className="focus-ring group inline-flex shrink-0 rounded-lg"
      href={campaigns[segment].path}
    >
      <BrandLogo
        ariaLabel={brand}
        className="transition-transform duration-200 group-hover:-translate-y-px"
        size="md"
      />
    </Link>
  );
}
