import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { termsCopy } from "@/components/legal/terms-copy";
import { TermsPage } from "@/components/legal/terms-page";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/metadata";

type TermsPageProps = {
  params: Promise<{ locale: Locale }>;
};

function absoluteTermsUrl(locale: Locale) {
  return new URL(localizedPath(locale, "/terms"), siteConfig.url).toString();
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = termsCopy[locale];

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${text.title} | ${siteConfig.shortName}`,
    description: text.description,
    alternates: {
      canonical: absoluteTermsUrl(locale),
      languages: {
        en: absoluteTermsUrl("en"),
        pl: absoluteTermsUrl("pl"),
        "x-default": absoluteTermsUrl("en"),
      },
    },
    openGraph: {
      description: text.description,
      locale,
      siteName: siteConfig.name,
      title: text.title,
      type: "website",
      url: absoluteTermsUrl(locale),
    },
  };
}

export default async function LocalizedTermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsPage locale={locale} />;
}
