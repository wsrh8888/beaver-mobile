<template>
  <view class="container">
    <view class="top-gradient"></view>
    
    <view class="content">
      <view class="logo-container">
        <view class="logo">
          <image :src="APP_CONFIG.logo" mode="aspectFit" />
        </view>
      </view>
      
      <view class="title">欢迎回来</view>
      <view class="title-decoration"></view>
      
      <view class="welcome-text">
        登录您的{{ APP_CONFIG.name }}账号，开启社交新体验
      </view>
      
      <view class="form-container">
        <view class="form-group">
          <input 
            type="email" 
            class="form-input" 
            v-model="userInfo.email" 
            placeholder="邮箱地址"
            @input="inputEmail"
          >
          <view v-if="emailTouched && !isEmailValid" class="error__message">请输入有效邮箱地址</view>
        </view>
        
        <view class="form-group">
          <input 
            :type="passwordType" 
            class="form-input" 
            v-model="userInfo.password" 
            placeholder="登录密码"
          >
          <uni-icons 
            class="icon__password" 
            :type="passwordType === 'password' ? 'eye' : 'eye-slash'"
            @click="togglePasswordVisibility"
          ></uni-icons>
          <view v-if="passwordTouched && !isPasswordValid" class="error__message">密码长度不少于13位，且必须包含中英文</view>
        </view>
        
        <view class="forgot-password">
          <text class="jump__text" @click="navigateToPage('/pages/forget/forget')">忘记密码?</text>
        </view>
        
        <button 
          class="btn btn-primary" 
          :disabled="!isFormValid" 
          @click="goHome"
        >登录</button>
        
        <view class="register-link">
          还没有账号? <text class="jump__text" @click="navigateToPage('/pages/register/register')">立即注册</text>
        </view>
      </view>
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
import { APP_CONFIG } from '@/config/data';

export default defineComponent({
  setup() {
    interface userInfo {
      email: string;
      password: string;
    }
    const sUserInfo = useUserStore();
    const initStore = useInitStore();
    const userInfo = reactive<userInfo>({
      email: '',
      password: ''
    });

    // 密码框的类型，默认为 password
    const passwordType = ref('password');

    // 是否已点击输入框
    const emailTouched = ref(false);
    const passwordTouched = ref(false);

    // 验证状态
    const isEmailValid = ref(false);
    const isPasswordValid = ref(false);

    // 表单是否有效
    const isFormValid = ref(false);

    // 切换显示/隐藏密码
    function togglePasswordVisibility(): void {
      passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
    }

    // 邮箱校验
    function validateEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // 密码校验
    function validatePassword(password: string): boolean {
      // return password.length >= 13 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[\u4e00-\u9fa5]/.test(password);
      return true;
    }

    // 表单校验
    watch([() => userInfo.email, () => userInfo.password], () => {
      isEmailValid.value = validateEmail(userInfo.email);
      isPasswordValid.value = validatePassword(userInfo.password);
      isFormValid.value = isEmailValid.value && isPasswordValid.value;
    });

    // 邮箱输入处理
    function inputEmail(): void {
      emailTouched.value = true;
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
      emailTouched.value = true;
      passwordTouched.value = true;

      // if (isFormValid.value) {
        // 对密码加密传输过去
        loginApi({
          email: userInfo.email,
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
      inputEmail,
      inputPass,
      navigateToPage,
      goHome,
      userInfo,
      passwordType,
      emailTouched,
      passwordTouched,
      isEmailValid,
      isPasswordValid,
      isFormValid,
      APP_CONFIG
    };
  }
});
</script>

<style scoped lang="scss">
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
}

.title-decoration {
  width: 40rpx;
  height: 4rpx;
  background-color: #FF7D45;
  margin: 0 auto 48rpx;
}

.welcome-text {
  text-align: center;
  margin-bottom: 64rpx;
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
  padding: 0;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #B2BEC3;
  }
}

.icon__password {
  color: #B2BEC3;
  font-size: 40rpx;
  padding: 0 16rpx;
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

.forgot-password {
  text-align: right;
  margin-bottom: 48rpx;
  
  .jump__text {
    color: #FF7D45;
    font-weight: 500;
    font-size: 24rpx;
  }
}

.btn {
  width: 100%;
  height: 96rpx;
  border-radius: 28rpx;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 32rpx;
  
  &.btn-primary {
    background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
    color: white;
    box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.15);
    

    
    &:hover {
      transform: translateY(-4rpx);
      box-shadow: 0 12rpx 32rpx rgba(255, 125, 69, 0.2);
    }
    
    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.1);
    }
    
    &.disabled {
      background: #ccc;
      box-shadow: none;
      pointer-events: none;
    }
  }
}

.register-link {
  text-align: center;
  margin-top: 48rpx;
  color: #636E72;
  font-size: 28rpx;
  
  .jump__text {
    color: #FF7D45;
    font-weight: 500;
  }
}
</style>
