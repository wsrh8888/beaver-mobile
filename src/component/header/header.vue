<template>
  <view 
    class="page-header"
    :class="[`header-${mode}`, { 'header-fixed': fixed }]"
    :style="headerStyle"
  >
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- Header内容 -->
    <view class="header-content">
      <!-- 返回按钮 -->
      <view 
        v-if="showBack && leftIcon" 
        class="back-button"
        @click="handleBack"
      >
        <image :src="leftIcon" mode="aspectFit" class="back-icon" />
      </view>
      
      <!-- 自定义左侧内容 -->
      <view v-else-if="$slots.left" class="left-slot">
        <slot name="left"></slot>
      </view>
      
      <!-- 标题 -->
      <text v-if="title" class="header-title">{{ title }}</text>
      
      <!-- 自定义右侧内容 -->
      <view v-if="$slots.right" class="right-slot">
        <slot name="right"></slot>
      </view>
      
      <!-- 默认右侧图标 -->
      <view 
        v-else-if="rightIcon" 
        class="right-button"
        @click="handleRightClick"
      >
        <image :src="rightIcon" mode="aspectFit" class="right-icon" />
      </view>
      
      <!-- 占位符 -->
      <view v-else class="header-placeholder"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import arrowBackIcon from '@/static/img/common/arrow-back.svg';

export default {
  name: 'PageHeader',
  props: {
    mode: {
      type: String as () => 'fixed' | 'static' | 'transparent',
      default: 'fixed'
    },
    title: {
      type: String,
      default: ''
    },
    leftIcon: {
      type: String,
      default: arrowBackIcon
    },
    rightIcon: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    },
    background: {
      type: String,
      default: 'transparent'
    },
    fixed: {
      type: Boolean,
      default: true
    }
  },
  emits: ['back', 'right-click'],
  setup(props, { emit }) {
    const statusBarHeight = ref(0);
    
    // 获取状态栏高度
    const getStatusBarHeight = () => {
      try {
        const info = uni.getSystemInfoSync();
        statusBarHeight.value = info.statusBarHeight || 0;
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };
    
    // 计算 header 样式
    const headerStyle = computed(() => {
      const baseStyle: any = {
        backgroundColor: props.background
      };
      
      if (props.fixed) {
        baseStyle.position = 'fixed';
        baseStyle.left = '0';
        baseStyle.right = '0';
        baseStyle.top = '0';
        baseStyle.zIndex = '100';
      }
      
      return baseStyle;
    });
    
    // 事件处理
    const handleBack = () => {
      emit('back');
    };
    
    const handleRightClick = () => {
      emit('right-click');
    };
    
    // 初始化
    getStatusBarHeight();
    
    return {
      statusBarHeight,
      headerStyle,
      handleBack,
      handleRightClick
    };
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  transition: all 0.3s ease;
  
  /* 固定模式 */
  &.header-fixed {
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  
  /* 静态模式 */
  &.header-static {
    position: relative;
    margin-bottom: 16px;
  }
  
  /* 透明模式 */
  &.header-transparent {
    background: transparent !important;
    box-shadow: none;
  }
}

/* 状态栏占位 */
.status-bar {
  width: 100%;
}

/* Header内容区域 */
.header-content {
  height: 88rpx; /* 参考现有header.vue的高度 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  // border-bottom: 1px solid #ebebeb;
}

/* 返回按钮 */
.back-button {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 标题 */
.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
  flex: 1;
  margin: 0 30rpx;
}

/* 右侧按钮 */
.right-button {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

.right-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 插槽容器 */
.left-slot,
.right-slot {
  display: flex;
  align-items: center;
}

/* 占位符 */
.header-placeholder {
  width: 40rpx;
}
</style> 