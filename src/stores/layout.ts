import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

/** 每张卡与每条卡流共用一个媒体查询 */
export const useLayout = defineStore('layout', () => {
  const stacked = useMediaQuery('(width < 768px)')
  const motion = usePreferredReducedMotion()
  const calm = computed(() => motion.value === 'reduce')
  return { stacked, calm }
})
