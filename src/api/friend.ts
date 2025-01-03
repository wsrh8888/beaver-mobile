import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'
import type { IAddFriend ,ISearchUser, IResSearchUserInfo} from '@/types/friend/friend'
import type { IFriendInfo, IFriendListRes } from '@/types/ajax/friend'

/**
 * @description: 获取好友列表
 */
export const getFriendListApi = (data) => {
  return request<IFriendListRes>({
    method: 'GET',
    data: data,
    url: `${baseUrl}/api/friend/friend_list`
  })
}

/**
 * @description: 获取好友信息
 */
export const getFriendInfoApi = (data) => {
  return request<IFriendInfo>({
    data: data,
    method: 'GET',
    url: `${baseUrl}/api/friend/friend_info`
  })
}


/**
 * @description: 搜索好友
 */
export const getSearchFriendApi = (data:ISearchUser) => {
  return request<IResSearchUserInfo>({
    method: 'GET',
    data: data,
    url: `${baseUrl}/api/friend/search`
  })
}
/**
 * @description: 申请添加好友
 */
export const applyAddFriendApi = (data:IAddFriend) => {
  return request<{}>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/add_friend`
  })
}

/**
 * @description: 校验好友通过
 */
export const valiFrienddAPi = (data:any) => {
  return request<{}>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/valid`
  })
}


/**
 * @description: 删除好友
 */
export const deleteFriendAPi = (data:any) => {
  return request<{}>({
    data: data,
    method: 'DELETE',
    url: `${baseUrl}/api/friend/delete`
  })
}
