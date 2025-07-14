<template>
	<view class="container">
		<BeaverLayout 
			title="项目声明" 
			:show-back="true" 
			:scrollable="true" 
			:scroll-y="true" 
			:show-scrollbar="false"
			@back="goBack"
		>
			<view class="content">
				<!-- 声明卡片 -->
				<view class="disclaimer-card">
					<view class="disclaimer-icon">
						<image src="@/static/img/disclaimer/info.svg" mode="aspectFit" class="icon-img"></image>
					</view>
					<view class="disclaimer-title">项目声明</view>
					<view class="disclaimer-text">
						本项目仅用于技术学习、测试和演示目的，不涉及对外营业。欢迎学习交流。
					</view>
				</view>

				<!-- 项目链接 -->
				<view class="links-card">
					<view class="card-title">项目链接</view>
					
					<!-- 移动端 -->
					<view class="link-item" @click="openLink('https://github.com/wsrh8888/beaver-mobile')">
						<view class="link-icon">
							<image src="@/static/img/disclaimer/mobile.svg" mode="aspectFit" class="icon-img"></image>
						</view>
						<view class="link-info">
							<view class="link-name">移动端</view>
							<view class="link-desc">uni-app 跨平台应用</view>
						</view>
						<view class="link-arrow">
							<image src="@/static/img/disclaimer/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>

					<!-- 服务端 -->
					<view class="link-item" @click="openLink('https://github.com/wsrh8888/beaver-server')">
						<view class="link-icon">
							<image src="@/static/img/disclaimer/server.svg" mode="aspectFit" class="icon-img"></image>
						</view>
						<view class="link-info">
							<view class="link-name">服务端</view>
							<view class="link-desc">Go-Zero 微服务架构</view>
						</view>
						<view class="link-arrow">
							<image src="@/static/img/disclaimer/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>

					<!-- PC端 -->
					<view class="link-item" @click="openLink('https://github.com/wsrh8888/beaver-desktop')">
						<view class="link-icon">
							<image src="@/static/img/disclaimer/desktop.svg" mode="aspectFit" class="icon-img"></image>
						</view>
						<view class="link-info">
							<view class="link-name">PC端</view>
							<view class="link-desc">Electron + Vue3 桌面应用</view>
						</view>
						<view class="link-arrow">
							<image src="@/static/img/disclaimer/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>

					<!-- 文档 -->
					<view class="link-item" @click="openLink('https://wsrh8888.github.io/beaver-docs/')">
						<view class="link-icon">
							<image src="@/static/img/disclaimer/doc.svg" mode="aspectFit" class="icon-img"></image>
						</view>
						<view class="link-info">
							<view class="link-name">项目文档</view>
							<view class="link-desc">开发文档和使用指南</view>
						</view>
						<view class="link-arrow">
							<image src="@/static/img/disclaimer/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>

					<!-- 视频教程 -->
					<view class="link-item" @click="openLink('https://www.bilibili.com/video/BV1HrrKYeEB4/')">
						<view class="link-icon">
							<image src="@/static/img/disclaimer/video.svg" mode="aspectFit" class="icon-img"></image>
						</view>
						<view class="link-info">
							<view class="link-name">视频教程</view>
							<view class="link-desc">B站手把手搭建教程</view>
						</view>
						<view class="link-arrow">
							<image src="@/static/img/disclaimer/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>

					<!-- QQ群 -->
					<view class="link-item" @click="copyQQGroup">
						<view class="link-icon">
							<image src="@/static/img/disclaimer/github.svg" mode="aspectFit" class="icon-img"></image>
						</view>
						<view class="link-info">
							<view class="link-name">QQ交流群</view>
							<view class="link-desc">1013328597</view>
						</view>
						<view class="link-arrow">
							<image src="@/static/img/disclaimer/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
						</view>
					</view>
				</view>

				<!-- 作者信息 -->
				<view class="author-card">
					<view class="author-info">
						<view class="author-avatar">
							<text class="author-initial">W</text>
						</view>
						<view class="author-details">
							<view class="author-name">wsrh8888</view>
							<view class="author-desc">全栈开发者</view>
						</view>
					</view>
					<view class="github-link" @click="openLink('https://github.com/wsrh8888')">
						<image src="@/static/img/disclaimer/github.svg" mode="aspectFit" class="github-icon"></image>
						<text class="github-text">GitHub主页</text>
					</view>
				</view>
			</view>
		</BeaverLayout>
	</view>
</template>

<script lang="ts">
import BeaverLayout from '@/component/layout/layout.vue';

export default {
	components: {
		BeaverLayout
	},
	setup() {
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};

		// 打开链接
		const openLink = (url: string) => {
			// #ifdef H5
			window.open(url, '_blank');
			// #endif
			
			// #ifdef APP-PLUS
			plus.runtime.openURL(url);
			// #endif
			
			// #ifdef MP
			uni.setClipboardData({
				data: url,
				success: () => {
					uni.showToast({
						title: '链接已复制到剪贴板',
						icon: 'success'
					});
				}
			});
			// #endif
		};

		// 复制QQ群号
		const copyQQGroup = () => {
			uni.setClipboardData({
				data: '1013328597',
				success: () => {
					uni.showToast({
						title: 'QQ群号已复制',
						icon: 'success'
					});
				}
			});
		};

		return {
			goBack,
			openLink,
			copyQQGroup
		};
	}
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #F9FAFB;
}

.content {
	padding: 24rpx;
}

/* 声明卡片 */
.disclaimer-card {
	background: white;
	border-radius: 24rpx;
	padding: 48rpx 32rpx;
	margin-bottom: 24rpx;
	text-align: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.disclaimer-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	background: rgba(255, 125, 69, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 24rpx;
}

.icon-img {
	width: 48rpx;
	height: 48rpx;
	filter: invert(55%) sepia(88%) saturate(2082%) hue-rotate(337deg) brightness(99%) contrast(98%);
}

.disclaimer-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2D3436;
	margin-bottom: 16rpx;
}

.disclaimer-text {
	font-size: 28rpx;
	color: #636E72;
	line-height: 1.6;
}

/* 卡片通用样式 */
.links-card,
.author-card {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #2D3436;
	margin-bottom: 24rpx;
}

/* 链接项目样式 */
.link-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F0F2F5;
	transition: all 0.2s ease;
}

.link-item:last-child {
	border-bottom: none;
}

.link-item:active {
	background: rgba(255, 125, 69, 0.02);
	transform: translateX(8rpx);
}

.link-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 16rpx;
	background: rgba(255, 125, 69, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
}

.link-info {
	flex: 1;
	margin-right: 16rpx;
}

.link-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #2D3436;
	margin-bottom: 8rpx;
}

.link-desc {
	font-size: 24rpx;
	color: #636E72;
	margin-bottom: 8rpx;
}

.link-arrow {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.arrow-icon {
	width: 24rpx;
	height: 24rpx;
	filter: invert(79%) sepia(9%) saturate(298%) hue-rotate(159deg) brightness(93%) contrast(84%);
}

/* 作者信息 */
.author-info {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.author-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
}

.author-initial {
	font-size: 32rpx;
	font-weight: 600;
	color: white;
}

.author-details {
	flex: 1;
}

.author-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #2D3436;
	margin-bottom: 8rpx;
}

.author-desc {
	font-size: 24rpx;
	color: #636E72;
}

.github-link {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24rpx;
	background: rgba(255, 125, 69, 0.1);
	border-radius: 16rpx;
	transition: all 0.2s ease;
}

.github-link:active {
	background: rgba(255, 125, 69, 0.15);
	transform: scale(0.98);
}

.github-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 16rpx;
	filter: invert(55%) sepia(88%) saturate(2082%) hue-rotate(337deg) brightness(99%) contrast(98%);
}

.github-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #FF7D45;
}
</style> 