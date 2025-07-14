import { getLocal, removeLocal } from "./local"
import { v4 as uuidv4 } from 'uuid';
import { useInitStore } from '@/pinia/init/init';
import Logger from '@/logger/logger';

const logger = new Logger("ajax")
export interface IResponseSuccessData<T> {
  code: number
  msg: string
  result: T
}

export interface IResponseErrorData {
  code: number
  msg: string
}

export interface IRequestConfig {
  method: 'GET' | 'POST'
  url: string
  data?: object
  header?: object
}

// 获取设备ID
const getDeviceId = (): string => {
  let deviceId = uni.getStorageSync('uni_device_id');
  if (!deviceId) {
    deviceId = uuidv4(); // 使用 uuid 库生成 v4 UUID
    uni.setStorageSync('uni_device_id', deviceId);
  }
  return deviceId;
};

export const request = <T>(config: IRequestConfig): Promise<IResponseSuccessData<T>> => {
  return new Promise((resolve, reject) => {
    const token = getLocal('token');
    const requestId = uuidv4();
    
    // 记录请求开始
    const requestConfig = {
      ...config,
      requestId
    };

    uni.request({
      method: config.method,
      url: config.url,
      data: config.data,
      header: {
        // 'content-type': 'application/json',
        'token': token || '',
        'DeviceId': getDeviceId(),
        // 'Request-Id': requestId,
        ...config.header
      },
      success: (res: any) => {
        const data = res.data as IResponseSuccessData<T>;
        
      
        if (data.code === 0) {
          logger.info({
            text: "[ajax]接口正常",
            data: {
              uuid: requestId,
              url: config.url,
              config: config,
              response: data
            }
          });
          
        }else {
          logger.error({
            text: "[ajax]状态码异常",
            data: {
              uuid: requestId,
              url: config.url,
              config: config,
              response: data
            }
          });
        }
        
        resolve(data);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        // 记录请求失败日志
        logger.error({
          text: "[ajax]接口异常",
          data: {
            uuid: requestId,
            url: config.url,
            config: config,
            response: err
          }
        });

        
        reject({
          code: -1,
          msg: err.errMsg
        } as IResponseErrorData);
      }
    });
  });
};