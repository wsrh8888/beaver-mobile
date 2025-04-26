import emoji_01Png from '@/static/emoji/emoji_01.png'
import emoji_02Png from '@/static/emoji/emoji_02.png'
import emoji_03Png from '@/static/emoji/emoji_03.png'
import emoji_04Png from '@/static/emoji/emoji_04.png'
import emoji_05Png from '@/static/emoji/emoji_05.png'
import emoji_06Png from '@/static/emoji/emoji_06.png'
import emoji_07Png from '@/static/emoji/emoji_07.png'
import emoji_08Png from '@/static/emoji/emoji_08.png'
import emoji_09Png from '@/static/emoji/emoji_09.png'
import emoji_10Png from '@/static/emoji/emoji_10.png'
import emoji_11Png from '@/static/emoji/emoji_11.png'
import emoji_12Png from '@/static/emoji/emoji_12.png'
import emoji_13Png from '@/static/emoji/emoji_13.png'
import emoji_14Png from '@/static/emoji/emoji_14.png'
import emoji_15Png from '@/static/emoji/emoji_15.png'
import emoji_16Png from '@/static/emoji/emoji_16.png'
import emoji_17Png from '@/static/emoji/emoji_17.png'
import emoji_18Png from '@/static/emoji/emoji_18.png'
import emoji_19Png from '@/static/emoji/emoji_19.png'
import emoji_20Png from '@/static/emoji/emoji_20.png'
import emoji_21Png from '@/static/emoji/emoji_21.png'
import emoji_22Png from '@/static/emoji/emoji_22.png'
import emoji_23Png from '@/static/emoji/emoji_23.png'
import emoji_24Png from '@/static/emoji/emoji_24.png'
import emoji_25Png from '@/static/emoji/emoji_25.png'
import emoji_26Png from '@/static/emoji/emoji_26.png'



export const emojiList = [{
  name: '[微笑]',
  // #ifdef H5
  icon: '/static/emoji/emoji_01.png'  // APP中使用绝对路径
  // #endif
  // #ifdef APP-PLUS
  icon: '/static/emoji/emoji_01.png'  // APP中使用绝对路径
  // #endif
}, {
  name: '[亲亲]',
  icon: emoji_02Png
},
{
  name: '[发呆]',
  icon: emoji_03Png
},
{
  name: '[得意]',
  icon: emoji_04Png
},
{
  name: '[流泪]',
  icon: emoji_05Png
},
{
  name: '[奋斗]',
  icon: emoji_06Png
},
{
  name: '[敲打]',
  icon: emoji_07Png
},
{
  name: '[可爱]',
  icon: emoji_08Png
},
{
  name: '[抓狂]',
  icon: emoji_09Png
},
{
  name: '[大笑]',
  icon: emoji_10Png
},
{
  name: '[偷笑]',
  icon: emoji_11Png
},
{
  name: '[快哭了]',
  icon: emoji_12Png
},
{
  name: '[抠鼻]',
  icon: emoji_13Png
},
{
  name: '[感冒]',
  icon: emoji_14Png
},
{
  name: '[拜托]',
  icon: emoji_15Png
},
{
  name: '[天使]',
  icon: emoji_16Png
},
{
  name: '[衰]',
  icon: emoji_17Png
},
{
  name: '[笑哭]',
  icon: emoji_18Png
},
{
  name: '[捂脸哭]',
  icon: emoji_19Png
},
{
  name: '[睡]',
  icon: emoji_20Png
},
{
  name: '[吃瓜]',
  icon: emoji_21Png
},
{
  name: '[害羞]',
  icon: emoji_22Png
},
{
  name: '[闭嘴]',
  icon: emoji_23Png
},
{
  name: '[流鼻血]',
  icon: emoji_24Png
},
{
  name: '[推眼镜]',
  icon: emoji_25Png
},
{
  name: '[暗中观察]',
  icon: emoji_26Png
},

]



export const emojiMap = (name: string) =>{
  const emoji = emojiList.find(item => item.name === name)
  return emoji?.icon
}
