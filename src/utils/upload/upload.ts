
import { getuploadQiniuApi } from '@/api/chat';
import Logger from '@/logger/logger';

// 压缩模式
export enum CompressMode {
  NONE = 'none',        // 不压缩
  CUSTOM = 'custom'     // 指定压缩
}

const COMPRESS_STRATEGIES = [
  // 大尺寸图片区域：优先降低尺寸，质量适中
  { quality: 85, width: 1920 },  // 全屏大图，较高质量
  { quality: 80, width: 1600 },  // 大尺寸，高质量
  { quality: 80, width: 1200 },  // 大尺寸，高质量
  { quality: 75, width: 1000 },  // 中大尺寸，较高质量
  
  // 中等尺寸图片区域：平衡尺寸和质量
  { quality: 70, width: 800 },   // 中等尺寸，较好质量
  { quality: 70, width: 700 },   // 中等尺寸，较好质量
  { quality: 65, width: 600 },   // 中等尺寸，中等质量
  { quality: 60, width: 500 },   // 中小尺寸，中等质量
  
  // 小尺寸图片区域：优先保证质量
  { quality: 65, width: 400 },   // 小尺寸，较好质量
  { quality: 75, width: 300 },   // 小尺寸，高质量
  { quality: 85, width: 200 },   // 很小尺寸，很高质量
  
  // 极小尺寸图片区域：最高质量优先
  { quality: 90, width: 150 },   // 极小尺寸，接近无损
  { quality: 95, width: 100 },   // 最小尺寸，近乎无损
  { quality: 100, width: 75 },   // 极小尺寸，无损质量
  { quality: 100, width: 50 },   // 极小尺寸，无损质量
];

// 大文件阈值：3MB
const LARGE_FILE_THRESHOLD = 3 * 1024 * 1024;

/**
 * @description: 压缩图片
 */
const compressImage = (filePath: string, quality: number = 80, width?: number): Promise<string> => {
  return new Promise((resolve) => {
    const options: any = {
      src: filePath,
      quality: quality,
      success: (res: any) => resolve(res.tempFilePath),
      fail: () => resolve(filePath) // 失败返回原图
    };
    
    // 如果指定宽度，添加尺寸压缩
    if (width) {
      options.compressedWidth = width;
    }
    
    uni.compressImage(options);
  });
};

/**
 * @description: 检查文件大小
 */
const checkFileSize = (filePath: string): Promise<number> => {
  return new Promise((resolve) => {
    // 优先使用uni.getFileSystemManager
    if (typeof uni.getFileSystemManager === 'function') {
      const fileSystemManager = uni.getFileSystemManager();
      fileSystemManager.getFileInfo({
        filePath: filePath,
        success: (res) => resolve(res.size),
        fail: () => resolve(1024 * 1024) // 默认1MB
      });
    } else {
      // 兼容方案：使用uni.getImageInfo估算文件大小
      uni.getImageInfo({
        src: filePath,
        success: (res) => {
          const estimatedSize = res.width * res.height * 4; // 每像素4字节
          resolve(estimatedSize);
        },
        fail: () => resolve(1024 * 1024) // 默认1MB
      });
    }
  });
};

/**
 * @description: 压缩图片到指定大小
 */
const compressImageToSize = async (filePath: string, maxSize: number): Promise<string> => {
  let currentPath = filePath;
  let currentSize = await checkFileSize(currentPath);
  
  console.log(`压缩图片: ${(currentSize / 1024 / 1024).toFixed(2)}MB → 目标${(maxSize / 1024 / 1024).toFixed(1)}MB`);
  
  if (currentSize <= maxSize) {
    return currentPath;
  }
  
  // 根据文件大小选择压缩策略起点
  let startIndex = 0;
  if (currentSize > LARGE_FILE_THRESHOLD) {
    // 大于3MB的文件，直接从尺寸压缩开始
    startIndex = 2;
  }
  
  for (let i = startIndex; i < COMPRESS_STRATEGIES.length; i++) {
    const { quality, width } = COMPRESS_STRATEGIES[i];
    
    try {
      currentPath = await compressImage(currentPath, quality, width);
      currentSize = await checkFileSize(currentPath);
      
      console.log(`策略${i + 1}: 质量${quality}% 宽度${width}px → ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
      
      if (currentSize <= maxSize) {
        console.log(`✅ 压缩成功: ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
        return currentPath;
      }
    } catch (error) {
      const logger = new Logger('文件上传工具');
      logger.error({
        text: '图片压缩失败',
        data: {
          error: error instanceof Error ? error.message : String(error),
          strategy: i + 1,
          quality,
          width
        }
      });
      console.error(`压缩失败:`, error);
    }
  }
  
  // 压缩失败提示
  if (currentSize > maxSize) {
    uni.showToast({
      title: `图片过大(${(currentSize / 1024 / 1024).toFixed(1)}MB)，请选择其他图片`,
      icon: 'none',
      duration: 3000
    });
  }
  
  return currentPath;
};

/**
 * @description: 打开相册选择图片并上传
 * @param sourceType 图片来源：'album' | 'camera'
 * @param count 选择图片数量，默认1张
 * @param compressMode 压缩模式，默认不压缩
 * @param maxSize 指定压缩时的最大文件大小（字节）
 * @returns Promise<any> 上传结果
 */
export function openAlbum(
  sourceType: 'album' | 'camera' = 'album', 
  count: number = 1,
  compressMode: CompressMode = CompressMode.NONE, 
  maxSize?: number
) {
  return new Promise((resolve, reject) => {
    const sizeType = compressMode === CompressMode.NONE ? ['original'] : ['compressed'];
    
    uni.chooseImage({
      count,
      sizeType,
      sourceType: [sourceType],
      success: async function (res) {
        try {
          const tempFilePaths = res.tempFilePaths;
          
          if (count === 1) {
            // 单张图片上传
            const originalPath = tempFilePaths[0];
            let finalFilePath = originalPath;
            
            // 暂时禁用压缩功能，避免uni.compressImage的问题
            // if (compressMode === CompressMode.CUSTOM && maxSize) {
            //   finalFilePath = await compressImageToSize(originalPath, maxSize);
            // }
            
            console.log('压缩后路径:', finalFilePath);
            const result = await getuploadQiniuApi(finalFilePath);
            resolve(result);
          } else {
            // 多张图片上传
            const results = [];
            for (const filePath of tempFilePaths) {
              let finalFilePath = filePath;
              
              // 暂时禁用压缩功能，避免uni.compressImage的问题
              // if (compressMode === CompressMode.CUSTOM && maxSize) {
              //   finalFilePath = await compressImageToSize(filePath, maxSize);
              // }
              
              const result = await getuploadQiniuApi(finalFilePath);
              results.push(result);
            }
            resolve(results);
          }
        } catch (error) {
          const logger = new Logger('文件上传工具');
          logger.error({
            text: '处理图片失败',
            data: {
              error: error instanceof Error ? error.message : String(error),
              sourceType,
              count
            }
          });
          console.error('处理图片失败:', error);
          reject(error);
        }
      },
      fail: function (err) {
        console.error('Failed to open album:', err);
        reject(err);
      }
    });
  });
}
  
