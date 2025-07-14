export interface IEmailLoginReq {
  email: string;
  code: string;
  deviceId?: string;
}

export interface IEmailLoginRes {
  token: string;
  userId: string;
}

export interface IEmailPasswordLoginReq {
  email: string;
  password: string;
  deviceId?: string;
}

export interface IEmailPasswordLoginRes {
  token: string;
  userId: string;
}

export interface IEmailRegisterReq {
  email: string;
  password: string;
  code: string;
}

export interface IEmailRegisterRes {
  message: string;
}

export interface IGetEmailCodeReq {
  email: string;
  type: string; // register(注册)、reset(重置密码)、login(登录)
}

export interface IGetEmailCodeRes {
  message: string;
} 