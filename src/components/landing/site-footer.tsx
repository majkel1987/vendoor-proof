import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Container } from "@/components/shared/container";
import { BrandLogo } from "@/components/shared/brand-logo";
import { campaigns } from "@/config/landing-campaigns";
import { segmentNavigation } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import type { CampaignSegment } from "@/types/landing";

type SiteFooterProps = {
  segment: CampaignSegment;
};

const productLinks = [
  { href: "#workflow", key: "howItWorks" },
  { href: "#automation-highlights", key: "whatItAutomates" },
  { href: "#faq", key: "faq" },
  { href: "#pilot-form", key: "pilot" },
] as const;

export async function SiteFooter({ segment }: SiteFooterProps) {
  const t = await getTranslations("footer");
  const headerT = await getTranslations("header");

  return (
    <footer className="border-border bg-background relative isolate overflow-x-clip border-t">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_12%_0%,oklch(0.83_0.08_184_/_0.18),transparent_62%)]"
      />

      <Container className="py-14 md:py-20">
        <div className="border-border/80 bg-surface/[0.92] rounded-[1.55rem] border p-6 shadow-[0_18px_70px_rgb(7_44_39/0.08)] ring-1 ring-white/70 backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))] lg:gap-10 xl:gap-14">
            <div className="grid max-w-xl content-start gap-5">
              <BrandLink brand={t("brand")} segment={segment} />
              <p className="text-foreground-muted text-sm leading-7 md:text-[0.9375rem]">
                {t("productCopy")}
              </p>
              <div className="border-border/80 bg-surface-muted/70 rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <span className="border-primary/20 bg-primary-subtle text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border">
                    <ShieldAlert aria-hidden="true" className="size-4" />
                  </span>
                  <p className="text-foreground-muted text-xs leading-5">
                    {t("legalDisclaimer")}
                  </p>
                </div>
              </div>
            </div>

            <FooterNavGroup label={t("productLabel")}>
              {productLinks.map((item) => (
                <FooterAnchor href={item.href} key={item.key}>
                  {headerT(`nav.${item.key}`)}
                </FooterAnchor>
              ))}
            </FooterNavGroup>

            <FooterNavGroup label={t("segmentsLabel")}>
              {segmentNavigation.map((item) => (
                <Link
                  aria-current={item.segment === segment ? "page" : undefined}
                  className="focus-ring group text-foreground-muted hover:text-foreground aria-[current=page]:text-primary inline-flex cursor-pointer items-center gap-1 rounded-md text-sm font-semibold transition-colors duration-200"
                  href={campaigns[item.segment].path}
                  key={item.segment}
                >
                  {t(`segments.${item.labelKey}`)}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:opacity-100 aria-[current=page]:opacity-70"
                  />
                </Link>
              ))}
            </FooterNavGroup>

            <FooterNavGroup label={t("legalLabel")}>
              <FooterLink href="/privacy">{t("links.privacy")}</FooterLink>
              <FooterLink href="/terms">{t("links.terms")}</FooterLink>
              <FooterAnchor href="#pilot-form">
                {t("links.contact")}
              </FooterAnchor>
            </FooterNavGroup>
          </div>

          <div className="border-border/80 mt-10 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-foreground-muted text-xs">{t("copyright")}</p>
            <p className="text-foreground-muted text-xs font-medium">
              {t("tagline")}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function BrandLink({
  brand,
  segment,
}: {
  brand: string;
  segment: CampaignSegment;
}) {
  return (
    <Link
      aria-label={brand}
      className="focus-ring group inline-flex w-fit rounded-lg"
      href={campaigns[segment].path}
    >
      <BrandLogo
        ariaLabel={brand}
        className="transition-transform duration-200 group-hover:-translate-y-px"
        size="lg"
      />
    </Link>
  );
}

function FooterNavGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <nav aria-label={label} className="grid content-start gap-4">
      <p className="text-foreground-muted text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
        {label}
      </p>
      <div className="grid gap-2.5">{children}</div>
    </nav>
  );
}

function FooterLink({
  children,
  href,
}: {
  children: string;
  href: "/privacy" | "/terms";
}) {
  return (
    <Link
      className="focus-ring group text-foreground-muted hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-md text-sm font-semibold transition-colors duration-200"
      href={href}
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:opacity-100"
      />
    </Link>
  );
}

function FooterAnchor({ children, href }: { children: string; href: string }) {
  return (
    <a
      className="focus-ring group text-foreground-muted hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-md text-sm font-semibold transition-colors duration-200"
      href={href}
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-px group-hover:-translate-y-px group-hover:opacity-100"
      />
    </a>
  );
}
