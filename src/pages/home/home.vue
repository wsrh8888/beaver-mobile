<template>
  <view class="home__content">

    <HeaderComponent title="消息" :hideLeft="true">
      <template #right-content>
        <MenusComponents @change="handleChangeMenus" :menu-options="homeMenusList" top="80rpx">
          <image src="@/static/img/friend/add.svg" class="add_image" />
        </MenusComponents>
      </template>
    </HeaderComponent>

    <scroll-view class="chat-list" scroll-y>
      <uni-swipe-action v-for="(chat, index) in chatList" :key="chat.conversationId">
        <uni-swipe-action-item @click="handleChatClick(chat)" :index="index"
          @click:remove="() => handleSwipeAction('delete', chat, index)"
          @click:collect="() => handleSwipeAction('top', chat, index)">
          <view class="chat-item" @click.stop="handleChatClick(chat)">
            <image :src="chat.avatar" class="chat-avatar" />
            <view class="chat-info">
              <view class="chat-name-time">
                <text class="chat-name">{{ chat.nickname }}</text>
              </view>
              <text class="chat-latest-message">{{ chat.msg_preview }}</text>
            </view>
          </view>
          <template v-slot:right>
            <view class="slot-button" @click="handleSwipeAction('top', chat, index)">
              <text class="slot-button-text top">置顶</text>
            </view>
            <view class="slot-button" @click="handleSwipeAction('delete', chat, index)">
              <text class="slot-button-text delete">删除</text>
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </scroll-view>
  </view>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'; // 注意这里引入 computed
import { useChatStore } from '@/pinia/chat/chat'; // 修改路径以匹配您的实际路径
import { homeMenusList } from './home';
import MenusComponents from '@/component/menus/menus.vue';
import type { IChatInfo } from '@/types/ajax/chat';
import HeaderComponent from '@/component/header/header.vue';
import { useFriendStore } from '@/pinia/friend/friend';
import { parseQrcode } from '@/utils/qrcode';

export default defineComponent({
  components: {
    MenusComponents,
    HeaderComponent
  },
  setup() {
    const chatStore = useChatStore();

    // 使用computed数据
    const chatList = computed(() => chatStore.recentChatList);
    const friendInfoStore = useFriendStore();
    const handleChangeMenus = (item: any) => {
      if (item.id === 1) {
        uni.navigateTo({
          url: "/pages/searchFriend/searchFriend",
          animationType: 'slide-in-right',
          animationDuration: 200
        });
      }else if (item.id === 3) {
        // 扫码
        uni.scanCode({
          success: (res) => {
            console.log(res);
            parseQrcode(JSON.parse(res.result ));
          }
        });
        
      }
    };

    const handleChatClick = (chat: IChatInfo) => {
      // 跳转到聊天详情页面
      console.log(`跳转到聊天详情页面: `, chat);
      uni.navigateTo({
        url: `/pages/chat/chat?id=${chat.conversationId}`,
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    };

    const handleSwipeAction = (event: any, chat: IChatInfo, index: number) => {
      const action = event.item.content.data.action;
      if (action === 'top') {
        // 置顶操作逻辑
        console.log(`置顶聊天: ${chat.conversationId}`);
      } else if (action === 'delete') {
        // 删除操作逻辑
        console.log(`删除聊天: ${chat.conversationId}`);
        chatStore.recentChatList.splice(index, 1); // 从列表中移除项
      }
    };



    return {
      handleChangeMenus,
      handleChatClick,
      handleSwipeAction,
      homeMenusList,
      chatList,
    };
  }
});
</script>

<style scoped lang="scss">
.home__content {

  .chat-list {
    height: calc(100vh - 180rpx);
    /* Adjust height based on your header's height */
    overflow-y: scroll;
    box-sizing: border-box;
  }

  .chat-item {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #ebebeb;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 18rpx 30rpx;

    .chat-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 10rpx;
    }

    .chat-info {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-left: 24rpx;

      .chat-name-time {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;

        .chat-name {
          color: #303133;
          font-weight: 700;
          font-size: 26rpx;
        }

        .chat-time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .chat-latest-message {
        font-size: 24rpx;
        color: #aaa;
      }
    }
  }

  .slot-button {
    width: 180rpx;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slot-button-text {
    flex: 1;
    height: 100%;
    color: #fff;
    font-size: 28rpx;
    justify-content: center;
    text-align: center;
    display: flex;
    align-items: center;

    &.top {
      background-color: rgb(0, 129, 255);
    }

    &.delete {
      background-color: rgb(221, 82, 77);
    }
  }
}

.add_image {
  width: 50rpx;
  height: 50rpx;
}
</style>
