# 🦫 Beaver IM - 海狸即时通讯

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![UniApp](https://img.shields.io/badge/UniApp-3.x-orange.svg)](https://uniapp.dcloud.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![QQ群](https://img.shields.io/badge/QQ群-1013328597-blue.svg)](https://qm.qq.com/q/82rbf7QBzO)

> 🚀 **现代化即时通讯应用** - 基于 Vue3 + UniApp 构建，支持移动端、桌面端多平台，提供完整的社交聊天体验

[English](README_EN.md) | [中文](README.md)

---

## ✨ 核心特性

- 🔐 **安全认证** - 用户注册、登录、密码找回
- 💬 **即时通讯** - 私聊、群聊支持文本、图片、表情
- 👥 **社交功能** - 好友管理、二维码添加、朋友圈
- 🖼️ **多媒体支持** - 图片发送、头像上传（七牛云）
- 📱 **多端同步** - 移动端、桌面端数据实时同步
- 🔄 **实时通信** - WebSocket 长连接保证消息实时性
- 🎨 **现代化UI** - 简洁美观的用户界面

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **UniApp** - 跨平台应用开发框架
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **WebSocket** - 实时通信

## 📱 功能展示

### 🔐 用户认证
<div align="center">
  <img src="./static/mobile/login.jpg" width="200" alt="登录界面"/>
  <img src="./static/mobile/register.jpg" width="200" alt="注册界面"/>
  <img src="./static/mobile/find-password.jpg" width="200" alt="找回密码"/>
</div>

### 💬 聊天功能
<div align="center">
  <img src="./static/mobile/message.jpg" width="200" alt="消息主界面"/>
  <img src="./static/mobile/private-chat.jpg" width="200" alt="私聊聊天"/>
  <img src="./static/mobile/group-chat.jpg" width="200" alt="群聊聊天"/>
  <img src="./static/mobile/send-text.jpg" width="200" alt="发送文字"/>
  <img src="./static/mobile/send-emoji.jpg" width="200" alt="发送表情"/>
  <img src="./static/mobile/chat-details.jpg" width="200" alt="聊天详情"/>
</div>

### 👥 社交功能
<div align="center">
  <img src="./static/mobile/friend.jpg" width="200" alt="好友列表"/>
  <img src="./static/mobile/new-friends.jpg" width="200" alt="新的朋友"/>
  <img src="./static/mobile/friend-info.jpg" width="200" alt="好友资料"/>
  <img src="./static/mobile/edit-remark.jpg" width="200" alt="编辑备注"/>
</div>

### 🏠 朋友圈与群组
<div align="center">
  <img src="./static/mobile/moments.jpg" width="200" alt="朋友圈"/>
  <img src="./static/mobile/send-moments.jpg" width="200" alt="发布朋友圈"/>
  <img src="./static/mobile/group-list.jpg" width="200" alt="群聊列表"/>
  <img src="./static/mobile/create-group.jpg" width="200" alt="创建群聊"/>
  <img src="./static/mobile/group-details.jpg" width="200" alt="群聊详情"/>
  <img src="./static/mobile/add-members.jpg" width="200" alt="添加成员"/>
</div>

### 👤 个人中心
<div align="center">
  <img src="./static/mobile/mine.jpg" width="200" alt="我的主界面"/>
  <img src="./static/mobile/profile-edit.jpg" width="200" alt="编辑个人资料"/>
  <img src="./static/mobile/qcode.jpg" width="200" alt="二维码功能"/>
</div>

### ⚙️ 系统功能
<div align="center">
  <img src="./static/mobile/settings.jpg" width="200" alt="设置"/>
  <img src="./static/mobile/update.jpg" width="200" alt="更新"/>
  <img src="./static/mobile/feedback.jpg" width="200" alt="反馈"/>
  <img src="./static/mobile/about.jpg" width="200" alt="关于"/>
  <img src="./static/mobile/statement.jpg" width="200" alt="声明"/>
</div>

## 🚀 快速开始

### 环境要求
- Node.js >= 20.0.0

### 安装步骤
```bash
# 克隆项目
git clone https://github.com/wsrh8888/beaver-mobile.git
cd beaver-mobile

# 安装依赖
npm install

# 构建项目
npm run build_test

# 在 UniApp 客户端中导入项目并运行
```

## 🔗 相关项目

| 项目 | 仓库地址 | 说明 |
|------|----------|------|
| **beaver-server** | [GitHub](https://github.com/wsrh8888/beaver-server) / [Gitee](https://gitee.com/dawwdadfrf/beaver-server) | 后端服务 |
| **beaver-mobile** | [GitHub](https://github.com/wsrh8888/beaver-mobile) / [Gitee](https://gitee.com/dawwdadfrf/beaver-mobile) | 移动端应用 |
| **beaver-desktop** | [GitHub](https://github.com/wsrh8888/beaver-desktop) / [Gitee](https://gitee.com/dawwdadfrf/beaver-desktop) | 桌面端应用 |

## 📚 文档与资源

- 📖 **详细文档**: [Beaver IM 文档](https://wsrh8888.github.io/beaver-docs/)
- 🎥 **视频教程**: [B站教程](https://www.bilibili.com/video/BV1HrrKYeEB4/)
- 📱 **体验包下载**: [海狸IM Android体验包](https://github.com/wsrh8888/beaver-docs/releases/download/lastest/latest.apk)

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🆘 获取帮助

- 💬 QQ群：[1013328597](https://qm.qq.com/q/82rbf7QBzO)
- 📚 文档：[Beaver IM 文档](https://wsrh8888.github.io/beaver-docs/)
- 🎥 教程：[B站视频教程](https://www.bilibili.com/video/BV1HrrKYeEB4/)

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## ⭐ Star历史

[![Star History Chart](https://api.star-history.com/svg?repos=wsrh8888/beaver-mobile&type=Date)](https://star-history.com/#wsrh8888/beaver-mobile&Date)

## ⭐ 支持项目

如果这个项目对你有帮助，请给我们一个 ⭐ Star！

## ☕ 请作者喝杯茶

如果这个项目对你有帮助，欢迎请作者喝杯茶 ☕

<div align="center">
  <img src="./static/sponsor/wechat.jpg" width="200" alt="微信赞助码"/>
  <img src="./static/sponsor/zhifubao.jpg" width="200" alt="支付宝赞助码"/>
</div>

---


<div align="center">
  <strong>Made with ❤️ by Beaver IM Team</strong><br>
  <em>企业级即时通讯平台</em>
</div>






