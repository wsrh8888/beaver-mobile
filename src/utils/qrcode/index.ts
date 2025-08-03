import Logger from '@/logger/logger';
import type { QRCodeData, QRCodeAction } from '@/types/utils/qrcode';
import { showToast } from '@/component/toast';

const logger = new Logger('扫码服务');

/**
 * 处理扫码结果并导航
 * @param qrContent 二维码内容
 */
export const handleScanResult = (qrContent: string) => {
  try {
    // 解析JSON
    const data: QRCodeData = JSON.parse(qrContent);
    console.error('二维码数据', data)
    // 验证必要字段
    if (!data.action) {
      showToast('无效的二维码格式', 2000, 'none');
      return;
    }

    // 验证是否过期
    if (data.expireAt !== -1 && Date.now() > data.timestamp + data.expireAt * 60 * 1000) {
      showToast('二维码已过期', 2000, 'none');
      return;
    }

    // 根据action类型导航
    switch (data.action) {
      case 'addFriend': {
        const userId = (data.payload as any).userId;
        if (!userId) {
          showToast('无效的二维码', 2000, 'none');
          return;
        }
        uni.navigateTo({
          url: `/pages/detail/detail?id=${userId}&source=qrcode`,
          animationType: 'slide-in-right',
          animationDuration: 300
        });
        break;
      }
      
      case 'joinGroup': {
        const groupId = (data.payload as any).groupId;
        if (!groupId) {
          showToast('无效的二维码', 2000, 'none');
          return;
        }
        uni.navigateTo({
          url: `/pages/joinGroup/joinGroup?groupId=${groupId}`,
          animationType: 'slide-in-right',
          animationDuration: 300
        });
        break;
      }
      
      default:
        showToast('未知的二维码类型', 2000, 'none');
    }

  } catch (error) {
    logger.error({
      text: '二维码解析失败',
      data: { error: error instanceof Error ? error.message : String(error) }
    });
    showToast('无效的二维码', 2000, 'none');
  }
}; 