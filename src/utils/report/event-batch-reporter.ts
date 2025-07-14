import { reportEventsApi } from '@/api/track'
import type { IEventData } from '@/types/ajax/track'
import { BatchReporter, type IBatchReporterConfig } from './batch-reporter'
import { useUserStore } from '@/pinia/user/user'

class EventBatchReporter {
  private static instance: EventBatchReporter
  private batchReporter: BatchReporter<IEventData>

  private constructor(config?: IBatchReporterConfig) {
    this.batchReporter = new BatchReporter<IEventData>(
      async ( events: IEventData[]) => {
        const userStore = useUserStore()
        await reportEventsApi({userId: userStore?.userInfo?.userId, events })
      },
      config
    )
  }

  public static getInstance(config?: IBatchReporterConfig): EventBatchReporter {
    if (!EventBatchReporter.instance) {
      EventBatchReporter.instance = new EventBatchReporter(config)
    }
    return EventBatchReporter.instance
  }

  /**
   * 添加事件到批量队列
   */
  public addEvent(eventData: IEventData): void {
    this.batchReporter.addItem(eventData)
  }

  /**
   * 强制上报所有事件
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
   * 获取当前队列中的事件数量
   */
  public getQueueSize(): number {
    return this.batchReporter.getQueueSize()
  }
}

export const eventBatchReporter = EventBatchReporter.getInstance()
export default EventBatchReporter 