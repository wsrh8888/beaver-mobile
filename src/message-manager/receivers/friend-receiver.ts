import type { IWsMessage } from '@/types/ws/command';
import { WsType } from '@/types/ws/command';
import { useFriendStore } from '@/pinia/friend/friend';

/**
 * @description: 好友操作接收器
 */
export class FriendReceiver {
  /**
   * @description: 获取好友 store
   */
  private get friendStore() {
    return useFriendStore();
  }

  /**
   * @description: 处理好友操作
   * @param {IWsMessage} wsMessage - WebSocket 消息
   */
  handleFriendOperation(wsMessage: IWsMessage) {
    const { data } = wsMessage.content;
    
    switch (data.type) {
      case WsType.FRIEND_REQUEST_RECEIVE:
        this.handleFriendRequest(data.body);
        break;
      case WsType.FRIEND_ADD_SUCCESS:
        this.handleFriendAddSuccess(data.body);
        break;
      case WsType.FRIEND_DELETE:
        this.handleFriendDelete(data.body);
        break;
      default:
        console.warn('未处理的好友操作类型:', data.type);
    }
  }

  /**
   * @description: 处理好友请求
   * @param {any} requestData - 请求数据
   */
  private handleFriendRequest(requestData: any) {
    console.log('处理好友请求:', requestData);
    this.friendStore.updateFriendInfo(requestData.userId);
  }

  /**
   * @description: 处理好友添加成功
   * @param {any} successData - 成功数据
   */
  private handleFriendAddSuccess(successData: any) {
    console.log('处理好友添加成功:', successData);
    this.friendStore.initFriendApi();
  }

  /**
   * @description: 处理好友删除
   * @param {any} deleteData - 删除数据
   */
  private handleFriendDelete(deleteData: any) {
    console.log('处理好友删除:', deleteData);
    this.friendStore.initFriendApi();
  }
} 