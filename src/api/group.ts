import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
import type {
  IGroupCreateReq,
  IGroupCreateRes,
  IGroupDeleteReq,
  IGroupDeleteRes,
  IGroupMemberRemoveReq,
  IGroupMemberRemoveRes,
  IGroupMemberAddReq,
  IGroupMemberAddRes,
  IGroupMineReq,
  IGroupMineRes,
  IUpdateGroupInfoReq,
  IUpdateGroupInfoRes,
  IGroupMemberListReq,
  IGroupMemberListRes,
  IUpdateMemberRoleReq,
  IUpdateMemberRoleRes,
  IGroupAnnouncementReq,
  IGroupAnnouncementRes,
  IGroupInviteReq,
  IGroupInviteRes,
  IGroupJoinReq,
  IGroupJoinRes,
  IGroupSettingsReq,
  IGroupSettingsRes,
  IGroupMuteReq,
  IGroupMuteRes,
  IGroupQuitReq,
  IGroupQuitRes,
  ITransferOwnerReq,
  ITransferOwnerRes,
  IGroupMuteListReq,
  IGroupMuteListRes,
  IUpdateDisplayNameReq,
  IUpdateDisplayNameRes,
  IGroupInfoReq,
  IGroupInfoRes
} from '@/types/ajax/group'

/**
 * @description: 创建群组
 */
export const groupCreateApi = (data: IGroupCreateReq) => {
  return request<IGroupCreateRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/create`
  })
}

/**
 * @description: 删除群组
 */
export const groupDeleteApi = (data: IGroupDeleteReq) => {
  return request<IGroupDeleteRes>({
    method: 'DELETE',
    data,
    url: `${baseUrl}/api/group/delete/${data.groupId}`
  })
}

/**
 * @description: 移除群成员
 */
export const groupMemberRemoveApi = (data: IGroupMemberRemoveReq) => {
  return request<IGroupMemberRemoveRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/memberRemove`
  })
}

/**
 * @description: 添加群成员
 */
export const groupMemberAddApi = (data: IGroupMemberAddReq) => {
  return request<IGroupMemberAddRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/memberAdd`
  })
}

/**
 * @description: 退出群组
 */
export const quitGroupApi = (data: IGroupQuitReq) => {
  return request<IGroupQuitRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/quit`
  })
}

/**
 * @description: 更新群组信息
 */
export const updateGroupInfoApi = (data: IUpdateGroupInfoReq) => {
  return request<IUpdateGroupInfoRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/update`
  })
}

/**
 * @description: 获取群组信息
 */
export const groupInfoApi = (data: IGroupInfoReq) => {
  return request<IGroupInfoRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/groupInfo`
  })
}

/**
 * @description: 获取我加入的群组列表
 */
export const groupMineApi = (data: IGroupMineReq) => {
  return request<IGroupMineRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/group_mine`
  })
}

/**
 * @description: 获取群成员列表
 */
export const getGroupMembersApi = (data: IGroupMemberListReq) => {
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
  return request<IUpdateMemberRoleRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/member/role`
  })
}

/**
 * @description: 更新群公告
 */
export const updateAnnouncementApi = (data: IGroupAnnouncementReq) => {
  return request<IGroupAnnouncementRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/announcement`
  })
}

/**
 * @description: 邀请新成员
 */
export const inviteMembersApi = (data: IGroupInviteReq) => {
  return request<IGroupInviteRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/invite`
  })
}

/**
 * @description: 申请加入群组
 */
export const joinGroupApi = (data: IGroupJoinReq) => {
  return request<IGroupJoinRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/join`
  })
}

/**
 * @description: 更新群组设置
 */
export const updateSettingsApi = (data: IGroupSettingsReq) => {
  return request<IGroupSettingsRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/settings`
  })
}

/**
 * @description: 群禁言
 */
export const groupMuteApi = (data: IGroupMuteReq) => {
  return request<IGroupMuteRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/mute`
  })
}

/**
 * @description: 转让群主
 */
export const transferOwnerApi = (data: ITransferOwnerReq) => {
  return request<ITransferOwnerRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/transfer`
  })
}

/**
 * @description: 群成员禁言列表
 */
export const groupMuteListApi = (data: IGroupMuteListReq) => {
  return request<IGroupMuteListRes>({
    method: 'GET',
    data,
    url: `${baseUrl}/api/group/mute/list`
  })
}

/**
 * @description: 修改群内显示名称
 */
export const updateDisplayNameApi = (data: IUpdateDisplayNameReq) => {
  return request<IUpdateDisplayNameRes>({
    method: 'POST',
    data,
    url: `${baseUrl}/api/group/member/displayName`
  })
}

