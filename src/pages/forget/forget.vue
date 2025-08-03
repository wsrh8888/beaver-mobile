<template>
  <view class="container">
    <view class="top-gradient"></view>
    
    <view class="content">
      <view class="logo-container">
        <view class="logo">
          <image :src="APP_CONFIG.logo" mode="aspectFit" />
        </view>
      </view>
      
      <view class="title">找回密码</view>
      
      <view class="guide-text">
        请输入您的邮箱地址和验证码，重置密码
      </view>
      
      <view class="form-container">
        <view class="form-group">
          <input 
            type="email" 
            class="form-input" 
            v-model="emailAddress" 
            placeholder="邮箱地址"
            @input="inputEmail"
          >
          <view v-if="emailTouched && emailError" class="error__message">请输入有效邮箱地址</view>
        </view>
        
        <view class="form-group verification-group">
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
        
        <view class="form-group">
          <input 
            type="password" 
            class="form-input" 
            v-model="newPassword" 
            placeholder="设置新密码"
            @input="inputPassword"
          >
          <view v-if="passwordTouched && passwordError" class="error__message">密码长度不少于13位，且不能包含空格</view>
        </view>
        
        <button 
          class="btn-primary" 
          :disabled="!isFormValid" 
          @click="resetPassword"
        >重置密码</button>
        
        <view class="login-link">
          记起密码了？<text class="link" @click="navigateToPage('/pages/login/login')">返回登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { getEmailCodeApi } from '@/api/auth';
import { resetPasswordApi } from '@/api/user';
import { APP_CONFIG } from '@/config/data';
import Logger from '@/logger/logger';
import { showToast } from '@/component/toast';

export default {
  setup() {
    const logger = new Logger('忘记密码页面');
    
    // 响应式数据
    const emailAddress = ref('');
    const verificationCode = ref('');
    const newPassword = ref('');
    const isCodeButtonDisabled = ref(false);
    const countdown = ref(60);
    
    const emailError = ref(false);
    const verificationError = ref(false);
    const passwordError = ref(false);
    
    const emailTouched = ref(false);
    const verificationTouched = ref(false);
    const passwordTouched = ref(false);
    
    // 计算属性
    const isFormValid = computed(() => {
      return !emailError.value && !verificationError.value && !passwordError.value && 
             emailAddress.value && verificationCode.value && newPassword.value;
    });
    
    // 方法
    const validateEmailAddress = () => {
      emailTouched.value = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailError.value = !emailRegex.test(emailAddress.value);
    };
    
    const inputEmail = () => {
      emailError.value = false;
    };
    
    const validateVerificationCode = () => {
      verificationTouched.value = true;
      verificationError.value = verificationCode.value === '';
    };
    
    const validatePassword = () => {
      passwordTouched.value = true;
      passwordError.value = !/^[^\s]{13,}$/.test(newPassword.value);
    };
    
    const inputPassword = () => {
      passwordError.value = false;
    };
    
    const sendVerificationCode = () => {
      validateEmailAddress();
      if (isCodeButtonDisabled.value || emailError.value) {
        return;
      }
      
      getEmailCodeApi({
        email: emailAddress.value,
        type: 'reset_password'
      }).then((res: any) => {
        if (res.code === 0) {
          showToast('验证码已发送', 2000);
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
        } else {
          showToast(res.msg || '发送失败', 2000);
        }
      }).catch((error) => {
        logger.error({
          text: '发送验证码失败',
          data: {
            error: error?.message,
            email: emailAddress.value
          }
        });
        showToast('发送失败', 2000);
      });
    };
    
    const resetPassword = () => {
      validateEmailAddress();
      validateVerificationCode();
      validatePassword();
      if (!isFormValid.value) {
        return;
      }
      
      resetPasswordApi({
        email: emailAddress.value,
        verifyCode: verificationCode.value,
        password: newPassword.value
      }).then((res: any) => {
        if (res.code === 0) {
          showToast('密码重置成功', 2000);
          // 跳转到登录页面
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/login/login",
              animationType: 'pop-in',
              animationDuration: 200
            });
          }, 2000);
        } else {
          showToast(res.msg || '重置失败', 2000);
        }
      }).catch((error) => {
        logger.error({
          text: '重置密码失败',
          data: {
            error: error?.message,
            email: emailAddress.value
          }
        });
        showToast('重置失败', 2000);
      });
    };
    
    const navigateToPage = (url: string) => {
      uni.navigateTo({
        url: url,
        animationType: 'slide-in-right',
        animationDuration: 200
      });
    };
    
    return {
      logger,
      emailAddress,
      verificationCode,
      newPassword,
      isCodeButtonDisabled,
      countdown,
      emailError,
      verificationError,
      passwordError,
      emailTouched,
      verificationTouched,
      passwordTouched,
      isFormValid,
      validateEmailAddress,
      inputEmail,
      validateVerificationCode,
      validatePassword,
      inputPassword,
      sendVerificationCode,
      resetPassword,
      navigateToPage,
      APP_CONFIG
    };
  }
};
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

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 48rpx;
}

.logo {
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  border-radius: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.2);
  
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

.guide-text {
  text-align: center;
  margin-bottom: 48rpx;
  color: #636E72;
  font-size: 28rpx;
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
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #B2BEC3;
  }
}

.verification-group {
  .form-input {
    padding-right: 220rpx;
  }
}

.code-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  height: 72rpx;
  padding: 0 28rpx;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: white;
  border: none;
  border-radius: 20rpx;
  font-size: 26rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    transform: translateY(-50%) translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(255, 125, 69, 0.1);
  }
  
  &[disabled] {
    opacity: 1;
    background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
    color: white;
    box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.15);
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

.login-link {
  font-size: 28rpx;
  color: #636E72;
  text-align: center;
  padding: 24rpx 0;
  margin-top: 24rpx;
}

.link {
  color: #FF7D45;
  font-weight: 500;
}
</style>
