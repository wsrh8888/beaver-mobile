<template>
  <view class="qrcode__content">
    <HeaderComponent class="header" title="我的二维码" @goBack="goBack"></HeaderComponent>
    <uv-qrcode ref="qrcode" :loading="false" size="345px" :value="qrValue" :options="options"></uv-qrcode>
    <view class="save_qrcode" @click="handleSaveQrcode">保存到手机</view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref, nextTick, getCurrentInstance } from 'vue';
import HeaderComponent from "@/component/header/header.vue";
import { useUserStore } from '@/pinia/user/user';

// 定义二维码要包含的内容对象

export default defineComponent({
  components: {
    HeaderComponent
  },
  setup() {
    const useStore = useUserStore();
    const userInfo = computed(() => useStore.userInfo);
    const qrContent = {
      path: "",
      query: "id= "
    };

    const goBack = () => {
      uni.navigateBack();
    };
    const options = ref({
      foregroundImageSrc: userInfo.value.avatar,
      margin: 30,
    });

    // 将对象转换为JSON字符串作为二维码值
    const qrValue = ref(JSON.stringify({
      type: "addFriend",
      query: `id=${userInfo.value.userId}`,
      name: "beaver"
    }));

    const qrCanvasId = ref("qrcode-canvas");

    const handleSaveQrcode = async () => {
      try {
        // Get the reference of the QR code component
        const qrCodeComponent = getCurrentInstance()?.refs.qrcode;
        const canvasId = qrCodeComponent?.canvasId || qrCanvasId.value;

        // Convert the canvas to temporary file path
        nextTick(() => {
          uni.canvasToTempFilePath({
            canvasId,
            success: (res) => {
              const tempFilePath = res.tempFilePath;
              // Save the temporary file path image to the album
              uni.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: () => {
                  uni.showToast({
                    title: '二维码已保存到相册',
                    icon: 'success',
                    duration: 2000
                  });
                },
                fail: () => {
                  uni.showToast({
                    title: '保存失败，请重试',
                    icon: 'error',
                    duration: 2000
                  });
                }
              });
            },
            fail: () => {
              uni.showToast({
                title: '保存失败，请重试',
                icon: 'error',
                duration: 2000
              });
            }
          });
        });
      } catch (error) {
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'error',
          duration: 2000
        });
      }
    };

    return {
      handleSaveQrcode,
      options,
      goBack,
      qrValue,
      qrCanvasId
    };
  }
});
</script>

<style lang="scss" scoped>
.qrcode__content {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .save_qrcode {
    width: 90%;
    height: 40px;
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    background-color: #007aff;
    color: #fff;
  }
}
</style>
