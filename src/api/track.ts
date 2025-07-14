import { baseUrl } from '@/env.json'
import type { 
  IReportEventsReq, 
  ILogEventsReq, 
  IReportEventsRes, 
  ILogEventsRes 
} from '@/types/ajax/track'
import { getLocal } from '@/utils/local'

/**
 * 上报统计埋点事件和日志
 */
export const reportEventsApi = (data: IReportEventsReq) => {
  return new Promise<IReportEventsRes>((resolve, reject) => {

    uni.request({
      method: 'POST',
      url: `${baseUrl}/api/track/events`,
      data,
      success: (res: any) => {
        resolve(res.data)
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}

/**
 * 记录日志
 */
export const loggerApi = (data: ILogEventsReq) => {

  return new Promise<ILogEventsRes>((resolve, reject) => {

    uni.request({
      method: 'POST',
      url: `${baseUrl}/api/track/logs`,
      data,
      success: (res: any) => {
        resolve(res.data)
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
} 