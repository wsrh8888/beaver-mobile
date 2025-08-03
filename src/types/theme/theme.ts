// 主题类型定义
export interface ThemeConfig {
  name: string
  label: string
  colors: {
    primary: string
    primaryDeep: string
    primaryLight: string
    textTitle: string
    textBody: string
    textAuxiliary: string
    background: string
    backgroundSecondary: string
    divider: string
    success: string
    warning: string
    error: string
    info: string
  }
}

// 主题名称类型
export type ThemeName = 'default' | 'dark' | 'blue' | 'green'

// 主题颜色键类型
export type ThemeColorKey = keyof ThemeConfig['colors'] 