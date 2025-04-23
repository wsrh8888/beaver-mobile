import { getuploadQiniuApi } from "@/api/chat";

interface UploadOptions {
  count?: number;
  sizeType?: ('original' | 'compressed')[];
  sourceType?: ('album' | 'camera')[];
}

interface UploadResult {
  fileId: string;
  name: string
}

interface UploadResponse {
  url: string;
}

export async function uploadFiles(options: UploadOptions = {}): Promise<UploadResult[]> {
  const {
    count = 1,
    sizeType = ['compressed'],
    sourceType = ['album', 'camera']
  } = options;

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType,
      sourceType,
      success: async (res) => {
        try {
          const tempFilePaths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [res.tempFilePaths];
          const tempFiles = Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles];

          const uploadPromises = tempFilePaths.map(async (path: string, index: number) => {
            const file = tempFiles[index];
            const uploadResult = await getuploadQiniuApi(path);
            return {
              fileId: uploadResult.fileId,
              name: uploadResult.name
            };
          });

          const results = await Promise.all(uploadPromises);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        console.error('Failed to upload files:', err);
        reject(err);
      }
    });
  });
}
