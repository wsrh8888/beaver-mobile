<template>
  <view class="page-layout">
    <!-- 背景装饰层 -->
    <view 
      v-if="showBackground" 
      class="background-layer"
      :class="backgroundType"
      :style="{ 
        height: backgroundHeight + 'px',
        pointerEvents: 'none'
      }"
    ></view>
    
    <!-- Header 组件 -->
    <PageHeader
      v-if="showHeader"
      :mode="headerMode"
      :title="title"
      :left-icon="leftIcon"
      :right-icon="rightIcon"
      :show-back="showBack"
      :background="headerBackground"
      :fixed="headerFixed"
      @back="handleBack"
      @right-click="handleRightClick"
    >
      <template #left v-if="$slots.left">
        <slot name="left"></slot>
      </template>
      <template #right v-if="$slots.right">
        <slot name="right"></slot>
      </template>
    </PageHeader>

    <!-- 前置内容区域（如搜索栏、筛选器等） -->
    <view 
      v-if="$slots.before"
      class="before-content"
      :style="beforeContentStyle"
    >
      <slot name="before"></slot>
    </view>

    <!-- 内容区域 -->
    <view 
      class="content-wrapper"
      :class="contentClass"
      :style="contentStyle"
    >
      <!-- 滚动内容 -->
      <scroll-view
        v-if="scrollable"
        class="scroll-content"
        :style="scrollStyle"
        :scroll-y="scrollY"
        :scroll-x="scrollX"
        :scroll-top="scrollTop"
        :scroll-left="scrollLeft"
        :scroll-into-view="scrollIntoView"
        :scroll-with-animation="scrollWithAnimation"
        :enable-back-to-top="enableBackToTop"
        :show-scrollbar="showScrollbar"
        @scroll="handleScroll"
        @scrolltolower="handleScrollToLower"
        @scrolltoupper="handleScrollToUpper"
      >
        <slot></slot>
      </scroll-view>
      
      <!-- 非滚动内容 -->
      <view v-else class="static-content">
        <slot></slot>
      </view>
    </view>

    <!-- 后置内容区域（如底部操作栏、工具栏等） -->
    <view 
      v-if="$slots.after"
      class="after-content"
      :style="afterContentStyle"
    >
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
  headerFixed?: boolean;
  
  // 背景相关
  showBackground?: boolean;
  backgroundType?: 'gradient' | 'solid' | 'none';
  backgroundHeight?: number;
  
  // 内容区域相关
  scrollable?: boolean;
  scrollY?: boolean;
  scrollX?: boolean;
  scrollTop?: number;
  scrollLeft?: number;
  scrollIntoView?: string;
  scrollWithAnimation?: boolean;
  enableBackToTop?: boolean;
  showScrollbar?: boolean;
  
  // 自定义样式
  contentClass?: string;
  customHeaderHeight?: number;
  customBeforeHeight?: number;
  customAfterHeight?: number;
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
    headerBackground: {
      type: String,
      default: 'transparent'
    },
    headerFixed: {
      type: Boolean,
      default: true
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
      default: 120
    },
    scrollable: {
      type: Boolean,
      default: true
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    scrollLeft: {
      type: Number,
      default: 0
    },
    scrollIntoView: {
      type: String,
      default: ''
    },
    scrollWithAnimation: {
      type: Boolean,
      default: true
    },
    enableBackToTop: {
      type: Boolean,
      default: true
    },
    showScrollbar: {
      type: Boolean,
      default: true
    },
    contentClass: {
      type: String,
      default: ''
    },
    customHeaderHeight: {
      type: Number,
      default: 0
    },
    customBeforeHeight: {
      type: Number,
      default: 0
    },
    customAfterHeight: {
      type: Number,
      default: 0
    }
  },
  emits: ['back', 'right-click', 'scroll', 'scroll-to-lower', 'scroll-to-upper'],
  setup(props, { emit, slots }) {
    const statusBarHeight = ref(0);
    const headerHeight = ref(44); // 默认 header 高度
    const systemInfo = ref<any>({});

    // 获取系统信息
    const getSystemInfo = () => {
      try {
        const info = uni.getSystemInfoSync();
        statusBarHeight.value = info.statusBarHeight || 0;
        systemInfo.value = info;
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };

    // 计算 header 总高度
    const totalHeaderHeight = computed(() => {
      if (!props.showHeader) return 0;
      if (props.headerMode === 'static') return 0;
      return statusBarHeight.value + (props.customHeaderHeight || headerHeight.value);
    });

    // 计算前置内容高度
    const beforeContentHeight = computed(() => {
      return props.customBeforeHeight || 0;
    });

    // 计算后置内容高度
    const afterContentHeight = computed(() => {
      return props.customAfterHeight || 0;
    });

    // 计算前置内容样式
    const beforeContentStyle = computed(() => {
      if (!slots.before) return {};
      
      return {
        top: totalHeaderHeight.value + 'px',
        position: 'fixed' as const,
        left: '0',
        right: '0',
        zIndex: '2',
        backgroundColor: '#FFFFFF'
      };
    });

    // 计算后置内容样式
    const afterContentStyle = computed(() => {
      if (!slots.after) return {};
      
      return {
        bottom: '0',
        position: 'fixed' as const,
        left: '0',
        right: '0',
        zIndex: '2',
        backgroundColor: '#FFFFFF'
      };
    });

    // 计算滚动区域样式
    const scrollStyle = computed(() => {
      if (!props.scrollable) return {};
      
      const top = totalHeaderHeight.value + beforeContentHeight.value;
      const bottom = afterContentHeight.value;
      const height = `calc(100vh - ${top}px${bottom ? ` - ${bottom}px` : ''})`;
      
      return {
        top: top + 'px',
        height,
        position: 'fixed' as const,
        left: '0',
        right: '0',
        zIndex: '1'
      };
    });

    // 计算内容区域样式
    const contentStyle = computed(() => {
      if (props.headerMode === 'static') {
        return {
          paddingTop: totalHeaderHeight.value + beforeContentHeight.value + 'px',
          paddingBottom: afterContentHeight.value + 'px'
        };
      }
      return {};
    });

    // 事件处理
    const handleBack = () => {
      emit('back');
    };

    const handleRightClick = () => {
      emit('right-click');
    };

    const handleScroll = (e: any) => {
      emit('scroll', e);
    };

    const handleScrollToLower = (e: any) => {
      emit('scroll-to-lower', e);
    };

    const handleScrollToUpper = (e: any) => {
      emit('scroll-to-upper', e);
    };

    // 初始化时获取系统信息
    getSystemInfo();

    return {
      totalHeaderHeight,
      beforeContentHeight,
      afterContentHeight,
      scrollStyle,
      contentStyle,
      beforeContentStyle,
      afterContentStyle,
      handleBack,
      handleRightClick,
      handleScroll,
      handleScrollToLower,
      handleScrollToUpper
    };
  }
};
</script>

<style lang="scss" scoped>
.page-layout {
  min-height: 100vh;
  position: relative;
  background-color: #F9FAFB;
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
    background: linear-gradient(180deg, rgba(255,125,69,0.1) 0%, rgba(255,255,255,0) 100%);
  }
  
  &.solid {
    background-color: #F8F9FA;
  }
}

/* 前置内容区域 */
.before-content {
  background-color: #FFFFFF;
  border-bottom: 1px solid #EBEEF5;
}

/* 后置内容区域 */
.after-content {
  background-color: #FFFFFF;
  border-top: 1px solid #EBEEF5;
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* 滚动内容 */
.scroll-content {
  background-color: transparent;
}

/* 静态内容 */
.static-content {
  min-height: 100vh;
}
</style> 