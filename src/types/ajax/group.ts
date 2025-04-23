// 群组信息
export interface IGroupInfo {
  /**
   * @description: 群组名称
   */
  title: string;
  /**
   * @description: 群组名称
   */
  name: string;
  /**
   * @description: 群组头像URL
   */
  avatar: string;
  /**
   * @description: 成员数量
   */
  memberCount: number;
  /**
   * @description: 会话ID
   */
  conversationId: string;
  /**
   * @description: 群组ID
   */
  groupId: string;
  ownerId: string;
  members: IGroupMember[];
  notice?: string;
  desc?: string;
}

// 群组列表响应
export interface IGroupListRes {
  /**
   * @description: 总数
   */
  count: number;
  /**
   * @description: 群组列表
   */
  list: IGroupInfo[];
}

// 群成员信息
export interface IGroupMember {
  /**
   * @description: 成员用户ID
   */
  userId: string;
  /**
   * @description: 成员昵称
   */
  nickName: string;
  /**
   * @description: 成员头像URL
   */
  avatar: string;
  /**
   * @description: 成员角色：0普通成员 1管理员 2群主
   */
  role: number;
  /**
   * @description: 加入时间
   */
  joinTime: string;
}

// 群成员列表响应
export interface IGroupMemberListRes {
  /**
   * @description: 成员列表
   */
  list: IGroupMember[];
  /**
   * @description: 总数
   */
  count: number;
}

// 群文件信息
export interface IGroupFileInfo {
  /**
   * @description: 文件ID
   */
  fileId: string;
  /**
   * @description: 文件名
   */
  fileName: string;
  /**
   * @description: 文件大小(字节)
   */
  fileSize: number;
  /**
   * @description: 文件类型
   */
  fileType: string;
  /**
   * @description: 上传者ID
   */
  uploader: string;
  /**
   * @description: 上传时间
   */
  uploadTime: string;
  /**
   * @description: 下载次数
   */
  downloadCount: number;
}

// 群文件列表响应
export interface IGroupFileListRes {
  /**
   * @description: 文件列表
   */
  list: IGroupFileInfo[];
  /**
   * @description: 总数
   */
  count: number;
}

// 创建群组请求
export interface IGroupCreateReq {
  /**
   * @description: 群组名称，可选
   */
  name?: string;
  /**
   * @description: 初始成员ID列表，可选
   */
  userIdList?: string[];
}

// 创建群组响应
export interface IGroupCreateRes {
  /**
   * @description: 创建的群组ID
   */
  groupId: string;
}

// 删除群组请求
export interface IGroupDeleteReq {
  /**
   * @description: 要删除的群组ID
   */
  groupId: string;
}

// 移除群成员请求
export interface IGroupMemberRemoveReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 要移除的成员ID列表
   */
  userIds: string[];
}

// 添加群成员请求
export interface IGroupMemberAddReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 要添加的成员ID列表
   */
  userIds: string[];
}

// 更新群组信息请求
export interface IUpdateGroupInfoReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 新群名称，可选
   */
  name?: string;
  /**
   * @description: 新群头像URL，可选
   */
  avatar?: string;
  /**
   * @description: 新群公告，可选
   */
  notice?: string;
  /**
   * @description: 加入方式：0自由加入 1需要验证 2不允许加入
   */
  joinType?: number;
}

// 更新成员角色请求
export interface IUpdateMemberRoleReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 目标成员ID
   */
  memberId: string;
  /**
   * @description: 新角色：0普通成员 1管理员
   */
  role: number;
}

// 更新群公告请求
export interface IGroupAnnouncementReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 公告内容
   */
  announcement: string;
}

// 邀请成员请求
export interface IGroupInviteReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 被邀请的用户ID列表
   */
  userList: string[];
  /**
   * @description: 邀请消息，可选
   */
  message?: string;
}

// 加入群组请求
export interface IGroupJoinReq {
  /**
   * @description: 目标群组ID
   */
  groupId: string;
  /**
   * @description: 申请消息，可选
   */
  message?: string;
}

// 更新群组设置请求
export interface IGroupSettingsReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 是否全员禁言
   */
  muteAll?: boolean;
  /**
   * @description: 加群验证：0无需验证 1需要验证 2不允许加入
   */
  joinAuth?: number;
  /**
   * @description: 是否允许成员邀请他人
   */
  memberInvite?: boolean;
  /**
   * @description: 是否允许成员管理群组
   */
  memberAuth?: boolean;
}

// 群禁言请求
export interface IGroupMuteReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 目标成员ID
   */
  memberId: string;
  /**
   * @description: 禁言时长(分钟)，0表示解除禁言
   */
  duration: number;
}

// 群文件上传请求
export interface IGroupFileUploadReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 文件名
   */
  fileName: string;
  /**
   * @description: 文件大小(字节)
   */
  fileSize: number;
  /**
   * @description: 文件类型(MIME类型)
   */
  fileType: string;
}

// 群文件上传响应
export interface IGroupFileUploadRes {
  /**
   * @description: 上传成功的文件信息
   */
  fileInfo: IGroupFileInfo;
}

// 群文件列表请求
export interface IGroupFileListReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 页码，可选，默认1
   */
  page?: number;
  /**
   * @description: 每页数量，可选，默认20
   */
  limit?: number;
}

// 群文件删除请求
export interface IGroupFileDeleteReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 要删除的文件ID
   */
  fileId: string;
}

// 退出群组请求
export interface IGroupQuitReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
}

// 转让群主请求
export interface ITransferOwnerReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 新群主ID
   */
  newOwnerId: string;
}

// 群成员禁言列表请求
export interface IGroupMuteListReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 页码，可选，默认1
   */
  page?: number;
  /**
   * @description: 每页数量，可选，默认20
   */
  limit?: number;
}

// 群成员禁言列表响应
export interface IGroupMuteListRes {
  /**
   * @description: 被禁言的成员列表
   */
  list: IGroupMember[];
  /**
   * @description: 总数
   */
  count: number;
}

// 修改群内显示名称请求
export interface IUpdateDisplayNameReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
  /**
   * @description: 新的群内显示名称
   */
  displayName: string;
}

export interface IGroupInfoReq {
  /**
   * @description: 群组ID
   */
  groupId: string;
}

export interface IGroupInfoRes {
  /**
   * @description: 会话ID
   */
  conversationId: IGroupInfo;
  
  /**
   * @description: 群组头像URL
   */
  avatar: string;

  /**
   * @description: 群组名称
   */
  title: string;
}