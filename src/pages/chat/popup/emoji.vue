<template>
  <view class="emoji-popup">
    <!-- <view class="emoji-header">
      <scroll-view scroll-x class="emoji-tabs" show-scrollbar="false">
        <view class="tabs-content">
          <view v-for="(category, index) in emojiCategories" :key="index" class="tab-item"
            :class="{ active: currentCategory === index }" @tap="switchCategory(index)">
          </view>
        </view>
      </scroll-view>
    </view> -->

    <scroll-view scroll-y class="emoji-grid" :style="{ height: emojiHeight + 'rpx' }">
      <view class="grid-content">
        <view v-for="(item, index) in currentEmojis" :key="index" class="emoji-item" @tap="addEmoji(item)">
          <image class="emoji-icon" :src="item.icon" mode="aspectFit" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue';
import { emojiList } from '@/utils/emoji';
import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';

export default defineComponent({
  setup(props, { emit }) {
    const chatState = inject<any>('chatState');
    const currentCategory = ref(0);
    const pageChatStore = usePageChatStore();

    const emojiCategories = [
      { icon: '/static/emoji/recent.png', emojis: emojiList.slice(0, 8) },
      { icon: '/static/emoji/face.png', emojis: emojiList.slice(0, 24) },
      { icon: '/static/emoji/animal.png', emojis: emojiList.slice(24, 48) },
      { icon: '/static/emoji/food.png', emojis: emojiList.slice(48, 72) }
    ];

    const currentEmojis = computed(() => {
      return emojiCategories[currentCategory.value].emojis;
    });

    const switchCategory = (index: number) => {
      currentCategory.value = index;
    };

    const addEmoji = (item: any) => {
      emit('addEmoji', item.name);
    };

    return {
      emojiCategories,
      currentCategory,
      currentEmojis,
      switchCategory,
      addEmoji,
      emojiHeight: computed(() => pageChatStore.emojiHeight * 2)
    };
  }
});
</script>

<style lang="scss" scoped>
.emoji-popup {
  background: #FFFFFF;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
  overflow: hidden;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.emoji-header {
  padding: 20rpx 0;
  border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
}

.emoji-tabs {
  white-space: nowrap;
  padding: 0 24rpx;
}

.tabs-content {
  display: inline-flex;
  gap: 20rpx;
  padding: 4rpx 0;
}

.tab-item {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &.active {
    background: rgba(255, 125, 69, 0.08);

    .tab-icon {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.tab-icon {
  width: 44rpx;
  height: 44rpx;
  opacity: 0.6;
  transition: all 0.2s;
}

.emoji-grid {
  height: 100%;
}

.grid-content {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16rpx;
  padding: 4rpx;
}

.emoji-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  transition: all 0.2s;

  &:active {
    background: rgba(0, 0, 0, 0.04);
    transform: scale(0.92);
  }
}

.emoji-icon {
  width: 64rpx;
  height: 64rpx;
}
</style>