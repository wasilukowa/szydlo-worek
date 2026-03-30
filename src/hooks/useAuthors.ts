import { useState, useCallback, useEffect } from 'react'
import { fetchAuthors, insertAuthor, patchAuthor, removeAuthor } from '../lib/storage'
import type { Author } from '../types'

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await fetchAuthors()
    setAuthors(data)
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const addAuthor = useCallback(async (name: string) => {
    await insertAuthor(name)
    await refresh()
  }, [refresh])

  const updateAuthor = useCallback(async (id: string, updates: Partial<Omit<Author, 'id'>>) => {
    await patchAuthor(id, updates)
    await refresh()
  }, [refresh])

  const removeAuthorById = useCallback(async (id: string) => {
    await removeAuthor(id)
    await refresh()
  }, [refresh])

  return { authors, loading, addAuthor, removeAuthor: removeAuthorById, updateAuthor }
}
