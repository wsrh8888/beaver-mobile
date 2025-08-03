import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type { 
  ISendMsgReq,
  ISendMsgRes,
  IConversationInfoReq,
  IConversationInfoRes,
  IRecentChatListReq,
  IRecentChatListRes,
  IChatHistoryReq,
  IChatHistoryRes,
  IDeleteRecentReq,
  IDeleteRecentRes,
  IPinnedChatReq,
  IPinnedChatRes,
  IEditMessageReq,
  IEditMessageRes,
  IRecallMessageReq,
  IRecallMessageRes,
  IForwardMessageReq,
  IForwardMessageRes
} from '@/types/ajax/chat'
import { getLocal } from '@/utils/local';

/**
 * @description: 发送消息
 */
export const sendMsgApi = (data: ISendMsgReq) => {
  return request<ISendMsgRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/sendMsg`
  })
}

/**
 * @description: 获取会话id
 */
export const conversationInfoApi = (data: IConversationInfoReq) => {
  return request<IConversationInfoRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/getConversationInfo`
  })
}

/**
 * @description: 获取最近会话列表
 */
export const recentChatListApi = (data: IRecentChatListReq) => {
  return request<IRecentChatListRes>({
    method: 'GET',
    data,
    url: `${baseUrl}/api/chat/getRecentChatList`
  })
}

/**
 * @description: 获取聊天记录
 */
export const chatHistoryApi = (data: IChatHistoryReq) => {
  return request<IChatHistoryRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/getChatHistory`
  })
}

/**
 * @description: 删除某个最近会话
 */
export const deleteRecentApi = (data: IDeleteRecentReq) => {
  return request<IDeleteRecentRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/deleteRecentChat`
  })
}

/**
 * @description: 置顶某个会话
 */
export const pinnedChatApi = (data: IPinnedChatReq) => {
  return request<IPinnedChatRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/pinnedChat`
  })
}

/**
 * @description: 编辑消息
 */
export const editMessageApi = (data: IEditMessageReq) => {
  return request<IEditMessageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/edit`
  })
}

/**
 * @description: 撤回消息
 */
export const recallMessageApi = (data: IRecallMessageReq) => {
  return request<IRecallMessageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/recall`
  })
}

/**
 * @description: 转发消息
 */
export const forwardMessageApi = (data: IForwardMessageReq) => {
  return request<IForwardMessageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/chat/forward`
  })
}

/**
 * @description: 上传文件到七牛云
 */
export const uploadQiniuApi = (filePath: string, fileName?: string): Promise<{
  fileName: string, 
  originalName: string,
  fileInfo?: {
    type: string,
    imageFile?: {
      width: number,
      height: number
    },
    videoFile?: {
      width: number,
      height: number,
      duration: number
    },
    audioFile?: {
      duration: number
    }
  }
}> => {
  return new Promise((resolve, reject) => {
    // 构建URL，如果有文件名则作为查询参数传递
    let uploadUrl = `${baseUrl}/api/file/uploadQiniu`;
    if (fileName) {
      uploadUrl += `?fileName=${encodeURIComponent(fileName)}`;
    }
    
    uni.uploadFile({
      url: uploadUrl, 
      filePath: filePath, 
      name: 'file',
      header: {
        token: getLocal('token')
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          resolve(data.result); 
        }
      },
      fail: (err) => {
        console.error('上传失败', err);
        reject(err);
      }
    });
  });
};

// 保留旧的接口名称以兼容现有代码
export const getRecentChatListApi = recentChatListApi
export const getcreateConversationApi = conversationInfoApi
export const getRecentChatInfoApi = conversationInfoApi
export const getChatHistoryApi = chatHistoryApi
export const getuploadQiniuApi = uploadQiniuApi
