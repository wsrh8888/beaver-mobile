import { v4 as uuidv4 } from 'uuid'
import { updateId } from '@/env.json'

/**
 * 获取当前应用版本号
 * @returns {string} 版本号字符串
 */
export const getCurrentVersion = (): string => {
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

/**
 * 获取平台信息
 * @returns {string} 平台名称
 */
export const getPlatform = (): string => {
  // #ifdef APP-PLUS
  try {
    if (plus && plus.os && plus.os.name) {
      return plus.os.name.toLowerCase();
    }
  } catch (error) {
    console.warn('获取平台信息失败:', error);
  }
  return 'app';
  // #endif
  
  // #ifdef H5
  // H5环境下，根据userAgent判断实际操作系统
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('android')) {
    return 'android';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'ios';
  }
  return 'h5'; // 默认返回h5
  // #endif
  
  return 'unknown';
};

// 获取设备ID
export const getDeviceId = (): string => {
  let deviceId = uni.getStorageSync('uni_device_id');
  if (!deviceId) {
    deviceId = uuidv4();
    uni.setStorageSync('uni_device_id', deviceId);
  }
  return deviceId;
};

// 获取应用版本号（兼容性别名）
export const getAppVersion = (): string => {
  return getCurrentVersion();
};

// 获取平台ID：1=Windows, 2=MacOS, 3=iOS, 4=Android, 5=HarmonyOS
export const getPlatformId = (): number => {
  const platform = getPlatform();
  
  if (platform === 'android') {
    return 4; // Android
  } else if (platform === 'ios') {
    return 3; // iOS
  } 
  
  return 0; // 默认H5
};

// 获取架构ID：0=H5, 1=WinX64, 2=WinArm64, 3=MacIntel, 4=MacApple, 5=iOS, 6=Android, 7=HarmonyOS
export const getArchId = (): number => {
  // #ifdef APP-PLUS
  const platform = getPlatform();
  if (platform === 'android') {
    return 6; // Android APP
  } else if (platform === 'ios') {
    return 5; // iOS APP
  }
  return 6; // 默认Android APP
  // #endif
  
  return 0; // 默认H5
};

// 获取更新ID
export const getAppId = (): string => {
  return updateId;
}; 