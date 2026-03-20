import { useState, useCallback } from 'react'
import { getPatterns, addPattern, updatePattern, deletePattern } from '../lib/storage'
import type { Pattern } from '../types'

export function usePatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>(() => getPatterns())

  const refresh = useCallback(() => {
    setPatterns(getPatterns())
  }, [])

  const add = useCallback((pattern: Pattern) => {
    addPattern(pattern)
    setPatterns(getPatterns())
  }, [])

  const update = useCallback((pattern: Pattern) => {
    updatePattern(pattern)
    setPatterns(getPatterns())
  }, [])

  const remove = useCallback((id: string) => {
    deletePattern(id)
    setPatterns(getPatterns())
  }, [])

  return { patterns, add, update, remove, refresh }
}
