import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useLayout = defineStore('layout', () => {
  const stacked = useMediaQuery('(width < 768px)')
  const motion = usePreferredReducedMotion()
  const calm = computed(() => motion.value === 'reduce')
  return { stacked, calm }
})
