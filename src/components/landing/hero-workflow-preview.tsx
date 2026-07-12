import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function HeroWorkflowPreview() {
  const t = await getTranslations("landing.workflowPreview");

  return (
    <article
      aria-label={t("ariaLabel")}
      className="hero-preview-panel relative scroll-mt-28 text-left"
      tabIndex={-1}
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-white/22 bg-white/[0.06] p-2 shadow-[0_20px_56px_rgb(4_36_32/0.26)] md:p-2.5">
        <div className="overflow-hidden rounded-[1.35rem] border border-border bg-surface shadow-elevated">
          <div className="relative overflow-hidden bg-[oklch(0.965_0.012_247)]">
            <div className="hero-preview-screen relative min-h-[24rem] sm:min-h-[30rem] md:min-h-[38rem] lg:min-h-[44rem] xl:min-h-[48rem]">
              <Image
                alt={t("ariaLabel")}
                className="object-cover object-top"
                fill
                priority
                sizes="(min-width: 1280px) 84rem, 96vw"
                src="/illustrations/vendor-workflow-dashboard.png"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_88%,rgb(15_23_42/0.06))]"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
