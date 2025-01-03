<template>
  <view class="setting_content">
    <HeaderComponent title="设置" @goBack="goBack" />
    <view v-for="item in dataList" :key="item.id" class="setting_item" @click="handleClickItem(item)">
      <view class="left">
        <text>{{ item.title }}</text>
      </view>
      <view class="right">
        <text v-if="item.type === 'text'" class="text"></text>
      </view>
      <image src="@/static/img/mine/jump_right.svg" class="details-arrow" />
    </view>
    <view class="exitBtn" @click="showExitDialog">退出登录</view>
    <uni-popup ref="exitDialog" type="dialog" :maskClick="false">
      <uni-popup-dialog
        title="确认退出吗？"
        :content="''"
        :before-close="['confirm', 'cancel']"
        @confirm="handleLogout"
        @close="handleCancel"
      >
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useUserStore } from '@/pinia/user/user';
import HeaderComponent from "@/component/header/header.vue";
import { dataList } from './setting';
import { removeLocal } from '@/utils/local';
import { useCommonStore } from '@/pinia/common/common';

export default defineComponent({
  components: {
    HeaderComponent
  },
  setup() {
    const useStore = useUserStore();
    const commonStore = useCommonStore();
    const userInfo = computed(() => useStore.userInfo);
    
    onMounted(() => {
      console.error(userInfo);
    });

    const goBack = () => {
      uni.navigateBack();
    };

    const handleClickItem = (item) => {
      if (item.id === 2) {
        uni.navigateTo({
          url: '/pages/about/about'
        });
      }
    };

    const exitDialog = ref(null);

    const showExitDialog = () => {
      (exitDialog.value as any).open();
    };
    
    const handleLogout = () => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
      commonStore.resetApp()
      handleCancel()
    };
    const handleCancel = () => {
      (exitDialog.value as any).close();
    };
    return {
      handleCancel,
      handleClickItem,
      goBack,
      dataList,
      userInfo,
      exitDialog,
      showExitDialog,
      handleLogout,
    };
  }
});
</script>

<style lang="scss" scoped>
page {
  background: #f5f5f5;
}
.setting_content {
  .setting_item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    .left {
      flex: 1;
    }
    .right {
      .text {
        color: #aaa;
      }
      .image {
        width: 100rpx;
        height: 100rpx;
      }
    }
    .details-arrow {
      width: 30rpx;
      height: 30rpx;
      margin-left: 10rpx;
    }
  }
  .exitBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    height: 80rpx;
    border-radius: 30rpx;
    margin: 0 auto;
    background: #d8807f;
    color: #fff;
    margin-top: 50rpx;
  }
}
</style>
