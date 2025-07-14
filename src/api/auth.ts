
import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'
import type { IEmailLoginReq, IEmailLoginRes, IEmailPasswordLoginReq, IEmailPasswordLoginRes, IEmailRegisterReq, IEmailRegisterRes, IGetEmailCodeReq, IGetEmailCodeRes } from '@/types/ajax/auth'
import { getLocal, removeLocal } from '@/utils/local'
import { useInitStore } from '@/pinia/init/init'
import { v4 as uuidv4 } from 'uuid'

// 获取设备ID
const getDeviceId = (): string => {
  let deviceId = uni.getStorageSync('uni_device_id');
  if (!deviceId) {
    deviceId = uuidv4();
    uni.setStorageSync('uni_device_id', deviceId);
  }
  return deviceId;
};

/**
 * @description: 鉴权 - 使用专门的request方法
 */
export const getAuthenticationApi = () => {
  return new Promise((resolve, reject) => {
    const token = getLocal('token');

    uni.request({
      method: 'GET',
      url: `${baseUrl}/api/auth/authentication`,
      header: {
        'token': token || '',
        'DeviceId': getDeviceId(),
      },
      success: (res: any) => {
        const data = res.data;
        // 如果返回码为1，说明token已失效
        if (data.code === 1) {
          const initStore = useInitStore();
          removeLocal('token');

          initStore.resetApp();
          
          // 检查当前页面路径，避免重复导航
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          const currentPath = currentPage?.route;
          
          if (currentPath !== 'pages/login/login') {
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }
        }
        
        resolve(data);
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        // 网络错误也当作token失效处理
        console.error('Network error during authentication:', err);
        const initStore = useInitStore();
        removeLocal('token');
        initStore.resetApp();
        
        // 检查当前页面路径，避免重复导航
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const currentPath = currentPage?.route;
        
        if (currentPath !== 'pages/login/login') {
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }
        reject(new Error('Network error'));
      }
    });
  });
}

/**
 * @description: 邮箱密码登录
 */
export const emailPasswordLoginApi = (data: IEmailPasswordLoginReq) => {
  return request<IEmailPasswordLoginRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/email_password_login`
  })
}

/**
 * @description: 邮箱登录
 */
export const emailLoginApi = (data: IEmailLoginReq) => {
  return request<IEmailLoginRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/email_login`
  })
}

/**
 * @description: 邮箱注册
 */
export const emailRegisterApi = (data: IEmailRegisterReq) => {
  return request<IEmailRegisterRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/email_register`
  })
}

/**
 * @description: 获取邮箱验证码
 */
export const getEmailCodeApi = (data: IGetEmailCodeReq) => {
  return request<IGetEmailCodeRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/emailcode`
  })
}