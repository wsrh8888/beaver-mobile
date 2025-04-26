<template>
	<view :class="['info', position]">
		<image :lazy-load="true" class="img" :src="avatar" @click="handleGoDetail">
		</image>
		<view class="contents">
			<!-- 文本 -->
			<view class="content" v-if="message.type == 1">
				<!-- <view v-html="convertedContent" class="text"> </view> -->
				<rich-text :nodes="convertedContent" class="text"></rich-text>

			</view>
			<!-- 图片 -->
			<view class="contentImg" v-if="message.type == 2">
				<image @click="preview(message.imageMsg.fileId)" @load="onImageLoad"
					:style="{ width: imageWidth + 'rpx', height: imageHeight + 'rpx' }" :lazy-load="true" class="imgMsg"
					:src="previewOnlineFileApi(message.imageMsg.fileId)" mode="">
				</image>
			</view>
		</view>

	</view>
</template>

<script lang="ts">
import { previewOnlineFileApi } from '@/api/file';
import { emojiMap } from '@/utils/emoji';
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

		const preview = (fileId) => {
			uni.previewImage({
				current: 0,
				urls: [previewOnlineFileApi(fileId)]
			})
		}
		const onImageLoad = (event) => {
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
			imageWidth.value = newWidth * 2;  // 设置图片宽度为屏幕宽度
			imageHeight.value = newHeight * 2;  // 通过比例调整图片高度
			emit('scroll-bottom');
		}
		const convertedContent = computed(() => {
			// return content.replace(/\[微笑\]/g, '<img src="path_to_smile_image.png" alt="微笑" />');\
			let content = message.value.textMsg.content;

			const matches = content.match(/\[[^\]]+\]/g);
			if (matches) {
				matches.forEach(match => {
					if (emojiMap(match)) {
						console.error('emojiMap', emojiMap(match));
						// 替换成对应的图片标签
						const imgTag = `<img src="${emojiMap(match)}" style="width:30px;height:30px;display:block;"></img>`;
						content = content.replace(match, imgTag);
					}
				});
			}
			return content;
		})
		return {
			convertedContent,
			message,
			preview,
			handleGoDetail,
			onImageLoad,
			imageWidth,
			imageHeight,
			previewOnlineFileApi
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



	.scroll {
		box-sizing: border-box;

		.messageList {
			display: flex;
			flex-direction: column;
			color: #000;



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
				gap: 16rpx;

				.contents {
					display: flex;
					flex-direction: column;
					max-width: 70%;

					.content {
						position: relative;
						box-sizing: border-box;
						min-height: 72rpx;
						border-radius: 36rpx;
						background-color: #F5F5F5;
						display: flex;
						align-items: center;
						padding: 20rpx 32rpx;

						.text {
							font-size: 30rpx;
							line-height: 1.4;
							color: #333333;
						}

						&::before {
							content: "";
							position: absolute;
							left: -16rpx;
							top: 24rpx;
							width: 0;
							height: 0;
							border: 16rpx solid transparent;
							border-right: 16rpx solid #F5F5F5;
							border-left: 0;
						}
					}

					.contentImg {
						border-radius: 20rpx;
						overflow: hidden;
						max-width: 400rpx;

						.imgMsg {
							max-width: 100%;
							height: auto;
							vertical-align: top;
						}
					}
				}

				.img {
					width: 64rpx;
					height: 64rpx;
					border-radius: 32rpx;
					overflow: hidden;
					flex-shrink: 0;
				}
			}

			.right {
				flex-direction: row-reverse;

				.contents {
					align-items: flex-end;

					.content {
						background-color: #FF7D45;

						.text {
							color: #FFFFFF;
						}

						&::before {
							left: auto;
							right: -16rpx;
							border: 16rpx solid transparent;
							border-left: 16rpx solid #FF7D45;
							border-right: 0;
						}
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

.info {
	display: flex;
	align-items: flex-start;

	.img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 32rpx;
		overflow: hidden;
		flex-shrink: 0;
	}

	.contents {
		margin-left: 16rpx;
		max-width: 480rpx;

		.content {
			position: relative;
			background-color: #F5F5F5;
			border-radius: 0 20rpx 20rpx 20rpx;
			padding: 24rpx;

			.text {
				font-size: 28rpx;
				color: #333333;
			}

			&::before {
				content: "";
				position: absolute;
				left: -16rpx;
				top: 0;
				width: 0;
				height: 0;
				border: 8rpx solid transparent;
				border-right: 8rpx solid #F5F5F5;
				border-top: 8rpx solid #F5F5F5;
			}
		}

		.contentImg {
			border-radius: 20rpx;
			overflow: hidden;
			max-width: 400rpx;

			.imgMsg {
				max-width: 100%;
				height: auto;
				vertical-align: top;
			}
		}
	}
}

.right {
	flex-direction: row-reverse;

	.contents {
		margin-left: 0;
		margin-right: 16rpx;
		align-items: flex-end;

		.content {
			background-color: #FF7D45;
			border-radius: 20rpx 0 20rpx 20rpx;

			.text {
				color: #FFFFFF;
			}

			&::before {
				left: auto;
				right: -16rpx;
				border: 8rpx solid transparent;
				border-left: 8rpx solid #FF7D45;
				border-top: 8rpx solid #FF7D45;
			}
		}
	}
}
</style>