
export interface ILoginReq {
  phone: string;
  password: string;
}

export interface ILoginRes {
  token: string;
}
export interface IUpdateInfoReq {
  nick_name?: string;
   avatar?: string;
}

