import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { themes } from '@/config/theme'
import { type ThemeConfig, type ThemeColorKey } from '@/types/theme/theme'

export const useThemeStore = defineStore('useThemeStore', () => {
  // 当前主题名称
  const currentTheme = ref<string>('default')
  
  // 当前主题配置
  const currentThemeConfig = computed(() => themes[currentTheme.value])
  
  // 获取所有可用主题
  const availableThemes = computed(() => Object.values(themes))
  
  // 切换主题
  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      currentTheme.value = themeName
      applyTheme(themes[themeName])
      // 保存到本地存储
      uni.setStorageSync('app_theme', themeName)
    }
  }
  
  // 应用主题到CSS变量
  const applyTheme = (theme: ThemeConfig) => {
    try {
      // 设置页面根元素的data-theme属性
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.$vm) {
        const pageEl = currentPage.$vm.$el
        if (pageEl) {
          pageEl.setAttribute('data-theme', theme.name)
        }
      }
      
      // 设置全局CSS变量（H5和APP都支持）
      const root = document.documentElement
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value)
      })
    } catch (error) {
      console.warn('应用主题时出错:', error)
    }
  }
  
  // 初始化主题
  const initTheme = () => {
    // 从本地存储获取主题设置
    const savedTheme = uni.getStorageSync('app_theme')
    if (savedTheme && themes[savedTheme]) {
      currentTheme.value = savedTheme
    }
    // 应用当前主题
    applyTheme(currentThemeConfig.value)
  }
  
  // 获取主题颜色
  const getThemeColor = (colorKey: ThemeColorKey) => {
    return currentThemeConfig.value.colors[colorKey]
  }
  
  return {
    currentTheme,
    currentThemeConfig,
    availableThemes,
    setTheme,
    initTheme,
    getThemeColor
  }
}) 