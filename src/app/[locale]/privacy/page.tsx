import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PrivacyPolicyPage } from "@/components/legal/privacy-policy-page";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/metadata";

const metadataCopy = {
  en: {
    description:
      "How VendoorProof processes website visitor, contact and pilot application data.",
    title: "Privacy Policy",
  },
  pl: {
    description:
      "Jak VendoorProof przetwarza dane odwiedzających stronę, dane kontaktowe i zgłoszenia do pilota.",
    title: "Polityka prywatności",
  },
} as const;

type PrivacyPageProps = {
  params: Promise<{ locale: Locale }>;
};

function absolutePolicyUrl(locale: Locale) {
  return new URL(localizedPath(locale, "/privacy"), siteConfig.url).toString();
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = metadataCopy[locale];

  return {
    metadataBase: new URL(siteConfig.url),
    title: `${text.title} | ${siteConfig.shortName}`,
    description: text.description,
    alternates: {
      canonical: absolutePolicyUrl(locale),
      languages: {
        en: absolutePolicyUrl("en"),
        pl: absolutePolicyUrl("pl"),
        "x-default": absolutePolicyUrl("en"),
      },
    },
    openGraph: {
      description: text.description,
      locale,
      siteName: siteConfig.name,
      title: text.title,
      type: "website",
      url: absolutePolicyUrl(locale),
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyPolicyPage locale={locale} />;
}
