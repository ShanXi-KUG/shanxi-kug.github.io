<script setup lang="ts">
import {onMounted, type Ref, ref} from "vue";

const body: Ref<HTMLElement | null> = ref(null);
const main: Ref<HTMLElement | null> = ref(null);
const home: Ref<HTMLElement | null> = ref(null);

const showBackTop: Ref<Boolean> = ref(false);

const getScrollTop = (e: Ref<HTMLElement | null>) => e.value?.scrollTop || 0;

function updateBackTop(): void {
  showBackTop.value = (getScrollTop(body) > 0) || getScrollTop(main) / (home.value?.scrollHeight || 800) > .97;
  requestAnimationFrame(updateBackTop);
}

onMounted(() => {
  // 因为显示右下角的返回页面顶部的按钮有可能被跳id和滚动影响...
  updateBackTop()
})
</script>

<template lang="pug">
main#body(ref="body")
  header#header
    a(href="/")
      img#home-logo(src='/logo_only_en.svg', align='center', alt='ShanXi - KUG')
    nav#nav-wrapper
      ul#nav
        li#new 最新活动
          a(href="#new-active")
        li 历史活动
          a(href="#history-active")
        li 联系我们
          a(href="#footer-wrapper")
        hr
        li#kotlin-docs(title="点击跳转Kotlin官文") Kotlin Docs
          a(href="https://kotlinlang.org/docs/home.html", target="_blank")
        hr
        li#style
          // 可点击的：switch
          #switch(title="切换至：夜间模式")
            // 点击后移动的小太阳 / 月亮
            #btn
        li#github(title="访问我们的组织")
          a(href="https://github.com/ShanXi-KUG")
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
            #axis-content
              #axis
                #axis-date
                  // 本体是时间星，其余的都是伪元素，上下参差使用nth选择即可
                  .date-point(title="2025.03.23：Kotlin分享会", style="--pos: 15%")
                    a(title="距今35天")
                  .date-point(title="2025.07.23：XXX随便什么名字的开发者大会", style="--pos: 68%")
                    a(title="距今152天")
        main#content-wrapper
          #card-wrapper
            #card-content(dev)
              InvitationCard
    #history-active(name="history")
      #history-active-wrapper
        #history-wrapper
          header#title 历史活动
          main#content-wrapper
            #card-wrapper
              #card-content(dev)
                InvitationCard()
  footer#footer-wrapper(name="about")
    #footer-context
      ul#platforms
        li#qq
        li#mail
          a(href="mailto:chengkelfan@qq.com")
        li#wx
        // GH的PC中屏幕以上不显示
        li#gh
          a(href="https://github.com/ShanXi-KUG")
      #copyright ©2025 山西 KUG Powered by VueJs & LeoCheng
  #back-to-top(v-show="showBackTop")
    a(href="#home-page")
      span ^
</template>

<style lang="less" scoped>

  #back-to-top {
    display: block;
    position: fixed;
    width: max(3%, 3em);
    aspect-ratio: 1 / 1;
    &[dev] {background-color: #964be5;}
    background-color: var(--default-light-white);
    text-align: center;
    place-content: center;
    place-items: center;
    right: 3%;
    bottom: 9%;
    font-weight: 700;
    overflow: hidden;
    transform-origin: center;

    span {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      line-height: 200%;
      font-size: 1.75em;
      overflow: hidden;
      background-image: var(--default-kug-gradient);
      background-clip: text;
      color: transparent;
    }

    .use-mini-border-radius();
    .default-shadow-mini-outset();
  }

  main#body {
    width: 100%;
    height: 100%; //max(100%, calc-size(auto));
    &[dev] {background-color: #15ED41;}
    background-color: var(--default-white);

    .disable-list-style();

    .disable-browser-scrollbar();

    overflow-x: hidden;     // 消除因为浏览器出现滚动条而挤出来的横向滚动条

    @header-height: 3.88em;

    header#header {
      position: fixed;
      width: 100%;
      height: @header-height;
      background-color: var(--default-light-white);
      padding: .1em 6.66em 0;
      display: flex;
      place-content: center space-between;
      z-index: 233;

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
              // 嵌入的链接
              display: inline-block;
              position: absolute;
              width: 100%;
              height: 100%;
            }

            &#new, &#kotlin-docs {
              font-weight: 800;
              font-size: 1.15em;
              color: transparent;
              background: linear-gradient(120.98deg, rgba(132, 78, 254, 1) 0%, rgba(233, 61, 117, 1) 100%);
              background-clip: text;
            }

            &#style {
              width: 2.6em;
              height: 1.4em;
              border-radius: .75em;
              &[dev] {background-color: #15ED41;}
              background-color: var(--default-white);
              place-content: center;

              .use-default-mini-border();

              #switch {
                height: 95%;
                aspect-ratio: 1 / 1;
                border-radius: 100%;
                background-color: var(--default-light-white);

                #btn {
                  width: 100%;
                  aspect-ratio: 1 / 1;
                  background: url("/icons/daylight.svg") no-repeat center / contain;
                  color: var(--default-black);
                }
              }
            }

            &#github {
              background: url("/icons/platforms/gh.svg") no-repeat center / contain;
              height: @sub-height * .95;
              aspect-ratio: 1 / 1;
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
    }

    article#main {
      width: min(max(72%, 768px), 100%);
      display: block;
      margin: 0 auto;
      height: 100%;
      &[dev] {background-color: #15ED41;height: 100%}
      background-color: var(--default-light-white);
      scroll-snap-type: y mandatory;
      overflow-y: scroll;

      .disable-browser-scrollbar();

      #home-page, #new-active, #history-active {
        width: max(100%, 768px);
        height: max(100vh, calc(768px / 4 * 3));
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
              // 还是父元素采用padding保险...
              //position: relative;
              //bottom: -12.5%;
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
                  background-image: var(--default-kug-gradient);
                  color: transparent;
                  background-clip: text;

                  .use-default-transition();
                }
                color: #964be5;
              }

              a#github-org {
                background-image: var(--default-kug-gradient);
                opacity: .88;
                &:hover {
                  opacity: 1;
                  &::before {
                    width: 100%;

                    .use-default-transition();
                  }
                }
                background-clip: text;
                color: transparent;
                display: inline-block;
                width: max-content;
                position: relative;

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
        }
      }

      @sub-content-width: 90.25%;

      #new-active {
        position: relative;
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
            &[dev] {background-color: orange;}
            place-content: center;
            place-items: center;
            padding-top: 5.66%;

            #axis-wrapper {
              width: @sub-content-width;
              margin: 0 auto;
              height: 86.6%;
              background-color: var(--default-white);
              position: relative;
              padding: 2.33em;

              .use-mini-border-radius();

              #axis-content {
                width: 100%;
                height: 100%;
                &[dev] {background-color: #15ED41;}
                place-content: center;
                position: relative;

                #axis {
                  width: 100%;
                  height: max(43.33%, 1.38em);
                  position: relative;
                  &[dev] {background-color: #0AFAB6;}
                  background-image: var(--default-kug-gradient);

                  .use-mini-border-radius();

                  border-radius: .33em;   // 这个比上面的入眼一点...

                  #axis-date {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    &[dev] {background-color: #0AFAB6;}

                    .date-point {
                      position: absolute;
                      @height: 90%;
                      height: @height;
                      top: calc((100% - @height) / 2);
                      aspect-ratio: 1 / 1;
                      background-image: var(--default-star);
                      opacity: 1;
                      left: var(--pos);

                      a {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                      }

                      &:hover::after {scale: 105%}

                      &::before {
                        content: "";
                        position: absolute;
                        @width: min(15%, .2em);
                        width: @width;
                        height: 66%;
                        border-radius: .5em;
                        background-image: var(--default-kug-gradient);
                        left: calc(50% - (@width / 2));
                      }

                      &::after {
                        content: attr(title) "";
                        position: absolute;
                        width: max-content;
                        font-size: 1.15em;
                        font-weight: 600;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        display: inline-block;
                        background-image: var(--default-kug-gradient);
                        background-clip: text;
                        color: transparent;
                        transform: translateX(-35%);
                        transform-origin: center;

                        .use-default-transition();
                      }

                      @bias-v-ax: 97.5%;
                      @bias-v-tx: 155%;

                      &:nth-child(2n) {
                        &::before {
                          top: @bias-v-ax;
                        }

                        &::after {
                          top: @bias-v-tx;
                        }
                      }

                      &:nth-child(2n + 1) {
                        &::before {
                          bottom: @bias-v-ax;
                        }

                        &::after {
                          bottom: @bias-v-tx;
                        }
                      }
                    }
                  }
                }
              }
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

            #card-wrapper {
              width: @sub-content-width;
              margin: 0 auto;
              height: 96.6%;
              background-color: var(--default-white);
              position: relative;
              padding: 2.33em;

              .use-mini-border-radius();

              #card-content {
                width: 100%;
                height: 100%;
                &[dev] {background-color: #964be5}
                position: relative;

                .default-shadow-mini-outset();
                .use-mini-border-radius();
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
              &[dev] {background-color: #15ED41;}
              place-content: center;
              place-items: center;
              padding-bottom: 4.38%;

              #card-wrapper {
                margin: 0 auto;
                height: 100%;
                background-color: var(--default-white);
                position: relative;
                padding: .33em 2.33em;

                .use-mini-border-radius();

                #card-content {
                  width: 100%;
                  height: 100%;
                  &[dev] {background-color: #964be5}
                  position: relative;

                  .default-shadow-mini-outset();
                  .use-mini-border-radius();
                }
              }
            }
          }
        }
      }
    }

    footer#footer-wrapper {
      display: block;
      height: 8em;
      width: 100%;
      background: var(--default-kug-gradient);
      position: relative;

      #footer-context {
        width: 100%;
        height: 100%;
        display: flex;
        place-items: center;
        place-content: center;
        &[dev] {background-color: gold;}

        #platforms {
          width: 15em;
          height: 3em;
          [dev] {background-color: #0AFAB6;}
          display: flex;
          place-items: center;
          place-content: space-around;
          flex: .01 1 auto;

          &::before {
            content: "联系我们：";
            display: inline-block;
            position: absolute;
            left: calc(35% - 12vw);
            font-size: 1.25em;
            font-weight: bold;
            color: var(--default-white);
          }

          li {
            width: 2.5em;
            aspect-ratio: 1 / 1;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            position: relative;
            color: var(--default-white);
            opacity: 1;

            .use-default-transition();

            &:hover {
              opacity: .9;
            }

            @qr-code-size: 7em;

            &#qq {
              background-image: url("/icons/platforms/qq.svg");

              &:hover {
                &::before {
                  content: "";
                  display: block;
                  width: @qr-code-size;
                  aspect-ratio: 1 / 1;
                  position: absolute;
                  background-color: var(--default-light-white);
                  top: -50%;
                  left: 50%;
                  transform: translate(-50%, calc(-50% - @qr-code-size / 2));
                  z-index: 2;
                  border: 5px ridge white;
                  background-image: url("/icons/qr-codes/my_qq_3222087513.jpg");
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: center;

                  .default-shadow-mini-outset();
                }

                &::after {
                  content: "";
                  display: block;
                  width: @qr-code-size;
                  aspect-ratio: 1 / 1;
                  position: absolute;
                  background-color: var(--default-light-white);
                  top: -50%;
                  left: 50%;
                  transform: translate(-50%, calc(-35% - @qr-code-size / 2));
                  z-index: 1;
                  clip-path: polygon(0 75%, 50% 100%, 100% 75%);
                }
              }
            }

            &#wx {
              background-image: url("/icons/platforms/wx.svg");

              &:hover {
                &::before {
                  content: "";
                  display: block;
                  width: @qr-code-size;
                  aspect-ratio: 1 / 1;
                  position: absolute;
                  background-color: var(--default-light-white);
                  background-image: url("/icons/qr-codes/my_wx_heke1228.jpg");
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: center;
                  top: -50%;
                  left: 50%;
                  transform: translate(-50%, calc(-50% - @qr-code-size / 2));
                  z-index: 2;
                  border: 5px ridge white;

                  .default-shadow-mini-outset();
                }

                &::after {
                  content: "";
                  display: block;
                  width: @qr-code-size;
                  aspect-ratio: 1 / 1;
                  position: absolute;
                  background-color: var(--default-light-white);
                  top: -50%;
                  left: 50%;
                  transform: translate(-50%, calc(-35% - @qr-code-size / 2));
                  z-index: 1;
                  clip-path: polygon(0 75%, 50% 100%, 100% 75%);
                }
              }
            }

            &#mail {
              background-image: url("/icons/platforms/mail.svg");

              a {
                // 特地给mailto的
                display: block;
                width: 100%;
                height: 100%;
              }

              &:hover {
                &::before {
                  content: "chengkelfan@qq.com";
                  display: block;
                  width: max-content;
                  position: absolute;
                  background-image: var(--default-kug-gradient);
                  top: -40%;
                  left: 50%;
                  padding: .25em;
                  transform: translate(-50%, calc(-50% - 2.5em / 2));
                  z-index: 2;
                  border: 5px ridge white;

                  .default-shadow-mini-outset();
                }

                &::after {
                  content: "";
                  display: block;
                  width: @qr-code-size;
                  aspect-ratio: 1 / 1;
                  position: absolute;
                  background-color: var(--default-light-white);
                  top: -50%;
                  left: 50%;
                  transform: translate(-50%, calc(-35% - @qr-code-size / 2));
                  z-index: 1;
                  clip-path: polygon(0 75%, 50% 100%, 100% 75%);
                }
              }
            }

            &#gh {
              background-image: url("/icons/platforms/gh.svg");

              // 这个和mail一样，但是更像零时凑数的...
              a {
                // 特地给mailto的
                display: block;
                width: 100%;
                height: 100%;
              }

              &:hover {
                &::before {
                  content: "ShanXi-KUG";
                  display: block;
                  width: max-content;
                  position: absolute;
                  background-image: var(--default-kug-gradient);
                  top: -40%;
                  left: 50%;
                  padding: .25em;
                  transform: translate(-50%, calc(-50% - 2.5em / 2));
                  z-index: 2;
                  border: 5px ridge white;

                  .default-shadow-mini-outset();
                }

                &::after {
                  content: "";
                  display: block;
                  width: @qr-code-size;
                  aspect-ratio: 1 / 1;
                  position: absolute;
                  background-color: var(--default-light-white);
                  top: -50%;
                  left: 50%;
                  transform: translate(-50%, calc(-35% - @qr-code-size / 2));
                  z-index: 1;
                  clip-path: polygon(0 75%, 50% 100%, 100% 75%);
                }
              }
            }
          }

          li#gh {
            // 这个在媒体查询的代码完善的时候再那啥
            display: none;
          }
        }

        #copyright {
          position: absolute;
          bottom: 0;
          font-size: .66em;
          color: var(--default-dark-white);
        }
      }
    }
  }
</style>