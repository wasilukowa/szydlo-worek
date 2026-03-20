import type { Pattern, Author } from '../types'

const KEY = 'szydlo-worek-patterns'
const AUTHORS_KEY = 'szydlo-worek-authors'

export function getAuthors(): Author[] {
  try {
    const data = localStorage.getItem(AUTHORS_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    // Migration: string[] → Author[]
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      const migrated: Author[] = parsed.map((name: string) => ({
        id: crypto.randomUUID(),
        name,
      }))
      localStorage.setItem(AUTHORS_KEY, JSON.stringify(migrated))
      return migrated
    }
    return parsed
  } catch {
    return []
  }
}

export function saveAuthors(authors: Author[]): void {
  localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors))
}

export function addAuthor(name: string): void {
  const authors = getAuthors()
  const trimmed = name.trim()
  if (trimmed && !authors.some(a => a.name.toLowerCase() === trimmed.toLowerCase())) {
    saveAuthors([...authors, { id: crypto.randomUUID(), name: trimmed }]
      .sort((a, b) => a.name.localeCompare(b.name)))
  }
}

export function removeAuthor(id: string): void {
  saveAuthors(getAuthors().filter(a => a.id !== id))
}

export function updateAuthor(id: string, updates: Partial<Omit<Author, 'id'>>): void {
  saveAuthors(
    getAuthors()
      .map(a => a.id === id ? { ...a, ...updates } : a)
      .sort((a, b) => a.name.localeCompare(b.name))
  )
}

export function getPatterns(): Pattern[] {
  try {
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function savePatterns(patterns: Pattern[]): void {
  localStorage.setItem(KEY, JSON.stringify(patterns))
}

export function addPattern(pattern: Pattern): void {
  const patterns = getPatterns()
  savePatterns([...patterns, pattern])
}

export function updatePattern(updated: Pattern): void {
  const patterns = getPatterns()
  savePatterns(patterns.map(p => p.id === updated.id ? updated : p))
}

export function deletePattern(id: string): void {
  const patterns = getPatterns()
  savePatterns(patterns.filter(p => p.id !== id))
}
