<template>
  <view class="container">
    <!-- 顶部渐变背景 -->
    <view class="top-gradient"></view>
    
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="back-button" @click="goBack">
        <image src="@/static/img/setting/back.svg" mode="aspectFit" />
      </view>
      <text class="page-title">通用设置</text>
    </view>

    <!-- 账号与安全设置 -->
    <view class="settings-card">
      <view class="setting-item" @click="handleClickItem(1)">
        <text class="setting-title">账号与安全</text>
        <image src="@/static/img/setting/arrow-right.svg" class="arrow-icon" mode="aspectFit" />
      </view>
    </view>

    <!-- 关于与支持 -->
    <view class="settings-card">
      <view class="setting-item" @click="handleClickItem(2)">
        <text class="setting-title">隐私政策</text>
        <image src="@/static/img/setting/arrow-right.svg" class="arrow-icon" mode="aspectFit" />
      </view>
      <view class="setting-item" @click="handleClickItem(3)">
        <text class="setting-title">用户协议</text>
        <image src="@/static/img/setting/arrow-right.svg" class="arrow-icon" mode="aspectFit" />
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-container">
      <view class="logout-button" @click="showExitDialog">退出登录</view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      Beaver App v1.0.0
    </view>

    <!-- 退出确认弹窗 -->
    <uni-popup ref="exitDialog" type="dialog" :maskClick="false">
      <uni-popup-dialog
        title="确认退出登录"
        content="退出后需要重新登录才能使用Beaver，确定要退出吗？"
        :before-close="true"
        @confirm="handleLogout"
        @close="handleCancel"
      />
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '@/pinia/user/user';
import { useInitStore } from '@/pinia/init/init';
import WsManager from '@/ws-manager/ws';
import { removeLocal } from '@/utils/local';

interface SettingItem {
  id: number;
  title: string;
  type: string;
}

export default defineComponent({
  name: 'Setting',
  setup() {
    const userStore = useUserStore();
    const initStore = useInitStore();
    const exitDialog = ref<any>(null);

    const goBack = () => {
      uni.navigateBack();
    };

    const handleClickItem = (id: number) => {
      switch (id) {
        case 1:
          uni.navigateTo({ url: '/pages/account-security/account-security' });
          break;
        case 2:
          uni.navigateTo({ url: '/pages/privacy/privacy' });
          break;
        case 3:
          uni.navigateTo({ url: '/pages/agreement/agreement' });
          break;
      }
    };

    const showExitDialog = () => {
      exitDialog.value?.open();
    };

    const handleLogout = () => {
      removeLocal('token');
      initStore.resetApp();
      WsManager.disconnect();
      uni.reLaunch({ url: '/pages/login/login' });
    };

    const handleCancel = () => {
      exitDialog.value?.close();
    };

    return {
      exitDialog,
      goBack,
      handleClickItem,
      showExitDialog,
      handleLogout,
      handleCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F9FAFB;
  padding: 16px;
}

.top-gradient {
  height: 120px;
  background: linear-gradient(180deg, rgba(255,125,69,0.1) 0%, rgba(255,255,255,0) 100%);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  height: 48px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.back-button {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #2D3436;
}

/* 设置卡片 */
.settings-card {
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 56px;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }
}

.setting-title {
  color: #2D3436;
  font-size: 14px;
  font-weight: 400;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #B2BEC3;
}

/* 退出按钮区域 */
.logout-container {
  margin-top: 40px;
}

.logout-button {
  width: 100%;
  height: 48px;
  background: #FFFFFF;
  color: #FF5252;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    opacity: 0.9;
  }
}

/* 版本信息 */
.version-info {
  margin-top: 24px;
  text-align: center;
  color: #B2BEC3;
  font-size: 12px;
}
</style>
