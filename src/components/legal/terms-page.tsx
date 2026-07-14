import { ArrowLeft } from "lucide-react";

import { PolicyLocaleLinks } from "@/components/legal/policy-locale-links";
import { termsCopy } from "@/components/legal/terms-copy";
import { TermsContent } from "@/components/legal/terms-content";
import { TermsDocumentActions } from "@/components/legal/terms-document-actions";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Container } from "@/components/shared/container";
import { legalConfig } from "@/config/legal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getTermsDocument } from "@/lib/terms";

export function TermsPage({ locale }: { locale: Locale }) {
  const text = termsCopy[locale];
  const document = getTermsDocument(locale);
  const statusLabel =
    document.status === "published"
      ? `${text.version} · ${text.effective}`
      : text.unpublished;

  return (
    <main className="legal-document-page" id="main-content">
      <Container className="py-6 md:py-10">
        <header className="legal-document-navigation border-border mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <Link
            className="focus-ring group text-foreground-muted hover:text-foreground inline-flex items-center gap-3 rounded-lg text-sm font-semibold transition-colors"
            href="/property-management"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform group-hover:-translate-x-0.5"
            />
            <BrandLogo ariaLabel={text.back} size="md" />
          </Link>
          <PolicyLocaleLinks
            label={text.language}
            locale={locale}
            path="/terms"
          />
        </header>

        <div className="border-border bg-surface mx-auto max-w-[960px] rounded-[1.5rem] border px-5 py-7 shadow-[0_18px_70px_rgb(7_44_39/0.08)] sm:px-7 md:px-10 md:py-10">
          <div className="border-border mb-9 border-b pb-7">
            <h1 className="text-foreground text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
              {text.title}
            </h1>
            <p className="text-foreground-muted mt-3 text-sm font-medium">
              {statusLabel}
            </p>
            <div className="mt-5">
              <TermsDocumentActions
                copiedLabel={text.copied}
                copyLabel={text.copyLink}
                printLabel={text.print}
                url={legalConfig.termsUrl[locale]}
              />
            </div>
          </div>
          <TermsContent document={document} locale={locale} />
        </div>
      </Container>
    </main>
  );
}
