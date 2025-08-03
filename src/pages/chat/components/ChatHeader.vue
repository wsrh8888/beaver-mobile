<template>
	<HeaderComponent 
		:title="title"
		:show-back="true"
		@back="goBack"
	>
		<template #right-content>
			<view class="header-button" @click="handleClickMore">
				<image src="/static/img/chat/more.svg" mode="aspectFit" class="header-icon" />
			</view>
		</template>
	</HeaderComponent>
</template>

<script lang="ts">
import HeaderComponent from "@/component/header/header.vue";

export default {
	name: 'ChatHeader',
	components: {
		HeaderComponent
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		chatType: {
			type: String as () => 'single' | 'group',
			default: 'single'
		},
		conversationId: {
			type: String,
			required: true
		}
	},
	emits: ['back', 'more'],
	setup(props, { emit }) {
		const goBack = () => {
			emit('back')
		}

		const handleClickMore = () => {
			emit('more', {
				chatType: props.chatType,
				conversationId: props.conversationId
			})
		}

		return {
			goBack,
			handleClickMore
		}
	}
}
</script>

<style lang="scss" scoped>
.header-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60rpx;
	height: 60rpx;
	border-radius: 30rpx;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10rpx);
}

.header-icon {
	width: 32rpx;
	height: 32rpx;
}
</style> 