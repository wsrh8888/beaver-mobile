import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'
import type { IChatHistoryRes, IRecentChatRes } from '@/types/ajax/chat'
import { getLocal } from '@/utils/local';
/**
 * @description: 获取最新的聊天列表
 */
export const getRecentChatListApi = () => {
  return request<IRecentChatRes>({
    method: 'GET',
    url: `${baseUrl}/api/chat/getRecentChatList`
  })
}
/**
 * @description: 创建会话
 */
export const getcreateConversationApi = (data:object) => {
  return request<IRecentChatRes>({
    method: 'POST',
    data:data,
    url: `${baseUrl}/api/chat/createConversation`
  })
}
/**
 * @description: 获取与好友聊天记录
 */
export const getChatHistoryApi = (data) => {
  return request<IChatHistoryRes>({
    method: 'POST',
    data:data,
    url: `${baseUrl}/api/chat/getChatHistory`
  })
}
/**
 * @description: 上传文件到七牛云  file
 */
export const getuploadQiniuApi = (filePath:string) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl}/api/file/uploadQiniu`, 
      filePath: filePath, 
      name: 'file',
      header: {
        token: getLocal('token')
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          resolve(data.result.src); 
        }
      },
      fail: (err) => {
        console.error('上传失败', err);
        reject(err);  // 上传失败，返回错误
      }
    });
  });
};
