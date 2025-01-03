import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'
import type { IValidInfo, IValidListRes } from '@/types/ajax/friend'


/**
 * @description: 获取好友校验列表
 */
export const getFriendValidListApi = (data) => {
  return request<IValidListRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/friend/valid_list`
  })
}