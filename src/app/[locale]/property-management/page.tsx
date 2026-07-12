import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LandingPage } from "@/components/landing/landing-page";
import { getCampaign } from "@/config/landing-campaigns";
import { siteConfig } from "@/config/site";
import {
  campaignAlternates,
  campaignCanonical
} from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

const segment = "property-management";

type CampaignPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({
  params
}: CampaignPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: `campaigns.${segment}`
  });
  const alternates = campaignAlternates(segment);
  const canonical = campaignCanonical(locale, segment);

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${t("metaTitle")} | ${siteConfig.shortName}`,
    description: t("metaDescription"),
    alternates: {
      ...alternates,
      canonical
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
      siteName: siteConfig.name,
      locale,
      type: "website",
      images: [
        {
          url: new URL(`/${locale}/opengraph-image`, siteConfig.url).toString(),
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function PropertyManagementPage({
  params
}: CampaignPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage campaign={getCampaign(segment)} />;
}
