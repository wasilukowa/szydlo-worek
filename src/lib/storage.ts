import { supabase, BUCKET } from './supabase'
import type { Pattern, Author, Motek } from '../types'

// ─── File upload ─────────────────────────────────────────────────────────────

export async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(url: string): Promise<void> {
  // Extract path from public URL: .../storage/v1/object/public/bucket/path
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}

// ─── Row ↔ type converters ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPattern(row: any): Pattern {
  return {
    id: row.id,
    name: row.name,
    author: row.author,
    price: row.price,
    currency: row.currency,
    purchaseDate: row.purchase_date,
    status: row.status,
    metrageFrom: row.metrage_from ?? undefined,
    metrageTo: row.metrage_to ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    pdfUrl: row.pdf_url ?? undefined,
    pdfFileName: row.pdf_file_name ?? undefined,
    tags: row.tags ?? [],
    isCal: row.is_cal,
    calDetails: row.cal_details ?? undefined,
    isTest: row.is_test ?? false,
    testEndDate: row.test_end_date ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function patternToRow(p: Pattern) {
  return {
    id: p.id,
    name: p.name,
    author: p.author,
    price: p.price,
    currency: p.currency,
    purchase_date: p.purchaseDate,
    status: p.status,
    metrage_from: p.metrageFrom ?? null,
    metrage_to: p.metrageTo ?? null,
    cover_image_url: p.coverImageUrl ?? null,
    pdf_url: p.pdfUrl ?? null,
    pdf_file_name: p.pdfFileName ?? null,
    tags: p.tags,
    is_cal: p.isCal,
    cal_details: p.calDetails ?? null,
    is_test: p.isTest ?? false,
    test_end_date: p.testEndDate ?? null,
    notes: p.notes ?? null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAuthor(row: any): Author {
  return {
    id: row.id,
    name: row.name,
    www: row.www ?? undefined,
    facebook: row.facebook ?? undefined,
    instagram: row.instagram ?? undefined,
  }
}

function authorToRow(a: Author) {
  return {
    id: a.id,
    name: a.name,
    www: a.www ?? null,
    facebook: a.facebook ?? null,
    instagram: a.instagram ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMotek(row: any): Motek {
  return {
    id: row.id,
    metrage: row.metrage,
    hasDowijka: row.has_dowijka,
    dowijkaMetrage: row.dowijka_metrage ?? undefined,
    inUse: row.in_use,
    patternId: row.pattern_id ?? undefined,
    firma: row.firma ?? undefined,
    imageUrl: row.image_url ?? undefined,
    komentarz: row.komentarz ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function motekToRow(m: Motek) {
  return {
    id: m.id,
    metrage: m.metrage,
    has_dowijka: m.hasDowijka,
    dowijka_metrage: m.dowijkaMetrage ?? null,
    in_use: m.inUse,
    pattern_id: m.patternId ?? null,
    firma: m.firma ?? null,
    image_url: m.imageUrl ?? null,
    komentarz: m.komentarz ?? null,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
  }
}

// ─── Authors ─────────────────────────────────────────────────────────────────

export async function fetchAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name')
  if (error) throw error
  return (data ?? []).map(rowToAuthor)
}

export async function insertAuthor(name: string): Promise<Author | null> {
  const trimmed = name.trim()
  if (!trimmed) return null
  const existing = await supabase
    .from('authors')
    .select('*')
    .ilike('name', trimmed)
    .maybeSingle()
  if (existing.data) return rowToAuthor(existing.data)
  const author: Author = { id: crypto.randomUUID(), name: trimmed }
  const { error } = await supabase.from('authors').insert(authorToRow(author))
  if (error) throw error
  return author
}

export async function patchAuthor(id: string, updates: Partial<Omit<Author, 'id'>>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (updates.name !== undefined) row.name = updates.name
  if (updates.www !== undefined) row.www = updates.www ?? null
  if (updates.facebook !== undefined) row.facebook = updates.facebook ?? null
  if (updates.instagram !== undefined) row.instagram = updates.instagram ?? null
  const { error } = await supabase.from('authors').update(row).eq('id', id)
  if (error) throw error
}

export async function removeAuthor(id: string): Promise<void> {
  const { error } = await supabase.from('authors').delete().eq('id', id)
  if (error) throw error
}

// ─── Patterns ─────────────────────────────────────────────────────────────────

export async function fetchPatterns(): Promise<Pattern[]> {
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToPattern)
}

export async function insertPattern(pattern: Pattern): Promise<void> {
  const { error } = await supabase.from('patterns').insert(patternToRow(pattern))
  if (error) throw error
}

export async function patchPattern(pattern: Pattern): Promise<void> {
  const { error } = await supabase
    .from('patterns')
    .update(patternToRow(pattern))
    .eq('id', pattern.id)
  if (error) throw error
}

export async function removePattern(id: string): Promise<void> {
  const { error } = await supabase.from('patterns').delete().eq('id', id)
  if (error) throw error
}

// ─── Motki ────────────────────────────────────────────────────────────────────

export async function fetchMotki(): Promise<Motek[]> {
  const { data, error } = await supabase
    .from('motki')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToMotek)
}

export async function insertMotek(motek: Motek): Promise<void> {
  const { error } = await supabase.from('motki').insert(motekToRow(motek))
  if (error) throw error
}

export async function patchMotek(motek: Motek): Promise<void> {
  const { error } = await supabase
    .from('motki')
    .update(motekToRow(motek))
    .eq('id', motek.id)
  if (error) throw error
}

export async function removeMotek(id: string): Promise<void> {
  const { error } = await supabase.from('motki').delete().eq('id', id)
  if (error) throw error
}
