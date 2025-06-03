import { getLocal } from "@/utils/local";
import { baseUrl } from '@/env.json'
import { useWsStore } from '@/pinia/ws/ws';
import type { IWsStore } from "@/types/ws/ws";
import { v4 as uuidv4 } from 'uuid';

/**
 * @description: WebSocket消息类型
 */
interface WsMessage {
  command: 'CHAT_MESSAGE' | 'COMMON_UPDATE_MESSAGE' | 'HEARTBEAT';
  content: {
    timestamp: number;
    messageId: string;
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
  private lastHeartbeatTime: number = 0; // 最后一次心跳时间
  private heartbeatTimeoutTimer: number | null = null; // 心跳超时定时器
  private isManualClose = false; // 是否手动关闭
  
  public isConnected = false;
  public isClose = false;
  public status: WsStatus = 'closed';

  constructor(config: WsConfig = {}) {
    this.reconnectInterval = config.reconnectInterval || 5000;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.heartbeatInterval = config.heartbeatInterval || 30000;

    this.initEventListeners();
    this.initAppStateListeners();
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
   * @description: 初始化应用状态监听
   */
  private initAppStateListeners(): void {
    // 监听网络状态变化
    uni.onNetworkStatusChange((res) => {
      console.log('网络状态变化:', res);
      if (res.isConnected && !this.isConnected && !this.isManualClose) {
        console.log('网络恢复，尝试重连');
        setTimeout(() => {
          this.initSocket();
        }, 1000);
      }
    });

    // 监听应用状态变化
    uni.onAppShow(() => {
      console.log('应用进入前台');
      if (!this.isConnected && !this.isManualClose) {
        setTimeout(() => {
          this.initSocket();
        }, 500);
      }
    });

    uni.onAppHide(() => {
      console.log('应用进入后台');
      this.clearHeartbeatTimeout();
    });
  }

  /**
   * @description: 初始化WebSocket连接
   * @return {Promise<void>}
   */
  public async initSocket(): Promise<void> {
    if (this.isConnected || this.status === 'connecting') {
      return;
    }

    const token = getLocal('token');
    if (!token) {
      console.error('未登录，无法连接 WebSocket');
      throw new Error('No token available');
    }

    this.status = 'connecting';
    this.isClose = false;
    this.isManualClose = false;

    return new Promise((resolve, reject) => {
      try {
        uni.connectSocket({
          url: `${baseUrl}/api/ws/ws?token=${token}`,
          method: 'GET',
          success: () => {
            console.log('WebSocket 连接请求成功');
            resolve();
          },
          fail: (error) => {
            console.error('WebSocket 连接请求失败:', error);
            this.status = 'error';
            reject(error);
          }
        });
      } catch (error) {
        console.error('WebSocket 连接异常:', error);
        this.status = 'error';
        reject(error);
      }
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
  private onClose(data: any): void {
    console.log('WebSocket 连接关闭', data);
    this.isConnected = false;
    this.status = 'closed';
    this.clearTimers();

    // 分析关闭原因
    if (data.code === 1006) {
      console.warn('WebSocket 异常关闭 (1006)，可能是网络问题或服务器问题');
    } else if (data.code === 1000) {
      console.log('WebSocket 正常关闭');
    } else if (data.code === 1001) {
      console.log('WebSocket 端点离线或服务器重启');
    }

    if (!this.isManualClose) {
      // 如果是 1006 错误，稍微延长重连间隔
      const delay = data.code === 1006 ? this.reconnectInterval * 2 : this.reconnectInterval;
      setTimeout(() => {
        this.reconnect();
      }, Math.min(delay, 30000)); // 最大延迟 30 秒
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
    
    if (!this.isManualClose) {
      setTimeout(() => {
        this.reconnect();
      }, this.reconnectInterval);
    }
  }

  /**
   * @description: 处理接收到的消息
   */
  private onMessage(event: any): void {
    try {
      const message: IWsStore = JSON.parse(event.data || '{}');
      
      // 如果是心跳响应，更新最后心跳时间
      if (message.command === 'HEARTBEAT') {
        this.lastHeartbeatTime = Date.now();
        this.clearHeartbeatTimeout();
        return;
      }

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
    const delay = Math.min(this.reconnectInterval * this.reconnectAttempts, 30000); // 指数退避，最大 30 秒
    console.log(`尝试第 ${this.reconnectAttempts} 次重连，将在 ${delay / 1000} 秒后重试`);

    this.clearTimers();
    this.reconnectTimer = setTimeout(() => {
      this.initSocket().catch(error => {
        console.error('重连失败:', error);
      });
    }, delay) as unknown as number;
  }

  /**
   * @description: 开始心跳检测
   */
  private startHeartbeat(): void {
    this.lastHeartbeatTime = Date.now();
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
      this.startHeartbeatTimeout();
    }, this.heartbeatInterval) as unknown as number;
  }

  /**
   * @description: 开始心跳超时检测
   */
  private startHeartbeatTimeout(): void {
    this.clearHeartbeatTimeout();
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('心跳超时，主动断开连接');
      this.disconnect();
      if (!this.isManualClose) {
        setTimeout(() => {
          this.initSocket();
        }, 1000);
      }
    }, this.heartbeatInterval + 10000) as unknown as number; // 心跳间隔 + 10 秒容错时间
  }

  /**
   * @description: 清除心跳超时定时器
   */
  private clearHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  /**
   * @description: 发送心跳包
   */
  private sendHeartbeat(): void {
    if (!this.isConnected) {
      return;
    }

    this._sendMessage({
      command: 'HEARTBEAT',
      content: {
        timestamp: Date.now(),
        messageId: uuidv4(),
        data: null
      }
    });
  }

  /**
   * @description: 发送聊天消息
   */
  public sendChatMessage(data: any, customMessageId?: string): void {
    this._sendMessage({
      command: 'CHAT_MESSAGE',
      content: {
        timestamp: Date.now(),
        messageId: customMessageId || uuidv4(),
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
    this.clearHeartbeatTimeout();
  }

  /**
   * @description: 主动断开连接
   */
  public disconnect(): void {
    this.isManualClose = true;
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

  /**
   * @description: 获取连接信息
   */
  public getConnectionInfo(): object {
    return {
      isConnected: this.isConnected,
      status: this.status,
      reconnectAttempts: this.reconnectAttempts,
      lastHeartbeatTime: this.lastHeartbeatTime,
      isManualClose: this.isManualClose
    };
  }
}

export default new WsManager({
  reconnectInterval: 5000,
  maxReconnectAttempts: 100,
  heartbeatInterval: 25000 // 调整为 25 秒，避免某些代理服务器的 30 秒超时
});
