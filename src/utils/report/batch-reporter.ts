interface IBatchReporterConfig {
  maxBatchSize?: number      // 最大批量大小，默认10条
  maxWaitTime?: number       // 最大等待时间(毫秒)，默认5000ms
}

interface IBatchReporter<T> {
  addItem(item: T): void
  flush(): void
  updateConfig(config: Partial<IBatchReporterConfig>): void
  getConfig(): Required<IBatchReporterConfig>
  getQueueSize(): number
}

class BatchReporter<T> implements IBatchReporter<T> {
  private items: T[] = []
  private timer: number | null = null
  private config: Required<IBatchReporterConfig>
  private reportCallback: (items: T[]) => Promise<void>

  constructor(
    reportCallback: (items: T[]) => Promise<void>,
    config: IBatchReporterConfig = {}
  ) {
    this.reportCallback = reportCallback
    this.config = {
      maxBatchSize: config.maxBatchSize || 10,
      maxWaitTime: config.maxWaitTime || 5000
    }
  }

  /**
   * 添加数据到批量队列
   */
  public addItem(item: T): void {
    this.items.push(item)
    this.checkAndReport()
  }

  /**
   * 检查并上报数据
   */
  private checkAndReport(): void {
    // 如果达到批量大小，立即上报
    if (this.items.length >= this.config.maxBatchSize) {
      this.report()
      return
    }

    // 如果还没有定时器，设置定时器
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.report()
      }, this.config.maxWaitTime) as any
    }
  }

  /**
   * 上报数据到服务器
   */
  private async report(): Promise<void> {
    if (this.items.length === 0) {
      return
    }

    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    // 获取当前批次
    const batchItems = [...this.items]
    this.items = []

    try {
      await this.reportCallback(batchItems)
    } catch (error) {
      console.error('批量上报失败:', error)
      // 上报失败时，将数据重新放回队列
      this.items.unshift(...batchItems)
    }
  }

  /**
   * 强制上报所有数据
   */
  public flush(): void {
    this.report()
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<IBatchReporterConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取当前配置
   */
  public getConfig(): Required<IBatchReporterConfig> {
    return { ...this.config }
  }

  /**
   * 获取当前队列中的数据数量
   */
  public getQueueSize(): number {
    return this.items.length
  }
}

export { BatchReporter }
export type { IBatchReporterConfig, IBatchReporter } 