import { MessageType } from '@/types/store/message';
import type { IMessage } from '@/types/ajax/chat';
import type { IWsMessage } from '@/types/ws/command';
import { WsCommand } from '@/types/ws/command';
import wsManager from '@/ws-manager/ws';
import { ChatSender } from './senders/chat-sender';
import { ChatReceiver } from './receivers/chat-receiver';
import { FriendReceiver } from './receivers/friend-receiver';
import { GroupReceiver } from './receivers/group-receiver';
import { UserReceiver } from './receivers/user-receiver';

/**
 * @description: 消息管理器 - 负责消息的发送、接收和状态管理
 */
class MessageManager {
  private chatSender = new ChatSender();
  private chatReceiver = new ChatReceiver();
  private friendReceiver = new FriendReceiver();
  private groupReceiver = new GroupReceiver();
  private userReceiver = new UserReceiver();
  
  private pendingMessages = new Map<string, IMessage>(); // 待确认的消息

  // 回调函数
  public onMessageSent: ((messageId: string, message: IMessage) => void) | null = null;
  public onMessageReceived: ((message: IMessage) => void) | null = null;

  constructor() {
    // 设置 WebSocket 事件回调
    wsManager.setEventCallbacks({
      onMessage: this.handleWsMessage.bind(this),
      onConnect: this.onWsConnect.bind(this),
      onDisconnect: this.onWsDisconnect.bind(this),
      onError: this.onWsError.bind(this)
    });
  }

  /**
   * @description: WebSocket 连接成功回调
   */
  private onWsConnect() {
    console.log('WebSocket 连接成功，消息管理器已准备就绪');
  }

  /**
   * @description: WebSocket 断开连接回调
   */
  private onWsDisconnect() {
    console.log('WebSocket 断开连接');
  }

  /**
   * @description: WebSocket 错误回调
   */
  private onWsError(error: any) {
    console.error('WebSocket 错误:', error);
  }

  /**
   * @description: 处理 WebSocket 消息
   * @param {IWsMessage} wsMessage - WebSocket 消息
   */
  private handleWsMessage(wsMessage: IWsMessage) {
    console.log('消息管理器收到 WebSocket 消息:', wsMessage);

    switch (wsMessage.command) {
      case WsCommand.CHAT_MESSAGE:
        this.chatReceiver.handleChatMessage(wsMessage, this.onMessageReceived, this.pendingMessages);
        break;
      case WsCommand.FRIEND_OPERATION:
        this.friendReceiver.handleFriendOperation(wsMessage);
        break;
      case WsCommand.GROUP_OPERATION:
        this.groupReceiver.handleGroupOperation(wsMessage);
        break;
      case WsCommand.USER_PROFILE:
        this.userReceiver.handleUserProfile(wsMessage);
        break;
      case WsCommand.HEARTBEAT:
        console.log('收到心跳消息');
        break;
      default:
        console.warn('未处理的消息类型:', wsMessage.command);
    }
  }

  /**
   * @description: 发送消息
   * @param {string} conversationId - 会话ID
   * @param {any} content - 消息内容
   * @param {MessageType} type - 消息类型
   * @return {Promise<string>} 消息ID
   */
  async sendMessage(conversationId: string, content: any, type: MessageType): Promise<string> {
    return this.chatSender.sendMessage(conversationId, content, type, this.pendingMessages);
  }

  /**
   * @description: 重发消息
   * @param {string} messageId - 消息ID
   */
  async resendMessage(messageId: string): Promise<void> {
    return this.chatSender.resendMessage(messageId, this.pendingMessages);
  }

  /**
   * @description: 清理资源
   */
  cleanup() {
    this.pendingMessages.clear();
  }
}

// 导出单例
let messageManagerInstance: MessageManager | null = null;

export const messageManager = {
  getInstance(): MessageManager {
    if (!messageManagerInstance) {
      messageManagerInstance = new MessageManager();
    }
    return messageManagerInstance;
  }
}; 