<template>
  <view class="search-friend">
    <view class="navbar" :style="{ top: statusBarHeight + 'px' }">
      <view class="left" @click="handleClickGoBack">
        <image class="back-icon" src="/static/img/icons/feedback.svg" mode="aspectFit"></image>
      </view>
      <view class="title">添加好友</view>
      <view class="right"></view>
    </view>

    <view class="search-container" :style="{ marginTop: statusBarHeight + 44 + 'px' }">
      <view class="search-box">
        <image src="@/static/img/searchFriend/search-icon.svg" mode="aspectFit" class="icon-img" />
        <input 
          class="search-input" 
          type="text"
          v-model="searchQuery"
          placeholder="输入手机号搜索"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 初始状态（未搜索） -->
    <view class="state-empty" :class="{ 'active': !showResult }">
      <view class="add-methods">
        <view class="method-item" @click="scanCode">
          <view class="method-icon">
            <image src="@/static/img/searchFriend/qr-code-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <view class="method-info">
            <text class="method-name">扫一扫</text>
            <text class="method-desc">扫描好友的二维码添加</text>
          </view>
          <view class="arrow-right">
            <image src="@/static/img/searchFriend/arrow-right-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
        </view>
        <view class="method-item" @click="navigateToContacts">
          <view class="method-icon">
            <image src="@/static/img/searchFriend/contacts-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
          <view class="method-info">
            <text class="method-name">手机通讯录</text>
            <text class="method-desc">查找通讯录中的好友</text>
          </view>
          <view class="arrow-right">
            <image src="@/static/img/searchFriend/arrow-right-icon.svg" mode="aspectFit" class="icon-img" />
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果状态 -->
    <view class="state-result" :class="{ 'active': showResult }">
      <view class="search-result show fade-in">
        <view class="result-card">
          <view class="user-profile">
            <view class="user-avatar">
              <image :src="searchResult.avatar || defaultAvatar" mode="aspectFill" />
            </view>
            <view class="user-info">
              <text class="user-name">{{ searchResult.nickname }}</text>
              <text class="user-id">ID: {{ searchResult.userId }}</text>
              <text class="user-bio">{{ searchResult.bio }}</text>
              <view class="user-meta">
                <text>{{ searchResult.location }}</text>
                <text class="meta-dot"></text>
                <text>{{ searchResult.age }}岁</text>
              </view>
            </view>
          </view>
        </view>
        <view class="result-actions">
          <input 
            type="text" 
            class="verification-input" 
            v-model="verificationMessage" 
            placeholder="请输入验证消息..."
          />
          <button class="btn btn-primary" @click="sendFriendRequest">添加好友</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getSearchFriendApi } from '@/api/friend';

interface SearchUserInfo {
	userId: string;
	nickname: string;
	avatar: string;
	phone: string;
}

export default defineComponent({
	setup() {
		const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
		const searchQuery = ref('');
		const searchResults = ref<SearchUserInfo[]>([]);
		const isLoading = ref(false);
		const showResult = ref(false);
		const verificationMessage = ref('我是你的好友');
		const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%232196F3\'%3E%3Cpath d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z\'/%3E%3C/svg%3E';
		
		const searchResult = ref({
			userId: '',
			nickname: '',
			avatar: '',
			bio: '',
			location: '',
			age: ''
		});

		const handleSearch = async () => {
			if (searchQuery.value.length > 0) {
				isLoading.value = true;
				try {
					const res = await getSearchFriendApi({ phone: searchQuery.value });
					if (res.code === 0 && res.result) {
						searchResults.value = [{
							userId: res.result.userId,
							nickname: res.result.nickname || '未设置昵称',
							avatar: res.result.avatar || '',
							phone: searchQuery.value
						}];
					} else {
						searchResults.value = [];
					}
				} catch (error) {
					console.error('Search failed:', error);
					searchResults.value = [];
				} finally {
					isLoading.value = false;
				}
			} else {
				searchResults.value = [];
			}
		};

		const handleClickGoBack = () => {
			uni.navigateBack();
		};

		const handleClickUser = (user: SearchUserInfo) => {
			uni.navigateTo({
				url: `/pages/detail/detail?userId=${user.userId}`
			});
		};

		const scanCode = () => {
			uni.scanCode({
				success: (res) => {
					try {
						const data = JSON.parse(res.result);
						// 处理扫码结果
						uni.showToast({ title: '扫描成功', icon: 'none' });
					} catch (e) {
						uni.showToast({ title: '无效的二维码', icon: 'none' });
					}
				}
			});
		};

		const navigateToContacts = () => {
			uni.navigateTo({
				url: '/pages/contacts/contacts'
			});
		};

		const sendFriendRequest = () => {
			// 发送好友请求的逻辑
			uni.showToast({
				title: '好友请求已发送',
				icon: 'none'
			});

			setTimeout(() => {
				showResult.value = false;
				searchQuery.value = '';
			}, 2000);
		};

		return {
			searchQuery,
			searchResults,
			isLoading,
			showResult,
			verificationMessage,
			searchResult,
			defaultAvatar,
			handleSearch,
			handleClickGoBack,
			handleClickUser,
			scanCode,
			navigateToContacts,
			sendFriendRequest,
			statusBarHeight
		};
	}
});
</script>

<style lang="scss" scoped>
.search-friend {
	min-height: 100vh;
	background-color: #f5f5f5;
	position: relative;
}

.navbar {
	position: fixed;
	left: 0;
	right: 0;
	height: 44px;
	background: linear-gradient(180deg, #4095E5, #3A84E6);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	z-index: 100;
	
	.left, .right {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.back-icon {
		width: 24px;
		height: 24px;
	}
	
	.title {
		color: #fff;
		font-size: 17px;
		font-weight: 500;
	}
}

.search-container {
	padding: 12px 16px;
	background: #fff;
	position: fixed;
	left: 0;
	right: 0;
	z-index: 99;
	
	.search-box {
		height: 36px;
		background: #f5f5f5;
		border-radius: 18px;
		display: flex;
		align-items: center;
		padding: 0 12px;
		
		.search-icon {
			width: 20px;
			height: 20px;
			margin-right: 8px;
		}
		
		.search-input {
			flex: 1;
			height: 100%;
			font-size: 15px;
			
			&::placeholder {
				color: #999;
			}
		}
	}
}

.search-results {
	background: #fff;
	margin-top: 12px;
	padding-top: 92px;
	
	.user-item {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #f5f5f5;
		
		.avatar {
			width: 48px;
			height: 48px;
			border-radius: 24px;
			margin-right: 12px;
		}
		
		.user-info {
			flex: 1;
			
			.nickname {
				font-size: 16px;
				color: #333;
				margin-bottom: 4px;
				display: block;
			}
			
			.phone {
				font-size: 14px;
				color: #999;
			}
		}
	}
}

.no-results {
	text-align: center;
	padding: 32px 0;
	color: #999;
	font-size: 14px;
	margin-top: 92px;
}

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
  background-color: #FFFFFF;
  color: #636E72;
  font-size: 28rpx;
  line-height: 1.5;
  min-height: 100vh;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 32rpx;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #FFFFFF;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.back-button {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  color: #2D3436;
  background: none;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  color: #2D3436;
}

/* 搜索区域 */
.search-container {
  padding: 32rpx;
  margin-bottom: 48rpx;
}

.search-form {
  position: relative;
  margin-bottom: 48rpx;
}

.search-icon {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #B2BEC3;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input {
  width: 100%;
  height: 96rpx;
  background-color: #F9FAFB;
  border: none;
  border-radius: 48rpx;
  padding: 0 40rpx 0 96rpx;
  font-size: 32rpx;
  color: #2D3436;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.search-placeholder {
  color: #B2BEC3;
}

/* 添加方式卡片 */
.add-methods {
  background-color: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  margin: 0 32rpx;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04);
}

.method-item {
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx;
  position: relative;
}

.method-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  bottom: 0;
  height: 2rpx;
  background-color: #EBEEF5;
}

.method-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #FFE6D9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 32rpx;
  flex-shrink: 0;
}

.method-icon .icon-img {
  width: 48rpx;
  height: 48rpx;
}

.method-info {
  flex: 1;
}

.method-name {
  font-size: 34rpx;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8rpx;
  display: block;
}

.method-desc {
  font-size: 28rpx;
  color: #636E72;
  display: block;
}

.arrow-right {
  color: #B2BEC3;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 搜索结果 */
.search-result {
  background-color: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.08);
  margin: 0 32rpx;
  opacity: 0;
  transform: translateY(-20rpx);
  transition: all 0.3s ease;
}

.search-result.show {
  opacity: 1;
  transform: translateY(0);
}

.result-card {
  padding: 48rpx 32rpx;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 72rpx;
  overflow: hidden;
  background-color: #F9FAFB;
  margin-right: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.user-avatar image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 40rpx;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 12rpx;
  display: block;
}

.user-id {
  font-size: 24rpx;
  color: #B2BEC3;
  margin-bottom: 20rpx;
  display: block;
}

.user-bio {
  font-size: 30rpx;
  color: #636E72;
  line-height: 1.5;
  margin-bottom: 12rpx;
  display: block;
}

.user-meta {
  font-size: 26rpx;
  color: #B2BEC3;
  display: flex;
  align-items: center;
}

.meta-dot {
  display: inline-block;
  width: 6rpx;
  height: 6rpx;
  background-color: #B2BEC3;
  border-radius: 50%;
  margin: 0 12rpx;
}

/* 搜索结果动作区 */
.result-actions {
  padding: 40rpx 48rpx;
  border-top: 2rpx solid #EBEEF5;
  box-sizing: border-box;
}

.verification-input {
  width: 100%;
  padding: 28rpx 0;
  border-radius: 24rpx;
  border: 2rpx solid #EBEEF5;
  background-color: #F9FAFB;
  font-size: 30rpx;
  margin-bottom: 40rpx;
  height: 100%;
  color: #2D3436;
  padding-left: 32rpx;
  box-sizing: border-box;
}

.verification-input:focus {
  outline: none;
  border-color: #FF7D45;
  box-shadow: 0 0 0 6rpx rgba(255, 125, 69, 0.1);
}

/* 按钮 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: white;
  border: none;
  box-shadow: 0 12rpx 32rpx rgba(255, 125, 69, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
}

.btn-primary:active {
  transform: translateY(2rpx);
  box-shadow: 0 6rpx 16rpx rgba(255, 125, 69, 0.2);
}

/* 状态类 */
.state-empty,
.state-result {
  display: none;
}

.state-empty.active,
.state-result.active {
  display: block;
}

/* 动画 */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20rpx); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 图标通用样式 */
.icon-img {
  width: 100%;
  height: 100%;
}
.back-icon-img {
  width: 48rpx;
  height: 48rpx;
}
</style>
