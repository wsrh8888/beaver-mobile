<template>
  <view class="mineInfo_content">
    <HeaderComponent title="个人信息" @goBack="goBack"></HeaderComponent>

    <view v-for="item of dataList" :key="item.id" class="mineInfo_item" @click="handleClickItem(item)">
      <view class="left">
        <text>{{ item.title }}</text>
      </view>
      <view class="right">
        <text class="text" v-if="item.type === 'text'">{{ userInfo[item.value] }}</text>
        <image v-if="item.type === 'image'" :src="userInfo[item.value]" class="image" />
      </view>
      <image src="@/static/img/mine/jump_right.svg" class="details-arrow" />
    </view>
    <uv-popup ref="popup" mode="center" round="10" :overlay="true">
        <view class="popup-content">
          <uv-textarea v-model="nickname" placeholder="请输入昵称"></uv-textarea>
          <view class="btn">
            <uv-button type="primary" color="#666" :plain="true"  size="mini" text="取消" @click="close"></uv-button>
          <uv-button type="primary" size="mini" text="确定" @click="changeNickname"></uv-button>

          </view>
        </view>
	</uv-popup>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { dataList } from './mineInfo';
import { useUserStore } from '@/pinia/user/user';
import HeaderComponent from "@/component/header/header.vue";
import { openAlbum } from '@/utils/upload';
import { updateInfoApi } from '@/api/user';
export default defineComponent({
  components:{
    HeaderComponent
  },
  setup() {
    const useStore = useUserStore();
		const userInfo = computed(() => useStore.userInfo);
    let popup = ref();
    const nickname = ref('');

    onMounted(() => {
      console.error(userInfo);
    })
    const goBack = () => {
      uni.navigateBack();
    };

    const open = () => {
      popup.value.open();
    };
    const close = () => {
      nickname.value = '';
      popup.value.close();
    };
    const updateInfo = (data:object) => {
      updateInfoApi(data).then((res) => {
        useStore.initUserInfoApi()
        close()
      });
    };
    const changeNickname = () => {
      updateInfo({nick_name: nickname.value});
    };
    const handleClickItem = (item) => {
      if (item.value === 'avatar') {
        openAlbum('album').then((src) => {
          updateInfo({avatar: src});
        });
      } else if (item.type === 'navigateTo') {
        uni.navigateTo({
          url: item.path
        });
      } else if (item.type === 'text') {
        open();
      }
    };

    return {
      goBack,
      handleClickItem,
      userInfo,
      dataList,
      popup,
      changeNickname,
      nickname,
      close
    };
  }
});
</script>

<style lang="scss" scoped>
page {
	background: #f5f5f5;
}
.mineInfo_content {
  .mineInfo_item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    .left {
      flex: 1;
    }
    .right{
      .text {
        color: #aaa;
      }
      .image{
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
  .popup-content{
    width: 400rpx;
   padding: 20rpx;
   border-radius: 20rpx;
   .btn{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20rpx;
    margin-top: 20rpx;
   }
  }
}
</style>
