<template>
	<BeaverLayout
		title="好友资料"
		:show-back="true"
		:scrollable="true"
		:scroll-y="true"
		:show-scrollbar="false"
		:show-background="true"
		background-type="gradient"
		:background-height="200"
		@back="handleClickGoBack"
	>
		<template #right>
			<view class="more-button" @click="showMoreMenu">
				<image src="@/static/img/detail/more-icon.svg" mode="aspectFit" class="more-icon" />
			</view>
		</template>

		<!-- 滚动内容区域 -->
		<scroll-view 
			class="scroll-content" 
			scroll-y="true"
		>
			<view class="content">
				<!-- 好友资料卡片 -->
				<view class="profile-card">
					<!-- 用户基本信息头部 -->
					<view class="profile-header">
						<view class="user-avatar">
							<image :src="getAvatarUrl(friendInfo.avatar)" mode="aspectFill" class="avatar-img" />
						</view>
						<view class="user-name">
							{{ friendInfo.nickname }}
							<image v-if="friendInfo.gender === 'male'" src="@/static/img/detail/gender-male-icon.svg" mode="aspectFit" class="gender-icon" />
						</view>
						<view v-if="friendInfo.remarkName" class="user-alias">备注: {{ friendInfo.remarkName }}</view>
						<view class="user-id">ID: {{ friendInfo.userId }}</view>
						<view class="user-signature">{{ friendInfo.signature || '这个人很懒，什么都没写~' }}</view>
					</view>
					<!-- 基本资料卡片 -->
			<view class="info-card">
				<view class="card-header">
					<view class="card-title">基本资料</view>
				</view>
				<view class="info-grid">
					<view class="info-item">
						<view class="info-label">地区</view>
						<view class="info-value">{{ friendInfo.location || '未设置' }}</view>
					</view>
					<view class="info-item">
						<view class="info-label">年龄</view>
						<view class="info-value">{{ friendInfo.age || '未设置' }}</view>
					</view>
				</view>
			</view>

					<!-- 相册预览卡片 -->
					<view class="info-card" v-if="friendInfo.photos && friendInfo.photos.length">
						<view class="card-header">
							<view class="card-title">相册动态</view>
						</view>
						<view class="photo-grid">
							<view class="photo-item" v-for="(photo, index) in displayPhotos" :key="index">
								<image :src="photo" mode="aspectFill" />
							</view>
							<view v-if="friendInfo.photos.length > 3" class="photo-item more-photos" @click="viewAllPhotos">
								查看更多
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="actions-container">
				<view class="action-button primary-button" @click="sendMessage">
					<image src="@/static/img/detail/chat-icon.svg" mode="aspectFit" class="button-icon" />
					<text>发起聊天</text>
				</view>
				<view class="action-button secondary-button" @click="audioCall">
					<image src="@/static/img/detail/voice-call-icon.svg" mode="aspectFit" class="button-icon" />
				</view>
				<view class="action-button secondary-button" @click="videoCall">
					<image src="@/static/img/detail/video-call-icon.svg" mode="aspectFit" class="button-icon" />
				</view>
			</view>
		</view>

		<!-- 编辑备注弹窗 -->
		<uni-popup ref="editNotePopup" type="center">
			<view class="modal-content">
				<view class="modal-title">编辑备注</view>
				<view class="input-group">
					<input type="text" class="input-field" v-model="newRemarkName" placeholder="请输入备注名称" />
				</view>
				<view class="modal-actions">
					<view class="modal-button cancel-button" @click="closeEditNote">取消</view>
					<view class="modal-button confirm-button" @click="saveRemarkName">保存</view>
				</view>
			</view>
		</uni-popup>

		<!-- 更多菜单弹窗 -->
		<uni-popup ref="moreMenuPopup" type="top">
			<view class="menu-container">
				<view class="menu-item" @click="showEditNote">
					<text class="menu-text">编辑备注</text>
				</view>
				<view class="menu-divider"></view>
				<view class="menu-item" @click="confirmDelete">
					<text class="menu-text danger">删除好友</text>
				</view>
			</view>
		</uni-popup>
	</BeaverLayout>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getFriendInfoApi, updateRemarkNameApi, deleteFriendApi } from '@/api/friend';
import { previewOnlineFileApi } from '@/api/file';
import BeaverLayout from '@/component/layout/layout.vue';

export default {
	components: {
		BeaverLayout
	},
	setup() {
		const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
		
		const friendInfo = ref({
			userId: '',
			nickname: '',
			avatar: '',
			remarkName: '',
			signature: '',
			gender: '',
			location: '',
			age: '',
			constellation: '',
			occupation: '',
			education: '',
			hobbies: '',
			photos: [] as string[],
			conversationId: ''
		});

		const newRemarkName = ref('');
		const editNotePopup = ref();
		const moreMenuPopup = ref();

		const getAvatarUrl = (avatar: string) => {
			return previewOnlineFileApi(avatar);
		};

		const displayPhotos = computed(() => {
			return friendInfo.value.photos.slice(0, 3);
		});

		onLoad((option: any) => {
			if (option.id) {
				loadFriendInfo(option.id);
			}
		});

		const loadFriendInfo = async (friendId: string) => {
			try {
				const res = await getFriendInfoApi({ friendId });
				if (res.code === 0) {
					friendInfo.value = { ...friendInfo.value, ...res.result };
				}
			} catch (error) {
				uni.showToast({ title: '获取好友信息失败', icon: 'none' });
			}
		};

		const handleClickGoBack = () => {
			uni.navigateBack();
		};

		const showMoreMenu = () => {
			moreMenuPopup.value.open();
		};

		const showEditNote = () => {
			moreMenuPopup.value.close();
			newRemarkName.value = friendInfo.value.remarkName;
			editNotePopup.value.open();
		};

		const closeEditNote = () => {
			editNotePopup.value.close();
		};

		const saveRemarkName = async () => {
			try {
				const res = await updateRemarkNameApi({
					friendId: friendInfo.value.userId,
					remarkName: newRemarkName.value
				});
				if (res.code === 0) {
					friendInfo.value.remarkName = newRemarkName.value;
					uni.showToast({ title: '备注更新成功', icon: 'success' });
					closeEditNote();
				}
			} catch (error) {
				uni.showToast({ title: '更新备注失败', icon: 'none' });
			}
		};

		const confirmDelete = () => {
			moreMenuPopup.value.close();
			uni.showModal({
				title: '删除好友',
				content: '确定要删除该好友吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							const result = await deleteFriendApi({ friendId: friendInfo.value.userId });
							if (result.code === 0) {
								uni.showToast({ title: '删除成功', icon: 'success' });
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							}
						} catch (error) {
							uni.showToast({ title: '删除失败', icon: 'none' });
						}
					}
				}
			});
		};

		const sendMessage = () => {
			uni.navigateTo({
				url: `/pages/chat/chat?id=${friendInfo.value.conversationId}`,
				animationType: 'slide-in-right',
				animationDuration: 200
			});
		};

		const audioCall = () => {
			uni.showToast({ title: '发起语音通话', icon: 'none' });
		};

		const videoCall = () => {
			uni.showToast({ title: '发起视频通话', icon: 'none' });
		};

		const viewAllPhotos = () => {
			// 实现查看所有照片的逻辑
			uni.showToast({ title: '查看更多照片', icon: 'none' });
		};

		return {
			friendInfo,
			displayPhotos,
			newRemarkName,
			editNotePopup,
			moreMenuPopup,
			statusBarHeight,
			getAvatarUrl,
			handleClickGoBack,
			showMoreMenu,
			showEditNote,
			closeEditNote,
			saveRemarkName,
			confirmDelete,
			sendMessage,
			audioCall,
			videoCall,
			viewAllPhotos
		};
	}
};
</script>

<style lang="scss" scoped>

/* 移除 header 的边框 */
:deep(.header-content) {
  border-bottom: none !important;
}

/* 基础样式 */
.container {
	height: 100vh;
	background-color: #F9FAFB;
	color: #636E72;
	font-size: 28rpx;
	line-height: 1.5;
	position: relative;
}

/* 更多按钮样式 */
.more-button {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.more-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 滚动内容区域 */
.scroll-content {
	background-color: #F9FAFB;
}

.content {
	padding: 0 32rpx;
	padding-bottom: 32rpx;
	max-width: 750rpx;
	box-sizing: border-box;
	margin: 0 auto;
}

/* 用户资料卡片 */
.profile-card {
	padding: 0;
	position: relative;
	z-index: 2;
	padding-top: 40rpx;
}

.profile-header {
	background-color: white;
	border-radius: 48rpx;
	padding: 48rpx;
	box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.06);
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 40rpx;
}

.user-avatar {
	width: 176rpx;
	height: 176rpx;
	border-radius: 56rpx;
	overflow: hidden;
	position: relative;
	margin-bottom: 32rpx;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 30%;
		background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
	}
}

.avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.user-name {
	font-size: 40rpx;
	font-weight: 600;
	color: #2D3436;
	margin-bottom: 12rpx;
	display: flex;
	align-items: center;
}

.gender-icon {
	width: 36rpx;
	height: 36rpx;
	margin-left: 12rpx;
}

.user-alias {
	font-size: 28rpx;
	color: #636E72;
	margin-bottom: 16rpx;
}

.user-id {
	font-size: 26rpx;
	color: #B2BEC3;
	margin-bottom: 28rpx;
}

.user-signature {
	font-size: 30rpx;
	color: #636E72;
	text-align: center;
	max-width: 600rpx;
	line-height: 1.5;
}

/* 资料卡片样式 */
.info-card {
	background-color: white;
	border-radius: 48rpx;
	padding: 48rpx;
	box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.06);
	margin-bottom: 40rpx;
}

.card-header {
	margin-bottom: 40rpx;
}

.card-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #2D3436;
}

/* 信息网格布局 */
.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 32rpx;
}

.info-item {
	padding: 24rpx 32rpx;
	background-color: #F9FAFB;
	border-radius: 24rpx;
	transition: all 0.2s;

	&:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.05);
	}
}

.info-label {
	color: #B2BEC3;
	margin-bottom: 8rpx;
	font-size: 24rpx;
}

.info-value {
	color: #2D3436;
	font-weight: 500;
	font-size: 30rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 相册预览卡片 */
.photo-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
	padding: 16rpx 0;
}

.photo-item {
	aspect-ratio: 1/1;
	border-radius: 32rpx;
	overflow: hidden;
	background-color: #F0F3F4;
	transition: transform 0.2s;

	image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&:hover {
		transform: scale(1.02);
	}
}

.more-photos {
	background-color: rgba(0,0,0,0.5);
	color: white;
	font-weight: 500;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
}

/* 底部固定按钮 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: white;
	padding: 32rpx 48rpx;
	box-shadow: 0 -8rpx 32rpx rgba(0,0,0,0.08);
	z-index: 10;
}

.actions-container {
	display: flex;
	gap: 24rpx;
}

.action-button {
	height: 112rpx;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
	cursor: pointer;
}

.primary-button {
	background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
	color: white;
	box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.2);
	font-size: 32rpx;
	font-weight: 600;
	flex: 3;
	gap: 16rpx;

	&:active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.15);
	}

	text {
		color: white;
	}
}

.secondary-button {
	background-color: #F0F3F4;
	flex: 1;

	&:active {
		background-color: #E8EBED;
		transform: translateY(2rpx);
	}
}

.button-icon {
	width: 44rpx;
	height: 44rpx;
}

/* 编辑备注弹窗 */
.modal-content {
	width: 636rpx;
	background-color: white;
	border-radius: 40rpx;
	padding: 48rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 999;
}

.modal-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #2D3436;
	margin-bottom: 32rpx;
	text-align: center;
}

.input-group {
	margin-bottom: 40rpx;
}

.input-field {
	width: 100%;
	height: 96rpx;
	border-radius: 24rpx;
	border: 2rpx solid #E8EBED;
	padding: 0 32rpx;
	font-size: 30rpx;
	margin-bottom: 40rpx;
	transition: all 0.2s;
	background-color: #F9FAFB;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: #FF7D45;
		box-shadow: 0 0 0 6rpx rgba(255, 125, 69, 0.1);
	}
}

.modal-actions {
	display: flex;
	gap: 24rpx;
}

.modal-button {
	flex: 1;
	height: 96rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	font-weight: 500;
	cursor: pointer;
}

.cancel-button {
	background-color: #F0F3F4;
	color: #636E72;

	&:active {
		background-color: #E8EBED;
	}
}

.confirm-button {
	background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
	color: white;

	&:active {
		opacity: 0.9;
	}
}

/* 更多菜单 */
.menu-container {
	background-color: white;
	border-radius: 32rpx;
	overflow: hidden;
	width: 280rpx;
	position: absolute;
	right: 32rpx;
	top: 128rpx;
	box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.15);
	z-index: 998;
}

.menu-item {
	padding: 32rpx;
	display: flex;
	align-items: center;
	transition: background-color 0.15s;

	&:active {
		background-color: #F0F3F4;
	}
}

.menu-text {
	font-size: 30rpx;
	color: #2D3436;

	&.danger {
		color: #FF5252;
	}
}

.menu-divider {
	height: 2rpx;
	background-color: #F0F3F4;
}
</style>