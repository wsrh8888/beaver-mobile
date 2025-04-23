export interface IGroupNumberInfo {
 /**
   * @description: 成员用户ID
   */
 userId: string;
 /**
  * @description: 成员角色：0普通成员 1管理员 2群主
  */
 role: number;
 /**
  * @description: 加入时间
  */
 joinTime: string;
}