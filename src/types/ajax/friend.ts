
export interface IValidInfo {
  message: string;
  avatar: string;
  flag: string;
  id: number;
  nickname: string;
  userId: string;
  status: number;

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