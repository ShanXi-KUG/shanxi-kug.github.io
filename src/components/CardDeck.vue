<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Activity, Stage } from '@/content'
import { useDecks } from '@/stores/decks'
import { useLayout } from '@/stores/layout'
import ActivityCard from './ActivityCard.vue'
import EmptyCard from './EmptyCard.vue'

const props = defineProps<{ items: Activity[]; stage: Stage }>()

const pos = ref(0)
const { stacked } = storeToRefs(useLayout())
const decks = useDecks()
const deck = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)

const last = computed(() => Math.max(props.items.length - 1, 0))
const index = computed(() => Math.round(pos.value))
const has = computed(() => props.items.length > 0)
const canPrev = computed(() => pos.value > 0.01)
const canNext = computed(() => pos.value < last.value - 0.01)

const clamp = (v: number) => Math.min(Math.max(v, 0), last.value)

function go(step: number) {
  pos.value = clamp(Math.round(pos.value) + step)
}

const COOLDOWN = 120
let armed = 0

const bump = ref(0)
let relax: ReturnType<typeof setTimeout>

/** 到端点了：给一下回弹，但绝不把滚动交还给页面 */
function nudge(dir: number) {
  bump.value = dir > 0 ? -18 : 18
  clearTimeout(relax)
  relax = setTimeout(() => (bump.value = 0), 180)
}

/** 一格一张、一次到位；冷却只为拦住触控板一次轻扫打出的连发 */
function step(delta: number) {
  const now = performance.now()
  if (now - armed < COOLDOWN) return
  armed = now
  go(Math.sign(delta))
}

const canStep = (step: number) => !stacked.value && (step > 0 ? canNext.value : canPrev.value)

function focus(id: string) {
  const at = props.items.findIndex((a) => a.id === id)
  if (at < 0) return
  if (stacked.value) deck.value?.children[at]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  else go(at - index.value)
}

const edge = computed(() => root.value?.closest<HTMLElement>('#card-wrapper') ?? null)

/** 檐口是灰色容器的内边距，落在它本身才翻卡；卡上与卡外都交还给页面 */
function onWheel(e: WheelEvent) {
  if (stacked.value || e.target !== edge.value) return
  const dir = Math.sign(e.deltaY || e.deltaX)
  if (!dir) return
  // 檐口内的滚轮只归卡流，到头也不放行，否则整页会跟着往下走
  e.preventDefault()
  if (canStep(dir)) step(dir)
  else nudge(dir)
}

useEventListener(edge, 'wheel', onWheel, { passive: false })
watch(() => decks.target[props.stage], (t) => t && focus(t.id))
onBeforeUnmount(() => clearTimeout(relax))
watch(() => props.items.length, () => (pos.value = 0))

</script>

<template lang="pug">
.deck(ref="root", :class="{ stacked }")
  .deck-view(ref="deck", :style="stacked ? undefined : { '--at': pos, '--bump': bump + 'px' }")
    template(v-if="has")
      .deck-slot(v-for="a in items", :key="a.id")
        ActivityCard(:activity="a")
    .deck-slot(v-else)
      EmptyCard
  template(v-if="!stacked && has")
    button.deck-arrow.prev(v-show="canPrev", @click="go(-1)", aria-label="上一张") ‹
    button.deck-arrow.next(v-show="canNext", @click="go(1)", aria-label="下一张") ›
</template>

<style lang="less" scoped>
@import "@/assets/animation";

.deck {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &:hover .deck-arrow {
    opacity: 1;
  }
}

.deck-view {
  width: 100%;
  height: 100%;
  display: flex;
  // 卡与卡之间留 2em，滑动时能看见彼此是分开的
  gap: 2em;
  translate: calc(var(--at, 0) * -1 * (100% + 2em) + var(--bump, 0px)) 0;

  .use-slide-transition(translate);
}

.deck-slot {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}

.deck-arrow {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  z-index: 3;
  width: 1.2em;
  height: 1.6em;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 2.2em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  opacity: 0;

  .use-default-transition();
  .use-default-gradient-text();

  &:hover {
    scale: 1.18;
  }

  &.prev { left: .64em }
  &.next { right: .64em }
}

// 手机端纵向堆叠，整片卡流内层滚动
.deck.stacked {
  overflow: visible;

  .deck-view {
    display: block;
    translate: none;
    height: auto;
    max-height: none;
  }

  // 内容少就矮，避免大片留白
  .deck-slot {
    width: 100%;
    height: auto;
    max-height: 32em;
    margin-bottom: 2em;

    &:last-child { margin-bottom: 0 }
  }
}
</style>
