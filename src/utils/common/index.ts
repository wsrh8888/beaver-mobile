import { getLocal } from "../local";


/**
 * 检查当前平台
 */
export const getPlatform = () => {
  // #ifdef H5
  return 'h5';
  // #endif
  
  // #ifdef APP-PLUS
  return 'app-plus';
  // #endif
  
  return 'unknown';
}

/**
 * 接口的公共请求头
 */
export const getCommonHeader = () => {
  const token = getLocal('token');
  const deviceId = uni.getStorageSync('deviceId');
  return {
    token: token,
    deviceId: deviceId,
    version: appVersion()
  }
}


/**
 * 获取APP版本号
 */
export const appVersion = (): string => {
  try {
    // APP环境下，优先使用plus.runtime.version
    if (plus && plus.runtime && plus.runtime.version) {
      return plus.runtime.version;
    }
  } catch (error) {
    console.warn('获取APP版本号失败:', error);
  }  
  return '';
};
