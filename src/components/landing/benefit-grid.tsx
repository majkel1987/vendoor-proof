import {
  BellRing,
  History,
  Link as LinkIcon,
  ListChecks,
  Repeat2,
  UserRoundCheck
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";

import { ScrollRevealArticle } from "@/components/landing/motion-reveal";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { CampaignSegment } from "@/types/landing";

const benefitItems = [
  { icon: Repeat2, key: "cadence" },
  { icon: ListChecks, key: "exceptionFirst" },
  { icon: LinkIcon, key: "uploadLinks" },
  { icon: UserRoundCheck, key: "humanReview" },
  { icon: BellRing, key: "escalationRules" },
  { icon: History, key: "auditHistory" }
] as const;

type BenefitGridProps = {
  segment: CampaignSegment;
};

export async function BenefitGrid({ segment }: BenefitGridProps) {
  const t = await getTranslations("landing.benefits");

  return (
    <section
      aria-labelledby="benefits-heading"
      className="scroll-mt-28 border-b border-border bg-background py-16 md:py-24"
      id="roi"
    >
      <Container>
        <SectionHeading title={<span id="benefits-heading">{t("title")}</span>} />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefitItems.map((item, index) => (
            <BenefitCard
              copy={t(`items.${item.key}.copy`)}
              delay={index * 0.04}
              icon={item.icon}
              key={item.key}
              title={t(`items.${item.key}.title`)}
            />
          ))}
        </div>
        <RoiCalculator segment={segment} />
      </Container>
    </section>
  );
}

type BenefitCardProps = {
  copy: string;
  delay: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
};

function BenefitCard({ copy, delay, icon: Icon, title }: BenefitCardProps) {
  return (
    <ScrollRevealArticle
      className="rounded-lg border border-border bg-surface p-5 shadow-card"
      delay={delay}
    >
      <div className="flex size-10 items-center justify-center rounded-md border border-primary/20 bg-primary-subtle text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-foreground-muted">{copy}</p>
    </ScrollRevealArticle>
  );
}
