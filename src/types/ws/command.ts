import type { IWsContent } from './ws';

/**
 * @description: WebSocket 命令类型枚举 - 与服务端保持一致
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
  USER_PROFILE = 'USER_PROFILE',
  /**
   * @description: 系统通知类
   */  
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  /**
   * @description: 在线状态类
   */  
  PRESENCE = 'PRESENCE',
  /**
   * @description: 消息同步类
   */  
  MESSAGE_SYNC = 'MESSAGE_SYNC',
  /**
   * @description: 心跳消息类（应用级心跳）
   */  
  HEARTBEAT = 'HEARTBEAT',
}

/**
 * @description: WebSocket 消息类型枚举 - 与服务端保持一致
 */
export enum WsType {
  // 聊天消息类型
  PRIVATE_MESSAGE_SEND = 'private_message_send',    // 客户端->服务端 私聊消息发送
  GROUP_MESSAGE_SEND = 'group_message_send',        // 客户端->服务端 群聊消息发送
  PRIVATE_MESSAGE_RECEIVE = 'private_message_receive', // 服务端->客户端 私聊消息接收
  GROUP_MESSAGE_RECEIVE = 'group_message_receive',   // 服务端->客户端 群聊消息接收
  PRIVATE_MESSAGE_SYNC = 'private_message_sync',    // 服务端->客户端 私聊消息同步（发送者的其他设备）
  GROUP_MESSAGE_SYNC = 'group_message_sync',        // 服务端->客户端 群聊消息同步（发送者的其他设备）
  MESSAGE_READ_RECEIPT = 'message_read_receipt',    // 服务端->客户端 已读回执
  MESSAGE_RECALL = 'message_recall',                // 服务端->客户端 消息撤回

  // 好友关系类型
  FRIEND_ADD_REQUEST = 'friend_add_request',        // 客户端->服务端 添加好友请求
  FRIEND_ACCEPT = 'friend_accept',                  // 客户端->服务端 接受好友请求
  FRIEND_REJECT = 'friend_reject',                  // 客户端->服务端 拒绝好友请求
  FRIEND_DELETE = 'friend_delete',                  // 服务端->客户端 删除好友
  FRIEND_REQUEST_RECEIVE = 'friend_request_receive', // 服务端->客户端 收到好友请求
  FRIEND_ADD_SUCCESS = 'friend_add_success',        // 服务端->客户端 好友添加成功

  // 群组操作类型
  GROUP_CREATE = 'group_create',                    // 客户端->服务端 创建群组
  GROUP_INVITE = 'group_invite',                    // 客户端->服务端 邀请入群
  GROUP_JOIN_REQUEST = 'group_join_request',        // 客户端->服务端 申请入群
  GROUP_QUIT = 'group_quit',                        // 客户端->服务端 退出群组
  GROUP_INVITE_RECEIVE = 'group_invite_receive',    // 服务端->客户端 群聊消息接收
  GROUP_JOIN_APPROVE = 'group_join_approve',        // 服务端->客户端 群成员添加请求
  GROUP_MEMBER_UPDATE = 'group_member_update',      // 服务端->客户端 群成员变动（加入，离开、被踢出等）
  MESSAGE_GROUP_CREATE = 'message_group_create',    // 服务端->客户端 创建群聊
  GROUP_UPDATE = 'group_update',                    // 服务端->客户端 群组更新（包含群信息更新、群主转让等）

  // 用户信息类型
  PROFILE_UPDATE = 'profile_update',                // 客户端->服务端 更新个人信息
  PROFILE_CHANGE_NOTIFY = 'profile_change_notify',  // 服务端->客户端 他人资料变更通知
}

/**
 * @description: WebSocket 消息接口 - 与服务端保持一致
 */
export interface IWsMessage {
  command: WsCommand;
  content: IWsContent;
}

/**
 * @description: WebSocket 消息内容接口 - 与服务端保持一致
 */
export interface IWsContent {
  timestamp: number;
  messageId?: string;
  data: IWsData;
}

/**
 * @description: WebSocket 数据接口 - 与服务端保持一致
 */
export interface IWsData {
  type: WsType;
  conversationId?: string;
  body: any; // 使用 any 类型，因为不同消息类型的 body 结构不同
} 