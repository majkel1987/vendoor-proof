export const siteConfig = {
  name: "Vendoor Proof",
  shortName: "Vendoor Proof",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  defaultLocale: "en",
  locales: ["en", "pl"] as const,
};
