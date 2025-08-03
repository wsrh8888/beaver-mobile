<template>
	<view class="info-card" v-if="photos && photos.length">
		<view class="card-header">
			<view class="card-title">相册动态</view>
		</view>
		<view class="photo-grid">
			<view class="photo-item" v-for="(photo, index) in displayPhotos" :key="index">
				<image :src="photo" mode="aspectFill" />
			</view>
			<view v-if="photos.length > 3" class="photo-item more-photos" @click="$emit('view-all')">
				查看更多
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import { computed } from 'vue';

export default {
	name: 'PhotoCard',
	props: {
		photos: {
			type: Array as () => string[],
			default: () => []
		}
	},
	emits: ['view-all'],
	setup(props) {
		const displayPhotos = computed(() => {
			return props.photos.slice(0, 3);
		});

		return {
			displayPhotos
		};
	}
};
</script>

<style lang="scss" scoped>
/* 资料卡片样式 */
.info-card {
	background-color: white;
	border-radius: 24rpx;
	padding: 40rpx 32rpx;
	box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.08);
	margin-bottom: 0;
}

.card-header {
	margin-bottom: 32rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #2D3436;
}

/* 相册预览卡片 */
.photo-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
	padding: 8rpx 0;
}

.photo-item {
	aspect-ratio: 1/1;
	border-radius: 20rpx;
	overflow: hidden;
	background-color: #F0F3F4;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);

	image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.more-photos {
	background: linear-gradient(135deg, rgba(255, 125, 69, 0.9) 0%, rgba(232, 104, 53, 0.9) 100%);
	color: white;
	font-weight: 600;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 26rpx;
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
		pointer-events: none;
	}
}
</style> 