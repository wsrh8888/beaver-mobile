/**
 * 聊天页面状态管理
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

import { defineStore } from 'pinia';
import { messageManager } from '@/message-manager';
import { MessageType } from '@/types/store/message';
import type { IPageChatState } from '@/types/store/page/pageChat';


export const usePageChatStore = defineStore('usePageChatStore', {
  state: (): IPageChatState => ({
    conversationId: '',
    inputMode: 'text',
    inputText: '',
    showEmoji: false,
    showMore: false,
    keyboardHeight: 0,
    emojiHeight: 466,
    morePanelHeight: 214,
    inputBarHeight: 96,
    userMessageSequence: 0,
    navBarHeight: 88
  }),

  getters: {
    // 获取底部面板bottom的值（键盘高度或其他面板高度）
    bottomHeight(): number {
      let bottomHeight = 0
    
      if (this.showEmoji) {
        bottomHeight += this.emojiHeight;
      }
      if (this.showMore) {
        bottomHeight += this.morePanelHeight;
      }
      if (this.keyboardHeight > 0) {
        bottomHeight += this.keyboardHeight 
      }
      return bottomHeight;
    },
          // 获取内容区域高度（rpx单位，屏幕高度减去状态栏、导航栏、输入区域等）
      getContentHeight(): number {
        const systemInfo = uni.getSystemInfoSync();
        const screenHeight = systemInfo.windowHeight;
        const screenWidth = systemInfo.windowWidth;
        
        // 计算 rpx 到 px 的转换比例：750rpx = screenWidth
        const rpxToPxRatio = screenWidth / 750;
        
        const statusBarHeight = systemInfo.statusBarHeight || 0;
        const safeArea = systemInfo.safeAreaInsets?.bottom || 0;

        // 将 px 值转换为 rpx 值进行计算
        const statusBarHeightRpx = statusBarHeight / rpxToPxRatio; // px -> rpx
        const safeAreaRpx = safeArea / rpxToPxRatio; // px -> rpx
        const screenHeightRpx = screenHeight / rpxToPxRatio; // px -> rpx
        
        const inputAreaHeightRpx = this.inputBarHeight;
        const navBarHeightRpx = this.navBarHeight;
        const morePanelHeightRpx = this.showMore ? this.morePanelHeight : 0;
        const emojiHeightRpx = this.showEmoji ? this.emojiHeight : 0;
        const keyboardHeightRpx = this.keyboardHeight;

        console.error('screenHeightRpx', screenHeightRpx)
        console.error('statusBarHeightRpx', statusBarHeightRpx)
        console.error('navBarHeightRpx', navBarHeightRpx)
        console.error('inputAreaHeightRpx', inputAreaHeightRpx)
        console.error('safeAreaRpx', safeAreaRpx)
        console.error('morePanelHeightRpx', morePanelHeightRpx)
        console.error('emojiHeightRpx', emojiHeightRpx)
        console.error('keyboardHeightRpx', keyboardHeightRpx)

        // 使用 rpx 单位进行计算
        const availableHeightRpx = screenHeightRpx - statusBarHeightRpx - navBarHeightRpx - inputAreaHeightRpx - safeAreaRpx - emojiHeightRpx - keyboardHeightRpx - morePanelHeightRpx;
        
        console.error('availableHeightRpx', availableHeightRpx)
        return availableHeightRpx;
      }
  },

  actions: {
    // 设置当前会话ID
    setConversationId(conversationId: string) {
      this.conversationId = conversationId;
    },

    // 管理输入文本（设置、添加、清空）
    manageInputText(action: 'set' | 'add' | 'clear', text?: string) {
      switch (action) {
        case 'set':
          this.inputText = text || '';
          break;
        case 'add':
          this.inputText += text || '';
          break;
        case 'clear':
          this.inputText = '';
          break;
      }
    },

    // 切换输入模式（文本/语音）
    toggleInputMode() {
      if (this.inputMode === 'text') {
        this.closeAllPanels();
      }
      this.inputMode = this.inputMode === 'text' ? 'voice' : 'text';
    },

    /**
     * @description: 表情icon点击时候触发
     * @return {*}
     */
    toggleEmojiPanel() {
      console.error('切换表情面板')
      this.showMore = false;
      this.showEmoji = !this.showEmoji;
      this.keyboardHeight = 0;
    },

    /**
     * @description: 更多icon点击时候触发
     */
    toggleMorePanel() {
      console.error('切换更多功能面板')
      this.showEmoji = false;
      this.showMore = !this.showMore;
      this.keyboardHeight = 0;
    },

    // 更新键盘高度 (height参数为rpx单位)
    updateKeyboardHeight(height: number) {
      console.error('更新键盘高度', height)
      if (height === 0) {
        if (!this.showEmoji && !this.showMore) {
          this.keyboardHeight = 0; // rpx单位
        }
      } else {
        this.keyboardHeight = height; // rpx单位
        this.showEmoji = false;
        this.showMore = false;
      }
    },

    // 切换为输入框获取焦点
    toggleInputFocus() {
      console.error('切换为输入框获取焦点')
      this.showEmoji = false;
      this.showMore = false;
    },


    // 发送消息 - 委托给消息管理器
    async sendMessage(content: any, type: MessageType) {
      if (!this.conversationId) {
        console.error('conversationId 未设置');
        return false;
      }

      try {
        await messageManager.getInstance().sendMessage(this.conversationId, content, type);
        this.userMessageSequence++;        
        
        return true;
      } catch (error) {
        console.error('发送消息失败:', error);
        uni.showToast({
          title: '发送失败',
          icon: 'error'
        });
        return false;
      }
    },

    // 发送当前输入框的文本消息
    async sendTextMessage() {
      if (!this.inputText.trim()) {
        return false;
      }
      
      return await this.sendMessage(this.inputText.trim(), MessageType.TEXT);
    },

    // 关闭所有面板
    closeAllPanels() {
      this.showEmoji = false;
      this.showMore = false;
      this.keyboardHeight = 0;
    },

    // 重置所有状态
    reset() {
      this.conversationId = '';
      this.inputMode = 'text';
      this.inputText = '';
      this.showEmoji = false;
      this.showMore = false;
      this.keyboardHeight = 0;
      this.userMessageSequence = 0;
    }
  }
});