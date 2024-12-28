<script setup lang="ts">

</script>

<template lang="pug">
//- 我的编程习惯里面，wrapper一般就是使用相对定位+wh100%挤满布局的存在
    之后再在里面放其他盒子，这层外皮一般空着，使用下层来设置背景和阴影
    但是后面(2023.12.20)发现不用白不用，还是直接设置背景+阴影比较好...
#inv-card-wrapper
  main#card-inner-wrapper
    #header-info-wrapper
      header#card-title-wrapper
        #title Kotlin分享会
      section#card-desc-wrapper
        aside#card-desc(title="这里之后放详情，毕竟三行过满会放不下东西有...")
          //- 实际上设计稿这里计划写desc的，但是后面发现，desc写content的子文件里面更合适...
          p 线下渠道：
            a 山西省晋中市榆次区大学街太原理工大学明向校区行勉楼404教室
          p 线上渠道：
            a 哔哩哔哩直播间
            |、
            a 腾讯会议#233-233-233
    article#card-content-wrapper
      //- 这里之后使用子组件，读：MD、PDF、TXT、HTML、JSON等等，之后专门设置一个文件夹 - activity
      #content-area
    #card-footer-wrapper
      footer#card-date-wrapper
        #curr-date 2025.03.23
      nav#card-option-wrapper
        //- 多一层之后可以多点伪元素骚操作...
        span
          a(href="#") 点我报名!
</template>

<style lang="less" scoped>
#inv-card-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: var(--default-kug-gradient);
  padding: 1.68em 1.66em 1.65em;    // 弥补阴影和高光的视觉差
  flex: 1 1 auto;

	.use-mini-border-radius();
	.default-shadow-mini-outset();

  @media (width < 768px) {
    padding: .88em .86em .84em;
    .default-shadow-outset();
  }

	#card-inner-wrapper {
		width: 100%;
		height: 100%;
    background-color: var(--default-light-white);
    border-radius: .5em / .5em 0;   // 自己之前的跨度太大，2em直接蹦到.5em...还是手写吧...
    position: relative;
    padding: 1.1em 2.11em 1.08em;    // 弥补阴影和高光的视觉差
    display: grid;
    grid-template: "inv-header" 86fr "inv-center" 255fr "inv-footer" 41fr;

    @media (width < 768px) {
      padding: .60em 1.11em .58em;
      grid-template: "inv-header" 88fr "inv-center" 271fr "inv-footer" 33fr;
    }

    @media (width < 1440px) {
      padding-top: .5em;
    }

    #header-info-wrapper {
      grid-area: inv-header;
      width: 100%;
      height: 100%;
      &[dev] {background-color: red;}
      display: flex;
      place-items: flex-start center;
      place-content: center space-between;
      flex: 1 1 auto;

      #card-title-wrapper {
        width: 100%;
        height: 100%;

        #title {
          width: max-content;
          height: max-content;
          font-size: 1.88em;
          font-weight: 800;
          letter-spacing: -.02em;
          position: relative;

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
      }

      #card-desc-wrapper {
        width: max-content;
        height: max-content;
        position: relative;
        &[dev] {background-color: #964be5;}

        #card-desc {
          width: 100%;
          height: 3.34em;
          display: flex;
          flex-direction: column;
          place-items: start center;
          //place-content: center start;
          place-content: center space-evenly; // 还是这个对称 / 好看一点...
          flex: 1 1 auto;

          .use-ellipsis-text();

          p {
            width: 100%;
            height: 1.11em;
            line-height: 1.11em;
            font-size: 1em;
            font-weight: 300;
            color: var(--default-half-gray);

            a {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      @media (width < 1440px) {
        // 这里开始，title和desc冲突，需要将title居中
        display: flex;
        height: 100%;
        flex-direction: column;
        place-content: center;
        place-items: center;

        #card-title-wrapper {
          place-items: center;
          place-content: center;

          #title {
            text-align: center;
          }
        }

        #card-desc-wrapper  {
          width: 100%;
          height: auto;

          #card-desc {
            overflow: hidden;

            p {
              width: 100%;
              height: 100%;
              white-space: normal;

              a {
                display: inline;
              }
            }
          }
        }
      }

      @media (width < 768px) {
        place-content: center normal;
        gap: .66em;

        #card-title-wrapper {
          height: max-content;

          #title {
            font-size: 1.55em;
            letter-spacing: 0;
            font-weight: 600 ;
          }
        }

        #card-desc-wrapper {
          #card-desc {
            p {
              height: max-content;
              font-size: .88em;
            }
          }
        }
      }
    }

    #card-content-wrapper {
      grid-area: inv-center;
      background-color: var(--default-dark-white);
      position: relative;
      width: 100%;
      height: 100%;

      .default-shadow-mini-inset();

      #content-area {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }

    #card-footer-wrapper {
      grid-area: inv-footer;
      display: flex;
      place-items: end center;
      place-content: space-between;
      &[dev] {background-color: #4000FF}

      #card-date-wrapper {
        width: max-content;
        height: max-content;

        #curr-date {
          font-size: 1.125em;
          font-weight: 800;

          .use-default-gradient-text();
        }
      }

      #card-option-wrapper {
        width: max-content;
        height: max-content;

        span {
          width: max-content;
          height: max-content;
          &[dev] {background-color: red;}
          display: flex;
          text-align: center;
          padding: .15em 1.11em;
          border-radius: .275em;
          background-image: var(--default-kug-gradient);

          a {
            place-content: center;
            font-size: 0.88em;
            font-weight: 600;
            color: var(--default-light-white);
          }
        }
      }
    }
  }
}
</style>
