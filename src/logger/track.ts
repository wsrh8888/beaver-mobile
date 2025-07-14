import { eventBatchReporter } from '@/utils/report/event-batch-reporter'
import type { IEventData } from '@/types/ajax/track'
import { trackId } from '@/env.json'

class Track {
  private static instance: Track
  private bucketId: string = trackId
  private platform: string = 'uni-app'
  private deviceID: string = ''

  private constructor() {
    this.deviceID = uni.getStorageSync('uni_device_id') || ''
  }

  public static getInstance(): Track {
    if (!Track.instance) {
      Track.instance = new Track()
    }
    return Track.instance
  }

  /**
   * 追踪事件
   */
  private track(eventName: string, action: string, value: object = {}): void {
    const eventData: IEventData = {
      eventName,
      action,
      bucketId: this.bucketId,
      platform: this.platform,
      timestamp: Date.now(),
      deviceID: this.deviceID,
      data: JSON.stringify(value),
    }

    eventBatchReporter.addEvent(eventData)
  }

  /**
   * 追踪点击事件
   */
  public click(eventName: string, value?: any): void {
    this.track(eventName, 'click', value)
  }

  /**
   * 追踪页面访问
   */
  public view(eventName: string, value?: any): void {
    this.track(eventName, 'view', value)
  }
}

export const track = Track.getInstance() 