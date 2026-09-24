import './assets/main.less'

import { useEventListener } from '@vueuse/core'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'

// 右键留给翻卡背，屏蔽系统菜单
useEventListener(window, 'contextmenu', (e) => e.preventDefault())

createApp(App).use(createPinia()).mount('#app')
