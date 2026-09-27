import type { Ref } from 'vue'
import { computed } from 'vue'
import { confetti } from '@/confetti'
import type { Activity } from '@/content'
import { useLayout } from '@/stores/layout'

const LINK = /^\s*\[([^\]]*)]\(([^)]*)\)\s*$/
const POP = [{ scale: 1 }, { scale: 0.86 }, { scale: 1.08 }, { scale: 1 }]

export function useSignup(activity: Ref<Activity>) {
  const layout = useLayout()

  /** action 留空时退回默认按钮，且不跳转 */
  const action = computed(() => {
    const m = activity.value.action?.match(LINK)
    return m ? { text: m[1], href: m[2] } : { text: '点我报名!', href: '#' }
  })

  /** 外链延后打开：新标签页会夺走焦点，本页的动效就看不到了 */
  function sign(e: MouseEvent) {
    const pill = (e.currentTarget as HTMLElement).parentElement!
    if (!layout.calm) {
      pill.animate(POP, { duration: 460, easing: 'ease-out' })
      confetti(pill)
    }
    e.preventDefault()
    const { href } = action.value
    if (href.startsWith('#')) return
    setTimeout(() => open(href, '_blank', 'noopener'), 420)
  }

  return { action, sign }
}
