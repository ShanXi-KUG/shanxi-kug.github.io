<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { confetti } from '@/confetti'
import type { Activity } from '@/content'
import { vGlint } from '@/glint'
import { useLayout } from '@/stores/layout'
import MarkdownBody from './MarkdownBody.vue'

const props = defineProps<{ activity: Activity }>()

const flipped = ref(false)
const flipping = ref(false)
const reveal = ref(false)
const layout = useLayout()
const { stacked } = storeToRefs(layout)

/** 触屏没有右键，改成点一下把卡背整张抬出来 */
function tap() {
  if (stacked.value) reveal.value = true
}

let ease: ReturnType<typeof setTimeout>

/** 翻转中整体收一点，免得近端凸出被祖先裁掉 */
function flip() {
  flipped.value = !flipped.value
  flipping.value = true
  clearTimeout(ease)
  ease = setTimeout(() => (flipping.value = false), 620)
}

const LINK = /^\s*\[([^\]]*)]\(([^)]*)\)\s*$/

/** action 留空时退回默认按钮，且不跳转 */
const action = computed(() => {
  const m = props.activity.action?.match(LINK)
  return m ? { text: m[1], href: m[2] } : { text: '点我报名!', href: '#' }
})

const POP = [{ scale: 1 }, { scale: 0.86 }, { scale: 1.08 }, { scale: 1 }]

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

const day = computed(() =>
  Number.isNaN(props.activity.date.getTime())
    ? ''
    : props.activity.date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.'),
)

const body = computed(() => props.activity.recap ?? props.activity.detail)

const tip = ref({ x: 0, y: 0, at: '' })

/** 只在文字被截断时出现，与时间轴一致 */
function track(e: PointerEvent, at: string) {
  const line = e.currentTarget as HTMLElement
  const text = line.querySelector('p')
  const box = line.getBoundingClientRect()
  const clipped = !!text && text.scrollWidth > text.clientWidth + 1
  tip.value = { x: e.clientX - box.left, y: e.clientY - box.top, at: clipped ? at : '' }
}
</script>

<template lang="pug">
.card(@contextmenu.prevent="flip", @click="tap")
  .card-flip(:class="{ flipped, flipping }")
    .card-face.face-front
      .card-inner
        .card-head
          header.card-title-wrap
            .card-title {{ activity.title }}
          section.card-meta-wrap
            aside.card-meta
              .card-line(v-if="activity.venue", @pointermove="track($event, 'venue')")
                p 线下渠道：
                  a {{ activity.venue }}
                .card-tip(v-if="tip.at === 'venue'", :style="{ '--tx': tip.x + 'px', '--ty': tip.y + 'px' }") 线下渠道：{{ activity.venue }}
              .card-line(v-if="activity.online.length", @pointermove="track($event, 'online')")
                p 线上渠道：
                  template(v-for="([text, href], i) in activity.online", :key="href")
                    a(:href="href", target="_blank") {{ text }}
                    template(v-if="i < activity.online.length - 1") 、
                .card-tip(v-if="tip.at === 'online'", :style="{ '--tx': tip.x + 'px', '--ty': tip.y + 'px' }") 线上渠道：{{ activity.online.map((o) => o[0]).join('、') }}
        article.card-body
          MarkdownBody(:html="body")
          .card-signup(v-if="activity.signup")
            MarkdownBody(:html="activity.signup")
        .card-foot
          footer.card-date-wrap
            .card-date {{ day }}
          nav.card-action-wrap
            span(v-glint)
              a(:href="action.href", target="_blank", @click.stop="sign") {{ action.text }}
    .card-face.face-back
      MarkdownBody(v-if="activity.back", :html="activity.back")
      .face-mark(v-else)
        span 欢迎来到
        strong ShanXiKUG!
Teleport(to="body")
  Transition(name="peek")
    .peek(v-if="reveal", @click="reveal = false")
      .peek-card
        MarkdownBody(v-if="activity.back", :html="activity.back")
        .face-mark(v-else)
          span 欢迎来到
          strong ShanXiKUG!
</template>

<style lang="less" scoped>
@import "@/assets/animation";

.card {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 2600px;
  flex: 1 1 auto;

  .disable-link-decoration();

  .card-flip {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;

    transition: transform .62s @ease-slide;

    &.flipped {
      transform: rotateY(180deg);
    }

    // 旋转走过渡，缩放与抬升走关键帧，两者并行；只在翻转期间交给合成层
    &.flipping {
      animation: --card-turn .62s @ease-slide;
      will-change: transform, scale, translate;
    }
  }

  // 两面都要自带炫彩底，否则转起来只有白面在动
  .card-face {
    backface-visibility: hidden;
    // 让两面各自成层，翻转时不必反复重绘阴影
    transform: translateZ(0);
    padding: 1.68em 1.66em 1.65em;

    .use-mini-border-radius();
    .default-shadow-mini-outset();

    @media (width < 768px) {
      padding: .88em .86em .84em;
      .default-shadow-outset();
    }
  }

  // 正面留在流内撑起高度，背面覆盖其上；否则手机端自适应高度会塌成 0
  .face-front {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: var(--default-kug-gradient);
  }

  .card-inner {
    width: 100%;
    height: 100%;
    background-color: var(--default-light-white);
    border-radius: .5em / .5em 0;
    position: relative;
    padding: 1.1em 2.11em 1.08em;
    display: grid;
    grid-template: "head" 86fr "body" 255fr "foot" 41fr;
    overflow: hidden;

    // 行高交给内容，避免留白
    @media (width < 768px) {
      padding: .60em 1.11em .58em;
      height: auto;
      grid-template: "head" auto "body" minmax(0, auto) "foot" auto;
      gap: .55em;
    }

    @media (width < 1440px) {
      padding-top: .5em;
    }
  }

  .card-head {
    grid-area: head;
    width: 100%;
    height: 100%;
    display: flex;
    place-items: flex-start center;
    place-content: center space-between;
    flex: 1 1 auto;
    min-width: 0;

    .card-title-wrap {
      width: 100%;
      height: 100%;
      min-width: 0;
    }

    .card-title {
      width: max-content;
      max-width: 100%;
      height: max-content;
      font-size: 1.88em;
      font-weight: 800;
      letter-spacing: -.02em;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .use-default-gradient-text();

      &::before {
        content: "";
        display: inline-block;
        width: 100%;
        height: .075em;
        position: absolute;
        background-image: var(--default-kug-gradient);
        bottom: .15em;
      }
    }

    .card-meta-wrap {
      width: max-content;
      max-width: 55%;
      height: max-content;
      position: relative;
    }

    .card-meta {
      width: 100%;
      height: 3.34em;
      display: flex;
      flex-direction: column;
      place-items: start center;
      place-content: center space-evenly;
      flex: 1 1 auto;

      .card-line {
        position: relative;
        width: 100%;

        &:hover .card-tip {
          opacity: 1;
        }

        &:not(:hover) .card-tip {
          opacity: 0;
        }
      }

      p {
        width: 100%;
        height: 1.11em;
        line-height: 1.11em;
        font-size: 1em;
        font-weight: 300;
        color: var(--default-half-gray);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;

        a {
          color: inherit;
        }
      }

      .card-tip {
        position: absolute;
        left: var(--tx);
        top: var(--ty);
        translate: -50% 1.1em;
        z-index: 5;
        width: max-content;
        max-width: 22em;
        padding: .5em .7em;
        border-radius: .45em;
        border: 1px solid transparent;
        background:
          linear-gradient(var(--default-light-white), var(--default-light-white)) padding-box,
          var(--default-kug-gradient) border-box;
        color: var(--default-black);
        font-size: .86em;
        font-weight: 300;
        line-height: 1.5;
        white-space: normal;
        word-break: break-word;
        opacity: 0;
        pointer-events: none;

        .default-shadow-mini-outset();
        .use-default-transition();
      }
    }

    @media (width < 1440px) {
      display: flex;
      height: 100%;
      flex-direction: column;
      place-content: center;
      place-items: center;

      .card-title-wrap {
        place-items: center;
        place-content: center;

        .card-title {
          text-align: center;
          margin: 0 auto;
        }
      }

      .card-meta-wrap {
        width: 100%;
        max-width: 100%;
        height: auto;
      }

      .card-meta p {
        width: 100%;
        height: 1.11em;

        a {
          display: inline;
        }
      }
    }

    @media (width < 768px) {
      place-content: center normal;
      gap: .66em;

      .card-title-wrap {
        height: max-content;
      }

      .card-title {
        font-size: 1.55em;
        letter-spacing: 0;
        font-weight: 600;
      }

      .card-meta p {
        height: max-content;
        font-size: .88em;
      }
    }
  }

  .face-back {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    // 自身再转 180° 与翻卡相抵，坐标不镜像，得直接给镜像渐变
    background-image: var(--default-kug-gradient-flip);
    transform: rotateY(180deg);
    text-align: center;
    color: var(--default-on-gradient);
  }

  // 这里不能用 filter：它会把 transform-style 压回 flat，preserve-3d 随即失效
  @keyframes --card-turn {
    0% { scale: 1; translate: 0 0 }
    18% { scale: .84; translate: 0 -1% }
    50% { scale: .68; translate: 0 -4% }
    82% { scale: .84; translate: 0 -1% }
    100% { scale: 1; translate: 0 0 }
  }

  .face-mark {
    display: grid;
    place-items: center;
    gap: .2em;
    color: var(--default-on-gradient);
    line-height: 1.25;

    span {
      font-size: 1.35em;
      font-weight: 300;
      letter-spacing: .28em;
      text-indent: .28em;
    }

    strong {
      font-size: 2.5em;
      font-weight: 900;
      letter-spacing: .04em;
    }
  }

  .card-signup {
    position: absolute;
    inset: auto 0 0;
    max-height: 45%;
    background-color: var(--default-white);
    border-top: 1px solid var(--default-white-groove);
    overflow: hidden;
  }

  .card-body {
    grid-area: body;
    background-color: var(--default-dark-white);
    position: relative;
    width: 100%;
    margin-bottom: 7px;
    overflow: hidden;

    .default-shadow-mini-inset();

    @media (width < 768px) {
      height: auto;
      min-height: 4em;
      max-height: 18em;
      margin-bottom: 0;
    }
  }

  .card-foot {
    grid-area: foot;
    display: flex;
    place-items: end center;
    place-content: space-between;

    .card-date {
      font-size: 1.125em;
      font-weight: 800;

      .use-default-gradient-text();
    }

    .card-action-wrap {
      width: max-content;
      height: max-content;

      span {
        width: max-content;
        height: max-content;
        display: flex;
        text-align: center;
        border-radius: .275em;

        .use-glint();
        .use-glint-paint();
        transition: --kug-lit .3s ease, translate .2s ease, box-shadow .2s ease;

        @media (hover: hover) {
          &:hover {
            translate: 0 -.12em;
            box-shadow: 0 .35em .9em -.3em color-mix(in oklab, #844EFE 60%, transparent);
          }
        }

        // 整个按钮可点，不只是文字
        a {
          display: block;
          padding: .17em 1.26em;
          font-size: 0.88em;
          font-weight: 600;
          color: var(--default-on-gradient);
        }
      }
    }
  }
}
.peek {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
  padding: 1.6em;
  background-color: rgba(0, 0, 0, .62);
  backdrop-filter: blur(4px);
}

.peek-card {
  width: 100%;
  max-width: 22em;
  aspect-ratio: 5 / 7;
  display: grid;
  place-items: center;
  padding: 1.6em;
  text-align: center;
  color: var(--default-on-gradient);
  background-image: var(--default-kug-gradient-flip);

  .use-mini-border-radius();
  .default-shadow-outset();

  .face-mark {
    display: grid;
    place-items: center;
    gap: .2em;
    line-height: 1.25;

    span {
      font-size: 1.2em;
      font-weight: 300;
      letter-spacing: .28em;
      text-indent: .28em;
    }

    strong {
      font-size: 2.1em;
      font-weight: 900;
      letter-spacing: .04em;
    }
  }
}

.peek-enter-active, .peek-leave-active {
  transition: opacity .3s @ease-slide;

  .peek-card {
    transition: transform .42s @ease-slide;
  }
}

.peek-enter-from, .peek-leave-to {
  opacity: 0;

  .peek-card {
    transform: rotateY(90deg) scale(.86);
  }
}
</style>
