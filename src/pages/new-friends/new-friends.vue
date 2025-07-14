<template>
  <BeaverLayout
    title="新的朋友"
    :show-back="true"
    :scrollable="true"
    :scroll-y="true"
    :show-scrollbar="false"
    @back="goBack"
  >
    <!-- 分类标签 -->
    <view class="tabs-section">
      <view class="tabs-container">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'received' }"
          @click="switchTab('received')"
        >
          <text class="tab-text">收到的申请</text>
          <view class="tab-badge" v-if="receivedCount > 0">{{ receivedCount }}</view>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'sent' }"
          @click="switchTab('sent')"
        >
          <text class="tab-text">发出的申请</text>
        </view>
      </view>
    </view>

    <!-- 好友申请列表 -->
    <view class="requests-list" v-if="filteredRequests.length > 0">
      <view 
        class="request-item" 
        v-for="(item, index) in filteredRequests" 
        :key="'request-' + index"
        :class="{ 'fade-in': true }"
        :style="{ animationDelay: index * 0.05 + 's' }"
      >
        <view class="request-avatar">
          <image :src="getAvatarUrl(item.avatar)" mode="aspectFill"></image>
        </view>
        <view class="request-content">
          <view class="request-name">{{ item.nickname }}</view>
          <view class="request-message">{{ item.message || '请求加为好友' }}</view>
          <view class="request-meta">{{ item.createTime }}</view>
        </view>
        <view class="request-actions">
          <template v-if="item.flag === 'receive'">
            <template v-if="item.status === 0">
              <view class="btn btn-accept" @click="acceptRequest(item.id)">
                <text class="btn-text">接受</text>
              </view>
              <view class="btn btn-reject" @click="rejectRequest(item.id)">
                <text class="btn-text">拒绝</text>
              </view>
            </template>
            <view v-else-if="item.status === 1" class="status-badge success">
              <image src="@/static/img/new-friend/check-circle.svg" mode="aspectFit"></image>
              <text class="status-text">已添加</text>
            </view>
            <view v-else-if="item.status === 2" class="status-badge rejected">
              <image src="@/static/img/new-friend/close-circle.svg" mode="aspectFit"></image>
              <text class="status-text">已拒绝</text>
            </view>
          </template>
          <template v-else-if="item.flag === 'send'">
            <view v-if="item.status === 0" class="status-badge pending">
              <image src="@/static/img/new-friend/clock.svg" mode="aspectFit"></image>
              <text class="status-text">等待验证</text>
            </view>
            <view v-else-if="item.status === 1" class="status-badge success">
              <image src="@/static/img/new-friend/check-circle.svg" mode="aspectFit"></image>
              <text class="status-text">已添加</text>
            </view>
            <view v-else-if="item.status === 2" class="status-badge rejected">
              <image src="@/static/img/new-friend/close-circle.svg" mode="aspectFit"></image>
              <text class="status-text">已拒绝</text>
            </view>
          </template>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <view class="empty-illustration">
        <image src="@/static/img/new-friend/empty-friends.svg" mode="aspectFit"></image>
      </view>
      <view class="empty-content">
        <text class="empty-title">暂无{{ activeTab === 'received' ? '收到' : '发出' }}的好友申请</text>
        <text class="empty-subtitle">
          {{ activeTab === 'received' ? '当有人申请加你为好友时，会在这里显示' : '你发出的好友申请会在这里显示状态' }}
        </text>
      </view>
    </view>

    <!-- 提示框 -->
    <uv-toast ref="uToast" />
  </BeaverLayout>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { getFriendValidListApi } from '@/api/apply';
import { valiFrienddAPi } from '@/api/friend';
import { previewOnlineFileApi } from '@/api/file';
import type { IValidInfo } from '@/types/ajax/friend';
import BeaverLayout from '@/component/layout/layout.vue';

export default {
  components: {
    BeaverLayout
  },
  setup() {
    // 响应式数据
    const allRequests = ref<IValidInfo[]>([]);
    const searchKeyword = ref('');
    const activeTab = ref('received');
    const uToast = ref();

    // 计算属性
    const filteredRequests = computed(() => {
      let requests = allRequests.value.filter(item => {
        if (activeTab.value === 'received') {
          return item.flag === 'receive';
        } else {
          return item.flag === 'send';
        }
      });

      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        requests = requests.filter(item => 
          item.nickname.toLowerCase().includes(keyword) || 
          (item.message && item.message.toLowerCase().includes(keyword))
        );
      }

      return requests;
    });

    const receivedCount = computed(() => {
      return allRequests.value.filter(item => 
        item.flag === 'receive' && item.status === 0
      ).length;
    });

    // 方法
    const searchRequests = () => {
      // 搜索逻辑已通过computed实现
    };

    const switchTab = (tab: string) => {
      activeTab.value = tab;
    };

    const getAvatarUrl = (avatar: string) => {
      return previewOnlineFileApi(avatar);
    };

    const getStatusIcon = (status: number) => {
      switch (status) {
        case 1:
          return '@/static/img/new-friend/check-circle.svg';
        case 2:
          return '@/static/img/new-friend/close-circle.svg';
        default:
          return '@/static/img/new-friend/clock.svg';
      }
    };

    const acceptRequest = (id: number) => {
      valiFrienddAPi({
        verifyId: id,
        status: 1
      }).then((res) => {
        if (res.code === 0) {
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

    const rejectRequest = (id: number) => {
      valiFrienddAPi({
        verifyId: id,
        status: 2
      }).then((res) => {
        if (res.code === 0) {
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

    const goBack = () => {
      uni.navigateBack();
    };

    const showToast = (message: string) => {
      uToast.value?.show({
        title: message,
        type: 'success',
        duration: 2000
      });
    };

    // 页面加载时获取数据
    getFriendValidListApi({
      page: 1,
      limit: 100
    }).then((res) => {
      if (res.code === 0) {
        allRequests.value = res.result.list.map(item => ({
          ...item,
          createTime: Date.now() - Math.floor(Math.random() * 1000000000)
        }));
      }
    });

    return {
      searchKeyword,
      filteredRequests,
      activeTab,
      receivedCount,
      searchRequests,
      switchTab,
      getAvatarUrl,
      getStatusIcon,
      acceptRequest,
      rejectRequest,
      goBack,
      uToast
    };
  }
};
</script>

<style scoped>
/* 标签页区域 */
.tabs-section {
  background: #FFFFFF;
  border-bottom: 1px solid #EBEEF5;
  position: relative;
  z-index: 10;
  margin-bottom: 12px;
}

.tabs-container {
  display: flex;
  padding: 0 16px;
  max-width: 375px;
  margin: 0 auto;
}

.tab-item {
  position: relative;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #636E72;
  font-weight: 500;
}

.tab-item.active {
  color: #FF7D45;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #FF7D45, #E86835);
  border-radius: 2px;
}

.tab-badge {
  margin-left: 8px;
  background: linear-gradient(135deg, #FF5252, #E53935);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 82, 82, 0.3);
}

/* 好友申请列表 */
.requests-list {
  background: #FFFFFF;
  margin: 0 16px 12px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.request-item {
  padding: 16px;
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #FFFFFF;
}

.request-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 80px;
  right: 16px;
  bottom: 0;
  height: 0.5px;
  background-color: #F0F2F5;
}

.request-item:active {
  background-color: #F9FAFB;
  transform: scale(0.98);
}

.request-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  margin-right: 16px;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(255, 125, 69, 0.2);
}

.request-avatar image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-icon {
  width: 16px;
  height: 16px;
}

.request-content {
  flex: 1;
  min-width: 0;
}

.request-name {
  font-size: 15px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
  line-height: 1.3;
}

.request-message {
  font-size: 13px;
  color: #636E72;
  margin-bottom: 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-meta {
  font-size: 11px;
  color: #B2BEC3;
}

.request-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 16px;
}

.btn {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-accept {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: #FFF;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-accept:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  opacity: 0.8;
}

.btn-reject {
  background: rgba(255, 255, 255, 0.9);
  color: #636E72;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-reject:active {
  background: rgba(255, 255, 255, 1);
  transform: scale(0.95);
  opacity: 0.8;
}

.btn-text {
  font-weight: 600;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-badge.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-badge.rejected {
  background: rgba(255, 82, 82, 0.1);
  color: #FF5252;
}

.status-badge.pending {
  background: rgba(178, 190, 195, 0.1);
  color: #B2BEC3;
}

.status-badge image {
  width: 18px;
  height: 18px;
}

.status-text {
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  padding: 80px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.empty-illustration image {
  width: 60px;
  height: 60px;
}

.empty-content {
  text-align: center;
}

.empty-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
}

.empty-subtitle {
  display: block;
  font-size: 13px;
  color: #636E72;
  line-height: 1.5;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease forwards;
}
</style>
