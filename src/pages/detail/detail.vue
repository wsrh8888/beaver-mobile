<template>
	<view class="detail__content">
		<HeaderComponent title="个人信息" background-color="#f5f5f5" @go-back="handleClickGoBack">
			<template #left-content>
				<!-- 可以根据需要添加返回按钮或其他内容 -->
			</template>
			<template #right-content>
				<!-- 可以根据需要添加右侧按钮或内容 -->
			</template>
		</HeaderComponent>

		<view class="detail__body">
			<image :src="friendInfo.avatar" class="avatar"></image>
			<text class="nickname">{{ friendInfo.nickname }}</text>
		</view>
		<view class="detail__contenet">
			<template v-if="friendInfo.isFriend">
				<view class="info">
					<view class="remark info__item"><label class="label">备注名:</label>
						<text class="">{{ friendInfo.remarkName }}</text>
					</view>

					<view class="nickname info__item"><label class="label">昵称:</label>
						<text>{{ friendInfo.nickname }}</text>
					</view>
					<view class="signature info__item"><label class="label">手机号: </label>{{ friendInfo.phone }}</view>

					<view class="signature info__item"><label class="label">个性签名:</label>
						<text>{{ friendInfo.signature }}</text>
					</view>
				</view>
				<view class="actions">
					<button @click="sendMessage"><label>发消息</label></button>
					<button @click="audioCall"><label>音频通话</label></button>
				</view>
			</template>
			<template v-else>
				<view class="info">
					<view class="nickname info__item"><label class="label">昵称:</label> {{ friendInfo.nickname }}</view>
					<view class="signature info__item"><label class="label">手机号: </label>{{ friendInfo.phone }}</view>
					<view class="signature info__item"><label class="label">个性签名: </label>{{ friendInfo.signature }}
					</view>
				</view>
				<view class="actions ">
					<button @click="showPopup">添加好友</button>
				</view>
			</template>
		</view>
		<uni-popup ref="applyRef" type="center" border-radius="10px 10px 0 0">
			<view class="popup-content">
				<view class="popup-header">添加好友</view>
				<view class="popup__content">
					<textarea class="popup-input" type="text" v-model="applyReason" placeholder="请输入申请理由"></textarea>
				</view>
				<view class="popup-actions">
					<view class="button" @click="closePopup">取消</view>
					<view class="button apply" @click="applyFriend">申请</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script lang="ts">
import { applyAddFriendApi, getFriendInfoApi } from '@/api/friend';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { defineComponent, ref } from 'vue';
import HeaderComponent from '@/component/header/header.vue';
import { useFriendStore } from '@/pinia/friend/friend';
export default defineComponent({
	components: {
		HeaderComponent
	},
	setup() {
		const friendId = ref<string>("");
		const friendInfoStore = useFriendStore();
		const friendInfo = ref({
			avatar: '',
			nickname: '',
			signature: '',
			remarkName: '',
			isFriend: false,
			phone: '',
		});
		const applyReason = ref<string>('');
		const applyRef = ref<any>();
		onLoad((option: any) => {
			friendId.value = option.id;
		});
		onShow(() => {
			getFriendInfoApi({
				friendId: friendId.value,
			}).then((res) => {
				if (res.code === 0) {
					friendInfo.value = res.result;
				}
			});
		});

		const sendMessage = () => {
			// 跳转到聊天详情页面
			uni.navigateTo({
				url: `/pages/chat/chat?id=${friendInfo.value.conversationId}`,
				animationType: 'slide-in-right',
				animationDuration: 200
			});

		};

		const audioCall = () => {
			// 写音频通话的逻辑
			console.log('音频通话');
		};

		const showPopup = () => {
			applyRef.value.open();
		};

		const closePopup = () => {
			applyRef.value.close();
		};

		const applyFriend = () => {
			applyAddFriendApi({
				friendId: friendId.value,
				verify: applyReason.value,
			}).then((res) => {
				if (res.code === 0) {
					uni.showToast({
						title: '好友申请成功',
						icon: 'success',
					});
					closePopup();
				}
			});
		};
		const handleClickGoBack = () => {
			uni.navigateBack({
				delta: 1,
			});
		};
		return {
			handleClickGoBack,
			applyRef,
			friendInfo,
			sendMessage,
			audioCall,
			showPopup,
			closePopup,
			applyFriend,
			applyReason,
		};
	}
});
</script>
<style lang="scss" scoped>
.detail__content {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f5f5;


	.detail__body {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20px;
		padding-bottom: 0;

		.avatar {
			width: 140rpx;
			height: 140rpx;
			border-radius: 20rpx;
			margin-bottom: 10px;
			overflow: hidden;
		}

		.nickname {
			font-size: 34rpx;
		}
	}

	.detail__contenet {
		flex: 1;
		background-color: #fff;
		border-top-left-radius: 375px 50px;
		border-top-right-radius: 375px 50px;
		margin-top: 25px;
		padding: 50px 15px 40px;
		display: flex;
		flex-direction: column;
		position: relative;

		.info {
			margin-bottom: 20px;

			.remark,
			.nickname,
			.signature {
				margin-bottom: 10px;
				font-size: 16px;
			}

			.info__item {
				display: flex;
				align-items: center;
				margin-top: 40rpx;

				.label {
					flex: 0 0 75px;
					color: #666;
				}
			}
		}

		.actions {
			display: flex;
			justify-content: space-around;
			gap: 20rpx;
			position: absolute;
			bottom: 80rpx;
			width: 80%;
			left: 50%;
			transform: translate(-50%, -50%);
			overflow: hidden;

			button {
				width: 450rpx;
				background-color: #0081ff;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				border-radius: 50px;

			}
		}
	}
}

.popup-content {
	width: 540rpx;
	background: #fff;
	border-radius: 16rpx;

	.popup-header {
		font-size: 26rpx;
		padding-top: 45rpx;
		margin-bottom: 10px;
		text-align: center;
	}

	.popup__content {
		box-sizing: border-box;

		.popup-input {
			margin: 0 auto;
			border-radius: 30rpx;
			width: 440rpx;
			padding: 20rpx 30rpx;
			background: rgb(245, 245, 245);
			height: 160rpx;
			font-size: 25rpx;
		}
	}

	.popup-actions {
		display: flex;
		justify-content: space-between;

		.button {
			text-align: center;
			flex: 1;
			border: none;
			border-radius: 4rpx;
			font-size: 30rpx;
			height: 100rpx;
			line-height: 100rpx;
		}

		.apply {
			color: rgb(41, 121, 255);
		}

	}
}
</style>