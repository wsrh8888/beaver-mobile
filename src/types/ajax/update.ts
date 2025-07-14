// 上报用户版本请求
export interface IReportVersionReq {
  deviceId: string; // 设备ID(必须)
  appId: string; // 更新ID
  platformId: number; // 平台ID：1=Windows, 2=MacOS, 3=iOS, 4=Android, 5=HarmonyOS
  archId: number; // 架构ID：1=WinX64, 2=WinArm64, 3=MacIntel, 4=MacApple, 5=iOS, 6=Android, 7=HarmonyOS
  version: string; // 版本号
}

// 上报用户版本响应
export interface IReportVersionRes {
  message: string;
}

// 获取最新版本请求
export interface IGetLatestVersionReq {
  deviceId: string; // 设备ID(必须)
  appId: string; // 更新ID
  platformId: number; // 平台ID：1=Windows, 2=MacOS, 3=iOS, 4=Android, 5=HarmonyOS
  archId: number; // 架构ID：1=WinX64, 2=WinArm64, 3=MacIntel, 4=MacApple, 5=iOS, 6=Android, 7=HarmonyOS
  version: string; // 当前版本号
}

// 获取最新版本响应
export interface IGetLatestVersionRes {
  hasUpdate: boolean; // 是否有更新
  version?: string; // 最新版本号
  fileId: string; // 文件ID
  size?: number; // 安装包大小
  md5?: string; // MD5校验
  releaseNotes?: string; // 更新日志
  forceUpdate?: boolean; // 是否强制更新
} 