import { useState, useCallback, useEffect } from 'react'
import { fetchMotki, insertMotek, patchMotek, removeMotek } from '../lib/storage'
import type { Motek } from '../types'

export function useMotki() {
  const [motki, setMotki] = useState<Motek[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await fetchMotki()
    setMotki(data)
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const add = useCallback(async (motek: Motek) => {
    await insertMotek(motek)
    await refresh()
  }, [refresh])

  const update = useCallback(async (motek: Motek) => {
    await patchMotek(motek)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await removeMotek(id)
    await refresh()
  }, [refresh])

  return { motki, loading, add, update, remove }
}
