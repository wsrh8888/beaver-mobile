<template>
  <view class="emoji-list">
    <view 
      v-for="(emoji, index) in emojis" 
      :key="index" 
      class="emoji-item" 
      @tap="addEmoji(emoji)"
    >
      <image class="emoji-icon" :src="emoji.icon" mode="aspectFit" />
    </view>
    <!-- 添加空元素填充每行 -->
    <view 
      v-for="i in (8 - (emojis.length % 8)) % 8" 
      :key="`placeholder-${i}`" 
      class="emoji-item placeholder"
    ></view>
  </view>
</template>

<script lang="ts">
import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';

interface Emoji {
  icon: string;
  name?: string;
  [key: string]: any;
}

interface Props {
  emojis: Emoji[];
}

export default {
  name: 'DefaultEmojiList',
  props: {
    emojis: {
      type: Array as () => Emoji[],
      default: () => []
    }
  },
  setup(props: Props) {
    const pageChatStore = usePageChatStore();

    const addEmoji = (emoji: Emoji) => {
      // 默认表情添加到输入框文本中
      const emojiText = emoji.name || '[表情]';
      pageChatStore.manageInputText('add', emojiText);
    }

    return {
      addEmoji
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji-list {
  display: flex;
  flex-wrap: wrap;
  padding: 12rpx 0;
  justify-content: space-between;
  margin: 0 -4rpx;
}

.emoji-item {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  transition: all 0.2s;
  background: transparent;
  box-sizing: border-box;
  margin: 4rpx;
  &:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
  }

  &.placeholder {
    visibility: hidden;
    pointer-events: none;
  }
}

.emoji-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
}
</style> 