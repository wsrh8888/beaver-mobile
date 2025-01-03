<template>
  <view class="register__content">
    <view class="content__header">
      <view class="header__icon" @click="handleGoBack">
        <uni-icons type="left" size="20" class="icon"></uni-icons>
      </view>
    </view>
    <view class="content__content">
      <view class="content__title">注册</view>
      <view class="content__input">
        <view class="input__item">
          <view class="input__field">
            <input type="text" placeholder="请输入手机号" class="input" v-model="phoneNumber" @input="inputPhone" />
          </view>
          <view v-if="phoneTouched && phoneError" class="error__message">请输入有效手机号</view>
        </view>
        <view class="input__item">
          <view class="input__field">
            <input type="text" placeholder="请输入验证码" class="input" v-model="verificationCode"
              @input="validateVerificationCode" />
            <view class="code__button" :class="{ disabled: isCodeButtonDisabled }" @click="sendVerificationCode">{{
              isCodeButtonDisabled ? countdown : '获取验证码' }}</view>
          </view>
        </view>
        <view class="input__item">
          <view v-if="verificationTouched && verificationError" class="error__message">请输入验证码</view>
          <view class="input__field">
            <input type="password" placeholder="请输入密码" class="input" v-model="password" @input="inputPass" />
          </view>
          <view v-if="passwordTouched && passwordError" class="error__message">密码长度不少于13位，且必须包含中英文</view>
        </view>
      </view>
      <view class="content__ability">
        <view class="register__button" :class="{ disabled: !isFormValid }" @click="register">注册</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { registerApi } from '@/api/user';
import { defineComponent, ref, computed } from 'vue';
import { MD5 } from 'crypto-js';

export default defineComponent({
  setup() {
    const phoneNumber = ref('');
    const verificationCode = ref('');
    const password = ref('');
    const isCodeButtonDisabled = ref(false);
    const countdown = ref(60);

    const phoneError = ref(false);
    const verificationError = ref(false);
    const passwordError = ref(false);

    const phoneTouched = ref(false);
    const verificationTouched = ref(false);
    const passwordTouched = ref(false);

    const isFormValid = computed(() => {
      return !phoneError.value && !verificationError.value && !passwordError.value && phoneNumber.value && verificationCode.value && password.value;
    });

    const validatePhoneNumber = () => {
      phoneTouched.value = true;
      phoneError.value = !/^\d{11}$/.test(phoneNumber.value);
    };
    const inputPhone = (e: any) => {
      phoneError.value = false;
    };

    const validateVerificationCode = () => {
      verificationTouched.value = true;
      verificationError.value = verificationCode.value === '';
    };

    const validatePassword = () => {
      passwordTouched.value = true;
      passwordError.value = !/^(?=.*[a-zA-Z])(?=.*\d).{13,}$/.test(password.value);
    };
    const inputPass = (e: any) => {
      passwordError.value = false;
    };
    const sendVerificationCode = () => {
      console.log(MD5(password.value).toString(),'====');
      validatePhoneNumber();
      if (isCodeButtonDisabled.value || phoneError.value) {
        return;
      }
      isCodeButtonDisabled.value = true;
      let counter = countdown.value;
      const interval = setInterval(() => {
        counter -= 1;
        countdown.value = counter;
        if (counter <= 0) {
          clearInterval(interval);
          isCodeButtonDisabled.value = false;
          countdown.value = 60;
        }
      }, 1000);
    };

    const register = () => {
      validatePhoneNumber();
      validateVerificationCode();
      validatePassword();
      if (!isFormValid.value) {
        return;
      }
      // 处理注册逻辑
      registerApi({
        phone: phoneNumber.value,
        password: MD5(password.value).toString(),
      }).then((res) => {
        if (res.code === 0) {
          // 跳转到message页面
          uni.reLaunch({
            url: "/pages/login/login",
            animationType: 'pop-in',
            animationDuration: 200
          });
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000
          });
        }
      });
    };
    const handleGoBack = () => {
      uni.reLaunch({
		  url: '/pages/guide/guide'
		});
    };

    return {
      handleGoBack,
      inputPhone,
      inputPass,
      phoneNumber,
      verificationCode,
      password,
      isCodeButtonDisabled,
      countdown,
      phoneError,
      verificationError,
      passwordError,
      phoneTouched,
      verificationTouched,
      passwordTouched,
      isFormValid,
      validatePhoneNumber,
      validateVerificationCode,
      validatePassword,
      sendVerificationCode,
      register,
    };
  }
});
</script>

<style lang="scss" scoped>
.register__content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 40rpx;

  .content__header {
    height: 50px;
    display: flex;
    align-items: center;

    .header__icon {
      margin-left: 5px;

      .icon {
        color: #333;
      }
    }
  }

  .content__title {
    font-size: 24px;
    text-align: center;
    margin: 20px 0;
    color: #333;
  }

  .content__input {
    display: flex;
    flex-direction: column;
    position: relative;

    .input__item {
      padding-bottom: 40rpx;
      box-sizing: border-box;
      position: relative;
      .input__field {
        display: flex;
        align-items: center;
        border-radius: 25px;
        background-color: #f7f7f7;
       
        position: relative;

        .input {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px;
          font-size: 16px;
          color: #333;
          margin-left: 30rpx;
        }
      }
    }

    .code__button {
      color: #5d6fd1;
      margin-right: 40rpx;

      &.disabled {
        color: #ccc;
        pointer-events: none;
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

  .content__protocol {
    display: flex;
    align-items: center;
    margin: 20px 0;

    .checkbox {
      margin-right: 10px;
    }

    .label {
      font-size: 14px;
      color: #666;

      .protocol__link {
        color: #007bff;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .content__ability {
    text-align: center;

    .register__button {
      margin-top: 55rpx;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 20px;
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
