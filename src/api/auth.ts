
import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'

/**
 * @description: 鉴权
 */
export const getAuthenticationApi = () => {
  return request({
    method: 'GET',
    url: `${baseUrl}/api/auth/authentication`
  })
}