import type { MessageType, MessageStatus, IChatHistory } from '@/types/ajax/chat';

/**
 * @description: 消息发送配置
 */
export interface ISendMessageConfig {
  conversationId: string;
  content: any;
  type: MessageType;
  retry?: boolean;
  timeout?: number;
}

/**
 * @description: 待确认消息
 */
export interface IPendingMessage {
  id: string;
  message: IChatHistory;
  timestamp: number;
  retryCount: number;
  status: MessageStatus;
}

/**
 * @description: 消息管理器事件
 */
export interface IMessageManagerEvents {
  onMessageSent: (messageId: string, message: IChatHistory) => void;
  onMessageFailed: (messageId: string, error: Error) => void;
  onMessageReceived: (message: IChatHistory) => void;
}

/**
 * @description: 消息管理器配置
 */
export interface IMessageManagerConfig {
  maxRetryCount: number;
  retryDelay: number;
  messageTimeout: number;
  enableLocalCache: boolean;
} 