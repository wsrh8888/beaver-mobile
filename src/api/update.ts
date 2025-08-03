import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type { 
  IReportVersionReq, 
  IReportVersionRes, 
  IGetLatestVersionReq, 
  IGetLatestVersionRes 
} from '@/types/ajax/update'
import { 
  getDeviceId, 
  getAppId, 
  getPlatformId, 
  getArchId, 
  getAppVersion
} from '@/utils/update/update'

/**
 * @description: 上报用户版本信息
 */
export const reportVersionApi = () => {
  const data: IReportVersionReq = {
    deviceId: getDeviceId(),
    appId: getAppId(),
    platformId: getPlatformId(),
    archId: getArchId(),
    version: getAppVersion()
  };

  return request<IReportVersionRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/update/report`
  })
}

/**
 * @description: 获取最新版本信息
 */
export const getLatestVersionApi = () => {
  const data: IGetLatestVersionReq = {
    deviceId: getDeviceId(),
    appId: getAppId(),
    platformId: getPlatformId(),
    archId: getArchId(),
    version: getAppVersion()
  };

  return request<IGetLatestVersionRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/update/latest`
  })
} 