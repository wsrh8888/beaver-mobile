/**
 * 二维码操作类型
 */
export type QRCodeAction = 
  | 'addFriend'      // 添加好友
  | 'joinGroup'      // 加入群聊

/**
 * 添加好友的payload格式
 */
export interface AddFriendPayload {
  userId: string;
}

/**
 * 加入群聊的payload格式
 */
export interface JoinGroupPayload {
  groupId: string;
}

/**
 * 根据action类型获取对应的payload类型
 */
export type QRCodePayload<T extends QRCodeAction> = 
  T extends 'addFriend' ? AddFriendPayload :
  T extends 'joinGroup' ? JoinGroupPayload :
  never;

/**
 * 二维码数据结构
 */
export interface QRCodeData<T extends QRCodeAction = QRCodeAction> {
  /** 操作类型 */
  action: T;
  /** 应用名称 */
  appName: string;
  /** 应用版本号 */
  version: string;
  /** 生成时间戳 */
  timestamp: number;
  /** 
   * @description 过期时间戳
   * @param -1表示永不过期
   * @param 单位是分钟
   */
  expireAt: number;
  /** 业务数据 */
  payload: QRCodePayload<T>;
}


