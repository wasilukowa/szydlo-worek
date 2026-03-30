import type { Motek } from '../../types'
import { COLORS } from '../../lib/colors'

interface MotekCardProps {
  motek: Motek
  onClick: () => void
}

export function MotekCard({ motek, onClick }: MotekCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {motek.imageUrl ? (
          <img
            src={motek.imageUrl}
            alt={motek.firma ?? 'Motek'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${COLORS.motek.gradient} flex items-center justify-center`}>
            <span className="text-5xl select-none">🧶</span>
          </div>
        )}
        <div className="absolute top-2 right-2 pointer-events-none flex flex-col items-end gap-1">
          {motek.inUse && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold shadow-sm bg-violet-600 text-white">
              W użyciu
            </span>
          )}
          {motek.hasDowijka && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${COLORS.motek.badge}`}>
              Dowijka
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-1 mb-0.5">
          {motek.firma ?? <span className="text-zinc-400 dark:text-zinc-500 font-normal italic">Nieznana firma</span>}
        </p>
        <p className={`text-xs font-medium ${COLORS.motek.text}`}>
          {motek.metrage} m
          {motek.hasDowijka && motek.dowijkaMetrage ? ` + ${motek.dowijkaMetrage} m` : ''}
        </p>
        {motek.komentarz && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
            {motek.komentarz}
          </p>
        )}
      </div>
    </button>
  )
}
