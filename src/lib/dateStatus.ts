import { COLORS } from './colors'

function today(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function parseDate(str: string): Date {
  const d = new Date(str)
  d.setHours(0, 0, 0, 0)
  return d
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - today().getTime()) / (1000 * 60 * 60 * 24))
}

function dayWord(n: number): string {
  return n === 1 ? 'dzień' : 'dni'
}

export type DynamicStatus = {
  label: string
  color: string
}

export function calStatus(startDate?: string, endDate?: string): DynamicStatus {
  if (!startDate) {
    return { label: 'w trakcie', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' }
  }

  const now = today()
  const start = parseDate(startDate)

  if (now < start) {
    const days = daysUntil(start)
    return { label: `start za ${days} ${dayWord(days)}`, color: COLORS.cal.badgeSoft }
  }

  if (endDate && now > parseDate(endDate)) {
    return { label: 'zakończony', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' }
  }

  return { label: 'w trakcie', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' }
}

export function testStatus(endDate?: string): DynamicStatus {
  if (!endDate) {
    return { label: 'w trakcie', color: COLORS.test.badgeSoft }
  }

  const now = today()
  const end = parseDate(endDate)

  if (now > end) {
    return { label: 'zakończone', color: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400' }
  }

  const days = daysUntil(end)
  return { label: `${days} ${dayWord(days)} do końca`, color: COLORS.test.badgeSoft }
}
