<template>
  <view>
    <view class="popul" :style="{ bottom: keyboardHeight + 'rpx' }">
      <view class="popul-input">
        <image class="bot-icon" v-if="!isVoice" src="@/static/img/chat/audio.svg" @click="transForm" />
        <image class="bot-icon" v-else src="@/static/img/chat/keyboard.svg" @click="transForm" />
        <textarea v-if="!isVoice" @input="handleInput" placeholder="请输入内容" :adjust-position="false" class="input"
          @keyboardheightchange="closeKeyBorder" @focus="getInputHeight" :focus="foucsFlag" :value="newMessage"
          auto-height />
        <block v-else>
          <view class="input" style="display: flex; justify-content: center; flex-direction: row"
            @touchstart.stop="startRecord" @touchend.prevent="touchEnd">
            <text style="color: #707070">按住说话</text>
          </view>
        </block>
        <image class="bot-icon" v-if="!emojiFlag" src="@/static/img/chat/emo.svg" @click="openPopup('emoji')" />
        <image class="bot-icon" v-else src="@/static/img/chat/keyboard.svg" @click="openPopup('keyboard')" />

        <image class="bot-icon" v-if="sendFlag" src="@/static/img/chat/option.svg" @click="openPopup('option')" />

        <view v-if="!sendFlag" class="btn" @click="sendMessage"> 发送 </view>

      </view>
      <!-- 表情包合集 -->
      <uv-popup ref="popup" :overlay="false">
        <emojiPopup v-if="popupType === 'emoji'" :emojiHeight="emojiHeight" @addEmoji="addEmoji"></emojiPopup>
        <optionPopup v-if="popupType === 'option'" :keyboardHeight="keyboardHeight" @getFilePath="getFilePath">
        </optionPopup>
      </uv-popup>
    </view>

  </view>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  toRefs,
  watchEffect,
} from "vue";
import type {

  PropType,
} from "vue";
import { debounce, pathToBase64 } from "@/utils/ablilty";
import wsManager from "@/ws-manager/ws";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { useUserStore } from "@/pinia/user/user";
import { useChatStore } from "@/pinia/chat/chat";

import emoji from "@/utils/emojs";
import emitter from "@/utils/mitt";
import emojiPopup from "../popup/emoji.vue";
import optionPopup from "../popup/option.vue";
import { msgType } from "./data";
import { parseChatPreview } from "@/utils/chat";
export default defineComponent({
  props: {
    conversationId: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<'single' >,
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
    const chatStore = useChatStore();


    
    const popupType = ref("emoji");
    const innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    //发送内容
    let newMessage = ref("");
    let scrollHeight = ref(9999999999); //直接给超大数值，这样就直接触底了
    const isVoice = ref(false); //是否准备录音

    const keyboardHeight = ref(0); //键盘高度
    let popup = ref(); //表情包实例
    let options = ref(); //多功能实例
    let emojiHeight = ref(531);
    let foucsFlag = ref(false); //判断是否聚焦
    let emojiFlag = ref(false); //判断是否是表情包
    let optionFlag = ref(false); //判断是否是多功能
    let starTime = ref(""); //录音开始时间
    let audioAni = ref(); //录音实例

    // 获取键盘高度
    const getInputHeight = (e) => {
      if (e.detail.height != 0) {
        keyboardHeight.value = parseInt(e.detail.height) * 2 - 25;
        emojiHeight.value = parseInt(e.detail.height) * 2 - 25;
      }
    };
    //判断是否显示发送
    const sendFlag = computed(() => {
      return newMessage.value === "";
    });
    // 判断键盘的状态
    const closeKeyBorder = (e) => {
      if (e.detail.height == 0) {
        if (emojiFlag.value) {
          emojiFlag.value = false;
          popup.value.close();
        }
        if (optionFlag.value) {
          optionFlag.value = false;
          options.value.close();
        }
        keyboardHeight.value = 10;
        // 必须弄个定时器，不然发送按钮的点击事件会被覆盖掉
        setTimeout(() => {
          foucsFlag.value = false;
        }, 100);
      } else {
        if (optionFlag.value) {
          options.value.open("bottom");
        } else if (emojiFlag.value) {
          popup.value.open("bottom");
        }
        keyboardHeight.value = parseInt(e.detail.height) * 2 - 25;
      }
      
    };

    //计算弹起高度
    const emitterChange = (val) => {
      // #ifdef APP-PLUS
      emitter.emit("changeWh", val + 120);
      // #endif
      // #ifdef H5
      emitter.emit("changeWh", val);
      // #endif
    };
    //表情弹出层
    const computedEmoji = () => {
      if (emojiFlag.value == false) {
        foucsFlag.value = false;
        emojiFlag.value = true;
        popup.value.open("bottom");
        keyboardHeight.value = 370
        emojiHeight.value = 370;
        emitterChange(300);
      } else {
        emojiFlag.value = false;
        keyboardHeight.value = 10;
        foucsFlag.value = true;
        popup.value.close();
        emojiHeight.value = 0;
        emitter.emit("changeWh", 100);
      }
    };
    //多功能弹出层
    const computedOptions = () => {
      optionFlag.value = !optionFlag.value;
      if (!optionFlag.value) {
        foucsFlag.value = false;
        keyboardHeight.value = 10;
        popup.value.close();
        emojiHeight.value = 0;
        emitter.emit("changeWh", 100);
        return;
      }
      popup.value.open("bottom");
      keyboardHeight.value = 240;
      emitterChange(keyboardHeight.value);
    };
    // 打开表情包弹出层
    const openPopup = (type: string) => {
      popupType.value = type;
      switch (type) {
        case "emoji":
          computedEmoji();
          break;
        case "keyboard":
          computedEmoji();
          break;
        case "option":
          computedOptions();
          break;
        default:
          break;
      }
      
    };
    const getFilePath = (path) => {
      console.log(path);

      let imageInfo = {
        type: 2,
        imageMsg: {
          src: path,
          title: "图片",
        },
      };
      emitSendMessage(imageInfo);
      wsSendMessage(imageInfo);
    };
    // 添加表情包
    const addEmoji = (emoji) => {
      newMessage.value += emoji;
    };

    // 改变语音标志
    const transForm = () => {
      isVoice.value = !isVoice.value;
    };

    /**
     * @description: 通过ws发送消息
     */
    const wsSendMessage = (msg) => {
      wsManager.sendChatMessage({
        type: "chat_message_send",
        body: {
          conversationId: props.conversationId,
          msg: msg,
        }
      });
      chatStore.updateRecentChatList({
        conversationId: props.conversationId,
        create_at: Date.now().toString(),
        avatar: userStore.userInfo.avatar,
        nickname: userStore.userInfo.nickName,
        msg_preview: parseChatPreview(msg),
        is_top: false
      });
    };
    /**
     * @description: 发送消息给content区域
     */
    const emitSendMessage = (msg) => {
      emit("sendMessage", {
        conversationId: props.conversationId,
        msg: msg,
        messageId: Date.now(),
        sender: {
          userId: userStore.userInfo.userId,
          avatar: userStore.userInfo.avatar,
        },
      });
    };
    const sendMessage = () => {
      let msgInfo = {
        type: 1,
        textMsg: {
          content: newMessage.value,
        },
      };
      emitSendMessage(msgInfo);
      wsSendMessage(msgInfo);
      newMessage.value = "";
    };

    /**
     * 语音功能
     * */
    //开始录音
    const startRecord = (e) => {
      starTime.value = Date.now();
      //console.log('开始录音');
      recorderManager.start();
      audioAni.value.open("center");
    };
    //录音结束
    const touchEnd = (e) => {
      recorderManager.stop();
      audioAni.value.close();
    };

    // 使用防抖函数包装inputChange
    const handleInput = debounce((e) => {
      newMessage.value = e.detail.value;
    }, 20);
    const handleMessage = (event) => {
      console.error('收到ws消息')
      if (!event.data) {
        return;
      }
      let msg = JSON.parse(event.data).content.data.body.msg;
      let objs = {
        conversationId: props.conversationId,
        msg: msg,
        messageId: Date.now(),
        sender: {
          userId: JSON.parse(event.data).content.data.body.sender.userId,
          avatar: JSON.parse(event.data).content.data.body.sender.avatar,
          nickname: JSON.parse(event.data).content.data.body.sender.nickname,
        },
      };
      emit("sendMessage", objs);
    };

    onMounted(() => {
      //接受ws消息
      wsManager.setMessageCallback(handleMessage);
    });
    return {
      sendMessage,
      transForm,
      isVoice,
      keyboardHeight,
      startRecord,
      touchEnd,
      sendFlag,
      newMessage,
      handleInput,
      openPopup,
      popup,
      emojiFlag,
      emoji,
      emojiHeight,
      addEmoji,
      getInputHeight,
      closeKeyBorder,
      popupType,
      getFilePath,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.uni-scroll-view-refresh-inner) {
  background-color: transparent;
  box-shadow: none;
}

.popul {
  position: fixed;
  left: 0;
  right: 0;
  border-top: 1rpx solid #eeeeee;
  font-family: STKaiti;
  padding: 15rpx 30rpx;
  background-color: #f2f2f2;

  .popul-input {
    display: flex;
    align-items: center;
    gap: 20rpx;

  }

  .size {
    font-size: 50rpx;
  }

  .bot-icon {
    width: 50rpx;
    height: 50rpx;
  }

  .input {
    padding: 15rpx;
    margin: 0 5rpx 0 7rpx;
    background-color: #fff;
    border-radius: 10rpx;
    width: 530rpx;
  }

  .second {
    margin: 0 8rpx 0 7rpx;
  }

  .btn {
    width: 120rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin-left: 10rpx;
    text-align: center;
    background-color: #1aa5fc;
    border-radius: 15rpx;
    color: #fff;
    z-index: 99;
    font-size: 25rpx;
  }
}

.more {
  padding-bottom: 20rpx;

  .optionItem {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 25rpx;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      width: 90rpx;
      height: 90rpx;
      border-radius: 20rpx;
      margin-bottom: 10rpx;

      .iconfont {
        font-size: 45rpx;
      }
    }
  }

  .optionItem:nth-child(n + 5) {
    margin-bottom: 40rpx;
  }
}

.audioBg {
  .bg {
    margin-top: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #55ffff;
    width: 400rpx;
    height: 150px;
    border-radius: 20rpx;

    .img {
      width: 50%;
      height: 50%;
    }
  }
}

.list {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border-top: 1rpx solid #d3d3d3;
  padding: 15rpx 20rpx;
  overflow-x: scroll;
  background-color: #f1f1f1;

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12.5%;
    height: 80rpx;
    font-size: 50rpx;
  }
}
</style>
