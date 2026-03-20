# Szydło-Worek 🧶

Osobista biblioteka wzorów do szydełkowania i robienia na drutach. Aplikacja webowa do zarządzania kolekcją wzorów — wzorów standardowych, CAL-i (Crochet/Knit Along) oraz wzorów testowych.

## Funkcje

### Typy wpisów
- **Wzór** — standardowy zakupiony lub bezpłatny wzór
- **CAL** (Crochet/Knit Along) — wzory z harmonogramem publikacji i datami trwania
- **Testy** — wzory oddane do testowania z datą zakończenia

### Zarządzanie wzorami
- Dodawanie, edytowanie i usuwanie wzorów
- Miniatura z okładką lub automatycznie generowany gradient z pierwszą literą nazwy
- Tagi z filtrowaniem wielokrotnym
- Notatki
- Metraż (zakres od–do)
- Przechowywanie pliku PDF/zdjęcia wzoru (base64)

### Dynamiczne statusy
- **CAL**: automatycznie wyświetla „start za X dni", „w trakcie" lub „zakończony" na podstawie dat
- **Testy**: wyświetla „X dni do końca" lub „zakończone" na podstawie daty końca

### Baza autorów
- Zapis autorów z danymi kontaktowymi (www, Facebook, Instagram)
- Autouzupełnianie przy wpisywaniu w polu autora
- Obsługa wielu autorów oddzielonych przecinkami
- Podgląd wzorów powiązanych z danym autorem

### Filtrowanie i wyszukiwanie
- Wyszukiwanie po nazwie i autorze
- Filtrowanie po statusie (kupiony, w trakcie, ukończony, porzucony)
- Filtrowanie po tagach (wielokrotny wybór)

### Interfejs
- Tryb jasny / ciemny
- Responsywny układ siatki (2–5 kolumn)
- Daty w formacie dd/mm/rrrr

## Technologie

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- `localStorage` — dane przechowywane lokalnie w przeglądarce

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja dostępna pod adresem `http://localhost:5173`.

## Struktura projektu

```
src/
├── components/
│   ├── layout/       # Header
│   ├── patterns/     # PatternCard, PatternForm, PatternDetail, StatusBadge
│   └── ui/           # Modal, AuthorsModal, AuthorInput, TagInput, DateInput
├── hooks/            # usePatterns, useAuthors, useTheme
├── lib/              # storage, colors, dateStatus
└── types/            # typy TypeScript
```
