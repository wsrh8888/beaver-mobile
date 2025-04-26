// 消息类型枚举
export enum MessageType {
  TEXT = 1,
  IMAGE = 2,
  VIDEO = 3,
  FILE = 4,
  VOICE = 5,
  VOICE_CALL = 6,
  VIDEO_CALL = 7,
  WITHDRAW = 8,
  REPLY = 9,
  QUOTE = 10,
  AT = 11,
  TIP = 12
}

// 消息发送状态
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed'
}

export interface IChatInfo {
  avatar: string;
  conversationId: string;
  update_at: string;
  is_top: boolean;
  msg_preview: string;
  nickname: string;
  title?: string;
  unread_count?: number;
}

export interface IConversationInfoRes extends IChatInfo {

}
export interface IRecentChatRes {
  count: number;
  list: IChatInfo[];
}

export interface ITextMessage {
  content: string;
}

export interface IImageMessage {
  url: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface IMessage {
  type: MessageType;
  textMsg?: ITextMessage;
  imageMsg?: IImageMessage | null;
}

export interface IChatHistory {
  messageId: number;
  conversationId: string;
  msg: IMessage;
  sender: {
    userId: string;
    avatar: string;
    nickname: string;
  };
  create_at: string;
}

export interface IChatHistoryRes {
  count: number;
  list: IChatHistory[];
}