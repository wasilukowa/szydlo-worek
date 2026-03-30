import { useState, useCallback, useEffect } from 'react'
import { fetchPatterns, insertPattern, patchPattern, removePattern } from '../lib/storage'
import type { Pattern } from '../types'

export function usePatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await fetchPatterns()
    setPatterns(data)
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const add = useCallback(async (pattern: Pattern) => {
    await insertPattern(pattern)
    await refresh()
  }, [refresh])

  const update = useCallback(async (pattern: Pattern) => {
    await patchPattern(pattern)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await removePattern(id)
    await refresh()
  }, [refresh])

  return { patterns, loading, add, update, remove, refresh }
}
