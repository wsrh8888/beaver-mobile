
import { getuploadQiniuApi } from "@/api/chat";

export function openAlbum(sourceType:string) {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1, // Number of images to select
        sizeType: ['original', 'compressed'], // Can specify whether to select original or compressed images
        sourceType: [sourceType], // Can specify the source as album
        success: function (res) {
          const tempFilePaths = res.tempFilePaths;
          // 调用 getuploadQiniuApi 并返回其 Promise
          getuploadQiniuApi(tempFilePaths[0])
            .then(resolve)  
            .catch(reject); 
        },
        fail: function (err) {
          console.error('Failed to open album:', err);
          reject(err);  // 打开相册失败时调用 reject
        }
      });
    });
  }

export function openCall(){

}
  
