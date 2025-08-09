
import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type { 
  IPhoneLoginReq, 
  IPhoneLoginRes,
  IEmailPasswordLoginReq, 
  IEmailPasswordLoginRes, 
  IEmailRegisterReq, 
  IEmailRegisterRes, 
  IGetEmailCodeReq, 
  IGetEmailCodeRes,
  IPhoneRegisterReq,
  IPhoneRegisterRes,
  ILogoutReq,
  ILogoutRes,
  IRefreshTokenReq,
  IRefreshTokenRes,
  IGetUserSessionsReq,
  IGetUserSessionsRes,
  ITerminateSessionReq,
  ITerminateSessionRes,
  IGetPhoneCodeReq,
  IGetPhoneCodeRes,
  IEmailLoginReq,
  IEmailLoginRes
} from '@/types/ajax/auth'
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
 * @description: 手机号登录
 */
export const phoneLoginApi = (data: IPhoneLoginReq) => {
  return request<IPhoneLoginRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/phone_login`
  })
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
 * @description: 用户认证
 */
export const authenticationApi = () => {
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
 * @description: 手机号注册
 */
export const phoneRegisterApi = (data: IPhoneRegisterReq) => {
  return request<IPhoneRegisterRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/phone_register`
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
 * @description: 用户登出
 */
export const logoutApi = (data: ILogoutReq) => {
  return request<ILogoutRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/logout`
  })
}

/**
 * @description: 刷新Token
 */
export const refreshTokenApi = (data: IRefreshTokenReq) => {
  return request<IRefreshTokenRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/refresh_token`
  })
}

/**
 * @description: 获取用户会话列表
 */
export const getUserSessionsApi = (data: IGetUserSessionsReq) => {
  return request<IGetUserSessionsRes>({
    method: 'GET',
    data,
    url: `${baseUrl}/api/auth/sessions`
  })
}

/**
 * @description: 终止会话
 */
export const terminateSessionApi = (data: ITerminateSessionReq) => {
  return request<ITerminateSessionRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/terminate_session`
  })
}

/**
 * @description: 获取手机验证码
 */
export const getPhoneCodeApi = (data: IGetPhoneCodeReq) => {
  return request<IGetPhoneCodeRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/phonecode`
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
