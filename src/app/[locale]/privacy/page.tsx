import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/shared/container";
import type { Locale } from "@/i18n/routing";

type TrustPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function PrivacyPage({ params }: TrustPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trustPages.privacy");
  const trustPagesT = await getTranslations("trustPages");

  return (
    <main id="main-content">
      <Container className="py-20 md:py-28">
        <h1 className="text-4xl font-semibold tracking-[-0.01em] text-foreground md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-[62ch] text-lg leading-8 text-foreground-muted">
          {t("lead")}
        </p>
        <p className="mt-8 max-w-[62ch] rounded-lg border border-border bg-surface p-5 text-sm leading-6 text-foreground-muted">
          {trustPagesT("legalDisclaimer")}
        </p>
      </Container>
    </main>
  );
}
