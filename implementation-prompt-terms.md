# Prompt dla agenta — wdrożenie dwujęzycznego Regulaminu VendoorProof

## Rola

Działasz jako Senior Frontend Engineer specjalizujący się w React, Next.js, TypeScript, dostępności WCAG, systemach i18n oraz wdrażaniu dokumentów prawnych w produktach SaaS B2B.

Masz wdrożyć dwujęzyczny Regulamin VendoorProof. Nie przebudowuj całej aplikacji ani stopki. Najpierw zbadaj istniejący projekt i dopasuj implementację do aktualnej architektury, routingu, komponentów oraz design systemu.

## Pliki wejściowe

Użyj treści z:

- `content/legal/terms.pl.md`
- `content/legal/terms.en.md`

Jeżeli repozytorium używa innej konwencji katalogów, umieść dokumenty we właściwym miejscu bez zmiany ich znaczenia.

## Etap 1 — obowiązkowy audyt projektu

Przed implementacją:

1. Odczytaj pliki kontekstu i postępu projektu wymagane przez repozytorium.
2. Sprawdź:
   - framework i wersję;
   - sposób routingu;
   - mechanizm i18n;
   - istniejący komponent dialogu;
   - sposób renderowania Markdown/MDX;
   - formularze kontaktowe, pilota, waitlisty i newslettera;
   - proces tworzenia konta i logowania;
   - proces zakupu, subskrypcji i fakturowania;
   - faktycznie działające funkcje produktu;
   - system wysyłki wiadomości do dostawców;
   - storage, backupy, eksport i usuwanie danych;
   - integracje i dostawców zewnętrznych;
   - istniejące Privacy Policy, DPA, SLA i Security Policy;
   - strukturę stopki i przełączanie języka.
3. Nie zakładaj, że funkcja albo dostawca są aktywne tylko dlatego, że występują w zależnościach. Zweryfikuj kod wykonywany w produkcji.
4. Nie publikuj żadnego tokenu `[[...]]`. Brak wymaganej wartości ma zatrzymać build produkcyjny.

## Etap 2 — centralna konfiguracja prawna

Rozszerz istniejący plik konfiguracji prawnej albo utwórz np. `src/config/legal.ts`.

Konfiguracja powinna zawierać co najmniej:

```ts
export const legalConfig = {
  serviceProviderLegalName: "",
  legalForm: "",
  registeredAddress: "",
  vatNumber: "",
  registrationNumber: "",
  contactEmail: "",
  complaintsEmail: "",
  securityEmail: "",
  illegalContentOrAbuseEmail: "",
  privacyPolicyUrl: {
    pl: "/pl/privacy",
    en: "/en/privacy",
  },
  termsUrl: {
    pl: "/pl/terms",
    en: "/en/terms",
  },
  termsArchiveUrl: null,
  technicalRequirementsUrl: null,
  supportPolicyUrl: null,
  paymentTermDays: null,
  noticePeriodDays: null,
  exportWindowDays: null,
  primaryDeletionDays: null,
  backupRetentionDays: null,
  freeServiceLiabilityCapPln: null,
  effectiveDate: "2026-07-14",
  version: "1.0",
} as const;
```

Dodaj walidację uruchamianą podczas builda. Pola obowiązkowe nie mogą mieć wartości pustej, `null`, `undefined` ani zawierać `[[`.

Nie duplikuj danych spółki w wielu komponentach. Stopka, Privacy Policy i Terms powinny korzystać z jednego źródła prawdy.

## Etap 3 — link w stopce

Podłącz istniejący link:

- PL: `Regulamin`
- EN: `Terms`

Wymagania:

- prawdziwy adres URL;
- brak `href="#"`;
- działanie bez JavaScript jako zwykła podstrona;
- zachowanie aktualnej typografii i układu stopki;
- widoczne stany `hover`, `focus-visible` i aktywny;
- nie zmieniaj kolejności `Privacy`, `Terms`, `Contact`, chyba że projekt ma inną ustaloną kolejność.

## Etap 4 — modal oparty na routingu

Kliknięcie w stopce ma otwierać Regulamin w modalu, ale dokument musi mieć również działający bezpośredni URL.

Docelowe zachowanie:

- kliknięcie linku zmienia URL na lokalizowaną trasę, np. `/pl/terms` lub `/en/terms`;
- modal pojawia się nad poprzednim widokiem;
- wejście bezpośrednio na trasę lub odświeżenie renderuje pełną stronę albo dostępny dialog z prawidłowym fallbackiem;
- przycisk Wstecz zamyka modal;
- zamknięcie modala przywraca poprzedni URL bez przeładowania;
- kopiowanie adresu daje działający link do właściwej wersji językowej.

Dopasuj wzorzec do stacku:

- **Next.js App Router:** parallel/intercepting routes oraz zwykła strona jako fallback;
- **React Router:** route modal pattern z `backgroundLocation`;
- **inny router:** równoważny wzorzec oparty na historii.

Nie implementuj tego wyłącznie przez lokalny `useState`, jeżeli psuje to deep-link, odświeżanie lub przycisk Wstecz.

## Etap 5 — dostępność dialogu

Użyj istniejącego komponentu dialogowego. Jeżeli go nie ma, użyj dostępnego już Radix/shadcn albo semantycznego `<dialog>`. Nie dodawaj ciężkiej biblioteki tylko dla tego zadania.

Dialog musi:

- mieć właściwą semantykę `dialog` i `aria-modal`;
- mieć tytuł powiązany przez `aria-labelledby`;
- przenieść fokus po otwarciu;
- zatrzymywać fokus wewnątrz;
- zamykać się klawiszem `Escape`;
- przywracać fokus do linku `Terms`;
- blokować przewijanie tła;
- działać przy powiększeniu 200%;
- mieć dostępny przycisk zamknięcia;
- respektować `prefers-reduced-motion`;
- nie zamykać się po kliknięciu w treść;
- opcjonalnie zamykać się po kliknięciu w backdrop.

## Etap 6 — wygląd

Zachowaj styl VendoorProof:

- jasne tło;
- subtelna ramka;
- duży border radius;
- delikatny cień;
- akcent teal;
- spokojna typografia;
- bez ciężkich gradientów.

Rekomendowane parametry:

- `width: min(960px, calc(100vw - 32px))`;
- `max-height: 88dvh`;
- osobno przewijana treść;
- sticky header z tytułem, wersją, datą oraz przyciskiem zamknięcia;
- padding desktop 32–40 px;
- padding mobile 20–24 px;
- bezpieczne marginesy i jednostki `dvh` na urządzeniach mobilnych.

Dodaj widoczne akcje:

- `Print / Drukuj`;
- `Open full page / Otwórz pełną stronę`;
- opcjonalnie `Copy link / Kopiuj link`.

Wersja pełnostronicowa musi mieć print CSS pozwalający zapisać dokument do PDF i utrwalić jego treść.

## Etap 7 — renderowanie Markdown

- Preferuj istniejący renderer MDX/Markdown.
- Nie używaj niesanitowanego `dangerouslySetInnerHTML`.
- Obsłuż nagłówki, listy, tabele, pogrubienia i linki.
- Komentarz HTML na początku pliku nie może być widoczny.
- Linki zewnętrzne otwierane w nowej karcie muszą mieć `rel="noopener noreferrer"`.
- Tabele i długie adresy nie mogą łamać layoutu mobilnego.
- Dokument nie powinien trafiać do głównego bundle każdej podstrony, jeżeli może być renderowany serwerowo lub ładowany na żądanie.

## Etap 8 — lokalizacja

- Polska wersja strony ładuje `terms.pl.md`.
- Angielska wersja strony ładuje `terms.en.md`.
- Zmiana języka podczas otwartego modala przełącza dokument oraz trasę.
- Nie tłumacz dokumentu automatycznie przez API.
- Zachowaj wspólny numer wersji i datę obowiązywania.
- Tytuły:
  - PL: `Regulamin`
  - EN: `Terms of Service`

## Etap 9 — akceptacja Regulaminu przed zawarciem Umowy

Samo umieszczenie linku w stopce nie wystarcza dla procesu tworzenia konta lub uruchomienia płatnej/pilotażowej Usługi.

Sprawdź wszystkie flow, które mogą prowadzić do zawarcia Umowy:

- rejestracja konta;
- uruchomienie pilota;
- aktywacja triala;
- zakup Planu;
- zaakceptowanie oferty;
- zaproszenie pierwszego administratora organizacji.

Dla właściwego momentu dodaj niezaznaczony checkbox:

- PL: `Oświadczam, że mam uprawnienie do działania w imieniu organizacji oraz akceptuję Regulamin.`
- EN: `I confirm that I am authorised to act for the organisation and accept the Terms of Service.`

Słowa `Regulamin` / `Terms of Service` muszą być linkiem otwierającym dokument bez utraty danych formularza.

Nie wymagaj akceptacji Regulaminu:

- przy samym przeglądaniu strony;
- w zwykłym formularzu kontaktowym, jeżeli nie zawiera on Umowy;
- przy zapisie do newslettera, gdzie potrzebna jest odrębna zgoda marketingowa.

Nie łącz akceptacji Regulaminu ze zgodą marketingową ani zgodą na opcjonalne cookies.

## Etap 10 — rejestrowanie dowodu akceptacji

Jeżeli aplikacja ma backend i konta, zapisz co najmniej:

- `termsVersion`;
- `termsLocale`;
- `acceptedAt` w UTC;
- identyfikator użytkownika;
- identyfikator organizacji;
- źródło akceptacji, np. `signup`, `pilot`, `checkout`;
- hash albo identyfikator niezmiennej wersji dokumentu.

Nie zapisuj pełnego adresu IP, jeśli nie jest rzeczywiście potrzebny i opisany w Privacy Policy. Jeżeli jest zapisywany, ogranicz retencję i udokumentuj cel.

Akceptacja ma być atomowo związana z utworzeniem organizacji lub uruchomieniem Usługi. Nie twórz aktywnej subskrypcji, gdy zapis akceptacji nie powiedzie się.

## Etap 11 — wersjonowanie i zmiany Regulaminu

Utwórz mechanizm umożliwiający:

- przechowywanie aktualnej i archiwalnych wersji;
- wskazanie wersji zaakceptowanej przez Klienta;
- zmianę daty obowiązywania;
- wymaganie ponownej akceptacji przy zmianie istotnej;
- niewymaganie ponownej akceptacji przy wyłącznie redakcyjnej korekcie, jeżeli prawo i umowa na to pozwalają;
- wyświetlenie użytkownikowi informacji o zmianie z wyprzedzeniem.

Nie zastępuj starego pliku bez zachowania kopii, gdy został zaakceptowany przez istniejących Klientów.

## Etap 12 — zgodność tekstu z produktem

Zweryfikuj każdą sekcję z kodem i dokumentacją:

- rzeczywisty zakres funkcji;
- automatyczne follow-upy i eskalacje;
- ręczna weryfikacja;
- konta, role i MFA;
- limity plików;
- integracje;
- użycie AI;
- trening modeli;
- płatności i automatyczne odnowienie;
- wsparcie i SLA;
- retencja, eksport i usuwanie danych;
- backupy;
- pilota/betę;
- jurysdykcję i dane podmiotu;
- procedurę reklamacyjną;
- zgłoszenia treści bezprawnych;
- limity odpowiedzialności.

Nie publikuj deklaracji niepotwierdzonej przez produkt albo uzgodnioną procedurę.

Jeżeli wartości biznesowej nie można ustalić, dodaj ją do `LEGAL_REVIEW_REQUIRED.md` i zatrzymaj wdrożenie produkcyjne zamiast wymyślać wartość.

## Etap 13 — kwestie wymagające decyzji właściciela

Przed produkcją wymagaj decyzji dla:

1. pełnych danych Usługodawcy;
2. docelowej grupy wyłącznie B2B;
3. okresu wypowiedzenia;
4. terminu płatności;
5. automatycznego odnowienia;
6. limitu odpowiedzialności dla bezpłatnego pilota;
7. okresu eksportu po zakończeniu Umowy;
8. czasu usunięcia danych produkcyjnych;
9. retencji backupów;
10. kanałów i godzin supportu;
11. gwarantowanego SLA albo braku SLA;
12. listy funkcji AI i zasad użycia danych;
13. procedury abuse/illegal content;
14. właściwości sądu dla kontraktów zagranicznych;
15. wersji językowej rozstrzygającej;
16. zasad zwrotów i wcześniejszego zakończenia subskrypcji;
17. zakresu DPA i listy subprocesorów.

## Etap 14 — SEO i metadane

Dla pełnych tras dodaj:

- lokalizowany `title`;
- lokalizowany `description`;
- poprawny `lang`;
- canonical;
- `hreflang`, jeżeli projekt go używa.

Rekomendowane tytuły:

- PL: `Regulamin | VendoorProof`
- EN: `Terms of Service | VendoorProof`

Dokument może być indeksowany. Nie dodawaj `noindex`, chyba że właściciel świadomie zdecyduje inaczej.

## Etap 15 — testy

Dodaj testy odpowiednie dla stacku.

Minimum:

1. `Regulamin` otwiera polski dokument.
2. `Terms` otwiera angielski dokument.
3. Bezpośrednie wejście na obie trasy działa po odświeżeniu.
4. Przycisk Wstecz zamyka modal.
5. `Escape` zamyka modal.
6. Fokus wraca do linku otwierającego.
7. Zmiana języka przełącza treść i URL.
8. W buildzie produkcyjnym nie występuje `[[`.
9. Numer wersji i data są spójne w obu językach.
10. Checkbox akceptacji nie jest domyślnie zaznaczony.
11. Nie można aktywować Usługi bez wymaganej akceptacji.
12. Zapis akceptacji zawiera wersję, locale i czas UTC.
13. Link Terms w checkboxie nie kasuje danych formularza.
14. Modal działa na urządzeniu mobilnym i przy 200% zoom.
15. Print view nie zawiera nawigacji, backdropu ani przycisku zamknięcia.
16. Lint, typecheck, testy i build przechodzą.

Przeprowadź ręczny audyt klawiaturą i sprawdź kontrast.

## Definition of Done

Zadanie jest ukończone, gdy:

- oba pliki Markdown są podłączone;
- link w stopce działa w obu językach;
- modal ma prawdziwe lokalizowane trasy;
- dokument jest dostępny bez JavaScript;
- można go zapisać lub wydrukować;
- żaden placeholder nie trafia na produkcję;
- dane prawne są centralnie skonfigurowane;
- wszystkie kontraktowe flow zapewniają Regulamin przed zawarciem Umowy;
- dowód akceptacji jest wersjonowany i zapisany;
- istotne zmiany mogą wymagać ponownej akceptacji;
- tekst odpowiada rzeczywistemu produktowi i sprzedaży;
- testy oraz build przechodzą;
- powstała lista kwestii wymagających przeglądu prawnego.

## Raport końcowy agenta

Na końcu przedstaw:

1. listę zmienionych plików;
2. zastosowany wzorzec routingu modala;
3. sposób zapewnienia dostępności;
4. pełne adresy URL wersji PL i EN;
5. sposób drukowania i utrwalania Regulaminu;
6. miejsca, w których wymagane jest zaakceptowanie dokumentu;
7. schemat zapisywania dowodu akceptacji;
8. wykryty model płatności, odnowienia, pilota i SLA;
9. rzeczywiste okresy eksportu, usuwania i backupów;
10. uzupełnione pola prawne;
11. kwestie niepotwierdzone i wymagające decyzji;
12. wyniki lint, typecheck, testów i builda.
