export interface IAddFriend {
  friendId: string;
  verify: string;
}
export interface ISearchUser {
  email: string;
}
export interface IResSearchUserInfo {
  Abstract: string;
  avatar: string;
  conversationId: string;
  isFriend: boolean;
  nickname: string;
  notice: string;
  userId: string;
}
