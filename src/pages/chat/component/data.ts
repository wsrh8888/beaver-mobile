
import photo from '@/static/img/chat/photo.svg'
import camera from '@/static/img/chat/camera.svg'
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
