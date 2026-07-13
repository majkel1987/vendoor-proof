# Prompt dla agenta — wdrożenie lokalizowanej Polityki prywatności VendoorProof

## Rola

Działasz jako Senior Frontend Engineer specjalizujący się w React, Next.js, TypeScript, dostępności WCAG i privacy by design. Masz wdrożyć w istniejącej aplikacji VendoorProof produkcyjną, dwujęzyczną Politykę prywatności.

Nie przebudowuj całej stopki ani systemu routingu. Najpierw zbadaj istniejący projekt i dopasuj implementację do obecnej architektury, komponentów, design systemu oraz mechanizmu i18n.

## Pliki wejściowe

Użyj treści z:

- `content/legal/privacy-policy.pl.md`
- `content/legal/privacy-policy.en.md`

Jeżeli w repozytorium obowiązuje inna konwencja katalogów, przenieś pliki do właściwego miejsca bez zmiany ich treści merytorycznej.

## Krytyczne wymaganie przed implementacją

1. Odczytaj pliki kontekstu i postępu projektu wymagane przez repozytorium.
2. Sprawdź:
   - framework i wersję;
   - sposób routingu;
   - bibliotekę i18n;
   - istniejący komponent modala/dialogu;
   - sposób renderowania Markdown/MDX;
   - aktualne integracje analityczne, cookies, formularze, hosting, bazę danych, pocztę, uwierzytelnianie i płatności;
   - obecną strukturę stopki i przełączania języka.
3. Nie zakładaj, że narzędzie jest używane tylko dlatego, że występuje w dokumentacji lub zależnościach. Zweryfikuj importy, konfigurację i kod wykonywany w produkcji.
4. Nie publikuj żadnego tokenu `[[...]]`. Wszystkie pola muszą być uzupełnione z centralnej konfiguracji prawnej albo kompilacja produkcyjna ma zostać przerwana czytelnym błędem.

## Architektura prawna treści

Utwórz centralny, typowany plik konfiguracji, np. `src/config/legal.ts`, zawierający co najmniej:

```ts
export const legalConfig = {
  controllerLegalName: "",
  registeredAddress: "",
  registrationOrVatNumber: "",
  privacyEmail: "privacy@vendoorproof.com",
  contactEmail: "",
  dpoDetails: null,
  vendorOrSubprocessorListUrl: null,
  backupRetentionDays: null,
  effectiveDate: "2026-07-13",
} as const;
```

Dodaj walidację produkcyjną. Brak obowiązkowych danych ma zatrzymać build, a nie wyświetlić placeholder użytkownikowi.

Treść polska i angielska musi pozostać znaczeniowo równoważna. Nie tłumacz jej dynamicznie przez API ani model językowy.

## Oczekiwane zachowanie

### Link w stopce

- Podłącz istniejący link `Prywatność` w polskiej wersji.
- Podłącz odpowiednik `Privacy` w angielskiej wersji.
- Link ma mieć prawdziwy adres URL i działać bez JavaScript.
- Zachowaj obecną typografię, odstępy i kolorystykę stopki.
- Dodaj czytelny stan `hover`, `focus-visible` i aktywny.
- Nie używaj `href="#"`.

### Modal oraz bezpośredni adres URL

Wymagany model działania:

- kliknięcie linku w stopce otwiera Politykę prywatności jako modal;
- adres URL zmienia się na lokalizowaną trasę zgodną z obecną konwencją, np. `/pl/privacy` i `/en/privacy`;
- wejście bezpośrednio na adres polityki ma wyświetlić pełnoprawną stronę lub ten sam dialog w sposób działający po odświeżeniu;
- przycisk Wstecz zamyka modal i przywraca poprzedni widok;
- zamknięcie modala przywraca wcześniejszy URL bez przeładowania strony.

Dopasuj rozwiązanie do stacku:

- **Next.js App Router:** preferuj route-based modal z parallel/intercepting routes, zachowując zwykłą stronę jako fallback dla bezpośredniego wejścia;
- **React Router:** użyj route modal pattern z `backgroundLocation`;
- **inny routing:** zastosuj równoważny wzorzec oparty na historii przeglądarki.

Nie buduj modala wyłącznie jako lokalnego `useState`, jeżeli uniemożliwi to linkowanie, odświeżenie lub działanie przycisku Wstecz.

## Wymagania dla komponentu dialogowego

Użyj istniejącego komponentu dialogu z projektu. Jeżeli projekt nie ma takiego rozwiązania, użyj dostępnego już Radix/shadcn lub semantycznego `<dialog>`. Nie dodawaj ciężkiej biblioteki wyłącznie dla jednego modala.

Dialog musi:

- mieć `role="dialog"` i `aria-modal="true"` albo równoważną semantykę natywnego `<dialog>`;
- posiadać dostępny tytuł powiązany przez `aria-labelledby`;
- po otwarciu przenosić fokus do nagłówka lub przycisku zamknięcia;
- utrzymywać fokus wewnątrz;
- zamykać się klawiszem `Escape`;
- przywracać fokus do linku w stopce;
- blokować przewijanie dokumentu pod spodem;
- poprawnie działać przy powiększeniu 200%;
- mieć przycisk zamknięcia z widocznym tekstem dla czytnika ekranu;
- opcjonalnie zamykać się po kliknięciu w backdrop, ale nie po przypadkowym kliknięciu w treść;
- respektować `prefers-reduced-motion`.

## Wygląd

Zachowaj estetykę VendoorProof widoczną w obecnym landingu:

- jasne tło;
- subtelna ramka;
- duży promień narożników;
- delikatny cień;
- akcent teal;
- czytelna, spokojna typografia;
- bez ciężkich gradientów i bez zmiany globalnego design systemu.

Rekomendowane parametry:

- szerokość: `min(920px, calc(100vw - 32px))`;
- wysokość maksymalna: około `85dvh`;
- osobno przewijana treść;
- sticky header z tytułem, datą aktualizacji i przyciskiem zamknięcia;
- padding desktop: 32–40 px;
- padding mobile: 20–24 px;
- na małych ekranach dialog może zajmować prawie cały viewport, ale zachowaj bezpieczne marginesy i obsługę `dvh`.

Treść Markdown powinna mieć stylowany `prose` zgodny z design systemem. Tabele na urządzeniach mobilnych muszą być przewijane poziomo, bez łamania layoutu.

## Renderowanie Markdown

- Preferuj istniejący mechanizm MDX/Markdown.
- Jeżeli go nie ma, użyj lekkiego, utrzymywanego rozwiązania zgodnego z aktualnym stackiem.
- Nie renderuj niesanitowanego HTML przez `dangerouslySetInnerHTML`.
- Wspieraj nagłówki, listy, tabele, pogrubienia, linki i komentarze HTML.
- Komentarz roboczy z początku pliku nie może być widoczny użytkownikowi.
- Linki zewnętrzne otwierane w nowej karcie muszą mieć `rel="noopener noreferrer"`.

## Lokalizacja

- Polska wersja strony zawsze ładuje plik polski.
- Angielska wersja strony zawsze ładuje plik angielski.
- Zmiana języka podczas otwartego modala ma przełączyć treść i trasę na odpowiednik w drugim języku.
- Nie wykrywaj języka wyłącznie na podstawie przeglądarki, jeżeli aplikacja ma już wybrany locale.
- Tytuły dokumentu:
  - PL: `Polityka prywatności`
  - EN: `Privacy Policy`

## Cookies i analityka — obowiązkowa weryfikacja

Przed zakończeniem zadania sprawdź faktyczny kod produkcyjny:

1. Czy działa Vercel Web Analytics?
2. Czy działa Vercel Speed Insights?
3. Czy używane są Google Analytics, Meta Pixel, Hotjar, PostHog, Microsoft Clarity, reCAPTCHA, YouTube embed, chat widget lub inne narzędzia zapisujące/odczytujące informacje z urządzenia?
4. Czy formularze wysyłają dane do zewnętrznego operatora?
5. Czy istnieje mechanizm zgody i możliwość jej wycofania?

Następnie:

- usuń z obu dokumentów niewłaściwe warianty A/B/C w sekcji „Aktualna konfiguracja”;
- pozostaw wyłącznie opis zgodny z rzeczywistym wdrożeniem;
- jeżeli działa narzędzie opcjonalne wymagające zgody, zablokuj jego inicjalizację do czasu zgody;
- nie traktuj samego wejścia na stronę, przewijania ani zamknięcia bannera jako zgody;
- zapewnij przycisk umożliwiający ponowne otwarcie „Ustawień prywatności”;
- jeżeli serwis używa wyłącznie technologii ściśle niezbędnych i cookieless analytics niewymagającej zgody w danej konfiguracji, nie dodawaj zbędnego bannera cookie. Udokumentuj decyzję w podsumowaniu wdrożenia.

## Zgodność produktu z treścią polityki

Sprawdź i dopasuj tekst do faktycznych funkcji:

- formularz kontaktowy;
- lista oczekujących/pilot;
- konta użytkowników;
- logowanie;
- wysyłanie e-maili;
- przechowywanie dokumentów;
- automatyczne follow-upy;
- ręczna weryfikacja;
- billing;
- support;
- analityka;
- retencja i backupy;
- dostawcy i transfery poza EOG.

Nie deklaruj funkcji, dostawcy, okresu retencji ani zabezpieczenia, którego nie potwierdza kod, konfiguracja lub dokumentacja projektu. W przypadku braku informacji:

- dodaj pozycję do `LEGAL_REVIEW_REQUIRED.md`;
- pozostaw bezpieczny, prawdziwy opis ogólny;
- nie wymyślaj danych.

## SEO i metadane

Dla samodzielnych tras polityki dodaj:

- lokalizowany `title`;
- lokalizowany `description`;
- `canonical`;
- poprawne `lang`;
- alternatywne wersje językowe, jeżeli projekt korzysta z `hreflang`.

Nie dodawaj tekstu prawnego do zwykłego bundle klienta dla każdej podstrony, jeżeli można go ładować tylko na żądanie lub renderować po stronie serwera.

## Testy

Dodaj lub zaktualizuj testy na poziomie właściwym dla projektu.

Minimum:

1. Link `Prywatność` otwiera polską treść.
2. Link `Privacy` otwiera angielską treść.
3. Bezpośrednie wejście na każdą trasę działa po odświeżeniu.
4. `Escape` zamyka modal.
5. Fokus wraca do linku otwierającego.
6. Przycisk Wstecz zamyka modal.
7. W dokumencie produkcyjnym nie występuje `[[`.
8. Tytuł i treść odpowiadają locale.
9. Modal nie wychodzi poza viewport mobilny.
10. Całość przechodzi istniejący lint, typecheck, testy i build.

Przeprowadź również ręczny audyt klawiaturą i sprawdź kontrast elementów interaktywnych.

## Definition of Done

Zadanie jest ukończone dopiero, gdy:

- oba pliki Markdown są podłączone do aplikacji;
- stopka otwiera poprawną wersję językową;
- dialog jest dostępny i responsywny;
- istnieją działające, bezpośrednie trasy URL;
- nie ma nieuzupełnionych placeholderów;
- sekcja cookies odpowiada faktycznemu kodowi;
- podane okresy retencji odpowiadają konfiguracji i procedurom;
- dostawcy oraz transfery danych są zweryfikowane;
- build produkcyjny, lint, typecheck i testy przechodzą;
- agent utworzył krótkie podsumowanie zmian oraz listę kwestii wymagających decyzji właściciela.

## Wymagany raport końcowy agenta

Na końcu podaj:

1. listę zmienionych plików;
2. opis zastosowanego wzorca routingu modala;
3. sposób obsługi dostępności;
4. faktycznie wykryte cookies, analitykę i zewnętrznych dostawców;
5. pola prawne, które zostały uzupełnione;
6. kwestie, których nie można było potwierdzić;
7. wyniki lint/typecheck/test/build;
8. dwa adresy URL polityki prywatności.
