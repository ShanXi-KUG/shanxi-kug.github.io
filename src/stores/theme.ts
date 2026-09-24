import { usePreferredDark, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watchEffect } from 'vue'

export type Theme = 'system' | 'light' | 'dark'

export const useTheme = defineStore('theme', () => {
  const mode = useStorage<Theme>('kug-theme', 'system')
  const system = usePreferredDark()
  const dark = computed(() => (mode.value === 'system' ? system.value : mode.value === 'dark'))

  const bar = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

  // 跟随系统时不写属性，交给 prefers-color-scheme；手机地址栏颜色要跟着换
  watchEffect(() => {
    const root = document.documentElement
    if (mode.value === 'system') root.removeAttribute('data-theme')
    else root.dataset.theme = mode.value
    if (bar) bar.content = dark.value ? '#1F242D' : '#F1F6FF'
  })

  const toggle = () => (mode.value = dark.value ? 'light' : 'dark')

  return { mode, dark, toggle }
})
