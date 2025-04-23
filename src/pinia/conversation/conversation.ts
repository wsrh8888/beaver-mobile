import { defineStore } from 'pinia';
import { getRecentChatListApi } from '@/api/chat';
import type { IChatInfo } from '@/types/ajax/chat';
import { useFriendStore } from '../friend/friend';
import { useGroupStore } from '../group/group';

/**
 * @description: 会话管理
 */
export const useConversationStore = defineStore('useConversationStore', {
  state: () => ({
    /**
     * @description: 最近会话列表
     */
    _recentChatList: [] as IChatInfo[],
    /**
     * @description: 当前选中的会话ID
     */
    currentChatId: null as string | null
  }),

  getters: {

    getRecentChatList: (state) => () => {
      console.error('111111111', state._recentChatList)
      return  state._recentChatList.sort((a, b) => {
        // 置顶的排在前面
        // if (a.is_top !== b.is_top) return b.is_top ? 1 : -1;
        // 按最后消息时间排序
        return new Date(b.update_at).getTime() - new Date(a.update_at).getTime();
      }).map(recentChatInfo =>{
        // 判断是不是群组
        const groupStore = useGroupStore();
        // 如果是群组则到group中更新信息， 否则去user表更新基础西悉尼
        let info = {}
        if (recentChatInfo.chatType === 1) {

        } else {
          const groupInfo = groupStore.getGroupById(recentChatInfo.conversationId)
          if (groupInfo) {
            info = {
              nickname: groupInfo.title,
              avatar: groupInfo.avatar
            }
          }
        }
        return {
          ...recentChatInfo,
          ...info
        }
      })
    },
      
    /**
     * @description: 获取会话信息
     * @param {string} conversationId - 会话ID
     * @return {IChatInfo | null} 会话信息
     */
    getConversationInfo: (state) => (conversationId: string) => {
      // 先从最近会话列表中查找
      const conversation = state._recentChatList.find(
        chat => chat.conversationId === conversationId
      );
      
      if (conversation) {
        return conversation;
      }
      
      // 如果在最近会话列表中找不到，则从好友列表或群组列表中获取基本信息
      const friendStore = useFriendStore();
      const groupStore = useGroupStore();
      
      // 尝试从好友列表中获取
      const friendInfo = friendStore.getFriendInfoById(conversationId);
      if (friendInfo) {
        return {
          conversationId: friendInfo.conversationId,
          avatar: friendInfo.avatar,
          nickname: friendInfo.nickname,
          create_at: new Date().toISOString(),
          is_top: false,
          msg_preview: '',
          unread_count: 0
        } as IChatInfo;
      }
      
      // 尝试从群组列表中获取
      const groupInfo = groupStore.getGroupById(conversationId);
      if (groupInfo) {
        return {
          conversationId: groupInfo.conversationId,
          avatar: groupInfo.avatar,
          nickname: groupInfo.name || groupInfo.title,
          create_at: new Date().toISOString(),
          is_top: false,
          msg_preview: '',
          unread_count: 0
        } as IChatInfo;
      }
      
      return null;
    }
  },

  actions: {
    reset() {
      this._recentChatList = [];
      this.currentChatId = null;
    },

    /**
     * @description: 获取最近会话列表
     */
    async initRecentChatApi() {
      try {
        const res = await getRecentChatListApi();
        if (res.code === 0) {
          this._recentChatList = res.result.list || [];
        
        }
      } catch (error) {
        console.error('Failed to fetch recent chats:', error);
        throw error;
      }
    },

    /**
     * @description: 更新会话基本信息
     */
    updateBaseInfo(data: IChatInfo) {
      const index = this._recentChatList.findIndex(
        item => item.conversationId === data.conversationId
      );
      
      if (index !== -1) {
        this._recentChatList[index] = {
          ...this._recentChatList[index],
          ...data
        };
      } else {
        // 数组第一项追加
        this._recentChatList.unshift(data)

      }
    },

    /**
     * @description: 设置当前会话
     */
    setCurrentChat(conversationId: string) {
      this.currentChatId = conversationId;
      // 清除未读计数
      const chatIndex = this._recentChatList.findIndex(
        chat => chat.conversationId === conversationId
      );
      if (chatIndex !== -1) {
        this._recentChatList[chatIndex].unread_count = 0;
      }
    },

    /**
     * @description: 置顶/取消置顶会话
     */
    toggleChatTop(conversationId: string) {
      const index = this._recentChatList.findIndex(
        chat => chat.conversationId === conversationId
      );
      if (index !== -1) {
        this._recentChatList[index].is_top = !this._recentChatList[index].is_top;
      }
    },

    /**
     * @description: 更新会话列表中的最新消息
     */
    updateLastMessage(conversationId: string, message: { content: string, timestamp: string }) {
      const index = this._recentChatList.findIndex(
        item => item.conversationId === conversationId
      );

      if (index !== -1) {
        const isCurrentChat = this.currentChatId === conversationId;
        this._recentChatList[index] = {
          ...this._recentChatList[index],
          msg_preview: message.content,
          update_at: message.timestamp,
          unread_count: isCurrentChat ? 0 : (this._recentChatList[index].unread_count || 0) + 1
        };
      }
    },

    // 添加会话状态同步方法
    async syncConversationState() {
      await this.initRecentChatApi();
      // 可以添加其他同步逻辑
    },
  },
});
