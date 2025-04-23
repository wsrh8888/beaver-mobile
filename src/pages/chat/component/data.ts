
import photo from '@/static/img/chat/photo.svg'
import camera from '@/static/img/chat/camera.svg'
import phone from '@/static/img/chat/phone.svg'
import vedio from '@/static/img/chat/vedio.svg'
const option1 = [
    {
        value: '照片',
        icon: photo,
        type: 'album'
    },
    {
        value: '相机',
        icon: camera,
        type: 'camera'
    },
    {
        value: '音频',
        icon: phone,
        type: 'call'
    },
    {
        value: '视频',
        icon: vedio,
        type: 'call'
    },

   
]
const option2 = [
    {
        value: '照片',
        icon: photo,
        type: 'album'
    },
    {
        value: '相机',
        icon: camera,
        type: 'camera'
    },
    {
        value: '音频',
        icon: phone,
        type: 'audio'
    },
    {
        value: '视频',
        icon: vedio,
        type: 'vedio'
    },
   
]
export const options = [option1,option2]
export const msgType = {
    1: 'textMsg',
    2: 'imageMsg',
    3: 'videoMsg',
    4: 'fileMsg',
    5: 'voiceMsg',
    6: 'voiceCallMsg',
    7: 'videoCallMsg',
    8: 'withdrawMsg',
    9: 'ReplyMsg',
    10: 'QuoteMsg',
    11: 'AtMsg',
    12: 'TipMsg',
}
