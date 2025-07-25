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
          :avatar="(allUserMapInfo.get(item.sender.userId)?.avatar|| item.sender.avatar)"
          :user-id="item.sender.userId"
          :position="item.sender.userId === userInfo.userId ? 'right' : 'left'"
          :current-user-id="userInfo.userId"
					@scroll-bottom="scrollToBottom"

        />
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
import { useMessageStore } from '@/pinia/message/message';
import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';
import { useFriendStore } from "@/pinia/friend/friend";

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
		const pageChatStore = usePageChatStore();
		const chatType = ref(0);
		const userStore = useUserStore();
		const friendStore = useFriendStore();
		const statusBarHeight = ref(0);
		const userInfo = computed(() => {
			return userStore.userInfo
		})
		const allUserMapInfo = computed(() => {
			return friendStore.allUserMapInfo
		})

		const scrollTop = ref(0);
		const contentHeight = ref(0);
		const getStatusBarHeight = () => {
      try {
        const info = uni.getSystemInfoSync();
        statusBarHeight.value = info.statusBarHeight || 0;
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };
		getStatusBarHeight()

		const getHeight = (h = 100) => {
			const val = uni.getSystemInfoSync();
			const headerHeight = 45; // 顶部导航栏高度
			const inputHeight = 45; // 输入区域高度
			const safeArea = val.safeAreaInsets?.bottom || 0;
			const emojiHeight = pageChatStore.showEmoji ? pageChatStore.emojiHeight : 0; // 表情面板高度
			const morePanelHeight = pageChatStore.showMore ? pageChatStore.morePanelHeight : 0; // 表情面板高度

			const keyboardHeight = pageChatStore.keyboardHeight; // 键盘高度
			
			// 计算可用高度
			const availableHeight = val.windowHeight - headerHeight - inputHeight - safeArea - emojiHeight - keyboardHeight - morePanelHeight;
			// 转换为 rpx 单位（1px = 2rpx）
			contentHeight.value = availableHeight * 2;
		};

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
			getHeight();
			scrollToBottom();
		});

		// 监听表情面板状态变化
		watch(() => pageChatStore.showEmoji, () => {
			getHeight();
			scrollToBottom();
		});
		watch(() => pageChatStore.showMore, () => {
			getHeight();
			scrollToBottom();
		});
		onMounted(() => {
			getHeight();
		});

		watch([messages], (newVal, oldVal) => {
			scrollToBottom();
		}, { deep: true, immediate: true });

		return {
			statusBarHeight,
			allUserMapInfo,
			messages,
			contentHeight,
			scrollTop,
			userInfo,
			chatType,
			scrollToBottom
		};
	},
});
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