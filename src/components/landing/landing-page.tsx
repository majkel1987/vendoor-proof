import { ProcessSection } from "@/components/landing/process-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingMotionProvider } from "@/components/landing/motion-reveal";
import { PilotForm } from "@/components/landing/pilot-form";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { ProblemSection } from "@/components/landing/problem-section";
import { ProductPreview } from "@/components/landing/product-preview";
import { TrustPrinciples } from "@/components/landing/trust-principles";
import type { CampaignConfig } from "@/types/landing";
import { Suspense } from "react";

type LandingPageProps = {
  campaign: CampaignConfig;
};

export async function LandingPage({ campaign }: LandingPageProps) {
  return (
    <>
      <SiteHeader segment={campaign.segment} />
      <LandingMotionProvider>
        <main id="main-content">
          <HeroSection campaign={campaign} />
          <TrustPrinciples />
          <ProblemSection />
          <ProcessSection />
          <ProductPreview segment={campaign.segment} />
          <FaqSection segment={campaign.segment} />
          <Suspense fallback={null}>
            <PilotForm campaign={campaign} />
          </Suspense>
          <FinalCta campaign={campaign} />
        </main>
        <SiteFooter segment={campaign.segment} />
      </LandingMotionProvider>
    </>
  );
}
