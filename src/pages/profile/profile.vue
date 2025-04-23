<template>
  <view class="profile-page">
    <!-- 顶部渐变 -->
    <view class="gradient-header"></view>
    
    <view class="container">
      <!-- 导航栏 -->
      <view class="navbar">
        <view class="back-button" @click="goBack">
          <image src="@/static/img/common/arrow-back.svg" mode="aspectFit"></image>
        </view>
        <view class="page-title">编辑个人资料</view>
        <view style="width: 32px;"></view> <!-- 平衡空间 -->
      </view>
      
      <!-- 头像上传 -->
      <view class="avatar-upload" @click="chooseAvatar">
        <view class="avatar-container" >
          <!-- {{ previewOnlineFileApi(userAvatar) }} -->
          <image 
            :src="userAvatar " 
            id="avatar-preview" 
            mode="aspectFill"
          ></image>
          <view class="edit-icon">更换</view>
        </view>
        <view class="avatar-label">点击更换头像</view>
      </view>
      
      <!-- 个人信息列表 -->
      <view class="info-list">
        <view class="info-item" @click="openModal('nickname')">
          <view class="info-label">昵称</view>
          <view class="info-content" id="nickname-display">{{ userInfo.nickName || '海狸用户' }}</view>
          <view class="arrow-icon">
            <image src="@/static/img/common/arrow-right.svg" mode="aspectFit"></image>
          </view>
        </view>
        <!-- 个人简介 - 特殊处理允许预览 -->
        <view class="info-description" @click="openModal('description')">
          <view class="info-description-header">
            <view class="info-description-text">个人简介</view>
            <view class="edit-icon-text">
              编辑
              <image src="@/static/img/common/edit.svg" mode="aspectFit"></image>
            </view>
          </view>
          <view class="description-content">
            <text v-if="userInfo.bio" class="bio-text">{{ userInfo.bio }}</text>
            <text v-else class="info-placeholder">介绍一下自己，让更多人了解你</text>
          </view>
        </view>
        
        <view class="info-item" @click="openModal('phone')">
          <view class="info-label">手机号</view>
          <view class="info-content">{{ formatPhone(userInfo.phone) }}</view>
          <view class="arrow-icon">
            <image src="@/static/img/common/arrow-right.svg" mode="aspectFit"></image>
          </view>
        </view>
        
        <view class="info-item" @click="openModal('gender')">
          <view class="info-label">性别</view>
          <view class="info-content">{{ userInfo.gender || '未设置' }}</view>
          <view class="arrow-icon">
            <image src="@/static/img/common/arrow-right.svg" mode="aspectFit"></image>
          </view>
        </view>
        
        <view class="info-item" @click="openModal('birthday')">
          <view class="info-label">生日</view>
          <view class="info-content">
            <text v-if="userInfo.birthday" class="birthday-text">{{ userInfo.birthday }}</text>
            <text v-else class="info-placeholder">设置生日</text>
          </view>
          <view class="arrow-icon">
            <image src="@/static/img/common/arrow-right.svg" mode="aspectFit"></image>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 模态框 - 修改昵称 -->
    <uv-popup ref="nicknamePopup" mode="center" round="10" :overlay="true">
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title">修改昵称</view>
          <view class="modal-close" @click="closeModal('nickname')">
            <image src="@/static/img/common/close.svg" mode="aspectFit"></image>
          </view>
        </view>
        <view class="form-group">
          <input type="text" class="form-control" v-model="formData.nickname" placeholder="请输入昵称" maxlength="20" />
          <view class="char-count"><text>{{ formData.nickname.length }}</text>/20</view>
        </view>
        <button class="btn-save" @click="saveNickname">确定</button>
      </view>
    </uv-popup>
    
    <!-- 模态框 - 修改手机号 -->
    <uv-popup ref="phonePopup" mode="center" round="10" :overlay="true" class="phone-popup">
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title">修改手机号</view>
          <view class="modal-close" @click="closeModal('phone')">
            <image src="@/static/img/common/close.svg" mode="aspectFit"></image>
          </view>
        </view>
        <view class="form-group">
          <input type="tel" class="form-control" v-model="formData.phone" placeholder="请输入手机号" />
        </view>
        <button class="btn-save" @click="savePhone">确定</button>
      </view>
    </uv-popup>
    
    <!-- 模态框 - 修改个人简介 -->
    <uv-popup ref="descriptionPopup" mode="center" round="10" :overlay="true">
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title">个人简介</view>
          <view class="modal-close" @click="closeModal('description')">
            <image src="@/static/img/common/close.svg" mode="aspectFit"></image>
          </view>
        </view>
        <view class="form-group">
          <textarea class="form-control" v-model="formData.bio" placeholder="介绍一下自己吧～" rows="5" maxlength="100"></textarea>
          <view class="char-count"><text>{{ formData.bio.length }}</text>/100</view>
        </view>
        <button class="btn-save" @click="saveBio">确定</button>
      </view>
    </uv-popup>
    
    <!-- 模态框 - 选择性别 -->
    <uv-popup ref="genderPopup" mode="center" round="10" :overlay="true">
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title">选择性别</view>
          <view class="modal-close" @click="closeModal('gender')">
            <image src="@/static/img/common/close.svg" mode="aspectFit"></image>
          </view>
        </view>
        <view class="gender-options">
          <view 
            class="gender-option" 
            :class="{ selected: formData.gender === '男' }" 
            @click="selectGender('男')"
          >
            <view class="gender-option-text">男</view>
            <view class="radio-custom"></view>
          </view>
          <view 
            class="gender-option" 
            :class="{ selected: formData.gender === '女' }"
            @click="selectGender('女')"
          >
            <view class="gender-option-text">女</view>
            <view class="radio-custom"></view>
          </view>
        </view>
        <button class="btn-save" @click="saveGender">确定</button>
      </view>
    </uv-popup>
    
    <!-- 模态框 - 选择生日 -->
    <uv-popup ref="birthdayPopup" mode="center" round="10" :overlay="true">
      <view class="modal-content birthday-modal">
        <view class="modal-header">
          <view class="modal-title">选择生日</view>
          <view class="modal-close" @click="closeModal('birthday')">
            <image src="@/static/img/common/close.svg" mode="aspectFit"></image>
          </view>
        </view>
        <picker-view
          class="birthday-picker"
          indicator-style="height: 80rpx; border-top: 2rpx solid #EBEEF5; border-bottom: 2rpx solid #EBEEF5;"
          :value="birthdayPickerValue"
          @change="birthdayChange"
        >
          <picker-view-column>
            <view class="picker-item" v-for="(year, index) in years" :key="'year' + index">{{ year }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(month, index) in months" :key="'month' + index">{{ month }}月</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(day, index) in days" :key="'day' + index">{{ day }}日</view>
          </picker-view-column>
        </picker-view>
        <button class="btn-save" @click="saveBirthday">确定</button>
      </view>
    </uv-popup>
    
    <!-- 提示框 -->
    <uv-toast ref="uToast" />
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, reactive, watch } from 'vue';
import { useUserStore } from '@/pinia/user/user';
import { updateInfoApi } from '@/api/user';
import { openAlbum } from '@/utils/upload';
import { previewOnlineFileApi } from '@/api/file';

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const userInfo = computed(() => userStore.userInfo);
    
    // 引用popup组件
    const nicknamePopup = ref();
    const phonePopup = ref();
    const descriptionPopup = ref();
    const genderPopup = ref();
    const birthdayPopup = ref();
    const uToast = ref();
    
    // 表单数据
    const formData = reactive({
      nickname: userInfo.value.nickName || '',
      phone: userInfo.value.phone || '',
      bio: userInfo.value.bio || '',
      gender: userInfo.value.gender || '男',
      birthday: userInfo.value.birthday || '',
    });
    
    // 头像相关
    const userAvatar = ref(userInfo.value.avatar || '');
    
    // 生日日期选择器
    const years = ref<number[]>([]);
    const months = ref<number[]>([]);
    const days = ref<number[]>([]);
    const birthdayPickerValue = ref([20, 0, 0]); // 默认值
    
    // 初始化日期选择器数据
    const initDatePicker = () => {
      const currentYear = new Date().getFullYear();
      
      // 年份选项 (100年前到当前年)
      years.value = [];
      for (let year = currentYear; year >= currentYear - 100; year--) {
        years.value.push(year);
      }
      
      // 月份选项
      months.value = [];
      for (let month = 1; month <= 12; month++) {
        months.value.push(month);
      }
      
      // 默认31天
      updateDays(31);
      
      // 如果已有生日，设置为当前值
      if (userInfo.value.birthday) {
        const [year, month, day] = userInfo.value.birthday.split('-').map(Number);
        const yearIndex = years.value.findIndex(y => y === year);
        const monthIndex = months.value.findIndex(m => m === month);
        
        updateDays(getDaysInMonth(year, month));
        const dayIndex = days.value.findIndex(d => d === day);
        
        if (yearIndex !== -1 && monthIndex !== -1 && dayIndex !== -1) {
          birthdayPickerValue.value = [yearIndex, monthIndex, dayIndex];
        }
      }
    };
    
    // 更新天数
    const updateDays = (daysCount: number) => {
      days.value = [];
      for (let day = 1; day <= daysCount; day++) {
        days.value.push(day);
      }
    };
    
    // 获取指定月份的天数
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month, 0).getDate();
    };
    
    // 生日选择器变更事件
    const birthdayChange = (e: any) => {
      const [yearIndex, monthIndex] = e.detail.value;
      const selectedYear = years.value[yearIndex];
      const selectedMonth = months.value[monthIndex];
      
      // 更新天数
      const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
      updateDays(daysInMonth);
      
      // 调整天数索引，确保不超出范围
      let dayIndex = birthdayPickerValue.value[2];
      if (dayIndex >= days.value.length) {
        dayIndex = days.value.length - 1;
      }
      
      birthdayPickerValue.value = [yearIndex, monthIndex, dayIndex];
    };
    
    // 监听用户信息变化，更新表单数据
    watch(() => userInfo.value, (newUserInfo) => {
      formData.nickname = newUserInfo.nickName || '';
      formData.phone = newUserInfo.phone || '';
      formData.bio = newUserInfo.bio || '';
      formData.gender = newUserInfo.gender || '男';
      formData.birthday = newUserInfo.birthday || '';
      userAvatar.value = newUserInfo.avatar || '';
    });
    
    // 页面加载时初始化
    onMounted(() => {
      initDatePicker();
    });
    
    // 格式化手机号
    const formatPhone = (phone: string) => {
      if (!phone) return '未设置';
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    };
    
    // 返回上一页
    const goBack = () => {
      uni.navigateBack();
    };
    
    // 打开模态框
    const openModal = (type: string) => {
      switch (type) {
        case 'nickname':
          formData.nickname = userInfo.value.nickName || '';
          nicknamePopup.value.open();
          break;
        case 'phone':
          formData.phone = userInfo.value.phone || '';
          phonePopup.value.open();
          break;
        case 'description':
          formData.bio = userInfo.value.bio || '';
          descriptionPopup.value.open();
          break;
        case 'gender':
          formData.gender = userInfo.value.gender || '男';
          genderPopup.value.open();
          break;
        case 'birthday':
          initDatePicker();
          birthdayPopup.value.open();
          break;
      }
    };
    
    // 关闭模态框
    const closeModal = (type: string) => {
      switch (type) {
        case 'nickname':
          nicknamePopup.value.close();
          break;
        case 'phone':
          phonePopup.value.close();
          break;
        case 'description':
          descriptionPopup.value.close();
          break;
        case 'gender':
          genderPopup.value.close();
          break;
        case 'birthday':
          birthdayPopup.value.close();
          break;
      }
    };
    
    // 选择性别
    const selectGender = (gender: string) => {
      formData.gender = gender;
    };
    
    // 选择头像
    const chooseAvatar = () => {
      openAlbum('album').then((result: unknown) => {
        console.error('上传成功', result)
        userAvatar.value = result.fileId ;
        updateInfo({ avatar: result.fileId });
      });
    };
    
    // 更新用户信息
    const updateInfo = (data: Record<string, any>) => {
      updateInfoApi(data).then(() => {
        userStore.initUserInfoApi();
        showToast('修改成功');
      }).catch(() => {
        showToast('修改失败');
      });
    };
    
    // 保存昵称
    const saveNickname = () => {
      if (!formData.nickname.trim()) {
        showToast('昵称不能为空');
        return;
      }
      
      updateInfo({ nick_name: formData.nickname });
      closeModal('nickname');
    };
    
    // 保存手机号
    const savePhone = () => {
      if (!formData.phone.trim() || !/^\d{11}$/.test(formData.phone)) {
        showToast('请输入有效的手机号');
        return;
      }
      
      updateInfo({ phone: formData.phone });
      closeModal('phone');
    };
    
    // 保存个人简介
    const saveBio = () => {
      updateInfo({ bio: formData.bio });
      closeModal('description');
    };
    
    // 保存性别
    const saveGender = () => {
      updateInfo({ gender: formData.gender });
      closeModal('gender');
    };
    
    // 保存生日
    const saveBirthday = () => {
      const [yearIndex, monthIndex, dayIndex] = birthdayPickerValue.value;
      const year = years.value[yearIndex];
      const month = months.value[monthIndex];
      const day = days.value[dayIndex];
      
      const formattedBirthday = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      updateInfo({ birthday: formattedBirthday });
      closeModal('birthday');
    };
    
    // 显示提示
    const showToast = (message: string) => {
      uToast.value.show({
        title: message,
        type: 'success',
        duration: 2000
      });
    };
    
    return {
      previewOnlineFileApi,
      userInfo,
      userAvatar,
      formData,
      formatPhone,
      goBack,
      nicknamePopup,
      phonePopup,
      descriptionPopup,
      genderPopup,
      birthdayPopup,
      uToast,
      openModal,
      closeModal,
      selectGender,
      chooseAvatar,
      saveNickname,
      savePhone,
      saveBio,
      saveGender,
      saveBirthday,
      years,
      months,
      days,
      birthdayPickerValue,
      birthdayChange
    };
  }
});
</script>

<style lang="scss" scoped>
/* 色彩系统 */
$primary: #FF7D45;
$primary-deep: #E86835;
$primary-light: #FFE6D9;
$text-title: #2D3436;
$text-body: #636E72;
$text-auxiliary: #B2BEC3;
$background: #FFFFFF;
$background-secondary: #F9FAFB;
$divider: #EBEEF5;
$success: #4CAF50;
$warning: #FFC107;
$error: #FF5252;
$info: #2196F3;

/* 基础样式 */
.profile-page {
  background-color: $background;
  color: $text-body;
  line-height: 1.5;
  font-size: 28rpx;
  min-height: 100vh;
}

/* 页面顶部渐变 */
.gradient-header {
  height: 240rpx;
  background: linear-gradient(180deg, rgba(255,125,69,0.1) 0%, rgba(255,255,255,0) 100%);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.container {
  padding: 32rpx;
  max-width: 750rpx;
  margin: 0 auto;
  padding-bottom: 80rpx;
  position: relative;
  z-index: 1;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  height: 88rpx;
  margin-bottom: 32rpx;
}

.back-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  
  image {
    width: 36rpx;
    height: 36rpx;
  }
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  color: $text-title;
}

/* 头像上传区域 */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60rpx 0;
}

.avatar-container {
  width: 180rpx;
  height: 180rpx;
  border-radius: 90rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.2);
  margin-bottom: 16rpx;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  }
  
  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .edit-icon {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60rpx;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24rpx;
  }
}

.avatar-label {
  color: $primary;
  font-size: 26rpx;
  margin-top: 16rpx;
}

/* 列表项样式 */
.info-item {
  display: flex;
  align-items: center;
  padding: 0;
  height: 112rpx; /* 严格设置为56px(112rpx) */
  min-height: unset;
  border-bottom: 2rpx solid $divider;
  box-sizing: border-box;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  flex: 0 0 160rpx;
  color: $text-title;
  font-weight: 500;
  font-size: 28rpx;
  margin-right: 16rpx;
}

.info-content {
  flex: 1;
  text-align: right;
  color: $text-body;
  padding-right: 16rpx;
  font-size: 28rpx;
  margin-right: 8rpx;
}

/* 个人简介特殊处理 */
.info-description {
  display: flex;
  flex-direction: column;
  padding: 16rpx 0;
  border-bottom: 2rpx solid $divider;
  min-height: 112rpx;
  box-sizing: border-box;
}

.info-description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.info-description-text {
  color: $text-title;
  font-weight: 500;
  font-size: 28rpx;
}

.edit-icon-text {
  color: $primary;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  
  image {
    width: 24rpx;
    height: 24rpx;
    margin-left: 8rpx;
  }
}

.description-content {
  font-size: 26rpx;
  color: $text-body;
  line-height: 1.5;
  white-space: pre-line;
  max-height: 72rpx;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-placeholder {
  color: $text-auxiliary;
  font-size: 26rpx;
}

.arrow-icon {
  margin-left: 8rpx;
  color: $text-auxiliary;
  
  image {
    width: 28rpx;
    height: 28rpx;
  }
}

/* 模态框样式 */
.modal-content {
  background-color: white;
  border-radius: 32rpx;
  padding: 40rpx;
  width: 640rpx;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-header {
  text-align: center;
  margin-bottom: 36rpx;
  position: relative;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 500;
  color: $text-title;
}

.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  image {
    width: 36rpx;
    height: 36rpx;
  }
}

/* 表单样式 */
.form-group {
  margin-bottom: 36rpx;
  position: relative;
}

.form-control {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  padding: 0 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid $text-auxiliary;
  background-color: $background-secondary;
  font-size: 28rpx;
  color: $text-title;
  box-sizing: border-box;
}

/* 多行文本 */
textarea.form-control {
  height: auto;
  min-height: 180rpx;
  padding: 20rpx 24rpx;
  line-height: 1.5;
}

/* 字段计数 */
.char-count {
  text-align: right;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: $text-auxiliary;
}

/* 性别选择样式 */
.gender-options {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 36rpx;
}

.gender-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28rpx;
  border-radius: 16rpx;
  border: 2rpx solid $divider;
  background-color: $background;
  transition: all 0.2s;
  height: 96rpx;
  box-sizing: border-box;
}

.gender-option.selected {
  border-color: $primary;
  background-color: $primary-light;
}

.gender-option-text {
  flex: 1;
  font-size: 30rpx;
  color: $text-title;
  font-weight: 500;
}

.gender-option .radio-custom {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid $text-auxiliary;
  border-radius: 50%;
  position: relative;
  box-sizing: border-box;
}

.gender-option.selected .radio-custom {
  border: 8rpx solid $primary;
}

/* 生日选择器 */
.birthday-picker {
  width: 100%;
  height: 360rpx;
  text-align: center;
  margin-bottom: 36rpx;
}

.birthday-modal {
  width: 640rpx;
}

.picker-item {
  line-height: 80rpx;
  height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 确认按钮样式 */
.btn-save {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, $primary 0%, $primary-deep 100%);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.15);
  padding: 0;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.15);
  }
}

/* 修改手机号模态框特别处理 */
:deep(.phone-popup) {
  max-width: 95%;
}
</style>
