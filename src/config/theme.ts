import { type ThemeConfig } from '@/types/theme/theme'

// 预定义主题配置
export const themes: Record<string, ThemeConfig> = {
  default: {
    name: 'default',
    label: '默认主题',
    colors: {
      primary: '#FF7D45',
      primaryDeep: '#E86835',
      primaryLight: '#FFE6D9',
      textTitle: '#2D3436',
      textBody: '#636E72',
      textAuxiliary: '#B2BEC3',
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      divider: '#EBEEF5',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#FF5252',
      info: '#2196F3'
    }
  },
  dark: {
    name: 'dark',
    label: '深色主题',
    colors: {
      primary: '#FF7D45',
      primaryDeep: '#E86835',
      primaryLight: '#2A2A2A',
      textTitle: '#FFFFFF',
      textBody: '#E0E0E0',
      textAuxiliary: '#A0A0A0',
      background: '#1A1A1A',
      backgroundSecondary: '#2A2A2A',
      divider: '#404040',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#FF5252',
      info: '#2196F3'
    }
  },
  blue: {
    name: 'blue',
    label: '蓝色主题',
    colors: {
      primary: '#2196F3',
      primaryDeep: '#1976D2',
      primaryLight: '#E3F2FD',
      textTitle: '#2D3436',
      textBody: '#636E72',
      textAuxiliary: '#B2BEC3',
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      divider: '#EBEEF5',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#FF5252',
      info: '#2196F3'
    }
  },
  green: {
    name: 'green',
    label: '绿色主题',
    colors: {
      primary: '#4CAF50',
      primaryDeep: '#388E3C',
      primaryLight: '#E8F5E8',
      textTitle: '#2D3436',
      textBody: '#636E72',
      textAuxiliary: '#B2BEC3',
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      divider: '#EBEEF5',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#FF5252',
      info: '#2196F3'
    }
  }
} 