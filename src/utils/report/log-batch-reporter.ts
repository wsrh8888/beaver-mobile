import { loggerApi } from '@/api/track'
import type { ILogData, ILogEventsReq, ITransformLog } from '@/types/ajax/track'
import { BatchReporter, type IBatchReporterConfig } from './batch-reporter'
import { useUserStore } from '@/pinia/user/user'
import { loggerId } from '@/env.json'

class LogBatchReporter {
  private static instance: LogBatchReporter
  private batchReporter: BatchReporter<ILogData>

  private constructor(config?: IBatchReporterConfig) {
    this.batchReporter = new BatchReporter<ILogData>(
      async (logs: ILogData[]) => {
        await loggerApi({ logs })
      },
      config
    )
  }

  public static getInstance(config?: IBatchReporterConfig): LogBatchReporter {
    if (!LogBatchReporter.instance) {
      LogBatchReporter.instance = new LogBatchReporter(config)
    }
    return LogBatchReporter.instance
  }

  /**
   * 添加日志到批量队列
   */
  public addLog(logData: ITransformLog): void {
    this.batchReporter.addItem({
      level: logData.level,
      bucketId: loggerId,
      timestamp: Date.now(),
      data: JSON.stringify(logData),
    })
  }

  /**
   * 强制上报所有日志
   */
  public flush(): void {
    this.batchReporter.flush()
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<IBatchReporterConfig>): void {
    this.batchReporter.updateConfig(config)
  }

  /**
   * 获取当前配置
   */
  public getConfig(): Required<IBatchReporterConfig> {
    return this.batchReporter.getConfig()
  }

  /**
   * 获取当前队列中的日志数量
   */
  public getQueueSize(): number {
    return this.batchReporter.getQueueSize()
  }
}

export const logBatchReporter = LogBatchReporter.getInstance()
export default LogBatchReporter 