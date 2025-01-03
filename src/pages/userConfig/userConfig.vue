<template>
  <view class="userConfig_content">
    <HeaderComponent title="聊天信息" @goBack="goBack"></HeaderComponent>
    <view v-for="(module, moduleIndex) in userConfigData" :key="moduleIndex" class="userConfig_item">
      <view v-for="item in module" :key="item.id" class="module_item">

        <view v-if="item.type === 'avatar'" class="module_avatar">
          <image class="avatar" :src="friendInfo.avatar" mode="aspectFill"></image>
          <view class="nickname">{{ friendInfo.nickname }}</view>
          <image class="more_icon" src="@/static/img/common/jump_right.svg" mode="aspectFit"></image>
        </view>

        <view v-else-if="item.type === 'logSearch'" class="module_log_search">
          <view class="left">{{ item.title }}</view>
          <view class="right">
            <view>{{ item.right }}</view>
            <image class="more_icon" src="/static/arrow_right.png" mode="aspectFit"></image>
          </view>
        </view>

        <view v-else-if="item.type === 'radio'" class="module_radio">
          <view class="left">{{ item.title }}</view>
          <view class="right">
            <switch style="transform:scale(0.8)" :checked="item.checked" @change="toggleRadio(item.value)" />
          </view>
        </view>



      </view>
    </view>
    <view class="module_danger" @click="handleClickDelete">
      <view class="danger-text">删除好友</view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import HeaderComponent from "@/component/header/header.vue";
import { useFriendStore } from '@/pinia/friend/friend';
import { onLoad } from '@dcloudio/uni-app';
import { userConfigData } from './userConfig';
import { deleteFriendAPi } from '@/api/friend';

export default defineComponent({
  components: {
    HeaderComponent
  },
  setup() {
    const friendStore = useFriendStore();
    const conversationId = ref<string>('');

    const goBack = () => {
      uni.navigateBack();
    };

    const friendInfo = computed(() => {
      return friendStore.getFriendInfoById(conversationId.value);
    });

    const toggleRadio = (value: string) => {
      console.log(`Toggle radio: ${value}`);
    };

    onLoad((option: any) => {
      conversationId.value = option.id;
    });

    const handleClickDelete = () => {
      deleteFriendAPi({
        friendId: friendInfo.value.userId
      })
        .then(() => {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          uni.reLaunch({
            url: '/pages/home/home',
              animationType: 'pop-in',
              animationDuration: 200
          });
        })
    };


    return {
      handleClickDelete,
      friendInfo,
      userConfigData,
      goBack,
      toggleRadio
    };
  }
});
</script>

<style lang="scss" scoped>
.userConfig_content {
  background-color: #f5f5f5;
  min-height: 100vh;

  .userConfig_item {
    background-color: #fff;
    margin: 30rpx;
    border-radius: 20rpx;
    overflow: hidden;

    .module_item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .module_avatar {
        display: flex;
        align-items: center;
        width: 100%;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin-right: 12px;
        }

        .nickname {
          flex: 1;
        }

        .more_icon {
          width: 20px;
          height: 20px;
        }
      }

      .module_log_search {
        display: flex;
        justify-content: space-between;
        width: 100%;

        .left {
          font-size: 16px;
        }

        .right {
          display: flex;
          align-items: center;

          .more_icon {
            margin-left: 8px;
            width: 20px;
            height: 20px;
          }
        }
      }

      .module_radio {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;

        .left {
          font-size: 16px;
        }

        .right {
          .switch {
            --switch-width: 40px;
            --switch-height: 20px;
            --switch-radius: 10px;
            --switch-color-on: #4cd964;
            --switch-color-off: #e5e5e5;
            --switch-circle-size: 17px;
            --switch-circle-margin: 1.5px;
          }
        }
      }


    }
  }

  .module_danger {
    color: #ff4d4f;
    text-align: center;
    background: #fff;
    padding: 24rpx 36rpx;
    box-sizing: border-box;
    margin: 0 30rpx;
    border-radius: 20rpx;

    .danger-text {
      font-size: 16px;
    }
  }
}
</style>
