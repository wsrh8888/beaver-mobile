import { defineStore } from 'pinia';
import { getFriendInfoApi, getFriendListApi } from '@/api/friend';
import type { IFriendInfo } from '@/types/ajax/friend';

export const useFriendStore = defineStore('friendList', {
  state: (): { friendList: IFriendInfo[] } => ({
    /**
     * @description: 最新聊天列表
     */
    friendList: []
  }),
  getters: {
    /**
     * @description: 根据ID获取好友信息
     * @param {string} id - 会话id
     * @returns {IFriendInfo} 返回好友信息
     */
    getFriendInfoById: (state) => {
      return (id: string): IFriendInfo => {
        return state.friendList.find(friend => friend.conversationId === id) || {} as IFriendInfo;
      };
    },
  },
  actions: {
    reset() {
      this.friendList = [];
    },
    async updateFriendInfo(friendId: string) {
      const friendInfo =  await getFriendInfoApi({
        friendId: friendId,
      })
      if (friendInfo.code === 0) {
        var tempFriendInfo = friendInfo.result;
        const index = this.friendList?.findIndex(item => item.userId === friendId) || -1;
        if (index !== -1) {
          this.friendList[index] = tempFriendInfo;
        } else {
          this.friendList.push(tempFriendInfo);
        }
        return tempFriendInfo;
      }
       
    },
    async initFriendApi() {
      const getFriendApi = await getFriendListApi({
        page: 1,
        limit: 1000,
      });
      if (getFriendApi.code === 0) {
        this.friendList = getFriendApi.result.list || [];
      }
    },
    
  },
});
