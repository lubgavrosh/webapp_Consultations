# Zapisy na konsultacje

Projekt grupowy z przedmiotu *Metody opracowywania interfejsów użytkownika* (UKEN, 2026/27, prowadząca: mgr inż. Aleksandra Olszyńska).

Temat 5 · Zespół 5 · grupa LB1

## Skład zespołu

- Daniel Klymenko (177954)
- Liubomyr Havrosh (177907)

## Opis

Aplikacja webowa, w której student wyszukuje wolny termin konsultacji, zapisuje się na niego i może zrezygnować z wizyty, a prowadzący udostępnia terminy (data, godzina, sala lub link, limit miejsc).

Stan na L6: szkielet aplikacji – ekran startowy z nawigacją, lista terminów ze szczegółami, formularz zapisu z podstawową walidacją oraz ekrany „Moje zapisy” i „Terminy prowadzącego” (jeszcze puste).

## Technologia

HTML, CSS i JavaScript (bez frameworka). Dane w pliku `app/dane/terminy.json`, serwer nie jest potrzebny.

## Jak uruchomić

Wymagania: przeglądarka (Chrome, Firefox lub Edge) oraz Python 3 do lokalnego serwera plików.

```text
git clone <adres repozytorium>
cd <folder repozytorium>/app
python -m http.server 8000

2 opcja
cd D:\webapp_Consultations\app
py -3.13 -m http.server 8000
```

Następnie otwórz http://localhost:8000. (Aplikacja wczytuje plik JSON, więc nie działa po otwarciu `index.html` bezpośrednio z dysku.)

## Struktura

```text
app/      kod aplikacji (index.html, style.css, app.js, dane/terminy.json)
docs/     dokumentacja w PDF
```

## Dokumentacja

[docs/dokumentacja.pdf](docs/dokumentacja.pdf)
