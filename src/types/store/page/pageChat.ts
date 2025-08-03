
/**
 * 聊天页面状态接口
 * 
 * 单位使用说明：
 * - px: 固定像素单位，用于系统API返回的值（如 statusBarHeight、safeAreaInsets）
 * - rpx: 响应式像素单位，750rpx = 屏幕宽度，用于UI布局
 * 
 * 各变量单位说明：
 * - keyboardHeight: rpx单位 (从键盘事件转换而来)
 * - emojiHeight: rpx单位 (表情面板高度)
 * - morePanelHeight: rpx单位 (更多功能面板高度)
 * - inputBarHeight: rpx单位 (输入框高度)
 * - navBarHeight: rpx单位 (导航栏高度)
 */
export interface IPageChatState {
  /** 
   *  @description: 当前会话ID
  */
  conversationId: string;

  /**
   *  @description: 输入模式：文本或语音
   */
  inputMode: 'text' | 'voice';

  /**
   *  @description: 输入框文本内容
   */
  inputText: string;

  /**
   *  @description: 是否显示表情面板
   */
  showEmoji: boolean;

  /**
   *  @description: 是否显示更多功能面板
   */
  showMore: boolean;

  /**
   *  @description: 键盘高度 (rpx单位)
   */
  keyboardHeight: number;

  /**
   *  @description: 表情面板高度 (rpx单位)
   */
  emojiHeight: number;

  /**
   *  @description: 更多功能面板高度 (rpx单位)
   */
  morePanelHeight: number;

  /**
   *  @description: 用户发送消息的序列号（用于触发滚动到底部）
   */
  userMessageSequence: number;

  /**
   *  @description: 输入框高度 (rpx单位)
   */
  inputBarHeight: number;

  /**
   *  @description: 导航栏高度 (rpx单位)
   */
  navBarHeight: number;
}
