// 全局可以使用
export function showMsg(title = '获取数据失败', duration = 2000, icon = 'error') {
  uni.showToast({
    title,
    duration,
    icon
  });
}