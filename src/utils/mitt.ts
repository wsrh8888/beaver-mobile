import mitt, { type Emitter } from 'mitt'

type Events = {
  /**
   * @description: 测试事件
   */
  mitt__test: any
}
const emitter: Emitter<Events> = mitt<Events>()

/**
 * @description: 基本用法
 * mitt.emit('mitt__test') 触发事件
 * mitt.on('mitt__test', (data) => {}) 监听事件
 */
export default emitter
