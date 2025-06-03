import { previewOnlineFileApi } from '@/api/file';

/**
 * @description: 处理头像路径，将 fileId 转换为完整的 URL
 * @param {string} avatar - 头像 fileId 或已经是完整 URL
 * @return {string} 完整的头像 URL
 */
export function processAvatarUrl(avatar: string): string {
  if (!avatar) return '';
  
  // 如果已经是完整的 URL，直接返回
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }
  
  // 如果是 fileId，使用 API 转换为完整 URL
  return previewOnlineFileApi(avatar);
}

/**
 * @description: 批量处理对象中的头像字段
 * @param {T} obj - 包含头像字段的对象
 * @param {string} avatarField - 头像字段名，默认为 'avatar'
 * @return {T} 处理后的对象
 */
export function processObjectAvatar<T extends Record<string, any>>(
  obj: T, 
  avatarField: string = 'avatar'
): T {
  if (!obj || !obj[avatarField]) return obj;
  
  return {
    ...obj,
    [avatarField]: processAvatarUrl(obj[avatarField])
  };
}

/**
 * @description: 批量处理数组中对象的头像字段
 * @param {T[]} array - 对象数组
 * @param {string} avatarField - 头像字段名，默认为 'avatar'
 * @return {T[]} 处理后的数组
 */
export function processArrayAvatars<T extends Record<string, any>>(
  array: T[], 
  avatarField: string = 'avatar'
): T[] {
  return array.map(item => processObjectAvatar(item, avatarField));
} 