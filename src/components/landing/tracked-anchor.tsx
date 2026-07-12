"use client";

import { type ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { analyticsEvents, type AnalyticsEventName } from "@/config/analytics-events";
import { trackEvent } from "@/lib/analytics";
import { usePathname } from "@/i18n/navigation";
import type { CampaignSegment } from "@/types/landing";

type TrackedAnchorProps = {
  children: ReactNode;
  className?: string;
  eventName: AnalyticsEventName;
  eventSource: string;
  href: `#${string}`;
  locale: string;
  segment: CampaignSegment;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  onTrackedClick?: () => void;
};

export function TrackedAnchor({
  children,
  className,
  eventName,
  eventSource,
  href,
  locale,
  segment,
  size = "lg",
  variant = "default",
  onTrackedClick
}: TrackedAnchorProps) {
  const pathname = usePathname();

  return (
    <Button asChild className={className} size={size} variant={variant}>
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          trackEvent(eventName, {
            locale,
            campaign_segment: segment,
            page_path: pathname,
            event_source: eventSource,
            target: href
          });
          scrollToTarget(href);
          onTrackedClick?.();
        }}
      >
        {children}
      </a>
    </Button>
  );
}

export function trackNavAnchor(
  href: `#${string}`,
  locale: string,
  segment: CampaignSegment,
  pathname: string,
  onComplete?: () => void
) {
  trackEvent(analyticsEvents.navAnchorClicked, {
    locale,
    campaign_segment: segment,
    page_path: pathname,
    anchor: href
  });
  scrollToTarget(href);
  onComplete?.();
}

function scrollToTarget(href: `#${string}`) {
  const id = href.slice(1);
  const target = document.getElementById(id);

  if (!target) {
    window.location.hash = id;
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start"
  });

  const focusTarget =
    target.querySelector<HTMLElement>(
      "input, select, textarea, button, a[href], [tabindex]:not([tabindex='-1'])"
    ) ?? target;

  const hadTabIndex = focusTarget.hasAttribute("tabindex");
  if (!hadTabIndex) {
    focusTarget.setAttribute("tabindex", "-1");
  }

  window.setTimeout(
    () => {
      focusTarget.focus({ preventScroll: true });
      if (!hadTabIndex) {
        focusTarget.addEventListener(
          "blur",
          () => focusTarget.removeAttribute("tabindex"),
          { once: true }
        );
      }
    },
    prefersReducedMotion ? 0 : 420
  );
}
