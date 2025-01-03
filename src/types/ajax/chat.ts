

export interface IChatInfo {
  avatar: string;
  conversationId: string;
  create_at: string;
  is_top: boolean;
  msg_preview: string;
  nickname: string;

}

export interface IRecentChatRes {
  count: number;
  list: IChatInfo[];
}

export interface IChatHistory {
  messageId: number;
  conversationId: string;
  msg: {
    type: number;
    textMsg: {
      content: string;
    };
    imageMsg: null;
  };
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