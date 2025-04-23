import type { IUserInfo } from '@/types/store/userInfo';
import { defineStore } from 'pinia';
import { getUserInfoApi, updateInfoApi } from '@/api/user';
import { previewOnlineFileApi } from '@/api/file';

/**
 * @description: 用户状态管理
 */
export const useUserStore = defineStore('useUserStore', {
  /**
   * @description: 用户状态
   */
  state: (): {
    /** 当前登录用户信息 */
    userInfo: IUserInfo;
  } => ({
    userInfo: {
      userId: '',
      nickName: '',
      avatar: '',
    }
  }),

  /**
   * @description: 状态计算属性
   */
  getters: {
  },

  actions: {
    /**
     * @description: 初始化用户信息
     * @return {Promise<void>}
     * @throws {Error} 获取用户信息失败时抛出错误
     */
    async initUserInfoApi() {
      try {
        const res = await getUserInfoApi();
        if (res.code === 0 && res.result) {
          const userInfo = {
            userId: res.result.userId,
            nickName: res.result.nickName,
            avatar: previewOnlineFileApi(res.result.avatar),
          };
          this.userInfo = userInfo;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      }
    },

    /**
     * @description: 更新自己的个人信息
     * @param {Partial<IUserInfo>} updates - 需要更新的用户信息字段
     * @return {Promise<boolean>} 更新是否成功
     */
    async updateUserInfo(updates: Partial<IUserInfo>) {
      try {
        const res = await updateInfoApi(updates);
        if (res.code === 0) {
          const updatedUser = {
            ...this.userInfo,
            ...updates,
          };
          this.userInfo = updatedUser;
          return true;
        }
        return false;
      } catch (error) {
        console.error('更新用户信息失败:', error);
        return false;
      }
    },

  

    /**
     * @description: 重置用户状态
     * @return {void}
     */
    reset() {
      this.userInfo = {
        userId: '',
        nickName: '',
        avatar: '',
      };
    },
  },
});
