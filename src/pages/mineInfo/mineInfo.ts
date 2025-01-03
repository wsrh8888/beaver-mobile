import applySvg from '@/static/img/friend/apply.svg'

export const dataList = [{
  id: 1,
  title: '头像',
  type: 'image',
  value: 'avatar',
}, {
  id: 2,
  title: '昵称',
  type: 'text',
  value: 'nickName',
}, {
  id: 6,
  title: '二维码名片',
  type: 'navigateTo',
  path: '/pages/qrcode/qrcode',
}
// , {
//   id: 3,
//   title: '性别',
//   type: 'avatar',
//   value: '',
// }, {
//   id: 4,
//   title: '手机号',
//   type: 'avatar',
//   value: '',
// }, {
//   id: 5,
//   title: '个性签名',
//   type: 'avatar',
//   value: '',
// }, {
//   id: 6,
//   title: '二维码名片',
//   type: 'avatar',
//   value: '',
// }
]