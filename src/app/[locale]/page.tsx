import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { routing } from "@/i18n/routing";

type LocaleHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  redirect(locale === "pl" ? "/pl/property-management" : "/property-management");
}
