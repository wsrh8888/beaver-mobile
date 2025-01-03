export const parseChatPreview = (msg) => {
  if (!msg || !msg.type) {
      return "[未知消息]";
  }

  switch (msg.type) {
      case 1:
          return msg.textMsg ? msg.textMsg.content : "[文本消息内容缺失]";
      case 2:
          return msg.imageMsg ? `[图片消息] - ${msg.imageMsg.title}` : "[图片消息内容缺失]";
      case 3:
          return msg.videoMsg ? `[视频消息] - ${msg.videoMsg.title}` : "[视频消息内容缺失]";
      case 4:
          return msg.fileMsg ? `[文件消息] - ${msg.fileMsg.title}` : "[文件消息内容缺失]";
      case 5:
          return "[语音消息]";
      case 6:
          return "[语音通话消息]";
      case 7:
          return "[视频通话消息]";
      case 8:
          return msg.withdrawMsg ? `[撤回消息] - ${msg.withdrawMsg.content}` : "[撤回消息内容缺失]";
      case 9:
          return msg.replyMsg ? `[回复消息] - ${msg.replyMsg.content}` : "[回复消息内容缺失]";
      case 10:
          return msg.quoteMsg ? `[引用消息] - ${msg.quoteMsg.content}` : "[引用消息内容缺失]";
      case 11:
          return msg.textMsg ? `[@消息] - ${msg.textMsg.content}` : "[@消息内容缺失]";
      default:
          return "[未知消息]";
  }
};
