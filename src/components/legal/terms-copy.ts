import type { Locale } from "@/i18n/routing";

export const termsCopy = {
  en: {
    back: "Back to VendoorProof",
    close: "Close",
    copied: "Link copied",
    copyLink: "Copy link",
    description:
      "The terms governing access to and use of VendoorProof services.",
    effective: "Effective 14 July 2026",
    fullPage: "Open full page",
    language: "Terms language",
    print: "Print",
    title: "Terms of Service",
    unpublished: "Not published",
    version: "Version 1.0",
  },
  pl: {
    back: "Wróć do VendoorProof",
    close: "Zamknij",
    copied: "Link skopiowany",
    copyLink: "Kopiuj link",
    description:
      "Regulamin dostępu do usług VendoorProof i korzystania z nich.",
    effective: "Obowiązuje od 14 lipca 2026 r.",
    fullPage: "Otwórz pełną stronę",
    language: "Język regulaminu",
    print: "Drukuj",
    title: "Regulamin",
    unpublished: "Nie opublikowano",
    version: "Wersja 1.0",
  },
} as const satisfies Record<Locale, Record<string, string>>;
