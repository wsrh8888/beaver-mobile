// 导入 SVG 图标 - 使用 chat 文件夹中的图标
import copyIcon from '@/static/img/chat/copy.svg';
import previewIcon from '@/static/img/chat/preview.svg';
import saveIcon from '@/static/img/chat/save.svg';
import emojiIcon from '@/static/img/chat/add-emoji.svg';
import forwardIcon from '@/static/img/chat/forward.svg';
import replyIcon from '@/static/img/chat/reply.svg';
import deleteIcon from '@/static/img/chat/delete.svg';

// 菜单项类型定义
interface MenuItem {
  label: string;
  action: string;
  icon: string;
  color?: string;
}

// 简单的菜单配置
export const getMenuItems = (messageType: number, isMine: boolean): MenuItem[] => {
  const baseItems: MenuItem[] = [
    { label: '复制', action: 'copy', icon: copyIcon },
    { label: '转发', action: 'forward', icon: forwardIcon },
    { label: '回复', action: 'reply', icon: replyIcon }
  ];

  const imageItems: MenuItem[] = [
    { label: '预览', action: 'preview', icon: previewIcon },
    { label: '保存', action: 'save', icon: saveIcon },
    { label: '添加表情', action: 'add-emoji', icon: emojiIcon },
    { label: '转发', action: 'forward', icon: forwardIcon },
    { label: '回复', action: 'reply', icon: replyIcon }
  ];

  const emojiItems: MenuItem[] = [
    { label: '预览', action: 'preview', icon: previewIcon },
    { label: '保存', action: 'save', icon: saveIcon },
    { label: '添加表情', action: 'add-emoji', icon: emojiIcon },
    { label: '转发', action: 'forward', icon: forwardIcon },
    { label: '回复', action: 'reply', icon: replyIcon }
  ];

  // 根据消息类型返回对应菜单
  let items: MenuItem[] = [];
  if (messageType === 1) { // 文本
    items = baseItems;
  } else if (messageType === 2) { // 图片
    items = imageItems;
  } else if (messageType === 6) { // 表情
    items = emojiItems;
  }


  return items;
}; 