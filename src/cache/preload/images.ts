/**
 * 图片缓存模块
 */

import { previewOnlineFileApi } from '@/api/file';
import { getPlatform } from '@/utils/common';
import {  downloadFile } from '@/utils/download';

// 图片缓存映射 
const imageCache = new Map<string, string>();

// 文件获取Promise映射 - 防止重复下载/预加载
const filePromises = new Map<string, Promise<string>>();

/**
 * 获取图片（主要接口）
 */
export async function getImage(fileName: string): Promise<string> {
  const platform = getPlatform();
  
  // 检查缓存
  if (imageCache.has(fileName)) {
    const cachedPath = imageCache.get(fileName)!;
    return cachedPath;
  }
  
  // 检查是否正在获取中
  if (filePromises.has(fileName)) {
    console.log('图片正在获取中，等待完成:', fileName);
    return await filePromises.get(fileName)!;
  }
  
  // 创建获取Promise
  const getPromise = (async () => {
    try {
      if (platform === 'h5') {
        // H5环境：直接返回URL
        const url = previewOnlineFileApi(fileName);
        imageCache.set(fileName, url);
        return url;
      } else {
        // APP环境：下载到本地
        const localPath = await downloadFile(fileName);
        imageCache.set(fileName, localPath);
        return localPath;
      }
    } catch (error) {
      console.error('获取图片失败:', error);
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
 * 预加载图片（同步等待完成）
 */
export async function preloadImage(fileName: string): Promise<void> {
  // 如果已经缓存，直接返回
  if (imageCache.has(fileName)) {
    return;
  }
  
  // 如果正在获取中，等待完成
  if (filePromises.has(fileName)) {
    await filePromises.get(fileName)!;
    return;
  }
  
  const platform = getPlatform();
  
  if (platform === 'h5') {
    // H5环境：通过创建img元素预加载到浏览器缓存
    const imageUrl = previewOnlineFileApi(fileName);
    await new Promise<void>((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        imageCache.set(fileName, imageUrl); // 存储URL表示已缓存
        resolve();
      };
      img.onerror = () => {
        console.error('预加载图片失败:', fileName);
        reject(new Error(`预加载图片失败: ${fileName}`));
      };
      img.src = imageUrl;
    });
  } else {
    // APP环境：同步预加载，等待完成
    await getImage(fileName);
  }
}

/**
 * 通过fileName读取本地图片文件
 */
export function getLocalImagePath(fileName: string): string | null {
  const platform = getPlatform();
  
  // H5环境：没有本地文件
  if (platform === 'h5') {
    return null;
  }
  
  // APP环境：返回本地路径
  return imageCache.get(fileName) || null;
}

/**
 * 检查图片是否已缓存到本地
 */
export function isImageCached(fileName: string): boolean {
  const platform = getPlatform();
  
  // 检查缓存映射
  if (!imageCache.has(fileName)) {
    return false;
  }
  
  // APP环境：需要检查本地文件是否存在
  if (platform !== 'h5') {
    try {
      // #ifdef APP-PLUS
      const filePath = imageCache.get(fileName)!;
      // 这里可以添加文件存在性检查
      // 暂时返回true，实际使用时可以根据需要添加检查逻辑
      return true;
      // #endif
    } catch {
      imageCache.delete(fileName);
      return false;
    }
  }
  
  // H5环境：只要在缓存中就认为已缓存
  return true;
}

/**
 * 清除指定文件的缓存
 */
export function clearImageCache(fileName: string): void {
  imageCache.delete(fileName);
}

/**
 * 清除所有图片缓存
 */
export function clearAllImageCache(): void {
  imageCache.clear();
}