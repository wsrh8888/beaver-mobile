<template>
	<view class="about">
		<!-- 背景元素 -->
		<view class="background">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="pattern"></view>
		</view>
		
		<!-- 装饰点 -->
		<view class="dot dot-1"></view>
		<view class="dot dot-2"></view>
		<view class="dot dot-3"></view>
		<view class="dot dot-4"></view>

		<!-- 导航栏 -->
		<view class="navbar">
			<view class="back-button" @click="goBack">
				<image src="@/static/img/common/arrow-left.svg" mode="aspectFit" class="back-icon"></image>
			</view>
			<view class="nav-title">关于我们</view>
		</view>

		<!-- 主要内容 -->
		<view class="content">
			<!-- 应用标志 -->
			<view class="logo-container floating">
				<image :src="APP_CONFIG.logo" mode="aspectFit"></image>
			</view>
			
			<text class="app-name">{{ APP_CONFIG.name }}</text>
			<view class="app-version">{{ currentVersion }}</view>
			
			<text class="about-text">
				{{ APP_CONFIG.name }}是一款致力于帮助用户<text class="highlight">拓展社交圈</text>，
				发现<text class="highlight">志同道合</text>朋友的即时通讯应用。
				我们相信真实的人际连接比以往任何时候都更加珍贵。
			</text>
			
			<view class="team-info">
				<text class="team-label">由</text>
				<text class="team-name">{{ APP_CONFIG.developer }}</text>
				<text class="copyright">© 2025 版权所有</text>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import { ref } from 'vue';
import { getCurrentVersion } from '@/utils/update/update';
import { APP_CONFIG } from '@/config/data';
import x from '@/env.json'
export default {
	setup() {
		const currentVersion = ref('1.0.0');
		
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 使用统一的版本获取方法
		currentVersion.value = getCurrentVersion();
		
		return {
			currentVersion,
			goBack,
			APP_CONFIG
		};
	}
};
</script>

<style lang="scss" scoped>
/* 色彩系统 */
$primary: #FF7D45;
$primary-deep: #E86835;
$primary-light: #FFE6D9;
$text-title: #2D3436;
$text-body: #636E72;
$text-auxiliary: #B2BEC3;

.about {
	background-color: #FFFFFF;
	color: $text-body;
	line-height: 1.5;
	font-size: 28rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	position: relative;
}

/* 背景图形 */
.background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	pointer-events: none;
}

.circle {
	position: absolute;
	border-radius: 50%;
	background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
}

.circle-1 {
	width: 600rpx;
	height: 600rpx;
	top: -320rpx;
	right: -200rpx;
	opacity: 0.1;
}

.circle-2 {
	width: 400rpx;
	height: 400rpx;
	bottom: -200rpx;
	left: -200rpx;
	opacity: 0.1;
}

.pattern {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: url('@/static/img/common/pattern.svg');
	background-repeat: repeat;
	opacity: 0.6;
}

/* 装饰性元素 */
.dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background-color: $primary-light;
	position: fixed;
	z-index: 1;
	pointer-events: none;
}

.dot-1 {
	top: 20%;
	left: 10%;
	opacity: 0.8;
}

.dot-2 {
	top: 30%;
	right: 15%;
	opacity: 0.5;
}

.dot-3 {
	bottom: 25%;
	left: 20%;
	opacity: 0.7;
}

.dot-4 {
	bottom: 15%;
	right: 10%;
	opacity: 0.6;
}

/* 导航栏 */
.navbar {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	height: 112rpx;
	padding: 0 32rpx;
	margin-top:10rpx;
	z-index: 2;
}

.back-button {
	position: absolute;
	left: 32rpx;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08);
	transition: all 0.2s ease;
}

.back-icon {
	width: 40rpx;
	height: 40rpx;
	display: block;
}

.back-button:active {
	transform: scale(0.95);
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.nav-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $text-title;
}

/* 内容区 */
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	flex: 1;
	padding: 0 48rpx;
	max-width: 750rpx;
	margin: 0 auto;
	position: relative;
	z-index: 2;
}

/* 应用标志 */
.logo-container {
	width: 200rpx;
	height: 200rpx;
	border-radius: 76rpx;
	background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	box-shadow: 0 24rpx 48rpx rgba(255,125,69,0.3);
	margin-bottom: 64rpx;
	margin-top: 20rpx;
	
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 45%;
		background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
	}
	
	image {
		position: relative;
	}
}

.app-name {
	font-size: 64rpx;
	font-weight: 800;
	color: $text-title;
	margin-bottom: 24rpx;
	position: relative;
	display: inline-block;
	
	&::after {
		content: "";
		position: absolute;
		bottom: 4rpx;
		left: -12rpx;
		right: -12rpx;
		height: 20rpx;
		background-color: $primary-light;
		z-index: -1;
		border-radius: 12rpx;
	}
}

.app-version {
	font-size: 32rpx;
	color: $primary;
	font-weight: 600;
	margin-bottom: 48rpx;
	background: $primary-light;
	padding: 12rpx 32rpx;
	border-radius: 40rpx;
}

.about-text {
	font-size: 34rpx;
	color: $text-body;
	line-height: 1.8;
	margin-bottom: 80rpx;
	max-width: 600rpx;
}

.highlight {
	color: $primary-deep;
	font-weight: 600;
}

/* 团队信息 */
.team-info {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.team-label {
	font-size: 28rpx;
	color: $text-auxiliary;
	margin-bottom: 16rpx;
}

.team-name {
	font-size: 36rpx;
	font-weight: 600;
	color: $text-title;
	margin-bottom: 8rpx;
}

/* 底部版权 */
.copyright {
	font-size: 24rpx;
	color: $text-auxiliary;
	margin-top: 48rpx;
	margin-bottom: 40rpx;
}

/* 动画效果 */
@keyframes float {
	0% {
		transform: translateY(0rpx);
	}
	50% {
		transform: translateY(-20rpx);
	}
	100% {
		transform: translateY(0rpx);
	}
}

.floating {
	animation: float 6s ease-in-out infinite;
}
</style>
