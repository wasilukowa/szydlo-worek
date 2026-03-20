import { useState, useEffect } from 'react'

function isoToDisplay(iso: string): string {
  if (!iso || iso.length < 8) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

function displayToIso(display: string): string {
  const digits = display.replace(/\D/g, '')
  if (digits.length < 8) return ''
  const d = digits.slice(0, 2)
  const m = digits.slice(2, 4)
  const y = digits.slice(4, 8)
  if (+d < 1 || +d > 31 || +m < 1 || +m > 12) return ''
  return `${y}-${m}-${d}`
}

function autoFormat(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  let r = digits.slice(0, 2)
  if (digits.length > 2) r += '/' + digits.slice(2, 4)
  if (digits.length > 4) r += '/' + digits.slice(4, 8)
  return r
}

interface DateInputProps {
  value: string // yyyy-mm-dd
  onChange: (iso: string) => void
  className?: string
}

export function DateInput({ value, onChange, className }: DateInputProps) {
  const [display, setDisplay] = useState(() => isoToDisplay(value))

  useEffect(() => {
    setDisplay(isoToDisplay(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = autoFormat(e.target.value)
    setDisplay(formatted)
    const iso = displayToIso(formatted)
    if (iso) onChange(iso)
    else if (!formatted) onChange('')
  }

  return (
    <input
      type="text"
      value={display}
      onChange={handleChange}
      placeholder="dd/mm/2026"
      maxLength={10}
      className={className}
    />
  )
}
