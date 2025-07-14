<template>
  <view class="toast-container" :class="[`toast-${type}`, `toast-${position}`, { active: visible }]">
    <view class="toast-content">
      <!-- 图标 -->
      <view v-if="icon" class="toast-icon">
        <image :src="icon" mode="aspectFit" class="icon-img" />
      </view>
      
      <!-- 文本内容 -->
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'BeaverToast',
  props: {
    // 显示状态
    modelValue: {
      type: Boolean,
      default: false
    },
    // 消息内容
    message: {
      type: String,
      default: ''
    },
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // Toast类型
    type: {
      type: String,
      default: 'default', // default, success, warning, error
      validator: (value: string) => ['default', 'success', 'warning', 'error'].includes(value)
    },
    // 显示位置
    position: {
      type: String,
      default: 'center', // top, center, bottom
      validator: (value: string) => ['top', 'center', 'bottom'].includes(value)
    },
    // 显示时长（毫秒）
    duration: {
      type: Number,
      default: 3000
    },
    // 是否可手动关闭
    closable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue);
    let timer: number | null = null;

    // 监听modelValue变化
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        show();
      } else {
        hide();
      }
    });

    // 监听visible变化
    watch(visible, (newVal) => {
      emit('update:modelValue', newVal);
    });

    // 显示Toast
    const show = () => {
      visible.value = true;
      
      // 自动隐藏
      if (props.duration > 0) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          hide();
        }, props.duration);
      }
    };

    // 隐藏Toast
    const hide = () => {
      visible.value = false;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // 手动关闭
    const close = () => {
      if (props.closable) {
        hide();
      }
    };

    onMounted(() => {
      if (props.modelValue) {
        show();
      }
    });

    onBeforeUnmount(() => {
      if (timer) {
        clearTimeout(timer);
      }
    });

    return {
      visible,
      show,
      hide,
      close
    };
  }
});
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
}

// 位置变体
.toast-top {
  top: 100px;
}

.toast-center {
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  
  &.active {
    transform: translateX(-50%) translateY(-50%);
  }
}

.toast-bottom {
  bottom: 100px;
  transform: translateX(-50%) translateY(100%);
  
  &.active {
    transform: translateX(-50%) translateY(0);
  }
}

.toast-content {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

// 类型变体
.toast-success .toast-content {
  background-color: rgba(0, 184, 148, 0.9);
}

.toast-warning .toast-content {
  background-color: rgba(253, 203, 110, 0.9);
}

.toast-error .toast-content {
  background-color: rgba(255, 82, 82, 0.9);
}

.toast-icon {
  flex-shrink: 0;
  
  .icon-img {
    width: 20px;
    height: 20px;
  }
}

.toast-text {
  color: #FFFFFF;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  flex: 1;
  word-break: break-word;
}

// 成功类型的文字颜色
.toast-success .toast-text {
  color: #FFFFFF;
}

// 警告类型的文字颜色
.toast-warning .toast-text {
  color: #2D3436;
}

// 错误类型的文字颜色
.toast-error .toast-text {
  color: #FFFFFF;
}
</style> 