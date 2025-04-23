<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="back-button" @click="handleGoBack">
        <image src="@/static/img/common/back-arrow.svg" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="nav-title">隐私政策</view>
    </view>
    
    <!-- 内容容器 -->
    <view class="content-container">
      <view class="content">
        <view class="terms-title">海狸隐私政策</view>
        <view class="update-time">更新日期：2025年4月3日</view>
        
        <view class="terms-intro">
          海狸重视您的隐私。本隐私政策说明了我们如何收集、使用、披露、处理和保护您在使用我们的服务时所提供的信息。请您仔细阅读本政策，了解我们的隐私惯例。
        </view>
        
        <view class="section-title">1. 我们收集的信息</view>
        <view class="section-content">
          我们可能会收集以下类型的信息：
        </view>
        <view class="terms-list">
          <view class="list-item">您提供的个人信息：注册时的手机号码、密码、个人资料（如头像、昵称、性别、生日）等。</view>
          <view class="list-item">您创建的内容：发布的动态、评论、消息等。</view>
          <view class="list-item">设备信息：设备型号、操作系统版本、设备标识符、网络信息等。</view>
          <view class="list-item">位置信息：在您授权的情况下，我们可能会收集您的精确或大致位置信息。</view>
          <view class="list-item">使用数据：应用使用频率、崩溃数据、性能数据等信息。</view>
        </view>
        
        <view class="section-title">2. 我们如何使用信息</view>
        <view class="section-content">
          我们使用收集的信息用于：
        </view>
        <view class="terms-list">
          <view class="list-item">提供、维护和改进我们的服务。</view>
          <view class="list-item">处理和完成您的交易。</view>
          <view class="list-item">向您发送技术通知、更新、安全警报和支持信息。</view>
          <view class="list-item">提供客户服务并回应您的请求。</view>
          <view class="list-item">根据您的兴趣和位置向您推荐好友和内容。</view>
          <view class="list-item">监控和分析趋势、使用情况和活动。</view>
          <view class="list-item">遵守法律义务和执行我们的服务条款。</view>
        </view>
        
        <view class="section-title">3. 信息共享与披露</view>
        <view class="section-content">
          我们可能在以下情况下共享您的信息：
        </view>
        <view class="terms-list">
          <view class="list-item">根据您的选择在平台上公开分享您的个人资料和内容。</view>
          <view class="list-item">与提供服务所必需的第三方服务提供商共享。</view>
          <view class="list-item">在法律要求或允许的情况下，响应法律程序或政府请求。</view>
          <view class="list-item">保护海狸、我们的用户或公众的权利和安全。</view>
          <view class="list-item">在涉及合并、收购、资产出售或类似交易时与相关方共享。</view>
        </view>
        <view class="section-content">
          <text class="emphasis">注意：</text>我们不会向第三方出售您的个人信息。
        </view>
        
        <view class="section-title">4. 数据安全</view>
        <view class="section-content">
          我们采取合理的技术、管理和物理措施来保护您的信息不被未经授权的访问、使用或披露。但请了解，互联网传输方式无法保证100%的安全性。
        </view>
        
        <view class="section-title">5. 信息存储与国际传输</view>
        <view class="section-content">
          我们可能在您所在国家/地区以外的服务器上处理和存储您的信息。使用我们的服务，即表示您同意这种国际传输和处理。
        </view>
        
        <view class="section-title">6. 您的权利与选择</view>
        <view class="section-content">
          关于您的个人信息，您有权：
        </view>
        <view class="terms-list">
          <view class="list-item">访问和查看您的个人资料信息。</view>
          <view class="list-item">更正不准确或不完整的信息。</view>
          <view class="list-item">删除您的账户和相关数据。</view>
          <view class="list-item">控制通知、位置服务和其他权限设置。</view>
        </view>
        
        <view class="section-title">7. 儿童隐私</view>
        <view class="section-content">
          我们的服务不面向16岁以下的儿童。如果我们发现未经父母同意收集了16岁以下儿童的个人信息，我们将采取措施删除这些信息。
        </view>
        
        <view class="section-title">8. 隐私政策的变更</view>
        <view class="section-content">
          我们可能会不时更新本隐私政策。当我们进行重大变更时，会在应用内通知您并获取您的同意（如适用）。建议您定期查看本政策以了解最新信息。
        </view>
        
        <view class="contact-info">
          如果您对我们的隐私政策有任何疑问或建议，请通过以下方式与我们联系：
          <view class="contact-email">751135385@qq.com</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    // 返回上一页
    const handleGoBack = () => {
      uni.navigateBack();
    };
    
    return {
      handleGoBack
    };
  }
});
</script>

<style lang="scss" scoped>
/* 整体容器 */
.container {
  min-height: 100vh;
  background-color: #FAFAFA;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.navbar {
  height: 112rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

/* 返回按钮 */
.back-button {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2D3436;
  background: rgba(0, 0, 0, 0.03);
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 页面标题 */
.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D3436;
}

/* 页面内容容器，添加上边距以避免被固定导航栏遮挡 */
.content-container {
  margin-top: 112rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 32rpx;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 32rpx;
  background: white;
  border-radius: 32rpx;
  margin: 32rpx 0;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
}

/* 服务条款标题 */
.terms-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 16rpx;
  text-align: center;
}

/* 更新时间 */
.update-time {
  font-size: 24rpx;
  color: #B2BEC3;
  text-align: center;
  margin-bottom: 48rpx;
}

/* 服务条款介绍 */
.terms-intro {
  font-size: 28rpx;
  color: #636E72;
  line-height: 1.6;
  margin-bottom: 48rpx;
}

/* 段落标题 */
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D3436;
  margin: 48rpx 0 24rpx;
  padding-left: 24rpx;
  border-left: 6rpx solid #FF7D45;
}

/* 首个段落标题不需要上边距 */
.section-title:first-of-type {
  margin-top: 0;
}

/* 段落内容 */
.section-content {
  font-size: 28rpx;
  color: #636E72;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

/* 列表样式 */
.terms-list {
  margin: 24rpx 0 32rpx;
  padding-left: 32rpx;
}

.list-item {
  font-size: 28rpx;
  color: #636E72;
  line-height: 1.6;
  margin-bottom: 16rpx;
  position: relative;
  padding-left: 24rpx;
  
  &::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #FF7D45;
  }
}

/* 强调文本 */
.emphasis {
  color: #FF7D45;
  font-weight: 500;
}

/* 底部联系信息 */
.contact-info {
  margin-top: 64rpx;
  padding-top: 32rpx;
  border-top: 1px solid #EBEEF5;
  font-size: 26rpx;
  color: #636E72;
  line-height: 1.6;
}

.contact-email {
  color: #4A6FA1;
  margin-top: 8rpx;
}

/* 底部按钮 */
.bottom-button {
  margin-top: 48rpx;
  height: 88rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #FF7D45 0%, #E86835 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 125, 69, 0.2);
}

/* 点击效果 */
.bottom-button:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(255, 125, 69, 0.15);
}
</style>
