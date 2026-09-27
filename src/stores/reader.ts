import { useUrlSearchParams } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { activities, type Activity } from '@/content'

export type View = 'card' | 'detail'

export const useReader = defineStore('reader', () => {
  const params = useUrlSearchParams<{ activity?: string }>('history')
  const id = ref(params.activity)
  const view = ref<View>('detail')
  const activity = computed(() => activities.find((a) => a.id === id.value) ?? null)

  // 只有详情进地址，便于分享
  function open(a: Activity, as: View) {
    id.value = a.id
    view.value = as
    params.activity = as === 'detail' ? a.id : undefined
  }

  function close() {
    id.value = undefined
    params.activity = undefined
  }

  return { activity, view, open, close }
})
