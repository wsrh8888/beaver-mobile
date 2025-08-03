// 全局可以使用
export function showToast(title = '获取数据失败', duration = 2000, icon: 'success' | 'none' | 'loading' | 'error' = 'error') {
  uni.showToast({
    title,
    duration,
    icon
  });
}