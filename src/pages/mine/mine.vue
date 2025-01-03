<template>
	<view class="mine__content">
		<view class="mine__background"></view>
		<!-- 个人信息部分 -->
		<view class="info-section" @click="goPush('/pages/mineInfo/mineInfo')">
			<view class="avatar-section">
				<image class="avatar" mode="aspectFill" :src="userInfo.avatar"></image>
			</view>
			<view class="info-middle-section">
				<text class="nickname">{{ userInfo.nickName }}</text>
				<text class="phone">{{ userInfo.phone }}</text>
			</view>
			<view class="info-right-section">
				<image class="details-arrow left" mode="aspectFill" src="@/static/img/mine/qrcode.svg"></image>
				<image src="@/static/img/mine/jump_right.svg" class="details-arrow"  />

			</view>
		</view>
		<!-- 菜单部分 -->
		<view class="menu-section">
			<view v-for="(item, index) in list" :key="index" class="menu-item" @click="handleClick(item)">
				<view class="icon-section">
					<image :src="item.icon" class="icom_image" />
				</view>
				<view class="title-section">
					<text>{{ item.title }}</text>
				</view>
				<view class="arrow-section">
					<image src="@/static/img/mine/jump_right.svg" class="arrow" />

				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useUserStore } from '@/pinia/user/user';
import { list } from './data';

export default defineComponent({
	setup() {
		const store = useUserStore();

		const userInfo = computed(() => store.gUserInfo);
		const handleClick = (item) => {
			goPush(item.path);
		};
		const goPush = (url) => {
			uni.navigateTo({
				url: url
			});
		};
		return {
			goPush,
			userInfo: userInfo,
			list,
			handleClick
		};
	},
});
</script>

<style lang="scss" scoped>
page {
	background: #f5f5f5;
}

.mine__content {
	.mine__background {
		background: url('@/static/img/mine/background.jpg') no-repeat;
		background-size: 100%;
		height: 300rpx;
	}
	.info-section {
		display: flex;
		flex-direction: row;
		margin-top: -50rpx;
		border-top-left-radius: 25rpx;
		border-top-right-radius: 25rpx;
		background-color: #fff;
		padding: 54rpx 40rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

		.avatar-section {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;

			.avatar {
				width: 106rpx;
				height: 106rpx;
				border-radius: 60rpx;
				background-color: #eee;
			}
		}

		.info-middle-section {
			flex: 3;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 20rpx;

			.nickname {
				font-size: 37rpx;
				font-weight: bold;
				color: #333;
			}

			.phone {
				font-size: 26rpx;
				color: #999;
				margin-top: 10rpx;
				line-height: 40rpx;
				height: 40rpx;
			}
		}

		.info-right-section {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.qr-code {
				width: 60rpx;
				height: 60rpx;
				margin-right: 20rpx;
			}

			.details-arrow {
				width: 30rpx;
				height: 30rpx;
				// background: url('@/static/arrow_right.png') no-repeat;
				background-size: contain;
				&.left {
					margin-right: 15rpx;
				}
			}
		}
	}

	.menu-section {
		margin-top: 20rpx;

		.menu-item {
			display: flex;
			align-items: center;
			padding: 20rpx 30rpx;
			border-bottom: 1rpx solid #f2f2f2;
			background: #fff;
			.icon-section {
				display: flex;
				align-items: center;
				.icom_image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.title-section {
				flex: 3;
				margin: 0 20rpx;
			}

			.arrow-section {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.arrow {
					width: 30rpx;
					height: 30rpx;
					// background: url('@/static/arrow_right.png') no-repeat;
					background-size: contain;
				}
			}
		}
	}
}
</style>