<template lang="pug">
footer#footer-wrapper(name="about")
  #footer-context
    ul#platforms
      li#qq
      li#mail
        a(href="mailto:chengkelfan@qq.com")
      li#wx
    #copyright ©2026 山西 KUG Powered by VueJs & LeoCheng
</template>

<style lang="less" scoped>
// 组件化后作用域变了，App 那层的列表重置匹配不到这里
.disable-list-style();

@qr: 7em;

.bubble() {
  content: "";
  display: block;
  position: absolute;
  top: -50%;
  left: 50%;
  z-index: 2;
  border: 5px ridge white;

  .default-shadow-mini-outset();
}

.bubble-tail() {
  &::after {
    content: "";
    display: block;
    width: @qr;
    aspect-ratio: 1 / 1;
    position: absolute;
    background-color: var(--default-light-white);
    top: -50%;
    left: 50%;
    transform: translate(-50%, calc(-35% - @qr / 2));
    z-index: 1;
    clip-path: polygon(0 75%, 50% 100%, 100% 75%);
  }
}

.qr-bubble(@img) {
  &:hover {
    &::before {
      .bubble();
      width: @qr;
      aspect-ratio: 1 / 1;
      transform: translate(-50%, calc(-50% - @qr / 2));
      background: var(--default-light-white) url("@{img}") center / cover no-repeat;
    }

    .bubble-tail();
  }
}

footer#footer-wrapper {
  display: block;
  height: 8em;
  width: 100%;
  background: var(--default-kug-gradient);
  position: relative;

  @media (width < 768px) {
    display: none;
  }

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
      &[dev] {background-color: #0AFAB6;}
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
        color: var(--default-on-gradient);
      }

      // 各 svg 墨迹占 viewBox 的比例不同，统一 cover 会让 qq 显小
      li {
        width: 2.5em;
        aspect-ratio: 1 / 1;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
        color: var(--default-on-gradient);
        opacity: 1;

        .use-default-transition();

        &:hover {
          opacity: .9;
        }

        &#qq {
          background-image: url("/icons/platforms/qq.svg");
          background-size: 103%;

          .qr-bubble("/icons/qr-codes/my_qq_3222087513.jpg");
        }

        &#wx {
          background-image: url("/icons/platforms/wx.svg");
          background-size: 96%;

          .qr-bubble("/icons/qr-codes/my_wx_heke1228.jpg");
        }

        &#mail {
          background-image: url("/icons/platforms/mail.svg");
          background-size: 93%;

          a {
            display: block;
            width: 100%;
            height: 100%;
          }

          &:hover {
            &::before {
              .bubble();
              content: "chengkelfan@qq.com";
              width: max-content;
              top: -40%;
              padding: .25em;
              transform: translate(-50%, calc(-50% - 1.25em));
              background-image: var(--default-kug-gradient);
            }

            .bubble-tail();
          }
        }
      }
    }

    #copyright {
      position: absolute;
      bottom: 0;
      font-size: .66em;
      color: var(--default-on-gradient-weak);
    }
  }
}
</style>
