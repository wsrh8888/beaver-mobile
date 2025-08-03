import Logo from '@/static/logo/logo.png'

// 应用基本信息
export const APP_CONFIG = {
  // 应用名称
  name: '海狸',

  // 英语名称
  englishName: 'beaver',

  // 应用描述
  description: '智能即时通讯应用',
  // 开发者信息
  developer: '海狸IM团队',
  // 支持邮箱
  email: '751135385@qq.com',

  logo: Logo,
} as const;


// 导出所有配置
export default {
  APP_CONFIG,
};
