import { getLocal, removeLocal } from "./local"
import { v4 as uuidv4 } from 'uuid';
import { useCommonStore } from '@/pinia/common/common';

export interface IResponseSuccessData<T> {
  code: number
  msg: string
  result: T
}


export function request<T>({
  url = '',
  data = {},
  method = 'GET',
  header = {},
  timeout = 60000
}: UniNamespace.RequestOptions): Promise<IResponseSuccessData<T>> {
  return new Promise((resolve, reject) => {
    const uniqueId = uuidv4();
    uni.request({
      url: url,
      data: data,
      method: method,
      timeout,
      header: {
        uuid: uniqueId,
        token: getLocal('token') ? getLocal('token') : "",
        'content-type': 'application/json',
        ...header
      },
      success: (res: any) => {
        if (res.statusCode === 403) {
          reject('调用失败')
        } else if (res.statusCode !== 200) {
          reject('调用失败')
        } else {
          resolve(res.data)
        }
      },
      fail: (err: any) => {
        console.log(err)
        reject(err.errMsg)
      }
    })
  })
}