<template>
  <view 
    class="beaver-button" 
    :class="[
      `button-${type}`,
      `button-${size}`,
      `button-${shape}`,
      {
        'button-loading': loading,
        'button-disabled': disabled,
        'button-block': block
      }
    ]"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <view v-if="loading" class="button-loading-icon">
      <view class="loading-spinner"></view>
    </view>
    
    <!-- 图标 -->
    <view v-else-if="icon" class="button-icon">
      <image :src="icon" mode="aspectFit" class="icon-img" />
    </view>
    
    <!-- 文本内容 -->
    <text v-if="$slots.default || text" class="button-text">
      <slot>{{ text }}</slot>
    </text>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BeaverButton',
  props: {
    // 按钮类型
    type: {
      type: String,
      default: 'primary', // primary, secondary, outline, text, danger
      validator: (value: string) => ['primary', 'secondary', 'outline', 'text', 'danger'].includes(value)
    },
    // 按钮尺寸
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    // 按钮形状
    shape: {
      type: String,
      default: 'rounded', // rounded, square, circle
      validator: (value: string) => ['rounded', 'square', 'circle'].includes(value)
    },
    // 按钮文本
    text: {
      type: String,
      default: ''
    },
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 是否块级元素
    block: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event: Event) => {
      if (props.disabled || props.loading) {
        return;
      }
      emit('click', event);
    };

    return {
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
.beaver-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);
  position: relative;
  font-family: inherit;
  text-decoration: none;
  user-select: none;
  outline: none;

  &:active {
    transform: translateY(1px);
  }

  &.button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:active {
      transform: none;
    }
  }

  &.button-block {
    width: 100%;
  }
}

// 尺寸变体
.button-small {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  border-radius: 8px;
  
  .button-icon {
    margin-right: 4px;
    
    .icon-img {
      width: 14px;
      height: 14px;
    }
  }
}

.button-medium {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 12px;
  
  .button-icon {
    margin-right: 6px;
    
    .icon-img {
      width: 16px;
      height: 16px;
    }
  }
}

.button-large {
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
  border-radius: 14px;
  
  .button-icon {
    margin-right: 8px;
    
    .icon-img {
      width: 18px;
      height: 18px;
    }
  }
}

// 形状变体
.button-square {
  border-radius: 4px;
}

.button-circle {
  border-radius: 50%;
  padding: 0;
  
  &.button-small {
    width: 32px;
    height: 32px;
  }
  
  &.button-medium {
    width: 40px;
    height: 40px;
  }
  
  &.button-large {
    width: 48px;
    height: 48px;
  }
}

// 类型变体
.button-primary {
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(255, 125, 69, 0.15);
  
  &:hover:not(.button-disabled) {
    box-shadow: 0 6px 16px rgba(255, 125, 69, 0.2);
  }
  
  &:active:not(.button-disabled) {
    box-shadow: 0 2px 8px rgba(255, 125, 69, 0.1);
  }
}

.button-secondary {
  background-color: #F9FAFB;
  color: #636E72;
  border: 1px solid #EBEEF5;
  
  &:hover:not(.button-disabled) {
    background-color: #F1F3F4;
  }
}

.button-outline {
  background-color: transparent;
  color: #FF7D45;
  border: 1px solid #FF7D45;
  
  &:hover:not(.button-disabled) {
    background-color: rgba(255, 125, 69, 0.05);
  }
}

.button-text {
  background-color: transparent;
  color: #FF7D45;
  padding-left: 8px;
  padding-right: 8px;
  
  &:hover:not(.button-disabled) {
    background-color: rgba(255, 125, 69, 0.05);
  }
}

.button-danger {
  background: linear-gradient(135deg, #FF5252 0%, #E53935 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(255, 82, 82, 0.15);
  
  &:hover:not(.button-disabled) {
    box-shadow: 0 6px 16px rgba(255, 82, 82, 0.2);
  }
  
  &:active:not(.button-disabled) {
    box-shadow: 0 2px 8px rgba(255, 82, 82, 0.1);
  }
}

// 加载状态
.button-loading {
  pointer-events: none;
  
  .button-loading-icon {
    margin-right: 6px;
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 文本样式
.button-text {
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

// 图标样式
.button-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 