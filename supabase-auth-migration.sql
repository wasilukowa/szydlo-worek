-- Szydło-Worek — migracja auth (multi-user)
-- Uruchom jednorazowo w Supabase Dashboard → SQL Editor

-- 1. Dodaj user_id do tabel (domyślnie auth.uid() przy insercie)
alter table authors  add column if not exists user_id uuid references auth.users(id) on delete cascade not null default auth.uid();
alter table patterns add column if not exists user_id uuid references auth.users(id) on delete cascade not null default auth.uid();
alter table motki    add column if not exists user_id uuid references auth.users(id) on delete cascade not null default auth.uid();

-- 2. Włącz Row Level Security
alter table authors  enable row level security;
alter table patterns enable row level security;
alter table motki    enable row level security;

-- 3. Polityki — każdy user widzi/edytuje wyłącznie swoje rekordy
create policy "authors: własne rekordy"  on authors  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "patterns: własne rekordy" on patterns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "motki: własne rekordy"    on motki    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Storage — bucket "szydlo-worek"
--    Ścieżka pliku w aplikacji: {user_id}/covers/... lub {user_id}/pdfs/...
--    Polityki muszą być ustawione przez Supabase Dashboard lub storage API.
--    Poniższe zapytania działają jeśli bucket już istnieje.

insert into storage.buckets (id, name, public)
  values ('szydlo-worek', 'szydlo-worek', true)
  on conflict (id) do nothing;

-- Odczyt publiczny (publiczne URL dla okładek)
create policy "storage: publiczny odczyt"
  on storage.objects for select
  using (bucket_id = 'szydlo-worek');

-- Upload / update / delete — tylko właściciel katalogu (user_id = pierwsza część ścieżki)
create policy "storage: własne pliki — upload"
  on storage.objects for insert
  with check (
    bucket_id = 'szydlo-worek'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: własne pliki — update"
  on storage.objects for update
  using (
    bucket_id = 'szydlo-worek'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage: własne pliki — delete"
  on storage.objects for delete
  using (
    bucket_id = 'szydlo-worek'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
