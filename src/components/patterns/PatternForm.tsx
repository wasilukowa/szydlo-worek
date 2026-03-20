import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Pattern, Currency, CalSchedulePart } from '../../types'
import { TagInput } from '../ui/TagInput'
import { AuthorInput } from '../ui/AuthorInput'
import { DateInput } from '../ui/DateInput'

interface PatternFormProps {
  initial?: Pattern
  calMode?: boolean
  testMode?: boolean
  authors: string[]
  onAddAuthor: (author: string) => void
  onSave: (pattern: Pattern) => void
  onCancel: () => void
}

const CURRENCIES: Currency[] = ['PLN', 'EUR', 'USD', 'GBP']

const inputClass = "w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-zinc-400"
const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5"
const fieldClass = "mb-4"

function newPart(index: number): CalSchedulePart {
  return { id: uuidv4(), name: `Część ${index}`, publishDate: '' }
}

export function PatternForm({ initial, calMode = false, testMode = false, authors, onAddAuthor, onSave, onCancel }: PatternFormProps) {
  const now = new Date().toISOString().split('T')[0]
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initial?.name ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '0')
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? 'PLN')
  const [purchaseDate, setPurchaseDate] = useState(initial?.purchaseDate ?? now)
  const [metrageFrom, setMetrageFrom] = useState(initial?.metrageFrom?.toString() ?? '')
  const [metrageTo, setMetrageTo] = useState(initial?.metrageTo?.toString() ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? '')
  const [pdfUrl, setPdfUrl] = useState(initial?.pdfUrl ?? '')
  const [pdfFileName, setPdfFileName] = useState(initial?.pdfFileName ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [testEndDate, setTestEndDate] = useState(initial?.testEndDate ?? '')
  const [calStartDate, setCalStartDate] = useState(initial?.calDetails?.startDate ?? '')
  const [calEndDate, setCalEndDate] = useState(initial?.calDetails?.endDate ?? '')
  const [calFbUrl, setCalFbUrl] = useState(initial?.calDetails?.facebookUrl ?? '')
  const [calContestDate, setCalContestDate] = useState(initial?.calDetails?.contestDate ?? '')
  const [calSchedule, setCalSchedule] = useState<CalSchedulePart[]>(
    initial?.calDetails?.schedule ?? [newPart(1)]
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nazwa jest wymagana'
    if (!author.trim()) e.author = 'Autor jest wymagany'
    if (!purchaseDate) e.purchaseDate = 'Data zakupu jest wymagana'
    return e
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPdfUrl(reader.result as string)
      setPdfFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const clearFile = () => {
    setPdfUrl('')
    setPdfFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    const pattern: Pattern = {
      id: initial?.id ?? uuidv4(),
      name: name.trim(),
      author: author.trim(),
      price: parseFloat(price) || 0,
      currency,
      purchaseDate,
      status: 'purchased',
      metrageFrom: metrageFrom ? parseFloat(metrageFrom) : undefined,
      metrageTo: metrageTo ? parseFloat(metrageTo) : undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      pdfUrl: calMode ? undefined : (pdfUrl || undefined),
      pdfFileName: calMode ? undefined : (pdfFileName || undefined),
      tags,
      notes: notes.trim() || undefined,
      isCal: initial?.isCal ?? calMode,
      isTest: (initial?.isTest ?? testMode) || undefined,
      testEndDate: testMode ? (testEndDate || undefined) : undefined,
      calDetails: calMode ? {
        startDate: calStartDate,
        endDate: calEndDate || undefined,
        facebookUrl: calFbUrl.trim() || undefined,
        contestDate: calContestDate || undefined,
        schedule: calSchedule.filter(p => p.name.trim()),
      } : undefined,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(pattern)
  }

  const addSchedulePart = () =>
    setCalSchedule(s => [...s, newPart(s.length + 1)])
  const removeSchedulePart = (id: string) =>
    setCalSchedule(s => s.filter(p => p.id !== id))
  const updateSchedulePart = (id: string, field: keyof CalSchedulePart, value: string) =>
    setCalSchedule(s => s.map(p => p.id === id ? { ...p, [field]: value } : p))

  return (
    <div className="space-y-1">
      {/* Nazwa */}
      <div className={fieldClass}>
        <label className={labelClass}>Nazwa wzoru *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="np. Miś Teddy"
          className={inputClass}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Autor */}
      <div className={fieldClass}>
        <label className={labelClass}>Autor *</label>
        <AuthorInput
          value={author}
          onChange={setAuthor}
          authors={authors}
          onAddAuthor={onAddAuthor}
        />
        {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
      </div>

      {/* Cena | Waluta | Data zakupu — ukryte przy testMode */}
      {testMode ? (
        <div className={fieldClass}>
          <label className={labelClass}>Start testów</label>
          <DateInput value={purchaseDate} onChange={setPurchaseDate} className={inputClass} />
          {errors.purchaseDate && <p className="text-xs text-red-500 mt-1">{errors.purchaseDate}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_4.5rem_1fr] gap-2 mb-4">
          <div>
            <label className={labelClass}>Cena</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Waluta</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as Currency)}
              className={inputClass}
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Data zakupu *</label>
            <DateInput value={purchaseDate} onChange={setPurchaseDate} className={inputClass} />
            {errors.purchaseDate && <p className="text-xs text-red-500 mt-1">{errors.purchaseDate}</p>}
          </div>
        </div>
      )}

      {/* Data końca testów — tylko testMode */}
      {testMode && (
        <div className={fieldClass}>
          <label className={labelClass}>Data końca testów</label>
          <DateInput value={testEndDate} onChange={setTestEndDate} className={inputClass} />
        </div>
      )}

      {/* CAL Details — tylko calMode */}
      {calMode && (
        <div className="space-y-4 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start CAL</label>
              <DateInput value={calStartDate} onChange={setCalStartDate} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Koniec CAL</label>
              <DateInput value={calEndDate} onChange={setCalEndDate} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Data konkursu</label>
            <DateInput value={calContestDate} onChange={setCalContestDate} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Link do FB</label>
            <input
              type="url"
              value={calFbUrl}
              onChange={e => setCalFbUrl(e.target.value)}
              placeholder="https://facebook.com/..."
              className={inputClass}
            />
          </div>

          {/* Harmonogram */}
          <div>
            <label className={labelClass}>Harmonogram</label>
            <div className="space-y-2">
              {calSchedule.map((part, idx) => (
                <div key={part.id} className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Część {idx + 1}</span>
                    {calSchedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSchedulePart(part.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Data publikacji</label>
                      <DateInput
                        value={part.publishDate}
                        onChange={v => updateSchedulePart(part.id, 'publishDate', v)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Nazwa</label>
                      <input
                        type="text"
                        value={part.name}
                        onChange={e => updateSchedulePart(part.id, 'name', e.target.value)}
                        placeholder={`Część ${idx + 1}`}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 text-xs text-zinc-400 dark:text-zinc-500 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    + Dodaj plik / wzór
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSchedulePart}
              className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              + Dodaj część
            </button>
          </div>
        </div>
      )}

      {/* Metraż */}
      <div className={fieldClass}>
        <label className={labelClass}>Metraż (m)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="1"
            value={metrageFrom}
            onChange={e => setMetrageFrom(e.target.value)}
            placeholder="od"
            className={inputClass}
          />
          <span className="text-zinc-400 shrink-0">–</span>
          <input
            type="number"
            min="0"
            step="1"
            value={metrageTo}
            onChange={e => setMetrageTo(e.target.value)}
            placeholder="do"
            className={inputClass}
          />
        </div>
      </div>

      {/* Okładka */}
      <div className={fieldClass}>
        <label className={labelClass}>Okładka (URL zdjęcia)</label>
        <input
          type="url"
          value={coverImageUrl}
          onChange={e => setCoverImageUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {/* Dodaj plik — tylko dla wzoru */}
      {!calMode && (
        <div className={fieldClass}>
          <label className={labelClass}>Wzór (plik PDF / zdjęcie)</label>
          {pdfFileName ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              <svg className="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate flex-1">{pdfFileName}</span>
              <button
                type="button"
                onClick={clearFile}
                className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 dark:text-zinc-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Dodaj plik
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Tagi */}
      <div className={fieldClass}>
        <label className={labelClass}>Tagi</label>
        <TagInput tags={tags} onChange={setTags} />
        <p className="text-xs text-zinc-400 mt-1">Enter, spacja lub przecinek, żeby dodać tag</p>
      </div>

      {/* Notatki */}
      <div className={fieldClass}>
        <label className={labelClass}>Notatki</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Twoje notatki..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Akcje */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Anuluj
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
        >
          {initial ? 'Zapisz zmiany' : calMode ? 'Dodaj CAL' : testMode ? 'Dodaj testy' : 'Dodaj wzór'}
        </button>
      </div>
    </div>
  )
}
