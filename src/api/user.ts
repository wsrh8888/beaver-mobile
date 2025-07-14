import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'

import type { IRegisterReq, IUserInfoRes } from '@/types/ajax/user'
import type { ILoginReq, ILoginRes, IUpdateInfoReq } from '@/types/ajax/login'
// import { IUserInfoRes } from '../types/ajax/user'


/**
 * @description:  获取用户信息
 */
export const getUserInfoApi = () => {
  return request<IUserInfoRes>({
    method: 'GET',
    url: `${baseUrl}/api/user/user_info`
  })
}


/**
 * @description:  注册用户
 */
export const registerApi = (data: IRegisterReq) => {
  return request({
    method: 'POST',
    data,
    url: `${baseUrl}/api/auth/email_register`
  })
}



/**
 * @description: 登录
 */
export const loginApi = (data: ILoginReq) => {
  return request<ILoginRes>({
    data,
    method: 'POST',
    url: `${baseUrl}/api/auth/email_password_login`
  })
}
/**
 * @description: 修改用户信息
 */
export const updateInfoApi = (data: IUpdateInfoReq) => {
  return request({
    data,
    method: 'POST',
    url: `${baseUrl}/api/user/update_info`
  })
}

/**
 * @description: 找回密码
 */
export const resetPasswordApi = (data: { email: string; verifyCode: string; password: string }) => {
  return request({
    data,
    method: 'POST',
    url: `${baseUrl}/api/user/reset_password`
  })
}