import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import (once) 'src/assets/mixins';`,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
