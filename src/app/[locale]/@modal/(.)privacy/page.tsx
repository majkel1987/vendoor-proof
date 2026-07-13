import { PrivacyPolicyContent } from "@/components/legal/privacy-policy-content";
import { PrivacyPolicyModal } from "@/components/legal/privacy-policy-modal";
import type { Locale } from "@/i18n/routing";

const copy = {
  en: {
    close: "Close",
    language: "Policy language",
    title: "Privacy Policy",
    updated: "Effective 13 July 2026",
  },
  pl: {
    close: "Zamknij",
    language: "Język polityki",
    title: "Polityka prywatności",
    updated: "Obowiązuje od 13 lipca 2026 r.",
  },
} as const;

type InterceptedPrivacyPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function InterceptedPrivacyPage({
  params,
}: InterceptedPrivacyPageProps) {
  const { locale } = await params;
  const text = copy[locale];

  return (
    <PrivacyPolicyModal
      closeLabel={text.close}
      languageLabel={text.language}
      locale={locale}
      title={text.title}
      updated={text.updated}
    >
      <PrivacyPolicyContent locale={locale} />
    </PrivacyPolicyModal>
  );
}
