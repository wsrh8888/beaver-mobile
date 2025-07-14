

export interface IUserInfoRes {
  userId: string;
  nickName: string;
  avatar: string;
  abstract: string
  email: string;
  gender: number;
}

export interface IRegisterReq {
  password: string;
  email: string;
  code: string;
}