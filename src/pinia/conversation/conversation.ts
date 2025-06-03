import { defineStore } from 'pinia';
import { getRecentChatInfoApi, getRecentChatListApi } from '@/api/chat';
import type { IChatInfo } from '@/types/ajax/chat';
import { processAvatarUrl } from '@/utils/avatar';
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
      return state._recentChatList.sort((a, b) => {
        // 置顶的排在前面
        if (a.is_top !== b.is_top) return b.is_top ? 1 : -1;
        // 按最后消息时间排序
        return new Date(b.update_at).getTime() - new Date(a.update_at).getTime();
      }).map(recentChatInfo => {
        // 判断是不是群组
        const groupStore = useGroupStore();
        let info = {};
        
        if (recentChatInfo.chatType === 1) {
          // 私聊，头像已经在 API 返回时处理
          info = {
            avatar: processAvatarUrl(recentChatInfo.avatar)
          };
        } else {
          // 群聊
          const groupInfo = groupStore.getGroupById(recentChatInfo.conversationId);
          if (groupInfo) {
            info = {
              nickname: groupInfo.title,
              avatar: processAvatarUrl(groupInfo.avatar)
            };
          }
        }
        
        return {
          ...recentChatInfo,
          ...info
        };
      });
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
        return {
          ...conversation,
          avatar: processAvatarUrl(conversation.avatar)
        };
      }
      
      // 如果在最近会话列表中找不到，则从好友列表或群组列表中获取基本信息
      const friendStore = useFriendStore();
      const groupStore = useGroupStore();
      
      // 尝试从好友列表中获取
      const friendInfo = friendStore.getFriendInfoById(conversationId);
      if (friendInfo) {
        return {
          conversationId: friendInfo.conversationId,
          avatar: processAvatarUrl(friendInfo.avatar),
          nickname: friendInfo.nickname,
          create_at: new Date().toISOString(),
          update_at: new Date().toISOString(),
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
          avatar: processAvatarUrl(groupInfo.avatar),
          nickname: groupInfo.name || groupInfo.title,
          create_at: new Date().toISOString(),
          update_at: new Date().toISOString(),
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
          // 处理头像路径
          this._recentChatList = (res.result.list || []).map(chat => ({
            ...chat,
            avatar: processAvatarUrl(chat.avatar)
          }));
        }
      } catch (error) {
        console.error('Failed to fetch recent chats:', error);
        throw error;
      }
    },

    updateConversationListByFriendId(conversationId: string) {
      getRecentChatInfoApi({ conversationId })
        .then(res => {
          if (res.code === 0 && res.result) {
            // 处理头像路径
            const processedResult = {
              ...res.result,
              avatar: processAvatarUrl(res.result.avatar)
            };
            
            // Check if the conversation already exists in the list
            const existingIndex = this._recentChatList.findIndex(
              chat => chat.conversationId === processedResult.conversationId
            );
            
            if (existingIndex !== -1) {
              // Update existing conversation
              this._recentChatList[existingIndex] = {
                ...this._recentChatList[existingIndex],
                ...processedResult
              };
            } else {
              // Add new conversation to the top of the list
              this._recentChatList.unshift(processedResult);
            }
          } else {
            console.error('Failed to get conversation info:', res.msg);
          }
        })
        .catch(error => {
          console.error('Error fetching conversation info:', error);
        });
    },

    /**
     * @description: 更新会话基本信息
     */
    updateBaseInfo(data: IChatInfo) {
      const processedData = {
        ...data,
        avatar: processAvatarUrl(data.avatar)
      };
      
      const index = this._recentChatList.findIndex(
        item => item.conversationId === processedData.conversationId
      );
      
      if (index !== -1) {
        this._recentChatList[index] = {
          ...this._recentChatList[index],
          ...processedData
        };
      } else {
        // 数组第一项追加
        this._recentChatList.unshift(processedData);
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
