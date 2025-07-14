import type { ILog } from '@/types/utils/logger'

// 业务日志数据 - 业务模块传入的数据
export interface IBusinessLogData {
  level: "log" | "info" | "error" | "warn"
  data: string
  userId?: string
  timestamp?: number
}

// 系统日志数据 - 包含source字段，用于上报
export interface ILogData {
  level: "log" | "info" | "error" | "warn"
  data: string
  bucketId: string
  timestamp?: number
}

export interface ITransformLog {
  level: "log" | "info" | "error" | "warn"
  source: string
  message: ILog
  timestamp: number
  userId?: string
  module: string
}

// 事件数据
export interface IEventData {
  eventName: string
  action: string
  bucketId: string
  platform?: string
  timestamp: number
  deviceID?: string
  data?: string
}

// 上报统计埋点事件请求
export interface IReportEventsReq {
  events?: IEventData[]
  userId?: string
}

// 记录日志请求
export interface ILogEventsReq {
  logs: ILogData[]
}

// 上报统计埋点事件响应
export interface IReportEventsRes {
  // 响应数据结构
}

// 记录日志响应
export interface ILogEventsRes {
  // 响应数据结构
} 