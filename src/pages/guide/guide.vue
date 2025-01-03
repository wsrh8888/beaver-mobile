<template>
  <view class="guide__content">
    <view class="guide__bg">
      <image src="@/static/img/bg.jpg" class="logo" />
    </view>
    <view class="guide__btn">
      <view class="btn register" @click="goNavigate('/pages/register/register')">注册</view>
      <view class="btn login" @click="goNavigate('/pages/login/login')">登录</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  setup() {
    const goNavigate = (path: string) =>{
      uni.navigateTo({
        url: path,
        animationType: 'pop-in',
        animationDuration: 200
      });
    }
    return {
      goNavigate
    };
  }
});
</script>

<style lang="scss" scoped>
.guide__content {
  width: 100%;
  height: 100%;
  position: relative;
  .guide__bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    .logo {
      width: 100%;
      height: 100%;
    }

  }
  .guide__btn {
    position: absolute;
    bottom: 265rpx;
    display: flex;
    justify-content: center;
    font-size: 32rpx;
    width: 100%;
    // transform: translateX(50%);

    .btn {
      width: 322rpx;
      height: 86rpx;
      align-items: center;
      justify-content: center;
      text-align: center;
      display: flex;
      border-radius: 40rpx;
      margin: 0 10rpx;
      &.register {
        color: #000;
        background: #f7f7f7;
      }
      &.login {
        color: #fff;
        background: #5f87f6;
      }
    }
  }
}
</style>
