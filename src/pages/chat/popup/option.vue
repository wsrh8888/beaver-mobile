<template>
  <view class="option-popup" :style="{height:keyboardHeight+'rpx'}">
			<swiper class="swiper" circular :indicator-dots="sw.indicatorDots" :autoplay="sw.autoplay" :interval="sw.interval"
				:duration="duration">

				<swiper-item v-for="(item, index) in options" :key="index">
					<view class="list">
					<view class="item" v-for="(item,i) in item" :key="i" @click="handleClick(item.type)">
						<view class="icon">
							<image :src="item.icon"/>
						</view>
						
						<text>{{ item.value }}</text>
					</view>
				</view>
				</swiper-item>
			</swiper>
  </view>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import  {options}  from '../component/data'
import { openAlbum } from '@/utils/upload';
export default defineComponent({
  props: {
    keyboardHeight: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
	const obj = {
		album: openAlbum,
		camera: openAlbum,
	}
	const sw = reactive({
            indicatorDots: true,
            autoplay: false,
            interval: 2000,
            duration: 500
	})
    const addEmoji = (index) => {
      // emit('addEmoji', emoji[index])
    }
	const handleClick = (type) => {
		console.log(type);
		Object.keys(obj).forEach(key => {
			if (key === type) {
				obj[key](key).then(res => {
					console.log('option',res);
					emit('getFilePath', res)
				})
			}
		})
	}
    return {
      keyboardHeight: props.keyboardHeight,
      addEmoji,
      options,
	  sw,
	  handleClick
    }
  }
});
</script>

<style lang="scss" scoped >
.option-popup {
  border-top: 1rpx solid #d3d3d3;
  
  // overflow-y: scroll;
  background-color: #f1f1f1;
.swiper{
	height: 240rpx;
}
  .list {
    width: 100%;
	padding: 16rpx 20rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 25%;
      height: 180rpx;
      font-size: 28rpx;
      .icon {
        width: 100rpx;
        height: 100rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12rpx;
        margin-bottom: 20rpx;
      }
      image {
        width: 50rpx;
        height: 50rpx;
      }
    }
  }
}
</style>

