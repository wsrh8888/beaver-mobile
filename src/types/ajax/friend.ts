export interface IValidInfo {
  message: string;
  avatar: string;
  flag: string;
  id: number;
  nickname: string;
  userId: string;
  status: number;
  createTime?: number;
}

export interface IValidListRes {
  count: number;
  list: IValidInfo[];
}

export interface IFriendListRes {
  list: IFriendInfo[];
}

export interface IFriendInfo {
  avatar: string;
  conversationId: string;
  isFriend: boolean;
  nickname: string;
  notice: string;
  userId: string;
  index?: number;
}

export interface IUserMapInfo {
  avatar: string;
  conversationId: string;
  isFriend: boolean;
  nickname: string;
  userId: string;
}

// 新增的请求和响应类型
export interface IFriendListReq {
  page?: number;
  limit?: number;
}

export interface IFriendInfoReq {
  friendId: string;
}

export interface IAddFriendReq {
  friendId: string;
  verify?: string;
}

export interface IAddFriendRes {}

export interface ISearchReq {
  phone: string;
}

export interface ISearchRes {
  userId: string;
  nickname: string;
  avatar: string;
  abstract: string;
  notice: string;
  isFriend: boolean;
  conversationId: string;
}

export interface IDeleteFriendReq {
  friendId: string;
}

export interface IDeleteFriendRes {}

export interface IValidStatusReq {
  verifyId: number;
  status: number;
}

export interface IValidStatusRes {}

export interface IValidListReq {
  page?: number;
  limit?: number;
}

export interface INoticeUpdateReq {
  notice: string;
  friendId: string;
}

export interface INoticeUpdateRes {}

export interface ISearchValidInfoReq {
  friendId: string;
}

export interface ISearchValidInfoRes {
  validId: number;
}

export interface IResSearchUserInfo {
  userId: string;
  nickname: string;
  avatar: string;
  abstract: string;
  notice: string;
  isFriend: boolean;
  conversationId: string;
}