<template>
	<view :class="['info', position]">
		<image v-if="position === 'left'" :lazy-load="true" class="img" :src="avatar" @click="handleGoDetail">
		</image>
		<view class="contents">
			<!-- 文本 -->
			<view class="content" v-if="message.type == 1">
				<text>{{ message.textMsg.content }} </text>
			</view>
			<!-- 图片 -->
			<view class="contentImg" v-if="message.type == 2">
				<image @click="preview(message.imageMsg.src)" @load="onImageLoad" :style="{ width: imageWidth + 'rpx', height: imageHeight + 'rpx' }" :lazy-load="true" class="imgMsg"
					:src="message.imageMsg.src" mode="">
				</image>
			</view>
		</view>
		<image v-if="position === 'right'" :lazy-load="true" class="img" :src="avatar" @click="handleGoDetail">
		</image>
	</view>
</template>

<script lang="ts">
	import { defineComponent, ref, toRefs, computed, onMounted } from 'vue';
	export default defineComponent({
		props: {
			avatar: {
				type: String,
				default: ''
			},
			position: {
				type: String,
				default: 'left'
			},
			message: {
				type: Object,
				default: () => ({})
			},
			userId: {
				type: String,
				default: ''
			}
		},
		emits: ['scroll-bottom'],
		setup(props, { emit }) {
			const { message } = toRefs(props);
			const imageWidth = ref(0);
			const imageHeight = ref(0);
			const handleGoDetail = () => {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${props.userId}`
				})
			}

			const preview = (img) => {
				uni.previewImage({
					current: 0,
					urls: [img]
				})
			}
			const onImageLoad = (event) => {
				console.error
				// 获取图片的原始宽高
				const originalWidth = event.detail.width;
				const originalHeight = event.detail.height;
				// 获取设备信息
				const systemInfo = uni.getSystemInfoSync();
				const screenWidth = systemInfo.screenWidth; // 屏幕宽度
				// 计算图片的宽度为屏幕宽度的 70%，确保宽度不会超过屏幕的 70%
				const maxWidth = screenWidth * 0.6;  // 设置最大宽度为屏幕宽度的 70%
				const newWidth = originalWidth > maxWidth ? maxWidth : originalWidth;  // 如果图片原宽度大于最大宽度，使用最大宽度
				const ratio = newWidth / originalWidth;  // 使用新的宽度计算高度的比例
				const newHeight = originalHeight * ratio;  // 通过比例调整图片高度
				imageWidth.value = newWidth*2;  // 设置图片宽度为屏幕宽度
				imageHeight.value = newHeight*2;  // 通过比例调整图片高度
				emit('scroll-bottom');
			}

			return {
				message,
				preview,
				handleGoDetail,
				onImageLoad,
				imageWidth,
				imageHeight
			};
		}
	});
</script>

<style lang="scss" scoped>
	:deep(.uni-scroll-view-refresh-inner) {
		background-color: transparent;
		box-shadow: none;
	}

	.box {
		height: 100vh;
		box-sizing: border-box;
		padding: 15rpx 0;
		background-color: #f5f5f5;
		font-family: STKaiti;

		.container {
			padding: 8rpx 30rpx 0;

			.iconfont {
				font-size: 50rpx;
			}
		}

		.divide {
			margin: 10rpx 0 0;
			height: 1rpx;
			// height: 100px;
			background-color: #e6e6e6;
		}

		.infoList {
			padding: 10rpx 30rpx;
		}

		.scroll {
			box-sizing: border-box;

			.messageList {
				display: flex;
				flex-direction: column;
				color: #000;
				margin-bottom: 25rpx;

				.time {
					margin: 10rpx 0;

					.time_text {
						text-align: center;
						margin: 10rpx 0;
						font-size: 25rpx;
						color: #5e5e5e;
					}
				}

				.info {
					flex: 1;
					display: flex;

					.contents {
						display: flex;
						flex-direction: column;
						max-width: 75%;

						.contentInfo {
							display: flex;
							flex-direction: column;
						}

						.nickname {
							text-align: left;
							color: #515151;
							padding-left: 25rpx;
							font-size: 26rpx;
						}
					}

					.img {
						height: 80rpx;
						width: 80rpx;
						border-radius: 10rpx;
						overflow: hidden;
					}

					.content {
						position: relative;
						box-sizing: border-box;
						min-height: 80rpx;
						border-radius: 10rpx;
						margin-left: 20rpx;
						font-size: 30rpx;
						background-color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;

						&::before {
							display: block;
							content: "";
							position: absolute;
							left: -23rpx;
							top: 28rpx;
							width: 0;
							height: 0;
							border: 6px solid transparent;
							border-right: 12rpx solid #fff;
						}

						text {
							// padding: 10rpx 20rpx;
							padding: 10rpx 15rpx;
						}

						image {
							width: 35rpx;
							height: 30rpx;
							margin-right: 0rpx;
							margin-left: 15rpx;
						}
					}

					.contentImg {
						flex: 1;
						margin-left: 20rpx;
						min-height: 80rpx;
						max-width: 70%;
						min-width: 30%;

						// .imgMsg {
						// 	max-height: 220rpx;
						// 	max-width: 450rpx;
						// }
					}

					.mapBox {
						overflow: hidden;
						position: relative;
						margin-left: 20rpx;
						width: 470rpx;
						height: 300rpx;
						background: url("../../static/images/map.png") no-repeat;
						background-size: 100%;

						.address {
							background-color: #fff;
							padding: 15rpx;
							font-size: 24rpx;
							color: #6c6c6c;
						}
					}
				}

				.right {
					display: flex;
					justify-content: flex-end;

					.contents {
						display: flex;
						flex-direction: column;
						max-width: 80%;

						.mapBox {
							margin-left: 0;
							margin-right: 20rpx;
						}

						.nickname {
							text-align: right;
							color: #515151;
							padding-right: 25rpx;
							font-size: 26rpx;
						}
					}

					.contentImg {
						flex: 1;
						margin-right: 20rpx;
					}


					.content {
						flex: 1;
						position: relative;
						margin-left: 0;
						margin-right: 20rpx;
						background-color: #95ec69;

						image {
							transform: rotateY(180deg);
							margin-right: 15rpx;
							margin-left: 0rpx;
						}

						&::before {
							left: 100%;
							border: 7px solid transparent;
							border-left: 14rpx solid #95ec69;
						}
					}
				}
			}

			// .menuList:last-child {
			// 	margin-bottom: 0;
			// }
		}

		.popul {
			position: fixed;
			left: 0;
			right: 0;
			border-top: 1rpx solid #eeeeee;
			font-family: STKaiti;
			padding: 15rpx 30rpx;
			display: flex;
			align-items: center;
			background-color: #f2f2f2;

			.size {
				font-size: 50rpx;
			}

			.input {
				padding: 15rpx;
				margin: 0 5rpx 0 7rpx;
				background-color: #fff;
				border-radius: 10rpx;
				width: 530rpx;
			}

			.second {
				margin: 0 8rpx 0 7rpx;
			}

			.btn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				margin-left: 10rpx;
				text-align: center;
				background-color: #1aa5fc;
				border-radius: 15rpx;
				color: #fff;
				z-index: 99;
				font-size: 25rpx;
			}
		}

		.list {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-top: 1rpx solid #d3d3d3;
			padding: 15rpx 20rpx;
			overflow-x: scroll;
			background-color: #f1f1f1;

			.message {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 12.5%;
				height: 80rpx;
				font-size: 50rpx;
			}

		}

		.more {
			padding-bottom: 20rpx;

			.optionItem {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 25rpx;

				.icon {
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #fff;
					width: 90rpx;
					height: 90rpx;
					border-radius: 20rpx;
					margin-bottom: 10rpx;

					.iconfont {
						font-size: 45rpx;
					}
				}
			}

			.optionItem:nth-child(n+5) {
				margin-bottom: 40rpx;
			}
		}
	}

	.audioBg {
		.bg {
			margin-top: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #55ffff;
			width: 400rpx;
			height: 150px;
			border-radius: 20rpx;

			.img {
				width: 50%;
				height: 50%;
			}
		}

	}
</style>