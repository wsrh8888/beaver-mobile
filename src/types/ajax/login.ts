export interface ILoginReq {
  email: string;
  password: string;
}

export interface ILoginRes {
  token: string;
  userId: string;
}

export interface IUpdateInfoReq {
  nick_name?: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  birthday?: string;
  email?: string;
}

