import type { IUserInfo } from '@/types/store/userInfo';
import { defineStore } from 'pinia';
import { getUserInfoApi } from '@/api/user';

export const useUserStore = defineStore('useUserStore', {
  state: (): { userInfo: IUserInfo } => ({
    userInfo: {
      userId: '',
      phone: '',
      nickName: '',
      avatar:'',
    },
  }),
  getters: {
    gUserInfo: (state) => state.userInfo,
  },
  actions: {
    reset () {
      this.userInfo = {
        userId: '',
        phone: '',
        nickName: '',
        avatar: '',
      }
    },
    async initUserInfoApi() {
      try {
        const userInfo = await getUserInfoApi();
        this.userInfo = {
          userId: userInfo.result?.userId,
          phone: userInfo.result?.phone,
          nickName: userInfo.result?.nickName,
          avatar: userInfo.result?.avatar,
        };
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
    clearUserInfo() {
    },
  },
});
