import { logBatchReporter } from '@/utils/report/log-batch-reporter'
import type { ITransformLog } from '@/types/ajax/track'
import type { ILog } from '@/types/utils/logger'



class Logger {
  private module: string

  constructor(module: string) {
    this.module = module
  }
  /**
   * 记录信息日志
   */
  public info(data: ILog): void {
    this._log('info', data)
  }

  /**
   * 记录警告日志
   */
  public warn(data: ILog): void {
    this._log('warn', data)
  }

  /**
   * 记录错误日志
   */
  public error(data: ILog): void {
    this._log('error', data)
  }
  private transformLog(level: "log" | "info" | "error" | "warn", message: ILog): ITransformLog {
    return {
      level,
      module: this.module,
      source: 'beaver-mobile',
      message: message, // 业务数据序列化为字符串
      timestamp: Date.now(),
    }
  }
  /**
   * 内部日志记录方法
   */
  private _log(type: "log" | "info" | "error" | "warn", message: ILog): void {
    try {
      console[type](this.module, message)
    } catch (error) {
      console.error('日志数据异常', error)
    }
    // 使用批量上报器
    logBatchReporter.addLog(this.transformLog(type, message))
  }
}

export default Logger
