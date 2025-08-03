<template>
	<view class="infoList">
		<scroll-view 
      refresher-background="#f5f5f5"  
      :scroll-top="scrollTop"  
      :refresher-threshold="40" 
      class="scroll" 
      scroll-y="true"
      :style="{ height: contentHeight + 'rpx', marginTop: (statusBarHeight + 44) + 'px' }"
    >
			<view v-for="(item) in messages" class="messageList" :key="item">
				<MessageItem 
          :message='item.msg' 
          :sender="item.sender"
          :position="item.sender.userId === userInfo.userId ? 'right' : 'left'"
          :current-user-id="userInfo.userId"
          :conversation-id="conversationId"
					@scroll-bottom="scrollToBottom"
        />
			</view>
		</scroll-view>
	</view>
</template>

<script lang="ts">
import { onMounted, ref, toRefs, watch, nextTick, computed } from "vue";
import MessageItem from "./MessageItem.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useUserStore } from "@/pinia/user/user";
import { useMessageStore } from '@/pinia/message/message';
import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';
import { useFriendStore } from "@/pinia/friend/friend";

export default {
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
		conversationId: {
			type: String,
			default: ''
		}
	},
	setup(props) {
		const { messages} = toRefs(props);
		const pageChatStore = usePageChatStore();
		const userStore = useUserStore();
		const friendStore = useFriendStore();
		const statusBarHeight = ref(0);
		const userInfo = computed(() => {
			return userStore.userInfo
		})


		const scrollTop = ref(0);
		const getStatusBarHeight = () => {
      try {
        const info = uni.getSystemInfoSync();
        statusBarHeight.value = info.statusBarHeight || 0;
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };
		getStatusBarHeight()

		// 使用 store 中的 getContentHeight，已经是 rpx 单位
		const contentHeight = computed(() => {
			return pageChatStore.getContentHeight; // 已经是 rpx 单位
		});

		const scrollToBottom = () => {
			setTimeout(() => {
					nextTick(() => {
						console.error('234234234')
						scrollTop.value += 9999999999;
				});
			}, 300);
			
		};

		// 监听键盘高度变化
		watch(() => pageChatStore.keyboardHeight, () => {
			console.error('键盘高度变化', pageChatStore.keyboardHeight)
			scrollToBottom();
		});

		// 监听表情面板状态变化
		watch(() => pageChatStore.showEmoji, () => {
			console.error('表情面板状态变化', pageChatStore.showEmoji)
			scrollToBottom();
		});
		watch(() => pageChatStore.showMore, () => {
			console.error('更多面板状态变化', pageChatStore.showMore)
			scrollToBottom();
		});
		onMounted(() => {
			console.error('onMounted')
		});

		watch([messages], (newVal, oldVal) => {
			scrollToBottom();
		}, { deep: true, immediate: true });

		return {
			statusBarHeight,
			messages,
			contentHeight,
			scrollTop,
			userInfo,
			scrollToBottom
		};
	}
}
</script>

<style lang="scss" scoped>
.infoList {
	padding: 0 32rpx;
	height: 100%;
	box-sizing: border-box;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
}

.scroll {
	box-sizing: border-box;
	height: 100%;
	overflow-y: auto;
	transition: height 0.3s ease;
}

.messageList {
	display: flex;
	flex-direction: column;
	padding: 18rpx 0
}
</style>