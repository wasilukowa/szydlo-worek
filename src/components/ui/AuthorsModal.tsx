import { useState } from 'react'
import type { Author, Pattern } from '../../types'

const inputClass = "w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-zinc-400"
const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1"

function patternType(p: Pattern): string {
  if (p.isCal) return 'CAL'
  if (p.isTest) return 'TEST'
  return 'Wzór'
}

function typeColor(p: Pattern): string {
  if (p.isCal) return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
  if (p.isTest) return 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
  return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
}

function getPatternsForAuthor(author: Author, patterns: Pattern[]): Pattern[] {
  return patterns.filter(p =>
    p.author.split(',').some(a => a.trim().toLowerCase() === author.name.toLowerCase())
  )
}

interface AuthorFormState {
  name: string
  www: string
  facebook: string
  instagram: string
}

interface AuthorsModalProps {
  authors: Author[]
  patterns: Pattern[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Author, 'id'>>) => void
  onClose: () => void
}

export function AuthorsModal({ authors, patterns, onAdd, onRemove, onUpdate, onClose }: AuthorsModalProps) {
  const [selected, setSelected] = useState<Author | null>(null)
  const [form, setForm] = useState<AuthorFormState>({ name: '', www: '', facebook: '', instagram: '' })
  const [newName, setNewName] = useState('')

  const openAuthor = (a: Author) => {
    setSelected(a)
    setForm({
      name: a.name,
      www: a.www ?? '',
      facebook: a.facebook ?? '',
      instagram: a.instagram ?? '',
    })
  }

  const saveAuthor = () => {
    if (!selected || !form.name.trim()) return
    onUpdate(selected.id, {
      name: form.name.trim(),
      www: form.www.trim() || undefined,
      facebook: form.facebook.trim() || undefined,
      instagram: form.instagram.trim() || undefined,
    })
    setSelected(null)
  }

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim())
      setNewName('')
    }
  }

  // ── Detail view ──────────────────────────────────────────────
  if (selected) {
    const authorPatterns = getPatternsForAuthor(selected, patterns)

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wszyscy autorzy
        </button>

        {/* Dane autora */}
        <section className="space-y-3">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Dane autora</p>
          <div>
            <label className={labelClass}>Imię / pseudonim</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
          </div>
        </section>

        {/* Social media */}
        <section className="space-y-3">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Social media</p>
          <div>
            <label className={labelClass}>WWW</label>
            <input type="url" value={form.www} onChange={e => setForm(f => ({ ...f, www: e.target.value }))} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Facebook</label>
            <input type="url" value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} placeholder="https://facebook.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input type="text" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@nazwa lub https://..." className={inputClass} />
          </div>
        </section>

        {/* Wzory autora */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Wzory ({authorPatterns.length})
          </p>
          {authorPatterns.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 py-2">Brak powiązanych wzorów</p>
          ) : (
            <ul className="space-y-1 max-h-48 overflow-y-auto">
              {authorPatterns.map(p => (
                <li key={p.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${typeColor(p)}`}>
                    {patternType(p)}
                  </span>
                  <span className="text-sm text-zinc-800 dark:text-zinc-200 flex-1 truncate">{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => { onRemove(selected.id); setSelected(null) }}
            className="py-2 px-4 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
          >
            Usuń autora
          </button>
          <button
            type="button"
            onClick={saveAuthor}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
          >
            Zapisz
          </button>
        </div>
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Dodaj nowego */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nowy autor..."
          className={inputClass}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shrink-0"
        >
          Dodaj
        </button>
      </div>

      {/* Lista */}
      {authors.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-8">Baza autorów jest pusta</p>
      ) : (
        <ul className="space-y-1 max-h-[28rem] overflow-y-auto">
          {authors.map(a => {
            const count = getPatternsForAuthor(a, patterns).length
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => openAuthor(a)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{a.name}</p>
                    {(a.www || a.facebook || a.instagram) && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                        {[a.www, a.facebook, a.instagram].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  {count > 0 && (
                    <span className="text-xs text-zinc-400 shrink-0">{count} wzorów</span>
                  )}
                  <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Zamknij
        </button>
      </div>
    </div>
  )
}
