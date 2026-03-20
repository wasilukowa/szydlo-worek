import type { Pattern } from '../../types'
import { StatusBadge } from './StatusBadge'
import { calStatus, testStatus } from '../../lib/dateStatus'
import { COLORS } from '../../lib/colors'

interface PatternDetailProps {
  pattern: Pattern
  onEdit: () => void
  onDelete: () => void
}

export function PatternDetail({ pattern, onEdit, onDelete }: PatternDetailProps) {
  const c = pattern.isCal ? COLORS.cal : pattern.isTest ? COLORS.test : COLORS.wzor

  const dynamicStatus = pattern.isCal
    ? calStatus(pattern.calDetails?.startDate, pattern.calDetails?.endDate)
    : pattern.isTest
      ? testStatus(pattern.testEndDate)
      : null

  const showStatusBadge = !dynamicStatus &&
    (pattern.status === 'in_progress' || pattern.status === 'completed')

  const metrageLabel = pattern.metrageFrom != null || pattern.metrageTo != null
    ? [pattern.metrageFrom, pattern.metrageTo].filter(Boolean).join(' – ') + ' m'
    : null

  return (
    <div className="space-y-6">
      {/* Cover + basics */}
      <div className="flex gap-4">
        {pattern.coverImageUrl ? (
          <img
            src={pattern.coverImageUrl}
            alt={pattern.name}
            className="w-28 h-36 object-cover rounded-xl shrink-0"
          />
        ) : (
          <div className={`w-28 h-36 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shrink-0`}>
            <span className="text-4xl font-bold text-white/80">{pattern.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">{pattern.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{pattern.author}</p>
          <div className="flex flex-wrap items-center gap-2">
            {dynamicStatus && (
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${dynamicStatus.color}`}>
                {dynamicStatus.label}
              </span>
            )}
            {showStatusBadge && <StatusBadge status={pattern.status} size="md" />}
            {pattern.isCal && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${c.badge}`}>CAL</span>
            )}
            {pattern.isTest && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${c.badge}`}>TEST</span>
            )}
          </div>
          <div className="mt-3 space-y-1">
            {!pattern.isTest && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Cena:</span>{' '}
                {pattern.price > 0 ? `${pattern.price} ${pattern.currency}` : 'Bezpłatny'}
              </p>
            )}
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">{pattern.isTest ? 'Start testów:' : 'Data zakupu:'}</span>{' '}
              {new Date(pattern.purchaseDate).toLocaleDateString('pl-PL')}
            </p>
            {metrageLabel && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Metraż:</span>{' '}{metrageLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {pattern.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {pattern.tags.map(tag => (
            <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.badgeSoft}`}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {pattern.notes && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">Notatki</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{pattern.notes}</p>
        </div>
      )}

      {/* Plik wzoru */}
      {pattern.pdfUrl && (
        <div>
          <a
            href={pattern.pdfUrl}
            download={pattern.pdfFileName}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
            </svg>
            {pattern.pdfFileName ?? 'Wzór PDF'}
          </a>
        </div>
      )}

      {/* CAL Details */}
      {pattern.isCal && pattern.calDetails && (
        <div className={`p-4 rounded-xl ${c.bgSolid} border ${c.border} space-y-3`}>
          <p className={`text-sm font-bold ${c.text}`}>Szczegóły CAL</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {pattern.calDetails.startDate && (
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Start:</span>{' '}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {new Date(pattern.calDetails.startDate).toLocaleDateString('pl-PL')}
                </span>
              </div>
            )}
            {pattern.calDetails.endDate && (
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Koniec:</span>{' '}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {new Date(pattern.calDetails.endDate).toLocaleDateString('pl-PL')}
                </span>
              </div>
            )}
            {pattern.calDetails.contestDate && (
              <div className="col-span-2">
                <span className="text-zinc-500 dark:text-zinc-400">Konkurs:</span>{' '}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {new Date(pattern.calDetails.contestDate).toLocaleDateString('pl-PL')}
                </span>
              </div>
            )}
          </div>
          {pattern.calDetails.facebookUrl && (
            <a
              href={pattern.calDetails.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Grupa Facebook
            </a>
          )}
          {pattern.calDetails.schedule.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Harmonogram</p>
              <div className="space-y-1">
                {pattern.calDetails.schedule.map((part, idx) => (
                  <div key={part.id} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{idx + 1}. {part.name}</span>
                    {part.publishDate && (
                      <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {new Date(part.publishDate).toLocaleDateString('pl-PL')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Details */}
      {pattern.isTest && pattern.testEndDate && (
        <div className={`p-4 rounded-xl ${c.bgSolid} border ${c.border}`}>
          <p className={`text-sm font-bold ${c.text} mb-2`}>Szczegóły testów</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">Koniec testów:</span>{' '}
            {new Date(pattern.testEndDate).toLocaleDateString('pl-PL')}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onEdit}
          className={`flex-1 py-2.5 rounded-xl ${c.editButton} text-white text-sm font-semibold transition-colors`}
        >
          Edytuj
        </button>
        <button
          onClick={onDelete}
          className="py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
        >
          Usuń
        </button>
      </div>
    </div>
  )
}
