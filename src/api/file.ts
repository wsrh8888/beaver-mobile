import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'

/**
 * @description: 预览文件
 */
export const previewOnlineFileApi = (fileName: string) => {
  return `${baseUrl}/api/file/preview/${fileName}`
}
