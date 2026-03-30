export type PatternStatus = 'purchased' | 'in_progress' | 'completed' | 'abandoned'

export interface Author {
  id: string
  name: string
  www?: string
  facebook?: string
  instagram?: string
}

export type Currency = 'PLN' | 'EUR' | 'USD' | 'GBP'

export interface CalSchedulePart {
  id: string
  name: string
  publishDate: string
}

export interface CalDetails {
  startDate: string
  endDate?: string
  facebookUrl?: string
  contestDate?: string
  schedule: CalSchedulePart[]
}

export interface Pattern {
  id: string
  name: string
  author: string
  price: number
  currency: Currency
  purchaseDate: string
  status: PatternStatus
  metrageFrom?: number
  metrageTo?: number
  coverImageUrl?: string
  pdfUrl?: string
  pdfFileName?: string
  tags: string[]
  isCal: boolean
  calDetails?: CalDetails
  isTest?: boolean
  testEndDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Motek {
  id: string
  metrage: number
  hasDowijka: boolean
  dowijkaMetrage?: number
  inUse: boolean
  patternId?: string
  firma?: string
  imageUrl?: string
  komentarz?: string
  createdAt: string
  updatedAt: string
}

export const STATUS_LABELS: Record<PatternStatus, string> = {
  purchased: 'Kupiony',
  in_progress: 'W trakcie',
  completed: 'Ukończony',
  abandoned: 'Porzucony',
}

export const STATUS_COLORS: Record<PatternStatus, string> = {
  purchased: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  abandoned: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
}
