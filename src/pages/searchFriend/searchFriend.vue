<template>
  <view class="search__container">
    <HeaderComponent title="添加好友" @go-back="handleClickGoBack" :hide-left="false">
      <template #right-content>

      </template>
    </HeaderComponent>

    <view class="search__content">
      <view class="search-box">
        <uni-icons type="search" color="#888B92" size="20"></uni-icons>
        <input type="text" placeholder-class="place" v-model="searchPhone" placeholder="请输入手机号" />
        <button @click="searchFriend" class="search-button">搜索</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { getSearchFriendApi } from '@/api/friend';
import { defineComponent, ref } from 'vue';
import HeaderComponent from '@/component/header/header.vue';

export default defineComponent({
  components: {
    HeaderComponent
  },
  setup() {
    const searchPhone = ref("");
    const handleClickGoBack = () => {
      uni.reLaunch({
        url: "/pages/friend/friend",
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    };
    const searchFriend = () => {
      getSearchFriendApi({ phone: searchPhone.value }).then((res) => {
        if (res.code === 0) {
          // 跳转到好友详情页面
          uni.navigateTo({
            url: `/pages/detail/detail?id=${res.result.userId}`,
            animationType: 'slide-in-right',
            animationDuration: 200
          });

        }
      });
    };
    return {
      searchFriend,
      searchPhone,
      handleClickGoBack
    };
  }
});
</script>

<style lang="scss" scoped>
.search__container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .search__content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0;
    background-color: #f5f5f5;

    .search-box {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 700rpx;
      padding: 5px 10rpx;
      border-radius: 50rpx;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .uni-icons {
        margin-right: 10rpx;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        background: none;
        font-size: 30rpx;
        color: #333333;
      }

      .search-button {
        display: inline-block;
        padding: 0 20rpx;
        border: none;
        border-radius: 30rpx;
        /* Make the edge more round */
        background-color: #4caf50;
        text-align: center;
        font-size: 24rpx;
        /* Reduce the font size */
        color: #ffffff;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #45a046;
        }

        &:active {
          background-color: #409041;
        }
      }
    }
  }
}
</style>
