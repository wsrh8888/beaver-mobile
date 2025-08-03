import { getLocal, removeLocal } from "../local"
import { v4 as uuidv4 } from 'uuid';
import { useInitStore } from '@/pinia/init/init';
import Logger from '@/logger/logger';
import { getCommonHeader } from "../common";

const logger = new Logger("ajax");

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
  method: 'GET' | 'POST' | 'DELETE'
  url: string
  data?: object
  header?: object
}


export const request = <T>  (config: IRequestConfig): Promise<IResponseSuccessData<T>> => {
  return new Promise((resolve, reject) => {
    const requestId = uuidv4();
    
    // 记录请求开始
    const requestConfig = {
      ...config,
      requestId,
      ...getCommonHeader()
    };

    uni.request({
      method: config.method,
      url: config.url,
      data: config.data,
      header: requestConfig,
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