import { ArrowLeft } from "lucide-react";

import { PolicyLocaleLinks } from "@/components/legal/policy-locale-links";
import { PrivacyPolicyContent } from "@/components/legal/privacy-policy-content";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const copy = {
  en: {
    back: "Back to VendoorProof",
    language: "Policy language",
    title: "Privacy Policy",
    updated: "Effective 13 July 2026",
  },
  pl: {
    back: "Wróć do VendoorProof",
    language: "Język polityki",
    title: "Polityka prywatności",
    updated: "Obowiązuje od 13 lipca 2026 r.",
  },
} as const;

export function PrivacyPolicyPage({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <main id="main-content">
      <Container className="py-6 md:py-10">
        <header className="border-border mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
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
          <PolicyLocaleLinks label={text.language} locale={locale} />
        </header>

        <div className="border-border bg-surface mx-auto max-w-[920px] rounded-[1.5rem] border px-5 py-7 shadow-[0_18px_70px_rgb(7_44_39/0.08)] sm:px-7 md:px-10 md:py-10">
          <div className="border-border mb-9 border-b pb-7">
            <h1 className="text-foreground text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
              {text.title}
            </h1>
            <p className="text-foreground-muted mt-3 text-sm font-medium">
              {text.updated}
            </p>
          </div>
          <PrivacyPolicyContent locale={locale} />
        </div>
      </Container>
    </main>
  );
}
