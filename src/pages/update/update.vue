<template>
  <BeaverLayout
    title="检查更新"
    :show-back="true"
    :scrollable="true"
    :scroll-y="true"
    :show-scrollbar="false"
    @back="goBack"
  >
    <view class="content">
      <!-- 应用信息卡片 -->
      <view class="app-card">
        <view class="app-icon-wrapper">
          <image :src="APP_CONFIG.logo" mode="aspectFit" class="app-icon"></image>
        </view>
        <text class="app-name">{{ APP_CONFIG.name }}</text>
        <text class="app-version">当前版本 {{ currentVersion }}</text>
      </view>
      
      <!-- 检查更新按钮 -->
      <view class="check-update-section">
        <button 
          class="check-update-btn" 
          :class="{ 'checking': updateStore.isChecking }"
          :disabled="updateStore.isChecking"
          @click="openUpdateModal"
        >
          <view v-if="updateStore.isChecking" class="loading-text">
            <text class="loading-icon">⟳</text>
            检查中...
          </view>
          <view v-else class="btn-content">
            <text>检查更新</text>
          </view>
        </button>
        
        <text v-if="updateStore.lastCheckTime" class="last-check-time">
          上次检查：{{ formatLastCheckTime() }}
        </text>
      </view>
    </view>

    <!-- 更新弹窗 -->
    <view v-if="showUpdateModal" class="modal-overlay" @click="closeUpdateModal">
      <view class="modal-content" @click.stop>
        <!-- 检查中状态 -->
        <view v-if="updateStore.isChecking" class="checking-status">
          <view class="checking-icon">
            <text class="loading-icon">⟳</text>
          </view>
          <text class="checking-title">正在检查更新...</text>
          <text class="checking-desc">请稍候，正在获取最新版本信息</text>
        </view>
        
        <!-- 有更新 -->
        <view v-else-if="updateStore.hasUpdate" class="has-update">
          <view class="update-header">
            <text class="update-title">发现新版本</text>
            <view class="new-version">v{{ updateStore.latestVersion && updateStore.latestVersion.version }}</view>
          </view>
          <view class="update-details">
            <view class="detail-item">
              <text class="detail-label">版本号：</text>
              <text class="detail-value">{{ updateStore.latestVersion && updateStore.latestVersion.version }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">文件大小：</text>
              <text class="detail-value">{{ updateStore.formattedSize }}</text>
            </view>
          </view>
          <!-- 更新日志 -->
          <view v-if="updateStore.latestVersion && updateStore.latestVersion.releaseNotes" class="release-notes">
            <text class="release-notes-title">更新内容</text>
            <text class="release-notes-content">{{ updateStore.latestVersion.releaseNotes }}</text>
          </view>
          <!-- 下载进度 -->
          <view v-if="updateStore.isDownloading" class="download-progress">
            <view class="progress-bar">
              <view 
                class="progress-fill" 
                :style="{ width: updateStore.downloadProgress + '%' }"
              ></view>
            </view>
            <text class="progress-text">下载中 {{ updateStore.downloadProgress }}%</text>
          </view>
          <!-- 操作按钮 -->
          <view class="action-buttons">
            <view 
              v-if="!updateStore.isDownloading"
              class="modal-btn primary" 
              @click="handleDownloadUpdate"
            >
              <image src="@/static/img/update/download-icon.svg" mode="aspectFit" class="download-icon"></image>
              立即更新
            </view>
            <view class="modal-btn" @click="closeUpdateModal">
              稍后再说
            </view>
          </view>
        </view>
        <!-- 无更新 -->
        <view v-else class="no-update">
          <view class="no-update-icon">
            <image src="@/static/img/update/check-icon.svg" mode="aspectFit" class="success-icon"></image>
          </view>
          <text class="no-update-title">已是最新版本</text>
          <text class="no-update-desc">您当前使用的是最新版本，无需更新</text>
          <view class="modal-btn primary" @click="closeUpdateModal">
            确定
          </view>
        </view>
      </view>
    </view>
  </BeaverLayout>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useUpdateStore } from '@/pinia/update/update';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentVersion } from '@/utils/update/update';
import BeaverLayout from '@/component/layout/layout.vue';
import { APP_CONFIG } from '../../config/data';

export default {
  components: {
    BeaverLayout
  },
  setup() {
    const showUpdateModal = ref(false);
    
    // 获取设备ID
    const getDeviceId = (): string => {
      let deviceId = uni.getStorageSync('uni_device_id');
      if (!deviceId) {
        deviceId = uuidv4();
        uni.setStorageSync('uni_device_id', deviceId);
      }
      return deviceId;
    };

    // 使用工具函数获取版本号
    const getAppVersion = (): string => {
      return getCurrentVersion();
    };

    const updateStore = useUpdateStore();
    const currentVersion = ref(getAppVersion());

    // 返回上一页
    const goBack = () => {
      uni.navigateBack();
    };

    // 打开弹窗并检查更新
    const openUpdateModal = async () => {
      showUpdateModal.value = true;
      await updateStore.checkUpdate();
    };

    // 关闭弹窗
    const closeUpdateModal = () => {
      showUpdateModal.value = false;
      updateStore.reset();
    };

    // 下载更新
    const handleDownloadUpdate = async () => {
      try {
        const success = await updateStore.downloadUpdate();
        if (!success) {
          uni.showToast({
            title: '下载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '下载失败',
          icon: 'none'
        });
      }
    };

    // 稍后再说
    const handleLater = () => {
      closeUpdateModal();
    };

    // 格式化最后检查时间
    const formatLastCheckTime = () => {
      if (!updateStore.lastCheckTime) return '';
      
      const now = new Date();
      const lastCheck = new Date(updateStore.lastCheckTime);
      const diffInMinutes = Math.floor((now.getTime() - lastCheck.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return '刚刚';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}小时前`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days}天前`;
      }
    };

    return {
      showUpdateModal,
      currentVersion,
      updateStore,
      APP_CONFIG,
      goBack,
      openUpdateModal,
      closeUpdateModal,
      handleDownloadUpdate,
      handleLater,
      formatLastCheckTime
    };
  }
};
</script>

<style lang="scss" scoped>
/* 内容区域 */
.content {
  padding: 24px;
}

/* 应用信息卡片 */
.app-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.app-icon-wrapper {
  width: 160rpx;
  height: 160rpx;
  margin: 0 auto 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-icon {
  width: 160rpx;
  height: 160rpx;
}

.app-name {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
}

.app-version {
  display: block;
  font-size: 14px;
  color: #636E72;
}

/* 检查更新区域 */
.check-update-section {
  text-align: center;
}

.check-update-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(255, 125, 69, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(255, 125, 69, 0.2);
  }

  &.checking {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-icon {
  width: 20px;
  height: 20px;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-icon {
  font-size: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.last-check-time {
  font-size: 12px;
  color: #B2BEC3;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 检查中状态 */
.checking-status {
  text-align: center;
}

.checking-icon {
  margin-bottom: 16px;
}

.checking-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
}

.checking-desc {
  display: block;
  font-size: 14px;
  color: #636E72;
}

/* 有更新状态 */
.has-update {
  text-align: center;
}

.update-header {
  margin-bottom: 24px;
}

.update-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
}

.new-version {
  font-size: 14px;
  color: #FF7D45;
  font-weight: 500;
}

.update-details {
  margin-bottom: 20px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-label {
  color: #636E72;
}

.detail-value {
  color: #2D3436;
  font-weight: 500;
}

.release-notes {
  margin-bottom: 24px;
  text-align: left;
}

.release-notes-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
}

.release-notes-content {
  display: block;
  font-size: 13px;
  color: #636E72;
  line-height: 1.5;
}

.download-progress {
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #F0F2F5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF7D45 0%, #E86835 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #636E72;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  height: 40px;
  border: 1px solid #EBEEF5;
  border-radius: 20px;
  background: white;
  color: #636E72;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  &.primary {
    background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
    color: white;
    border: none;
  }
}

.download-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

/* 无更新状态 */
.no-update {
  text-align: center;
}

.no-update-icon {
  margin-bottom: 16px;
}

.success-icon {
  width: 48px;
  height: 48px;
  color: #4CAF50;
}

.no-update-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
}

.no-update-desc {
  display: block;
  font-size: 14px;
  color: #636E72;
  margin-bottom: 24px;
}
</style> 