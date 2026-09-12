import { useSyncExternalStore } from 'react'
import { getDB, subscribe } from './store'

export function useDB() {
  return useSyncExternalStore(subscribe, getDB, getDB)
}
