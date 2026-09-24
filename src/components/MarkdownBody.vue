<script setup lang="ts">
defineProps<{ html?: string }>()
</script>

<template lang="pug">
.md(v-if="html", v-html="html")
.md.md-empty(v-else)
  span 正文尚未寄出
</template>

<style lang="less" scoped>
// 正文样式一律收在 .md 之下，避免外层的标签选择器与 MD 内容互相串味
.md {
  width: 100%;
  height: 100%;
  padding: 1.11em 1.33em;
  overflow-y: auto;

  @media (width < 768px) {
    height: auto;
    max-height: 18em;
    padding: .88em 1em;
  }
  overscroll-behavior: contain;
  color: var(--default-black);
  font-size: .95em;
  font-weight: 300;
  line-height: 1.75;

  .disable-browser-scrollbar();
  .disable-link-decoration();

  // 底部淡出，示意下面还有
  mask-image: linear-gradient(to bottom, #000 calc(100% - 2.2em), transparent 100%);

  :deep(p) {
    margin: 0 0 .66em;
  }

  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    margin: 0 0 .5em;
    font-weight: 700;
    line-height: 1.4;

    .use-default-gradient-text();
  }

  :deep(h1) { font-size: 1.33em }
  :deep(h2) { font-size: 1.2em }
  :deep(h3) { font-size: 1.08em }

  :deep(a) {
    font-weight: 500;

    .use-default-gradient-text();
  }

  :deep(ul), :deep(ol) {
    margin: 0 0 .66em;
    padding-left: 1.33em;
  }

  :deep(li) {
    list-style: inherit;
    margin: .15em 0;
  }

  :deep(blockquote) {
    margin: 0 0 .66em;
    padding: .2em 0 .2em .88em;
    border-left: 2px solid var(--default-half-gray);
    color: var(--default-half-gray);
  }

  :deep(code) {
    padding: .1em .35em;
    border-radius: .25em;
    background-color: var(--default-white);
    font-size: .92em;
  }

  :deep(pre) {
    margin: 0 0 .66em;
    padding: .75em 1em;
    border-radius: .35em;
    background-color: var(--default-white);
    overflow-x: auto;

    .disable-browser-scrollbar();

    code {
      padding: 0;
      background: none;
    }
  }

  :deep(img), :deep(video) {
    max-width: 100%;
    height: auto;
    border-radius: .35em;
  }

  :deep(iframe) {
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    border: none;
    border-radius: .35em;
  }

  :deep(hr) {
    border: none;
    height: 1px;
    background-image: var(--default-kug-gradient);
    opacity: .4;
    margin: 1em 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 .66em;
  }

  :deep(th), :deep(td) {
    padding: .35em .5em;
    border: 1px solid var(--default-white-groove);
    text-align: center;
  }
}

.md-empty {
  display: flex;
  place-items: center;
  place-content: center;

  span {
    font-size: 1.05em;
    font-weight: 300;
    color: var(--default-half-gray);
  }
}
</style>
