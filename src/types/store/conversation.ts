import type { IChatInfo } from '@/types/ajax/chat';

/**
 * @description: 会话 Store 状态
 */
export interface IConversationStoreState {
  /** 最近会话列表 */
  _recentChatList: IChatInfo[];
  /** 当前选中的会话ID */
  currentChatId: string | null;
}

/**
 * @description: 更新最后消息的参数
 */
export interface IUpdateLastMessageParams {
  content: string;
  timestamp: string;
} 