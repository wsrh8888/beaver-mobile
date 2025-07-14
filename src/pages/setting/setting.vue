<template>
  <view class="setting-page">
    <BeaverLayout
      title="通用设置"
      :show-background="true"
      background-type="gradient"
      :background-height="120"
      header-mode="fixed"
      @back="goBack"
    >
      <view class="content">
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
          <view class="setting-item" @click="handleClickItem(4)">
            <text class="setting-title">检查更新</text>
            <image src="@/static/img/setting/arrow-right.svg" class="arrow-icon" mode="aspectFit" />
          </view>
          
        </view>

        <!-- 退出登录按钮 -->
        <view class="logout-container">
          <view class="logout-button" @click="showExitDialog">退出登录</view>
        </view>

      </view>
    </BeaverLayout>

    <!-- 使用新的BeaverDialog组件 -->
    <BeaverDialog
      v-model="showDialog"
      title="确认退出登录"
      :content="`退出后需要重新登录才能使用 ${APP_CONFIG.name} ，确定要退出吗？`"
      type="warning"
      size="medium"
      confirm-text="确认退出"
      cancel-text="取消"
      @confirm="handleLogout"
      @cancel="handleCancel"
    />

    <!-- Toast组件 -->
    <BeaverToast
      v-model="showToast"
      :message="toastMessage"
      :type="toastType"
      position="center"
      :duration="2000"
    />
  </view>
</template>

<script lang="ts">
import { ref } from 'vue';
import { BeaverLayout, BeaverDialog, BeaverToast } from '@/component';
import { APP_CONFIG } from '@/config/data';

export default {
  name: 'Setting',
  components: {
    BeaverLayout,
    BeaverDialog,
    BeaverToast
  },
  setup() {
    const showDialog = ref(false);
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastType = ref<'default' | 'success' | 'warning' | 'error'>('default');

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
        case 4:
          uni.navigateTo({ url: '/pages/update/update' });
          break;
      }
    };

    const showExitDialog = () => {
      showDialog.value = true;
    };

    const handleLogout = () => {
      // 这里应该调用实际的登出逻辑
      // removeLocal('token');
      // initStore.resetApp();
      // WsManager.disconnect();
      
      // 显示成功提示
      toastMessage.value = '已退出登录';
      toastType.value = 'success';
      showToast.value = true;
      
      // 延迟跳转，检查当前页面路径避免重复导航
      setTimeout(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const currentPath = currentPage?.route;
        
        if (currentPath !== 'pages/login/login') {
          uni.reLaunch({ url: '/pages/login/login' });
        }
      }, 1000);
    };

    const handleCancel = () => {
      showDialog.value = false;
    };

    return {
      showDialog,
      showToast,
      toastMessage,
      toastType,
      goBack,
      handleClickItem,
      showExitDialog,
      handleLogout,
      handleCancel,
      APP_CONFIG,
    };
  },
};
</script>

<style lang="scss" scoped>
.setting-page {
  min-height: 100vh;
}

.content {
  padding: 16px;
  max-width: 375px;
  margin: 0 auto;
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
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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