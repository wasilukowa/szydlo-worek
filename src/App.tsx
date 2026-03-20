import { useState, useMemo } from 'react'
import { useTheme } from './hooks/useTheme'
import { usePatterns } from './hooks/usePatterns'
import { useAuthors } from './hooks/useAuthors'
import { COLORS } from './lib/colors'
import { Header } from './components/layout/Header'
import { PatternCard } from './components/patterns/PatternCard'
import { PatternForm } from './components/patterns/PatternForm'
import { PatternDetail } from './components/patterns/PatternDetail'
import { Modal } from './components/ui/Modal'
import { AuthorsModal } from './components/ui/AuthorsModal'
import type { Pattern, PatternStatus } from './types'
import { STATUS_LABELS } from './types'

const ALL_STATUSES: PatternStatus[] = ['purchased', 'in_progress', 'completed', 'abandoned']

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { patterns, add, update, remove } = usePatterns()
  const { authors, addAuthor, removeAuthor, updateAuthor } = useAuthors()
  const [showAuthors, setShowAuthors] = useState(false)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddCalForm, setShowAddCalForm] = useState(false)
  const [showAddTestForm, setShowAddTestForm] = useState(false)
  const [editingPattern, setEditingPattern] = useState<Pattern | null>(null)
  const [viewingPattern, setViewingPattern] = useState<Pattern | null>(null)
  const [filterStatus, setFilterStatus] = useState<PatternStatus | 'all'>('all')
  const [filterTags, setFilterTags] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>()
    patterns.forEach(p => p.tags.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [patterns])

  // Stats
  const stats = useMemo(() => ({
    total: patterns.length,
    in_progress: patterns.filter(p => p.status === 'in_progress').length,
    completed: patterns.filter(p => p.status === 'completed').length,
    cal: patterns.filter(p => p.isCal).length,
  }), [patterns])

  // Filtered patterns
  const filtered = useMemo(() => {
    return patterns.filter(p => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false
      if (filterTags.size > 0 && ![...filterTags].every(t => p.tags.includes(t))) return false
      if (search) {
        const q = search.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      }
      return true
    })
  }, [patterns, filterStatus, filterTags, search])

  const handleSave = (pattern: Pattern) => {
    if (editingPattern) {
      update(pattern)
      setEditingPattern(null)
      setViewingPattern(pattern)
    } else {
      add(pattern)
      setShowAddForm(false)
      setShowAddCalForm(false)
      setShowAddTestForm(false)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Na pewno usunąć ten wzór?')) {
      remove(id)
      setViewingPattern(null)
    }
  }

  const handleEdit = (pattern: Pattern) => {
    setViewingPattern(null)
    setEditingPattern(pattern)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Wszystkich wzorów', value: stats.total, color: 'text-zinc-900 dark:text-zinc-100' },
            { label: 'W trakcie', value: stats.in_progress, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Ukończonych', value: stats.completed, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'CAL', value: stats.cal, color: 'text-violet-600 dark:text-violet-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szukaj wzoru lub autora..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filterStatus === 'all' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'}`}
            >
              Wszystkie
            </button>
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filterStatus === s ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Add buttons */}
          <div className="ml-auto flex gap-2 shrink-0">
            <button
              onClick={() => setShowAuthors(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 text-sm font-semibold transition-colors"
              title="Edytuj bazę autorów"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Autorzy
            </button>
            {[
              { label: 'Dodaj wzór', color: COLORS.wzor.button, action: () => setShowAddForm(true) },
              { label: 'Dodaj CAL', color: COLORS.cal.button, action: () => setShowAddCalForm(true) },
              { label: 'Dodaj testy', color: COLORS.test.button, action: () => setShowAddTestForm(true) },
            ].map(({ label, color, action }) => (
              <button
                key={label}
                onClick={action}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${color} text-white text-sm font-semibold transition-colors shadow-sm`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6 items-center">
            {allTags.map(tag => {
              const active = filterTags.has(tag)
              return (
                <button
                  key={tag}
                  onClick={() => setFilterTags(prev => {
                    const next = new Set(prev)
                    active ? next.delete(tag) : next.add(tag)
                    return next
                  })}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${active ? 'bg-violet-600 text-white' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-violet-600 dark:text-violet-400 hover:border-violet-300'}`}
                >
                  #{tag}
                </button>
              )
            })}
            {filterTags.size > 0 && (
              <button
                onClick={() => setFilterTags(new Set())}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 transition-colors"
              >
                ✕ wyczyść
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🧶</span>
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {patterns.length === 0 ? 'Twoja biblioteka jest pusta' : 'Brak wzorów pasujących do filtrów'}
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              {patterns.length === 0 ? 'Dodaj swój pierwszy wzór, żeby zacząć!' : 'Spróbuj zmienić filtry'}
            </p>
            {patterns.length === 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-6 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
              >
                Dodaj pierwszy wzór
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(pattern => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                onClick={() => setViewingPattern(pattern)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Authors Modal */}
      <Modal open={showAuthors} onClose={() => setShowAuthors(false)} title="Baza autorów">
        <AuthorsModal
          authors={authors}
          patterns={patterns}
          onAdd={addAuthor}
          onRemove={removeAuthor}
          onUpdate={updateAuthor}
          onClose={() => setShowAuthors(false)}
        />
      </Modal>

      {/* Add Modal */}
      <Modal open={showAddForm} onClose={() => setShowAddForm(false)} title="Dodaj wzór">
        <PatternForm authors={authors} onAddAuthor={addAuthor} onSave={handleSave} onCancel={() => setShowAddForm(false)} />
      </Modal>

      {/* Add CAL Modal */}
      <Modal open={showAddCalForm} onClose={() => setShowAddCalForm(false)} title="Dodaj CAL">
        <PatternForm calMode authors={authors} onAddAuthor={addAuthor} onSave={handleSave} onCancel={() => setShowAddCalForm(false)} />
      </Modal>

      {/* Add Test Modal */}
      <Modal open={showAddTestForm} onClose={() => setShowAddTestForm(false)} title="Dodaj testy">
        <PatternForm testMode authors={authors} onAddAuthor={addAuthor} onSave={handleSave} onCancel={() => setShowAddTestForm(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingPattern} onClose={() => setEditingPattern(null)} title="Edytuj wzór">
        {editingPattern && (
          <PatternForm
            initial={editingPattern}
            calMode={editingPattern.isCal}
            testMode={editingPattern.isTest}
            authors={authors}
            onAddAuthor={addAuthor}
            onSave={handleSave}
            onCancel={() => setEditingPattern(null)}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!viewingPattern}
        onClose={() => setViewingPattern(null)}
        title={viewingPattern?.name ?? ''}
      >
        {viewingPattern && (
          <PatternDetail
            pattern={viewingPattern}
            onEdit={() => handleEdit(viewingPattern)}
            onDelete={() => handleDelete(viewingPattern.id)}
          />
        )}
      </Modal>
    </div>
  )
}
