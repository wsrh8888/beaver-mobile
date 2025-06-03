import { defineStore } from 'pinia';
import { getChatHistoryApi } from '@/api/chat';
import { MessageStatus } from '@/types/ajax/chat';
import type { IChatHistory, IChatInfo, MessageType } from '@/types/ajax/chat';
import type { IMessageStoreState, ILastMessage } from '@/types/store/message';
import { processAvatarUrl } from '@/utils/avatar';
import { useConversationStore } from '../conversation/conversation';

/**
 * @description: 聊天消息管理
 */
export const useMessageStore = defineStore('useMessageStore', {
  state: () => ({
    /**
     * @description: 聊天记录缓存，key为会话ID
     */
    chatHistory: new Map<string, IChatHistory[]>(),
    
    /**
     * @description: 消息发送状态缓存，key为消息ID
     */
    messageSendingStatus: new Map<string, MessageStatus>(),
    
    /**
     * @description: 消息缓存，用于优化加载性能
     */
    messageCache: new Map<string, {
      timestamp: number;
      messages: IChatHistory[];
    }>(),
    
    /**
     * @description: 消息加载状态，用于控制加载动画
     */
    loadingStates: new Map<string, boolean>(),
  }),

  getters: {
    /**
     * @description: 获取会话的聊天记录
     */
    getChatHistory: (state) => (conversationId: string) => 
      state.chatHistory.get(conversationId) || [],
  },

  actions: {
    /**
     * @description: 重置store状态
     */
    reset() {
      this.chatHistory.clear();
      this.messageSendingStatus.clear();
      this.messageCache.clear();
      this.loadingStates.clear();
    },

    /**
     * @description: 加载聊天记录
     * @param {string} conversationId - 会话ID
     * @param {boolean} useCache - 是否使用缓存
     */
    async loadChatHistory(conversationId: string, useCache: boolean = true) {
      const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
      
      if (useCache) {
        const cached = this.messageCache.get(conversationId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          this.chatHistory.set(conversationId, cached.messages);
          return;
        }
      }

      try {
        this.loadingStates.set(conversationId, true);
        const res = await getChatHistoryApi({ conversationId, size: 100 });
        
        if (res.code === 0) {
          const messages = (res.result.list || [])
            .map(msg => ({
              ...msg,
              sender: {
                ...msg.sender,
                avatar: processAvatarUrl(msg.sender.avatar)
              }
            }))
            .reverse();
          
          this.chatHistory.set(conversationId, messages);
          this.messageCache.set(conversationId, {
            timestamp: Date.now(),
            messages: messages
          });
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        throw error;
      } finally {
        this.loadingStates.set(conversationId, false);
      }
    },

    /**
     * @description: 添加新消息
     * @param {string} conversationId - 会话ID
     * @param {IChatHistory} message - 消息内容
     */
    addMessage(conversationId: string, message: IChatHistory) {
      const processedMessage = {
        ...message,
        sender: {
          ...message.sender,
          avatar: processAvatarUrl(message.sender.avatar)
        }
      };
      
      const history = this.chatHistory.get(conversationId) || [];
      history.push(processedMessage);
      this.chatHistory.set(conversationId, history);

      // 更新会话列表的最新消息
      const conversationStore = useConversationStore();
      conversationStore.updateLastMessage(conversationId, {
        content: processedMessage.msg.textMsg?.content || '',
        timestamp: processedMessage.create_at
      });
    },

    /**
     * @description: 更新消息状态
     * @param {number} id - 消息ID
     * @param {MessageStatus} status - 消息状态
     */
    updateMessageStatus(id: number, status: MessageStatus) {
      this.messageSendingStatus.set(id.toString(), status);
    },

    /**
     * @description: 加载更多消息
     * @param {string} conversationId - 会话ID
     */
    async loadMoreMessages(conversationId: string) {
      if (this.loadingStates.get(conversationId)) {
        return;
      }

      this.loadingStates.set(conversationId, true);
      try {
        const currentMessages = this.chatHistory.get(conversationId) || [];
        const oldestMessageId = currentMessages[0]?.id;
        
        const res = await getChatHistoryApi({ 
          conversationId,
          beforeId: oldestMessageId,
          limit: 20
        });

        if (res.code === 0) {
          const newMessages = (res.result.list || [])
            .map(msg => ({
              ...msg,
              sender: {
                ...msg.sender,
                avatar: processAvatarUrl(msg.sender.avatar)
              }
            }));
          
          this.chatHistory.set(conversationId, [...newMessages, ...currentMessages]);
        }
      } catch (error) {
        console.error('Failed to load more messages:', error);
      } finally {
        this.loadingStates.set(conversationId, false);
      }
    },
  },
});
