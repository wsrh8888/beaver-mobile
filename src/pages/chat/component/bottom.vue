<template>
  <view class="chat-input-container">
    <!-- 输入区域 -->
    <view class="input-area" :style="inputAreaStyle">
      <view class="input-wrapper">
        <!-- 语音/键盘切换按钮 -->
        <view class="action-btn" @click="toggleInputMode">
          <image 
            class="action-icon" 
            :src="inputMode === 'voice' ? '/static/img/chat/keyboard.svg' : '/static/img/chat/audio.svg'" 
            mode="aspectFit" 
          />
        </view>

        <!-- 文本输入框 -->
        <view v-if="inputMode === 'text'" class="text-input-wrapper">
          <textarea 
            class="text-input"
            :value="inputText"
            :adjust-position="false"
            placeholder="请输入内容"
            auto-height
            @input="handleTextInput"
            @keyboardheightchange="handleKeyboardChange"
            @focus="handleInputFocus"
          />
        </view>

        <!-- 语音按钮 -->
        <view 
          v-else 
          class="voice-btn"
          :class="{ 'voice-btn-active': isRecording }"
          @touchstart.stop="startVoiceRecord"
          @touchend.prevent="endVoiceRecord"
          @touchmove.prevent="moveVoiceRecord"
        >
          <text>{{ voiceButtonText }}</text>
        </view>

        <!-- 表情按钮 -->
        <view 
          v-if="inputMode === 'text'" 
          class="action-btn" 
          @click="toggleEmojiPanel"
        >
          <image 
            class="action-icon" 
            :src="showEmoji ? '/static/img/chat/keyboard.svg' : '/static/img/chat/emo.svg'" 
            mode="aspectFit" 
          />
        </view>

        <!-- 发送/更多按钮 -->
        <view v-if="canSend" class="send-btn" @click="sendTextMessage">
          发送
        </view>
        <view v-else-if="inputMode === 'text'" class="action-btn" @click="toggleMorePanel">
          <image class="action-icon" src="/static/img/chat/option.svg" mode="aspectFit" />
        </view>
      </view>
    </view>

    <!-- 表情面板 -->
    <view v-if="showEmoji" class="emoji-panel">
      <emojiPopup @addEmoji="addEmoji" />
    </view>

    <!-- 更多功能面板 -->
    <view v-if="showMore" class="more-panel">
      <optionPopup @sendImage="sendImageMessage" />
    </view>

    <!-- 语音录制提示 -->
    <view v-if="isRecording" class="voice-recording-modal">
      <view class="voice-recording-content">
        <image 
          class="voice-icon" 
          :src="isCancelVoice ? '/static/img/chat/voice-cancel.svg' : '/static/img/chat/voice-record.svg'" 
          mode="aspectFit" 
        />
        <view v-if="!isCancelVoice" class="voice-waves">
          <view class="wave" v-for="i in 3" :key="i"></view>
        </view>
        <text class="voice-tip">
          {{ isCancelVoice ? '松开手指，取消发送' : '松开发送，上滑取消' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { PropType } from 'vue';
import { MessageType } from '@/types/ajax/chat';
import { messageManager } from '@/message-manager';
import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';
import { debounce } from '@/utils/ablilty';
import emojiPopup from '../popup/emoji.vue';
import optionPopup from '../popup/option.vue';

export default defineComponent({
  name: 'ChatBottom',
  components: {
    emojiPopup,
    optionPopup,
  },
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    chatType: {
      type: String as PropType<'single' | 'group'>,
      default: 'single'
    }
  },
  emits: ['messageSent'],
  setup(props, { emit }) {
    const pageChatStore = usePageChatStore();
    
    // 基础状态
    const inputText = ref('');
    const inputMode = ref<'text' | 'voice'>('text');
    const showEmoji = ref(false);
    const showMore = ref(false);
    
    // 语音录制状态
    const isRecording = ref(false);
    const isCancelVoice = ref(false);
    const recorderManager = ref<any>(null);
    
    // 计算属性
    const canSend = computed(() => inputText.value.trim().length > 0);
    
    const voiceButtonText = computed(() => {
      if (isRecording.value) {
        return isCancelVoice.value ? '松开取消' : '松开发送';
      }
      return '按住说话';
    });
    
    const inputAreaStyle = computed(() => {
      let bottom = 0;
      if (showEmoji.value) bottom += pageChatStore.emojiHeight * 2;
      if (showMore.value) bottom += pageChatStore.morePanelHeight * 2;
      return { bottom: `${bottom}rpx` };
    });

    // 输入处理
    const handleTextInput = debounce((e: { detail: { value: string } }) => {
      inputText.value = e.detail.value;
    }, 100);

    const handleInputFocus = (e: { detail: { height: number } }) => {
      if (e.detail.height !== 0) {
        pageChatStore.updateKeyboardHeight(e.detail.height * 2 - 25);
      }
    };

    const handleKeyboardChange = (e: { detail: { height: number } }) => {
      const height = e.detail.height === 0 ? 0 : e.detail.height * 2 - 25;
      pageChatStore.updateKeyboardHeight(height);
    };

    // 模式切换
    const toggleInputMode = () => {
      closeAllPanels();
      inputMode.value = inputMode.value === 'text' ? 'voice' : 'text';
      pageChatStore.toggleInputMode();
    };

    const toggleEmojiPanel = () => {
      if (showMore.value) {
        showMore.value = false;
        pageChatStore.toggleMorePanel();
      }
      showEmoji.value = !showEmoji.value;
      pageChatStore.toggleEmojiPanel();
    };

    const toggleMorePanel = () => {
      if (showEmoji.value) {
        showEmoji.value = false;
        pageChatStore.toggleEmojiPanel();
      }
      showMore.value = !showMore.value;
      pageChatStore.toggleMorePanel();
    };

    const closeAllPanels = () => {
      if (showEmoji.value) {
        showEmoji.value = false;
        pageChatStore.toggleEmojiPanel();
      }
      if (showMore.value) {
        showMore.value = false;
        pageChatStore.toggleMorePanel();
      }
    };

    // 表情处理
    const addEmoji = (emoji: string) => {
      inputText.value += emoji;
    };

    // 消息发送
    const sendTextMessage = async () => {
      if (!canSend.value) return;
      
      const content = inputText.value.trim();
      inputText.value = '';
      
      try {
        await messageManager.sendMessage(
          props.conversationId,
          content,
          MessageType.TEXT
        );
        emit('messageSent');
      } catch (error) {
        console.error('发送文本消息失败:', error);
        uni.showToast({
          title: '发送失败',
          icon: 'error'
        });
      }
    };

    const sendImageMessage = async (imageData: any) => {
      try {
        await messageManager.sendMessage(
          props.conversationId,
          {
            fileId: imageData.fileId,
            name: imageData.name
          },
          MessageType.IMAGE
        );
        emit('messageSent');
        closeAllPanels();
      } catch (error) {
        console.error('发送图片消息失败:', error);
        uni.showToast({
          title: '发送失败',
          icon: 'error'
        });
      }
    };

    // 语音录制
    const startVoiceRecord = () => {
      if (!recorderManager.value) return;
      
      try {
        isRecording.value = true;
        isCancelVoice.value = false;
        recorderManager.value.start({
          duration: 60000,
          sampleRate: 44100,
          numberOfChannels: 1,
          encodeBitRate: 192000,
          format: 'mp3'
        });
      } catch (error) {
        console.error('开始录音失败:', error);
        isRecording.value = false;
      }
    };

    const endVoiceRecord = () => {
      if (!recorderManager.value || !isRecording.value) return;
      
      try {
        recorderManager.value.stop();
      } catch (error) {
        console.error('停止录音失败:', error);
      }
    };

    const moveVoiceRecord = (event: any) => {
      if (!isRecording.value) return;
      
      const touch = event.touches[0];
      const button = event.target.getBoundingClientRect();
      const buttonCenterY = button.top + button.height / 2;
      
      isCancelVoice.value = touch.clientY < buttonCenterY - 100;
    };

    // 初始化录音管理器
    const initRecorderManager = () => {
      try {
        recorderManager.value = uni.getRecorderManager();
        
        recorderManager.value.onStart(() => {
          console.log('录音开始');
        });

        recorderManager.value.onStop(async (res: any) => {
          console.log('录音结束');
          isRecording.value = false;
          
          if (isCancelVoice.value) {
            isCancelVoice.value = false;
            return;
          }
          
          // TODO: 处理语音消息发送
          // const { tempFilePath, duration } = res;
          // await messageManager.sendMessage(
          //   props.conversationId,
          //   { src: tempFilePath, duration },
          //   MessageType.VOICE
          // );
        });

        recorderManager.value.onError((error: any) => {
          console.error('录音错误:', error);
          isRecording.value = false;
          isCancelVoice.value = false;
        });
      } catch (error) {
        console.error('初始化录音管理器失败:', error);
      }
    };

    // 生命周期
    onMounted(() => {
      initRecorderManager();
    });

    onBeforeUnmount(() => {
      messageManager.cleanup();
    });

    return {
      // 状态
      inputText,
      inputMode,
      showEmoji,
      showMore,
      isRecording,
      isCancelVoice,
      
      // 计算属性
      canSend,
      voiceButtonText,
      inputAreaStyle,
      
      // 方法
      handleTextInput,
      handleInputFocus,
      handleKeyboardChange,
      toggleInputMode,
      toggleEmojiPanel,
      toggleMorePanel,
      addEmoji,
      sendTextMessage,
      sendImageMessage,
      startVoiceRecord,
      endVoiceRecord,
      moveVoiceRecord,
    };
  },
});
</script>

<style lang="scss" scoped>
.chat-input-container {
  position: relative;
}

.input-area {
  position: fixed;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12rpx 24rpx;
  border-top: 2rpx solid rgba(0,0,0,0.04);
  z-index: 105;
  transition: bottom 0.3s ease;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
  min-height: 72rpx;
}

.action-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:active {
    background: #EBEEF5;
    transform: scale(0.95);
  }
}

.action-icon {
  width: 48rpx;
  height: 48rpx;
}

.text-input-wrapper {
  flex: 1;
  min-height: 72rpx;
  max-height: 200rpx;
  background: #F9FAFB;
  border-radius: 36rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
}

.text-input {
  width: 100%;
  min-height: 72rpx;
  max-height: 200rpx;
  font-size: 28rpx;
  line-height: 1.4;
  color: #2D3436;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
}

.voice-btn {
  flex: 1;
  height: 72rpx;
  background: #F9FAFB;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #636E72;
  transition: all 0.2s ease;
  user-select: none;

  &.voice-btn-active {
    background: #FF7D45;
    color: white;
    transform: scale(0.98);
  }
}

.send-btn {
  height: 72rpx;
  padding: 0 32rpx;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: white;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
}

.emoji-panel,
.more-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFFFFF;
  z-index: 104;
}

.voice-recording-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.voice-recording-content {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 32rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 240rpx;
}

.voice-icon {
  width: 96rpx;
  height: 96rpx;
  margin-bottom: 24rpx;
}

.voice-waves {
  display: flex;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.wave {
  width: 8rpx;
  height: 32rpx;
  background: #FF7D45;
  border-radius: 4rpx;
  animation: wave 1s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
}

.voice-tip {
  color: white;
  font-size: 24rpx;
  text-align: center;
}
</style>

