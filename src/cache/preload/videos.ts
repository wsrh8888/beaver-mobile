/**
 * 视频缓存模块
 */

import { previewOnlineFileApi } from '@/api/file';
import { getPlatform } from '@/utils/common';
import {  downloadFile } from '@/utils/download';

// 视频缓存映射
const videoCache = new Map<string, string>();

// 文件获取Promise映射 - 防止重复下载/预加载
const filePromises = new Map<string, Promise<string>>();

/**
 * 获取视频（主要接口）
 */
export async function getVideo(fileName: string): Promise<string> {
  const platform = getPlatform();
  
  // 检查缓存
  if (videoCache.has(fileName)) {
    const cachedPath = videoCache.get(fileName)!;
    console.log('发现视频缓存:', fileName, '->', cachedPath);
    return cachedPath;
  }
  
  // 检查是否正在获取中
  if (filePromises.has(fileName)) {
    console.log('视频正在获取中，等待完成:', fileName);
    return await filePromises.get(fileName)!;
  }
  
  // 创建获取Promise
  const getPromise = (async () => {
    try {
      if (platform === 'h5') {
        // H5环境：直接返回URL
        const url = previewOnlineFileApi(fileName);
        videoCache.set(fileName, url);
        return url;
      } else {
        // APP环境：下载到本地
        const localPath = await downloadFile(fileName);
        videoCache.set(fileName, localPath);
        return localPath;
      }
    } catch (error) {
      console.error('获取视频失败:', error);
      return previewOnlineFileApi(fileName);
    }
  })();
  
  // 保存Promise
  filePromises.set(fileName, getPromise);
  
  try {
    const result = await getPromise;
    return result;
  } finally {
    // 清理Promise
    filePromises.delete(fileName);
  }
}

/**
 * 预加载视频（同步等待完成）
 */
export async function preloadVideo(fileName: string): Promise<void> {
  // 如果已经缓存，直接返回
  if (videoCache.has(fileName)) {
    return;
  }
  
  // 如果正在获取中，等待完成
  if (filePromises.has(fileName)) {
    await filePromises.get(fileName)!;
    return;
  }
  
  const platform = getPlatform();
  
  if (platform === 'h5') {
    // H5环境：通过创建video元素预加载到浏览器缓存
    const videoUrl = previewOnlineFileApi(fileName);
    await new Promise<void>((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        videoCache.set(fileName, videoUrl); // 存储URL表示已缓存
        resolve();
      };
      video.onerror = () => {
        console.error('预加载视频失败:', fileName);
        reject(new Error(`预加载视频失败: ${fileName}`));
      };
      video.src = videoUrl;
    });
  } else {
    // APP环境：同步预加载，等待完成
    await getVideo(fileName);
  }
}

/**
 * 通过fileName读取本地视频文件
 */
export function getLocalVideoPath(fileName: string): string | null {
  const platform = getPlatform();
  
  // H5环境：没有本地文件
  if (platform === 'h5') {
    return null;
  }
  
  // APP环境：返回本地路径
  return videoCache.get(fileName) || null;
}

/**
 * 检查视频是否已缓存到本地
 */
export function isVideoCached(fileName: string): boolean {
  const platform = getPlatform();
  
  // 检查缓存映射
  if (!videoCache.has(fileName)) {
    return false;
  }
  
  // APP环境：需要检查本地文件是否存在
  if (platform !== 'h5') {
    try {
      // #ifdef APP-PLUS
      const filePath = videoCache.get(fileName)!;
      // 这里可以添加文件存在性检查
      // 暂时返回true，实际使用时可以根据需要添加检查逻辑
      return true;
      // #endif
    } catch {
      videoCache.delete(fileName);
      return false;
    }
  }
  
  // H5环境：只要在缓存中就认为已缓存
  return true;
}

/**
 * 清除指定文件的缓存
 */
export function clearVideoCache(fileName: string): void {
  videoCache.delete(fileName);
}

/**
 * 清除所有视频缓存
 */
export function clearAllVideoCache(): void {
  videoCache.clear();
} 