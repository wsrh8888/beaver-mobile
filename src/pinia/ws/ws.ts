import type { IWsContent, IWsStore } from '@/types/ws/ws';
import { defineStore } from 'pinia';
import { useChatStore } from '../chat/chat';
import { useFriendStore } from '../friend/friend';

export const useWsStore = defineStore('useWsStore', {
  state: () => ({
    
  }),
  getters: {
  },
  actions: {
    parseWsMessage(data: IWsStore) {
      switch (data.command) {
        case 'COMMON_CHAT_MESSAGE':
        this.parseCommonChatMessage(data.content);
        case 'COMMON_UPDATE_MESSAGE':
          this.parseCommonUpdateMessage(data.content);
          break;
        default:
          console.log('default', data);
          break;
      }
    },
    async parseCommonUpdateMessage(content: IWsContent) {
      const friendStore = useFriendStore();
      const chatStore = useChatStore();

      switch (content.data.type) {
        case "user_update_info":
           const userInfo = await friendStore.updateFriendInfo(content.data.body.userId);
           chatStore.updateBaseInfo({
              conversationId: userInfo.conversationId,
              avatar: userInfo.avatar,
              nickname: userInfo.nickname,
           })
          break;
        case "user_valid_type_update":
          friendStore.updateFriendInfo(content.data.body.userId);
          // 更新最近聊天列表
          chatStore.initRecentChatApi();
          break;
      }
    },
    parseCommonChatMessage(content: IWsContent) {
      const chatStore = useChatStore();
      switch (content.data.type) {
        case "private_message_send":
          chatStore.updateRecentChatList(
            {
              conversationId: content.data.body.conversationId,
              avatar: content.data.body.sender.avatar,
              create_at: content.data.body.create_at,
              is_top: false,
              msg_preview: content.data.body.msgPreview,
              nickname: content.data.body.sender.nickname,
            }
          );
          break;
      }
    }
  },
});
