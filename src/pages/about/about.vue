<template>
	<view class="about__content">
		<HeaderComponent title="关于我们" @goBack="goBack"></HeaderComponent>
		<view class="about__header">
			<image src="@/static/logo/logo.png" class="img"></image>
			<view class="app__name">海狸IM</view>
		</view>
	</view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from "@/component/header/header.vue";

export default defineComponent({
	components: {
		HeaderComponent
	},
	setup() {
		const goBack = () => {
			uni.navigateBack();
		};
		return {
			goBack
		};
	}
});
</script>

<style lang="scss" scoped>
.about__content {
	.about__header {
		padding: 100rpx 0 50rpx;
		display: flex;
    flex-direction: column;
    align-items: center;
		.img {
			width: 140px;
			height: 140px;
		}
		.app__name {
			font-size: 46rpx;
			color: #000;
			margin-top: 20rpx;
		}
	}
}
</style>
