import type { IWsContent } from './ws';

/**
 * @description: WebSocket 命令类型枚举
 */
export enum WsCommand {
  /**
   * @description: 聊天消息类
   */  
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  /**
   * @description: 好友关系类
   */  
  FRIEND_OPERATION = 'FRIEND_OPERATION',
  /**
   * @description: 群组操作类
   */  
  GROUP_OPERATION = 'GROUP_OPERATION',
  /**
   * @description: 用户信息类
   */  
  USER_PROFILE= 'USER_PROFILE',
  /**
   * @description: 消息同步类
   */  
  MESSAGE_SYNC = 'MESSAGE_SYNC',
}

/**
 * @description: WebSocket 消息接口
 */
export interface IWsMessage {
  code: number;
  command: WsCommand;
  content: IWsContent;
} 