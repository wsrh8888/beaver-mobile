import { defineStore } from 'pinia';
import { getChatHistoryApi } from '@/api/chat';
import { MessageStatus } from '@/types/ajax/chat';
import type { IChatHistory, IChatInfo, MessageType } from '@/types/ajax/chat';
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
     * @description: 消息草稿缓存，key为会话ID
     */
    draftMessages: new Map<string, string>(),
    
    /**
     * @description: 消息缓存，用于优化加载性能
     * @param timestamp - 缓存时间戳
     * @param messages - 缓存的消息列表
     */
    messageCache: new Map<string, {
      timestamp: number;
      messages: IChatHistory[];
    }>(),
    
    /**
     * @description: 消息加载状态，用于控制加载动画
     */
    loadingStates: new Map<string, boolean>(),
    

    /**
     * @description: 消息重发次数记录，用于控制重发次数
     */
    retryCount: new Map<string, number>(),
  }),

  getters: {
    /**
     * @description: 获取会话的聊天记录
     */
    getChatHistory: (state) => (conversationId: string) => 
      state.chatHistory.get(conversationId) || [],
    
    /**
     * @description: 获取会话的待发送消息
     */
    getPendingMessages: (state) => (conversationId: string) => 
      state.chatHistory.get(conversationId)?.filter(
        msg => state.messageSendingStatus.get(msg.messageId.toString()) === MessageStatus.SENDING
      ) || [],
      
    /**
     * @description: 获取会话的失败消息
     */
    getFailedMessages: (state) => (conversationId: string) => 
      state.chatHistory.get(conversationId)?.filter(
        msg => state.messageSendingStatus.get(msg.messageId.toString()) === MessageStatus.FAILED
      ) || [],
  },

  actions: {
    /**
     * @description: 重置store状态
     */
    reset() {
      this.chatHistory.clear();
      this.messageSendingStatus.clear();
      this.draftMessages.clear();
      this.messageCache.clear();
      this.loadingStates.clear();
      this.retryCount.clear();
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
          const messages = res.result.list || [];
          this.chatHistory.set(conversationId, messages.reverse());
          this.messageCache.set(conversationId, {
            timestamp: Date.now(),
            messages: messages.reverse()
          });
          console.error('234234', messages.reverse())
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
      const history = this.chatHistory.get(conversationId) || [];
      history.push(message);
      this.chatHistory.set(conversationId, history);

      // 更新会话列表的最新消息
      const conversationStore = useConversationStore();
      conversationStore.updateLastMessage(conversationId, {
        content: message.msg.textMsg?.content || '',
        timestamp: message.create_at
      });
      console.error('收到新的消息',this.chatHistory)
    },

    /**
     * @description: 更新消息状态
     * @param {number} messageId - 消息ID
     * @param {MessageStatus} status - 消息状态
     */
    updateMessageStatus(messageId: number, status: MessageStatus) {
      this.messageSendingStatus.set(messageId.toString(), status);
    },

    /**
     * @description: 保存消息草稿
     * @param {string} conversationId - 会话ID
     * @param {string} content - 草稿内容
     */
    saveDraft(conversationId: string, content: string) {
      if (content) {
        this.draftMessages.set(conversationId, content);
      } else {
        this.draftMessages.delete(conversationId);
      }
    },

    /**
     * @description: 获取消息草稿
     * @param {string} conversationId - 会话ID
     */
    getDraft(conversationId: string): string {
      return this.draftMessages.get(conversationId) || '';
    },

    /**
     * @description: 重发消息
     * @param {string} conversationId - 会话ID
     * @param {number} messageId - 消息ID
     */
    async resendMessage(conversationId: string, messageId: number) {
      const MAX_RETRY = 3;
      const currentRetry = this.retryCount.get(messageId.toString()) || 0;
      
      if (currentRetry >= MAX_RETRY) {
        throw new Error('超过最大重试次数');
      }
      
      const history = this.chatHistory.get(conversationId) || [];
      const message = history.find(msg => msg.messageId === messageId);
      
      if (message) {
        this.updateMessageStatus(messageId, MessageStatus.SENDING);
        try {
          // 调用发送消息 API
          // const res = await sendMessageApi(conversationId, message);
          this.updateMessageStatus(messageId, MessageStatus.SENT);
          this.retryCount.delete(messageId.toString());
        } catch (error) {
          this.updateMessageStatus(messageId, MessageStatus.FAILED);
          this.retryCount.set(messageId.toString(), currentRetry + 1);
          throw error;
        }
      }
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
        const oldestMessageId = currentMessages[0]?.messageId;
        
        const res = await getChatHistoryApi({ 
          conversationId,
          beforeId: oldestMessageId,
          limit: 20
        });

        if (res.code === 0) {
          console.error('23423423', res)
          const newMessages = res.result.list || [];
          this.chatHistory.set(conversationId, [...newMessages, ...currentMessages].reverse());
        }
      } catch (error) {
        console.error('Failed to load more messages:', error);
      } finally {
        this.loadingStates.set(conversationId, false);
      }
    },

    /**
     * @description: 清理过期缓存
     */
    cleanExpiredCache() {
      const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
      const now = Date.now();
      
      for (const [conversationId, cache] of this.messageCache.entries()) {
        if (now - cache.timestamp > CACHE_DURATION) {
          this.messageCache.delete(conversationId);
        }
      }
    }
  },
});
