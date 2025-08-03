/**
 * 文件缓存工具 - 入口文件
 * 提供统一的文件获取接口和批量处理
 */

// 导入各个模块的主要接口
import { getImage, preloadImage  } from './preload/images';
import { getVideo, preloadVideo } from './preload/videos';
import { getAudio, preloadAudio } from './preload/audios';

/**
 * 获取文件扩展名
 */
function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return fileName.substring(lastDotIndex + 1).toLowerCase();
}

/**
 * 按文件类型分组
 */
function groupFilesByType(fileNames: string[]): {
  images: string[];
  videos: string[];
  audios: string[];
} {
  const images: string[] = [];
  const videos: string[] = [];
  const audios: string[] = [];
  
  fileNames.forEach(fileName => {
    const ext = getFileExtension(fileName);
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(ext)) {
      images.push(fileName);
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp', 'm4v'].includes(ext)) {
      videos.push(fileName);
    } else if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma', 'amr'].includes(ext)) {
      audios.push(fileName);
    }
  });
  
  return { images, videos, audios };
}

/**
 * 获取单个文件（主要接口）
 */
export async function getFile(fileName: string): Promise<string> {
  const results = await getFiles([fileName]);

  return results[0] || '';
}

/**
 * 批量获取文件（主要接口）
 */
export async function getFiles(fileNames: string[]): Promise<string[]> {
  if (!fileNames || fileNames.length === 0) return [];
  
  // 去重
  const uniqueFileNames = [...new Set(fileNames)].filter(Boolean);
  if (uniqueFileNames.length === 0) return [];
  
  // 按文件类型分组
  const { images, videos, audios } = groupFilesByType(uniqueFileNames);
  
  // 并行处理各类型文件
  const promises: Promise<string[]>[] = [];
  
  if (images.length > 0) {
    promises.push(Promise.all(images.map(fileName => getImage(fileName))));
  }
  
  if (videos.length > 0) {
    promises.push(Promise.all(videos.map(fileName => getVideo(fileName))));
  }
  
  if (audios.length > 0) {
    promises.push(Promise.all(audios.map(fileName => getAudio(fileName))));
  }
  
  const results = await Promise.all(promises);
  return results.flat();
}

/**
 * 预加载单个文件
 */
export async function preloadFile(fileName: string): Promise<void> {
  await preloadFiles([fileName]);
}

/**
 * 批量预加载文件
 */
export async function preloadFiles(fileNames: string[]): Promise<void> {
  if (!fileNames || fileNames.length === 0) return;
  
  // 去重
  const uniqueFileNames = [...new Set(fileNames)].filter(Boolean);
  if (uniqueFileNames.length === 0) return;
  
  // 按文件类型分组
  const { images, videos, audios } = groupFilesByType(uniqueFileNames);
  
  // 并行预加载各类型文件
  const promises: Promise<void>[] = [];
  
  if (images.length > 0) {
    promises.push(...images.map(fileName => preloadImage(fileName)));
  }
  
  if (videos.length > 0) {
    promises.push(...videos.map(fileName => preloadVideo(fileName)));
  }
  
  if (audios.length > 0) {
    promises.push(...audios.map(fileName => preloadAudio(fileName)));
  }
  
  await Promise.all(promises);
}