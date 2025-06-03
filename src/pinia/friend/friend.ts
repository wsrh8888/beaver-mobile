import { defineStore } from 'pinia';
import { getFriendInfoApi, getFriendListApi } from '@/api/friend';
import type { IFriendInfo } from '@/types/ajax/friend';
import { processAvatarUrl, processArrayAvatars } from '@/utils/avatar';

/**
 * @description: 好友信息管理
 */
export const useFriendStore = defineStore('friendStore', {
  state: (): {
    friendList: IFriendInfo[],
    allUserMapInfo: Map<string, IFriendInfo>,
  } => ({
    /**
     * @description: 好友列表
     */
    friendList: [],
    /**
     * @description: 用户信息映射（包含好友和非好友）
     */
    allUserMapInfo: new Map<string, IFriendInfo>(),
  }),
  
  getters: {
    /**
     * @description: 根据ID获取好友信息
     * @param {string} id - 会话id
     * @returns {IFriendInfo} 返回好友信息
     */
    getFriendInfoById: (state) => {
      return (id: string): IFriendInfo | undefined => {
        const friendInfo = state.allUserMapInfo.get(id);
        if (friendInfo) {
          return {
            ...friendInfo,
            avatar: processAvatarUrl(friendInfo.avatar)
          };
        }
        return undefined;
      };
    },
  },
  
  actions: {
    reset() {
      this.friendList = [];
      this.allUserMapInfo.clear();
    },
    
    async updateFriendInfo(friendId: string) {
      try {
        const res = await getFriendInfoApi({ friendId });
        if (res.code === 0) {
          const tempFriendInfo = {
            ...res.result,
            avatar: processAvatarUrl(res.result.avatar)
          };
          
          const index = this.friendList.findIndex(
            item => item.userId === friendId
          );
          
          if (index !== -1) {
            this.friendList[index] = tempFriendInfo;
          } else {
            this.friendList.push(tempFriendInfo);
          }
          
          // 更新用户信息映射
          this.allUserMapInfo.set(friendId, tempFriendInfo);
          return tempFriendInfo;
        }
      } catch (error) {
        console.error('Failed to update friend info:', error);
        throw error;
      }
    },

    async initFriendApi() {
      try {
        const res = await getFriendListApi({
          page: 1,
          limit: 1000,
        });
        if (res.code === 0) {
          // 处理头像路径
          this.friendList = processArrayAvatars(res.result.list || []);
          
          // 初始化用户信息映射
          this.friendList.forEach(friend => {
            this.allUserMapInfo.set(friend.userId, friend);
          });
        }
      } catch (error) {
        console.error('Failed to initialize friend list:', error);
        throw error;
      }
    },
  },
});
