<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { Activity } from '@/content'
import { vGlint } from '@/glint'
import { useSignup } from '@/signup'
import MarkdownBody from './MarkdownBody.vue'

const props = defineProps<{ activity: Activity }>()

const { action, sign } = useSignup(toRef(() => props.activity))

const day = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
const clock = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const zone = new Intl.DateTimeFormat('zh-CN', { timeZoneName: 'shortOffset' })

const date = (d: Date) => day.format(d).replaceAll('/', '.').replace('周', ' 周')

function range([a, b]: [Date, Date]) {
  const head = `${date(a)} ${clock.format(a)}`
  return date(a) === date(b) ? `${head} – ${clock.format(b)}` : `${head} – ${date(b)} ${clock.format(b)}`
}

const tz = computed(() => zone.formatToParts(props.activity.during[0]).find((p) => p.type === 'timeZoneName')?.value)
const body = computed(() => props.activity.recap ?? props.activity.detail)
</script>

<template lang="pug">
article.detail
  .detail-inner
    header.detail-head
      h2.detail-title {{ activity.title }}
      span.detail-status(:class="activity.status === '已结束' ? 'done' : activity.status === '报名中' ? 'open' : 'live'") {{ activity.status }}
    dl.detail-facts
      dt 时间
      dd {{ range(activity.during) }} #[span.detail-zone {{ tz }}]
      template(v-if="activity.enroll")
        dt 报名
        dd {{ range(activity.enroll) }}
      template(v-if="activity.venue")
        dt 地点
        dd {{ activity.venue }}
      template(v-if="activity.online.length")
        dt 线上
        dd
          template(v-for="([text, href], i) in activity.online", :key="href")
            a(:href="href", target="_blank", rel="noopener") {{ text }}
            template(v-if="i < activity.online.length - 1") 、
    section.detail-body(v-if="body || activity.signup")
      MarkdownBody(v-if="body", :html="body", full)
      MarkdownBody(v-if="activity.signup", :html="activity.signup", full)
    footer.detail-foot(v-if="activity.status !== '已结束' || activity.action")
      span.detail-action(v-glint)
        a(:href="action.href", target="_blank", @click.stop="sign") {{ action.text }}
</template>

<style lang="less" scoped>
.detail {
  width: min(56em, 92vw);
  max-height: 86vh;
  display: flex;
  padding: 1.1em;
  background-image: var(--default-kug-gradient);
  cursor: auto;

  .use-mini-border-radius();
  .default-shadow-mini-outset();

  @media (width < 768px) {
    width: 94vw;
    padding: .7em;
  }
}

.detail-inner {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1em;
  padding: 1.6em 1.8em 1.4em;
  border-radius: .5em / .5em 0;
  background-color: var(--default-light-white);
  overflow-y: auto;
  overscroll-behavior: contain;

  .disable-browser-scrollbar();
  .disable-link-decoration();

  @media (width < 768px) {
    padding: 1.1em 1em 1em;
    gap: .9em;
  }
}

.detail-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .4em .9em;
}

.detail-title {
  margin: 0;
  font-size: 1.9em;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -.02em;

  .use-default-gradient-text();

  @media (width < 768px) {
    font-size: 1.5em;
  }
}

.detail-status {
  flex: 0 0 auto;
  padding: .12em .7em;
  border-radius: 1em;
  font-size: .82em;
  font-weight: 600;

  &.open {
    color: var(--default-on-gradient);
    background-image: var(--default-kug-gradient);
  }

  &.live {
    border: 1px solid transparent;
    background:
      linear-gradient(var(--default-light-white), var(--default-light-white)) padding-box,
      var(--default-kug-gradient) border-box;
    color: var(--kug-default-purple);
  }

  &.done {
    color: var(--default-half-gray);
    background-color: var(--default-dark-white);
  }
}

.detail-facts {
  margin: 0;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: .45em 1.1em;
  font-size: .95em;
  line-height: 1.6;

  dt {
    color: var(--default-half-gray);
    font-weight: 300;
  }

  dd {
    margin: 0;
    color: var(--default-black);
    overflow-wrap: anywhere;
  }

  a {
    font-weight: 500;

    .use-default-gradient-text();
  }
}

.detail-zone {
  margin-left: .4em;
  font-size: .85em;
  color: var(--default-half-gray);
}

.detail-body {
  background-color: var(--default-dark-white);

  .default-shadow-mini-inset();
}

.detail-foot {
  display: flex;
  justify-content: flex-end;
}

.detail-action {
  display: flex;
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

  a {
    display: block;
    padding: .3em 1.4em;
    font-weight: 600;
    color: var(--default-on-gradient);
  }
}
</style>
