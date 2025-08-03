import type { IWsMessage } from '@/types/ws/command';
import { WsType } from '@/types/ws/command';
import { useFriendStore } from '@/pinia/friend/friend';

/**
 * @description: 用户信息接收器
 */
export class UserReceiver {
  /**
   * @description: 获取好友 store
   */
  private get friendStore() {
    return useFriendStore();
  }

  /**
   * @description: 处理用户信息更新
   * @param {IWsMessage} wsMessage - WebSocket 消息
   */
  handleUserProfile(wsMessage: IWsMessage) {
    const { data } = wsMessage.content;
    
    switch (data.type) {
      case WsType.PROFILE_CHANGE_NOTIFY:
        this.handleProfileChange(data.body);
        break;
      default:
        console.warn('未处理的用户信息类型:', data.type);
    }
  }

  /**
   * @description: 处理资料变更
   * @param {any} profileData - 资料数据
   */
  private handleProfileChange(profileData: any) {
    console.log('处理资料变更:', profileData);
    this.friendStore.updateFriendInfo(profileData.userId);
  }
} 