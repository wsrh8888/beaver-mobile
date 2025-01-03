<template>
  <view class="apply__content">
    <HeaderComponent title="好友申请" @goBack="goBack"></HeaderComponent>
    <scroll-view class="apply__scroll" scroll-y>

      <view class="apply__list">
        <view v-for="(item, index) in applyList" :key="index" :class="['apply__item']">
          <view class="avatar">
            <image :src="item.avatar" mode="aspectFill"></image>
          </view>
          <view class="details">
            <view class="nickname">{{ item.nickname }}</view>
            <view class="additional-message">{{ item.message ? item.message : '请求加为好友' }}</view>
          </view>
          <view class="sender__status">
            <template v-if="item.flag === 'send'">
              <view v-if="item.status === 1" class="status">已同意</view>
              <view v-else-if="item.status === 2" class="status">已拒绝</view>
              <view v-else class="status">等待验证</view>
            </template>
            <template v-if="item.flag === 'rev'">
              <view v-if="item.status === 1" class="status">已同意</view>
              <view v-else-if="item.status === 2" class="status">已拒绝</view>
              <view v-else class="status">
                <button class="agree" @click="handleClickAgree(item.id)">同意</button>
              </view>
            </template>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getFriendValidListApi } from '@/api/apply'; // 假设有一个新的API同意好友申请
import type { IValidInfo } from '@/types/ajax/friend';
import { valiFrienddAPi } from '@/api/friend';
import HeaderComponent from "@/component/header/header.vue";

export default defineComponent({
  components: {
    HeaderComponent
  },
  setup() {
    const applyList = ref<Array<IValidInfo>>([]);

    onMounted(() => {
      getFriendValidListApi({
        page : 1,
        limit: 100
      }).then((res) => {
        if (res.code === 0) {
          applyList.value = res.result.list;
        }
      });
    });

    const handleClickAgree = (id: number) => {
      valiFrienddAPi({
        verifyId: id,
        status: 1
      }).then((res) => {
        if (res.code === 0) {
          // 修改本地数据
          applyList.value = applyList.value.map((item) => {
            if (item.id === id) {
              item.status = 1;
            }
            return item;
          });
        } else {
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      });
    }

    const goBack = () => {
      uni.reLaunch({
        url: "/pages/friend/friend",
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    }

    const handleClickAddFriend = () => {
      uni.navigateTo({
        url: "/pages/searchFriend/searchFriend",
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    }

    return {
      handleClickAgree,
      handleClickAddFriend,
      goBack,
      applyList,
    };
  }
});
</script>

<style lang="scss" scoped>
page {
  background: #f5f5f5;
}
.apply__scroll {
  height: calc(100vh - 90rpx);
  /* Adjust height based on your header's height */
  overflow-y: scroll;
  box-sizing: border-box;
}
.apply__header {
  height: 50px;
  /* Adjust the height as needed */
  display: flex;
  align-items: center;

  .left {
    position: absolute;
    left: 30rpx;

    .goBack {
      width: 40rpx;
      height: 40rpx;
      overflow: hidden;
    }
  }

  .center {
    width: 100%;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
  }

  .right {
    position: absolute;
    right: 30rpx;

    .add_image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}

.apply__list {
  background-color: #f5f5f5;
  .sender__status {
    font-size: 28rpx;
    .agree {
      font-size: 24rpx;
    }
  }
}

.apply__item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 14rpx 30rpx;
  height: 164rpx;
  box-sizing: border-box;

  .avatar {
    width: 105rpx;
    height: 105rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .details {
    margin-left: 10px;
    flex: 1;

    .nickname {
      font-size: 16px;
      font-weight: bold;
    }

    .additional-message {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }

    .status {
      font-size: 12px;
      color: #ff9800;
      margin-top: 4px;
    }

    .actions {
      margin-top: 10px;

      .agree-button {
        padding: 6px 12px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
}
</style>
