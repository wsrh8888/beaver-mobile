import { request } from '@/utils/request/request'
import { baseUrl } from '@/env.json'
/**
 * @description: 提交反馈信息
 */
export const submitFeedbackApi = (data) => {
  return request({
    method: 'POST',
    data,
    url: `${baseUrl}/api/feedback/submitFeedback`
  })
}