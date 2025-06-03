<template>
  <view class="container">
    <!-- 顶部渐变 -->
    <view class="gradient-header"></view>
    
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="back-button" @click="goBack">
        <image src="@/static/img/groupMember/back.svg" mode="aspectFit" />
      </view>
      <view class="navbar-title">{{ pageTitle }}</view>
    </view>

    <!-- 内容容器 -->
    <view class="content-wrapper">
      <!-- 搜索框 -->
      <view class="search-container" v-if="mode !== 'view'">
        <view class="search-icon">
          <image src="@/static/img/groupMember/search.svg" mode="aspectFit" />
        </view>
        <input type="text" class="search-input" v-model="searchText" :placeholder="mode === 'add' ? '搜索联系人' : '搜索群成员'"
          @input="handleSearch" />
      </view>

      <!-- 内容区域 -->
      <view class="content-container">
        <!-- 添加成员模式 -->
        <view class="add-mode" v-if="mode === 'add'">
          <!-- 空状态 -->
          <view class="empty-state" v-if="filteredAddContacts.length === 0">
            <image src="@/static/img/groupMember/empty.svg" mode="aspectFit" />
            <view class="empty-title">没有可添加的联系人</view>
            <view class="empty-desc">你的所有联系人已经在群里了，或者没有符合搜索条件的联系人</view>
          </view>

          <!-- 联系人列表 -->
          <view class="contacts-list" v-else>
            <template v-for="(group, index) in groupedAddContacts" :key="index">
              <view class="letter-index">{{ group.letter }}</view>
              <view class="contact-item" v-for="contact in group.contacts" :key="contact.userId"
                @click="toggleSelect(contact)">
                <view class="contact-avatar">
                  <image :src="contact.avatar" mode="aspectFill" />
                </view>
                <view class="contact-info">
                  <view class="contact-name">{{ contact.nickname }}</view>
                </view>
                <view class="contact-action" :class="{
                  'add-btn': true,
                  'active': isSelected(contact)
                }">
                  <image src="@/static/img/groupMember/add.svg" mode="aspectFit" />
                </view>
              </view>
            </template>
          </view>
        </view>

        <!-- 移除成员模式 -->
        <view class="remove-mode" v-else-if="mode === 'remove'">
          <!-- 空状态 -->
          <view class="empty-state" v-if="filteredRemoveContacts.length === 0">
            <image src="@/static/img/groupMember/empty.svg" mode="aspectFit" />
            <view class="empty-title">没有符合条件的成员</view>
            <view class="empty-desc">尝试其他搜索关键词</view>
          </view>

          <!-- 群成员列表 -->
          <view class="contacts-list" v-else>
            <!-- 群主 -->
            <view class="letter-index">群主</view>
            <view class="contact-item">
              <view class="contact-avatar">
                <image :src="groupOwner.avatar" mode="aspectFill" />
              </view>
              <view class="contact-info">
                <view class="contact-name">{{ groupOwner.nickName }} (我)</view>
              </view>
            </view>

            <!-- 成员 -->
            <view class="letter-index">成员</view>
            <view class="contact-item" v-for="member in filteredRemoveContacts" :key="member.userId"
              @click="toggleSelect(member)">
              <view class="contact-avatar">
                <image :src="member.avatar" mode="aspectFill" />
              </view>
              <view class="contact-info">
                <view class="contact-name">{{ member.nickname }}</view>
              </view>
              <view class="contact-action" :class="{
                'remove-btn': true,
                'active': isSelected(member)
              }">
                <image src="@/static/img/groupMember/remove.svg" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>

        <!-- 查看成员模式 -->
        <view class="view-mode" v-else>
          <!-- 群成员列表 -->
          <view class="contacts-list">
            <!-- 群主 -->
            <view class="letter-index">群主</view>
            <view class="contact-item">
              <view class="contact-avatar">
                <image :src="groupOwner.avatar" mode="aspectFill" />
              </view>
              <view class="contact-info">
                <view class="contact-name">{{ groupOwner.nickName }} (我)</view>
              </view>
            </view>

            <!-- 成员 -->
            <view class="letter-index">成员</view>
            <view class="contact-item" v-for="member in groupMembers" :key="member.userId">
              <view class="contact-avatar">
                <image :src="member.avatar" mode="aspectFill" />
              </view>
              <view class="contact-info">
                <view class="contact-name">{{ member.nickname }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="bottom-actions" v-if="mode !== 'view'">
      <view class="action-button confirm-add" :class="{ 'no-selection': selectedCount === 0 }" v-if="mode === 'add'"
        @click="confirmAdd">
        添加选中成员
      </view>
      <view class="action-button confirm-remove" :class="{ 'no-selection': selectedCount === 0 }" v-else
        @click="confirmRemove">
        移除选中成员
      </view>
    </view>


  </view>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useGroupStore } from '@/pinia/group/group';
import { useUserStore } from '@/pinia/user/user';
import { useFriendStore } from '@/pinia/friend/friend';
import { onLoad } from '@dcloudio/uni-app';
import { addGroupMemberApi, removeGroupMemberApi } from '@/api/group';
import type { IGroupMember } from '@/types/ajax/group';
import type { IFriendInfo } from '@/types/ajax/friend';

export default defineComponent({
  name: 'GroupSetting',
  setup() {
    const statusBarHeight = ref(0);
    const mode = ref<'add' | 'remove' | 'view'>('view');
    const searchText = ref('');
    const selectedContacts = ref<IFriendInfo[]>([]);
    const selectedMembers = ref<IGroupMember[]>([]);
    const groupStore = useGroupStore();
    const userStore = useUserStore();
    const friendStore = useFriendStore();
    const groupId = ref('');

    // 获取状态栏高度
    onMounted(() => {
      const systemInfo = uni.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 0;
      console.log('statusBarHeight', statusBarHeight.value);
      getGroupsMembers()
    });

    const getGroupsMembers = async () => {

      const result = await groupStore.getGroupMembersApi(groupId.value);
      if (result.code === 0) {
        // groupMembers.value = result.result.list;
      }
    };


    // 页面标题
    const pageTitle = computed(() => {
      switch (mode.value) {
        case 'add':
          return '添加成员';
        case 'remove':
          return '移除成员';
        default:
          return '群成员';
      }
    });

    // 选中的成员数量
    const selectedCount = computed(() => {
      return selectedContacts.value.length + selectedMembers.value.length;
    });

    // 群主信息
    const groupOwner = computed(() => {
      const currentGroup = groupStore.getMembersByGroupId(groupId.value);
      if (!currentGroup) return {
        userId: userStore.userInfo.userId,
        nickName: userStore.userInfo.nickName,
        avatar: userStore.userInfo.avatar,
        role: 2
      };
      
      // 查找群主
      const owner = currentGroup.find(member => member.role === 2);
      if (!owner) return {
        userId: userStore.userInfo.userId,
        nickName: userStore.userInfo.nickName,
        avatar: userStore.userInfo.avatar,
        role: 2
      };
      
    return {
        userId: owner.userId,
        nickName: owner.nickName,
        avatar: owner.avatar,
        role: owner.role
      };
    });

    // 群成员列表
    const groupMembers = computed(() => {
      const currentGroup = groupStore.getMembersByGroupId(groupId.value);
      console.error('groupMembers', currentGroup);
      if (!currentGroup) return [];
      return currentGroup.filter(member => member.userId !== userStore.userInfo.userId);
    });

    // 过滤后的添加联系人列表
    const filteredAddContacts = computed(() => {
      const currentMemberIds = new Set(groupMembers.value.map(member => member.userId));
      return friendStore.friendList.filter(friend => !currentMemberIds.has(friend.userId));
    });

    // 过滤后的移除联系人列表
    const filteredRemoveContacts = computed(() => {
      return groupMembers.value;
    });

    // 按字母分组的添加联系人
    const groupedAddContacts = computed(() => {
      const groups: { letter: string; contacts: IFriendInfo[] }[] = [];
      const contacts = filteredAddContacts.value;

      contacts.forEach(contact => {
        const letter = contact.nickname.charAt(0).toUpperCase();
        let group = groups.find(g => g.letter === letter);
        if (!group) {
          group = { letter, contacts: [] };
          groups.push(group);
        }
        group.contacts.push(contact);
      });

      return groups.sort((a, b) => a.letter.localeCompare(b.letter));
    });

    // 切换选择状态
    const toggleSelect = (contact: IFriendInfo | IGroupMember) => {
      if (mode.value === 'add') {
        const index = selectedContacts.value.findIndex(c => c.userId === contact.userId);
        if (index === -1) {
          selectedContacts.value.push(contact as IFriendInfo);
        } else {
          selectedContacts.value.splice(index, 1);
        }
      } else {
        const index = selectedMembers.value.findIndex(m => m.userId === contact.userId);
        if (index === -1) {
          selectedMembers.value.push(contact as IGroupMember);
        } else {
          selectedMembers.value.splice(index, 1);
        }
      }
    };

    // 检查是否已选择
    const isSelected = (contact: IFriendInfo | IGroupMember) => {
      if (mode.value === 'add') {
        return selectedContacts.value.some(c => c.userId === contact.userId);
      } else {
        return selectedMembers.value.some(m => m.userId === contact.userId);
      }
    };

    // 处理搜索
    const handleSearch = (event: Event) => {
      const target = event.target as HTMLInputElement;
      searchText.value = target.value;
    };

    // 确认添加
    const confirmAdd = async () => {
      if (selectedContacts.value.length === 0) return;
      try {
        await addGroupMemberApi({
          groupId: groupId.value,
          userIds: selectedContacts.value.map(contact => contact.userId)
        });
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        });
        goBack();
      } catch (error) {
        uni.showToast({
          title: '添加失败',
          icon: 'error'
        });
      }
    };

    // 确认移除
    const confirmRemove = async () => {
      if (selectedMembers.value.length === 0) return;
      try {
        const result =  await removeGroupMemberApi({
          groupId: groupId.value,
          memberIds: selectedMembers.value.map(member => member.userId)
        });
        if (result.code !== 0) {
          uni.showToast({
            title: '移除失败',
            icon: 'error'
          });
          return;
        }
        uni.showToast({
          title: '移除成功',
          icon: 'success'
        });
        // goBack();
      } catch (error) {
        uni.showToast({
          title: '移除失败',
          icon: 'error'
        });
      }
    };

    // 返回上一页
    const goBack = () => {
      uni.navigateBack();
    };

    // 处理完成按钮点击
    const handleComplete = () => {
      if (selectedCount.value > 0) {
        if (mode.value === 'add') {
          confirmAdd();
        } else {
          confirmRemove();
        }
      } else {
        goBack();
      }
    };

    onLoad((options) => {
      if (options?.id) {
        groupId.value = options.id;
      }
      if (options?.mode) {
        mode.value = options.mode as 'add' | 'remove' | 'view';
      }
    });
    return {
      statusBarHeight,
      mode,
      searchText,
      selectedContacts,
      selectedMembers,
      pageTitle,
      selectedCount,
      groupOwner,
      groupMembers,
      filteredAddContacts,
      filteredRemoveContacts,
      groupedAddContacts,
      toggleSelect,
      isSelected,
      handleSearch,
      confirmAdd,
      confirmRemove,
      goBack,
      handleComplete
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
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.back-button {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: $background-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);

  &:active {
    transform: scale(0.95);
  }

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

.complete-button {
  color: $primary;
  font-size: 28rpx;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s cubic-bezier(0.33, 1, 0.68, 1);

  &:active {
    opacity: 0.7;
  }
}

.content-wrapper {
  padding: 88rpx 32rpx 24rpx;
}

.search-container {
  margin-bottom: 24rpx;
  position: relative;
  background: $background;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.search-input {
  width: 100%;
  height: 88rpx;
  background: $background;
  border: none;
  border-radius: 24rpx;
  padding: 0 32rpx 0 88rpx;
  font-size: 28rpx;
  color: $text-title;
  transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);

  &:focus {
    outline: none;
    background: $background-secondary;
  }
}

.search-icon {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);

  image {
    width: 40rpx;
    height: 40rpx;
    color: $text-auxiliary;
  }
}

.contacts-list {
  background: $background;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  position: relative;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);

  &:active {
    background: $background-secondary;
  }

  &:after {
    content: '';
    position: absolute;
    left: 32rpx;
    right: 32rpx;
    bottom: 0;
    height: 2rpx;
    background: $divider;
  }

  &:last-child:after {
    display: none;
  }
}

.contact-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  position: relative;
  overflow: hidden;
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

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: 28rpx;
  font-weight: 500;
  color: $text-title;
}

.contact-action {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);

  &:active {
    transform: scale(0.95);
  }

  &.add-btn {
    background: $background-secondary;
    border: 2rpx dashed $text-auxiliary;

    &.active {
      background: $primary;
      border: none;

      image {
        color: white;
      }
    }
  }

  &.remove-btn {
    background: $background-secondary;
    border: 2rpx dashed $text-auxiliary;

    &.active {
      background: $error;
      border: none;

      image {
        color: white;
      }
    }
  }

  image {
    width: 32rpx;
    height: 32rpx;
  }
}

.letter-index {
  padding: 16rpx 32rpx;
  background-color: $background-secondary;
  font-size: 24rpx;
  font-weight: 500;
  color: $text-body;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background: $background;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  z-index: 50;
}

.action-button {
  flex: 1;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);

  &:active {
    transform: translateY(2rpx);
  }

  &.confirm-add {
    background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(255, 125, 69, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    }
  }

  &.confirm-remove {
    background: $error;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(255, 82, 82, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    }
  }

  &.no-selection {
    background: $divider;
    color: $text-auxiliary;
    pointer-events: none;
  }
}

.selection-info {
  position: fixed;
  bottom: 120rpx;
  left: 32rpx;
  right: 32rpx;
  background: rgba(45, 52, 54, 0.9);
  border-radius: 24rpx;
  color: white;
  padding: 24rpx 32rpx;
  font-size: 24rpx;
  text-align: center;
  transform: translateY(40rpx);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  z-index: 60;
  backdrop-filter: blur(8rpx);
  -webkit-backdrop-filter: blur(8rpx);

  &.show {
    transform: translateY(0);
    opacity: 1;
  }
}

.empty-state {
  padding: 96rpx 0;
  text-align: center;

  image {
    width: 160rpx;
    height: 160rpx;
    color: $divider;
    margin-bottom: 48rpx;
  }
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-body;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: $text-auxiliary;
  max-width: 480rpx;
  margin: 0 auto;
  line-height: 1.5;
}

.content-container {
  padding-bottom: 152rpx;
}
</style>
