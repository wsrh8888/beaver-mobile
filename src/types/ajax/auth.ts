// 手机号登录请求
export interface IPhoneLoginReq {
  phone: string;
  password: string;
  deviceId?: string;
}

// 手机号登录响应
export interface IPhoneLoginRes {
  token: string;
  userId: string;
}

// 邮箱密码登录请求
export interface IEmailPasswordLoginReq {
  email: string;
  password: string;
  deviceId?: string;
}

// 邮箱密码登录响应
export interface IEmailPasswordLoginRes {
  token: string;
  userId: string;
}

// 用户认证请求
export interface IAuthenticationReq {
  token?: string;
  validPath?: string;
}

// 用户认证响应
export interface IAuthenticationRes {
  userId: string;
}

// 手机号注册请求
export interface IPhoneRegisterReq {
  phone: string;
  password: string;
  code: string;
}

// 手机号注册响应
export interface IPhoneRegisterRes {
  message: string;
}

// 邮箱注册请求
export interface IEmailRegisterReq {
  email: string;
  password: string;
  code: string;
}

// 邮箱注册响应
export interface IEmailRegisterRes {
  message: string;
}

// 用户登出请求
export interface ILogoutReq {}

// 用户登出响应
export interface ILogoutRes {}

// 刷新Token请求
export interface IRefreshTokenReq {}

// 刷新Token响应
export interface IRefreshTokenRes {
  token: string;
}

// 会话信息
export interface ISessionInfo {
  deviceId: string;
  deviceName: string;
  lastActive: string;
  ip: string;
}

// 获取用户会话列表请求
export interface IGetUserSessionsReq {}

// 获取用户会话列表响应
export interface IGetUserSessionsRes {
  sessions: ISessionInfo[];
}

// 终止会话请求
export interface ITerminateSessionReq {
  deviceId: string;
}

// 终止会话响应
export interface ITerminateSessionRes {}

// 获取手机验证码请求
export interface IGetPhoneCodeReq {
  phone: string;
  type: string; // 验证码类型：register(注册)、reset(重置密码)、login(登录)
}

// 获取手机验证码响应
export interface IGetPhoneCodeRes {
  message: string;
}

// 获取邮箱验证码请求
export interface IGetEmailCodeReq {
  email: string;
  type: string; // 验证码类型：register(注册)、reset(重置密码)、login(登录)
}

// 获取邮箱验证码响应
export interface IGetEmailCodeRes {
  message: string;
}

// 邮箱登录请求
export interface IEmailLoginReq {
  email: string;
  code: string;
  deviceId?: string;
}

// 邮箱登录响应
export interface IEmailLoginRes {
  token: string;
  userId: string;
} 