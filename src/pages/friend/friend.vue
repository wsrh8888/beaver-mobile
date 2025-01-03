<template>
  <view class="friend__content">
    <HeaderComponent title="通讯录" :hideLeft="true">
      <template #right-content>
        <MenusComponents @change="handleChangeMenus" :menu-options="menusList" top="80rpx">
          <image :src="addSvg" class="add_image" />
        </MenusComponents>
      </template>
    </HeaderComponent>

    <view class="menus__content">
      <view class="menus__item" v-for="item of dataList" :key="item.id" @click="handleClickMenus(item)">
        <view class="left">
          <view class="imgBg">
            <image :src="item.icon" class="image" />
          </view>
          <text>{{ item.title }}</text>
        </view>
      </view>
    </view>
    <next-indexed-xlist nameKey="nickname" imgKey="avatar" idKey="userId" :dataList="friendList" :showAvatar="true" @itemclick="handlecreateConversation"></next-indexed-xlist>

  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useFriendStore } from '@/pinia/friend/friend'; // 修改路径以匹配您的实际路径
import { dataList, menusList } from './data';
import MenusComponents from '@/component/menus/menus.vue';
import addSvg from '@/static/img/friend/add.svg';
import HeaderComponent from '@/component/header/header.vue';
import { parseQrcode } from '@/utils/qrcode';

export default defineComponent({
  components: {
    HeaderComponent,
    MenusComponents,
  },
  setup() {
    const friendStore = useFriendStore();

    // 使用computed数据
    const friendList = computed(() => friendStore.friendList);

    const handleChangeMenus = (item: any) => {
      if (item.id === 1) {
        // 跳转到创建群聊页面
        uni.navigateTo({
          url: "/pages/searchFriend/searchFriend",
          animationType: 'slide-in-right',
          animationDuration: 200
        });
      }  else if (item.id === 3) {
        // 扫码
        uni.scanCode({
          success: (res) => {
            console.log(res);
            parseQrcode(JSON.parse(res.result ));
          }
        });
        
      }
    };

    const handleClickMenus = (item: any) => {
      if (item.id === 1) {
        // 跳转到好友申请页面
        uni.navigateTo({
          url: "/pages/apply/apply",
          animationType: 'slide-in-right',
          animationDuration: 200
        });
      } else if (item.id === 3) {
        // 跳转到标签页面
        uni.scanCode({
          success: (res) => {
            console.log(res);
            parseQrcode(JSON.parse(res.result ));
          }
        });
      }
    };

    const handlecreateConversation = (e) => {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${e.userId}`,
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    };

    return {
      menusList,
      addSvg,
      handleClickMenus,
      handleChangeMenus,
      dataList,
      friendList,
      handlecreateConversation,
    };
  }
});
</script>
<style scoped lang="scss">
.friend__content {
  .menus__content {
    .menus__item {
      display: flex;
      height: 100rpx;
      padding: 0 40rpx;
      justify-content: space-between;
      align-items: center;
      margin: 18rpx 0;
      background-color: white;
      border-bottom: 1px solid #f7f7f7;

      .left {
        display: flex;
        align-items: center;
        width: 250rpx;
        justify-content: flex-start;

        .imgBg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 90rpx;
          height: 90rpx;
          border-radius: 20rpx;
          color: #fff !important;
          overflow: hidden;
          margin-right: 30rpx;

          .image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .add_image {
    width: 50rpx;
    height: 50rpx;
  }
  .next-scroll-left{
    padding-top: 0;
  }
  .next-search{
    display: none;
  }
}
</style>
