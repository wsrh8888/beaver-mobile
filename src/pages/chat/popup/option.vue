<template>
  <view class="option-popup">
    <view class="menu-grid">
      <view 
        v-for="(item, index) in menuItems" 
        :key="index"
        class="menu-item"
        @tap="handleAction(item.action)"
      >
        <view class="menu-icon">
          <image 
            :src="item.icon" 
            mode="aspectFit"
          />
        </view>
        <text class="menu-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { openAlbum } from './func';

interface MenuItem {
  icon: string;
  label: string;
  action: string;
}

export default defineComponent({
  props: {
    keyboardHeight: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const menuItems: MenuItem[] = [
      {
        icon: '/static/img/chat/photo.svg',
        label: '图片',
        action: 'image'
      },
      {
        icon: '/static/img/chat/camera.svg',
        label: '拍照',
        action: 'camera'
      },
      {
        icon: '/static/img/chat/vedio.svg',
        label: '视频通话',
        action: 'video'
      },
      {
        icon: '/static/img/chat/phone.svg',
        label: '语音通话',
        action: 'voice'
      }
    ];

    const handleAction = async (action: string) => {
      switch (action) {
        case 'image':
          try {
            const imageUrl = await openAlbum('album');
            console.error('234234', imageUrl)
            emit('getFilePath', imageUrl);
          } catch (err) {
            console.error('Failed to upload image:', err);
            uni.showToast({
              title: '上传图片失败',
              icon: 'none'
            });
          }
          break;
        case 'camera':
          try {
            const imageUrl = await openAlbum('camera');
            emit('getFilePath', imageUrl);
          } catch (err) {
            console.error('Failed to upload image:', err);
            uni.showToast({
              title: '上传图片失败',
              icon: 'none'
            });
          }
          break;
        case 'video':
          uni.showToast({
            title: '发起视频通话',
            icon: 'none'
          });
          break;
        case 'voice':
          uni.showToast({
            title: '发起语音通话',
            icon: 'none'
          });
          break;
      }
    };

    return {
      menuItems,
      handleAction
    };
  }
});
</script>

<style lang="scss" scoped>
.option-popup {
  background: #FFFFFF;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
  padding: 32rpx 24rpx;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  padding: 4rpx;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.menu-icon {
  width: 100rpx;
  height: 100rpx;
  background: #F5F5F5;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:active {
    background: #EEEEEE;
    transform: scale(0.95);
  }
  
  image {
    width: 48rpx;
    height: 48rpx;
    opacity: 0.85;
  }
}

.menu-label {
  font-size: 24rpx;
  color: #666666;
}
</style>

