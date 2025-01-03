<template>
  <view>
    <view class="status_bar"></view>

    <view class="header__content" :style="{ backgroundColor: backgroundColor }">
      <view v-if="!hideLeft" class="left">
        <slot name="left-content">
          <image v-if="!hideLeft" src="@/static/img/common/goBack.svg" @click="handleClickGoBack" class="goBack" />
        </slot>
      </view>
      <view class="center">{{ title }}</view>
      <view class="right">
        <slot name="right-content"></slot>
      </view>
    </view>

  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true
    },
    hideLeft: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },
  methods: {
    handleClickGoBack() {
      this.$emit('go-back');
    }
  }
});
</script>

<style scoped lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}

.header__content {
  height: 88rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;

  .left {
    position: absolute;
    left: 30rpx;

    .goBack {
      width: 40rpx;
      height: 40rpx;
      overflow: hidden;
    }
  }

  .center {
    width: 100%;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
  }

  .right {
    position: absolute;
    right: 30rpx;

    .add_image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}
</style>
