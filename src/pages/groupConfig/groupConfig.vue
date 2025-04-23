<template>
  <view class="container">
    <!-- 顶部渐变 -->
    <view class="gradient-header"></view>
    
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="back-button" @click="goBack">
        <image src="@/static/img/common/arrow-back.svg" mode="aspectFit" />
      </view>
      <view class="navbar-title">群聊详情</view>
    </view>
    <!-- 顶部区域 -->
    <view class="header">
      <view class="group-info">
        <view class="group-avatar" @click="chooseAvatar">
          <image class="avatar-img" :src="groupInfo?.avatar ? previewOnlineFileApi(groupInfo.avatar) : ''" mode="aspectFill" />
          <view v-if="isAdmin" class="edit-icon">更换</view>
        </view>
        <view class="group-text">
          <text class="group-name">{{ groupInfo?.title }}</text>
        </view>
      </view>
    </view>
    
    <!-- 主容器 -->
    <view class="main-container">
      <!-- 群成员区块 -->
      <view class="card members-section">
        <view class="members-header">
          <view class="members-title">
            <image src="@/static/img/groupSetting/members.svg" mode="aspectFit" />
            <text>群成员</text>
          </view>
          <view class="members-count" @click="viewAllMembers">{{ groupInfo?.memberCount || 0 }}人</view>
        </view>
        <view class="members-grid">
          <!-- {{ groupMembers }} -->
          <view class="member-item" v-for="(member, index) in groupMembers" :key="index">
            <view class="member-avatar">
              <image :src="previewOnlineFileApi(member.avatar)" mode="aspectFill" />
            </view>
            <text class="member-name">{{ member.nickname }}</text>
          </view>
          
          <view class="member-item" @click="addMember" v-if="isAdmin">
            <view class="member-avatar add-member">
              <image src="@/static/img/groupSetting/add.svg" mode="aspectFit" />
            </view>
            <text class="member-name">添加</text>
          </view>
          
          <view class="member-item" @click="removeMember" v-if="isAdmin">
            <view class="member-avatar remove-member">
              <image src="@/static/img/groupSetting/remove.svg" mode="aspectFit" />
            </view>
            <text class="member-name">移除</text>
          </view>
        </view>
        
        <view class="view-all" @click="viewAllMembers">
          <text>查看全部成员</text>
          <image src="@/static/img/groupSetting/arrow.svg" mode="aspectFit" />
        </view>
      </view>
      
      <!-- 功能列表 -->
      <view class="card feature-list">
        <view class="feature-item" @click="openModal('name')">
          <view class="feature-left">
            <view class="feature-icon">
              <image src="@/static/img/groupSetting/edit.svg" mode="aspectFit" />
            </view>
            <view class="feature-info">
              <text class="feature-title">群聊名称</text>
              <text class="feature-desc">修改群组的显示名称</text>
            </view>
          </view>
          <view class="feature-right">
            <text class="feature-value">{{ groupInfo?.name || '群聊' }}</text>
            <view class="feature-arrow">
              <image src="@/static/img/groupSetting/arrow.svg" mode="aspectFit" />
            </view>
          </view>
        </view>
        
        <!-- <view class="feature-item" @click="groupSettings">
          <view class="feature-left">
            <view class="feature-icon">
              <image src="@/static/img/groupSetting/settings.svg" mode="aspectFit" />
            </view>
            <view class="feature-info">
              <text class="feature-title">群聊设置</text>
              <text class="feature-desc">群公告、头像等设置</text>
            </view>
          </view>
          <view class="feature-right">
            <view class="feature-arrow">
              <image src="@/static/img/groupSetting/arrow.svg" mode="aspectFit" />
            </view>
          </view>
        </view> -->
        
        <!-- <view class="feature-item">
          <view class="feature-left">
            <view class="feature-icon">
              <image src="@/static/img/groupSetting/notification.svg" mode="aspectFit" />
            </view>
            <view class="feature-info">
              <text class="feature-title">消息免打扰</text>
              <text class="feature-desc">关闭后不再接收通知</text>
            </view>
          </view>
          <view class="feature-right">
            <switch :checked="isMuted" @change="toggleMute" color="#FF7D45" />
          </view>
        </view> -->
      </view>
      
      <!-- 第二个功能列表 -->
      <view class="card feature-list">
        <!-- <view class="feature-item" @click="searchChat">
          <view class="feature-left">
            <view class="feature-icon">
              <image src="@/static/img/groupSetting/search.svg" mode="aspectFit" />
            </view>
            <view class="feature-info">
              <text class="feature-title">查找聊天记录</text>
              <text class="feature-desc">搜索群内历史消息</text>
            </view>
          </view>
          <view class="feature-right">
            <view class="feature-arrow">
              <image src="@/static/img/groupSetting/arrow.svg" mode="aspectFit" />
            </view>
          </view>
        </view> -->
        
        <!-- <view class="feature-item" @click="reportGroup">
          <view class="feature-left">
            <view class="feature-icon">
              <image src="@/static/img/groupSetting/report.svg" mode="aspectFit" />
            </view>
            <view class="feature-info">
              <text class="feature-title">投诉</text>
              <text class="feature-desc">对群聊进行投诉</text>
            </view>
          </view>
          <view class="feature-right">
            <view class="feature-arrow">
              <image src="@/static/img/groupSetting/arrow.svg" mode="aspectFit" />
            </view>
          </view>
        </view>-->
      </view> 
    </view>
    
    <!-- 底部区域 -->
    <view class="bottom-section">
      <view class="exit-button" @click="exitGroup">退出群聊</view>
    </view>

    <!-- 修改群名称模态框 -->
    <uv-popup ref="namePopup" mode="center" round="10" :overlay="true">
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title">修改群名称</view>
          <view class="modal-close" @click="closeModal('name')">
            <image src="@/static/img/common/close.svg" mode="aspectFit" />
          </view>
        </view>
        <view class="form-group">
          <input type="text" class="form-control" v-model="formData.name" placeholder="请输入群名称" maxlength="20" />
          <view class="char-count"><text>{{ formData.name.length }}</text>/20</view>
        </view>
        <button class="btn-save" @click="saveGroupName">确定</button>
      </view>
    </uv-popup>

    <!-- 提示框 -->
    <uv-toast ref="uToast" />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useGroupStore } from '@/pinia/group/group';
import { useUserStore } from '@/pinia/user/user';
import { openAlbum } from '@/utils/upload';
import type { IGroupInfo, IGroupMember } from '@/types/ajax/group';
import { previewOnlineFileApi } from "@/api/file";
import { updateGroupInfoApi, quitGroupApi } from '@/api/group';

export default defineComponent({
  name: 'GroupSetting',
  setup() {
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
    const isMuted = ref(false);
    const groupStore = useGroupStore();
    const userStore = useUserStore();
    const groupId = ref('');
    const namePopup = ref();
    const uToast = ref();
    const formData = ref({
      name: ''
    });

    // 获取群组信息
    const groupInfo = computed<IGroupInfo | undefined>(() => {
      console.error(123123, groupStore.getGroupById(groupId.value))
      return groupStore.getGroupById(groupId.value);
    });

    const groupMembers= computed(()=>{
      return groupStore.getMembersByGroupId(groupId.value)
    })
    // 判断是否是管理员或群主
    const isAdmin = computed(() => {
      const members = groupStore.getMembersByGroupId(groupId.value);
      const userInfo = members.find(member => member.userId === userStore.userInfo.userId);
      return userInfo?.role === 1 || userInfo?.role === 2;
    });

    const getGroupsMembers = async () => {
      await groupStore.getGroupMembersApi(groupId.value);
      
    };

    onMounted(() => {
      getGroupsMembers();
    });

    const goBack = () => {
      uni.navigateBack();
    };

    const viewAllMembers = () => {
      uni.navigateTo({ url: `/pages/groupMember/groupMember?id=${groupId.value}&mode=view` });
    };

    const addMember = () => {
      uni.navigateTo({ url: `/pages/groupMember/groupMember?id=${groupId.value}&mode=add` });
    };

    const removeMember = () => {
      uni.navigateTo({ url: `/pages/groupMember/groupMember?id=${groupId.value}&mode=remove` });
    };

    const openModal = (type: string) => {
      if (!isAdmin.value) {
        console.error('不是群聊管理员或群主，无法修改群名称');
        return;
      }
      if (type === 'name') {
        formData.value.name = groupInfo.value?.title || '';
        namePopup.value.open();
      }
    };

    const closeModal = (type: string) => {
      if (type === 'name') {
        namePopup.value.close();
      }
    };

    const saveGroupName = async () => {
      if (!formData.value.name.trim()) {
        showToast('群名称不能为空');
        return;
      }

      try {
        const result = await updateGroupInfoApi({
          groupId: groupId.value,
          name: formData.value.name
        });
        if (result.code === 0) {
          showToast('修改成功');
          closeModal('name');
          groupStore.initGroupListApi();
        } else {
          showToast(result.msg || '修改失败');
        }
      } catch (error) {
        showToast('修改失败');
      }
    };

    const chooseAvatar = () => {
      if (!isAdmin.value) {
        return;
      }
      
      openAlbum('album').then((result: any) => {
        updateGroupInfoApi({
          groupId: groupId.value,
          avatar: result.fileId
        }).then((res) => {
          if (res.code === 0) {
            showToast('修改成功');
            groupStore.initGroupListApi();
          } else {
            showToast(res.msg || '修改失败');
          }
        }).catch(() => {
          showToast('修改失败');
        });
      });
    };

    const groupSettings = () => {
      uni.navigateTo({ url: `/pages/groupSetting/settings?id=${groupId.value}` });
    };

    const toggleMute = (e: any) => {
      isMuted.value = e.detail.value;
      // TODO: 调用API更新群组免打扰状态
    };

    const searchChat = () => {
      uni.navigateTo({ url: `/pages/groupSetting/search?id=${groupId.value}` });
    };

    const reportGroup = () => {
      uni.navigateTo({ url: `/pages/groupSetting/report?id=${groupId.value}` });
    };

    const exitGroup = async () => {
      uni.showModal({
        title: '提示',
        content: '确定要退出该群聊吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await quitGroupApi({ groupId: groupId.value });
              if (result.code === 0) {
                showToast('已退出群聊');
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              } else {
                console.error('dasdasd', result.msg)
                showToast(result.msg || '退出失败');
              }
            } catch (error) {
              showToast('退出失败');
            }
          }
        }
      });
    };

    const showToast = (message: string) => {
      uToast.value.show({
        title: message,
        type: 'success',
        duration: 2000
      });
    };

    return {
      previewOnlineFileApi,
      groupMembers,
      statusBarHeight,
      isMuted,
      groupInfo,
      groupId,
      isAdmin,
      formData,
      namePopup,
      uToast,
      goBack,
      viewAllMembers,
      addMember,
      removeMember,
      openModal,
      closeModal,
      saveGroupName,
      chooseAvatar,
      groupSettings,
      toggleMute,
      searchChat,
      reportGroup,
      exitGroup
    };
  },
  onLoad(options: any) {
    if (options.id) {
      this.groupId = options.id;
    }
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

.container {
  min-height: 100vh;
  background-color: $background;
  position: relative;
}

/* 页面顶部渐变 */
.gradient-header {
  height: 240rpx;
  background: linear-gradient(180deg, rgba(255,125,69,0.1) 0%, rgba(255,255,255,0) 100%);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.navbar {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 32rpx;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 100;
  background: $background;
}

.back-button {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;

  image {
    width: 48rpx;
    height: 48rpx;
  }
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: $text-title;
}

.header {
  padding: 88rpx 0 0;
  border-radius: 0 0 48rpx 48rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.group-info {
  padding: 40rpx 32rpx;
}

.group-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin: 0 auto 24rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.2);

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .edit-icon {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60rpx;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24rpx;
  }
}

.group-text {
  text-align: center;
}

.group-name {
  font-size: 36rpx;
  font-weight: 600;
  color: $text-title;
  margin-bottom: 4rpx;
  display: block;
}

.main-container {
  padding: 0 32rpx;
}

.card {
  background: white;
  border-radius: 32rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.members-section {
  padding: 0;
}

.members-header {
  padding: 24rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2rpx solid $divider;
}

.members-title {
  font-size: 30rpx;
  font-weight: 500;
  display: flex;
  align-items: center;

  image {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
  }
}

.members-count {
  background: $primary;
  color: white;
  border-radius: 20rpx;
  padding: 2rpx 16rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 24rpx 16rpx;
  gap: 0;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 0 8rpx;
}

.member-avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  margin-bottom: 8rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(74, 111, 161, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  }

  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.member-name {
  font-size: 20rpx;
  color: $text-body;
  max-width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-member, .remove-member {
  background: $background-secondary;
  border: 2rpx dashed $text-auxiliary;

  image {
    width: 32rpx;
    height: 32rpx;
  }
}

.remove-member image {
  color: $error;
}

.view-all {
  width: 100%;
  padding: 20rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primary;
  font-weight: 500;
  font-size: 26rpx;
  border-top: 2rpx solid $divider;

  image {
    width: 28rpx;
    height: 28rpx;
    margin-left: 4rpx;
  }
}

.feature-list .feature-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  position: relative;
}

.feature-list .feature-item:after {
  content: '';
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  bottom: 0;
  height: 2rpx;
  background: $divider;
}

.feature-list .feature-item:last-child:after {
  display: none;
}

.feature-left {
  display: flex;
  align-items: center;
}

.feature-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: $background-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;

  image {
    width: 32rpx;
    height: 32rpx;
  }
}

.feature-info {
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-weight: 500;
  font-size: 28rpx;
  color: $text-title;
}

.feature-desc {
  font-size: 22rpx;
  color: $text-auxiliary;
  margin-top: 2rpx;
}

.feature-right {
  display: flex;
  align-items: center;
}

.feature-value {
  font-size: 26rpx;
  color: $text-body;
  margin-right: 12rpx;
}

.feature-arrow image {
  width: 28rpx;
  height: 28rpx;
}

.bottom-section {
  padding: 16rpx 32rpx 64rpx;
}

.exit-button {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 24rpx;
  color: $error;
  font-size: 28rpx;
  font-weight: 500;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

/* 模态框样式 */
.modal-content {
  background-color: white;
  border-radius: 32rpx;
  padding: 40rpx;
  width: 640rpx;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-header {
  text-align: center;
  margin-bottom: 36rpx;
  position: relative;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-title;
}

.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  image {
    width: 36rpx;
    height: 36rpx;
  }
}

.form-group {
  margin-bottom: 36rpx;
  position: relative;
}

.form-control {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  padding: 0 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid $text-auxiliary;
  background-color: $background-secondary;
  font-size: 28rpx;
  color: $text-title;
  box-sizing: border-box;
}

.char-count {
  text-align: right;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: $text-auxiliary;
}

.btn-save {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.15);
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.15);
  }
}
</style>
