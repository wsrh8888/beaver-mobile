import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type {
  IAddEmojiReq,
  IAddEmojiRes,
  IUpdateFavoriteEmojiReq,
  IUpdateFavoriteEmojiRes,
  IGetEmojisListReq,
  IGetEmojisListRes,
  IGetEmojiPackagesReq,
  IGetEmojiPackagesRes,
  IGetEmojiPackageDetailReq,
  IGetEmojiPackageDetailRes,
  IUpdateFavoriteEmojiPackageReq,
  IUpdateFavoriteEmojiPackageRes,
  ICreateEmojiPackageReq,
  ICreateEmojiPackageRes,
  IAddEmojiToPackageReq,
  IAddEmojiToPackageRes,
  IDeleteEmojiFromPackageReq,
  IDeleteEmojiFromPackageRes,
  IBatchAddEmojiToPackageReq,
  IBatchAddEmojiToPackageRes,
  IGetUserFavoritePackagesReq,
  IGetUserFavoritePackagesRes
} from '@/types/ajax/emoji'

/**
 * @description: 添加表情
 */
export const addEmojiApi = (data: IAddEmojiReq) => {
  return request<IAddEmojiRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/add`
  })
}

/**
 * @description: 更新表情收藏状态
 */
export const updateFavoriteEmojiApi = (data: IUpdateFavoriteEmojiReq) => {
  return request<IUpdateFavoriteEmojiRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/favoriteEmoji`
  })
}

/**
 * @description: 获取用户收藏的表情列表
 */
export const getEmojisListApi = (data: IGetEmojisListReq) => {
  return request<IGetEmojisListRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/favoriteList`
  })
}

/**
 * @description: 获取表情包列表
 */
export const getEmojiPackagesApi = (data: IGetEmojiPackagesReq) => {
  return request<IGetEmojiPackagesRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageList`
  })
}

/**
 * @description: 获取表情包详情
 */
export const getEmojiPackageDetailApi = (data: IGetEmojiPackageDetailReq) => {
  return request<IGetEmojiPackageDetailRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageInfo`
  })
}

/**
 * @description: 收藏或取消收藏表情包
 */
export const updateFavoriteEmojiPackageApi = (data: IUpdateFavoriteEmojiPackageReq) => {
  return request<IUpdateFavoriteEmojiPackageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageFavorite`
  })
}

/**
 * @description: 获取用户收藏的表情包列表
 */
export const getUserFavoritePackagesApi = (data: IGetUserFavoritePackagesReq) => {
  return request<IGetUserFavoritePackagesRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/favoritePackageList`
  })
}

/**
 * @description: 创建表情包集合
 */
export const createEmojiPackageApi = (data: ICreateEmojiPackageReq) => {
  return request<ICreateEmojiPackageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageCreate`
  })
}

/**
 * @description: 添加表情到表情包
 */
export const addEmojiToPackageApi = (data: IAddEmojiToPackageReq) => {
  return request<IAddEmojiToPackageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageAddEmoji`
  })
}

/**
 * @description: 从表情包中删除表情
 */
export const deleteEmojiFromPackageApi = (data: IDeleteEmojiFromPackageReq) => {
  return request<IDeleteEmojiFromPackageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageDeleteEmoji`
  })
}

/**
 * @description: 批量添加表情到表情包
 */
export const batchAddEmojiToPackageApi = (data: IBatchAddEmojiToPackageReq) => {
  return request<IBatchAddEmojiToPackageRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/emoji/packageBatchAdd`
  })
} 