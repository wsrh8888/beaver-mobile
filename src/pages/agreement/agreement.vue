<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="back-button" @click="handleGoBack">
        <image src="@/static/img/common/back-arrow.svg" mode="aspectFit" class="back-icon"></image>
      </view>
      <view class="nav-title">服务条款</view>
    </view>
    
    <!-- 内容容器 -->
    <view class="content-container">
      <view class="content">
        <view class="terms-title">海狸用户服务协议</view>
        <view class="update-time">更新日期：2025年4月3日</view>
        
        <view class="terms-intro">
          欢迎您使用海狸！本协议是您与海狸之间关于使用我们提供的产品和服务的法律协议。请您在注册和使用前仔细阅读本协议的全部内容。
        </view>
        
        <view class="section-title">1. 服务介绍</view>
        <view class="section-content">
          海狸是一款陌生人社交应用，旨在帮助用户扩展社交圈子，发现共同兴趣爱好的新朋友。我们提供以下服务：
        </view>
        <view class="terms-list">
          <view class="list-item">基于兴趣和地理位置的好友推荐</view>
          <view class="list-item">一对一及群组即时通讯</view>
          <view class="list-item">分享生活动态的社区功能</view>
          <view class="list-item">用户个人资料展示和管理</view>
          <view class="list-item">基于位置的附近活动和用户发现</view>
        </view>
        
        <view class="section-title">2. 账户注册与安全</view>
        <view class="section-content">
          使用我们的服务，您需要：
        </view>
        <view class="terms-list">
          <view class="list-item">创建账户并提供真实、准确、完整的个人资料信息。</view>
          <view class="list-item">妥善保管您的账号和密码，对通过您的账号进行的所有活动负责。</view>
          <view class="list-item">定期更新您的个人资料，确保信息的准确性。</view>
          <view class="list-item">如发现账号遭到未授权使用或存在安全漏洞，请立即通知我们。</view>
        </view>
        <view class="section-content">
          <text class="emphasis">注意：</text>您必须年满16周岁才能使用我们的服务。如您未满18周岁，请在监护人指导下使用本服务。
        </view>
        
        <view class="section-title">3. 用户行为规范</view>
        <view class="section-content">
          使用海狸时，您同意不会：
        </view>
        <view class="terms-list">
          <view class="list-item">发布、传播违反国家法律法规的内容。</view>
          <view class="list-item">发布虚假、误导、欺诈或有害信息。</view>
          <view class="list-item">侵犯他人知识产权或隐私权。</view>
          <view class="list-item">骚扰、威胁或冒犯其他用户。</view>
          <view class="list-item">使用任何自动化手段或脚本访问我们的服务。</view>
          <view class="list-item">尝试干扰、破坏平台的正常运行或规避我们的安全措施。</view>
        </view>
        
        <view class="section-title">4. 内容规范</view>
        <view class="section-content">
          您通过海狸创建、上传、发布的所有内容必须：
        </view>
        <view class="terms-list">
          <view class="list-item">遵守相关法律法规。</view>
          <view class="list-item">不包含色情、暴力、歧视或仇恨言论。</view>
          <view class="list-item">不侵犯第三方的知识产权、肖像权、名誉权等合法权益。</view>
          <view class="list-item">不包含广告、垃圾信息或恶意软件链接。</view>
        </view>
        <view class="section-content">
          我们有权但无义务审核用户内容，并可自行决定删除或拒绝任何违反本协议的内容。
        </view>
        
        <view class="section-title">5. 知识产权</view>
        <view class="section-content">
          关于知识产权，请注意以下几点：
        </view>
        <view class="terms-list">
          <view class="list-item">海狸及其标识、图标、设计等所有相关的知识产权归我们所有。</view>
          <view class="list-item">您保留您创建并分享内容的知识产权，但授予我们全球性、免费、非独占的许可，允许我们使用、复制、修改、展示和分发您的内容。</view>
          <view class="list-item">如您认为平台上的内容侵犯了您的知识产权，请通过下方联系方式告知我们。</view>
        </view>
        
        <view class="section-title">6. 服务变更与终止</view>
        <view class="section-content">
          关于我们服务的变更和终止规则：
        </view>
        <view class="terms-list">
          <view class="list-item">我们可能会不时更新或修改服务内容、功能和收费标准。</view>
          <view class="list-item">我们保留在任何时候暂停或终止部分或全部服务的权利。</view>
          <view class="list-item">如您违反本协议，我们可能会限制、暂停或终止您的账户访问权限。</view>
          <view class="list-item">您可以随时停止使用我们的服务，或按照平台提供的方式注销您的账户。</view>
        </view>
        
        <view class="section-title">7. 免责声明</view>
        <view class="section-content">
          使用海狸时，请理解并同意：
        </view>
        <view class="terms-list">
          <view class="list-item">我们的服务按"现状"和"可用性"提供，不提供任何明示或暗示的保证。</view>
          <view class="list-item">我们不对用户之间的互动和交流负责，请谨慎分享个人信息。</view>
          <view class="list-item">我们不对因网络故障、系统维护、不可抗力等导致的服务中断或数据丢失负责。</view>
          <view class="list-item">我们对服务中第三方提供的内容、网站或服务不承担责任。</view>
        </view>
        
        <view class="section-title">8. 协议修改</view>
        <view class="section-content">
          我们可能会不时修改本协议。当我们进行重大变更时，会在应用内发布通知。您继续使用我们的服务即表示您接受修改后的条款。
        </view>
        
        <view class="contact-info">
          如果您对我们的服务条款有任何疑问或建议，请通过以下方式与我们联系：
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
      handleGoBack,
      
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
