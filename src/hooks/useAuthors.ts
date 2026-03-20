import { useState, useCallback } from 'react'
import type { Author } from '../types'
import {
  getAuthors,
  addAuthor as saveAuthor,
  removeAuthor as deleteAuthor,
  updateAuthor as renameAuthor,
} from '../lib/storage'

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>(() => getAuthors())

  const refresh = () => setAuthors(getAuthors())

  const addAuthor = useCallback((name: string) => {
    saveAuthor(name)
    setAuthors(getAuthors())
  }, [])

  const removeAuthor = useCallback((id: string) => {
    deleteAuthor(id)
    setAuthors(getAuthors())
  }, [])

  const updateAuthor = useCallback((id: string, updates: Partial<Omit<Author, 'id'>>) => {
    renameAuthor(id, updates)
    setAuthors(getAuthors())
  }, [])

  return { authors, addAuthor, removeAuthor, updateAuthor, refresh }
}
