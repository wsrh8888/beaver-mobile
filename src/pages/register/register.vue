<template>
  <view class="container">
    <view class="top-gradient"></view>
    
    <view class="content">
      <view class="header">
        <view class="avatar">
          <uni-icons type="person" size="32" color="#FFFFFF"></uni-icons>
        </view>
        <view class="title">创建账号</view>
      </view>
      
      <view class="form-container">
        <view class="form-group">
          <input 
            type="tel" 
            class="form-input" 
            v-model="phoneNumber" 
            placeholder="手机号码"
            @input="inputPhone"
          >
          <view v-if="phoneTouched && phoneError" class="error__message">请输入有效手机号</view>
        </view>
        
        <view class="form-group">
          <input 
            type="password" 
            class="form-input" 
            v-model="password" 
            placeholder="设置密码"
            @input="inputPass"
          >
          <view v-if="passwordTouched && passwordError" class="error__message">密码长度不少于13位，且必须包含中英文</view>
        </view>
        
        <view class="form-group">
          <input 
            type="text" 
            class="form-input" 
            v-model="verificationCode" 
            placeholder="验证码"
            @input="validateVerificationCode"
          >
          <button 
            class="code-btn" 
            :disabled="isCodeButtonDisabled" 
            @click="sendVerificationCode"
          >{{ isCodeButtonDisabled ? countdown + 's' : '获取验证码' }}</button>
          <view v-if="verificationTouched && verificationError" class="error__message">请输入验证码</view>
        </view>
        
        <view class="agreement">
          <view class="checkbox-wrapper">
            <view class="custom-checkbox" :class="{ checked: isAgreed }" @click="toggleAgreement"></view>
            <checkbox :checked="isAgreed" @tap="toggleAgreement" style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%;" />
          </view>
          <text class="agreement-text">我已阅读并同意</text>
          <text class="link" @click="navigateToPage('/pages/agreement/agreement')">用户协议</text>
          <text class="agreement-text">和</text>
          <text class="link" @click="navigateToPage('/pages/privacy/privacy')">隐私政策</text>
        </view>
        
        <button 
          class="btn-primary" 
          :disabled="!isFormValid" 
          @click="register"
        >注册</button>
        
        <view class="bottom-links">
          已有账号？<text class="link" @click="navigateToPage('/pages/login/login')">登录</text>
        </view>
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

    const isAgreed = ref(false);

    const toggleAgreement = () => {
      isAgreed.value = !isAgreed.value;
    };

    const navigateToPage = (url: string) => {
      uni.navigateTo({
        url: url,
        animationType: 'slide-in-right',
        animationDuration: 200
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
      isAgreed,
      toggleAgreement,
      navigateToPage
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
}

.top-gradient {
  height: 240rpx;
  background: linear-gradient(180deg, rgba(255,125,69,0.1) 0%, rgba(255,255,255,0) 100%);
}

.content {
  padding: 0 32rpx;
  max-width: 750rpx;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  border-radius: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.2);
  margin-bottom: 48rpx;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    border-radius: 32rpx 32rpx 0 0;
  }
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #2D3436;
  text-align: center;
  margin-bottom: 16rpx;
  line-height: 1.3;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -8rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background-color: #FF7D45;
    border-radius: 4rpx;
  }
}

.form-container {
  margin-top: 20rpx;
}

.form-group {
  position: relative;
  margin-bottom: 34rpx;
  background-color: #F9FAFB;
  border-radius: 28rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  height: 96rpx;
  box-shadow: inset 0 2rpx 6rpx rgba(0,0,0,0.05);
}

.form-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 30rpx;
  color: #2D3436;
  padding: 0 32rpx;
  
  /* Add additional right padding for inputs in form groups with verification code button */
  .form-group:nth-child(3) & {
    padding-right: 110px;
  }
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #B2BEC3;
  }
}

.code-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  height: 36px;
  padding: 0 14px;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(255, 125, 69, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    transform: translateY(-50%) translateY(1px);
    box-shadow: 0 1px 4px rgba(255, 125, 69, 0.1);
  }
  
  &[disabled] {
    /* 倒计时状态下的样式 */
    opacity: 1;
    background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(255, 125, 69, 0.15);
    cursor: not-allowed;
  }
}

.error__message {
  color: #FF7D45;
  font-size: 24rpx;
  margin-top: 8rpx;
  padding-left: 32rpx;
  position: absolute;
  bottom: -32rpx;
  left: 0;
}

.agreement {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #636E72;
  margin: 24rpx 0;
}

.checkbox-wrapper {
  position: relative;
  margin-right: 20rpx;
}

.custom-checkbox {
  width: 36rpx;
  height: 36rpx;
  border-radius: 10rpx;
  border: 2rpx solid #B2BEC3;
  display: inline-block;
  position: relative;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
  
  &.checked {
    background: #FF7D45;
    border-color: #FF7D45;
    
    &:after {
      content: '';
      position: absolute;
      left: 12rpx;
      top: 6rpx;
      width: 8rpx;
      height: 16rpx;
      border: solid white;
      border-width: 0 4rpx 4rpx 0;
      transform: rotate(45deg);
    }
  }
}

.agreement-text {
  color: #636E72;
}

.link {
  color: #FF7D45;
  font-weight: 500;
}

.btn-primary {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: white;
  border: none;
  border-radius: 28rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.15);
  position: relative;
  overflow: hidden;
  margin-top: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(255, 125, 69, 0.1);
  }
  
  &[disabled] {
    /* 禁用状态下的样式，保持橙色渐变但使用低透明度 */
    opacity: 0.6;
    box-shadow: none;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 28rpx;
    }
  }
}

.bottom-links {
  font-size: 28rpx;
  color: #636E72;
  text-align: center;
  padding: 24rpx 0;
  margin-top: 24rpx;
}
</style>
