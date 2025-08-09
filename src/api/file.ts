import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import { getLocal } from '@/utils/local';

/**
 * @description: 预览文件
 */
export const previewOnlineFileApi = (fileName: string) => {
  return `${baseUrl}/api/file/preview/${fileName}`
}



/**
 * @description: 上传文件到本地
 */
export const uploadToLocalApi = (filePath: string, fileName?: string): Promise<{
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
    let uploadUrl = `${baseUrl}/api/file/uploadLocal`;
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


// 
export const uploadFileApi = (filePath: string, fileName?: string): Promise<any> => {
  //  if(source === 'local') {
  return uploadToLocalApi(filePath, fileName);
  // } else if(source === 'qiniu') {
    // return uploadQiniuApi(filePath, fileName);
  // }
  //  return Promise.reject(new Error('Invalid source'));
}