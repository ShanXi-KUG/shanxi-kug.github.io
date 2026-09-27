<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'
import type { Stage } from '@/content'

const props = defineProps<{ stage: Stage }>()

const flipped = ref(false)
const flipping = ref(false)

function flip() {
  if (props.stage !== 'new') return
  flipped.value = !flipped.value
  flipping.value = true
}

useSwipe(useTemplateRef('root'), {
  onSwipeEnd: (_, dir) => (dir === 'left' || dir === 'right') && flip(),
})
</script>

<template lang="pug">
.blank(ref="root", :class="{ still: stage !== 'new' }", @click="flip", @contextmenu.prevent="flip")
  .blank-flip(:class="{ flipped, flipping }", @animationend.self="flipping = false")
    .blank-face.front
      .blank-inner
        template(v-if="stage === 'new'")
          .blank-mark 下一场尚未寄出
          .blank-hint 点一下，看看怎么发起
        template(v-else)
          .blank-mark 还没有往期活动
          .blank-hint 活动结束后自动归档到这里
    .blank-face.back(v-if="stage === 'new'")
      .blank-inner
        ol
          li 复制 #[code docs/模板/活动目录名/] 到 #[code src/activity/new/]
          li 填写 #[code card.md]
          li 提交，页面随之更新
</template>

<style lang="less" scoped>
.blank {
  width: 100%;
  height: 100%;
  cursor: pointer;
  perspective: 400cqi;

  &.still {
    cursor: default;
  }
}

.blank-flip {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform .62s @ease-slide;

  &.flipped {
    transform: rotateY(180deg);
  }

  &.flipping {
    animation: --kug-turn .62s @ease-slide;
    will-change: transform, scale, translate;
  }
}

.blank-face {
  padding: 1.68em 1.66em 1.65em;
  backface-visibility: hidden;
  transform: translateZ(0);

  .use-mini-border-radius();
  .default-shadow-mini-outset();

  @media (width < 768px) {
    padding: .88em .86em .84em;
  }

  &.front {
    position: relative;
    height: 100%;
    background-image: var(--default-kug-gradient);
  }

  &.back {
    position: absolute;
    inset: 0;
    background-image: var(--default-kug-gradient-flip);
    transform: rotateY(180deg);
  }
}

.blank-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
  gap: .66em;
  padding: 1.5em;
  border-radius: .5em / .5em 0;
  background-color: var(--default-light-white);

  @media (width < 768px) {
    min-height: 12em;
  }
}

.blank-mark {
  font-size: 1.55em;
  font-weight: 800;
  letter-spacing: .02em;

  .use-default-gradient-text();
}

.blank-hint {
  font-size: .92em;
  font-weight: 300;
  color: var(--default-half-gray);
}

ol {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: .55em;

  li {
    list-style: decimal;
    font-size: .95em;
    font-weight: 300;
    line-height: 1.6;
    color: var(--default-black);
  }
}

code {
  padding: .1em .4em;
  border-radius: .25em;
  background-color: var(--default-dark-white);
  font-size: .92em;
}
</style>
