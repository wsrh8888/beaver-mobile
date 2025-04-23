<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ top: statusBarHeight + 'px' }">
      <view class="back-button" @click="goBack">
        <image src="/static/groupList/back.svg" mode="aspectFit" class="back-icon" />
      </view>
      <text class="page-title">我的群聊</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 搜索框 -->
    <view class="search-container" :style="{ top: statusBarHeight + 44 + 'px' }">
      <view class="search-form">
        <image src="/static/groupList/search.svg" mode="aspectFit" class="search-icon" />
        <input type="text" class="search-input" placeholder="搜索群聊" placeholder-class="search-placeholder" />
      </view>
    </view>

    <!-- 群聊列表 -->
    <scroll-view class="group-list" scroll-y :style="{ top: statusBarHeight + 96 + 'px' }">
      <view 
        class="group-item" 
        v-for="item in groupList" 
        :key="item.conversationId"
        @click="handleClickGroup(item)"
      >
        <view class="group-avatar">
          <image :src="item.avatar" mode="aspectFill" />
        </view>
        <view class="group-info">
          <text class="group-name">{{ item.title }}</text>
          <text class="group-message">{{ item.lastMessage || '' }}</text>
          <view class="member-count">
            <image src="/static/groupList/member.svg" mode="aspectFit" class="member-icon" />
            <text>{{ item.memberCount }}人</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 创建群聊按钮 -->
    <view class="fab-button" @click="createGroup">
      <image src="/static/groupList/add.svg" mode="aspectFit" class="add-icon" />
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useGroupStore } from '@/pinia/group/group';
import type { IGroupInfo } from '@/types/ajax/group';

interface GroupInfo extends IGroupInfo {
  lastMessage?: string;
}

export default defineComponent({
  setup() {
    const groupStore = useGroupStore();
    const groupList = computed(() => groupStore.groupList as GroupInfo[]);
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
    const goBack = () => {
      uni.navigateBack();
    };

    const handleClickGroup = (groupInfo: GroupInfo) => {
      uni.navigateTo({
        url: `/pages/chat/chat?id=${groupInfo.conversationId}`,
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    };

    const createGroup = () => {
      uni.navigateTo({
        url: '/pages/createGroup/createGroup',
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    };

    return {
      groupList,
      statusBarHeight,
      goBack,
      handleClickGroup,
      createGroup
    };
  }
});
</script>

<style lang="scss" scoped>
:root {
  /* 色彩系统 */
  --primary: #FF7D45;
  --primary-deep: #E86835;
  --primary-light: #FFE6D9;
  --text-title: #2D3436;
  --text-body: #636E72;
  --text-auxiliary: #B2BEC3;
  --background: #FFFFFF;
  --background-secondary: #F9FAFB;
  --divider: #EBEEF5;
}

.container {
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--background);
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: var(--background);
  border-bottom: 1px solid var(--divider);

  .back-button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;

    .back-icon {
      width: 20px;
      height: 20px;
    }
  }

  .page-title {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-title);
    text-align: center;
  }

  .nav-placeholder {
    width: 24px;
    margin-left: 8px;
  }
}

/* 搜索框 */
.search-container {
  padding: 8px 12px;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 9;
  background-color: var(--background);

  .search-form {
    position: relative;

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
    }

    .search-input {
      width: 100%;
      height: 36px;
      background-color: var(--background-secondary);
      border: none;
      border-radius: 8px;
      padding: 0 12px 0 32px;
      font-size: 14px;
      color: var(--text-title);

      &:focus {
        outline: none;
        box-shadow: 0 0 0 1px rgba(255, 125, 69, 0.1);
      }
    }

    .search-placeholder {
      color: var(--text-auxiliary);
    }
  }
}

/* 群聊列表 */
.group-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 4px 12px;
  background-color: var(--background);
}

.group-item {
  display: flex;
  padding: 12px;
  margin-bottom: 8px;
  background-color: var(--background);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.2s cubic-bezier(0.33, 1, 0.68, 1);
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    background-color: var(--background-secondary);
  }

  .group-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 12px;
    flex-shrink: 0;
    position: relative;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 100%);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    }

    image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative;
    }
  }

  .group-info {
    flex: 1;
    min-width: 0;
    width: 0;
    overflow: hidden;

    .group-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-title);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .group-message {
      font-size: 13px;
      color: var(--text-body);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }

    .member-count {
      font-size: 12px;
      color: var(--text-auxiliary);
      display: flex;
      align-items: center;

      .member-icon {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
    }
  }
}

/* 创建群聊按钮 */
.fab-button {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 100%);
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 125, 69, 0.3);
  z-index: 100;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 4px rgba(255, 125, 69, 0.2);
  }

  .add-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
