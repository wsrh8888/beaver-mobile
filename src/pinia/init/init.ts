import { defineStore } from 'pinia';
import { getLocal } from '@/utils/local';
import WsManager from '@/ws-manager/ws'
import { useFriendStore } from '../friend/friend';
import { useConversationStore } from '../conversation/conversation';
import { useMessageStore } from '../message/message';
import { useUserStore } from '../user/user';
import { useGroupStore } from '../group/group';
import { getAuthenticationApi } from '@/api/auth';

/**
 * @description: 应用初始化和生命周期管理
 */
export const useInitStore = defineStore('useInitStore', {
  state: () => ({
    /**
     * @description: 是否正在初始化
     */
    isInitializing: false,
    
    /**
     * @description: 是否已完成初始化
     */
    isInitialized: false,
    
    /**
     * @description: 初始化错误信息
     */
    initError: null as Error | null,
    
    /**
     * @description: 认证轮询定时器ID
     */
    authTimer: null as number | null,
    
    /**
     * @description: 最后认证时间
     */
    lastAuthTime: 0,
  }),

  getters: {
    /**
     * @description: 获取初始化状态
     * @return {Object} 初始化状态对象
     */
    initStatus: (state) => ({
      isInitializing: state.isInitializing,
      isInitialized: state.isInitialized,
      hasError: !!state.initError,
      error: state.initError,
    }),
  },

  actions: {
    /**
     * @description: 获取认证状态
     * @return {Promise<void>}
     */
    async getAuthentication() {
      try {
        const res = await getAuthenticationApi();
        this.lastAuthTime = Date.now();
        
        if (res.code === 1) {
          this.resetApp();
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        this.initError = error instanceof Error ? error : new Error('Authentication failed');
        throw error;
      }
    },

    /**
     * @description: 重置所有 store 状态
     * @return {void}
     */
    resetApp() {
      const stores = {
        user: useUserStore(),
        friend: useFriendStore(),
        conversation: useConversationStore(),
        chat: useMessageStore(),
        group: useGroupStore(),
      };

      // 重置所有 store
      Object.values(stores).forEach(store => store.$reset());
      
      // 重置初始化状态
      this.reset();
      
      // 关闭 WebSocket 连接
      WsManager.disconnect();
    },

    /**
     * @description: 启动认证轮询
     * @return {void}
     */
    startAuthPolling() {
      // 清除已存在的定时器
      if (this.authTimer) {
        clearInterval(this.authTimer);
      }
      
      // 设置新的定时器，每10秒进行一次认证
      this.authTimer = setInterval(() => {
        this.getAuthentication();
      }, 10000) as unknown as number;
    },

    /**
     * @description: 停止认证轮询
     * @return {void}
     */
    stopAuthPolling() {
      if (this.authTimer) {
        clearInterval(this.authTimer);
        this.authTimer = null;
      }
    },

    /**
     * @description: 初始化应用
     * @return {Promise<void>}
     * @throws {Error} 当初始化失败时抛出错误
     */
    async initApp() {
      // 防止重复初始化
      if (this.isInitializing || this.isInitialized) {
        return;
      }

      this.isInitializing = true;
      this.initError = null;

      try {
        // 检查登录状态
        if (!getLocal('token')) {
          throw new Error('No token found');
        }

        // 初始化认证
        await this.getAuthentication();

        // 初始化 WebSocket 连接
        await WsManager.initSocket();

        // 获取所有需要初始化的 store
        const stores = {
          user: useUserStore(),
          friend: useFriendStore(),
          conversation: useConversationStore(),
          chat: useMessageStore(),
          group: useGroupStore(),
        };

        // 并行初始化用户信息和好友列表
        // 这两个初始化优先级最高，其他功能依赖于这些基础信息
        await Promise.all([
          stores.user.initUserInfoApi(),
          stores.friend.initFriendApi(),
        ]);

        // 并行初始化会话、群组和动态信息
        // 这些功能相对独立，可以并行加载
        await Promise.all([
          stores.conversation.initRecentChatApi(),
          stores.group.initGroupListApi(),
        ]);

        // 启动认证轮询
        this.startAuthPolling();

        // 标记初始化完成
        this.isInitialized = true;
      } catch (error) {
        this.initError = error instanceof Error ? error : new Error('Init failed');
        console.error('App initialization failed:', error);
        throw error;
      } finally {
        // 无论成功失败，都将初始化状态设为false
        this.isInitializing = false;
      }
    },

    /**
     * @description: 重置初始化状态
     * @return {void}
     */
    reset() {
      this.stopAuthPolling();
      this.isInitialized = false;
      this.isInitializing = false;
      this.initError = null;
      this.lastAuthTime = 0;
    },

    /**
     * @description: 重新初始化应用
     * @return {Promise<void>}
     */
    async reinitialize() {
      this.resetApp();
      await this.initApp();
    },

    /**
     * @description: 应用关闭时的清理工作
     * @return {Promise<void>}
     */
    async cleanup() {
      this.stopAuthPolling();
      this.resetApp();
    }
  },
});
