import { defineStore } from 'pinia';

// 聊天页面状态接口
interface PageChatState {
  // 输入模式：文本或语音
  inputMode: 'text' | 'voice';
  // 是否显示表情面板
  showEmoji: boolean;
  // 是否显示更多功能面板
  showMore: boolean;
  // 键盘高度
  keyboardHeight: number;
  // 表情面板高度
  emojiHeight: number;
  // 更多功能面板高度
  morePanelHeight: number;
}

export const usePageChatStore = defineStore('usePageChatStore', {
  state: (): PageChatState => ({
    inputMode: 'text',
    showEmoji: false,
    showMore: false,
    keyboardHeight: 0,
    emojiHeight: 233,
    morePanelHeight: 107
  }),

  getters: {
    // 获取底部面板总高度（键盘高度或其他面板高度）
    bottomHeight(): number {
      if (this.keyboardHeight > 0) {
        return this.keyboardHeight;
      }
      if (this.showEmoji) {
        return this.emojiHeight;
      }
      if (this.showMore) {
        return this.morePanelHeight;
      }
      return 0;
    }
  },

  actions: {
    // 切换输入模式（文本/语音）
    toggleInputMode() {
      if (this.inputMode === 'text') {
        this.closeAllPanels();
      }
      this.inputMode = this.inputMode === 'text' ? 'voice' : 'text';
    },

    // 切换表情面板
    toggleEmojiPanel() {
      this.showMore = false;
      this.showEmoji = !this.showEmoji;
      this.keyboardHeight = 0;
    },

    // 切换更多功能面板
    toggleMorePanel() {
      this.showEmoji = false;
      this.showMore = !this.showMore;
      this.keyboardHeight = 0;
    },

    // 更新键盘高度
    updateKeyboardHeight(height: number) {
      if (height === 0) {
        if (!this.showEmoji && !this.showMore) {
          this.keyboardHeight = 0;
        }
      } else {
        this.keyboardHeight = height;
        this.showEmoji = false;
        this.showMore = false;
      }
    },

    // 关闭所有面板
    closeAllPanels() {
      this.showEmoji = false;
      this.showMore = false;
      this.keyboardHeight = 0;
    },

    // 重置所有状态
    reset() {
      this.inputMode = 'text';
      this.showEmoji = false;
      this.showMore = false;
      this.keyboardHeight = 0;
    }
  }
});