import { MailCheck, UploadCloud, UserCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";

import { ScrollRevealDiv } from "@/components/landing/motion-reveal";
import { Container } from "@/components/shared/container";
import { GlowingShadow } from "@/components/ui/glowing-shadow";

const principles = [
  { icon: MailCheck, key: "approvedAutomation" },
  { icon: UploadCloud, key: "noVendorAccounts" },
  { icon: UserCheck, key: "humanReview" },
] as const;

export async function TrustPrinciples() {
  const t = await getTranslations("landing.trustPrinciples");

  return (
    <section
      className="border-border bg-surface scroll-mt-24 border-b py-12 md:py-16"
      id="trust"
    >
      <Container className="max-w-[82rem]">
        <div className="grid items-stretch gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
          {principles.map((principle, index) => (
            <TrustPrinciple
              copy={t(`${principle.key}.copy`)}
              delay={index * 0.05}
              icon={principle.icon}
              key={principle.key}
              title={t(`${principle.key}.title`)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

type TrustPrincipleProps = {
  copy: string;
  delay: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
};

function TrustPrinciple({
  copy,
  delay,
  icon: Icon,
  title,
}: TrustPrincipleProps) {
  return (
    <ScrollRevealDiv className="h-full" delay={delay}>
      <GlowingShadow>
        <div className="border-primary/12 bg-background group-hover/glow:border-primary/25 relative h-full overflow-hidden rounded-xl border p-6 shadow-[0_18px_45px_rgb(15_83_79/0.06)] transition-[border-color,box-shadow] duration-[350ms] ease-out group-hover/glow:shadow-[0_22px_55px_rgb(15_83_79/0.1)] motion-reduce:transition-none md:min-h-[13.5rem] md:p-7">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top_left,oklch(0.84_0.07_184_/_0.22),transparent_70%)] opacity-80"
          />
          <div className="border-primary/20 bg-primary-subtle text-primary relative flex size-12 shrink-0 items-center justify-center rounded-lg border shadow-[inset_0_1px_0_rgb(255_255_255/0.75)]">
            <Icon aria-hidden="true" className="size-6" />
          </div>
          <div className="relative mt-6">
            <h2 className="text-foreground max-w-[17rem] text-lg leading-6 font-semibold">
              {title}
            </h2>
            <p className="text-foreground-muted mt-2.5 max-w-[22rem] text-[0.9375rem] leading-6">
              {copy}
            </p>
          </div>
        </div>
      </GlowingShadow>
    </ScrollRevealDiv>
  );
}
