import { defineStore } from 'pinia';
import { getChatHistoryApi, getRecentChatListApi } from '@/api/chat';
import type { IChatHistory, IChatInfo } from '@/types/ajax/chat';

export const useChatStore = defineStore('useChatStore', {
  state: (): { recentChatList: IChatInfo[], chatHistory: Map<string, IChatHistory> } => ({
    /**
     * @description: 最新聊天列表
     */
    recentChatList: [],
    /**
     * @description: 聊天记录
     */    
    chatHistory: new Map()
  }),

  getters: {
    // 这里可以添加一些根据状态计算得出的属性
  },

  actions: {
    reset() {
      this.recentChatList = [];
      this.chatHistory = new Map();
    },
    /**
     * @description: 获取最近聊天列表
     */
    async initRecentChatApi() {
      const getRecentChatApi = await getRecentChatListApi();
      if (getRecentChatApi.code === 0) {
        this.recentChatList = getRecentChatApi.result.list || [];
      }
    },
    updateBaseInfo(data: IChatInfo) {
      this.recentChatList = this.recentChatList.map(item => {
        if (item.conversationId === data.conversationId) {
          return {
            ...item,
            ...data
          };
        }
        return item;
      });
    },
    /**
     * @description: 收到消息更新最近聊天列表
     * @param {IChatInfo} data - 新收到的消息数据
     */
    updateRecentChatList(data: IChatInfo) {
      const index = this.recentChatList.findIndex(item => item.conversationId === data.conversationId);
      if (index !== -1) {
        // 存在则更新内容并放到第一项
        this.recentChatList[index].msg_preview = data.msg_preview;
        const updatedItem = this.recentChatList.splice(index, 1)[0];
        this.recentChatList.unshift(updatedItem);
      } else {
        // 不存在则插入新的聊天记录到第一项
        this.recentChatList.unshift(data);
      }
      console.log('更新后的最近聊天列表', this.recentChatList);
    },
  },
});
