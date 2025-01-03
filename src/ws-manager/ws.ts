import { getLocal } from "@/utils/local";
import { baseUrl } from '@/env.json'
import { useWsStore } from '@/pinia/ws/ws';

class WsManager {
  reconnectInterval = 5000; // 重连间隔时间
  reconnectTimer = null; // 用于保存重连的定时器Id
  isConnected = false;
  isClose = false;
  messageCallback: (message: any) => void = () => { };
  wsStore: any;

  constructor() { 
    uni.onSocketOpen(this.onOpen.bind(this));
    uni.onSocketClose(this.onClose.bind(this));
    uni.onSocketError(this.onError.bind(this));
    uni.onSocketMessage(this.onMessage.bind(this));
  }

  initSocket() {
    if (this.isConnected) {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      return;
    }
    if (!getLocal('token')) {
      console.log('未登录，无法连接 ws');
      return;
    }
    this.isClose = true
    uni.connectSocket({
      url: `${baseUrl}/api/ws/ws?token=` + getLocal('token'),
      method: 'GET',
    });
  }

  onOpen() {
    console.log('ws 已连接');
    this.isConnected = true;

    // 链接成功后销毁重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  onClose() {
    
    console.log('ws 已关闭');
    uni.closeSocket(); // 先关闭之前的连接
    
    this.isConnected = false;
    if (this.isClose) {
      return;
    }
    this.reconnect();
  }

  onError(data) {
    console.log('ws 连接错误');
    this.isConnected = false;
    console.log(data);
    uni.closeSocket(); // 先关闭之前的连接

    this.reconnect();
  }

  onMessage(event: any) {
    console.log('收到消息', event);
    // 解析消息
   const wsStore = useWsStore();

    const message = JSON.parse(event.data || '{}');
    console.log('收到消11111111息', message);
    wsStore.parseWsMessage(message);
    if (this.messageCallback) {
      this.messageCallback(event);
    }
  }

  setMessageCallback(callback: (message: any) => void) {
    this.messageCallback = callback;
  }

  reconnect() {
    uni.closeSocket(); // 先关闭之前的连接
    if (!this.isConnected) {
      console.log(`尝试在 ${this.reconnectInterval / 1000} 秒后重新连接`);
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null; // 重置定时器Id
        this.initSocket();
      }, this.reconnectInterval);
    }
  }

  sendChatMessage(data: any) {
    this._sendMessage({
      command: 'COMMON_CHAT_MESSAGE',
      content: {
        timestamp: 1234,
        data: data,
      },
    });
  }

  _sendMessage(message: {}) {
    if (this.isConnected) {
      uni.sendSocketMessage({
        data: JSON.stringify(message),
        success() {
          console.log('消息发送成功', message);
        },
      });
    } else {
      console.log('ws 未连接，无法发送消息');
    }
  }

  close() {
    this.isClose = true;
    if (this.isConnected) {
      uni.closeSocket({
        success() {
          console.log('ws 已主动关闭');
        },
      });
    }
  }
}

export default new WsManager();
