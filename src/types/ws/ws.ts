

export interface IWsContent {
  timestamp: number;
  data: {
    type: string;
    body: {
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
      msgPreview: string;
    };
  };
}
export interface IWsStore {
  code: number;
  command: "CHAT_MESSAGE" | 'COMMON_UPDATE_MESSAGE';
  content: IWsContent

}
