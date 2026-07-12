# Prompty do poprawek wizualnych landing page

Kontekst wspólny: aplikacja to landing page SaaS B2B dla Vendoor Proof. Produkt automatyzuje follow-upy dokumentów dostawców, certyfikatów COI, licencji i wymogów compliance. Aktualna strona wygląda nowocześnie i premium, ale wymaga dopracowania detali, rytmu i wiarygodności polskiej wersji.

## 1. Popraw polskie znaki i wiarygodność copy

```text
Przejrzyj całą polską wersję landing page Vendoor Proof i popraw wszystkie braki polskich znaków, literówki oraz niezgrabne sformułowania. Szczególnie sprawdź meta title, nagłówki, CTA, FAQ, stopkę i teksty w mockupach, jeśli są renderowane jako tekst.

Cel: polska wersja ma brzmieć naturalnie, profesjonalnie i wiarygodnie dla odbiorcy B2B z branży nieruchomości, compliance i zarządzania dostawcami.

Nie zmieniaj sensu oferty ani struktury strony. Zachowaj obecny ton: konkretny, operacyjny, bez marketingowego przesadyzmu. Popraw m.in. formy typu "dokumentow", "dostawcow", "automatyzacja follow-upow" na poprawne formy z polskimi znakami, jeżeli występują w UI, metadanych lub treściach.

Po zmianach wypisz krótką listę poprawionych miejsc i sprawdź, czy polskie znaki poprawnie renderują się w przeglądarce.
```

## 2. Skróć i zróżnicuj środkowe sekcje

```text
Przeprojektuj środkową część landing page tak, aby usunąć wrażenie powtarzalności układu "karta, mockup, karta, mockup". Zachowaj najważniejsze informacje o workflow, automatyzacji przypomnień, weryfikacji i eskalacji, ale popraw rytm strony.

Cel: strona ma być krótsza, bardziej dynamiczna i łatwiejsza do przeskanowania. Użytkownik powinien szybciej zrozumieć proces bez czytania kilku podobnych sekcji.

Zasady:
- Nie usuwaj kluczowych argumentów produktu: kontrola nad wysyłką, brak kont dla dostawców, weryfikacja przez człowieka, eskalacje i widoczność wyjątków.
- Połącz sekcje, które powtarzają podobny komunikat.
- Zmień kompozycję przynajmniej jednej sekcji: zamiast kolejnych kart użyj osi procesu, tabeli operacyjnej, split-view z listą decyzji albo zwartego panelu statusów.
- Zachowaj styl premium SaaS B2B, ale ogranicz dekoracyjne karty tam, gdzie nie niosą nowej informacji.
- Pilnuj responsywności i czytelności na mobile.

Na koniec sprawdź wizualnie stronę w desktopie i mobile oraz wskaż, które sekcje zostały skrócone lub połączone.
```

## 3. Uczytelnij hero mockup produktu

```text
Popraw hero mockup aplikacji na landing page Vendoor Proof. Obecnie wygląda efektownie, ale dolna część jest zbyt zamglona i produkt działa bardziej jako nastrój niż konkretny dowód wartości.

Cel: mockup w hero ma nadal wyglądać premium, ale powinien być czytelniejszy i bardziej przekonujący. Użytkownik ma od razu zobaczyć, że produkt pokazuje kolejkę dokumentów, statusy, follow-up automation, zadania reviewera i ryzyka.

Zasady:
- Zmniejsz intensywność blur/fade na mockupie.
- Podnieś kontrast najważniejszych elementów UI w mockupie.
- Nie przesadzaj z cieniami ani szkłem; zachowaj elegancki, enterprise'owy styl.
- Upewnij się, że mockup nie konkuruje z nagłówkiem i CTA.
- Zachowaj mocny ciemnozielony hero, ale spraw, aby screenshot produktu był bardziej "dowodem działania" niż dekoracją.

Zweryfikuj hero na szerokim desktopie, laptopie i mobile. Sprawdź, czy tekst i CTA nadal są pierwszym punktem uwagi, a mockup jest wystarczająco czytelny.
```

## 4. Dodaj subtelny drugi akcent kolorystyczny

```text
Rozszerz paletę wizualną landing page Vendoor Proof o subtelny drugi i trzeci akcent kolorystyczny, aby strona nie była zdominowana przez mint/green.

Cel: zachować spokojny, compliance'owy charakter marki, ale poprawić rozróżnialność stanów i zmniejszyć jednonutowość wizualną.

Proponowany kierunek:
- Mint/green: sukces, automatyzacja, zaakceptowane, aktywne.
- Amber/yellow: termin, ostrzeżenie, dokument wygasa wkrótce.
- Soft blue: weryfikacja, informacja, kolejka review.
- Soft red: eskalacja, ryzyko, zaległy dokument.

Zasady:
- Nie rób z tego kolorowej aplikacji konsumenckiej. Akcenty mają być funkcjonalne i oszczędne.
- Użyj kolorów głównie w badge'ach, ikonach, statusach, wykresach i elementach mockupów.
- Nie zmieniaj głównego charakteru brandu.
- Zachowaj dobry kontrast tekstu i zgodność wizualną między sekcjami.
- Sprawdź, czy nowe kolory pomagają zrozumieć statusy, a nie są tylko ozdobą.

Po wdrożeniu porównaj hero, workflow i sekcję wyjątków. Wskaż, gdzie akcenty poprawiają czytelność stanu lub ryzyka.
```

## 5. Pokazuj thank-you state tylko po prawdziwym wysłaniu formularza

```text
Popraw logikę i UX sekcji "Dziękujemy - mamy Twoje zgłoszenie do pilota" na landing page Vendoor Proof. Ten stan nie powinien być widoczny jako zwykła sekcja strony przed faktycznym wysłaniem formularza.

Cel: uniknąć mylącego wrażenia, że użytkownik już wysłał zgłoszenie. Thank-you state ma pojawiać się dopiero po skutecznym submit formularza albo po potwierdzonym stanie sukcesu.

Zasady:
- Przed wysłaniem formularza pokaż normalny formularz lub CTA do umówienia rozmowy.
- Po skutecznym submit pokaż komunikat sukcesu: "Dziękujemy - mamy Twoje zgłoszenie do pilota."
- Jeżeli formularz jest obsługiwany zewnętrznie, pokaż thank-you state tylko po potwierdzeniu sukcesu, nie po samym kliknięciu CTA.
- Dodaj stan błędu, jeżeli submit się nie powiedzie.
- Zachowaj obecny styl wizualny karty sukcesu, ale użyj jej warunkowo.
- Sprawdź, czy refresh strony nie pokazuje przypadkowo stanu sukcesu bez wysłania formularza.

Zweryfikuj flow ręcznie: stan początkowy, submit udany, submit nieudany, odświeżenie strony po powrocie do landing page.
```

