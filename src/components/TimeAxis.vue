<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Activity } from '@/content'

const props = defineProps<{ items: Activity[] }>()
const emit = defineEmits<{ jump: [Activity]; peek: [Activity] }>()

const DAY = 86_400_000
const EDGE = 0.1
const ZOOM = [0.05, 400] as const

const rail = ref<HTMLElement | null>(null)
const width = ref(0)
const pxPerDay = ref(1)
const offset = ref(0)
const dragging = ref(false)
const hovered = ref<string | null>(null)
const tipEl = ref<HTMLElement | null>(null)

const peeked = computed(() => dated.value.find((a) => a.id === hovered.value) ?? null)

const TIP_H = 96
const TIP_HALF = 130

let frame = 0
let cursor = { x: 0, y: 0, below: false }

/** 指针位置直接写进 DOM 并按帧合并；走响应式会让整条轴每次移动都重渲染 */
function paint() {
  frame = 0
  const el = tipEl.value
  if (!el) return
  el.style.setProperty('--tx', `${cursor.x}px`)
  el.style.setProperty('--ty', `${cursor.y}px`)
  el.classList.toggle('below', cursor.below)
}

/** 只在标签被省略或整条避让掉时出现；上方顶到页眉就翻到指针下方 */
function track(e: PointerEvent) {
  const box = rail.value?.getBoundingClientRect()
  if (!box) return
  const label = (e.currentTarget as HTMLElement).querySelector('.axis-label')
  if (label && label.scrollWidth <= label.clientWidth + 1) {
    hovered.value = null
    return
  }
  const guard = document.querySelector('#header')?.getBoundingClientRect().bottom ?? 0
  const half = Math.min(TIP_HALF, box.width / 2)
  cursor = {
    x: Math.min(Math.max(e.clientX - box.left, half), box.width - half),
    y: e.clientY - box.top,
    below: e.clientY - TIP_H - 18 < guard,
  }
  if (!frame) frame = requestAnimationFrame(paint)
}

// 轴上一律按时间排：上下参差与标签避让都依赖从左到右的顺序，拿类别序会错位
const dated = computed(() =>
  props.items
    .filter((a) => !Number.isNaN(a.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime()),
)
const first = computed(() => Math.min(...dated.value.map((a) => a.date.getTime())))
const span = computed(() => Math.max(...dated.value.map((a) => a.date.getTime())) - first.value)

const BAR = 1.38
const TAU = 0.8

const fitted = ref(1)

/** 粗细随缩放指数变化：放大趋近 1.2 倍，缩小趋近一半，铺满时为 1 */
const bar = computed(() => {
  const zoomed = pxPerDay.value / (fitted.value || 1)
  return `${(BAR * (0.5 + 0.7 * (1 - Math.exp(-zoomed / TAU)))).toFixed(3)}em`
})

const at = (a: Activity) => offset.value + ((a.date.getTime() - first.value) / DAY) * pxPerDay.value

const WAVES = 3
const CYCLE = 2

function waves(id: string, index: number) {
  let seed = index * 2654435761
  for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
  return Array.from({ length: WAVES }, (_, w) => {
    seed = (seed * 1103515245 + 12345) >>> 0
    const jitter = (seed % 1000) / 1000 - 0.5
    return `${(((w + jitter) * CYCLE) / WAVES).toFixed(2)}s`
  })
}

const SPACING = 72
const ROOM = 56
const LEAD = 8
const PAD = 12

const natural = ref<Record<string, number>>({})

/** 标签全文宽度按字体量一次，拖动时不再测量 */
function measure() {
  const el = rail.value
  const ctx = document.createElement('canvas').getContext('2d')
  if (!el || !ctx) return
  const { fontSize, fontFamily } = getComputedStyle(el)
  ctx.font = `600 ${parseFloat(fontSize) * 0.92}px ${fontFamily}`
  natural.value = Object.fromEntries(dated.value.map((a) => [a.id, Math.ceil(ctx.measureText(label(a)).width) + 2]))
}

type Side = 'above' | 'below'
type Point = { a: Activity; x: number; side: Side; inside: boolean; mark: string; waves: string[]; box?: { left: number; width: number } }

/**
 * 同侧相邻点至少隔 SPACING 才挂标签；宽度从左往右依次分配，
 * 不越过下一个点的引线，放不下的截成省略号，拖动与缩放时随之重算
 */
const placed = computed(() => {
  const rows: Record<Side, Point[]> = { above: [], below: [] }
  const points = dated.value.map((a, i): Point => {
    const x = at(a)
    return {
      a,
      x,
      side: i % 2 ? 'below' : 'above',
      inside: x >= 0 && x <= width.value,
      mark: a.status === '已结束' ? 'done' : a.beat,
      waves: waves(a.id, i),
    }
  })
  for (const p of points) {
    const row = rows[p.side]
    if (p.inside && p.x - (row.at(-1)?.x ?? -Infinity) >= SPACING) row.push(p)
  }
  for (const row of Object.values(rows)) {
    let floor = 0
    row.forEach((p, k) => {
      const ceil = row[k + 1] ? row[k + 1].x - LEAD - PAD : width.value
      const w = Math.min(natural.value[p.a.id] ?? Infinity, ceil - floor)
      if (w < ROOM) return
      const left = Math.min(Math.max(p.x - 0.35 * w, floor), ceil - w)
      p.box = { left: left - p.x, width: w }
      floor = left + w + PAD
    })
  }
  return points
})

function fit() {
  if (!width.value || !dated.value.length) return
  const days = span.value / DAY
  pxPerDay.value = days > 0 ? (width.value * (1 - EDGE * 2)) / days : 1
  fitted.value = pxPerDay.value
  offset.value = days > 0 ? width.value * EDGE : width.value / 2
}

function zoom(e: WheelEvent) {
  e.preventDefault()
  const anchor = e.clientX - (rail.value?.getBoundingClientRect().left ?? 0)
  const day = (anchor - offset.value) / pxPerDay.value
  pxPerDay.value = Math.min(ZOOM[1], Math.max(ZOOM[0], pxPerDay.value * (e.deltaY < 0 ? 1.15 : 1 / 1.15)))
  offset.value = anchor - day * pxPerDay.value
}

function pan(by: number) {
  offset.value += by
}

let from = 0
function down(e: PointerEvent) {
  dragging.value = true
  from = e.clientX
  // 没有活动指针时会抛，拖动本身不依赖它
  try {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  } catch {}
}
function move(e: PointerEvent) {
  if (!dragging.value) return
  pan(e.clientX - from)
  from = e.clientX
}
const up = () => (dragging.value = false)

// 宽度一变映射就失真，点会飘出面板
useResizeObserver(rail, ([box]) => {
  width.value = box.contentRect.width
  fit()
  measure()
})
// 网页字体晚到，先前按后备字体量的宽度会偏
onMounted(() => document.fonts.ready.then(measure))
onBeforeUnmount(() => frame && cancelAnimationFrame(frame))
watch(dated, () => (fit(), measure()))

const label = (a: Activity) =>
  `${a.date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.')}：${a.title}`

const away = (a: Activity) => {
  const days = Math.round((a.date.getTime() - Date.now()) / DAY)
  if (days === 0) return '就在今天'
  return days > 0 ? `距今还有 ${days} 天` : `已过去 ${-days} 天`
}
</script>

<template lang="pug">
.axis-rail(
  ref="rail",
  :class="{ dragging }",
  @wheel="zoom",
  @pointerdown="down",
  @pointermove="move",
  @pointerup="up",
  @pointercancel="up",
  @keydown.left.prevent="pan(60)",
  @keydown.right.prevent="pan(-60)",
  tabindex="0",
)
  .axis-line(:style="{ '--bar': bar }")
  template(v-for="p in placed", :key="p.a.id")
    .axis-point(
      v-if="p.inside",
      :class="[p.mark, p.side, { bare: !p.box }]",
      :style="{ '--x': p.x + 'px' }",
      @pointerenter="hovered = p.a.id",
      @pointerleave="hovered = null",
      @pointermove="track",
      @click.stop="emit('jump', p.a)",
      @contextmenu.prevent.stop="emit('peek', p.a)",
    )
      .axis-dot
        span.axis-wave(v-for="lag in p.waves", :key="lag", :style="{ '--lag': lag }")
      .axis-label(v-if="p.box", :style="{ '--lx': p.box.left + 'px', '--lw': p.box.width + 'px' }") {{ label(p.a) }}
  .axis-tip(v-if="peeked", ref="tipEl")
    strong {{ peeked.title }}
    span {{ label(peeked).split('：')[0] }} · {{ peeked.status }}
    span {{ away(peeked) }}
</template>

<style lang="less" scoped>
.axis-rail {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: pan-y;
  outline: none;

  &.dragging {
    cursor: grabbing;

    .axis-point { transition: none }
  }
}

.axis-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: var(--bar, 1.38em);
  translate: 0 -50%;
  border-radius: .33em;
  background-image: var(--default-kug-gradient);

  .default-shadow-mini-outset();
}

.axis-point {
  position: absolute;
  top: 50%;
  left: var(--x);
  translate: -50% -50%;
  width: 1.1em;
  height: 1.1em;
  cursor: pointer;
  z-index: 2;
}

.axis-dot {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: var(--default-kug-gradient);
  display: grid;
  place-items: center;

  .use-default-transition();
  .default-shadow-mini-outset();

  &::after {
    content: "";
    width: 46%;
    height: 46%;
    border-radius: 50%;
    background-color: var(--default-light-white);

    .use-default-transition();
  }
}

.axis-wave {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  background: var(--default-kug-gradient) border-box;
  mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0);
  pointer-events: none;
  opacity: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-delay: var(--lag, 0s);

  .use-default-transition();
}

.axis-point.gather .axis-wave { animation-name: --axis-gather }
.axis-point.spread .axis-wave { animation-name: --axis-spread }

.axis-point.done .axis-dot {
  opacity: .3;
  background-image: none;
  background-color: var(--default-half-gray);
}

@keyframes --axis-gather {
  0% { scale: 1; opacity: 0 }
  30% { opacity: .75 }
  100% { scale: .36; opacity: 0 }
}

@keyframes --axis-spread {
  0% { scale: .36; opacity: .75 }
  100% { scale: 1; opacity: 0 }
}

@media (prefers-reduced-motion: reduce) {
  .axis-wave { animation: none }
}

.axis-point:hover .axis-dot {
  scale: 1.2;

  .axis-wave { inset: -20px }
}

.axis-label {
  position: absolute;
  left: calc(50% + var(--lx));
  width: var(--lw);

  font-size: .92em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // 被省略的那截只能靠 hover 看全
  cursor: pointer;

  .use-default-gradient-text();
}

.axis-point.done {
  .axis-label {
    font-weight: 400;

    @supports (background-clip: text) {
      background-image: none;
      color: var(--default-half-gray);
    }
  }

  &::before { opacity: .45 }

  &:hover .axis-label {
    @supports (background-clip: text) {
      color: var(--default-black);
    }
  }
}

.axis-point.above {
  .axis-label { bottom: 215% }

  &::before {
    content: "";
    position: absolute;
    left: calc(50% - .1em);
    bottom: 97.5%;
    width: .2em;
    height: 1.1em;
    border-radius: .5em;
    background-image: var(--default-kug-gradient);
  }
}

.axis-point.below {
  .axis-label { top: 215% }

  &::before {
    content: "";
    position: absolute;
    left: calc(50% - .1em);
    top: 97.5%;
    width: .2em;
    height: 1.1em;
    border-radius: .5em;
    background-image: var(--default-kug-gradient);
  }
}

.axis-tip {
  position: absolute;
  left: var(--tx);
  top: var(--ty);
  translate: -50% calc(-100% - 1.1em);
  z-index: 9;

  &.below {
    translate: -50% 1.1em;
  }
  width: max-content;
  max-width: 16em;
  padding: .55em .78em;
  display: flex;
  flex-direction: column;
  gap: .18em;
  border-radius: .45em;
  border: 1px solid transparent;
  background:
    linear-gradient(var(--default-light-white), var(--default-light-white)) padding-box,
    var(--default-kug-gradient) border-box;
  white-space: normal;
  word-break: break-word;
  pointer-events: none;

  .default-shadow-mini-outset();

  strong {
    font-size: .95em;
    font-weight: 700;
    line-height: 1.35;

    .use-default-gradient-text();
  }

  span {
    font-size: .8em;
    font-weight: 300;
    color: var(--default-half-gray);
    line-height: 1.4;
  }
}

// 标签被避让掉后连接线就悬空了
.axis-point.bare::before {
  display: none;
}
</style>
