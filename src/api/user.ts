import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type { 
  IUserInfoReq, 
  IUserInfoRes, 
  IUpdateInfoReq, 
  IUpdateInfoRes,
  IUpdatePasswordReq,
  IUpdatePasswordRes,
  IUpdateEmailReq,
  IUpdateEmailRes,
  IResetPasswordReq,
  IResetPasswordRes
} from '@/types/ajax/user'

/**
 * @description: 获取用户基础信息
 */
export const userInfoApi = (data: IUserInfoReq) => {
  return request<IUserInfoRes>({
    method: 'GET',
    data,
    url: `${baseUrl}/api/user/user_info`
  })
}

/**
 * @description: 更新用户基础信息（昵称、头像、个性签名、性别）
 */
export const updateInfoApi = (data: IUpdateInfoReq) => {
  return request<IUpdateInfoRes>({
    data,
    method: 'POST',
    url: `${baseUrl}/api/user/update_info`
  })
}

/**
 * @description: 修改用户密码
 */
export const updatePasswordApi = (data: IUpdatePasswordReq) => {
  return request<IUpdatePasswordRes>({
    data,
    method: 'POST',
    url: `${baseUrl}/api/user/update_password`
  })
}

/**
 * @description: 修改用户邮箱（需要验证码）
 */
export const updateEmailApi = (data: IUpdateEmailReq) => {
  return request<IUpdateEmailRes>({
    data,
    method: 'POST',
    url: `${baseUrl}/api/user/update_email`
  })
}

/**
 * @description: 找回密码（通过邮箱验证码重置密码）
 */
export const resetPasswordApi = (data: IResetPasswordReq) => {
  return request<IResetPasswordRes>({
    data,
    method: 'POST',
    url: `${baseUrl}/api/user/reset_password`
  })
}

// 保留旧的接口名称以兼容现有代码
export const getUserInfoApi = userInfoApi