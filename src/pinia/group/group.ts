import { defineStore } from 'pinia';
import {
  getGroupListApi,
  getGroupMembersApi,
  getGroupFileListApi,
  getGroupMuteListApi,
  getGroupInfoApi
} from '@/api/group';
import type {
  IGroupInfo,
  IGroupMember,
  IGroupFileInfo,
  IGroupMemberListRes,
  IGroupFileListRes,
  IGroupMuteListRes
} from '@/types/ajax/group';
import { useFriendStore } from '../friend/friend';

interface IMemberCache {
  memberList: IGroupMember[];
  lastUpdateTime: number;
}

export const useGroupStore = defineStore('useGroupStore', {
  state: (): {
    groupList: IGroupInfo[],
    groupMap: Map<string, IGroupInfo>,
    _memberMap: Map<string, IMemberCache>,
  } => ({
    /**
     * @description: 群组列表
     */
    groupList: [],
    /**
     * @description: 群组列表Map形式
     */
    groupMap: new Map(),
    /**
     * @description: 群成员Map，key为群组ID
     */
    _memberMap:  new Map(),
  }),
  getters: {
    /**
     * @description: 根据群组ID获取群组信息
     * @param {string} groupId - 群组ID
     * @returns {IGroupInfo | undefined} 群组信息
     */
    getGroupById: (state) => (groupId: string): IGroupInfo | undefined => {
      return state.groupMap.get(groupId);
    },
    /**
     * @description: 根据群组ID获取群成员列表
     * @param {string} groupId - 群组ID
     * @returns {IGroupMember[]} 群成员列表
     */
    getMembersByGroupId: (state) => (groupId: string): IGroupMember[] => {
      const cache = state._memberMap.get(groupId);
      if (!cache) return [];
      // 从用户map中更新基础信息
      const friendStore = useFriendStore()
      return cache.memberList.map(mumber =>{
        const updateUserInfo = friendStore.allUserMapInfo.get(mumber.userId)
        let userInfo = {}
        if (updateUserInfo) {
          userInfo = {
            avatar: updateUserInfo.avatar,
            nicknam: updateUserInfo.nickname
          }
        }

        return {
          ...mumber,
          ...userInfo
        }

      });
    },
  },
  actions: {
    reset() {
      this.groupList = [];
      this.groupMap = new Map();
      this._memberMap = new Map();
    },
    /**
     * @description: 获取群组列表
     */
    async initGroupListApi() {
      const getGroupApi = await getGroupListApi({
        page: 1,
        limit: 100
      });
      if (getGroupApi.code === 0) {
        this.groupList = getGroupApi.result.list;
        this.convertGroupListToMap();
      }
    },

    updateGroupInfo(groupId: string) {
      getGroupInfoApi({ groupId }).then(res => {
        if (res.code === 0) {
          const groupInfo = res.result;
          this.groupMap.set(groupId, {
            ...this.groupMap.get(groupId),
            ...groupInfo
          } as any);
        }
      });
    },
    /**
     * @description: 将groupList转换为Map形式
     */
    convertGroupListToMap() {
      const groupMap = new Map();
      this.groupList?.forEach((group: IGroupInfo) => {
        groupMap.set(group.conversationId, group);
      });
      this.groupMap = groupMap;
    },

    /**
     * @description: 获取群成员列表
     * @param {string} groupId - 群组ID
     * @param {boolean} forceUpdate - 是否强制更新
     * @param {number} page - 页码，可选
     * @param {number} limit - 每页数量，可选
     */
    async getGroupMembersApi(groupId: string, forceUpdate = false, page?: number, limit?: number) {
      const cache = this._memberMap.get(groupId);
      const now = Date.now();

      if (cache && !forceUpdate && (now - cache.lastUpdateTime < 5 * 60 * 1000)) {
        return { code: 0, result: { list: this.getMembersByGroupId(groupId) } };
      }

      const res = await getGroupMembersApi({ groupId, page, limit });
      if (res.code === 0) {
        this._memberMap.set(groupId, {
          memberList: res.result.list,
          lastUpdateTime: now
        });
      }
      return res;
    },

    /**
     * @description: 添加群成员
     * @param {string} groupId - 群组ID
     * @param {IGroupMember[]} members - 要添加的成员列表
     */
    addMembers(groupId: string, members: IGroupMember[]) {
      const cache = this._memberMap.get(groupId);
      if (cache) {
        cache.memberList = [...cache.memberList, ...members];
        this._memberMap.set(groupId, cache);
      }
    },

    /**
     * @description: 移除群成员
     * @param {string} groupId - 群组ID
     * @param {string[]} memberIds - 要移除的成员ID列表
     */
    removeMembers(groupId: string, memberIds: string[]) {
      const cache = this._memberMap.get(groupId);
      if (cache) {
        cache.memberList = cache.memberList.filter(member => !memberIds.includes(member.userId));
        this._memberMap.set(groupId, cache);
      }
    },
  },
});

