import {
  BellRing,
  History,
  Link as LinkIcon,
  ListChecks,
  Repeat2,
  UserRoundCheck,
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
  { icon: History, key: "auditHistory" },
] as const;

type BenefitGridProps = {
  segment: CampaignSegment;
};

export async function BenefitGrid({ segment }: BenefitGridProps) {
  const t = await getTranslations("landing.benefits");

  return (
    <section
      aria-labelledby="benefits-heading"
      className="border-border bg-background scroll-mt-28 border-b py-16 md:py-24"
      id="roi"
    >
      <Container>
        <SectionHeading
          title={<span id="benefits-heading">{t("title")}</span>}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefitItems.map((item) => (
            <BenefitCard
              copy={t(`items.${item.key}.copy`)}
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
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
};

function BenefitCard({ copy, icon: Icon, title }: BenefitCardProps) {
  return (
    <ScrollRevealArticle className="border-border bg-surface shadow-card rounded-lg border p-5">
      <div className="border-primary/20 bg-primary-subtle text-primary flex size-10 items-center justify-center rounded-md border">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h2 className="text-foreground mt-5 text-lg font-semibold">{title}</h2>
      <p className="text-foreground-muted mt-2 text-sm leading-6">{copy}</p>
    </ScrollRevealArticle>
  );
}
