import { defineStore } from 'pinia';
import { useFriendStore } from '../friend/friend';
import { useChatStore } from '../chat/chat';
import { useUserStore } from '../user/user';

import type { IConversationInfo } from '@/types/store/common';
import { removeLocal } from '@/utils/local';
import WsManager from '@/ws-manager/ws'
export const useCommonStore = defineStore('useCommonStore', {
  state: () => ({}),
  getters: {
    /**
     * @description: 根据传入的Id获取会话信息，可能是friendMap或
     * @param {string} id - 会话的唯一标识符
     * @returns {IConversationInfo} 返回会话信息
     * @throws {Error} 如果没有找到会话信息，抛出错误
     */
    getConversationInfo: (state) => {
      return (id: string): IConversationInfo => {
        // 获取friendStore的实例
        const friendStore = useFriendStore();
        
        const friendList = friendStore.friendList;

        let index = friendList.findIndex(item => item.conversationId === id)
        if (index !== -1) {
          console.error(111, index);
          const result = friendList[index];
         
          console.log(111, result);
          return {
            conversationId: result.conversationId,
            title: result.nickname,
            avatar: result.avatar
          }
        } else {
          return {} as any
         }
      };
    },
    
  },
  actions: {
    resetApp() {
      removeLocal('token')
      WsManager.close()
      const friendStore = useFriendStore();
      const chatStore = useChatStore();
      const userStore = useUserStore();
      friendStore.reset()
      chatStore.reset()
      userStore.reset()
    }
  }
});


