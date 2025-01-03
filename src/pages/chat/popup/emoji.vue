<template>
    <view class="emoji-popup">
        <scroll-view scroll-y="true" :style="{height:emojiHeight+'rpx'}">
				<view class="list">
					<view class="item" v-for="(item,i) in emoji" :key="i" @click="addEmoji(i)">
						{{item}}
					</view>
				</view>
			</scroll-view>
    </view>
</template>

<script>
import { defineComponent, ref } from 'vue';
import emoji from "@/utils/emojs";
export default defineComponent({
    props: {
        emojiHeight: {
            type: Number,
            default: 0
        }
    },
    setup(props,{emit}) {
        const addEmoji = (index) => {
            emit('addEmoji', emoji[index])
        }
        return {
            emojiHeight: props.emojiHeight,
            emoji,
            addEmoji
        }
    }
});
</script>

<style lang="scss" scoped >
.emoji-popup {
    .list {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-top: 1rpx solid #d3d3d3;
			padding: 15rpx 20rpx;
			background-color: #f1f1f1;

			.item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 12.5%;
				height: 80rpx;
				font-size: 50rpx;
			}

		}

}
</style>