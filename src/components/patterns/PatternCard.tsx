import type { Pattern } from '../../types'
import { StatusBadge } from './StatusBadge'
import { calStatus, testStatus } from '../../lib/dateStatus'
import { COLORS } from '../../lib/colors'

interface PatternCardProps {
  pattern: Pattern
  onClick: () => void
}

function placeholderGradient(pattern: Pattern): string {
  if (pattern.isCal) return 'from-rose-400 to-pink-600'
  if (pattern.isTest) return 'from-teal-400 to-teal-600'
  const GRADIENTS = [
    'from-violet-400 to-purple-600',
    'from-rose-400 to-pink-600',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-600',
    'from-sky-400 to-blue-600',
    'from-indigo-400 to-violet-600',
  ]
  return GRADIENTS[pattern.name.charCodeAt(0) % GRADIENTS.length]
}

export function PatternCard({ pattern, onClick }: PatternCardProps) {
  const dynamicStatus = pattern.isCal
    ? calStatus(pattern.calDetails?.startDate, pattern.calDetails?.endDate)
    : pattern.isTest
      ? testStatus(pattern.testEndDate)
      : null

  const showStatusBadge = !dynamicStatus &&
    (pattern.status === 'in_progress' || pattern.status === 'completed')

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {pattern.coverImageUrl ? (
          <img
            src={pattern.coverImageUrl}
            alt={pattern.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${placeholderGradient(pattern)} flex items-center justify-center`}>
            <span className="text-5xl font-bold text-white/80 select-none">
              {pattern.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1 pointer-events-none">
          <div className="pointer-events-auto">
            {dynamicStatus && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${dynamicStatus.color}`}>
                {dynamicStatus.label}
              </span>
            )}
            {showStatusBadge && <StatusBadge status={pattern.status} />}
          </div>
          <div className="pointer-events-auto shrink-0">
            {pattern.isCal && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${COLORS.cal.badge}`}>CAL</span>
            )}
            {pattern.isTest && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${COLORS.test.badge}`}>TEST</span>
            )}
          </div>
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-2 mb-0.5">
          {pattern.name}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
          {pattern.author}
        </p>
        <div className="flex items-center justify-between mt-2">
          {!pattern.isTest && (
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {pattern.price > 0 ? `${pattern.price} ${pattern.currency}` : 'Bezpłatny'}
            </span>
          )}
          <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-auto">
            {new Date(pattern.purchaseDate).toLocaleDateString('pl-PL', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        {pattern.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {pattern.tags.slice(0, 3).map(tag => (
              <span key={tag} className={`text-xs ${pattern.isCal ? COLORS.cal.tag : pattern.isTest ? COLORS.test.tag : COLORS.wzor.tag}`}>
                #{tag}
              </span>
            ))}
            {pattern.tags.length > 3 && (
              <span className="text-xs text-zinc-400">+{pattern.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}
