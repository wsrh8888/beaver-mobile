
/**
 * @description: 扫码二维码解析内容
 */
export const parseQrcode = (conent: {}) =>{
  if (conent.type === 'addFriend') {
    uni.navigateTo({
      url: '/pages/detail/detail?' + conent.query
    })
  }

}
