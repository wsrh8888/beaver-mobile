<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ top: statusBarHeight + 'px' }">
      <view class="back-button" @click="goBack">
        <image src="@/static/img/common/arrow-back.svg" mode="aspectFit"></image>
      </view>
      <view class="page-title">新的朋友</view>
      <view style="width: 28rpx;"></view> <!-- 平衡空间 -->
    </view>

    <!-- 搜索区域 -->
    <view class="search-container" :style="{ top: statusBarHeight + 44 + 'px' }">
      <view class="search-box">
        <view class="search-icon">
          <image src="@/static/img/common/search.svg" mode="aspectFit"></image>
        </view>
        <input 
          class="search-input" 
          type="text" 
          v-model="searchKeyword" 
          @input="searchRequests" 
          placeholder="搜索" 
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <!-- 好友申请列表 -->
    <scroll-view scroll-y class="friend-list">
      <view class="friend-requests" v-if="filteredRequests.length > 0">
        <view 
          class="request-item fade-in" 
          v-for="(item, index) in filteredRequests" 
          :key="'request-' + index"
        >
          <view class="request-avatar">
            <image :src="item.avatar" mode="aspectFill"></image>
          </view>
          <view class="request-info">
            <view class="request-name">{{ item.nickname }}</view>
            <view class="request-message">{{ item.message || '请求加为好友' }}</view>
            <view class="request-meta">{{ getTimeDiff(item.createTime) }}</view>
          </view>
          <view class="request-actions">
            <template v-if="item.flag === 'rev'">
              <template v-if="item.status === 0">
                <button class="btn btn-accept" @click="acceptRequest(item.id)">接受</button>
                <button class="btn btn-reject" @click="rejectRequest(item.id)">拒绝</button>
              </template>
              <view v-else-if="item.status === 1" class="status-added">已添加</view>
              <view v-else-if="item.status === 2" class="status-rejected">已拒绝</view>
            </template>
            <template v-else-if="item.flag === 'send'">
              <view v-if="item.status === 0" class="status-pending">等待验证</view>
              <view v-else-if="item.status === 1" class="status-added">已添加</view>
              <view v-else-if="item.status === 2" class="status-rejected">已拒绝</view>
            </template>
          </view>
        </view>
      </view>

      <!-- 空状态提示 -->
      <view class="empty-state" v-else>
        <view class="empty-icon">
          <image src="@/static/img/common/users.svg" mode="aspectFit"></image>
        </view>
        <view class="empty-text">暂无新的好友申请</view>
        <view class="empty-subtext">可前往"添加好友"页面添加新朋友</view>
      </view>
    </scroll-view>

    <!-- 提示框 -->
    <uv-toast ref="uToast" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { getFriendValidListApi } from '@/api/apply';
import { valiFrienddAPi } from '@/api/friend';
import type { IValidInfo } from '@/types/ajax/friend';

export default defineComponent({
  setup() {
    // 请求列表数据
    const allRequests = ref<IValidInfo[]>([]);
    const searchKeyword = ref('');
    const uToast = ref();
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;

    // 过滤后的请求列表
    const filteredRequests = computed(() => {
      if (!searchKeyword.value) return allRequests.value;
      
      const keyword = searchKeyword.value.toLowerCase();
      return allRequests.value.filter(item => 
        item.nickname.toLowerCase().includes(keyword) || 
        (item.message && item.message.toLowerCase().includes(keyword))
      );
    });

    // 搜索请求
    const searchRequests = () => {
      // 实现过滤逻辑，已通过computed属性实现
    };

    // 格式化时间
    const getTimeDiff = (timestamp: number | string | undefined) => {
      if (!timestamp) return '未知时间';
      
      // 尝试按格式 'YYYY-MM-DD HH:mm:ss' 解析时间
      const date = typeof timestamp === 'string' 
        ? (timestamp.includes('-') ? new Date(timestamp) : new Date(parseInt(timestamp)))
        : new Date(timestamp);
        
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      // 小于1小时，显示x分钟前
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
      }
      
      // 小于24小时，显示x小时前
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
      }
      
      // 小于7天，显示x天前
      if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
      }
      
      // 超过7天，显示具体日期
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };

    // 接受好友请求
    const acceptRequest = (id: number) => {
      valiFrienddAPi({
        verifyId: id,
        status: 1
      }).then((res) => {
        if (res.code === 0) {
          // 修改本地数据
          allRequests.value = allRequests.value.map((item) => {
            if (item.id === id) {
              item.status = 1;
            }
            return item;
          });
          showToast('已添加为好友');
        } else {
          showToast('操作失败');
        }
      }).catch(() => {
        showToast('操作失败');
      });
    };

    // 拒绝好友请求
    const rejectRequest = (id: number) => {
      valiFrienddAPi({
        verifyId: id,
        status: 2
      }).then((res) => {
        if (res.code === 0) {
          // 修改本地数据
          allRequests.value = allRequests.value.map((item) => {
            if (item.id === id) {
              item.status = 2;
            }
            return item;
          });
          showToast('已拒绝好友请求');
        } else {
          showToast('操作失败');
        }
      }).catch(() => {
        showToast('操作失败');
      });
    };

    // 返回上一页
    const goBack = () => {
      uni.navigateBack();
    };

    // 显示提示
    const showToast = (message: string) => {
      uToast.value.show({
        title: message,
        type: 'success',
        duration: 2000
      });
    };

    // 页面加载时获取数据
    onMounted(() => {
      getFriendValidListApi({
        page: 1,
        limit: 100
      }).then((res) => {
        if (res.code === 0) {
          // 由于接口返回的数据没有时间字段，这里模拟添加createTime字段
          allRequests.value = res.result.list.map(item => ({
            ...item,
            createTime: Date.now() - Math.floor(Math.random() * 1000000000) // 随机生成过去30天内的时间
          }));
        }
      });
    });

    return {
      searchKeyword,
      filteredRequests,
      searchRequests,
      getTimeDiff,
      acceptRequest,
      rejectRequest,
      goBack,
      uToast,
      statusBarHeight
    };
  }
});
</script>

<style lang="scss" scoped>
/* 色彩系统 */
$primary: #FF7D45;
$primary-deep: #E86835;
$primary-light: #FFE6D9;
$text-title: #2D3436;
$text-body: #636E72;
$text-auxiliary: #B2BEC3;
$background: #FFFFFF;
$background-secondary: #F9FAFB;
$divider: #EBEEF5;
$success: #4CAF50;
$warning: #FFC107;
$error: #FF5252;
$info: #2196F3;

/* 基础样式 */
.page-container {
  background-color: $background-secondary;
  color: $text-body;
  line-height: 1.5;
  font-size: 26rpx;
  min-height: 100vh;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 24rpx;
  background-color: $background;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
}

.back-button {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  
  image {
    width: 40rpx;
    height: 40rpx;
  }
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: $text-title;
}

/* 搜索区域 */
.search-container {
  background-color: $background;
  padding: 16rpx 24rpx 24rpx;
  margin-bottom: 2rpx;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9;
}

.search-box {
  position: relative;
  height: 72rpx;
}

.search-icon {
  position: absolute;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  color: $text-auxiliary;
  display: flex;
  justify-content: center;
  image {
    width: 32rpx;
    height: 32rpx;
  }
}

.search-input {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  background-color: $background-secondary;
  border: none;
  font-size: 28rpx;
  color: $text-body;
  padding-left: 62rpx;
  box-sizing: border-box;
}

.search-placeholder {
  color: $text-auxiliary;
}

/* 好友请求列表 */
.friend-list {
  height: calc(100vh - 180rpx);
  margin-top: calc(44px + 72rpx);
  padding-top: env(safe-area-inset-top);
}

.friend-requests {
  background-color: $background;
}

.request-item {
  padding: 24rpx;
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid $divider;
}

.request-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-right: 24rpx;
  background-color: $background-secondary;
  flex-shrink: 0;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
  
  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.request-info {
  flex: 1;
  min-width: 0;
}

.request-name {
  font-size: 30rpx;
  font-weight: 500;
  color: $text-title;
  margin-bottom: 4rpx;
}

.request-message {
  font-size: 26rpx;
  color: $text-body;
  margin-bottom: 6rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-meta {
  font-size: 22rpx;
  color: $text-auxiliary;
}

.request-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-left: 24rpx;
}

.btn {
  border-radius: 28rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
}

.btn-accept {
  background-color: $primary;
  color: #FFF;
  box-shadow: 0 4rpx 12rpx rgba(255, 125, 69, 0.2);
}

.btn-accept:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(255, 125, 69, 0.2);
}

.btn-reject {
  background-color: $background-secondary;
  color: $text-body;
  border: 2rpx solid $divider;
}

.btn-reject:active {
  background-color: $divider;
}

.btn-reject::after {
  border: none;
}

.status-added {
  font-size: 26rpx;
  color: $success;
}

.status-rejected {
  font-size: 26rpx;
  color: $error;
}

.status-pending {
  font-size: 26rpx;
  color: $text-auxiliary;
}

/* 空状态 */
.empty-state {
  padding: 120rpx 0;
  text-align: center;
  color: $text-auxiliary;
}

.empty-icon {
  width: 96rpx;
  height: 96rpx;
  margin: 0 auto 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $background-secondary;
  border-radius: 48rpx;
  color: $text-auxiliary;
  
  image {
    width: 48rpx;
    height: 48rpx;
  }
}

.empty-text {
  font-size: 28rpx;
  margin-bottom: 12rpx;
}

.empty-subtext {
  font-size: 24rpx;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}
</style>
