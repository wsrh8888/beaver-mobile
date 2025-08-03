// 文本消息
export interface ITextMsg {
  content: string;
}

// 文件消息
export interface IFileMsg {
  fileName: string;
}

// 语音消息
export interface IVoiceMsg {
  fileName: string;
  duration: number;
}

// 视频消息
export interface IVideoMsg {
  fileName: string;
  width: number;
  height: number;
  duration: number;
}

// 图片消息
export interface IImageMsg {
  fileName: string;
  width: number;
  height: number;
}

// 表情消息
export interface IEmojiMsg {
  fileName: string;
  emojiId: number;
  packageId: number;
}

// 回复消息
export interface IReplyMsg {
  replyToMessageId: string;
  replyToContent: string;
  replyToSender: string;
}

// 消息
export interface IMsg {
  type: number;
  textMsg?: ITextMsg;
  imageMsg?: IImageMsg;
  videoMsg?: IVideoMsg;
  fileMsg?: IFileMsg;
  voiceMsg?: IVoiceMsg;
  emojiMsg?: IEmojiMsg;
  replyMsg?: IReplyMsg;
}

// 发送消息请求
export interface ISendMsgReq {
  conversationId: string;
  messageId: string;
  msg: IMsg;
}

// 会话信息请求
export interface IConversationInfoReq {
  conversationId: string;
}

// 最近聊天列表请求
export interface IRecentChatListReq {
  page?: number;
  limit?: number;
}

// 会话信息响应
export interface IConversationInfoRes {
  fileName: string;
  nickname: string;
  msg_preview: string;
  update_at: string;
  is_top: boolean;
  conversationId: string;
  chatType: number;
}

// 最近聊天列表响应
export interface IRecentChatListRes {
  count: number;
  list: IConversationInfoRes[];
}

// 发送者信息
export interface ISender {
  userId: string;
  fileName: string;
  nickname: string;
}

// 发送消息响应
export interface ISendMsgRes {
  id: number;
  messageId: string;
  conversationId: string;
  msg: IMsg;
  sender: ISender;
  create_at: string;
  msgPreview: string;
  status: number;
}

// 聊天记录请求
export interface IChatHistoryReq {
  conversationId: string;
  page?: number;
  limit?: number;
}

// 消息
export interface IMessage {
  id: number;
  messageId: string;
  conversationId: string;
  msg: IMsg;
  sender: ISender;
  create_at: string;
  status: number;
}

// 聊天记录响应
export interface IChatHistoryRes {
  count: number;
  list: IMessage[];
}

// 删除最近聊天请求
export interface IDeleteRecentReq {
  conversationId: string;
}

// 删除最近聊天响应
export interface IDeleteRecentRes {}

// 置顶聊天请求
export interface IPinnedChatReq {
  conversationId: string;
  isPinned: boolean;
}

// 置顶聊天响应
export interface IPinnedChatRes {}

// 编辑消息请求
export interface IEditMessageReq {
  messageId: string;
  content: string;
}

// 编辑消息响应
export interface IEditMessageRes {
  id: number;
  messageId: string;
  content: string;
  editTime: string;
}

// 撤回消息请求
export interface IRecallMessageReq {
  messageId: string;
}

// 撤回消息响应
export interface IRecallMessageRes {
  id: number;
  messageId: string;
  recallTime: string;
}

// 转发消息请求
export interface IForwardMessageReq {
  messageId: string;
  targetId: string;
  forwardType: number;
}

// 转发消息响应
export interface IForwardMessageRes {
  id: number;
  messageId: string;
  forwardTime: string;
}

// 兼容旧版本的接口名称
export interface IRecentChatRes extends IRecentChatListRes {}
export interface IChatInfo extends IConversationInfoRes {}