<template>
	<view>
		<view class="bottom-bar">
			<view class="actions-container">
				<!-- 好友模式 -->
				<template v-if="isFriend">
					<view class="action-button primary-button" @click="$emit('send-message')">
						<image src="@/static/img/detail/chat-icon.svg" mode="aspectFit" class="button-icon" />
						<text>发起聊天</text>
					</view>
					<!-- <view class="action-button secondary-button" @click="$emit('audio-call')">
						<image src="@/static/img/detail/voice-call-icon.svg" mode="aspectFit" class="button-icon" />
					</view>
					<view class="action-button secondary-button" @click="$emit('video-call')">
						<image src="@/static/img/detail/video-call-icon.svg" mode="aspectFit" class="button-icon" />
					</view> -->
				</template>
				
				<!-- 非好友模式 -->
				<template v-else>
					<view class="action-button primary-button" @click="showAddFriendDialog">
						<image src="@/static/img/detail/add-friend-icon.svg" mode="aspectFit" class="button-icon" />
						<text>添加好友</text>
					</view>
				</template>
			</view>
		</view>

		<!-- 添加好友对话框 -->
		<BeaverDialog
			v-model="showDialog"
			title="添加好友"
			content="请输入验证消息"
			type="default"
			size="medium"
			confirm-text="发送请求"
			cancel-text="取消"
			@confirm="handleConfirmAddFriend"
			@cancel="handleCancelAddFriend"
		>
			<view class="verify-input-container">
				<input 
					v-model="verifyMessage" 
					class="verify-input" 
					placeholder="请输入验证消息" 
					maxlength="50"
				/>
				<text class="input-counter">{{ verifyMessage.length }}/50</text>
			</view>
		</BeaverDialog>
	</view>
</template>

<script lang="ts">
import { ref } from 'vue';
import { addFriendApi } from '@/api/friend';
import BeaverDialog from '@/component/dialog/index.vue';

export default {
	name: 'ActionBar',
	components: {
		BeaverDialog
	},
	props: {
		isFriend: {
			type: Boolean,
			default: false
		},
		userId: {
			type: String,
			required: true
		},
		source: {
			type: String,
			default: ''
		}
	},
	emits: ['send-message', 'audio-call', 'video-call', 'add-friend-success'],
	setup(props, { emit }) {
		const showDialog = ref(false);
		const verifyMessage = ref('你好，我想添加你为好友');

		const showAddFriendDialog = () => {
			showDialog.value = true;
		};

		const handleConfirmAddFriend = async () => {
			try {
				const res = await addFriendApi({
					friendId: props.userId,
					verify: verifyMessage.value,
					source: props.source
				});
				
				if (res.code === 0) {
					uni.showToast({ title: '好友请求发送成功', icon: 'success' });
					emit('add-friend-success');
					showDialog.value = false;
				} else {
					uni.showToast({ title: res.msg || '添加失败', icon: 'none' });
				}
			} catch (error) {
				uni.showToast({ title: '添加失败，请稍后再试', icon: 'none' });
			}
		};

		const handleCancelAddFriend = () => {
			showDialog.value = false;
			verifyMessage.value = '你好，我想添加你为好友'; // 重置为默认值
		};

		return {
			showDialog,
			verifyMessage,
			showAddFriendDialog,
			handleConfirmAddFriend,
			handleCancelAddFriend
		};
	}
};
</script>

<style lang="scss" scoped>
/* 底部固定按钮 */
.bottom-bar {
	background-color: white;
	padding: 24rpx 32rpx 48rpx;
}

.actions-container {
	display: flex;
}

.actions-container > * {
	margin-right: 16rpx;
}

.actions-container > *:last-child {
	margin-right: 0;
}

.action-button {
	height: 96rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	cursor: pointer;
}

.primary-button {
	background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
	color: white;
	box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.2);
	font-size: 30rpx;
	font-weight: 600;
	flex: 3;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		transform: translateY(2rpx);
		box-shadow: 0 2rpx 8rpx rgba(255, 125, 69, 0.15);
	}

	text {
		color: white;
		font-weight: 600;
		margin-left: 12rpx;
	}
}

.secondary-button {
	background-color: #F0F3F4;
	flex: 1;

	&:active {
		background-color: #E8EBED;
		transform: translateY(2rpx);
	}
}

.button-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 验证消息输入框样式 */
.verify-input-container {
	width: 100%;
	position: relative;
}

.verify-input {
	width: 100%;
	height: 80rpx;
	padding: 0 24rpx;
	border-radius: 16rpx;
	border: 2rpx solid #EBEEF5;
	background-color: #F9FAFB;
	font-size: 28rpx;
	color: #2D3436;
	box-sizing: border-box;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: #FF7D45;
		box-shadow: 0 0 0 4rpx rgba(255, 125, 69, 0.1);
		background-color: white;
	}
}

.input-counter {
	position: absolute;
	right: 24rpx;
	bottom: 20rpx;
	font-size: 22rpx;
	color: #B2BEC3;
}
</style> 