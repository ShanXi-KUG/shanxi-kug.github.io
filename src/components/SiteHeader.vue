<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";

import { vGlint } from "@/glint";
import { useTheme } from "@/stores/theme";

const theme = useTheme();
const { dark } = storeToRefs(theme);
const menu = ref(false);
</script>

<template lang="pug">
header#header
  #menu-btn(v-glint, title="更多选项", @click.stop="menu = !menu")
  a(href="/")
    img#home-logo(src='/logo_only_en.svg', align='center', alt='ShanXi - KUG')
  nav#nav-wrapper
    ul#nav
      li#new(v-glint) 最新活动
        a(href="#new-active")
      li.lined 历史活动
        a(href="#history-active")
      li#join-us.lined 联系我们
        a(href="#footer-wrapper")
      hr
      li#kotlin-docs(v-glint, title="点击跳转Kotlin官文") Kotlin Docs
        a(href="https://kotlinlang.org/docs/home.html", target="_blank")
      hr
      li#style(v-glint, @click="theme.toggle")
        #switch(:class="{ dark }", :title="dark ? '切换至：白天模式' : '切换至：夜间模式'")
          #btn(:class="{ dark }")
      li#github(v-glint, title="访问我们的组织")
        a(href="https://github.com/ShanXi-KUG")
Teleport(to="body")
  Transition(name="drawer")
    aside#drawer(v-if="menu", @click.self="menu = false")
      .drawer-panel
        header.drawer-head
          button.drawer-back(v-glint, @click="menu = false", aria-label="返回")
          .drawer-title 其他选项
        nav.drawer-card
          a.drawer-row(v-glint, href="#new-active", @click="menu = false")
            span 最新活动
          a.drawer-row(v-glint, href="#history-active", @click="menu = false")
            span 历史活动
        nav.drawer-card
          a.drawer-row.is-out(v-glint, href="https://kotlinlang.org/docs/home.html", target="_blank", @click="menu = false")
            span Kotlin Docs
        section.drawer-contact
          .drawer-contact-title 联系我们
          ul.drawer-links
            li.drawer-link.qq(v-glint, title="加 QQ 好友")
              a(href="https://wpa.qq.com/msgrd?v=3&uin=3222087513&site=qq&menu=yes", target="_blank")
            li.drawer-link.mail(v-glint, title="发邮件")
              a(href="mailto:chengkelfan@qq.com")
            li.drawer-link.gh(v-glint, title="访问组织")
              a(href="https://github.com/ShanXi-KUG", target="_blank")
            li.drawer-link.wx(v-glint, title="扫码加微信")
              a(href="/icons/qr-codes/my_wx_heke1228.jpg", target="_blank")
        p.drawer-copy ©2026 山西 KUG Powered by VueJs & LeoCheng
</template>

<style lang="less" scoped>
@header-height: 3.88em;

.disable-list-style();

header#header {
  position: fixed;
  width: 100%;
  height: @header-height;
  background-color: var(--default-light-white);
  padding: .1em 6.66em 0;
  // 6.66em 在中等宽度下会把 logo 和导航挤到一起
  @media (width < 1440px) { padding: .1em 3em 0 }
  @media (width < 1100px) { padding: .1em 1.6em 0 }
  display: flex;
  place-items: center center;
  place-content: center space-between;
  z-index: 233;
  top: 0;
  left: 0;

  #menu-btn {
    display: none;
  }

  @sub-height: max(70%);

  a {
    display: inline-block;
    position: relative;
    height: 100%;
    width: max-content;
    left: 0;
    place-content: center;
    #home-logo {
      height: @sub-height;
    }
  }

  nav#nav-wrapper {
    position: relative;
    right: 0;
    height: 100%;
    width: max-content;
    &[dev] {background-color: #15ED41;}
    display: inline-block;
    place-content: center;

    ul#nav {
      height: @sub-height;
      width: min(35em, 60vw);
      display: flex;
      flex-direction: row;
      place-items: center;
      place-content: space-around;
      flex: 1 1 auto;

      li {
        display: inline-block;
        width: max-content;
        height: max-content;
        position: relative;

        a {
          display: inline-block;
          position: absolute;
          width: 100%;
          height: 100%;
        }

        &#new, &#kotlin-docs {
          font-weight: 800;
          font-size: 1.15em;
        }

        &#new {
          .use-flow-text();
        }

        &#kotlin-docs {
          .use-glint();
          .use-glint-text();
        }

        // 与首页「ShanXi Kotlin User Group」同一手法，线换成暗色
        &.lined::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -.2em;
          width: 100%;
          height: 1px;
          background-color: currentColor;
          scale: 0 1;
          transform-origin: left;
          transition: scale .25s ease;
          pointer-events: none;
        }

        @media (hover: hover) {
          &.lined:hover::after {
            scale: 1 1;
          }
        }

        &#style {
          @track-w: 2.8em;
          @track-h: 1.45em;
          @pad: .1em;
          @ball: @track-h - @pad * 2;

          width: @track-w;
          height: @track-h;
          border-radius: @track-h;
          background-color: var(--default-dark-white);
          display: flex;
          align-items: center;
          padding: @pad;
          cursor: pointer;

          .use-glint();
          .default-shadow-mini-inset();

          #switch {
            width: @ball;
            height: @ball;
            flex: 0 0 auto;
            border-radius: 100%;
            background-color: var(--default-light-white);
            display: grid;
            place-items: center;
            translate: 0;

            .default-shadow-mini-outset();
            .use-default-transition();

            &.dark {
              translate: (@track-w - @ball - @pad * 2);
            }

            #btn {
              width: 72%;
              aspect-ratio: 1 / 1;
              mask: url("/icons/daylight.svg") no-repeat center / contain;

              .use-glint-paint();

              &.dark {
                mask-image: url("/icons/moonlight.svg");
              }
            }
          }
        }

        &#github {
          height: @sub-height * .95;
          aspect-ratio: 1 / 1;
          mask: url("/icons/platforms/gh.svg") no-repeat center / contain;

          .use-glint(0);
          .use-glint-paint(var(--default-half-gray));
        }

        color: var(--default-half-gray);
        font-size: 1.05em;
        font-weight: 500;

        &[dev] {background-color: #4000FF;}
      }

      hr {
        border: none;
        padding: 0;
        margin: 0;
        width: 0;
        height: @sub-height * 0.66;
        border-right: 2px var(--default-half-gray) solid;
        opacity: .55;
      }
    }
  }

  .default-shadow-mini-outset();

  @media (width < 768px) {
    padding: 0 1em;
    place-content: center space-between !important;

    #menu-btn {
      display: block;
      height: 95%;
      aspect-ratio: 1 / 1;
      &[dev] {background-color: #4000FF}
      mask: url("/icons/menubtn.svg") no-repeat 50% 57.5% / 45%;

      .use-glint(0);
      .use-glint-paint(var(--default-half-gray));
    }

    nav#nav-wrapper {
      ul#nav {
        width: max-content;
      }

      ul * {
        display: none !important;
      }

      // 手机端只留主题开关，按各自角色恢复排布，别用 100% 把它压变形
      li#style {
        display: flex !important;
      }

      li#style #switch {
        display: grid !important;
      }

      li#style #btn {
        display: block !important;
      }
    }

    #home-logo {
      height: 80%;
    }
  }
}

// 设计稿「手机侧边栏」：抽屉 300/360=83.3%，卡片 279 宽、左右各留 11
#drawer {
  position: fixed;
  inset: 0;
  z-index: 666;
  background-color: rgba(0, 0, 0, .5);

  .disable-link-decoration();

  @media (width >= 768px) {
    display: none;
  }
}

.drawer-panel {
  width: 83.33%;
  height: 100%;
  background-color: var(--default-dark-white);
  display: flex;
  flex-direction: column;
  gap: 1.08em;
  padding: 0 3.67% 1em;
  overflow-y: auto;

  .disable-browser-scrollbar();
}

// 三栏等分两侧，标题才能相对整块面板居中，不被返回键推偏
.drawer-head {
  height: 3.06em;
  flex: 0 0 auto;
  margin: 0 -4.4%;
  padding: 0 1.06em;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background-color: var(--default-light-white);
  box-shadow: 0 1px var(--shadow-black);
}

.drawer-back {
  justify-self: start;
  width: 1.9em;
  aspect-ratio: 1 / 1;
  padding: 0;
  border: none;
  cursor: pointer;
  mask: url("/icons/back.svg") no-repeat center / contain;

  .use-glint(0);
  .use-glint-paint(var(--default-black));
}

.drawer-title {
  font-size: 1.25em;
  font-weight: 500;
  color: var(--default-half-gray);
}

.drawer-card {
  background-color: var(--default-light-white);
  overflow: hidden;

  .use-mini-border-radius();
  .default-shadow-mini-outset();
}

.drawer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.78em;
  padding: 0 .95em 0 1.06em;
  font-size: 1.125em;
  position: relative;

  .use-glint(0);

  &+& {
    border-top: 1px solid var(--default-white-groove);
  }

  span {
    .use-glint-text(var(--default-black));
  }

  &::after {
    content: "";
    width: 1.2em;
    height: 1.2em;
    mask: url("/icons/innerlink.svg") no-repeat center / contain;

    .use-glint-paint(var(--default-half-gray));
  }

  // 设计稿里 Kotlin Docs 常亮渐变，按下只转角度
  &.is-out {
    span {
      --kug-lit: 1;
      font-weight: 700;
    }

    &::after {
      width: 1.05em;
      height: 1.05em;
      mask-image: url("/icons/newlink.svg");
    }
  }
}

.drawer-contact {
  margin-top: auto;
  padding: 1.06em 0 1.4em;
  background-color: var(--default-light-white);

  .use-mini-border-radius();
  .default-shadow-mini-outset();
}

.drawer-contact-title {
  text-align: center;
  font-size: 1.125em;
  font-weight: 500;
  color: var(--default-black);
  margin-bottom: 1.1em;
}

.drawer-links {
  display: flex;
  justify-content: space-between;
  padding: 0 10.4%;
}

.drawer-link {
  width: 2.25em;
  aspect-ratio: 1 / 1;
  position: relative;

  .use-glint(0);
  .use-glint-paint(var(--default-black));

  a {
    position: absolute;
    inset: 0;
  }

  // 各 svg 的墨迹占 viewBox 的比例不同（gh 铺满、qq 仅 28/36），
  // 用 contain 会让 gh 显得最大，这里按墨迹反算，统一视觉尺寸
  &.qq { mask: url("/icons/platforms/qq.svg") no-repeat center / 103% }
  &.mail { mask: url("/icons/platforms/mail.svg") no-repeat center / 93% }
  &.wx { mask: url("/icons/platforms/wx.svg") no-repeat center / 96% }

  &.gh { mask: url("/icons/platforms/gh.svg") no-repeat center / 80% }
}

.drawer-copy {
  flex: 0 0 auto;
  margin: 0;
  text-align: center;
  font-size: .625em;
  color: var(--default-half-gray);
}

.drawer-enter-active, .drawer-leave-active {
  transition: opacity .28s ease;

  .drawer-panel {
    transition: translate .32s ease;
  }
}

.drawer-enter-from, .drawer-leave-to {
  opacity: 0;

  .drawer-panel {
    translate: -100% 0;
  }
}
</style>
