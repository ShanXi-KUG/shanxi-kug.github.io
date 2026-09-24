<script setup lang="ts">
defineProps<{ show: boolean }>();

/** 页脚由外层滚动露出，只跳内层锚点收不回去，两层都得归零 */
function toTop(e: MouseEvent) {
  e.preventDefault();
  for (const sel of ["main#body", "article#main"]) {
    document.querySelector(sel)?.scrollTo({ top: 0, behavior: "smooth" });
  }
}
</script>

<template lang="pug">
#back-to-top(v-show="show")
  a(href="#home-page", @click="toTop")
    span ^
</template>

<style lang="less" scoped>
#back-to-top {
  display: flex;
  position: fixed;
  // 与线上原版一致：宽 max(3%, 3em)、距右 3%、距底 9%
  width: max(3%, 3em);
  aspect-ratio: 1 / 1;
  background-color: var(--default-light-white);
  place-content: center;
  place-items: center;
  right: 3%;
  bottom: 9%;

  font-weight: 700;
  transform-origin: center;
  border-radius: .5em;

  .use-default-transition();

  &:hover {
    scale: 1.08;
  }

  a {
    display: flex;
    width: 100%;
    height: 100%;
    place-content: center;
    place-items: center;
  }

  span {
    display: block;
    font-size: 1.5em;
    line-height: 1;
    // 脱字符字身偏上
    translate: 0 .12em;

    .use-default-gradient-text();
  }

  .use-mini-border-radius();
  .default-shadow-mini-outset();

  @media (width < 768px) {
    display: none;
  }
}
</style>
