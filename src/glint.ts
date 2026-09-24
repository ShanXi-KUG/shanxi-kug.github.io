import type { Directive } from 'vue'

/** 悬停或按下时播放一次；动画结束才移除类名，指针中途移开也不会跳回 */
export const vGlint: Directive<HTMLElement> = {
  mounted(el) {
    const play = () => el.classList.add('glint')
    el.addEventListener('pointerenter', play)
    el.addEventListener('pointerdown', play)
    el.addEventListener('animationend', (e) => e.target === el && el.classList.remove('glint'))
  },
}
