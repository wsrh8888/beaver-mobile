import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type { 
  IFriendInfo, 
  IFriendListRes, 
  IFriendListReq, 
  IAddFriendReq, 
  IAddFriendRes,
  IFriendDeleteReq,
  IFriendDeleteRes,
  IFriendValidStatusReq,
  IFriendValidStatusRes,
  IValidListReq,
  IValidListRes,
  IFriendInfoReq,
  INoticeUpdateReq,
  INoticeUpdateRes,
  ISearchReq,
  ISearchRes,
  ISearchValidInfoReq,
  ISearchValidInfoRes
} from '@/types/ajax/friend'

/**
 * @description: 添加好友
 */
export const addFriendApi = (data: IAddFriendReq) => {
  return request<IAddFriendRes>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/add_friend`
  })
}

/**
 * @description: 好友校验状态
 */
export const userValidStatusApi = (data: IFriendValidStatusReq) => {
  return request<IFriendValidStatusRes>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/valid`
  })
}

/**
 * @description: 删除好友
 */
export const friendDeleteApi = (data: IFriendDeleteReq) => {
  return request<IFriendDeleteRes>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/delete`
  })
}

/**
 * @description: 好友列表
 */
export const friendListApi = (data: IFriendListReq) => {
  return request<IFriendListRes>({
    method: 'GET',
    data: data,
    url: `${baseUrl}/api/friend/friend_list`
  })
}

/**
 * @description: 好友校验列表
 */
export const validListApi = (data: IValidListReq) => {
  return request<IValidListRes>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/valid_list`
  })
}

/**
 * @description: 获取好友信息
 */
export const friendInfoApi = (data: IFriendInfoReq) => {
  return request<IFriendInfo>({
    data: data,
    method: 'GET',
    url: `${baseUrl}/api/friend/friend_info`
  })
}

/**
 * @description: 修改好友备注
 */
export const noticeUpdateApi = (data: INoticeUpdateReq) => {
  return request<INoticeUpdateRes>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/update_notice`
  })
}



/**
 * @description: 搜索好友
 */
export const searchApi = (data: ISearchReq) => {
  return request<ISearchRes>({
    method: 'GET',
    data: data,
    url: `${baseUrl}/api/friend/search`
  })
}

/**
 * @description: 搜索校验好友信息
 */
export const searchValidInfoApi = (data: ISearchValidInfoReq) => {
  return request<ISearchValidInfoRes>({
    data: data,
    method: 'POST',
    url: `${baseUrl}/api/friend/searchValidInfo`
  })
}
