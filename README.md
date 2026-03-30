# Szydło-Worek 🧶

Osobista biblioteka wzorów i baza motków do szydełkowania i robienia na drutach.

**Live:** [szydlo-worek.vercel.app](https://szydlo-worek.vercel.app)

---

## Funkcje

### Wzory — typy wpisów
- **Wzór** — standardowy zakupiony lub bezpłatny wzór
- **CAL** (Crochet/Knit Along) — wzory z harmonogramem publikacji i datami trwania
- **Testy** — wzory oddane do testowania z datą zakończenia

### Zarządzanie wzorami
- Dodawanie, edytowanie i usuwanie wzorów
- Okładka jako plik zdjęcia (upload do Supabase Storage)
- Załącznik PDF lub zdjęcie wzoru (upload do Supabase Storage)
- Tagi z filtrowaniem wielokrotnym
- Notatki
- Metraż (zakres od–do) — do dopasowania z motkami
- Dynamiczne statusy CAL i testów (licznik dni, trwa, zakończony)

### Baza autorów
- Zapis autorów z danymi kontaktowymi (www, Facebook, Instagram)
- Autouzupełnianie przy wpisywaniu
- Obsługa wielu autorów oddzielonych przecinkami
- Podgląd wzorów powiązanych z autorem

### Moje Motki
- Baza motków z metrażem, firmą, zdjęciem i komentarzem
- Dowijka — osobny toggle z polem na metraż dowijki
- **Motek w użyciu** — powiązanie motka z wzorem z bazy (wyszukiwarka + szybkie dodanie nowego wzoru)
- Upload zdjęcia motka do Supabase Storage

### Filtrowanie i wyszukiwanie
- Wyszukiwanie po nazwie i autorze
- Filtrowanie po statusie (kupiony, w trakcie, ukończony, porzucony)
- Filtrowanie po tagach (wielokrotny wybór)

### Interfejs
- Nawigacja zakładkowa: **Wzory** / **Moje Motki**
- Tryb jasny / ciemny
- Responsywny układ siatki (2–5 kolumn)
- Daty w formacie dd/mm/rrrr

---

## Technologie

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — baza danych (PostgreSQL) + Storage na pliki

## Uruchomienie lokalne

Skopiuj `.env.example` do `.env` i uzupełnij klucze Supabase:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

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
│   ├── motki/        # MotekCard, MotekForm, MotekDetail
│   ├── patterns/     # PatternCard, PatternForm, PatternDetail, StatusBadge
│   └── ui/           # Modal, AuthorsModal, AuthorInput, TagInput, DateInput
├── hooks/            # usePatterns, useAuthors, useMotki, useTheme
├── lib/              # supabase, storage, colors, dateStatus
└── types/            # typy TypeScript
```
