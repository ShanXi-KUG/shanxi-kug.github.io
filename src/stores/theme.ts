import { usePreferredDark, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watchEffect } from 'vue'

export type Theme = 'system' | 'light' | 'dark'

export const useTheme = defineStore('theme', () => {
  const mode = useStorage<Theme>('kug-theme', 'system')
  const system = usePreferredDark()
  const dark = computed(() => (mode.value === 'system' ? system.value : mode.value === 'dark'))

  // 跟随系统时不写属性，交给 prefers-color-scheme
  watchEffect(() => {
    const root = document.documentElement
    if (mode.value === 'system') root.removeAttribute('data-theme')
    else root.dataset.theme = mode.value
  })

  const toggle = () => (mode.value = dark.value ? 'light' : 'dark')

  return { mode, dark, toggle }
})
