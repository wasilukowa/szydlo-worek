import type { PatternStatus } from '../../types'
import { STATUS_LABELS, STATUS_COLORS } from '../../types'

interface StatusBadgeProps {
  status: PatternStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${STATUS_COLORS[status]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
