import type { Motek, Pattern } from '../../types'
import { COLORS } from '../../lib/colors'

interface MotekDetailProps {
  motek: Motek
  patterns: Pattern[]
  onEdit: () => void
  onDelete: () => void
}

function patternTypeLabel(p: Pattern): string {
  if (p.isCal) return 'CAL'
  if (p.isTest) return 'Test'
  return 'Wzór'
}

export function MotekDetail({ motek, patterns, onEdit, onDelete }: MotekDetailProps) {
  const linkedPattern = motek.patternId ? patterns.find(p => p.id === motek.patternId) : undefined

  return (
    <div className="space-y-5">
      {/* Image */}
      {motek.imageUrl && (
        <div className="rounded-xl overflow-hidden max-h-64 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <img src={motek.imageUrl} alt={motek.firma ?? 'Motek'} className="max-h-64 object-contain" />
        </div>
      )}

      {/* Main info */}
      <div className={`rounded-xl p-4 ${COLORS.motek.bgSolid} border ${COLORS.motek.border} space-y-3`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">Firma</p>
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {motek.firma ?? <span className="text-zinc-400 dark:text-zinc-500 font-normal italic">Nieznana</span>}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {motek.inUse && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white">
                W użyciu
              </span>
            )}
            {motek.hasDowijka && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${COLORS.motek.badge}`}>
                Dowijka
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">Metraż</p>
            <p className={`text-lg font-bold ${COLORS.motek.text}`}>{motek.metrage} m</p>
          </div>
          {motek.hasDowijka && (
            <div>
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">Metraż dowijki</p>
              <p className={`text-lg font-bold ${COLORS.motek.text}`}>
                {motek.dowijkaMetrage ? `${motek.dowijkaMetrage} m` : '—'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Powiązany wzór */}
      {motek.inUse && (
        <div>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1.5">Wzór / projekt</p>
          {linkedPattern ? (
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${COLORS.wzor.border} ${COLORS.wzor.bg}`}>
              <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${COLORS.wzor.badgeSoft}`}>
                {patternTypeLabel(linkedPattern)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{linkedPattern.name}</p>
                {linkedPattern.author && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{linkedPattern.author}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">Brak powiązanego wzoru</p>
          )}
        </div>
      )}

      {/* Komentarz */}
      {motek.komentarz && (
        <div>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1.5">Komentarz</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {motek.komentarz}
          </p>
        </div>
      )}

      {/* Meta */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Dodano {new Date(motek.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onEdit}
          className={`flex-1 px-4 py-2.5 rounded-xl ${COLORS.motek.editButton} text-white text-sm font-semibold transition-colors shadow-sm`}
        >
          Edytuj
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Usuń
        </button>
      </div>
    </div>
  )
}
