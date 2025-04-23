import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'
import type {
  IGroupListRes,
  IGroupCreateReq,
  IGroupCreateRes,
  IGroupDeleteReq,
  IGroupMemberRemoveReq,
  IGroupMemberAddReq,
  IUpdateGroupInfoReq,
  IGroupMemberListRes,
  IUpdateMemberRoleReq,
  IGroupAnnouncementReq,
  IGroupInviteReq,
  IGroupJoinReq,
  IGroupSettingsReq,
  IGroupMuteReq,
  IGroupFileUploadReq,
  IGroupFileUploadRes,
  IGroupFileListReq,
  IGroupFileListRes,
  IGroupFileDeleteReq,
  IGroupQuitReq,
  ITransferOwnerReq,
  IGroupMuteListReq,
  IGroupMuteListRes,
  IUpdateDisplayNameReq,
  IGroupInfoReq,
  IGroupInfoRes
} from '@/types/ajax/group'

/**
 * @description: 创建群组
 */
export const createGroupApi = (data: IGroupCreateReq) => {
  return request<IGroupCreateRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/create`
  })
}

/**
 * @description: 删除群组
 */
export const deleteGroupApi = (data: IGroupDeleteReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/delete/${data.groupId}`
  })
}

/**
 * @description: 移除群成员
 */
export const removeGroupMemberApi = (data: IGroupMemberRemoveReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/memberRemove`
  })
}

/**
 * @description: 添加群成员
 */
export const addGroupMemberApi = (data: IGroupMemberAddReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/memberAdd`
  })
}

/**
 * @description: 获取群组列表
 */
export const getGroupListApi = (data) => {
  return request<IGroupListRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/group_mine`
  })
}

/**
 * @description: 更新群组信息
 */
export const updateGroupInfoApi = (data: IUpdateGroupInfoReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/update`
  })
}

/**
 * @description: 获取群成员列表
 */
export const getGroupMembersApi = (data: { groupId: string; page?: number; limit?: number }) => {
  return request<IGroupMemberListRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/members`
  })
}

/**
 * @description: 更新群成员角色
 */
export const updateMemberRoleApi = (data: IUpdateMemberRoleReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/member/role`
  })
}

/**
 * @description: 更新群公告
 */
export const updateGroupAnnouncementApi = (data: IGroupAnnouncementReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/announcement`
  })
}

/**
 * @description: 邀请成员
 */
export const inviteGroupMembersApi = (data: IGroupInviteReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/invite`
  })
}

/**
 * @description: 申请加入群组
 */
export const joinGroupApi = (data: IGroupJoinReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/join`
  })
}

/**
 * @description: 更新群组设置
 */
export const updateGroupSettingsApi = (data: IGroupSettingsReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/settings`
  })
}

/**
 * @description: 群成员禁言管理
 */
export const groupMuteApi = (data: IGroupMuteReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/mute`
  })
}

/**
 * @description: 上传群文件
 */
export const uploadGroupFileApi = (data: IGroupFileUploadReq) => {
  return request<IGroupFileUploadRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/file/upload`
  })
}

/**
 * @description: 获取群文件列表
 */
export const getGroupFileListApi = (data: IGroupFileListReq) => {
  return request<IGroupFileListRes>({
    method: 'GET',
    data,
    url: `${baseUrl}/api/group/file/list`
  })
}

/**
 * @description: 删除群文件
 */
export const deleteGroupFileApi = (data: IGroupFileDeleteReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/file/delete`
  })
}

/**
 * @description: 退出群组
 */
export const quitGroupApi = (data: IGroupQuitReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/quit`
  })
}

/**
 * @description: 转让群主
 */
export const transferGroupOwnerApi = (data: ITransferOwnerReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/transfer`
  })
}

/**
 * @description: 获取禁言成员列表
 */
export const getGroupMuteListApi = (data: IGroupMuteListReq) => {
  return request<IGroupMuteListRes>({
    method: 'GET',
    data,
    url: `${baseUrl}/api/group/mute/list`
  })
}

/**
 * @description: 更新群内显示名称
 */
export const updateDisplayNameApi = (data: IUpdateDisplayNameReq) => {
  return request<{}>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/member/displayName`
  })
}

/**
 * @description: 获取群的基础信息
 */
export const getGroupInfoApi = (data: IGroupInfoReq) => {
  return request<IGroupInfoRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/groupInfo`
  })
}

