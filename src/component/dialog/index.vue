<template>
  <view class="dialog-overlay" :class="{ active: visible }" @click="handleOverlayClick">
    <view class="dialog-container" :class="[`dialog-${type}`, `dialog-${size}`]" @click.stop>
      <!-- 图标区域 -->
      <view v-if="icon" class="dialog-icon">
        <image :src="icon" mode="aspectFit" class="icon-img" />
      </view>
      
      <!-- 标题 -->
      <text v-if="title" class="dialog-title">{{ title }}</text>
      
      <!-- 内容 -->
      <text v-if="content" class="dialog-content">{{ content }}</text>
      
      <!-- 自定义内容插槽 -->
      <view v-if="$slots.default" class="dialog-custom-content">
        <slot></slot>
      </view>
      
      <!-- 按钮区域 -->
      <view v-if="showButtons" class="dialog-buttons" :class="buttonLayout">
        <view 
          v-if="showCancel" 
          class="dialog-button cancel" 
          @click="handleCancel"
        >
          {{ cancelText }}
        </view>
        <view 
          class="dialog-button confirm" 
          @click="handleConfirm"
        >
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, watch } from 'vue';

export default {
  name: 'BeaverDialog',
  props: {
    // 显示状态
    modelValue: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 内容
    content: {
      type: String,
      default: ''
    },
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 对话框类型
    type: {
      type: String,
      default: 'default', // default, success, warning, error
      validator: (value: string) => ['default', 'success', 'warning', 'error'].includes(value)
    },
    // 对话框大小
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    // 是否显示按钮
    showButtons: {
      type: Boolean,
      default: true
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: true
    },
    // 取消按钮文本
    cancelText: {
      type: String,
      default: '取消'
    },
    // 确认按钮文本
    confirmText: {
      type: String,
      default: '确定'
    },
    // 按钮布局
    buttonLayout: {
      type: String,
      default: 'horizontal', // horizontal, vertical
      validator: (value: string) => ['horizontal', 'vertical'].includes(value)
    },
    // 点击遮罩是否关闭
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  setup(props: any, { emit }: any) {
    const visible = ref(props.modelValue);

    // 监听modelValue变化
    watch(() => props.modelValue, (newVal) => {
      visible.value = newVal;
    });

    // 监听visible变化
    watch(visible, (newVal) => {
      emit('update:modelValue', newVal);
    });

    // 处理确认
    const handleConfirm = () => {
      visible.value = false;
      emit('confirm');
    };

    // 处理取消
    const handleCancel = () => {
      visible.value = false;
      emit('cancel');
    };

    // 处理遮罩点击
    const handleOverlayClick = () => {
      if (props.maskClosable) {
        visible.value = false;
        emit('cancel');
      }
    };

    return {
      visible,
      handleConfirm,
      handleCancel,
      handleOverlayClick
    };
  }
}
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.dialog-container {
  background-color: #FFFFFF;
  width: 70%;
  max-width: 560rpx;
  border-radius: 40rpx;
  padding: 48rpx;
  box-shadow: 0 8rpx 48rpx rgba(0, 0, 0, 0.12);
  transform: translateY(40rpx);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dialog-overlay.active .dialog-container {
  transform: translateY(0);
}

// 尺寸变体
.dialog-small {
  width: 480rpx;
  max-width: 480rpx;
  padding: 40rpx;
}

.dialog-medium {
  width: 560rpx;
  max-width: 560rpx;
  padding: 48rpx;
}

.dialog-large {
  width: 640rpx;
  max-width: 640rpx;
  padding: 56rpx;
}

// 类型变体
.dialog-success .dialog-icon {
  color: #00B894;
}

.dialog-warning .dialog-icon {
  color: #FDCB6E;
}

.dialog-error .dialog-icon {
  color: #FF5252;
}

.dialog-icon {
  margin-bottom: 32rpx;
  
  .icon-img {
    width: 96rpx;
    height: 96rpx;
  }
}

.dialog-title {
  color: #2D3436;
  font-size: 36rpx;
  font-weight: 500;
  margin-bottom: 32rpx;
  text-align: center;
  display: block;
}

.dialog-content {
  color: #636E72;
  margin-bottom: 48rpx;
  text-align: center;
  line-height: 1.5;
  display: block;
}

.dialog-custom-content {
  width: 100%;
  margin-bottom: 48rpx;
}

.dialog-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;

  &.horizontal {
    flex-direction: row;
  }

  &.vertical {
    flex-direction: column;
  }
}

.dialog-button {
  flex: 1;
  height: 80rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &.cancel {
    background-color: #F9FAFB;
    color: #636E72;
    margin-right: 24rpx;
  }

  &.confirm {
    background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
    color: #FFFFFF;
    box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.15);
    background-size: 200% auto;
  }

  &:active {
    transform: translateY(2rpx);
  }
}

// 垂直布局时的按钮样式调整
.dialog-buttons.vertical .dialog-button {
  width: 100%;
  margin-right: 0;
  margin-bottom: 16rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}
</style> 