<script setup lang="ts">
import {useScroll, useUrlSearchParams} from "@vueuse/core";
import {computed, ref} from "vue";

import CardDeck from "@/components/CardDeck.vue";
import BackToTop from "@/components/BackToTop.vue";
import CardDialog from "@/components/CardDialog.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import SiteHeader from "@/components/SiteHeader.vue";
import TimeAxis from "@/components/TimeAxis.vue";
import {activities, history, upcoming, type Activity} from "@/content";
import {useDecks} from "@/stores/decks";

const body = ref<HTMLElement | null>(null);
const main = ref<HTMLElement | null>(null);
const home = ref<HTMLElement | null>(null);

const decks = useDecks();
const {y: outer} = useScroll(body);
const {y: inner} = useScroll(main);

const showBackTop = computed(() => outer.value > 0 || inner.value / (home.value?.scrollHeight || 800) > .97);

// 历史那段也要能点
const axisItems = [...upcoming, ...history].filter(
  (a, i, all) => all.findIndex((b) => b.id === a.id) === i,
);

const {activity: wanted} = useUrlSearchParams<{activity?: string}>("history");
const picked = ref<Activity | null>(activities.find((a) => a.id === wanted) ?? null);

function jump(a: Activity): void {
  const done = a.status === "已结束";
  decks.focus(done ? "history" : "new", a.id);
  document.getElementById(done ? "history-active" : "new-active")?.scrollIntoView({behavior: "smooth"});
}
</script>

<template lang="pug">
main#body(ref="body")
  SiteHeader
  article#main(ref="main")
    #home-page(name="main", ref="home")
      #home-page-wrapper
        header#title
          img#logo(alt='ShanXi - KUG', src='/logo_with_text.svg', align='center', about='QwQ')
        main#content-wrapper
          #content 在这里你可以
            a#join-us 联系我们
            | 加入
            a#github-org ShanXi Kotlin User Group
            | ，一起讨论学习Kotlin以及参与相关的线上线下活动！
        footer#footer
          p Kotlin 是一种现代的、静态类型的编程语言，由 JetBrains 公司于 2011 年开发并于 2016 年正式发布。
          p Kotlin 设计的目标是提供一种更简洁、更安全、更高效的替代 Java 的编程语言，同时保持与 Java 的完全互操作性。
          p Kotlin 可以用于 Android 开发、服务器端开发、Web 开发等多种场景。
    #new-active(name="new")
      #new-active-wrapper
        nav#time-axis-wrapper
          #axis-wrapper
            TimeAxis(:items="axisItems", @jump="jump", @peek="picked = $event")
        main#content-wrapper
          #card-wrapper
            #card-content
              CardDeck(stage="new", :items="upcoming")
    #history-active(name="history")
      #history-active-wrapper
        #history-wrapper
          header#title 历史活动
          main#content-wrapper
            #card-wrapper
              #card-content
                CardDeck(stage="history", :items="history")
  SiteFooter
  BackToTop(:show="showBackTop")
  CardDialog(:activity="picked", @close="picked = null")
</template>

<style lang="less" scoped>
  main#body {
    width: 100%;
    height: 100%;
    &[dev] {background-color: #15ED41;}
    background-color: var(--default-white);

    .disable-list-style();

    .disable-browser-scrollbar();

    // 滚动条会挤出横向溢出
    overflow-x: hidden;

    @header-height: 3.88em;

    article#main {
      width: min(max(72%, 768px), 100%);
      @media (width < 1024px) {width: 100%}
      display: block;
      margin: 0 auto;
      height: 100%;
      &[dev] {background-color: #15ED41;height: 100%}
      background-color: var(--default-light-white);
      scroll-snap-type: y mandatory;
      overflow-y: scroll;
      padding-top: @header-height;
      scroll-padding-top: @header-height;

      .disable-browser-scrollbar();

      #home-page, #new-active, #history-active {
        width: max(100%, 768px);
        height: max(calc(100vh - @header-height), 33em);
        scroll-snap-align: start;
        position: relative;
      }

      #home-page {
        &[dev] { background-color: #4000FF; }

        #home-page-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          &[dev] {background-color: #296DFF;}
          display: grid;
          grid-template: "logo" 188fr "info" 30fr "temp" 116fr;

          #title {
            &[dev] {background-color: #0AFAB6;}
            place-content: center center;
            padding: 8.86% 0 0;

            img#logo {
              width: 66%;
              display: block;
              margin: 0 auto;
            }
          }

          #content-wrapper {
            &[dev] {background-color: #4000FF;}
            text-align: center;
            place-content: center;
            position: relative;

            #content {
              font-size: 1.175em;
              font-weight: 300;
              @height: 2.22em;
              height: @height;
              width: max-content;
              margin: 0 auto;
              padding: 0 .223em;
              line-height: @height;
              color: var(--default-half-gray);
              &[dev] {background-color: #0AFAB6;}
              border: 1px var(--default-half-gray) solid;
              border-right: 0;
              border-left: 0;

              a#join-us {
                font-weight: bold;
                opacity: 1;
                &:hover {
                  .use-default-transition();
                  .use-default-gradient-text();
                }
                color: #964be5;
              }

              a#github-org {
                opacity: .88;
                &:hover {
                  opacity: 1;
                  &::before {
                    width: 100%;

                    .use-default-transition();
                  }
                }
                display: inline-block;
                width: max-content;
                position: relative;

                .use-default-gradient-text();

                &::before {
                  content: "";
                  position: absolute;
                  display: block;
                  background-image: var(--default-kug-gradient);
                  bottom: 26.3%;
                  width: 0;
                  height: 1px;
                  pointer-events: none;
                }
              }
            }
          }

          #footer {
            &[dev] {background-color: red;}
            position: relative;
            display: flex;
            flex-direction: column;
            place-content: center space-evenly;
            text-align: center;
            place-items: center;
            flex: 1 1 auto;
            padding: 2.88em 0 4.44em;

            p {
              margin: 0;
              padding: 0;
              font-size: 1.15em;
              font-weight: 350;
              color: var(--default-black);
            }
          }

          @media (1024px <= width < 1280px) or (width < 768px) {
            display: flex !important;
            flex-direction: column !important;
            place-content: center space-evenly !important;

            img {
              width: 80% !important;
            }
          }
        }

        @media (1024px <= width < 1280px) or (width < 768px) {

          footer#footer {
            display: none !important;
          }

          main#content-wrapper {
            height: max-content !important;

            #content {
              height: max-content !important;
              width: 80% !important;
            }
          }
        }
      }

      @sub-content-width: 90.25%;

      #new-active {
        position: relative;
        // 不显式撑满，手机上会按最宽的那页缩放
        width: 100%;
        height: 100%;
        &[dev] {background-color: #15ED41;}

        #new-active-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          &[dev] {background-color: #964be5;}
          display: grid;
          grid-template: "time-axis" 233fr "card-area" 582fr;

          #time-axis-wrapper {
            grid-area: time-axis;
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 11em;
            &[dev] {background-color: orange;}
            place-content: center;
            place-items: center;
            padding-top: 5.66%;

            @media (height < 760px) { padding-top: 2.4% }

            #axis-wrapper {
              width: @sub-content-width;
              margin: 0 auto;
              height: 86.6%;
              // 还要留给上下参差的标签
              min-height: 9.5em;
              background-color: var(--default-white);
              position: relative;
              padding: 2.33em;

              .use-mini-border-radius();

              // 视口一矮内边距就吃光轨道
              @media (height < 760px) { padding: 1.4em 2.33em }
              @media (height < 620px) { padding: .9em 2.33em }
            }
          }

          #content-wrapper {
            grid-area: card-area;
            position: relative;
            width: 100%;
            height: 100%;
            &[dev] {background-color: #15ED41;}
            place-content: center;
            place-items: center;
            padding-bottom: 2.88%;
            overflow: hidden;

            #card-wrapper {
              width: @sub-content-width;
              margin: 0 auto;
              height: 96.6%;
              background-color: var(--default-white);
              position: relative;
              padding: 2.33em;

              .use-mini-border-radius();

              // 阴影归明信片自己，放在这层翻转时会成一圈静止的边框
              #card-content {
                width: 100%;
                height: 100%;
                position: relative;
              }
            }
          }
        }
      }

      #history-active {
        &[dev] {background-color: #296DFF;}
        width: 100%;
        height: 100%;
        position: relative;

        #history-active-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          &[dev] {background-color: #15ED41;}
          place-content: center;
          place-items: center;
          padding-top: 5.66%;

          #history-wrapper {
            width: @sub-content-width;
            height: 83.6%;
            margin: 0 auto;
            position: relative;
            &[dev] {background-color: #4000FF;}
            background-color: var(--default-white);
            display: grid;
            grid-template: "title" 133.3fr "card-area" 666fr;

            .use-mini-border-radius();

            #title {
              grid-area: title;
              position: relative;
              width: 100%;
              height: 100%;
              place-content: center;
              place-items: center;
              text-align: center;
              font-size: 2.588em;
              font-weight: 400;
              padding-top: .22em;
              color: var(--default-half-gray);
              &[dev] {background-color: gold }
            }

            #content-wrapper {
              grid-area: card-area;
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
              place-content: center;
              place-items: center;
              padding-bottom: 4.38%;

              #card-wrapper {
                width: 100%;
                margin: 0 auto;
                height: 100%;
                position: relative;
                padding: .33em 2.33em;

                #card-content {
                  width: 100%;
                  height: 100%;
                  position: relative;
                }
              }
            }
          }
        }
      }
    }
  }

  @media (width < 768px) {
    article#main {
      scroll-snap-type: unset !important;
      background-color: var(--default-dark-white) !important;

      &>* {
        display: block !important;
        width: 94.44% !important;
        margin: 0 auto !important;
        margin-bottom: 1em !important;
        background-color: var(--default-light-white) !important;

        .use-half-border-radius() !important;
        .default-shadow-outset() !important;
      }

      #home-page {
        margin-top: 5em !important;
        height: 25em !important;

        // 只为提升优先级
        main#body & #home-page-wrapper {
          place-content: center space-between !important;

          #content-wrapper {
            #content {
              margin-bottom: 3em !important;
            }
          }
        }
      }

      #new-active {
        // 手机端按内容取高，否则会被基础的 33em 撑出大片空白
        height: max-content !important;

        #new-active-wrapper {
          position: relative !important;
          height: max-content !important;
          display: flex !important;
          flex-direction: column !important;

          nav#time-axis-wrapper {
            height: 3.34em !important;
            position: relative !important;
            display: flex !important;
            place-items: flex-end !important;
            place-content: center !important;
            padding-top: 0 !important;

            #axis-wrapper {
              display: none !important;
            }

            &::after {
              content: "最近活动";
              width: max-content;
              @height: 2.33em;
              height: 2em !important;
              line-height: @height !important;
              font-size: 1.44em !important;
              display: inline-block;
              text-align: center;
              margin: 0 auto !important;

              @media (width < 456px) {
                @height: 2em;
                height: @height !important;
                line-height: @height !important;
              }

              .use-default-gradient-text();
            }
          }

          main#content-wrapper {
            padding-bottom: 1.11em !important;

            #card-wrapper {
              padding: max(7px, .5em) !important;
              border-radius: unset !important;
              background-color: var(--default-white) !important;
              .default-shadow-mini-inset() !important;
            }
          }
        }
      }

      #history-active {
        height: max-content !important;

        #history-active-wrapper {
          height: max-content !important;
          // 底部留白与最新活动一致
          padding: 0 0 (1.11em * 1.44em) !important;
          position: relative !important;

          &::before {
            content: "历史活动";
            width: max-content;
            height: max-content;
            line-height: (3.34em / 1.44em + .2em);
            font-size: 1.44em !important;
            display: block;
            text-align: center;
            margin: 0 auto !important;

            @media (width < 456px) {
              @height: 2em;
              height: @height !important;
              line-height: @height !important;
            }

            .use-default-gradient-text();
          }

          #history-wrapper {
            position: relative !important;
            display: block !important;
            padding: 0 !important;
            border-radius: unset !important;
            background-color: var(--default-white) !important;
            .default-shadow-mini-inset() !important;

            #title {
              display: none;
            }

            #content-wrapper {
              padding: 0 !important;

              #card-wrapper {
                padding: max(7px, .5em) !important;
              }
            }
          }
        }
      }
    }
  }
</style>
