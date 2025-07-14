<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ top: statusBarHeight + 'rpx' }">
      <text class="header-title">消息</text>
      <view class="header-icon" @click="showDropdown = !showDropdown">
        <image src="@/static/img/home/plus-icon.svg" mode="aspectFit" class="icon-img" />
      </view>
    </view>

    <!-- 下拉菜单 -->
    <view class="dropdown" :class="{ 'show': showDropdown }" :style="{ top: (statusBarHeight + 112) + 'rpx' }">
      <view class="dropdown-item" @click="navigateTo('/pages/createGroup/createGroup')">
        <view class="dropdown-icon">
          <image src="@/static/img/home/group-icon.svg" mode="aspectFit" class="icon-img" />
        </view>
        <text>发起群聊</text>
      </view>
      <view class="dropdown-item" @click="navigateTo('/pages/searchFriend/searchFriend')">
        <view class="dropdown-icon">
          <image src="@/static/img/home/add-friend-icon.svg" mode="aspectFit" class="icon-img" />
        </view>
        <text>添加好友</text>
      </view>
      <view class="dropdown-item" @click="scanCode">
        <view class="dropdown-icon">
          <image src="@/static/img/home/scan-icon.svg" mode="aspectFit" class="icon-img" />
        </view>
        <text>扫一扫</text>
      </view>
    </view>

    <!-- 遮罩层 -->
    <view class="mask" :class="{ 'show': showDropdown }" @click="showDropdown = false"></view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content" :style="{ top: statusBarHeight + 112 + 'rpx' }" @scroll="onScroll">
      <!-- 搜索栏 -->
      <view class="search-wrapper">
        <view class="search-bar" @click="navigateTo('/pages/search/search')">
          <view class="search-icon">
            <image src="@/static/img/home/search-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <text class="search-placeholder">搜索</text>
        </view>
      </view>
      <!-- 置顶消息列表 -->
      <view class="message-section" v-if="pinnedChats.length > 0">
        <view class="section-header">
          <view class="section-title">置顶会话</view>
        </view>
        <scroll-view scroll-x class="pinned-list" show-scrollbar="false">
          <view v-for="chat in pinnedChats" :key="chat.conversationId" class="pinned-item"
            @click="handleChatClick(chat)">
            <view class="pinned-avatar">
              <image :src="(allUserMapInfo.get(parseConversationGetFriendId(chat.conversationId) || '')?.avatar || chat.avatar)" mode="aspectFill" class="avatar-img" />
            </view>
            <view class="pinned-info">
              <view class="pinned-name">{{ (allUserMapInfo.get(parseConversationGetFriendId(chat.conversationId) || '')?.nickname || chat.nickname) }}</view>
              <view class="pinned-message">{{ chat.msg_preview }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 普通消息列表 -->
      <view class="message-section">
        <view class="section-header">
          <view class="section-title">消息</view>
        </view>
        <view class="regular-list">
          <uni-swipe-action>
            <uni-swipe-action-item v-for="(chat, index) in chatList" :key="chat.conversationId"
              :right-options="swipeOptions" @change="(e: string, chat: any) => handleSwipeAction(e, chat, index)">
              <view class="message-item" @click="handleChatClick(chat)">
                <view class="avatar-wrapper">
                  <view class="avatar">
                    <image :src="(allUserMapInfo.get(parseConversationGetFriendId(chat.conversationId) || '')?.avatar || chat.avatar)" mode="aspectFill" class="avatar-img" />
                    <view v-if="chat.unread_count" class="badge" :class="chat.unread_count > 99 ? 'yellow' : 'red'">
                      {{ chat.unread_count > 99 ? '99+' : chat.unread_count }}
                    </view>
                  </view>
                </view>
                <view class="message-content">
                  <view class="message-header">
                    <view class="message-name">{{ (allUserMapInfo.get(parseConversationGetFriendId(chat.conversationId) || '')?.nickname || chat.nickname) }}</view>
                    <view class="message-time">{{ formatTime(chat.update_at) }}</view>
                  </view>
                  <view class="message-preview">{{ chat.msg_preview }}</view>
                </view>
              </view>
            </uni-swipe-action-item>
          </uni-swipe-action>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useMessageStore } from '@/pinia/message/message';
import { useConversationStore } from '@/pinia/conversation/conversation';
import { useFriendStore } from '@/pinia/friend/friend';
import { formatTime } from '@/utils/time';
import type { IChatInfo } from '@/types/ajax/chat';
import {parseConversation} from '@/utils/conversation'
import { useUserStore } from '@/pinia/user/user';
export default defineComponent({
  setup() {
    const showDropdown = ref(false);
    const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight || 0);
    const conversationStore = useConversationStore();
    const friendStore = useFriendStore();
    const userStore = useUserStore();
    const allUserMapInfo = computed(() => {
			return friendStore.allUserMapInfo
		})

    // 获取聊天列表
    const chatList = computed(() => conversationStore.getRecentChatList());

    // 置顶聊天列表
    const pinnedChats = computed(() => chatList.value.filter(chat => chat.is_top));

    // 左滑选项
    const swipeOptions = [
      {
        text: '置顶',
        style: {
          backgroundColor: '#FF7D45',
          width: '120rpx',
          height: '100%',
          color: '#FFFFFF',
          textAlign: 'center',
          fontSize: '28rpx',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      {
        text: '删除',
        style: {
          backgroundColor: '#FF5252',
          width: '120rpx',
          height: '100%',
          color: '#FFFFFF',
          textAlign: 'center',
          fontSize: '28rpx',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
    ];

    // 扫描二维码
    const scanCode = () => {
      showDropdown.value = false;
      uni.scanCode({
        success: (res) => {
          try {
            const data = JSON.parse(res.result);
            // 处理扫码结果
          } catch (e) {
            uni.showToast({
              title: '无效的二维码',
              icon: 'none'
            });
          }
        }
      });
    };

   
    // 页面导航
    const navigateTo = (url: string) => {
      showDropdown.value = false;
      uni.navigateTo({
        url,
        animationType: 'slide-in-right',
        animationDuration: 300
      });
    };

    // 点击聊天项
    const handleChatClick = (chat: any) => {
      uni.navigateTo({
        url: `/pages/chat/chat?id=${chat.conversationId}`,
        animationType: 'slide-in-right',
        animationDuration: 300
      });
    };

    // 处理左滑动作
    const handleSwipeAction = (type: string, chat: IChatInfo, index: number) => {
      if (type === 'pin') {
        conversationStore.toggleTopChat(chat.conversationId);
        uni.showToast({
          title: chat.is_top ? '取消置顶' : '已置顶',
          icon: 'none'
        });
      } else if (type === 'delete') {
        uni.showModal({
          title: '提示',
          content: '确定删除该会话吗？',
          success: (res) => {
            if (res.confirm) {
              
              uni.showToast({
                title: '已删除',
                icon: 'none'
              });
            }
          }
        });
      }
    };

    // 滚动事件处理
    const onScroll = (e: any) => {
      const { scrollTop } = e.detail;
      // 可以在这里处理滚动事件
    };

    onMounted(() => {
      // 获取最新的会话列表
      // conversationStore.getRecentChatList();
    });

 
    const parseConversationGetFriendId = (conversationId: string) =>{
      return parseConversation(conversationId, userStore.userInfo.userId)
    }

    return {
      parseConversationGetFriendId,
      allUserMapInfo,
      statusBarHeight,
      showDropdown,
      chatList,
      pinnedChats,
      swipeOptions,
      scanCode,
      navigateTo,
      handleChatClick,
      handleSwipeAction,
      onScroll,
      formatTime,
      friendStore
    };
  }
});
</script>

<style lang="scss" scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  font-family: "PingFang SC", "SF Pro", "微软雅黑", sans-serif;
}

.container {
  background-color: #FFFFFF;
  color: #2D3436;
  font-size: 28rpx;
  line-height: 1.5;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
}

/* 顶部导航栏 */
.header {
  height: 112rpx;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  background: #FFFFFF;
}

.header-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #2D3436;
}

.header-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
}

/* 内容区域 */
.content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;
}

/* 搜索栏 */
.search-wrapper {
  padding: 0 32rpx 20rpx;
}

.search-bar {
  background: #F9FAFB;
  border-radius: 20rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
}

.search-icon {
  color: #B2BEC3;
  margin-right: 20rpx;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-placeholder {
  color: #B2BEC3;
  font-size: 28rpx;
}

/* 消息分组 */
.message-section {
  margin-bottom: 24rpx;
}

.section-header {
  padding: 0 32rpx;
  margin-bottom: 12rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #636E72;
}

/* 置顶消息列表 */
.pinned-list {
  padding: 0 32rpx;
  display: flex;
  white-space: nowrap;
}

.pinned-item {
  display: inline-flex;
  align-items: center;
  width: 200rpx;
  padding: 16rpx;
  background: #F9FAFB;
  border-radius: 20rpx;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.03);
}

.pinned-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 26rpx;
  position: relative;
  margin-right: 16rpx;
}

.pinned-avatar.blue {
  background: linear-gradient(135deg, #4A6FA1 0%, #375782 100%);
  box-shadow: 0 2rpx 6rpx rgba(74, 111, 161, 0.2);
}

.pinned-info {
  flex: 1;
  min-width: 0;
}

.pinned-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #2D3436;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pinned-message {
  font-size: 20rpx;
  color: #636E72;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 普通消息列表 */
.regular-list {
  padding: 0 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 100rpx);
}

.message-item {
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  position: relative;
}

.message-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 128rpx;
  right: 0;
  bottom: 0;
  height: 1rpx;
  background-color: #EBEEF5;
}

.avatar-wrapper {
  position: relative;
  margin-right: 32rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 32rpx;
  position: relative;
}

.avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 28rpx 28rpx 0 0;
}

.avatar.primary {
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  box-shadow: 0 4rpx 12rpx rgba(255, 125, 69, 0.15);
}

.avatar.blue {
  background: linear-gradient(135deg, #4A6FA1 0%, #375782 100%);
  box-shadow: 0 4rpx 12rpx rgba(74, 111, 161, 0.15);
}

.avatar.green {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.15);
}

.avatar.purple {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  box-shadow: 0 4rpx 12rpx rgba(156, 39, 176, 0.15);
}

.avatar.yellow {
  background: linear-gradient(135deg, #FFD166 0%, #FFC107 100%);
  box-shadow: 0 4rpx 12rpx rgba(255, 209, 102, 0.15);
}

.badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  padding: 0 8rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.badge.red {
  background: #FF5252;
}

.badge.yellow {
  background: #FFD166;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.message-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D3436;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.message-time {
  font-size: 24rpx;
  color: #B2BEC3;
  flex-shrink: 0;
}

.message-preview {
  font-size: 28rpx;
  color: #636E72;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 下拉菜单 */
.dropdown {
  position: fixed;
  right: 32rpx;
  background: white;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.1);
  border-radius: 24rpx;
  width: 320rpx;
  overflow: hidden;
  z-index: 200;
  display: none;
  opacity: 0;
  transform: translateY(-20rpx);
  transform-origin: top right;
  transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.dropdown.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.dropdown-item {
  height: 88rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  color: #2D3436;
  font-weight: 500;
  font-size: 28rpx;
}

.dropdown-item:active {
  background-color: #F9FAFB;
}

.dropdown-icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF7D45;
}

/* 遮罩层 */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 150;
  display: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.mask.show {
  display: block;
  opacity: 1;
}

/* 图标样式 */
.icon-img {
  width: 100%;
  height: 100%;
}

/* 头像图片样式 */
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 28rpx;
  object-fit: cover;
}

/* 左滑按钮样式 */
.uni-swipe-action {
  position: relative;
  width: 100%;
}

.uni-swipe-action__content {
  position: relative;
  width: 100%;
  background-color: #FFFFFF;
}

.uni-swipe-action__btn-group {
  position: absolute;
  right: -240rpx;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
}

.uni-swipe-action__btn {
  width: 120rpx !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 28rpx !important;
  font-weight: 500 !important;
  color: #FFFFFF !important;
  transition: all 0.3s ease !important;
}

.uni-swipe-action__btn:first-child {
  background-color: #FF7D45 !important;
}

.uni-swipe-action__btn:last-child {
  background-color: #FF5252 !important;
}

.uni-swipe-action__btn:active {
  opacity: 0.9;
}
</style>
