<template>
  <view class="empty-state">
    <image src="@/static/img/groupMember/empty.svg" mode="aspectFit" />
    <view class="empty-title">{{ title }}</view>
    <view class="empty-desc">{{ description }}</view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.empty-state {
  padding: 96rpx 32rpx;
  text-align: center;

  image {
    width: 160rpx;
    height: 160rpx;
    color: #EBEEF5;
    margin-bottom: 48rpx;
  }
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #636E72;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #B2BEC3;
  max-width: 480rpx;
  margin: 0 auto;
  line-height: 1.5;
}
</style> 