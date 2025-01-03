<template>
	<view class="infoList">
		<scroll-view refresher-background="#f5f5f5"  :scroll-top="scrollTop"  :refresher-threshold="40" class="scroll" scroll-y="true"
			:style="{ height: contentHeight + 'rpx' }">
			<view v-for="(item) in messages" class="messageList" :key="item">
				<MessageItem :message='item.msg' :avatar="item.sender.avatar"
					:position="item.sender.userId === userInfo.userId ? 'right' : 'left'"
					@scroll-bottom="scrollBottom"
					></MessageItem>
			</view>
		</scroll-view>
	</view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch, nextTick, computed } from "vue";
import MessageItem from "./messageItem.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useUserStore } from "@/pinia/user/user";
import emitter from '@/utils/mitt';
export default defineComponent({
	components: {
		MessageItem,
	},
	props: {
		messages: {
			type: Object,
			default: () => ({}),
		},
		wh: {
			type: Number,
			default: 0,
		},
	},
	setup(props) {
		const { messages} = toRefs(props);

		const chatType = ref(0);
		const store = useUserStore();
		const userInfo = computed(() => {
			return store.userInfo
		})
		const scrollTop = ref(0); //滚动距离
		const contentHeight = ref(0);

		const getHeight = (h = 100) => {
			const val = uni.getSystemInfoSync();
			contentHeight.value = (val.windowHeight - h)*2;
		};

		const scrollBottom = () => {
				nextTick(() => {
					scrollTop.value += 9999999999;
				})
			};

		onMounted(() => {
			getHeight();
			emitter.on('changeWh', (val:number)=>{
				// if(val){
				// 	contentHeight.value = val
				// }else{
				// 	getHeight();
				// }
				getHeight(val);
				scrollBottom()
			})
		});
		watch([messages], (newVal, oldVal) => {
				scrollBottom();
			}, { deep:true,immediate: true });
		return {
			messages,
			contentHeight,
			scrollTop,
			userInfo,
			chatType,
			scrollBottom
		};
	},
});
</script>

<style lang="scss" scoped>
:deep(.uni-scroll-view-refresh-inner) {
	background-color: transparent;
	box-shadow: none;
}



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

					.imgMsg {
						max-height: 220rpx;
						max-width: 450rpx;
					}
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
					max-width: 70%;

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

</style>