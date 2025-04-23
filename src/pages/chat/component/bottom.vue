<template>
  <view>
    <!-- 输入区域 -->
    <view class="input-area" :style="{ bottom: popupType === 'emoji' ? emojiHeight + 'rpx' :  popupType === 'option' ?  morePanelHeight + 'rpx' : '0rpx'}">
      <view class="input-container">
        <!-- 语音/键盘切换按钮 -->
        <view class="action-button" @click="transForm">
          <image class="action-icon" :src="isVoice ? '/static/img/chat/keyboard.svg' : '/static/img/chat/audio.svg'" mode="aspectFit" />
        </view>

        <!-- 输入区域 -->
        <view class="input-wrapper">
          <textarea 
            v-if="!isVoice" 
            class="input-field"
            :value="newMessage"
            :adjust-position="false"
            placeholder="请输入内容"
            auto-height
            @input="handleInput"
            @keyboardheightchange="closeKeyBorder"
            @focus="getInputHeight"
          />
          <view 
            v-else 
            class="voice-button"
            @touchstart.stop="startRecord"
            @touchend.prevent="touchEnd"
            @touchmove.prevent="touchMove"
          >
            <text>按住说话</text>
          </view>
        </view>

        <!-- 表情按钮 -->
        <view class="action-button" @click="openPopup(emojiFlag ? 'keyboard' : 'emoji')" v-if="!isVoice">
          <image class="action-icon" :src="emojiFlag ? '/static/img/chat/keyboard.svg' : '/static/img/chat/emo.svg'" mode="aspectFit" />
        </view>

        <!-- 更多/发送按钮 -->
        <view v-if="sendFlag && !isVoice" class="action-button" @click="openPopup('option')">
          <image class="action-icon" src="/static/img/chat/option.svg" mode="aspectFit" />
        </view>
        <view v-else-if="!isVoice" class="send-button" @click="sendMessage">
          发送
        </view>
      </view>
    </view>

    <!-- 弹出层 -->
    <uv-popup 
      ref="popup" 
      :overlay="false" 
      :z-index="104" 
      mode="bottom" 
      :safeAreaInsetBottom="true"
      :show="!!popupType"
      @close="closePopup"
    >
      <view class="popup-content">
        <emojiPopup 
          v-if="popupType === 'emoji'" 
          :emojiHeight="emojiHeight" 
          @addEmoji="addEmoji"
        />
        <optionPopup 
          v-if="popupType === 'option'" 
          :keyboardHeight="keyboardHeight" 
          @getFilePath="getFilePath"
        />
      </view>
    </uv-popup>

    <!-- 语音录制弹窗 -->
    <view 
      class="voice-popup" 
      :class="{ 'voice-popup-show': isRecording }"
    >
      <view class="voice-popup-content">
        <image 
          class="voice-icon" 
          :src="isMovingOut ? '/static/img/chat/voice-cancel.svg' : '/static/img/chat/voice-record.svg'" 
          mode="aspectFit" 
        />
        <view v-if="!isMovingOut" class="voice-waves">
          <view class="wave"></view>
          <view class="wave"></view>
          <view class="wave"></view>
        </view>
        <text class="voice-tip">{{ isMovingOut ? '松开手指，取消发送' : '松开发送，上滑取消' }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  inject,
  onMounted
} from "vue";
import type { PropType } from "vue";
import { debounce } from "@/utils/ablilty";
import wsManager from "@/ws-manager/ws";
import { useUserStore } from "@/pinia/user/user";
import emojiPopup from "../popup/emoji.vue";
import optionPopup from "../popup/option.vue";
import { usePageChatStore } from '@/pinia/page/pageChat/pageChat';


export default defineComponent({
  props: {
    conversationId: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<'single' | 'group'>,
      default: "single"
    }
  },
  emits: ["sendMessage"],
  components: {
    emojiPopup,
    optionPopup,
  },
  setup(props, { emit }) {
    const userStore = useUserStore();
    const pageChatStore = usePageChatStore()
    const newMessage = ref("");
    const popupType = ref("");
    const popup = ref();
    const recorderManager = ref<any>(null);
    const isMovingOut = ref(false);
    const isRecording = ref(false);

    // 判断是否显示发送按钮
    const sendFlag = computed(() => {
      return newMessage.value === "";
    });

    // 获取键盘高度
    const getInputHeight = (e: { detail: { height: number } }) => {
      if (e.detail.height !== 0) {
        pageChatStore.updateKeyboardHeight(parseInt(String(e.detail.height)) * 2 - 25);
      }
    };

    // 判断键盘的状态
    const closeKeyBorder = (e: { detail: { height: number } }) => {
      pageChatStore.updateKeyboardHeight(e.detail.height === 0 ? 0 : parseInt(String(e.detail.height)) * 2 - 25);
    };

    // 切换输入模式（文本/语音）
    const transForm = () => {
      // 如果当前有面板打开，先关闭
      if (popupType.value) {
        popup.value?.close();
        if (popupType.value === 'emoji') {
          pageChatStore.toggleEmojiPanel();
        } else if (popupType.value === 'option') {
          pageChatStore.toggleMorePanel();
        }
        popupType.value = "";
      }

      // 切换输入模式
      pageChatStore.toggleInputMode();
    };

    // 打开表情/更多面板
    const openPopup = (type: string) => {
      // 如果点击的是键盘按钮，关闭所有面板
      if (type === 'keyboard') {
        popup.value?.close();
        popupType.value = "";
        if (pageChatStore.showEmoji) {
          pageChatStore.toggleEmojiPanel();
        }
        return;
      }

      // 如果点击的是当前打开的面板，则关闭
      if (popupType.value === type) {
        popup.value?.close();
        popupType.value = "";
        if (type === 'emoji') {
          pageChatStore.toggleEmojiPanel();
        } else if (type === 'option') {
          pageChatStore.toggleMorePanel();
        }
        return;
      }

      // 如果之前有其他面板打开，先关闭
      if (popupType.value) {
        if (popupType.value === 'emoji') {
          pageChatStore.toggleEmojiPanel();
        } else if (popupType.value === 'option') {
          pageChatStore.toggleMorePanel();
        }
      }

      // 打开新的面板
      popupType.value = type;
      popup.value?.open();

      // 更新状态
      if (type === 'emoji') {
        pageChatStore.toggleEmojiPanel();
      } else if (type === 'option') {
        pageChatStore.toggleMorePanel();
      }
    };

    // 添加表情
    const addEmoji = (emoji: string) => {
      newMessage.value += emoji;
    };

    // 获取文件路径
    const getFilePath = (data: string) => {
      const msgInfo = {
        type: 2,
        imageMsg: {
          fileId: data.fileId,
          name: data.name
        },
      };
      emitSendMessage(msgInfo);
      wsSendMessage(msgInfo);
    };

    // 发送消息
    const sendMessage = () => {
      if (!newMessage.value.trim()) return;
      
      const msgInfo = {
        type: 1,
        textMsg: {
          content: newMessage.value,
        },
      };
      emitSendMessage(msgInfo);
      wsSendMessage(msgInfo);
      newMessage.value = "";
    };

    // 发送消息到WS
    const wsSendMessage = (msg: any) => {
      wsManager.sendChatMessage({
        type: "chat_message_send",
        body: {
          conversationId: props.conversationId,
          msg: msg,
        }
      });
    };

    // 发送消息到父组件
    const emitSendMessage = (msg: any) => {
      emit("sendMessage", {
        conversationId: props.conversationId,
        msg: msg,
        create_at: Date().toString(),
        messageId: Date.now(),
        sender: {
          userId: userStore.userInfo.userId,
          avatar: userStore.userInfo.avatar,
        },
      });
    };

    // 处理输入
    const handleInput = debounce((e: { detail: { value: string } }) => {
      newMessage.value = e.detail.value;
    }, 20);

    // 语音录制相关
    const startRecord = () => {
      try {
        isRecording.value = true;
        isMovingOut.value = false;
        recorderManager.value?.start({
          duration: 60000,
          sampleRate: 44100,
          numberOfChannels: 1,
          encodeBitRate: 192000,
          format: 'mp3'
        });
      } catch (error) {
        console.error('录音启动失败:', error);
      }
    };

    const touchEnd = () => {
      try {
        isRecording.value = false;
        recorderManager.value?.stop();
      } catch (error) {
        console.error('录音停止失败:', error);
      }
    };

    const touchMove = (event: any) => {
      if (!isRecording.value) return;
      
      // 获取手指位置
      const touch = event.touches[0];
      // 获取按钮位置
      const button = event.target.getBoundingClientRect();
      const buttonCenterY = button.top + button.height / 2;
      
      // 如果手指移动到按钮上方超过100px，标记为取消发送
      isMovingOut.value = touch.clientY < buttonCenterY - 100;
    };

    // 初始化录音管理器
    onMounted(() => {
      try {
        recorderManager.value = uni.getRecorderManager();
        
        // 监听录音开始事件
        recorderManager.value.onStart(() => {
          console.log('录音开始');
          isRecording.value = true;
        });

        // 监听录音结束事件
        recorderManager.value.onStop((res: any) => {
          console.log('录音结束');
          isRecording.value = false;
          const { tempFilePath, duration } = res;
          // 如果是移动到外部取消录音，则不发送
          if (isMovingOut.value) {
            isMovingOut.value = false;
            return;
          }
          // 处理录音文件
          const msgInfo = {
            type: 3, // 语音消息类型
            voiceMsg: {
              src: tempFilePath,
              duration: duration
            }
          };
          emitSendMessage(msgInfo);
          wsSendMessage(msgInfo);
        });

        // 监听录音错误事件
        recorderManager.value.onError((error: any) => {
          console.error('录音错误:', error);
          isRecording.value = false;
        });
      } catch (error) {
        console.error('录音管理器初始化失败:', error);
      }
    });

    return {
      sendMessage,
      transForm,
      keyboardHeight: 0,
      isVoice: computed(() => pageChatStore.inputMode === 'voice'),
      sendFlag,
      newMessage,
      handleInput,
      openPopup,
      popup,
      popupType,
      emojiFlag: computed(() => pageChatStore.showEmoji),
      emojiHeight: computed(() => pageChatStore.emojiHeight *2 ),
      morePanelHeight: computed(() => pageChatStore.morePanelHeight *2 ),
      addEmoji,
      getInputHeight,
      closeKeyBorder,
      startRecord,
      touchEnd,
      touchMove,
      isMovingOut,
      isRecording,
      getFilePath
    };
  },
});
</script>

<style lang="scss" scoped>
.input-area {
  position: fixed;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12rpx 24rpx;
  border-top: 2rpx solid rgba(0,0,0,0.04);
  z-index: 105;
  padding-bottom: calc(env(safe-area-inset-bottom) + 12rpx);
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: bottom 0.3s ease;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 16rpx;
  position: relative;
  z-index: 106;
}

.action-button {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  transition: all 0.2s;
  position: relative;
  z-index: 107;

  &:active {
    background: #EEEEEE;
    transform: scale(0.95);
  }
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  opacity: 0.85;
}

.input-wrapper {
  flex: 1;
  min-height: 64rpx;
  background: #F5F5F5;
  border-radius: 32rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 106;
}

.input-field {
  width: 100%;
  min-height: 64rpx;
  line-height: 64rpx;
  font-size: 28rpx;
  color: #333333;
  padding: 0;
  display: flex;
  align-items: center;

  &::placeholder {
    color: #999999;
  }
}

.voice-button {
  width: 100%;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text {
    color: #666666;
    font-size: 28rpx;
  }

  &:active {
    opacity: 0.7;
    transform: scale(0.98);
  }
}

.send-button {
  min-width: 100rpx;
  height: 64rpx;
  background: #FF7D45;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.2s;
  padding: 0 32rpx;
  position: relative;
  z-index: 107;

  &:active {
    opacity: 0.9;
    transform: scale(0.96);
  }
}

/* 语音录制弹窗 */
.voice-popup {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  
  &.voice-popup-show {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
  }
}

.voice-popup-content {
  width: 240rpx;
  height: 240rpx;
  background: rgba(0,0,0,0.6);
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.voice-icon {
  width: 64rpx;
  height: 64rpx;
  margin-bottom: 16rpx;
}

.voice-waves {
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 48rpx;
}

.wave {
  width: 8rpx;
  height: 24rpx;
  background: #FFFFFF;
  border-radius: 4rpx;
  animation: wave 1.2s ease-in-out infinite;
  opacity: 0.9;
  
  &:nth-child(1) { animation-delay: -1.2s; }
  &:nth-child(2) { animation-delay: -1.0s; }
  &:nth-child(3) { animation-delay: -0.8s; }
}

.voice-tip {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
  opacity: 0.9;
}

@keyframes wave {
  0%, 100% {
    height: 24rpx;
    opacity: 0.3;
  }
  50% {
    height: 64rpx;
    opacity: 0.9;
  }
}

/* 弹出层样式 */
.popup-content {
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
  position: relative;
  z-index: 104;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease;
}
</style>
