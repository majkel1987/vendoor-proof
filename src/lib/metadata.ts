import type { Metadata } from "next";

import { campaigns } from "@/config/landing-campaigns";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import type { CampaignSegment } from "@/types/landing";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function localizedPath(locale: Locale, path: string) {
  return locale === "en" ? path : `/pl${path}`;
}

export function campaignAlternates(segment: CampaignSegment) {
  const path = campaigns[segment].path;

  return {
    languages: {
      en: absoluteUrl(localizedPath("en", path)),
      pl: absoluteUrl(localizedPath("pl", path)),
      "x-default": absoluteUrl(localizedPath("en", path))
    }
  };
}

export function campaignCanonical(locale: Locale, segment: CampaignSegment) {
  return absoluteUrl(localizedPath(locale, campaigns[segment].path));
}

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.shortName }],
    creator: siteConfig.shortName,
    publisher: siteConfig.shortName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    }
  };
}
