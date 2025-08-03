import { getLocal } from "@/utils/local";
import { ws } from '@/env.json'
import type { IWsMessage } from '@/types/ws/command';
import Logger from '@/logger/logger';

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

/**
 * @description: WebSocket事件回调
 */
interface WsEventCallbacks {
  onMessage?: (message: IWsMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

/**
 * @description: WebSocket连接管理器 - 纯连接层，不处理业务逻辑
 */
class WsManager {
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private heartbeatInterval: number;
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private reconnectAttempts = 0;
  private lastHeartbeatTime: number = 0; // 最后一次心跳时间
  private heartbeatTimeoutTimer: number | null = null; // 心跳超时定时器
  private isManualClose = false; // 是否手动关闭
  private eventCallbacks: WsEventCallbacks = {};
  
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
   * @description: 设置事件回调
   */
  public setEventCallbacks(callbacks: WsEventCallbacks) {
    this.eventCallbacks = { ...this.eventCallbacks, ...callbacks };
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
          url: `${ws}?token=${token}`,
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
        const logger = new Logger('WebSocket管理');
        logger.error({
          text: 'WebSocket连接异常',
          data: {
            error: error instanceof Error ? error.message : String(error)
          }
        });
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
    
    // 触发连接成功回调
    if (this.eventCallbacks.onConnect) {
      this.eventCallbacks.onConnect();
    }
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

    // 触发断开连接回调
    if (this.eventCallbacks.onDisconnect) {
      this.eventCallbacks.onDisconnect();
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
    
    // 触发错误回调
    if (this.eventCallbacks.onError) {
      this.eventCallbacks.onError(error);
    }
    
    if (!this.isManualClose) {
      setTimeout(() => {
        this.reconnect();
      }, this.reconnectInterval);
    }
  }

  /**
   * @description: 处理接收到的消息 - 只负责转发给消息处理器
   */
  private onMessage(event: any): void {
    try {
      const data = JSON.parse(event.data);
      console.log('收到WebSocket消息:', data);
      
      // 转发给消息处理器
      if (this.eventCallbacks.onMessage) {
        this.eventCallbacks.onMessage(data);
      }
    } catch (error) {
      console.error('解析WebSocket消息失败:', error);
    }
  }

  /**
   * @description: 重连机制
   */
  private reconnect(): void {
    if (this.isManualClose || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('达到最大重连次数或手动关闭，停止重连');
      return;
    }

    this.reconnectAttempts++;
    console.log(`第 ${this.reconnectAttempts} 次重连尝试`);

    this.reconnectTimer = setTimeout(() => {
      this.initSocket().catch((error) => {
        console.error('重连失败:', error);
      });
    }, this.reconnectInterval) as any;
  }

  /**
   * @description: 开始心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval) as any;
  }

  /**
   * @description: 发送心跳
   */
  private sendHeartbeat(): void {
    if (!this.isConnected) return;

    const heartbeatMessage: IWsMessage = {
      command: 'HEARTBEAT' as any,
      content: {
        timestamp: Date.now(),
        data: {
          type: 'heartbeat' as any,
          body: {}
        }
      }
    };

    this._sendMessage(heartbeatMessage);
    this.lastHeartbeatTime = Date.now();
    this.startHeartbeatTimeout();
  }

  /**
   * @description: 开始心跳超时检测
   */
  private startHeartbeatTimeout(): void {
    this.clearHeartbeatTimeout();
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('心跳超时，关闭连接');
      this.disconnect();
    }, this.heartbeatInterval * 2) as any;
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
   * @description: 发送消息 - 纯数据发送，不处理业务逻辑
   */
  public sendMessage(message: IWsMessage): void {
    if (!this.isConnected) {
      console.error('WebSocket未连接，无法发送消息');
      throw new Error('WebSocket not connected');
    }

    this._sendMessage(message);
  }

  /**
   * @description: 内部发送消息方法
   */
  private _sendMessage(message: IWsMessage): void {
    try {
      const messageStr = JSON.stringify(message);
      uni.sendSocketMessage({
        data: messageStr,
        success: () => {
          console.log('消息发送成功:', message);
        },
        fail: (error) => {
          console.error('消息发送失败:', error);
          throw error;
        }
      });
    } catch (error) {
      console.error('发送消息异常:', error);
      throw error;
    }
  }

  /**
   * @description: 清除所有定时器
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
   * @description: 断开连接
   */
  public disconnect(): void {
    console.log('手动断开WebSocket连接');
    this.isManualClose = true;
    this.clearTimers();
    
    if (this.isConnected) {
      uni.closeSocket({
        success: () => {
          console.log('WebSocket连接已关闭');
        },
        fail: (error) => {
          console.error('关闭WebSocket连接失败:', error);
        }
      });
    }
  }

  /**
   * @description: 获取连接状态
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
      lastHeartbeatTime: this.lastHeartbeatTime
    };
  }
}

// 导出单例
const wsManager = new WsManager();
export default wsManager;
