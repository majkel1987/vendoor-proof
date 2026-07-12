# Action Plan — Landing Page dla COI / Vendor Document Tracker

> **Cel dokumentu:** instrukcja wykonawcza dla agenta AI implementującego produkcyjny landing page dla produktu **COI / Vendor Document Tracker**.
>
> **Cel biznesowy:** zwalidować, czy buyer chce oddać systemowi powtarzalny proces wykrywania terminów, follow-upów i eskalacji dokumentów vendorów — zamiast kupować kolejny rejestr plików.
>
> **Główna konwersja:** `Apply for an automation pilot` / `Request a pilot`.
>
> **Drugorzędne konwersje:** obejrzenie workflow, rezerwacja discovery call, pobranie checklisty oraz pozostawienie danych do concierge pilot.

---

## 0. Decyzje strategiczne, których nie wolno zmieniać podczas implementacji

### 0.1. Pozycjonowanie i granice obietnicy

Landing page sprzedaje **automated vendor-document follow-up workflow**, nie katalog dokumentów i nie automatyczne rozstrzyganie compliance.

- Produkt wykrywa brakujące, wygasające, przeterminowane i nieobsłużone wymagania dokumentowe.
- Produkt wysyła zatwierdzone przez zespół requesty, follow-upy i eskalacje.
- Produkt zatrzymuje follow-up po otrzymaniu uploadu i przekazuje dokument do ręcznego review.
- Produkt zapisuje historię automatycznych działań oraz decyzji.
- **Nigdy nie komunikuj**, że aplikacja automatycznie zatwierdza COI, polisę, licencję, endorsement lub zgodność z umową.
- Zawsze komunikuj rozdział: **`Submitted / Received` ≠ `Verified`**.

### 0.2. Segmenty kampanii

Nie twórz dwóch niezależnych codebase’ów. Zbuduj jeden system komponentów i treści z dwoma wariantami kampanii:

| Wariant             | Route EN               | Route PL                  | Główny komunikat                                                            | CTA                             |
| ------------------- | ---------------------- | ------------------------- | --------------------------------------------------------------------------- | ------------------------------- |
| Property management | `/property-management` | `/pl/property-management` | `Stop manually chasing vendors for expiring documents.`                     | `Apply for an automation pilot` |
| General contractors | `/contractors`         | `/pl/contractors`         | `Automate vendor-document follow-ups before expired paperwork blocks work.` | `Request a pilot`               |

Dodatkowo:

- Route `/` ma kierować do wariantu `property-management` jako wariantu kontrolnego pierwszego smoke testu.
- W nagłówku pokaż dyskretny przełącznik segmentu: `For property teams` / `For contractors`.
- Każdy wariant otrzymuje osobny parametr analityczny `campaign_segment`.
- Wspólny layout, komponenty, kalkulator, formularz i FAQ muszą być współdzielone; zmienne są wyłącznie copy, przykłady, hero visual oraz część pytań FAQ.

### 0.3. Architektura rekomendowana zamiast czystego React SPA

**Wybór: Next.js + TypeScript + App Router + Tailwind CSS + shadcn/ui.**

Nie buduj landing page’a jako czystej aplikacji React SPA.

| Kryterium       | Decyzja implementacyjna                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO             | Prerenderuj każdą stronę kampanii jako statyczny HTML; generuj odrębne metadata, canonical, `hreflang`, sitemap i OG image dla EN/PL oraz każdego segmentu.                     |
| Wydajność       | Używaj React Server Components jako domyślnego trybu. Komponenty klienckie ogranicz do menu mobile, language switchera, ROI calculatora, formularza, modalnego demo i animacji. |
| Konwersja       | Obsługuj formularz przez server action albo route handler; walidacja, antyspam i event analityczny muszą działać bez pełnego SPA.                                               |
| Rozwój produktu | Ta sama aplikacja może później przejąć stronę waitlisty, onboarding concierge beta i panel MVP bez migracji frameworka.                                                         |
| i18n            | Zastosuj locale routing przez `next-intl`, z EN jako językiem domyślnym i `/pl` dla polskiego wariantu.                                                                         |

### 0.4. Nadrzędne skille UI/UX dla agenta wykonawczego

Przed implementacją zainstaluj lub wczytaj poniższe zasady i traktuj je jako reguły nadrzędne dla projektu:

```bash
# UI/UX Pro Max
npm install -g ui-ux-pro-max-cli
uipro init --ai cursor

# Taste Skill — wariant domyślny dla wykonawcy
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Wymagane nastawy estetyczne dla tego projektu:

```text
DESIGN_VARIANCE: 4/10
MOTION_INTENSITY: 3/10
VISUAL_DENSITY: 4/10
```

Zasady obowiązkowe:

- Styl: **trust & authority B2B + premium restrained minimalism**.
- Priorytet: precyzyjna hierarchia, whitespace, czytelne rytmy, realny UI produktu, wyraziste CTA.
- Używaj Lucide React; nie używaj emoji jako ikon interfejsu.
- Nie używaj typowych gradientów „AI purple/pink”, nadmiaru glassmorphismu, losowych dekoracji 3D, niespójnych promieni, animacji bez funkcji ani stockowych pseudo-testimonials.
- Zachowaj kontrast tekstu co najmniej WCAG AA; focus state musi być zawsze widoczny; wspieraj `prefers-reduced-motion`.
- Nie twórz fałszywych logotypów klientów, ocen, testimoniali, statystyk ani claimów typu „trusted by 500 teams”.
- Każdy element klikalny ma mieć jasny stan hover, focus-visible, disabled i mobile tap target co najmniej `44 × 44 px`.

Źródła zasad do wczytania przez agenta:

- [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Taste Skill](https://github.com/leonxlnx/taste-skill)

---

# Krok 1: Architektura i Szkielet (Boilerplate)

## 1.1. Inicjalizacja repozytorium

Utwórz projekt Next.js z TypeScript, ESLint, App Routerem, aliasem `@/*` i `src/` directory.

```bash
pnpm create next-app@latest coi-vendor-landing \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm

cd coi-vendor-landing

pnpm add next-intl zod react-hook-form @hookform/resolvers \
  lucide-react framer-motion clsx tailwind-merge \
  @vercel/analytics @vercel/speed-insights

pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input label textarea select checkbox \
  accordion dialog sheet separator tooltip sonner

pnpm add -D prettier prettier-plugin-tailwindcss \
  @playwright/test axe-core @axe-core/playwright
```

Jeżeli projekt ma być wdrożony poza Vercel, zastąp wyłącznie adapter deploymentu. Nie zastępuj Next.js frameworkiem SPA.

## 1.2. Docelowa struktura katalogów

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── property-management/page.tsx
│   │   ├── contractors/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── not-found.tsx
│   ├── api/
│   │   ├── lead/route.ts
│   │   └── calendar/route.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── opengraph-image.tsx
│   └── globals.css
├── components/
│   ├── landing/
│   │   ├── landing-page.tsx
│   │   ├── site-header.tsx
│   │   ├── mobile-navigation.tsx
│   │   ├── language-switcher.tsx
│   │   ├── hero-section.tsx
│   │   ├── workflow-preview.tsx
│   │   ├── trust-principles.tsx
│   │   ├── problem-section.tsx
│   │   ├── automation-section.tsx
│   │   ├── workflow-timeline.tsx
│   │   ├── product-preview.tsx
│   │   ├── benefit-grid.tsx
│   │   ├── roi-calculator.tsx
│   │   ├── beta-offer.tsx
│   │   ├── faq-section.tsx
│   │   ├── pilot-form.tsx
│   │   ├── final-cta.tsx
│   │   └── site-footer.tsx
│   ├── ui/
│   └── shared/
│       ├── container.tsx
│       ├── section-heading.tsx
│       ├── eyebrow.tsx
│       ├── status-badge.tsx
│       └── icon-chip.tsx
├── config/
│   ├── site.ts
│   ├── landing-campaigns.ts
│   ├── navigation.ts
│   └── analytics-events.ts
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── navigation.ts
├── lib/
│   ├── analytics.ts
│   ├── lead-schema.ts
│   ├── utils.ts
│   ├── metadata.ts
│   └── rate-limit.ts
├── messages/
│   ├── en.json
│   └── pl.json
└── types/
    ├── landing.ts
    └── lead.ts
public/
├── brand/
├── illustrations/
└── og/
```

## 1.3. Granice komponentów i model treści

Nie zapisuj copy kampanii bezpośrednio w komponentach JSX. Wszystkie teksty użytkownika muszą pochodzić z `messages/en.json` i `messages/pl.json`.

Zdefiniuj w `types/landing.ts`:

```ts
export type CampaignSegment = "property-management" | "contractors";

export type CampaignConfig = {
  segment: CampaignSegment;
  path: string;
  primaryCtaEvent: "pilot_apply_clicked" | "pilot_request_clicked";
  heroVisualMode: "portfolio" | "mobilization";
  leadMagnet: "follow-up-cadence" | "document-checklist";
  formDefaults: {
    companyType: "Property management" | "General contractor";
  };
};
```

Zdefiniuj `landing-campaigns.ts` jako jedyne źródło konfiguracji wariantu. Komponenty mają otrzymywać `campaign` jako prop, a nie tworzyć warunki w wielu miejscach.

## 1.4. Globalny layout i kontener

### Layout

- `app/[locale]/layout.tsx` ma ustawiać `lang`, `dir`, globalne fonts, metadata fallback, provider `NextIntlClientProvider`, analytics oraz toast provider.
- Główna zawartość ma być oznaczona `<main id="main-content">`.
- Dodaj link `Skip to content` widoczny po fokusie z klawiatury.
- Header jest sticky dopiero po pierwszym scrollu; początkowo może być transparentny, ale nie może zmniejszać kontrastu ani zasłaniać treści.
- Nie renderuj ciężkich globalnych providerów, jeśli nie są konieczne na stronie statycznej.

### Kontener i breakpoints

```css
/* Logiczne wartości; unikaj arbitralnych szerokości w komponentach. */
--container-max: 76rem;
--gutter-mobile: 1.25rem;
--gutter-tablet: 2rem;
--gutter-desktop: 3rem;

/* Projektuj i testuj co najmniej: */
375px, 480px, 768px, 1024px, 1280px, 1440px
```

- Mobile-first: bazowe style dotyczą ekranów 375–479 px.
- Nigdy nie ukrywaj kluczowej informacji na mobile wyłącznie z powodów estetycznych.
- Sekcje mogą mieć własną maksymalną szerokość tekstu; nagłówki nie mogą rozciągać się na całą szerokość desktopu.
- Desktop nie może być tylko powiększonym mobilem: hero, bento grids i workflow timeline mają otrzymać układ dwukolumnowy/siatkowy dopiero od `lg`.

## 1.5. Tokeny projektowe

Używaj tokenów semantycznych, nie twardych kolorów w JSX. Zdefiniuj je w `globals.css` przez CSS custom properties oraz wystaw do Tailwind przez `@theme`.

### Kierunek wizualny

- Dominujący tryb: jasny, profesjonalny, spokojny, bez „startupowego hałasu”.
- Tło: lekko chłodna złamana biel.
- Tekst: bardzo ciemny granat/grafit zamiast czerni absolutnej.
- Primary: nasycony, przygaszony teal/emerald kojarzący się z uporządkowanym procesem i statusem `Verified`.
- Attention: bursztyn dla expiring/attention.
- Risk: stonowana czerwień wyłącznie dla `Expired`, `Escalated`, `Blocking`.
- Nie używaj więcej niż jednego dominującego koloru akcentowego w pojedynczym viewportcie.

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;

  --color-background: oklch(0.985 0.004 247);
  --color-surface: oklch(1 0 0);
  --color-surface-muted: oklch(0.965 0.008 247);
  --color-foreground: oklch(0.205 0.022 257);
  --color-foreground-muted: oklch(0.46 0.018 257);
  --color-border: oklch(0.89 0.012 247);

  --color-primary: oklch(0.46 0.095 184);
  --color-primary-hover: oklch(0.405 0.09 184);
  --color-primary-foreground: oklch(0.99 0.002 247);
  --color-primary-subtle: oklch(0.94 0.035 184);

  --color-success: oklch(0.53 0.11 153);
  --color-attention: oklch(0.71 0.135 77);
  --color-danger: oklch(0.56 0.18 28);
  --color-info: oklch(0.54 0.105 235);

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;

  --shadow-card:
    0 1px 2px rgb(15 23 42 / 0.04), 0 12px 32px rgb(15 23 42 / 0.06);
  --shadow-elevated: 0 18px 50px rgb(15 23 42 / 0.1);
}
```

### Typografia

```ts
// app/[locale]/layout.tsx
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});
```

Wymagania typograficzne:

| Element   | Mobile                         | Desktop  | Zasada                                                            |
| --------- | ------------------------------ | -------- | ----------------------------------------------------------------- |
| Hero H1   | `clamp(2.25rem, 8vw, 4.75rem)` | max 76px | 1 myśl, maks. 3–4 linie na mobile, 2–3 na desktop.                |
| H2 sekcji | 32–40 px                       | 48–56 px | Maks. 2–3 linie; naturalny line-height 1.05–1.12.                 |
| Body lead | 18 px                          | 20 px    | Szerokość max 62 znaków.                                          |
| Body      | 16 px                          | 16–18 px | Line-height 1.55–1.7.                                             |
| Eyebrow   | 12–13 px                       | 12–13 px | Uppercase tylko dla krótkich etykiet, letter spacing umiarkowany. |
| Button    | 15–16 px                       | 15–16 px | Weight minimum 650; bez skondensowanych etykiet.                  |

## 1.6. Biblioteki i reguły użycia

| Obszar               | Narzędzie                       | Reguła                                                                                              |
| -------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- |
| Layout i utility CSS | Tailwind CSS                    | Używaj tokenów semantycznych; ogranicz arbitrary values do realnych wyjątków.                       |
| Prymitywy a11y       | shadcn/ui + Radix               | Korzystaj z gotowych accessible primitives dla Sheet, Dialog, Accordion, Select, Checkbox, Tooltip. |
| Ikony                | Lucide React                    | Ikony dekoracyjne mają `aria-hidden`; ikony bez tekstu dostają `aria-label` i Tooltip.              |
| Formularz            | React Hook Form + Zod           | Walidacja client-side dla ergonomii oraz obowiązkowo server-side dla bezpieczeństwa.                |
| Animacje             | Framer Motion + LazyMotion      | Animuj wyłącznie komponenty wymagające interakcji lub wejścia w viewport.                           |
| Tracking             | PostHog lub równoważny provider | Nie blokuj renderowania; ładuj po zgodzie analitycznej lub z zgodnym mechanizmem consent.           |
| Testy                | Playwright + axe-core           | E2E dla krytycznej ścieżki oraz automatyczny accessibility scan.                                    |

## 1.7. Metadata, SEO i trust pages

Dla każdej kombinacji locale + campaign ustaw:

- unikalny `<title>` o długości około 50–60 znaków;
- unikalny meta description;
- canonical URL;
- alternates `hreflang="en"`, `hreflang="pl"`, `x-default`;
- statyczny OG image z właściwym hero komunikatem;
- favicon oraz `apple-touch-icon`;
- `robots.ts`, `sitemap.ts` i strona 404 w obu językach.

Przykładowe tytuły:

```text
EN Property: Automate Vendor Document Follow-Ups | [Product Name]
EN Contractor: Prevent Work Delays from Expired Vendor Documents | [Product Name]
PL Property: Automatyzuj follow-upy dokumentów dostawców | [Product Name]
```

Schema.org:

- Zastosuj `Organization` oraz `WebSite` po potwierdzeniu nazwy firmy i domeny.
- Dodaj `FAQPage` tylko wtedy, gdy zawartość FAQ widoczna na stronie i JSON-LD jest identyczny z copy.
- Nie dodawaj `AggregateRating`, `Review`, `Product` z ceną lub claimów klientów, których jeszcze nie ma.

## 1.8. Definicja gotowego boilerplate’u

Krok 1 jest ukończony, gdy:

- oba warianty kampanii i oba locale renderują się statycznie;
- każdy widok ma poprawny layout, font, tokeny, metadata, canonical i `hreflang`;
- komponenty nie mają twardo zakodowanego copy;
- header, language switcher, mobile menu i skip link są dostępne klawiaturowo;
- project przechodzi `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e` oraz produkcyjny build.

---

# Krok 2: Anatomia Sekcji i Komponentów

## 2.1. Kolejność sekcji

Zastosuj poniższą kolejność. Nie dodawaj sekcji, które nie wzmacniają zrozumienia automatyzacji lub konwersji do pilota.

```text
Header
↓
Hero + Workflow Preview
↓
Trust Principles
↓
Problem: fragmented manual process
↓
What the system automates
↓
How the workflow works
↓
Product / exception-first preview
↓
Business outcomes + ROI calculator
↓
Concierge beta offer
↓
FAQ
↓
Lead form + calendar handoff
↓
Footer
```

## 2.2. Header — `SiteHeader`

### Cel

Pozwolić użytkownikowi zorientować się w produkcie, zmienić segment lub język i przejść do CTA bez przeciążenia nawigacją.

### Zawartość

- Logo tekstowe/wordmark produktu po lewej.
- Desktop navigation: `How it works`, `What it automates`, `ROI`, `Pilot`, `FAQ`.
- Segment switcher: `Property teams` / `Contractors`.
- `LanguageSwitcher`: `EN` / `PL`.
- Primary CTA: `Apply for a pilot`.
- Nie dodawaj dropdownów, megamenu, loginu, pricing navigation ani wielu równorzędnych CTA.

### Desktop

- Header o wysokości 72–80 px, maks. szerokość kontenera strony.
- Nawigacja wyśrodkowana optycznie; CTA po prawej.
- Przy scrollu: powierzchnia otrzymuje półprzezroczyste tło `surface/90`, subtelny blur oraz dolny border; tylko gdy kontrast jest prawidłowy.

### Mobile

- Logo, language switcher i przycisk hamburger w jednym wierszu.
- Użyj `Sheet` z focus trapem; CTA na dole panelu w pełnej szerokości.
- Menu ma mieć linki kotwiczące, segment switcher i language switcher.
- Po kliknięciu elementu menu zamknij sheet i przenieś fokus zgodnie z a11y.

### Tracking

- `nav_anchor_clicked` z parametrami `anchor`, `locale`, `campaign_segment`.
- `campaign_segment_changed`.
- `language_changed`.
- `header_primary_cta_clicked`.

---

## 2.3. Hero — `HeroSection`

### Cel

W pierwszym viewportcie użytkownik ma zrozumieć: **dla kogo produkt jest, co automatyzuje i że decyzja o zatwierdzeniu pozostaje manualna**.

### Copy EN — property management

```text
Eyebrow: Vendor document follow-up automation
H1: Stop manually chasing vendors for expiring documents.
Lead: Automate COI, license, and compliance-document follow-ups — then review only the exceptions that need your attention.
Context: Built for small property teams still managing vendor compliance in spreadsheets, inboxes, and last-minute reminders.
Primary CTA: Apply for an automation pilot
Secondary CTA: See the 3-minute workflow
Microcopy: No vendor logins. Your team keeps final review control.
```

### Copy EN — contractors

```text
Eyebrow: Vendor document follow-up automation
H1: Automate vendor-document follow-ups before expired paperwork blocks work.
Lead: Keep COIs, licenses, and subcontractor documents moving without manually sending every reminder.
Context: A lightweight workflow for contractors who need to see what is missing, what is in review, and what can block mobilization.
Primary CTA: Request a pilot
Secondary CTA: Get the vendor-document checklist
Microcopy: No vendor logins. Submission never equals approval.
```

### Implementacja wizualna

Hero nie może być pustym gradientem ani stockowym zdjęciem biura. Po prawej stronie desktopu, pod CTA na mobile, umieść **realistyczny static product workflow preview**:

```text
Vendor: Northline HVAC
Requirement: General Liability COI
Status timeline:
90 days before expiry  → Request sent
60 days before expiry  → Follow-up scheduled
Vendor upload          → In review
Reviewer decision      → Verified

Visible system status:
"Follow-ups pause automatically when a file is submitted."
```

Wizualne wymagania preview:

- Karta desktopowego UI z jasno rozróżnionymi status badges: `Expiring`, `Requested`, `In review`, `Verified`.
- Nie twórz fałszywego dashboardu z drobnym nieczytelnym tekstem.
- Każdy tekst w preview ma być prawdziwym DOM, nie obrazem.
- Widoczny akcent manualnej kontroli: `Reviewer decision required`.
- Użyj jeden subtelny motion cue, np. przejście badge `Requested → Submitted` po wejściu w viewport; w `prefers-reduced-motion` pokaż statyczny stan.

### Mobile

- Kolejność: eyebrow → H1 → lead → CTA → microcopy → preview.
- CTA primary pełnej szerokości; secondary jako link z ikoną `ArrowDown` lub `Play` tylko gdy faktycznie otwiera demo.
- Preview ma zostać skrócony do jednej czytelnej karty statusu, nie „ściśniętym desktop dashboardem”.
- Zawsze zachowaj 24 px oddechu między CTA i preview.

### Desktop

- Grid 6/6 lub 5/7, zależnie od długości H1.
- Tekst hero max 640 px; preview maks. 620 px.
- Nie ustawiaj hero na sztywną wysokość `100vh`; musi działać przy większym powiększeniu tekstu i krótszych viewportach.

### Interakcje

- Primary CTA scrolluje do `#pilot-form`, focusuje pierwszy field formularza po zakończeniu smooth scroll (z szacunkiem dla reduced motion).
- Secondary CTA scrolluje do `#workflow` albo otwiera modal z demonstracją bez autoplay; wybierz jedną implementację i nie duplikuj funkcji.

---

## 2.4. Trust Principles — `TrustPrinciples`

### Cel

Usunąć trzy główne obawy przed kliknięciem CTA: automatyczne wysyłanie e-maili, vendor onboarding i automatyczna interpretacja dokumentów.

### Zawartość

Trzy zwarte karty lub poziomy pas pod hero:

| Ikona         | Tytuł                    | Copy EN                                                             |
| ------------- | ------------------------ | ------------------------------------------------------------------- |
| `MailCheck`   | Approved automation      | `Emails follow the cadence and templates your team approves.`       |
| `UploadCloud` | No vendor accounts       | `Each request includes a secure, scoped upload link.`               |
| `UserCheck`   | Human review stays human | `A submitted file is routed to review — it is never auto-approved.` |

### Implementacja

- To nie jest sekcja „logo bar”. Nie dodawaj logotypów klientów przed zdobyciem zgód.
- Karty nie powinny konkurować z H1: małe ikony, krótkie nagłówki, maks. 2 linie copy.
- Na desktop: 3 kolumny z subtelnymi separatorami; na mobile: pionowa lista z ikoną po lewej.

---

## 2.5. Problem — `ProblemSection`

### Cel

Wizualnie pokazać różnicę między rejestrem dat a działającym procesem automatyzacji.

### Headline EN

```text
Your team should not have to remember every expiry date and send every follow-up manually.
```

### Copy EN

```text
A spreadsheet may tell you what expires. It does not send the right request, stop chasing when a file arrives, route the document to review, or escalate the exceptions that can delay work.
```

### Struktura

Po lewej: narastający manualny chaos w postaci czterech prostych kart `Spreadsheet`, `Inbox`, `Calendar reminder`, `Unowned exception`.

Po prawej: logiczny opis konsekwencji:

- `Expiry dates live in a spreadsheet.`
- `Files live across inboxes and drives.`
- `Follow-ups depend on someone remembering.`
- `No response has no clear owner.`

Dolna belka: `A file received is still not a verified document.`

### Wymagania UX

- Nie używaj ikon z czerwonym alertem przy każdym punkcie; jeden controlled risk color wystarczy.
- Teksty nie mogą sugerować, że każdy klient pracuje chaotycznie. Opisuj koszt procesu, nie oceniaj użytkownika.
- Na mobile: karta problemu może być timeline’em, ale kolejność logiczna musi zostać zachowana.

---

## 2.6. What the system automates — `AutomationSection`

### Cel

Przełożyć wartość z abstrakcyjnego „compliance” na trzy konkretne automatyczne działania.

### Headline EN

```text
The routine work runs automatically. Your team reviews the decisions that matter.
```

### Trzy elementy

| Numer | Tytuł     | Copy                                                                            | Wizualny sygnał                   |
| ----- | --------- | ------------------------------------------------------------------------------- | --------------------------------- |
| 01    | Detect    | `Flag missing, expiring, overdue, and unanswered document requirements.`        | `CalendarClock` + status strip.   |
| 02    | Follow up | `Send approved requests and reminders with a secure vendor upload link.`        | `Mail` + mini e-mail preview.     |
| 03    | Escalate  | `Stop the sequence on upload and surface only overdue or high-risk exceptions.` | `ShieldAlert` + owner alert card. |

### Implementacja

- Przy pierwszym renderze zachowaj statyczne trzy karty. Opcjonalnie po wejściu w viewport pokaż sekwencyjne ujawnienie kart; bez przemieszczania layoutu.
- Desktop: 3 równe karty w gridzie 12 kolumn, z dyskretną linią procesu między nimi.
- Mobile: pionowe karty z pionową linią tylko wtedy, gdy nie koliduje z czytelnością; w przeciwnym razie numerowane moduły.
- Każda karta ma własne `aria-labelledby` i realny tekst, a nie tylko ikonę.

---

## 2.7. Workflow — `WorkflowTimeline`

### Cel

Pokazać od triggera do manualnej decyzji, aby buyer zrozumiał sterowalność automatyzacji.

### ID sekcji

```html
<section id="workflow" aria-labelledby="workflow-heading"></section>
```

### Headline EN

```text
From expiry trigger to verified record — without manually running every step.
```

### Etapy

```text
1. A document is missing or approaching expiry.
2. The system sends the approved request and secure upload link.
3. It follows up on the configured cadence if the vendor stays silent.
4. Upload stops the cadence and moves the file to review.
5. The reviewer verifies, requests changes, or escalates an exception.
```

### Interaktywny pattern

Zastosuj `Tabs` na desktop i disclosure/accordion na mobile:

- Każdy etap pokazuje po lewej prostą ilustrację UI, po prawej tekst, status i „What happens next?”.
- Przykład dla etapu 3 ma pokazać konkretne daty `90 / 60 / 30 / 7 days` jako konfigurację, nie jako obietnicę obowiązkowego schematu.
- Przykład dla etapu 4 musi eksponować `Submitted → In review`, nie `Submitted → Verified`.
- Przycisk `See the 3-minute workflow` z hero scrolluje dokładnie tutaj.

### Mobile

- Nie pokazuj horyzontalnej karuzeli wymagającej dragowania.
- Domyślnie otwarty pierwszy krok; użytkownik może rozwijać kolejne.
- Minimalny tap target nagłówka accordionu: 48 px.

---

## 2.8. Product / exception-first preview — `ProductPreview`

### Cel

Zamienić abstrakcyjną obietnicę w namacalny widok priorytetów operacyjnych.

### Headline EN

```text
See the exceptions before they become site problems.
```

### Wizualny mockup

Zbuduj semantyczny mockup dashboardu w DOM, składający się z:

- Top summary: `Expired`, `Expiring in 30 days`, `Awaiting review`, `Escalated`.
- Tabela/lista: Vendor, site/project, document, status, next action, owner.
- Wyróżniony rekord: `Northline HVAC — General Liability COI — Expiring in 7 days — Follow-up scheduled`.
- Side panel/tooltip: `Why this action will run: Default COI policy, 7-day expiry trigger.`
- Blok manual review: `File submitted — review required.`

### Wymagania

- Dane są przykładowe i muszą być oznaczone jako `Example workflow view` dla uczciwości.
- Wykresów nie stosuj, jeżeli nie dodają informacji. Ta sekcja ma używać listy i statusów.
- Pod mockupem dodaj trzy outcome statements bez niezweryfikowanych liczb:
  - `See what is missing now.`
  - `Know who owns the next action.`
  - `Keep an audit-ready history.`

### Mobile

- Pokaż tylko cztery karty KPI i 2 widoczne rekordy tabeli; pozostałe dane ukryj jako wskazówkę przewijania wyłącznie gdy tabela rzeczywiście scrolluje poziomo.
- Preferuj kartę-rekord zamiast próby zmieszczenia tabeli desktopowej.

---

## 2.9. Outcomes + ROI calculator — `BenefitGrid` i `RoiCalculator`

### Cel

Pokazać korzyść bez obiecywania gwarantowanego zwrotu ani wymyślonych benchmarków.

### Headline EN

```text
Turn a fragile spreadsheet process into a dependable operating routine.
```

### Benefit grid

| Ikona            | Tytuł                         | Copy                                                                  |
| ---------------- | ----------------------------- | --------------------------------------------------------------------- |
| `Repeat2`        | Automated cadence             | `Run follow-ups at the intervals your team approves.`                 |
| `ListChecks`     | Exception-first view          | `Focus on missing, expiring, escalated, and awaiting-review records.` |
| `Link`           | No-login upload links         | `Let vendors submit the requested file in under a minute.`            |
| `UserRoundCheck` | Human review where it matters | `Submission stops chasing; your team still makes the final decision.` |
| `BellRing`       | Escalation rules              | `Notify the owner and manager when a deadline is at risk.`            |
| `History`        | Audit-ready history           | `Keep every request, file, decision, and escalation in one timeline.` |

### ROI Calculator

#### Inputy

| Field                           | Typ      | Walidacja | Default |
| ------------------------------- | -------- | --------- | ------- |
| Active vendors                  | Number   | 1–10 000  | 50      |
| Documents per vendor            | Number   | 1–50      | 2       |
| Average follow-ups per document | Number   | 0–20      | 2       |
| Minutes per manual follow-up    | Number   | 1–120     | 4       |
| Optional hourly cost            | Currency | 0–10 000  | puste   |

#### Wzór

```text
monthly_follow_up_minutes =
  active_vendors × documents_per_vendor × average_follow_ups_per_document × minutes_per_manual_follow_up

monthly_hours = monthly_follow_up_minutes / 60

optional_cost = monthly_hours × hourly_cost
```

#### Wynik i copy

```text
Estimated manual follow-up time: {hours} hours per cycle
Estimated internal cost: {currency} per cycle  // tylko gdy użytkownik poda koszt

This is an estimate based on your inputs. It does not include the cost of delayed work, audit risk, or document review.
```

#### Wymagania implementacyjne

- Kalkulator ma działać client-side bez wysyłania danych do backendu.
- Aktualizuj wynik przy `onBlur` i kontrolowanym `onChange` z debounce maks. 150 ms; nie twórz migających wyników przy każdym znaku.
- Stosuj `aria-live="polite"` dla wyniku, ale nie ogłaszaj każdej liczby podczas wpisywania.
- Nie używaj suwków dla wartości wymagających precyzji. Użyj pól numeric z czytelną jednostką.
- Wyślij event `roi_calculator_completed` dopiero gdy użytkownik zmieni co najmniej dwa inputy.

---

## 2.10. Concierge beta — `BetaOffer`

### Cel

Zmienić zainteresowanie w kwalifikowane zgłoszenie do pilota na realnych danych.

### Headline EN

```text
We are onboarding a small number of automation pilots.
```

### Copy EN

```text
Bring your current spreadsheet. We will import your vendor list, configure your reminder rules, and run one real follow-up workflow with your team.

You keep control over templates, escalation logic, and final review decisions.
```

### Komponenty

1. **Scope card**
   - `One workspace`
   - `One real document workflow`
   - `CSV import support`
   - `Approved email templates`
   - `Weekly exception review`

2. **What we need from you**
   - Current tracker or sample CSV.
   - 10–30 representative vendors.
   - One owner for escalation decisions.
   - Approval of message templates and cadence.

3. **CTA card**
   - Primary: `Apply for a pilot` / `Request a pilot`.
   - Secondary: `Book a discovery call`.
   - Microcopy: `We will first confirm whether your workflow is a fit.`

### Wymagania komunikacyjne

- Nie pokazuj „Only 3 spots left”, jeśli liczba miejsc nie jest dynamicznie utrzymywana przez biznes.
- Nie komunikuj ceny na pierwszym smoke teście jako głównego CTA. Przygotuj komponent `FoundingPricingNote` za feature flagą, do uruchomienia dla testu oferty `$99/month`.
- Gdy pricing note jest aktywna, copy ma mówić: `Founding pilot pricing starts at $99/month after fit confirmation.`

---

## 2.11. FAQ — `FaqSection`

### Cel

Rozbroić pytania o kontrolę, bezpieczeństwo, brak konta vendora i zakres automatyzacji.

### Wymagane pytania EN

```text
Will the app send emails to vendors automatically?
Does the app automatically approve insurance certificates?
Can a vendor upload without an account?
What happens when a vendor does not respond?
Can we track documents beyond COIs?
Can we start with one building or project?
```

### Wymagania odpowiedzi

- Odpowiedź na automatyczne maile: tylko według zatwierdzonych przez zespół reguł i template’ów, z możliwością pause/manual approval.
- Odpowiedź na approval: `No`; system automatyzuje collection, routing, reminders i record keeping, a finalna weryfikacja jest po stronie zespołu.
- Odpowiedź na uploads: secure, scoped magic link; bez konta vendora.
- Odpowiedź na brak response: konfiguracja cadence, następnie escalation do ownera/managera.
- Używaj standardowego `Accordion` z semantycznymi buttonami, nie własnego niedostępnego widgetu.
- Pierwsze pytanie może być domyślnie rozwinięte; wszystkie pozostałe zamknięte.

### Mobile i desktop

- Maksymalna szerokość FAQ 760–840 px; długi wiersz obniża czytelność.
- Miejsce kliknięcia obejmuje cały wiersz pytania.
- Ikona chevron ma być dekoracyjna; stan expanded ma wynikać z `aria-expanded`.

---

## 2.12. Formularz zgłoszeniowy + handoff do kalendarza — `PilotForm`

### Cel

Zebrać kwalifikowany lead bez tworzenia nadmiernego tarcia i bez zmuszania do natychmiastowej rezerwacji calla.

### ID i CTA destination

```html
<section id="pilot-form" aria-labelledby="pilot-form-heading"></section>
```

### Pola obowiązkowe

| Pole               | Typ                  | Walidacja                                                                  | Analityka                    |
| ------------------ | -------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| Work email         | email                | poprawny e-mail służbowy; nie blokuj darmowych domen, jedynie oznacz w CRM | `lead_email_entered` po blur |
| First name         | text                 | 2–80 znaków                                                                | —                            |
| Company            | text                 | 2–120 znaków                                                               | —                            |
| Role               | text/select          | 2–100 znaków                                                               | —                            |
| Company type       | select               | Property management / General contractor / Facilities / Other              | `company_type_selected`      |
| Active vendors     | select               | 1–25 / 26–100 / 101–250 / 250+                                             | `vendor_volume_selected`     |
| Current process    | select               | Spreadsheet / Shared drive / Existing software / Other                     | `current_process_selected`   |
| Monthly follow-ups | select/text          | liczba lub zakres; pozwól wybrać `Not sure`                                | `follow_up_volume_selected`  |
| Biggest pain       | textarea, opcjonalne | max 800 znaków                                                             | —                            |
| Privacy consent    | checkbox             | wymagane                                                                   | —                            |

### UX formularza

- Użyj single-column form nawet na desktopie, z logicznymi parami tylko tam, gdzie nie pogarsza to czytelności.
- Każdy input ma widoczny label; placeholder jest wyłącznie przykładem, nie etykietą.
- Walidacja ma nastąpić po `blur`, a pełna walidacja po submit.
- Błąd jest powiązany z inputem przez `aria-describedby`; nie stosuj wyłącznie czerwonego koloru.
- Submit button: `Apply for an automation pilot` / `Request a pilot`.
- Stan loading: blokuj powtórny submit, zachowaj widoczny tekst i loader.
- Stan success: nie tylko toast. Zastąp formularz ekranem potwierdzenia z następnym krokiem i opcją rezerwacji rozmowy.

### Po sukcesie

```text
Thanks — we have your pilot request.

Next: book a 20-minute workflow call, or we will follow up by email within one business day.

[Book a workflow call]
```

- Przekaż email, locale, campaign i UTM do calendar URL, ale nie wstawiaj ciężkiego iframe Calendly przed kliknięciem.
- Po kliknięciu otwórz calendar w nowej karcie albo jako lazy-loaded dialog, zależnie od używanego dostawcy.
- Pokaż link do Privacy Policy pod formularzem.

### Backend / API

Route handler `/api/lead` ma:

1. walidować payload Zod schema po stronie serwera;
2. usuwać/ignorować honeypot;
3. stosować rate limit po IP + e-mail hash;
4. rejestrować locale, campaign, source, UTM, referrer, timestamp;
5. wysyłać dane do CRM/email provider;
6. zwracać minimalną odpowiedź bez ujawniania szczegółów wewnętrznych;
7. nie wysyłać analitycznych danych osobowych do providerów, którzy nie są do tego skonfigurowani.

### Antyspam

- Hidden honeypot field z `tabIndex={-1}` i bez widocznego labela dla użytkownika; nie oznaczaj go `display:none`.
- Rate limiting.
- Opcjonalnie Turnstile dopiero po obserwacji spamu; nie wdrażaj CAPTCHA domyślnie, bo obniży konwersję.

---

## 2.13. Final CTA — `FinalCta`

### Cel

Zamknąć stronę komunikatem opartym na rezultacie, nie powtórzyć hero mechanicznie.

### Copy EN

```text
Stop treating vendor document follow-up as a memory test.

Run one real workflow with your current vendor list and see which exceptions your team no longer has to chase manually.

[Apply for an automation pilot]
```

### Implementacja

- Tło może być `foreground` z jasnym tekstem albo `primary`; wybierz tylko jeden mocny odwrócony blok na stronie.
- CTA prowadzi do formularza, nie do zewnętrznej strony.
- Zachowaj kontrast AA dla tekstu, borderów i focus state.

---

## 2.14. Footer — `SiteFooter`

### Zawartość

- Wordmark.
- Jednozdaniowe objaśnienie produktu: `Automated vendor-document follow-ups with human review where it matters.`
- Linki: `Privacy`, `Terms`, `Contact`.
- Linki do wariantów segmentów i language switcher.
- Copyright z bieżącym rokiem.
- Nie dodawaj rozbudowanej mapy strony, social icon row ani newslettera bez realnej potrzeby.

### Wymogi prawne komunikacji

Na stronie Privacy i Terms umieść czytelny disclaimer:

```text
The product helps teams collect, route, and track vendor documents. It does not provide legal, insurance, brokerage, or compliance advice, and it does not automatically determine whether a document satisfies contractual or regulatory requirements.
```

---

# Krok 3: Internacjonalizacja (i18n)

## 3.1. Model routingu

Zastosuj `next-intl` z EN jako default locale.

```ts
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});
```

Docelowe URL:

```text
/property-management
/contractors
/pl/property-management
/pl/contractors
```

Zasady:

- Nie przekierowuj użytkownika automatycznie na podstawie języka przeglądarki. Angielski jest językiem głównym kampanii, a zmiana języka ma być świadoma.
- Zachowaj wybór języka w cookie i przy kolejnych wejściach respektuj go po stronie routingu, bez zrywania UTM.
- Nie używaj query parametru typu `?lang=pl` jako głównej metody lokalizacji.
- Każdy wariant locale ma osobny canonical i `hreflang`.

## 3.2. Struktura słowników

```text
messages/
├── en.json
└── pl.json
```

Rekomendowany fragment:

```json
{
  "Landing": {
    "common": {
      "primaryCta": "Apply for an automation pilot",
      "viewWorkflow": "See the 3-minute workflow",
      "language": "Language"
    },
    "propertyManagement": {
      "hero": {
        "eyebrow": "Vendor document follow-up automation",
        "title": "Stop manually chasing vendors for expiring documents.",
        "description": "Automate COI, license, and compliance-document follow-ups — then review only the exceptions that need your attention."
      }
    }
  }
}
```

Zasady tłumaczeń:

- Nie tłumacz literalnie marketingowego copy, jeśli polska wersja wymaga naturalniejszej składni.
- Zachowaj logiczne znaczenie `submitted`, `in review`, `verified`, `escalated`. Zdefiniuj słownik statusów i wykorzystuj go konsekwentnie.
- Nazwy dokumentów typu `COI`, `W-9` pozostaw bez tłumaczenia, gdy jest to naturalne dla rynku docelowego.
- Tekst w mockupach UI również musi korzystać ze słowników; nie zostawiaj angielskiego tekstu w polskim route.
- Daty i liczby w kalkulatorze formatuj `Intl.NumberFormat(locale)`.
- Currency field w kalkulatorze domyślnie używa USD dla obu kampanii startowych; nie zakładaj, że Polish locale oznacza sprzedaż w PLN. Dopisz przełącznik waluty tylko wtedy, gdy staje się częścią testu rynkowego.

## 3.3. Language Switcher — `LanguageSwitcher`

### Wymagania UI

- Desktop: kompaktowy button `EN` / `PL` z ikoną `Languages` albo text-only toggle.
- Mobile: ten sam komponent w menu, nie osobny logicznie niespójny switcher.
- Użyj menu/listbox tylko, jeśli w przyszłości będą więcej niż dwa języki. Dla EN/PL preferuj dwa wyraźne linki lub prosty `DropdownMenu`.
- Aktualny locale jest przekazywany przez `aria-current="true"` albo wizualnie i programowo oznaczony jako selected.
- Text-only `EN` i `PL` są wystarczające; nie używaj flag państw, ponieważ język nie jest tożsamy z krajem.

### Zachowanie

1. Zachowaj aktualny segment i anchor, np. `/contractors#pilot-form` → `/pl/contractors#pilot-form`.
2. Zachowaj `utm_*` tylko przy pierwszym wejściu; nie multiplikuj parametrów podczas kolejnych przełączeń.
3. Zapisz preferencję locale w cookie.
4. Wyślij event `language_changed` z `from_locale`, `to_locale`, `campaign_segment`, `current_section`.
5. Po zmianie języka ustaw focus na `main` lub headline bieżącej sekcji, aby użytkownik klawiatury znał kontekst zmiany.

## 3.4. SEO lokalizacji

Każda strona musi zawierać alternates:

```ts
alternates: {
  canonical: "/property-management",
  languages: {
    en: "/property-management",
    pl: "/pl/property-management",
    "x-default": "/property-management"
  }
}
```

- Nie używaj automatycznych tłumaczeń generowanych w runtime.
- Nie duplikuj identycznego angielskiego copy pod polskim URL.
- OG image ma zawierać tekst w aktualnym języku, ale nie może upychać pełnego H1 drobną typografią.

## 3.5. Definition of Done dla i18n

- Żadna widoczna fraza nie jest hard-coded w landing components.
- Przełączenie EN ↔ PL zachowuje segment i nie prowadzi do 404.
- Locale jest poprawne w `<html lang>`.
- Formularz, błędy, sukces, kalkulator i FAQ są zlokalizowane.
- Googlebot otrzymuje dostęp do właściwych canonical i alternate URLs.

---

# Krok 4: Szlify UI/UX, animacje i performance

## 4.1. System interakcji

### Motion

Stosuj ruch jako informację zwrotną, nie dekorację.

| Element        | Interakcja                                                      | Czas / charakter     | Reduced motion      |
| -------------- | --------------------------------------------------------------- | -------------------- | ------------------- |
| Buttons        | subtelna zmiana surface/border + `translateY(-1px)` na hover    | 160–200 ms, ease-out | tylko zmiana koloru |
| Cards          | cień i border na hover, bez skakania layoutu                    | 180–220 ms           | statyczny hover     |
| Header         | transition tła i borderu po scroll                              | 180–240 ms           | bez blur animation  |
| Workflow cards | `fade + y: 12px` po wejściu w viewport, tylko raz               | 300–420 ms           | render natychmiast  |
| Status pill    | delikatny opacity transition przy zmianie przykładowego statusu | 180–240 ms           | bez animacji        |
| Accordion      | naturalna wysokość, bez agresywnego spring                      | 200–260 ms           | natychmiast         |
| Form success   | fade in, focus management                                       | 200 ms               | natychmiast         |

### Framer Motion

- Użyj `LazyMotion` z `domAnimation`.
- Dynamicznie importuj sekcję z animacją tylko gdy nie jest above-the-fold.
- Nie korzystaj z `layout` animations na złożonych tabelach/mockupach, jeśli powodują CLS.
- Użyj `useReducedMotion()` i CSS `@media (prefers-reduced-motion: reduce)`.
- Zero parallax przy przewijaniu, zero cursor-follow, zero automatycznych marquee, zero długich liczników bez realnych danych.

## 4.2. Wysokiej jakości visual design

### Whitespace i rytm

- Base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- Odstęp między H2 a lead: 16–24 px.
- Odstęp między sekcjami: 80–112 px mobile oraz 112–160 px desktop, zależnie od gęstości poprzedniej sekcji.
- Nie oddzielaj każdej sekcji pełnoekranową zmianą tła; stosuj 2–3 rytmiczne powierzchnie na całą stronę.
- Karty mają różnić się hierarchią przez content, border i cień, nie przez losowe kolory.

### Cienie, bordery i promienie

- Podstawowa karta: biały `surface`, 1 px `border`, `radius-xl`, delikatny `shadow-card` dopiero w miejscach, które wymagają warstwy.
- Hero mockup: `shadow-elevated`, ale bez mocnego blur/gradient glow.
- CTA primary: pełna powierzchnia `primary`; secondary: transparentne tło, border, czytelny hover.
- Nie używaj jednocześnie dużego cienia, grubego bordera i koloru tła na każdej karcie.

### Ikonografia

- Ikona służy do wzmacniania semantyki, nie zastępuje nagłówka.
- Domyślny rozmiar: 18–22 px w chipie 36–40 px.
- Wszystkie ikony z jednej rodziny Lucide; jednolita grubość stroke.
- Ikony statusów mają być dodatkowe wobec tekstu statusu, nigdy jedyne źródło informacji.

## 4.3. Dostępność

### Wymagania obowiązkowe

- Kontrast normalnego tekstu minimum 4.5:1; tekstu dużego minimum 3:1.
- Wszystkie działania są wykonalne przez klawiaturę.
- Focus-visible nie może zostać wyłączony globalnie; użyj wyraźnego ringa o odpowiednim kontraście.
- Nagłówki zachowują kolejność `h1 → h2 → h3`.
- Nie pomijaj `<label>`; placeholder nie zastępuje labela.
- Formularz komunikuje błędy tekstowo, wizualnie i programowo.
- Dialog/Sheet blokuje focus wewnątrz i zwraca focus do triggera po zamknięciu.
- CTA linkujące do kotwicy mają czytelny cel (`Apply for a pilot — opens pilot application form`).
- Wszystkie obrazy informacyjne mają alt; ozdobne SVG `aria-hidden="true"`.
- Testuj przy 200% zoom oraz 320 CSS px szerokości.

### Axe i ręczne testy

Automatyzacja nie zastępuje testu manualnego. Sprawdź ręcznie:

1. tab order;
2. menu mobile;
3. language switcher;
4. form errors;
5. accordion;
6. focus po submit;
7. reduced motion;
8. kontrast status badges;
9. sensowność copy bez ikon i kolorów.

## 4.4. Performance i Core Web Vitals

### Budżety

| Metryka             | Cel produkcyjny                                                                      |
| ------------------- | ------------------------------------------------------------------------------------ |
| LCP                 | ≤ 2.5 s w mobile field data / Lighthouse jako pre-flight                             |
| CLS                 | ≤ 0.1                                                                                |
| INP                 | ≤ 200 ms                                                                             |
| Initial JS          | minimalny; brak ciężkiego dashboard library powyżej folda                            |
| Font loading        | jedna rodzina variable font przez `next/font`                                        |
| Third-party scripts | brak przed consentem lub interaction, poza koniecznym measurement zgodnym z polityką |

### Reguły implementacyjne

- Hero preview twórz jako CSS/HTML/SVG; nie importuj wideo jako LCP asset.
- Jeżeli dodasz demo video, renderuj poster lightweight i załaduj player dopiero po kliknięciu. Nie autoplay i nie pobieraj pliku video przed interakcją.
- Używaj `next/image` dla bitmap; podawaj `sizes`, stały aspect ratio i poprawny `priority` wyłącznie dla rzeczywistego LCP image.
- Nie umieszczaj ponad foldem dużych PNG screenshotów; użyj live DOM mockupu lub zoptymalizowanego AVIF/WebP.
- Nie importuj całego `lucide-react`; importuj ikony nazwane.
- Nie importuj Framer Motion do całej strony przez jeden client root. Ogranicz jego granicę do modułów animowanych.
- Nie używaj globalnej biblioteki chartów dla ROI calculatora; wynik to tekst + mały progress visualization CSS/SVG, jeśli potrzebny.
- Ustal `width` i `height` albo `aspect-ratio` dla każdego media blocka, aby uniknąć CLS.
- Preconnect tylko do naprawdę używanych originów; nie dodawaj preconnectów „na zapas”.
- Sprawdź bundle analyzer przed publikacją i usuń biblioteki, których używa jedna mała funkcja.

## 4.5. Analytics i eksperymenty

### Event taxonomy

```ts
export const analyticsEvents = {
  landingViewed: "landing_viewed",
  headerCtaClicked: "header_primary_cta_clicked",
  heroCtaClicked: "hero_primary_cta_clicked",
  workflowViewed: "workflow_section_viewed",
  workflowCtaClicked: "workflow_cta_clicked",
  roiCalculatorCompleted: "roi_calculator_completed",
  pilotCtaClicked: "pilot_cta_clicked",
  pilotFormStarted: "pilot_form_started",
  pilotFormSubmitted: "pilot_form_submitted",
  pilotFormFailed: "pilot_form_failed",
  calendarOpened: "calendar_opened",
  languageChanged: "language_changed",
  campaignSegmentChanged: "campaign_segment_changed",
  faqOpened: "faq_opened",
} as const;
```

Minimalny wspólny kontekst każdego eventu:

```text
locale
campaign_segment
page_path
utm_source
utm_medium
utm_campaign
referrer_type
experiment_name
experiment_variant
```

### Zasady eksperymentów

- W jednym eksperymencie zmieniaj tylko jeden element: segment, hero messaging, CTA label, proof of value lub lead magnet.
- Nie mieszaj property i contractorów w jednym formularzu A/B bez zapisu segmentu.
- Zdefiniuj success metric przed uruchomieniem testu:
  - primary: `pilot_form_submitted` albo `calendar_opened` po kwalifikacji;
  - guardrail: completion rate formularza oraz jakość leadu w CRM.
- Zapisuj wariant w cookie/local storage, aby użytkownik wracający widział ten sam wariant.

## 4.6. Security, privacy i niezawodność formularza

- Nie loguj pełnych payloadów formularza w browser console, analytics ani error trackerze.
- Użyj environment variables do CRM, e-mail provider i Calendar URL.
- Ustaw security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Form endpoint ma minimalny rate limit, honeypot i walidację serwerową.
- Podczas awarii CRM zachowaj lead w bezpiecznej kolejce lub przynajmniej zwróć użytkownikowi uczciwy komunikat oraz przechwyć błąd w monitoring.
- Nie pokazuj użytkownikowi surowego błędu API.

---

# Krok 5: Plan implementacji w kolejności wykonawczej

## Faza A — Fundament i content model

1. Utwórz repozytorium i zainstaluj pakiety z Kroku 1.
2. Wdróż `next-intl`, locale routing, layout, font oraz design tokens.
3. Utwórz `CampaignConfig`, navigation config i puste słowniki EN/PL.
4. Zaimplementuj metadata, sitemap, robots, OG image i trust pages.
5. Dodaj shared primitives: `Container`, `SectionHeading`, `StatusBadge`, `Button` variants.
6. Ustaw linting, formatting, typecheck, Playwright i axe.

**Checkpoint:** `/property-management`, `/contractors`, `/pl/property-management` i `/pl/contractors` renderują poprawnie, nawet gdy sekcje zawierają jeszcze tymczasowy layout.

## Faza B — Above the fold i podstawowa nawigacja

1. Zaimplementuj header desktop/mobile wraz z segment switcherem i language switcherem.
2. Zaimplementuj hero w dwóch wariantach tekstowych.
3. Zbuduj DOM-based `WorkflowPreview` z czytelnymi statusami.
4. Dodaj Trust Principles bez social proof placeholders.
5. Dodaj tracking wszystkich CTA powyżej folda.

**Checkpoint:** użytkownik w 5 sekund rozumie produkt, różnicę między automatyzacją a auto-approval oraz może przejść do formularza lub workflow.

## Faza C — Narrative i UI produktu

1. Dodaj Problem Section.
2. Dodaj Automation Section.
3. Dodaj Workflow Timeline.
4. Dodaj Exception-first Product Preview.
5. Dodaj Benefit Grid.
6. Przejrzyj całą sekwencję na 375, 768 i 1440 px; usuń powtórzenia copy i sekcje bez konkretnej wartości.

**Checkpoint:** strona komunikuje pełny loop `detect → request → follow up → upload → review → escalation` bez potrzeby oglądania filmu.

## Faza D — Konwersja i integracje

1. Wdróż ROI calculator.
2. Wdróż beta offer.
3. Wdróż FAQ z contentem zgodnym z obietnicą produktu.
4. Wdróż Pilot Form z Zod, server validation, honeypot i rate limit.
5. Skonfiguruj CRM / lead email / calendar handoff przez environment variables.
6. Dodaj Success State i event tracking.

**Checkpoint:** użytkownik może samodzielnie zostawić kwalifikowany lead, otrzymać potwierdzenie i przejść do rozmowy bez blokującego iframe.

## Faza E — Polish, quality i publikacja

1. Dodaj motion zgodny z `prefers-reduced-motion`.
2. Zoptymalizuj assety, bundle i third-party scripts.
3. Wdróż semantic metadata per locale/segment oraz JSON-LD FAQ.
4. Uruchom testy E2E, axe, Lighthouse i manual QA.
5. Ustaw monitoring błędów, event dashboard i alert dla submit errors.
6. Opublikuj jako soft launch z utworzonymi UTM dla każdego segmentu.

---

# Krok 6: Testy, acceptance criteria i Definition of Done

## 6.1. Testy jednostkowe / komponentowe

| Obszar             | Minimalne testy                                                     |
| ------------------ | ------------------------------------------------------------------- |
| `CampaignConfig`   | poprawny route, CTA label i content key dla obu segmentów           |
| `leadSchema`       | odrzuca niepoprawny email, puste obowiązkowe pola i nadmierny tekst |
| `RoiCalculator`    | poprawnie liczy godziny; nie pokazuje kosztu bez hourly cost        |
| `LanguageSwitcher` | buduje URL dla tej samej kampanii i locale docelowego               |
| `PilotForm`        | wyświetla błędy i nie double-submituje                              |

## 6.2. Krytyczne scenariusze Playwright

```text
1. EN Property → hero CTA → pilot form → poprawne submit → success state.
2. EN Contractor → mobile navigation → switch to PL → zachowany segment i działający CTA.
3. PL Property → FAQ → keyboard navigation → visible focus state.
4. ROI calculator → update two values → result and analytics completion event.
5. Invalid form → accessible inline errors → first invalid field receives focus.
6. Mobile 375 px → no horizontal page overflow; CTA is visible and usable.
7. prefers-reduced-motion → no entering/looping animations.
```

## 6.3. Manual UI review

Sprawdź przed publikacją na Chrome, Safari i Firefox:

- H1 nie ma osieroconych pojedynczych słów i nie łamie się nieestetycznie na desktop/mobile.
- Żaden section heading nie jest zbyt szeroki.
- Wszystkie status colors nadal są zrozumiałe bez koloru.
- Focus ring jest widoczny na każdym tle.
- Header nie zasłania anchor target po scrollu.
- Formularz jest wygodny na urządzeniu dotykowym.
- Mobile menu może być zamknięte przez `Escape`, backdrop i kliknięcie linku.
- Wersja PL nie ma angielskich fragmentów w mockupach, success state ani error messages.
- Nie ma fałszywego social proof, obecnie niepotwierdzonych liczb ani prawnych obietnic.

## 6.4. Lighthouse pre-flight

Uruchom osobno dla EN property i PL contractor na mobile oraz desktop.

| Kategoria      | Minimalny wynik | Warunek dodatkowy                                                |
| -------------- | --------------- | ---------------------------------------------------------------- |
| Performance    | 90+             | Hero / CTA nie powodują wysokiego LCP lub CLS.                   |
| Accessibility  | 95+             | Każdy zgłoszony problem przeanalizowany, nie tylko zignorowany.  |
| Best Practices | 95+             | Brak błędów third-party i mixed content.                         |
| SEO            | 95+             | Canonical, lang, description, robots i indexability są poprawne. |

## 6.5. Ostateczna Definition of Done

Landing page jest gotowy do publikacji wyłącznie, gdy:

- ma osobne, spójne warianty Property Management i Contractors, bez duplikacji komponentów;
- renderuje EN domyślnie oraz pełną, naturalną wersję PL;
- jasno komunikuje automatyzację follow-upów oraz manualny charakter finalnego review;
- posiada działający, bezpieczny i mierzalny formularz pilota;
- zachowuje mobile-first, dostępność klawiaturową, kontrast i reduced motion;
- ma kompletny SEO setup dla obu języków i kampanii;
- spełnia performance budgets i nie ładuje ciężkich assetów/SDK przed interakcją;
- ma testy krytycznych flow oraz dashboard zdarzeń konwersyjnych;
- nie stosuje niepotwierdzonych claimów, klientów, wyników, testimonials ani automatycznego compliance approval.

---

# Appendix A: Zalecane teksty CTA

| Kontekst        | EN — Property                 | EN — Contractors                  | PL                                |
| --------------- | ----------------------------- | --------------------------------- | --------------------------------- |
| Primary hero    | Apply for an automation pilot | Request a pilot                   | Zgłoś się do pilota automatyzacji |
| Secondary hero  | See the 3-minute workflow     | Get the vendor-document checklist | Zobacz workflow w 3 minuty        |
| Product section | See the workflow              | See what can block work           | Zobacz workflow                   |
| Beta section    | Apply for a pilot             | Request a pilot                   | Zgłoś się do pilota               |
| Form success    | Book a workflow call          | Book a workflow call              | Umów rozmowę o workflow           |

Zasady:

- CTA ma opisywać kolejne działanie, nie używać ogólnego `Learn more`, `Get started` ani `Submit`.
- Nie stosuj dwóch primary buttonów o tej samej wizualnej wadze w jednym viewportcie.
- CTA w header, hero, beta section i final CTA mogą prowadzić do tego samego formularza, ale event source musi być różny.

---

# Appendix B: Przykładowe pliki konfiguracyjne

## `src/config/landing-campaigns.ts`

```ts
import type { CampaignConfig, CampaignSegment } from "@/types/landing";

export const campaigns: Record<CampaignSegment, CampaignConfig> = {
  "property-management": {
    segment: "property-management",
    path: "/property-management",
    primaryCtaEvent: "pilot_apply_clicked",
    heroVisualMode: "portfolio",
    leadMagnet: "follow-up-cadence",
    formDefaults: {
      companyType: "Property management",
    },
  },
  contractors: {
    segment: "contractors",
    path: "/contractors",
    primaryCtaEvent: "pilot_request_clicked",
    heroVisualMode: "mobilization",
    leadMagnet: "document-checklist",
    formDefaults: {
      companyType: "General contractor",
    },
  },
};
```

## `src/lib/lead-schema.ts`

```ts
import { z } from "zod";

export const leadSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  workEmail: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(100),
  companyType: z.enum([
    "Property management",
    "General contractor",
    "Facilities",
    "Other",
  ]),
  activeVendors: z.enum(["1-25", "26-100", "101-250", "250+"]),
  currentProcess: z.enum([
    "Spreadsheet",
    "Shared drive",
    "Existing software",
    "Other",
  ]),
  monthlyFollowUps: z.string().trim().min(1).max(40),
  biggestPain: z.string().trim().max(800).optional(),
  privacyConsent: z.literal(true),
  campaignSegment: z.enum(["property-management", "contractors"]),
  locale: z.enum(["en", "pl"]),
  honeypot: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

---

# Appendix C: Zakazy implementacyjne

- Nie buduj całej strony jako `"use client"`.
- Nie wdrażaj ciężkiego video, iframe calendar ani chat widgetu above the fold.
- Nie twórz dark mode, dopóki nie ma zatwierdzonego projektu i potrzeby biznesowej.
- Nie kopiuj identycznie struktury każdego SaaS landing page’a z „logos → testimonial → pricing”, gdy nie ma autentycznych danych.
- Nie dodawaj `Trusted by`, testimoniali, G2 badges, klientów ani benchmarków bez potwierdzonego źródła i zgody.
- Nie przedstawiaj automatyzacji jako systemu legal/compliance decision engine.
- Nie ustawiaj statusu `Verified` w hero mockupie bez pokazania uprzedniego kroku manual review.
- Nie używaj flag w language switcherze.
- Nie ukrywaj labeli formularza w placeholderach.
- Nie używaj animation loops, scroll-jacking, horyzontalnych karuzel na mobile ani hover-only interakcji.
- Nie przechodź do wdrożenia produkcyjnego bez uruchomienia testów mobile, keyboard, reduced motion, i18n oraz submit error handling.
