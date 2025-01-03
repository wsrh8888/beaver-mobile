<template>
  <view class="menus__content">

    <text class="iconfont size" @click="openPopup">
      <slot @click="openPopup"></slot>
    </text>
    <view v-if="isShow" class="overlay" @click="openPopup"></view>
    <view class="header_downup" :animation="animationData" :style="{ top: top, right: right }">
      <view class="wrap">
        <view v-for="(item, index) in menuOptions" :key="index" class="downup_item" @click="handleMenuOptionClick(item)">
          <image :src="item.icon" class="image" />
          <text>{{ item.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface IMenuOption {
  title: string;
  icon: string;
  id: number;
}

export default defineComponent({
  emits: ['change'],
  props: {
    top: {
      type: String,
      required: true,
    },
    right: {
      type: String,
      required: true,
      default: '0',
    },
    menuWidth: {
      type: String,
      required: true,
      default: '300rpx',
    },
    menuOptions: {
      type: Array<IMenuOption>,
      required: true,
      default: () => [
        { title: '创建群聊', icon: '&#xe616;', id: 1 },
        { title: '创建小组', icon: '&#xe605;', id: 2 },
        { title: '扫一扫', icon: '&#xe8b5;', id: 3 },
      ],
    },
  },
  setup(props, { emit }) {
    const animationData = ref({}); //响应动画数据
    const animation = ref<UniNamespace.Animation>(); //创建动画对象
    const isShow = ref(false); //判断下拉框

    const openPopup = () => {
      if (!animation.value) {
        animation.value = uni.createAnimation({
          duration: 200,
          transformOrigin: 'top right',
          timingFunction: 'ease',
        });
      }
      const animationValue = animation.value;
      const height = `${props.menuOptions.length * 100}rpx`; // 具体计算方法可根据实际情况调整
      if (isShow.value) {
        animationValue.opacity(0).width(0).height(0).step();
        isShow.value = false;
      } else {
        animationValue.opacity(1).width(props.menuWidth).height(height).step();
        isShow.value = true;
      }
      animationData.value = animationValue.export();
    };

    const handleMenuOptionClick = (item: any) => {
      emit('change', item);
      openPopup(); // 点击菜单项时关闭弹出菜单
    };

    const router = useRouter();

    const handleRouteChange = () => {
      if (isShow.value) {
        openPopup(); // 强制关闭蒙层和弹出菜单
      }
    };

    onMounted(() => {
      router.afterEach(handleRouteChange); // 监听路由变化
    });

    onUnmounted(() => {
      router.afterEach(handleRouteChange); // 移除监听器
    });

    return {
      animationData,
      openPopup,
      handleMenuOptionClick,
      isShow,
    };
  },
});
</script>

<style scoped lang="scss">
.menus__content {
  position: relative;
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; // 确保在下拉菜单之下
  }
  .iconfont {
    image {
      width: 50rpx;
      height: 50rpx;
    }
  }
  .header_downup {
    position: absolute;
    z-index: 1000;
    background-color: #fff;
    text-align: left;
    padding-left: 40rpx;
    box-sizing: border-box;
    background-color: rgba(76, 76, 76);
    width: 0;
    height: 0;
    opacity: 0;
    border-radius: 20rpx;
    box-shadow: 10rpx 10rpx 40rpx #ccc;
    overflow: hidden;

    .wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .downup_item {
      display: flex;
      align-items: center;
      font-family: '华文楷体';
      font-size: 32rpx;
      font-weight: normal;
      color: #fff;
      text-overflow: ellipsis;
      white-space: nowrap;
      .image {
        width: 50rpx;
        height: 50rpx;
        margin-right: 20rpx;
      }
      view {
        font-size: 42rpx;
      }

      text {
        margin-left: 10rpx;
      }
    }
  }
}
</style>
