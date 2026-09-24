import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Stage } from '@/content'

export const useDecks = defineStore('decks', () => {
  const target = reactive<Partial<Record<Stage, { id: string }>>>({})

  /** 每次换新对象，同一张连点两次也会再滚一次 */
  const focus = (stage: Stage, id: string) => (target[stage] = { id })

  return { target, focus }
})
