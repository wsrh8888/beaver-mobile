import { defineStore } from 'pinia';
import { getLocal } from '@/utils/local';
import WsManager from '@/ws-manager/ws'
import { useFriendStore } from '../friend/friend';
import { useChatStore } from '../chat/chat';
import { useUserStore } from '../user/user';
import { getAuthenticationApi } from '@/api/auth';
import { useCommonStore } from '../common/common';

export const useInitStore = defineStore('useInitStore', {
  state: () => ({
    
  }),
  getters: {
  },
  actions: {
    getAuthentication() {
      getAuthenticationApi()
      .then(res => {
        if (res.code === 1) {
          
          const commonStore = useCommonStore()
          commonStore.resetApp()
          uni.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    },
    async initApp() {
      const friendStore = useFriendStore();
      const chatStore = useChatStore();
      const userStore = useUserStore();
      this.getAuthentication()
      // 开始初始化整个项目
      if (!getLocal('token')) {
        return
      }
      // 连接ws
      WsManager.initSocket()

      await userStore.initUserInfoApi()

      // 初始化好友列表
      await friendStore.initFriendApi()

      // 初始化最近聊天列表
      await chatStore.initRecentChatApi()

      // 增加鉴权轮询
      setInterval(() => {
        this.getAuthentication()
      }, 10000)
      
    }
  },
});
