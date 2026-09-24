const CANDY = ['#844EFE', '#E93D75', '#FFB547', '#3DD6C6', '#5AA9FF', '#FF7EB6']
const G = 1400
const DRAG = 3.2

/** 从元素中心向上喷出彩带，全部落定后移除图层 */
export function confetti(from: HTMLElement, count = 36) {
  const { left, top, width, height } = from.getBoundingClientRect()
  const layer = document.createElement('div')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1000;overflow:hidden'
  document.body.append(layer)

  const runs = Array.from({ length: count }, (_, i) => {
    const bit = document.createElement('i')
    const ribbon = i % 3 !== 0
    bit.style.cssText = `position:absolute;left:${left + width / 2}px;top:${top + height / 2}px;
      width:${ribbon ? 5 : 7}px;height:${ribbon ? 12 : 7}px;border-radius:${ribbon ? '2px' : '50%'};
      background:${CANDY[i % CANDY.length]}`
    layer.append(bit)

    const aim = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95
    const speed = 480 + Math.random() * 520
    const [vx, vy] = [Math.cos(aim) * speed, Math.sin(aim) * speed]
    const life = 1.2 + Math.random() * 0.6
    const spin = (Math.random() - 0.5) * 1080
    const flap = 360 + Math.random() * 720

    // 线性空气阻力下的抛体：先冲高，再以终端速度下落
    const frames = Array.from({ length: 13 }, (_, k) => {
      const t = (k / 12) * life
      const fade = 1 - Math.exp(-DRAG * t)
      const x = (vx / DRAG) * fade
      const y = ((vy - G / DRAG) / DRAG) * fade + (G / DRAG) * t
      return {
        translate: `${x.toFixed(1)}px ${y.toFixed(1)}px`,
        rotate: `${((spin * k) / 12).toFixed(0)}deg`,
        transform: `rotateX(${((flap * k) / 12).toFixed(0)}deg)`,
        opacity: k < 9 ? 1 : (12 - k) / 3,
      }
    })
    return bit.animate(frames, { duration: life * 1000, easing: 'linear', fill: 'forwards' }).finished
  })

  Promise.all(runs).finally(() => layer.remove())
}
