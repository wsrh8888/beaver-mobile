import type { MessageType } from '@/types/store/message';
import type { IMessage } from '@/types/ajax/chat';

/**
 * @description: 消息管理器接口
 */
export interface IMessageManager {
  /**
   * @description: 发送消息
   * @param {string} conversationId - 会话ID
   * @param {any} content - 消息内容
   * @param {MessageType} type - 消息类型
   * @return {Promise<string>} 消息ID
   */
  sendMessage(conversationId: string, content: any, type: MessageType): Promise<string>;

  /**
   * @description: 重发消息
   * @param {string} messageId - 消息ID
   * @return {Promise<void>}
   */
  resendMessage(messageId: string): Promise<void>;

  /**
   * @description: 清理资源
   */
  cleanup(): void;

  /**
   * @description: 设置消息发送回调
   * @param {Function} callback - 回调函数
   */
  onMessageSent: ((messageId: string, message: IMessage) => void) | null;

  /**
   * @description: 设置消息接收回调
   * @param {Function} callback - 回调函数
   */
  onMessageReceived: ((message: IMessage) => void) | null;
} 