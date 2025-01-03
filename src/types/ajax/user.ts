

export interface IUserInfoRes {
  userId: string;
  nickName: string;
  avatar: string;
  abstract: string
  phone: string;
}

export interface IRegisterReq {
  password: string;
  phone: string;
}