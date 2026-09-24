<script setup lang="ts">
import { ref } from 'vue'

const flipped = ref(false)
</script>

<template lang="pug">
.blank(:class="{ flipped }", @click="flipped = !flipped")
  .blank-inner
    .blank-face.front
      .blank-mark 下一场尚未寄出
      .blank-hint 点一下，看看怎么发起
    .blank-face.back
      ol
        li 在 #[code activity/new/] 下新建一个目录
        li 放一份 #[code card.md]，写上标题与日期
        li 提交，页面自己就会出现
</template>

<style lang="less" scoped>
.blank {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1.68em 1.66em 1.65em;
  background-image: var(--default-kug-gradient);
  cursor: pointer;
  perspective: 1400px;

  .use-mini-border-radius();
  .default-shadow-mini-outset();

  @media (width < 768px) {
    padding: .88em .86em .84em;
  }
}

.blank-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;

  .use-slide-transition(transform);
}

.blank.flipped .blank-inner {
  transform: rotateY(180deg);
}

.blank-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
  gap: .66em;
  padding: 1.5em;
  border-radius: .5em / .5em 0;
  background-color: var(--default-light-white);
  backface-visibility: hidden;

  &.back {
    transform: rotateY(180deg);
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
