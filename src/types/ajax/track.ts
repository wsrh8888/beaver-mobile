import type { ILog } from '@/types/utils/logger'

// 业务日志数据
export interface IBusinessLogData {
  /**
   * @description: 日志级别
   */
  level: "log" | "info" | "error" | "warn";
  /**
   * @description: 日志数据
   */
  data: string;
  /**
   * @description: 用户ID，可选
   */
  userId?: string;
  /**
   * @description: 时间戳，可选
   */
  timestamp?: number;
}

// 系统日志数据
export interface ILogData {
  /**
   * @description: 日志级别
   */
  level: "log" | "info" | "error" | "warn";
  /**
   * @description: 日志数据
   */
  data: string;
  /**
   * @description: 存储桶ID
   */
  bucketId: string;
  /**
   * @description: 时间戳，可选
   */
  timestamp?: number;
}

// 转换后的日志
export interface ITransformLog {
  /**
   * @description: 日志级别
   */
  level: "log" | "info" | "error" | "warn";
  /**
   * @description: 来源
   */
  source: string;
  /**
   * @description: 日志消息
   */
  message: ILog;
  /**
   * @description: 时间戳
   */
  timestamp: number;
  /**
   * @description: 用户ID，可选
   */
  userId?: string;
  /**
   * @description: 模块名称
   */
  module: string;
}

// 事件数据
export interface IEventData {
  /**
   * @description: 事件名称
   */
  eventName: string;
  /**
   * @description: 事件动作
   */
  action: string;
  /**
   * @description: 存储桶ID
   */
  bucketId: string;
  /**
   * @description: 平台，可选
   */
  platform?: string;
  /**
   * @description: 时间戳
   */
  timestamp: number;
  /**
   * @description: 设备ID，可选
   */
  deviceID?: string;
  /**
   * @description: 事件数据，可选
   */
  data?: string;
}

// 上报统计埋点事件请求
export interface IReportEventsReq {
  /**
   * @description: 事件列表，可选
   */
  events?: IEventData[];
  /**
   * @description: 用户ID，可选
   */
  userId?: string;
}

// 记录日志请求
export interface ILogEventsReq {
  /**
   * @description: 日志列表
   */
  logs: ILogData[];
}

// 上报统计埋点事件响应
export interface IReportEventsRes {
  /**
   * @description: 响应消息
   */
  message: string;
}

// 记录日志响应
export interface ILogEventsRes {
  /**
   * @description: 响应消息
   */
  message: string;
} 