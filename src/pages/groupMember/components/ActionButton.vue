<template>
  <view 
    class="action-button" 
    :class="[
      buttonType,
      { 'no-selection': disabled }
    ]"
    @click="$emit('click')"
  >
    {{ text }}
  </view>
</template>

<script lang="ts">
export default {
  name: 'ActionButton',
  props: {
    text: {
      type: String,
      required: true
    },
    buttonType: {
      type: String as () => 'confirm-add' | 'confirm-remove',
      default: 'confirm-add'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
};
</script>

<style lang="scss" scoped>
.action-button {
  width: 100%;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);

  &:active {
    transform: translateY(2rpx);
  }

  &.confirm-add {
    background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(255, 125, 69, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    }
  }

  &.confirm-remove {
    background: #FF5252;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(255, 82, 82, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    }
  }

  &.no-selection {
    background: #EBEEF5;
    color: #B2BEC3;
    pointer-events: none;
  }
}
</style> 