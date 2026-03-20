import { useState, useRef, useEffect } from 'react'
import type { Author } from '../../types'

const inputClass = "w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-zinc-400"

interface AuthorInputProps {
  value: string
  onChange: (value: string) => void
  authors: Author[]
  onAddAuthor: (name: string) => void
}

function getCurrentPart(value: string) {
  const parts = value.split(',')
  return parts[parts.length - 1].trimStart()
}

function replaceLastPart(value: string, replacement: string) {
  const parts = value.split(',')
  parts[parts.length - 1] = ' ' + replacement
  return parts.length > 1 ? parts.join(',') : replacement
}

export function AuthorInput({ value, onChange, authors, onAddAuthor }: AuthorInputProps) {
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const currentPart = getCurrentPart(value)

  const filtered = currentPart.trim().length > 0
    ? authors.filter(a => a.name.toLowerCase().includes(currentPart.toLowerCase()))
    : []

  const isNew = currentPart.trim().length > 0 &&
    !authors.some(a => a.name.toLowerCase() === currentPart.trim().toLowerCase())

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestOpen(false)
        setBrowseOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (name: string) => {
    onChange(replaceLastPart(value, name))
    setSuggestOpen(false)
    setBrowseOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault()
      select(filtered[0].name)
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex gap-2">
      {/* Input z autocomplete */}
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setSuggestOpen(true); setBrowseOpen(false) }}
          onFocus={() => { if (currentPart.trim()) setSuggestOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="np. Anna Kowalska, Jan Nowak"
          className={inputClass}
          autoComplete="off"
        />
        {suggestOpen && filtered.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {filtered.map(a => (
              <button
                key={a.id}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => select(a.name)}
                className="w-full px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
              >
                {a.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Przeglądaj bazę */}
      {authors.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => { setBrowseOpen(v => !v); setSuggestOpen(false) }}
            title="Przeglądaj bazę autorów"
            className="h-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          {browseOpen && (
            <div className="absolute z-20 right-0 mt-1 w-56 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-lg overflow-hidden max-h-64 overflow-y-auto">
              <p className="px-3 py-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-700">
                Baza autorów
              </p>
              {authors.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => select(a.name)}
                  className="w-full px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dodaj nowego autora */}
      {isNew && (
        <button
          type="button"
          onClick={() => onAddAuthor(currentPart.trim())}
          title="Dodaj autora do bazy"
          className="px-3 py-2 rounded-lg bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/40 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-sm font-semibold transition-colors shrink-0"
        >
          +
        </button>
      )}
    </div>
  )
}
