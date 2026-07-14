import { termsCopy } from "@/components/legal/terms-copy";
import { TermsContent } from "@/components/legal/terms-content";
import { TermsModal } from "@/components/legal/terms-modal";
import { legalConfig } from "@/config/legal";
import type { Locale } from "@/i18n/routing";
import { getTermsDocument } from "@/lib/terms";

type InterceptedTermsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function InterceptedTermsPage({
  params,
}: InterceptedTermsPageProps) {
  const { locale } = await params;
  const text = termsCopy[locale];
  const document = getTermsDocument(locale);
  const statusLabel =
    document.status === "published"
      ? `${text.version} · ${text.effective}`
      : text.unpublished;

  return (
    <TermsModal
      closeLabel={text.close}
      copiedLabel={text.copied}
      copyLabel={text.copyLink}
      fullPageLabel={text.fullPage}
      languageLabel={text.language}
      locale={locale}
      printLabel={text.print}
      statusLabel={statusLabel}
      title={text.title}
      url={legalConfig.termsUrl[locale]}
    >
      <TermsContent document={document} locale={locale} />
    </TermsModal>
  );
}
