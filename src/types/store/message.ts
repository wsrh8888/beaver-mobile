import type { IChatHistory } from '@/types/ajax/chat';
import { MessageStatus } from '@/types/ajax/chat';

/**
 * @description: 消息缓存项
 */
export interface IMessageCacheItem {
  timestamp: number;
  messages: IChatHistory[];
}

/**
 * @description: 消息 Store 状态
 */
export interface IMessageStoreState {
  /** 聊天记录缓存，key为会话ID */
  chatHistory: Map<string, IChatHistory[]>;
  /** 消息发送状态缓存，key为消息ID */
  messageSendingStatus: Map<string, MessageStatus>;
  /** 消息缓存，用于优化加载性能 */
  messageCache: Map<string, IMessageCacheItem>;
  /** 消息加载状态，用于控制加载动画 */
  loadingStates: Map<string, boolean>;
}

/**
 * @description: 最后消息信息
 */
export interface ILastMessage {
  content: string;
  timestamp: string;
} 