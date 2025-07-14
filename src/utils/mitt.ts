import mitt, { type Emitter } from 'mitt'

type Events = {
  /**
   * @description: 通话状态变更事件
   */
  changeCall: boolean
}

const emitter: Emitter<Events> = mitt<Events>()

/**
 * 事件总线
 * mitt.emit('changeCall', false) 触发事件
 * mitt.on('changeCall', (data) => {}) 监听事件
 */
export default emitter
