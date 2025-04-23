<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header" :style="{ top: statusBarHeight + 'px' }">
      <text class="header-title">好友</text>
      <view class="header-icon" @click="showDropdown = !showDropdown">
        <image src="@/static/img/friend/plus-icon.svg" mode="aspectFit" class="icon-img" />
      </view>
    </view>
    
    <!-- 下拉菜单 -->
    <view class="dropdown" :class="{ 'show': showDropdown }" :style="{ top: (statusBarHeight + 56) + 'px' }">
      <view class="dropdown-item" @click="navigateTo('/pages/createGroup/createGroup')">
        <view class="dropdown-icon">
          <image src="@/static/img/friend/dropdown-group-icon.svg" mode="aspectFit" class="icon-img" />
        </view>
        <text>发起群聊</text>
      </view>
      <view class="dropdown-item" @click="navigateTo('/pages/searchFriend/searchFriend')">
        <view class="dropdown-icon">
          <image src="@/static/img/friend/add-friend-icon.svg" mode="aspectFit" class="icon-img" />
        </view>
        <text>添加好友</text>
      </view>
      <view class="dropdown-item" @click="scanCode">
        <view class="dropdown-icon">
          <image src="@/static/img/friend/scan-icon.svg" mode="aspectFit" class="icon-img" />
        </view>
        <text>扫一扫</text>
      </view>
    </view>
    
    <!-- 遮罩层 -->
    <view class="mask" :class="{ 'show': showDropdown }" @click="showDropdown = false"></view>
    
    <!-- 索引栏 -->
    <view class="index-bar">
      <view 
        v-for="(item, index) in indexList" 
        :key="index" 
        class="index-item" 
        :class="{ 'active': currentIndex === item }"
        @click="scrollToSection(item)"
      >
        {{ item }}
      </view>
    </view>
    
    <!-- 内容区域 -->
    <scroll-view 
      scroll-y 
      class="content"
      :style="{ top: statusBarHeight + 56 + 'px' }"
      :scroll-into-view="'section-' + currentIndex"
      @scroll="onScroll"
    >
      <!-- 搜索栏 -->
      <view class="search-wrapper">
        <view class="search-bar" @click="navigateTo('/pages/searchFriend/searchFriend')">
          <view class="search-icon">
            <image src="@/static/img/friend/search-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <text class="search-placeholder">搜索好友</text>
        </view>
      </view>
      
      <!-- 快捷操作区 -->
      <view class="quick-actions">
        <view class="quick-action-item" @click="navigateTo('/pages/new-friends/new-friends')">
          <view class="action-icon">
            <image src="@/static/img/friend/add-friend-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <text class="action-label">新朋友</text>
        </view>
        <view class="quick-action-item" @click="navigateTo('/pages/groupList/groupList')">
          <view class="action-icon">
            <image src="@/static/img/friend/dropdown-group-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <text class="action-label">群聊</text>
        </view>
        <view class="quick-action-item" @click="navigateTo('/pages/ai/ai')">
          <view class="action-icon">
            <image src="@/static/img/friend/ai-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <text class="action-label">AI</text>
        </view>
      </view>
      
      <!-- 好友列表区域 -->
      <view class="friend-list-container">
        <!-- 根据分组动态渲染好友列表 -->
        <view 
          v-for="(friends, letter) in friendsGroupedByLetter" 
          :key="letter"
          class="friend-section" 
          :id="'section-' + letter"
        >
          <view class="section-header">
            <view class="section-title">{{ letter }}</view>
            <view class="section-count">{{ friends.length }}</view>
          </view>
          <view class="friend-list">
            <view 
              v-for="(friend, index) in friends" 
              :key="friend.userId"
              class="friend-item" 
              @click="handlecreateConversation(friend)"
            >
              <view 
                class="avatar"
              >
                <image 
                  v-if="friend.avatar" 
                  :src="previewOnlineFileApi(friend.avatar)" 
                  mode="aspectFill" 
                  class="avatar-img" 
                />
                <text v-else>{{ friend.nickname.charAt(0).toUpperCase() }}</text>
              </view>
              <view class="friend-content">
                <view class="friend-name">{{ friend.nickname }}</view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 底部标签栏占位 -->
        <view class="tabbar-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useFriendStore } from '@/pinia/friend/friend';
import { previewOnlineFileApi } from "@/api/file";

export default defineComponent({
  setup() {
    const showDropdown = ref(false);
    const currentIndex = ref('A');
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
    
    // 使用Friend Store
    const friendStore = useFriendStore();
    
    // 使用computed获取好友列表
    const friendList = computed(() => friendStore.friendList);
    
    // 动态计算索引列表
    const indexList = computed(() => {
      const letters = ['↑'];
      console.error('213123', friendList.value)
      // 从好友列表中获取所有的首字母并去重
      const uniqueLetters = [...new Set(
        friendList.value.map(friend => {
          // 获取名称的首字母并转为大写
          const firstChar = friend.nickname.charAt(0).toUpperCase();
          // 判断是否为英文字母
          return /[A-Z]/.test(firstChar) ? firstChar : '#';
        })
      )].sort();
      
      return [...letters, ...uniqueLetters];
    });
    
    // 按字母分组好友
    const friendsGroupedByLetter = computed(() => {
      const groups: Record<string, any[]> = {};
      
      // 初始化索引中的所有分组
      indexList.value.forEach(letter => {
        if (letter !== '↑') {
          groups[letter] = [];
        }
      });
      
      // 将好友分到对应的组
      friendList.value.forEach(friend => {
        const firstChar = friend.nickname.charAt(0).toUpperCase();
        const group = /[A-Z]/.test(firstChar) ? firstChar : '#';
        
        if (groups[group]) {
          groups[group].push(friend);
        }
      });
      
      return groups;
    });
    
    // 滚动事件处理
    const onScroll = (e: any) => {
      // 获取当前可见区域，决定当前高亮索引
      const scrollTop = e.detail.scrollTop;
      // 这里可以实现根据滚动位置更新当前索引
    };
    
    // 滚动到指定索引区域
    const scrollToSection = (index: string) => {
      currentIndex.value = index;
      
      if (index === '↑') {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 300
        });
      }
    };

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

    // 点击好友项创建会话
    const handlecreateConversation = (friend: any) => {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${friend.userId}`,
        animationType: 'slide-in-right',
        animationDuration: 300
      });
    };
    
    // 页面加载时获取好友列表
    onMounted(() => {
      // friendStore.getFriendList();
    });

    return {
      previewOnlineFileApi,
      statusBarHeight,
      showDropdown,
      currentIndex,
      indexList,
      friendList,
      friendsGroupedByLetter,
      scrollToSection,
      scanCode,
      navigateTo,
      handlecreateConversation,
      onScroll
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
  font-size: 14px;
  line-height: 1.5;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
}

/* 顶部导航栏 */
.header {
  height: 56px;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #FFFFFF;
}

.header-title {
  font-size: 20px;
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
  color: #FF7D45;
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
  padding: 0 16px 10px;
}

.search-bar {
  background: #F9FAFB;
  border-radius: 10px;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.search-icon {
  color: #B2BEC3;
  margin-right: 10px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-placeholder {
  color: #B2BEC3;
  font-size: 14px;
}

/* 索引栏 */
.index-bar {
  position: fixed;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  z-index: 90;
}

.index-item {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #636E72;
  font-weight: 500;
}

.index-item.active {
  color: #FF7D45;
  font-weight: 600;
}

/* 好友分组 */
.friend-section {
  margin-bottom: 8px;
  padding: 0 16px;
}

.section-header {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #636E72;
  font-weight: 600;
  position: sticky;
  top: 0;
  background: #FFFFFF;
  z-index: 5;
}

.section-title {
  display: flex;
  align-items: center;
}

.section-count {
  font-size: 12px;
  font-weight: 400;
  color: #B2BEC3;
  margin-left: 5px;
}

/* 好友列表 */
.friend-list-container {
  position: relative;
  padding-bottom: calc(env(safe-area-inset-bottom) + 100rpx);
}

.friend-list {
  position: relative;
}

.friend-item {
  padding: 10px 0;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.friend-item:active {
  background-color: #F9FAFB;
}

.friend-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 64px;
  right: 0;
  bottom: 0;
  height: 0.5px;
  background-color: #EBEEF5;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  position: relative;
  margin-right: 16px;
}

.avatar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  border-radius: 14px 14px 0 0;
}

.avatar.primary {
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  box-shadow: 0 2px 6px rgba(255, 125, 69, 0.15);
}

.avatar.blue {
  background: linear-gradient(135deg, #4A6FA1 0%, #375782 100%);
  box-shadow: 0 2px 6px rgba(74, 111, 161, 0.15);
}

.avatar.green {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.15);
}

.avatar.purple {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  box-shadow: 0 2px 6px rgba(156, 39, 176, 0.15);
}

.avatar.yellow {
  background: linear-gradient(135deg, #FFD166 0%, #FFC107 100%);
  box-shadow: 0 2px 6px rgba(255, 209, 102, 0.15);
}

.friend-content {
  flex: 1;
  min-width: 0;
}

.friend-name {
  font-size: 16px;
  font-weight: 500;
  color: #2D3436;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 快捷操作区 */
.quick-actions {
  padding: 16px;
  display: flex;
  background: #F9FAFB;
  margin-bottom: 10px;
  border-radius: 12px;
  margin: 0 16px 10px;
}

.quick-action-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background: #FFFFFF;
  color: #FF7D45;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: 24rpx;
}

.action-label {
  font-size: 12px;
  color: #636E72;
}

/* 下拉菜单 */
.dropdown {
  position: fixed;
  right: 16px;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  border-radius: 12px;
  width: 160px;
  overflow: hidden;
  z-index: 200;
  display: none;
  opacity: 0;
  transform: translateY(-10px);
  transform-origin: top right;
  transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1), transform 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.dropdown.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.dropdown-item {
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  color: #2D3436;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:active {
  background-color: #F9FAFB;
}

.dropdown-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
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
  background: rgba(0,0,0,0.2);
  z-index: 150;
  display: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.mask.show {
  display: block;
  opacity: 1;
}

/* 底部占位 */
.tabbar-placeholder {
  height: 56px;
  width: 100%;
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
  border-radius: 14px;
  object-fit: cover;
}
</style>
