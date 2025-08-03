<template>
  <view class="page-layout">
    <!-- 背景装饰层 -->
    <view v-if="showBackground" class="background-layer" :class="backgroundType" :style="{
      height: backgroundHeight + 'rpx',
      pointerEvents: 'none'
    }"></view>
  
    <!-- Header 组件 -->
    <PageHeader v-if="showHeader" :mode="headerMode" :title="title" :left-icon="leftIcon" :right-icon="rightIcon"
      :show-back="showBack" :background="headerBackground" @back="handleGoBack">
      <template #left v-if="$slots.left">
        <slot name="left"></slot>
      </template>
      <template #right v-if="$slots.right">
        <slot name="right"></slot>
      </template>
    </PageHeader>

    <!-- 前置内容区域 -->
    <view v-if="$slots.before" class="before-content" :style="beforeContentStyle">
      <slot name="before"></slot>
    </view>

    <!-- 内容区域 -->
    <view class="content-wrapper" >

      <!-- 滚动内容 -->
      <scroll-view class="scroll-content" scroll-y="true" scroll-x="false"
        scroll-top="0" scroll-left="0" scroll-into-view=""
        scroll-with-animation="true" enable-back-to-top="true"
        show-scrollbar="false" :style="scrollContentStyle">
        <slot></slot>
      </scroll-view>
    </view>

    <!-- 后置内容区域 -->
    <view v-if="$slots.after" class="after-content" :style="afterContentStyle">
      <slot name="after"></slot>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import PageHeader from '../header/header.vue';
import arrowBackIcon from '@/static/img/common/arrow-back.svg';

export interface PageLayoutProps {
  // Header 相关
  showHeader?: boolean;
  headerMode?: 'fixed' | 'static' | 'transparent';
  title?: string;
  leftIcon?: string;
  rightIcon?: string;
  showBack?: boolean;
  headerBackground?: string;

  // 背景相关
  showBackground?: boolean;
  backgroundType?: 'gradient' | 'solid' | 'none';
  backgroundHeight?: number; // rpx

  // 高度配置 (rpx)
  beforeHeight?: number;
  afterHeight?: number;
}

export default {
  name: 'BeaverLayout',
  components: {
    PageHeader
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    headerMode: {
      type: String as () => 'fixed' | 'static' | 'transparent',
      default: 'static'
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
    headerBackground: {
      type: String,
      default: 'transparent'
    },
    showBackground: {
      type: Boolean,
      default: false
    },
    backgroundType: {
      type: String as () => 'gradient' | 'solid' | 'none',
      default: 'gradient'
    },
    backgroundHeight: {
      type: Number,
      default: 240 // 120px -> 240rpx
    },
    beforeHeight: {
      type: Number,
      default: 0
    },
    afterHeight: {
      type: Number,
      default: 0
    }
  },
  emits: ['back'],
  setup(props, { emit, slots }) {
    const statusBarHeight = ref(0);
    const HEADER_CONTENT_HEIGHT = 88; // rpx，对应 PageHeader 组件中的 .header-content 高度

    // 获取系统信息
    const getSystemInfo = () => {
      try {
        const info = uni.getSystemInfoSync();
        const pxToRpxRatio = 750 / info.windowWidth; // 750rpx = windowWidth px
        statusBarHeight.value = (info.statusBarHeight || 0) * pxToRpxRatio; // px -> rpx
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };

    // 前置内容样式
    const beforeContentStyle = computed(() => {
      return {
        height: props.beforeHeight + 'rpx'
      };
    });

    // 后置内容样式
    const afterContentStyle = computed(() => {
      return {
        height: props.afterHeight + 'rpx'
      };
    });

    // 滚动内容样式
    const scrollContentStyle = computed(() => {
      const beforeHeight = props.beforeHeight; // rpx
      const afterHeight = props.afterHeight; // rpx
      const systemInfo = uni.getSystemInfoSync();
      
      // 使用更精确的单位换算
      const pxToRpxRatio = 750 / systemInfo.windowWidth; // 750rpx = windowWidth px
      const screenHeight = systemInfo.windowHeight * pxToRpxRatio; // px -> rpx
      const safeAreaBottom = (systemInfo.safeAreaInsets?.bottom || 0) * pxToRpxRatio; // px -> rpx
      
      let contentHeight;
      if (props.showHeader) {
        // 显示header时，只需要减去header内容高度，因为windowHeight已经包含了状态栏
        contentHeight = screenHeight - HEADER_CONTENT_HEIGHT - beforeHeight - afterHeight - safeAreaBottom - statusBarHeight.value;
      } else {
        // 不显示header时，不需要减去状态栏高度，因为windowHeight已经包含了
        contentHeight = screenHeight - beforeHeight - afterHeight - safeAreaBottom;
      }
      
      console.log('计算详情:', {
        screenHeight,
        windowHeight: systemInfo.windowHeight,
        windowWidth: systemInfo.windowWidth,
        pxToRpxRatio,
        statusBarHeight: statusBarHeight.value,
        safeAreaBottom,
        headerHeight: HEADER_CONTENT_HEIGHT,
        beforeHeight,
        afterHeight,
        contentHeight,
        totalSubtracted: props.showHeader ? 
          HEADER_CONTENT_HEIGHT + beforeHeight + afterHeight + safeAreaBottom :
          beforeHeight + afterHeight + safeAreaBottom
      });

      return {
        height: contentHeight + 'rpx'
      };
    });


    // 处理返回事件
    const handleGoBack = () => {
      emit('back');
    };

    // 初始化
    getSystemInfo();

    return {
      statusBarHeight,
      beforeContentStyle,
      afterContentStyle,
      scrollContentStyle,
      handleGoBack
    };
  }
};
</script>

<style lang="scss" scoped>
.page-layout {
  height: 100vh;
  position: relative;
  background-color: #F9FAFB;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 背景装饰层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
  pointer-events: none;

  &.gradient {
    background: linear-gradient(180deg, rgba(255, 125, 69, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  }

  &.solid {
    background-color: #F8F9FA;
  }
}

/* 状态栏占位 */
.status-bar-placeholder {
  width: 100%;
  background-color: transparent;
  flex-shrink: 0;
  z-index: 1;
}

/* 前置内容区域 */
.before-content {
  flex-shrink: 0;
}

/* 后置内容区域 */
.after-content {
  flex-shrink: 0;
}

/* 内容包装器 */
.content-wrapper {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* 滚动内容 */
.scroll-content {
  width: 100%;
  box-sizing: border-box;
}
</style>