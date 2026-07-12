import { getTranslations } from "next-intl/server";

import { Container } from "@/components/shared/container";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main id="main-content">
      <Container className="py-20 md:py-28">
        <h1 className="text-4xl font-semibold tracking-[-0.01em] text-foreground md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-[62ch] text-lg leading-8 text-foreground-muted">
          {t("lead")}
        </p>
      </Container>
    </main>
  );
}
