<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ top: statusBarHeight + 'px' }">
      <view class="back-button" @click="goBack">
        <image src="@/static/img/common/arrow-back.svg" mode="aspectFit" class="back-icon"></image>
      </view>
      <text class="navbar-title">聊天详情</text>
      <view class="navbar-placeholder"></view>
    </view>

    <!-- 滚动内容区域 -->
    <scroll-view 
      class="scroll-content" 
      :style="{ 
        top: statusBarHeight + 44 + 'px',
        height: 'calc(100vh - ' + (statusBarHeight + 44) + 'px)'
      }"
      scroll-y="true"
    >
      <view class="content">
        <!-- 用户信息卡片 -->
        <view class="user-card">
          <view class="user-avatar">
            <image :src="getAvatarUrl(friendInfo.avatar)" mode="aspectFill" class="avatar-img"></image>
            <view class="online-status" v-if="friendInfo.isOnline"></view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ friendInfo.nickname }}</text>
            <text class="user-id">ID: {{ friendInfo.userId }}</text>
          </view>
        </view>

        <!-- 聊天设置 -->
        <view class="settings-section">
          <view class="section-title">聊天设置</view>
          
          <!-- 置顶聊天 -->
          <view class="setting-item" @click="toggleTopChat">
            <view class="setting-left">
              <image src="@/static/img/userConfig/pin-icon.svg" mode="aspectFit" class="setting-icon"></image>
              <text class="setting-text">置顶聊天</text>
            </view>
            <view class="setting-right">
              <switch 
                :checked="chatSettings.isTopChat" 
                @change="toggleTopChat"
                class="setting-switch"
              />
            </view>
          </view>

        

          <!-- 聊天背景 -->
          

          <!-- 查找聊天记录 -->
         
        </view>

        <!-- 聊天管理 -->
        <view class="settings-section">
          <view class="section-title">聊天管理</view>
          
          <!-- 清空聊天记录 -->
         
          <!-- 举报用户 -->
          <view class="setting-item" @click="reportUser">
            <view class="setting-left">
              <image src="@/static/img/userConfig/report-icon.svg" mode="aspectFit" class="setting-icon"></image>
              <text class="setting-text">举报用户</text>
            </view>
            <view class="setting-right">
              <image src="@/static/img/common/arrow-right.svg" mode="aspectFit" class="arrow-icon"></image>
            </view>
          </view>
        </view>

        <!-- 危险操作 -->
        <view class="danger-section">
          <view class="danger-item" @click="showDeleteConfirm">
            <image src="@/static/img/userConfig/delete-icon.svg" mode="aspectFit" class="danger-icon"></image>
            <text class="danger-text">删除好友</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 删除确认弹窗 -->
    <view v-if="showDeleteModal" class="modal-overlay" @click="hideDeleteConfirm">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <image src="@/static/img/userConfig/warning-icon.svg" mode="aspectFit" class="warning-icon"></image>
          <text class="modal-title">删除好友</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">确定要删除好友 "{{ friendInfo.nickname }}" 吗？</text>
          <text class="modal-subtext">删除后将无法恢复，聊天记录也会被清空</text>
        </view>
        <view class="modal-actions">
          <view class="modal-btn cancel-btn" @click="hideDeleteConfirm">取消</view>
          <view class="modal-btn confirm-btn" @click="confirmDelete">删除</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useFriendStore } from '@/pinia/friend/friend';
import { deleteFriendAPi } from '@/api/friend';
import { previewOnlineFileApi } from '@/api/file';

export default {
  data() {
    return {
      statusBarHeight: uni.getSystemInfoSync().statusBarHeight || 0,
      conversationId: '',
      showDeleteModal: false,
      chatSettings: {
        isTopChat: false,
        isMuted: false
      }
    };
  },

  computed: {
    friendInfo() {
      const friendStore = useFriendStore();
      const info = friendStore.getFriendInfoById(this.conversationId) || {
        nickname: '未知用户',
        userId: '',
        avatar: '',
        isOnline: false
      };
      return {
        ...info,
        isOnline: (info as any).isOnline || false
      };
    }
  },

  onLoad(option: any) {
    if (option.id) {
      this.conversationId = option.id;
    }
  },

  methods: {
    getAvatarUrl(avatar: string) {
      return previewOnlineFileApi(avatar);
    },

    goBack() {
      uni.navigateBack();
    },

    viewProfile() {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${this.friendInfo.userId}`
      });
    },

    toggleTopChat() {
      this.chatSettings.isTopChat = !this.chatSettings.isTopChat;
      uni.showToast({
        title: this.chatSettings.isTopChat ? '已置顶' : '已取消置顶',
        icon: 'success'
      });
    },

    toggleMute() {
      this.chatSettings.isMuted = !this.chatSettings.isMuted;
      uni.showToast({
        title: this.chatSettings.isMuted ? '已开启免打扰' : '已关闭免打扰',
        icon: 'success'
      });
    },

    changeChatBackground() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },

    searchChatHistory() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },

    clearChatHistory() {
      uni.showModal({
        title: '清空聊天记录',
        content: '确定要清空与该好友的聊天记录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '聊天记录已清空',
              icon: 'success'
            });
          }
        }
      });
    },

    reportUser() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },

    showDeleteConfirm() {
      this.showDeleteModal = true;
    },

    hideDeleteConfirm() {
      this.showDeleteModal = false;
    },

    confirmDelete() {
      deleteFriendAPi({
        friendId: this.friendInfo.userId
      }).then(() => {
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/home/home',
            animationType: 'pop-in',
            animationDuration: 200
          });
        }, 1500);
      }).catch(() => {
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        });
      });
      this.hideDeleteConfirm();
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
.container {
  height: 100vh;
  background-color: #F9FAFB;
  position: relative;
}

/* 导航栏 */
.navbar {
  position: fixed;
  left: 0;
  right: 0;
  height: 44px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 100;
}

.back-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8F9FA;
  border: none;
  border-radius: 8px;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.navbar-title {
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #2D3436;
  flex: 1;
}

.navbar-placeholder {
  width: 32px;
}

/* 滚动内容区域 */
.scroll-content {
  position: fixed;
  left: 0;
  right: 0;
  background-color: #F9FAFB;
}

.content {
  padding: 16px;
  padding-bottom: 32px;
  max-width: 375px;
  box-sizing: border-box;
  margin: 0 auto;
}

/* 用户信息卡片 */
.user-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.user-avatar {
  position: relative;
  margin-right: 16px;
}

.avatar-img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
}

.online-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #4CAF50;
  border: 2px solid #FFFFFF;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
  display: block;
}

.user-id {
  font-size: 14px;
  color: #636E72;
  display: block;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #F8F9FA;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 20px;
  height: 20px;
}

/* 设置区域 */
.settings-section {
  background: #FFFFFF;
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.section-title {
  padding: 16px 20px 8px;
  font-size: 14px;
  font-weight: 600;
  color: #636E72;
  background: #F8F9FA;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #F0F2F5;
  transition: background-color 0.2s;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background-color: #F8F9FA;
}

.setting-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-icon {
  width: 20px;
  height: 20px;
}

.setting-text {
  font-size: 16px;
  color: #2D3436;
  font-weight: 500;
}

.setting-right {
  display: flex;
  align-items: center;
}

.setting-switch {
  transform: scale(0.8);
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

/* 危险操作区域 */
.danger-section {
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.danger-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  transition: background-color 0.2s;
}

.danger-item:active {
  background-color: #FFF5F5;
}

.danger-icon {
  width: 20px;
  height: 20px;
}

.danger-text {
  font-size: 16px;
  color: #FF5252;
  font-weight: 500;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #FFFFFF;
  border-radius: 16px;
  margin: 20px;
  max-width: 320px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  padding: 24px 20px 16px;
  text-align: center;
}

.warning-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  display: block;
}

.modal-body {
  padding: 0 20px 24px;
  text-align: center;
}

.modal-text {
  font-size: 16px;
  color: #2D3436;
  margin-bottom: 8px;
  display: block;
}

.modal-subtext {
  font-size: 14px;
  color: #636E72;
  line-height: 1.4;
  display: block;
}

.modal-actions {
  display: flex;
  border-top: 1px solid #F0F2F5;
}

.modal-btn {
  flex: 1;
  padding: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.modal-btn:active {
  background-color: #F8F9FA;
}

.cancel-btn {
  color: #636E72;
  border-right: 1px solid #F0F2F5;
}

.confirm-btn {
  color: #FF5252;
}
</style>
