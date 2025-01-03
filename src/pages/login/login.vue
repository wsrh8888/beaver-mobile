<template>
  <view class="container">
    <view class="title">
      <text class="title-text">手机号密码登录</text>
    </view>
    <view class="userInfo">
      <view class="input__item">
        <view class="input__field">
          <input type="text" class="input" v-model="userInfo.phone" placeholder="请输入手机号" @input="inputPhone">
        </view>
        <view v-if="phoneTouched && !isPhoneValid" class="error__message">请输入有效手机号</view>
      </view>
      <view class="input__item">
        <view class="input__field">
          
          <input class="input" :type="passwordType" v-model="userInfo.password" placeholder="请输入密码">
          <uni-icons class="icon__password" :type="passwordType === 'password' ? 'eye' : 'eye-slash'"
            @click="togglePasswordVisibility"></uni-icons>
        </view>
        <view v-if="passwordTouched && !isPasswordValid" class="error__message">密码长度不少于13位，且必须包含中英文</view>
      </view>
    </view>
    <view class="btn__jump">
      <text class="register jump__text" @click="navigateToPage('/pages/register/register')">注册</text>
      <text class="placeholader"></text>
      <text class="forget jump__text" @click="navigateToPage('pages/forget/forget')">忘记密码？</text>
    </view>
    <view class="footer">
      <view class="login__button" :disabled="!isFormValid" @click="goHome">登录</view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { showMsg } from '@/utils/Toast';
import { MD5 } from 'crypto-js';
import { loginApi } from '@/api/user';
import { useUserStore } from '@/pinia/user/user';
import { setLocal } from '@/utils/local';
import WsManager from '@/ws-manager/ws'
import { useInitStore } from '@/pinia/init/init';

export default defineComponent({
  setup() {
    interface UserInfo {
      phone: string;
      password: string;
    }
    const sUserInfo = useUserStore();
    const initStore = useInitStore();
    const userInfo = reactive<UserInfo>({
      phone: '',
      password: ''
    });

    // 密码框的类型，默认为 password
    const passwordType = ref('password');

    // 是否已点击输入框
    const phoneTouched = ref(false);
    const passwordTouched = ref(false);

    // 验证状态
    const isPhoneValid = ref(false);
    const isPasswordValid = ref(false);

    // 表单是否有效
    const isFormValid = ref(false);

    // 切换显示/隐藏密码
    function togglePasswordVisibility(): void {
      passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
    }

    // 邮箱校验
    function validatePhone(phone: string): boolean {
      return phone.length === 11 && /^[0-9]+$/.test(phone);
    }

    // 密码校验
    function validatePassword(password: string): boolean {
      // return password.length >= 13 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[\u4e00-\u9fa5]/.test(password);
      return true;
    }

    // 表单校验
    watch([() => userInfo.phone, () => userInfo.password], () => {
      isPhoneValid.value = validatePhone(userInfo.phone);
      isPasswordValid.value = validatePassword(userInfo.password);
      isFormValid.value = isPhoneValid.value && isPasswordValid.value;
    });

    // 手机号输入处理
    function inputPhone(): void {
      phoneTouched.value = true;
    }

    // 密码输入处理
    function inputPass(): void {
      passwordTouched.value = true;
    }

    // 跳转到忘记密码页
    function navigateToPage(url: string): void {
      uni.navigateTo({
        url: url,
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    }

    // 点击登录跳转到主页
    function goHome(): void {
      // 标记已经点击过登录按钮，以便显示错误提示
      phoneTouched.value = true;
      passwordTouched.value = true;

      // if (isFormValid.value) {
        // 对密码加密传输过去
        loginApi({
          phone: userInfo.phone,
          password: MD5(userInfo.password).toString()
        }).then((res) => {
          if (res.code === 0) {
            // 存储token
            setLocal('token', res.result.token);
            uni.reLaunch({
              url: '/pages/home/home',
              animationType: 'pop-in',
              animationDuration: 200
            });
            initStore.initApp()
          } else {
            showMsg(res.msg);
          }
        }).catch(() => {
          showMsg('登录失败');
        });
      // }
      //  else {
      //   showMsg('请完善登录信息');
      // }
    }

    return {
      togglePasswordVisibility,
      inputPhone,
      inputPass,
      navigateToPage,
      goHome,
      userInfo,
      passwordType,
      phoneTouched,
      passwordTouched,
      isPhoneValid,
      isPasswordValid,
      isFormValid
    };
  }
});
</script>

<style scoped lang="scss">
.container {
  padding: 40rpx;
  height: 100%;

  .title {
    display: flex;
    margin-top: 220rpx;

    .title-text {
      font-family: FangSong;
      font-size: 43rpx;
      font-weight: normal;
      color: #707070;
    }
  }

  .userInfo {
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .input__item {
      padding-bottom: 40rpx;
      width: 100%;
      position: relative;
      box-sizing: border-box;

      .input__field {
        display: flex;
        align-items: center;
        border-radius: 25px;
        background-color: #f7f7f7;

        position: relative;
        .icon__password {
          position: absolute;
          right: 20rpx;
          color: #707070;
        }

        .input {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px;
          font-size: 16px;
          color: #333;
          margin-left: 30rpx;
        }

        uni-icons {
          position: absolute;
          right: 10rpx;
          color: #707070;
        }
      }

      .error__message {
        color: red;
        font-size: 12px;
        margin-left: 20px;
        position: absolute;
        bottom: 10rpx;
      }
    }
  }
  .btn__jump {
    display: flex;
    justify-content: space-between;
    font-size: 25rpx;
    margin-top: 10rpx;
    color: #757575;
    .jump__text {
      cursor: pointer;
    }


    .placeholader {
      flex: 1;
    }

  }

  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 30rpx;

    .forget {
      color: #707070;
      font-family: FangSong;
      margin-bottom: 20rpx;
      cursor: pointer;
    }

    .login__button {
      margin-top: 55rpx;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 20px;
      width: 80%;
      height: 92rpx;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.disabled {
        background-color: #ccc;
        pointer-events: none;
      }
    }
  }
}
</style>
