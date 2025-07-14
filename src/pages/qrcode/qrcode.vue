<template>
  <BeaverLayout
    title="我的二维码"
    :show-back="true"
    :scrollable="true"
    :scroll-y="true"
    :show-scrollbar="false"
    :show-background="true"
    background-type="gradient"
    :background-height="300"
    @back="goBack"
  >
    <!-- 主要内容 -->
    <view class="content">
      <!-- 二维码卡片 -->
      <view class="qrcode-card">
        <!-- 卡片顶部 -->
        <view class="card-header">
          <view class="user-avatar">
            <text v-if="!userInfo.avatar">{{ getUserInitial() }}</text>
            <image v-else :src="userInfo.avatar" mode="aspectFill" class="avatar-img"></image>
          </view>
          <view class="user-info">
            <view class="user-name">{{ userInfo.nickName || APP_CONFIG.name }}</view>
            <view class="user-id">ID: {{ userInfo.userId || '未设置' }}</view>
          </view>
        </view>
        
        <!-- 卡片主体 -->
        <view class="qrcode-body">
          <view class="qrcode-container">
            <view class="qrcode-wrapper">
              <uv-qrcode 
                ref="qrcode" 
                :loading="false" 
                :value="qrValue" 
                :options="options"
                :canvas-id="qrCanvasId"
                size="200px"
                class="qrcode-instance"
                :id="qrCanvasId"
              ></uv-qrcode>
            </view>
          </view>
        </view>
        
        <!-- 卡片底部 -->
        <view class="card-footer">
          <view class="qrcode-text">扫一扫上面的二维码，添加我为好友</view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions">
        <view class="action-button secondary-button" @click="handleSaveQrcode">
          <image :src="isH5 ? '@/static/img/common/download.svg' : '@/static/img/common/save.svg'" mode="aspectFit" class="button-icon"></image>
          <text>{{ isH5 ? '下载二维码' : '保存到相册' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 底部装饰 -->
    <view class="bottom-decoration"></view>
  </BeaverLayout>
</template>

<script lang="ts">
import { computed, ref, nextTick, getCurrentInstance } from 'vue';
import { useUserStore } from '@/pinia/user/user';
import BeaverLayout from '@/component/layout/layout.vue';
import { APP_CONFIG } from '@/config/data';

export default {
  name: 'Qrcode',
  components: {
    BeaverLayout
  },
  setup() {
    const store = useUserStore();
    const userInfo = computed(() => store.userInfo);
    const qrCanvasId = ref("qrcode-canvas");
    const instance = getCurrentInstance();
    const isH5 = ref(false);
    
    // 获取用户名首字母
    const getUserInitial = () => {
      return userInfo.value?.nickName?.charAt(0)?.toUpperCase() || 'B';
    };
    
    // 判断当前环境
    // #ifdef H5
    isH5.value = true;
    qrCanvasId.value = "h5-qrcode-canvas";
    // #endif
    
    // 设置用户头像作为logo
    nextTick(() => {
      if (userInfo.value && userInfo.value.avatar) {
        options.value.logoImage = userInfo.value.avatar;
        // 强制更新options来触发二维码重新渲染
        options.value = {...options.value};
        console.log('设置logo图片:', userInfo.value.avatar);
      }
    });
    
    // 导航返回
    const goBack = () => {
      uni.navigateBack();
    };
    
    // 二维码设置
    const options = ref({
      margin: 10,
      foreground: "#2D3436",
      background: "#ffffff",
      colorDark: "#2D3436",
      colorLight: "#ffffff",
      correctLevel: 3,
      backgroundImage: "",
      backgroundDimming: "rgba(0,0,0,0)",
      logoImage: "",
      logoWidth: 80,
      logoHeight: 80,
      logoBackgroundColor: '#ffffff',
      logoCornerRadius: 20,
      logoBorderWidth: 6,
      logoBorderColor: '#ffffff'
    });
    console.error('二维码设置:', userInfo.value);
    // 将对象转换为JSON字符串作为二维码值
    const qrValue = ref(JSON.stringify({
      type: "addFriend",
      query: `id=${userInfo.value.userId || ''}`,
      name: APP_CONFIG.name
    }));
    
    // H5环境下载图片
    const downloadImage = (base64Data: string) => {
      try {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = `${APP_CONFIG.name}-qrcode-${userInfo.value.userId || 'friend'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        uni.showToast({
          title: '图片已准备下载',
          icon: 'success',
          duration: 2000
        });
      } catch (error) {
        console.error('下载图片失败:', error);
        uni.showToast({
          title: '下载失败，请截图保存',
          icon: 'none',
          duration: 2000
        });
      }
    };
    
        // 保存二维码图片
    const handleSaveQrcode = () => {
      try {
        // 获取二维码组件引用
        const qrCodeComponent = instance?.proxy?.$refs.qrcode;
        if (!qrCodeComponent) {
          uni.showToast({
            title: '二维码组件未找到',
            icon: 'error',
            duration: 2000
          });
          return;
        }
        
        uni.showLoading({
          title: isH5.value ? '准备下载...' : '正在保存...'
        });
        
        // 使用二维码组件自带的save方法
        qrCodeComponent.save({
          success: () => {
            uni.hideLoading();
            uni.showToast({
              title: isH5.value ? '下载成功' : '已保存到相册',
              icon: 'success',
              duration: 2000
            });
          },
          fail: (err) => {
            uni.hideLoading();
            console.error('保存失败:', err);
            
            // 处理权限被拒绝的情况
            if (err.errMsg && (err.errMsg.indexOf('auth deny') >= 0 || err.errMsg.indexOf('authorize') >= 0)) {
              uni.showModal({
                title: '保存失败',
                content: '需要授权相册权限',
                confirmText: '去设置',
                cancelText: '取消',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting();
                  }
                }
              });
            } else {
              uni.showToast({
                title: '保存失败',
                icon: 'error',
                duration: 2000
              });
            }
          }
        });
      } catch (error) {
        uni.hideLoading();
        console.error('保存过程出错:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'error',
          duration: 2000
        });
      }
    };

    return {
      userInfo,
      goBack,
      options,
      qrValue,
      qrCanvasId,
      handleSaveQrcode,
      isH5,
      getUserInitial,
      APP_CONFIG
    };
  }
};
</script>

<style lang="scss" scoped>
.safe-area {
  height: 32rpx;
}

/* 覆盖 BeaverLayout 的背景为橙色渐变 */
:deep(.background-layer.gradient) {
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%) !important;
}

/* 移除 header 的边框 */
:deep(.header-content) {
  border-bottom: none !important;
}

/* 基础样式 */
.container {
  min-height: 100vh;
  color: #2D3436;
  position: relative;
  font-size: 28rpx;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.navbar {
  height: 44px;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
  color: white;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
  filter: invert(1); /* 使SVG变成白色 */
}

.back-button:active {
  transform: translateY(-50%) scale(0.96);
  background: rgba(255, 255, 255, 0.25);
}

/* 页面标题 */
.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: white;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 32rpx 32rpx 64rpx; /* 顶部减少内边距，底部增加 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 112rpx); /* 减去navbar的高度 */
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);

}

/* 二维码卡片 */
.qrcode-card {
  width: 100%;
  background: white;
  border-radius: 48rpx;
  box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 60rpx; /* 增加卡片底部边距 */
}

/* 卡片顶部区域 */
.card-header {
  padding: 48rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

/* 用户头像 */
.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 32rpx;
  background: rgba(255, 125, 69, 0.1);
  color: #FF7D45;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 20rpx rgba(255, 125, 69, 0.15);
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

/* 头像内部高光 */
.user-avatar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
}

/* 用户信息区 */
.user-info {
  margin-left: 32rpx;
}

/* 用户名称 */
.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8rpx;
}

/* 用户ID */
.user-id {
  font-size: 20rpx;
  color: #636E72;
}

/* 二维码主体区域 */
.qrcode-body {
  padding: 32rpx 54rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FAFAFA;
}

/* 二维码容器 */
.qrcode-container {
  width: 400rpx;
  height: 400rpx;
  background: white;
  border-radius: 32rpx;
  padding: 32rpx;
  position: relative;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.08);
}

/* 二维码包装器 */
.qrcode-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 二维码实例 */
.qrcode-instance {
  width: 100%;
  height: 100%;
}

/* 卡片底部区域 */
.card-footer {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

/* 二维码提示文字 */
.qrcode-text {
  font-size: 28rpx;
  color: #636E72;
  text-align: center;
}

/* 操作按钮区域 */
.actions {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20rpx; /* 调整按钮与卡片之间的距离 */
  margin-bottom: 40rpx; /* 确保底部有足够间距 */
}

/* 按钮样式 */
.action-button {
  width: 80%;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 28rpx;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.button-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

/* 次要按钮 */
.secondary-button {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.secondary-button .button-icon {
  filter: invert(1); /* 将图标转为白色 */
}

.secondary-button:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.35);
}

/* 底部装饰 */
.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200rpx;
  background: rgba(0, 0, 0, 0.1);
  clip-path: ellipse(70% 60% at 50% 100%);
  z-index: 0;
  pointer-events: none;
}
</style>
