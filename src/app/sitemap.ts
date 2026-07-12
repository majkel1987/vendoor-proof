import type { MetadataRoute } from "next";

import { campaigns } from "@/config/landing-campaigns";
import { siteConfig } from "@/config/site";
import { localizedPath } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = siteConfig.locales as readonly Locale[];
  const campaignUrls = Object.values(campaigns).flatMap((campaign) =>
    locales.map((locale) => ({
      url: new URL(localizedPath(locale, campaign.path), siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: campaign.segment === "property-management" ? 1 : 0.9
    }))
  );

  const trustUrls = locales.flatMap((locale) =>
    ["/privacy", "/terms"].map((path) => ({
      url: new URL(localizedPath(locale, path), siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4
    }))
  );

  return [...campaignUrls, ...trustUrls];
}
