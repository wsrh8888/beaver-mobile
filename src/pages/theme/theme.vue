<template>
  <view class="theme-page">
    <BeaverLayout
      title="主题设置"
      :show-background="true"
      background-type="gradient"
      :background-height="120"
      @back="goBack"
    >
      <view class="content">
        <!-- 主题选择卡片 -->
        <view class="theme-card">
          <view class="theme-header">
            <text class="theme-title">选择主题</text>
            <text class="theme-subtitle">选择你喜欢的主题风格</text>
          </view>
          
          <view class="theme-grid">
            <view 
              v-for="theme in availableThemes" 
              :key="theme.name"
              class="theme-item"
              :class="{ active: currentTheme === theme.name }"
              @click="selectTheme(theme.name)"
            >
              <view class="theme-preview" :style="getThemePreviewStyle(theme)">
                <view class="preview-header"></view>
                <view class="preview-content">
                  <view class="preview-text"></view>
                  <view class="preview-button"></view>
                </view>
              </view>
              <text class="theme-label">{{ theme.label }}</text>
              <view v-if="currentTheme === theme.name" class="theme-check">
                <text class="check-icon">✓</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 主题信息 -->
        <view class="info-card">
          <view class="info-item">
            <text class="info-title">当前主题</text>
            <text class="info-value">{{ currentThemeConfig.label }}</text>
          </view>
          <view class="info-item">
            <text class="info-title">主题版本</text>
            <text class="info-value">v1.0.0</text>
          </view>
        </view>
      </view>
    </BeaverLayout>
  </view>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BeaverLayout } from '@/component';
import { useThemeStore } from '@/pinia/theme/theme';
import { type ThemeConfig } from '@/types/theme/theme';

export default {
  name: 'Theme',
  components: {
    BeaverLayout
  },
  setup() {
    const themeStore = useThemeStore();
    
    const currentTheme = computed(() => themeStore.currentTheme);
    const currentThemeConfig = computed(() => themeStore.currentThemeConfig);
    const availableThemes = computed(() => themeStore.availableThemes);

    const goBack = () => {
      uni.navigateBack();
    };

    const selectTheme = (themeName: string) => {
      themeStore.setTheme(themeName);
      // 显示切换成功提示
      uni.showToast({
        title: '主题切换成功',
        icon: 'success',
        duration: 1500
      });
    };

    const getThemePreviewStyle = (theme: ThemeConfig) => {
      return {
        '--preview-primary': theme.colors.primary,
        '--preview-bg': theme.colors.background,
        '--preview-text': theme.colors.textBody,
        '--preview-divider': theme.colors.divider
      };
    };

    onMounted(() => {
      // 确保主题已初始化
      themeStore.initTheme();
    });

    return {
      currentTheme,
      currentThemeConfig,
      availableThemes,
      goBack,
      selectTheme,
      getThemePreviewStyle
    };
  },
};
</script>

<style lang="scss" scoped>
.theme-page {
  min-height: 100vh;
}

.content {
  padding: 16px;
  max-width: 375px;
  margin: 0 auto;
}

.theme-card {
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  padding: 20px;
}

.theme-header {
  text-align: center;
  margin-bottom: 24px;
}

.theme-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: var(--textTitle, #2D3436);
  margin-bottom: 8px;
}

.theme-subtitle {
  display: block;
  font-size: 14px;
  color: var(--textAuxiliary, #B2BEC3);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.theme-item {
  position: relative;
  background-color: var(--backgroundSecondary, #F9FAFB);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &.active {
    border-color: var(--primary, #FF7D45);
    background-color: var(--primaryLight, #FFE6D9);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  background-color: var(--preview-bg);
  border: 1px solid var(--preview-divider);
}

.preview-header {
  height: 16px;
  background-color: var(--preview-primary);
}

.preview-content {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preview-text {
  height: 6px;
  background-color: var(--preview-text);
  border-radius: 3px;
  opacity: 0.6;
}

.preview-button {
  height: 10px;
  width: 30px;
  background-color: var(--preview-primary);
  border-radius: 5px;
  align-self: flex-end;
}

.theme-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--textTitle, #2D3436);
}

.theme-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background-color: var(--primary, #FF7D45);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.info-card {
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }
}

.info-title {
  color: var(--textTitle, #2D3436);
  font-size: 14px;
  font-weight: 400;
}

.info-value {
  color: var(--textBody, #636E72);
  font-size: 14px;
  font-weight: 400;
}
</style> 