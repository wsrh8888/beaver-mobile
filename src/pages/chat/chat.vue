<template>
	<view class="container">
		<!-- 顶部渐变区域 -->
		<view class="gradient-top"></view>
		
		<!-- 头部导航 -->
		<HeaderComponent 
			:title="getDisplayTitle()"
			:show-back="true"
			@back="goBack"
		>
			<template #right-content>
				<view class="header-button" @click="handleClickMore">
					<image src="/static/img/chat/more.svg" mode="aspectFit" class="header-icon" />
				</view>
			</template>
		</HeaderComponent>

		<!-- 聊天内容区域 -->
		<ContentComponent 
			ref="contentRef"
			:conversationId="conversationId" 
			:messages="messages"
			:loading="loading"
			:has-more="hasMore"
			class="chat-container"
			@load-more="loadMoreMessages"
		/>

		<!-- 底部输入区域 -->
		<BottomComponent 
			:conversationId="conversationId" 
			:chatType="chatType" 
			@messageSent="handleMessageSent"
		/>
	</view>
</template>

<script lang="ts">
	import { 
		ref, 
		computed, 
		nextTick,
		onMounted,
		onBeforeUnmount
	} from 'vue';
	import ContentComponent from './component/content.vue'
	import HeaderComponent from "@/component/header/header.vue";
	import BottomComponent from "./component/bottom.vue";
	import { onLoad } from '@dcloudio/uni-app';
	import { useMessageStore } from '@/pinia/message/message';
	import { useConversationStore } from '@/pinia/conversation/conversation';
	import type { IChatInfo, IChatHistory } from '@/types/ajax/chat';
	import  { MessageStatus } from '@/types/ajax/chat';

	import type { ChatType } from "./types";
	import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';

	export default {
		name: 'ChatPage',
		components: {
			HeaderComponent,
			ContentComponent,
			BottomComponent
		},
		setup() {
			const chatStore = useMessageStore();
			const conversationStore = useConversationStore();
			const pageChatStore = usePageChatStore();
			const contentRef = ref<InstanceType<typeof ContentComponent> | null>(null);
			
			// 基础状态
			const conversationId = ref<string>('');
			const chatType = ref<ChatType>('single');
			
			// 从 Store 获取消息列表
			const messages = computed(() => 
				chatStore.getChatHistory(conversationId.value)
			);
			
			// 从 Store 获取加载状态
			const loading = computed(() => 
				chatStore.loadingStates.get(conversationId.value) || false
			);
			
			// 从 Store 获取是否有更多消息
			const hasMore = computed(() => {
				const history = chatStore.getChatHistory(conversationId.value);
				return history.length >= 20; // 或其他判断逻辑
			});

			// 从 Store 获取会话信息
			const conversationInfo = computed<IChatInfo | null>(() => 
				conversationStore.getConversationInfo(conversationId.value)
			);

			// 发送消息
			const handleSendMessage = async (message: IChatHistory) => {
				try {
					// 消息发送已在 messageManager 中处理，这里只需要滚动到底部
					await nextTick();
					scrollToBottom();
				} catch (err) {
					console.error('处理消息失败:', err);
				}
			};

			// 消息发送成功回调
			const handleMessageSent = () => {
				nextTick(() => {
					scrollToBottom();
				});
			};

			// 加载更多消息
			const loadMoreMessages = async () => {
				if (loading.value) return;
				await chatStore.loadMoreMessages(conversationId.value);
			};

			// 滚动到底部
			const scrollToBottom = () => {
				nextTick(() => {
					if (contentRef.value) {
						// 确保组件实现了这个方法
						contentRef.value.scrollToBottom?.();
					}
				});
			};

			onLoad((option: any) => {
				conversationId.value = option.id;
				chatType.value = option.id?.includes('_') ? 'single' : 'group';
				
				// 设置当前会话
				conversationStore.setCurrentChat(conversationId.value);
			});

			onMounted(() => {
				// 初始化加载聊天记录
				chatStore.loadChatHistory(conversationId.value, true);
				
				// 监听消息变化
				const unsubscribe = chatStore.$subscribe((_, state) => {
					const currentHistory = state.chatHistory.get(conversationId.value);
					if (currentHistory && currentHistory.length > 0) {
						scrollToBottom();
					}
				});
				
				// 返回清理函数
				onBeforeUnmount(() => {
					unsubscribe();
					pageChatStore.reset();
				});
			});

			const goBack = () => {
				uni.navigateBack({ delta: 1 });
			};

			const handleClickMore = () => {
				if (chatType.value === 'single') {
					uni.navigateTo({
						url: `/pages/userConfig/userConfig?id=${conversationId.value}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/groupConfig/groupConfig?id=${conversationId.value}`
					});
				}
			};

			// 获取显示标题
			const getDisplayTitle = () => {
				const nickname = conversationInfo.value?.nickname;
				if (nickname && nickname.length >= 10) {
					return `${nickname.slice(0, 10)}...`;
				}
				return nickname || '';
			};

			return {
				...pageChatStore,
				conversationInfo,
				conversationId,
				chatType,
				messages,
				loading,
				hasMore,
				contentRef,
				handleSendMessage,
				handleMessageSent,
				loadMoreMessages,
				goBack,
				handleClickMore,
				getDisplayTitle
			};
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100vh;
	}

	/* 顶部渐变区域 */
	.gradient-top {
		height: 320rpx;
		background: linear-gradient(180deg, rgba(255,125,69,0.08) 0%, rgba(255,255,255,0) 100%);
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}

	/* 头部按钮 */
	.header-button {
		width: 72rpx;
		height: 72rpx;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;

		&:active {
			background-color: rgba(0,0,0,0.04);
		}
	}

	.header-icon {
		width: 44rpx;
		height: 44rpx;
		opacity: 0.9;
	}

	/* 聊天内容区域 */
	.chat-container {
		flex: 1;
		overflow: hidden;
		position: relative;
		z-index: 2;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		// height: calc(100vh - 88rpx - 120rpx - constant(safe-area-inset-bottom));
		// height: calc(100vh - 88rpx - 120rpx - env(safe-area-inset-bottom));
	}

	/* 输入区域包装器 */
	.input-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		background-color: #FFFFFF;
		box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	.voice-message {
		display: flex;
		align-items: center;
		padding: 16rpx 24rpx;
		background-color: #fff;
		border-radius: 32rpx;
		max-width: 70%;
		
		.voice-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 16rpx;
		}
		
		.voice-duration {
			font-size: 28rpx;
			color: #333;
		}
	}

	.error-tip {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.7);
		padding: 20rpx 32rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		gap: 16rpx;
		
		text {
			color: #FFFFFF;
			font-size: 28rpx;
		}
		
		.retry {
			color: #FF7D45;
			text-decoration: underline;
		}
	}
</style>