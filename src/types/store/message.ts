// 消息状态枚举
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
  RECEIVED = 'received'
}

// 消息类型枚举
export enum MessageType {
  TEXT = 1,
  IMAGE = 2,
  VOICE = 3,
  VIDEO = 4,
  FILE = 5,
  EMOJI = 6
}

/**
 * @description: 消息缓存项
 */
export interface IMessageCacheItem {
  timestamp: number;
  messages: any[]; // 使用 API 类型 IMessage
}

/**
 * @description: 消息 Store 状态
 */
export interface IMessageStoreState {
  /** 聊天记录缓存，key为会话ID */
  chatHistory: Map<string, any[]>; // 使用 API 类型 IMessage[]
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