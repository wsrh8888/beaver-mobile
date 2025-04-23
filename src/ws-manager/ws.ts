import { getLocal } from "@/utils/local";
import { baseUrl } from '@/env.json'
import { useWsStore } from '@/pinia/ws/ws';
import type { IWsStore } from "@/types/ws/ws";

/**
 * @description: WebSocket消息类型
 */
interface WsMessage {
  command: 'CHAT_MESSAGE' | 'COMMON_UPDATE_MESSAGE' | 'HEARTBEAT';
  content: {
    timestamp: number;
    data: any;
  };
}

/**
 * @description: WebSocket配置选项
 */
interface WsConfig {
  reconnectInterval?: number; // 重连间隔时间
  maxReconnectAttempts?: number; // 最大重连次数
  heartbeatInterval?: number; // 心跳间隔
}

/**
 * @description: WebSocket状态
 */
type WsStatus = 'connecting' | 'connected' | 'closed' | 'error';

class WsManager {
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private heartbeatInterval: number;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private reconnectAttempts = 0;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  
  public isConnected = false;
  public isClose = false;
  public status: WsStatus = 'closed';

  constructor(config: WsConfig = {}) {
    this.reconnectInterval = config.reconnectInterval || 5000;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.heartbeatInterval = config.heartbeatInterval || 30000;

    this.initEventListeners();
  }

  /**
   * @description: 初始化WebSocket事件监听
   */
  private initEventListeners(): void {
    uni.onSocketOpen(this.onOpen.bind(this));
    uni.onSocketClose(this.onClose.bind(this));
    uni.onSocketError(this.onError.bind(this));
    uni.onSocketMessage(this.onMessage.bind(this));
  }

  /**
   * @description: 初始化WebSocket连接
   * @return {Promise<void>}
   */
  public async initSocket(): Promise<void> {
    if (this.isConnected) {
      this.clearTimers();
      return;
    }

    const token = getLocal('token');
    if (!token) {
      console.error('未登录，无法连接 WebSocket');
      throw new Error('No token available');
    }

    this.status = 'connecting';
    this.isClose = false;

    return new Promise((resolve, reject) => {
      uni.connectSocket({
        url: `${baseUrl}/api/ws/ws?token=${token}`,
        method: 'GET',
        success: () => resolve(),
        fail: (error) => reject(error)
      });
    });
  }

  /**
   * @description: WebSocket连接成功回调
   */
  private onOpen(): void {
    console.log('WebSocket 连接成功');
    this.isConnected = true;
    this.status = 'connected';
    this.reconnectAttempts = 0;
    this.clearTimers();
    this.startHeartbeat();
  }

  /**
   * @description: WebSocket连接关闭回调
   */
  private onClose(): void {
    console.log('WebSocket 连接关闭');
    this.isConnected = false;
    this.status = 'closed';
    this.clearTimers();

    if (!this.isClose) {
      this.reconnect();
    }
  }

  /**
   * @description: WebSocket连接错误回调
   */
  private onError(error: any): void {
    console.error('WebSocket 连接错误:', error);
    this.isConnected = false;
    this.status = 'error';
    this.clearTimers();
    
    if (!this.isClose) {
      this.reconnect();
    }
  }

  /**
   * @description: 处理接收到的消息
   */
  private onMessage(event: any): void {
    try {
      const message: IWsStore = JSON.parse(event.data || '{}');
      const wsStore = useWsStore();
      wsStore.parseWsMessage(message);

      // 调用对应的消息处理器
      const handler = this.messageHandlers.get(message.command);
      if (handler) {
        handler(message.content);
      }
    } catch (error) {
      console.error('消息解析错误:', error);
    }
  }

  /**
   * @description: 注册消息处理器
   */
  public on(command: string, handler: (data: any) => void): void {
    this.messageHandlers.set(command, handler);
  }

  /**
   * @description: 移除消息处理器
   */
  public off(command: string): void {
    this.messageHandlers.delete(command);
  }

  /**
   * @description: 重连机制
   */
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连');
      this.isClose = true;
      return;
    }

    this.reconnectAttempts++;
    console.log(`尝试第 ${this.reconnectAttempts} 次重连，将在 ${this.reconnectInterval / 1000} 秒后重试`);

    this.clearTimers();
    this.reconnectTimer = setTimeout(() => {
      this.initSocket().catch(error => {
        console.error('重连失败:', error);
      });
    }, this.reconnectInterval) as unknown as number;
  }

  /**
   * @description: 开始心跳检测
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval) as unknown as number;
  }

  /**
   * @description: 发送心跳包
   */
  private sendHeartbeat(): void {
    this._sendMessage({
      command: 'HEARTBEAT',
      content: {
        timestamp: Date.now(),
        data: null
      }
    });
  }

  /**
   * @description: 发送聊天消息
   */
  public sendChatMessage(data: any): void {
    this._sendMessage({
      command: 'CHAT_MESSAGE',
      content: {
        timestamp: Date.now(),
        data: data,
      },
    });
  }

  /**
   * @description: 发送消息的底层方法
   */
  private _sendMessage(message: WsMessage): void {
    if (!this.isConnected) {
      console.error('WebSocket 未连接，无法发送消息');
      return;
    }

    uni.sendSocketMessage({
      data: JSON.stringify(message),
      success: () => {
        // console.log('消息发送成功', message);
      },
      fail: (error) => {
        console.error('消息发送失败:', error);
      }
    });
  }

  /**
   * @description: 清理定时器
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * @description: 主动断开连接
   */
  public disconnect(): void {
    this.isClose = true;
    this.clearTimers();
    
    if (this.isConnected) {
      uni.closeSocket({
        success: () => {
          console.log('WebSocket 已主动断开');
          this.isConnected = false;
          this.status = 'closed';
        },
        fail: (error) => {
          console.error('WebSocket 断开失败:', error);
        }
      });
    }
  }

  /**
   * @description: 获取当前连接状态
   */
  public getStatus(): WsStatus {
    return this.status;
  }
}

export default new WsManager({
  reconnectInterval: 5000,
  maxReconnectAttempts: 100,
  heartbeatInterval: 30000
});
