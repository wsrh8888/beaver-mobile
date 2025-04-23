import { getLocal, removeLocal } from "./local"
import { v4 as uuidv4 } from 'uuid';
import { useInitStore } from '@/pinia/init/init';

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

export const request = <T>(config: IRequestConfig): Promise<IResponseSuccessData<T>> => {
  return new Promise((resolve, reject) => {
    const token = getLocal('token');
    const requestId = uuidv4();
    console.log({
      btnName: "request 请求",
      uuid: requestId,
      config: config
    });
    uni.request({
      method: config.method,
      url: config.url,
      data: config.data,
      header: {
        // 'content-type': 'application/json',
        'token': token || '',
        // 'Request-Id': requestId,
        ...config.header
      },
      success: (res: any) => {
        const data = res.data as IResponseSuccessData<T>;
        if (data.code === 0) {
          console.log({
            btnName: "response 请求成功",
            uuid: requestId,
            data: data
          });
        }else {
          console.log({
            btnName: "response 请求失败",
            uuid: requestId,
            data: data
          });
        }
        // 如果返回码为1，说明token已失效
        if (data.code != 0 && config.url.includes('authentication')) {
          const initStore = useInitStore();
          removeLocal('token');
          initStore.resetApp();
          uni.reLaunch({
            url: '/pages/login/login'
          });
          reject(new Error('Token expired'));
          return;
        }
        
        resolve(data);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        if (config.url.includes('authentication')) {
          const initStore = useInitStore();
          removeLocal('token');
          initStore.resetApp();
          uni.reLaunch({
            url: '/pages/login/login'
          });
          reject(new Error('Token expired'));
          return;
        }
        console.error({
          btnName: "response 请求异常",
          uuid: requestId,
          data: err
        });
        reject({
          code: -1,
          msg: err.errMsg
        } as IResponseErrorData);
      }
    });
  });
};