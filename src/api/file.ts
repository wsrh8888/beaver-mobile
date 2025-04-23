import { request } from '@/utils/request'
import { baseUrl } from '@/env.json'

/**
 * @description: 预览文件
 */
export const previewOnlineFileApi = (fileId: string) => {
  return `${baseUrl}/api/file/preview/${fileId}`
}
