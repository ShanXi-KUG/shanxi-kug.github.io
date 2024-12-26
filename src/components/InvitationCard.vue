<script setup lang="ts">

</script>

<template lang="pug">
/* 我的编程习惯里面，wrapper一般就是使用相对定位+wh100%挤满布局的存在 */
/* 之后再在里面放其他盒子，这层外皮一般空着，使用下层来设置背景和阴影 */
/* 但是后面(2023.12.20)发现不用白不用，还是直接设置背景+阴影比较好... */
#card-wrapper
  main#card-inner-wrapper
    aside#card-title-wrapper
	section#card-desc-wrapper
	  header#card-desc(title="这里之后放详情，毕竟三行过满会放不下东西有...")
	    // 实际上设计稿这里计划写desc的，但是后面发现，desc写content的子文件里面更合适...
	    p 线下渠道：
		  a 山西省晋中市榆次区大学街太原理工大学明向校区行勉楼404教室
		p 线上渠道：
		  a 哔哩哔哩
		  |、
		  a 腾讯会议
	article#card-content-wrapper
	  // 这里之后使用子组件，读：MD、PDF、TXT、HTML等等，之后专门设置一个文件夹activities
	footer#card-date-wrapper
	  #curr-date 2025.03.23
	nav#card-option-wrapper
	  /* 多一层之后可以多点伪元素骚操作... */
	  span
	    a 点我报名！
</template>

<style scoped lang="less">
#card-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: var(--default-kug-gradient);

	.use-mini-border-radius();
	.default-shadow-mini-outset();

	#card-inner-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
	}
}
</style>
