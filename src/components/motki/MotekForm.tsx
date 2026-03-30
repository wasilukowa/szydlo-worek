import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Motek, Pattern } from '../../types'
import { uploadFile } from '../../lib/storage'
import { COLORS } from '../../lib/colors'

interface MotekFormProps {
  initial?: Motek
  patterns: Pattern[]
  onSave: (motek: Motek) => Promise<void>
  onCancel: () => void
  onQuickAddPattern: (pattern: Pattern) => void
}

const inputClass = "w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-zinc-400"
const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5"
const fieldClass = "mb-4"

type PatternType = 'wzor' | 'cal' | 'test'

function patternTypeLabel(p: Pattern): string {
  if (p.isCal) return 'CAL'
  if (p.isTest) return 'Test'
  return 'Wzór'
}

function patternTypeBadgeClass(p: Pattern): string {
  if (p.isCal) return COLORS.cal.badgeSoft
  if (p.isTest) return COLORS.test.badgeSoft
  return COLORS.wzor.badgeSoft
}

function Toggle({ checked, onChange, color = 'amber' }: { checked: boolean; onChange: (v: boolean) => void; color?: string }) {
  const bg = checked
    ? color === 'amber' ? 'bg-amber-500' : 'bg-violet-500'
    : 'bg-zinc-200 dark:bg-zinc-700'
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative" onClick={() => onChange(!checked)}>
        <div className={`w-10 h-6 rounded-full transition-colors ${bg}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
      </div>
    </label>
  )
}

// Mini modal for quick pattern add — rendered as an overlay inside the form
function QuickAddModal({
  onAdd,
  onClose,
}: {
  onAdd: (name: string, type: PatternType) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<PatternType>('wzor')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const submit = () => {
    if (!name.trim()) { setError('Podaj nazwę wzoru'); return }
    onAdd(name.trim(), type)
  }

  const TYPE_OPTIONS: { value: PatternType; label: string; colors: string }[] = [
    { value: 'wzor', label: 'Wzór', colors: `${COLORS.wzor.badgeSoft} border border-violet-200 dark:border-violet-800` },
    { value: 'cal', label: 'CAL', colors: `${COLORS.cal.badgeSoft} border border-rose-200 dark:border-rose-800` },
    { value: 'test', label: 'Test', colors: `${COLORS.test.badgeSoft} border border-teal-200 dark:border-teal-800` },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Szybkie dodanie wzoru</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <label className={labelClass}>Nazwa wzoru *</label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="np. Sweterek jesienny"
            className={inputClass}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className={labelClass}>Typ</label>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  type === opt.value
                    ? opt.colors + ' ring-2 ring-offset-1 ring-current'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Pozostałe szczegóły możesz uzupełnić później edytując wzór w bibliotece.
        </p>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-semibold hover:border-zinc-400 transition-colors">
            Anuluj
          </button>
          <button type="button" onClick={submit} className="flex-1 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm">
            Dodaj
          </button>
        </div>
      </div>
    </div>
  )
}

export function MotekForm({ initial, patterns, onSave, onCancel, onQuickAddPattern }: MotekFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const [metrage, setMetrage] = useState(initial?.metrage?.toString() ?? '')
  const [hasDowijka, setHasDowijka] = useState(initial?.hasDowijka ?? false)
  const [dowijkaMetrage, setDowijkaMetrage] = useState(initial?.dowijkaMetrage?.toString() ?? '')
  const [inUse, setInUse] = useState(initial?.inUse ?? false)
  const [patternId, setPatternId] = useState(initial?.patternId ?? '')
  const [firma, setFirma] = useState(initial?.firma ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(initial?.imageUrl ?? '')
  const [komentarz, setKomentarz] = useState(initial?.komentarz ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const [patternSearch, setPatternSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedPattern = patterns.find(p => p.id === patternId)

  const filteredPatterns = patternSearch.trim()
    ? patterns.filter(p =>
        p.name.toLowerCase().includes(patternSearch.toLowerCase()) ||
        p.author.toLowerCase().includes(patternSearch.toLowerCase())
      )
    : patterns

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!metrage || isNaN(Number(metrage)) || Number(metrage) <= 0) {
      e.metrage = 'Podaj prawidłowy metraż'
    }
    if (hasDowijka && dowijkaMetrage && (isNaN(Number(dowijkaMetrage)) || Number(dowijkaMetrage) <= 0)) {
      e.dowijkaMetrage = 'Podaj prawidłowy metraż dowijki'
    }
    return e
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl('')
  }

  const clearImage = () => {
    setPendingImageFile(null)
    setImagePreview('')
    setImageUrl('')
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSaving(true)
    try {
      let finalImageUrl = imageUrl
      if (pendingImageFile) {
        finalImageUrl = await uploadFile(pendingImageFile, 'motki')
      }
      const now = new Date().toISOString()
      const motek: Motek = {
        id: initial?.id ?? uuidv4(),
        metrage: Number(metrage),
        hasDowijka,
        dowijkaMetrage: hasDowijka && dowijkaMetrage ? Number(dowijkaMetrage) : undefined,
        inUse,
        patternId: inUse && patternId ? patternId : undefined,
        firma: firma.trim() || undefined,
        imageUrl: finalImageUrl || undefined,
        komentarz: komentarz.trim() || undefined,
        createdAt: initial?.createdAt ?? now,
        updatedAt: now,
      }
      await onSave(motek)
    } finally {
      setSaving(false)
    }
  }

  const handleQuickAdd = (name: string, type: PatternType) => {
    const now = new Date().toISOString()
    const today = now.split('T')[0]
    const newPattern: Pattern = {
      id: uuidv4(),
      name,
      author: '',
      price: 0,
      currency: 'PLN',
      purchaseDate: today,
      status: 'purchased',
      tags: [],
      isCal: type === 'cal',
      isTest: type === 'test',
      createdAt: now,
      updatedAt: now,
    }
    onQuickAddPattern(newPattern)
    setPatternId(newPattern.id)
    setDropdownOpen(false)
    setPatternSearch('')
    setShowQuickAdd(false)
  }

  return (
    <div className="space-y-1">
      {showQuickAdd && (
        <QuickAddModal
          onAdd={handleQuickAdd}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {/* Metraż */}
      <div className={fieldClass}>
        <label className={labelClass}>Metraż (m) *</label>
        <input
          type="number"
          min="1"
          value={metrage}
          onChange={e => { setMetrage(e.target.value); setErrors(prev => ({ ...prev, metrage: '' })) }}
          placeholder="np. 400"
          className={inputClass}
        />
        {errors.metrage && <p className="text-xs text-red-500 mt-1">{errors.metrage}</p>}
      </div>

      {/* Dowijka */}
      <div className={fieldClass}>
        <div className="flex items-center gap-3">
          <Toggle checked={hasDowijka} onChange={setHasDowijka} />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Dowijka</span>
        </div>
      </div>

      {/* Metraż dowijki */}
      {hasDowijka && (
        <div className={fieldClass}>
          <label className={labelClass}>Metraż dowijki (m)</label>
          <input
            type="number"
            min="1"
            value={dowijkaMetrage}
            onChange={e => { setDowijkaMetrage(e.target.value); setErrors(prev => ({ ...prev, dowijkaMetrage: '' })) }}
            placeholder="np. 200"
            className={inputClass}
          />
          {errors.dowijkaMetrage && <p className="text-xs text-red-500 mt-1">{errors.dowijkaMetrage}</p>}
        </div>
      )}

      {/* Motek w użyciu */}
      <div className={fieldClass}>
        <div className="flex items-center gap-3">
          <Toggle checked={inUse} onChange={v => { setInUse(v); if (!v) setPatternId('') }} color="violet" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Motek w użyciu</span>
        </div>
      </div>

      {/* Pattern selector */}
      {inUse && (
        <div className={fieldClass} ref={dropdownRef}>
          <label className={labelClass}>Wzór / projekt</label>

          {selectedPattern ? (
            <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border ${COLORS.wzor.border} ${COLORS.wzor.bg}`}>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{selectedPattern.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${patternTypeBadgeClass(selectedPattern)}`}>
                    {patternTypeLabel(selectedPattern)}
                  </span>
                  {selectedPattern.author && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{selectedPattern.author}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPatternId('')}
                className="shrink-0 p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                title="Odepnij wzór"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={patternSearch}
                  onChange={e => { setPatternSearch(e.target.value); setDropdownOpen(true) }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Szukaj wzoru w bazie..."
                  className={`${inputClass} pl-9`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                  {filteredPatterns.length > 0 ? (
                    filteredPatterns.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setPatternId(p.id); setDropdownOpen(false); setPatternSearch('') }}
                        className="w-full px-3 py-2.5 text-left flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                        <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${patternTypeBadgeClass(p)}`}>
                          {patternTypeLabel(p)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-zinc-900 dark:text-zinc-100 truncate">{p.name}</p>
                          {p.author && <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{p.author}</p>}
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-3 text-sm text-zinc-400 dark:text-zinc-500 text-center">Brak wyników</p>
                  )}

                  {/* Quick add divider */}
                  <div className="border-t border-zinc-100 dark:border-zinc-700">
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setDropdownOpen(false); setShowQuickAdd(true) }}
                      className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm font-medium">Dodaj nowy wzór do bazy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Firma */}
      <div className={fieldClass}>
        <label className={labelClass}>Firma</label>
        <input
          type="text"
          value={firma}
          onChange={e => setFirma(e.target.value)}
          placeholder="np. Drops, Lana Grossa..."
          className={inputClass}
        />
      </div>

      {/* Zdjęcie */}
      <div className={fieldClass}>
        <label className={labelClass}>Zdjęcie</label>
        {imagePreview || imageUrl ? (
          <div className="flex items-start gap-3">
            <img src={imagePreview || imageUrl} alt="Podgląd" className="w-20 h-20 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700" />
            <button type="button" onClick={clearImage} className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium mt-1 transition-colors">
              Usuń zdjęcie
            </button>
          </div>
        ) : (
          <div>
            <input
              ref={imageInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className="hidden"
              id="motek-image-input"
            />
            <label
              htmlFor="motek-image-input"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 dark:text-zinc-400 hover:border-amber-400 hover:text-amber-600 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Wybierz zdjęcie
            </label>
          </div>
        )}
      </div>

      {/* Komentarz */}
      <div className={fieldClass}>
        <label className={labelClass}>Komentarz</label>
        <textarea
          value={komentarz}
          onChange={e => setKomentarz(e.target.value)}
          placeholder="Notatki o motku, kolorze, strukturze..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-semibold hover:border-zinc-400 transition-colors">
          Anuluj
        </button>
        <button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-sm">
          {saving ? 'Zapisuję...' : initial ? 'Zapisz' : 'Dodaj motek'}
        </button>
      </div>
    </div>
  )
}
