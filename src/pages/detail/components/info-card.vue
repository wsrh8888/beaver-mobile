<template>
	<view class="info-card" :class="cardTypeClass">
		<view class="card-header">
			<view class="card-title">{{ title }}</view>
		</view>
		<view class="info-grid" :class="{ 'friend-info-grid': type === 'friend' }">
			<view 
				class="info-item" 
				:class="{ 'special-item': item.label === '备注' || item.label === '来源' }"
				v-for="(item, index) in infoItems" 
				:key="index"
			>
				<view class="info-label">{{ item.label }}</view>
				<view class="info-value">{{ item.value || '未设置' }}</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
interface InfoItem {
	label: string;
	value?: string;
}

export default {
	name: 'InfoCard',
	props: {
		title: {
			type: String,
			required: true
		},
		infoItems: {
			type: Array as () => InfoItem[],
			required: true
		},
		type: {
			type: String,
			default: 'basic',
			validator: (value: string) => ['basic', 'friend'].includes(value)
		}
	},
	computed: {
		cardTypeClass() {
			return `card-${this.type}`;
		}
	}
};
</script>

<style lang="scss" scoped>
/* 资料卡片样式 */
.info-card {
	background-color: white;
	border-radius: 20rpx;
	padding: 32rpx;
	box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.06);
	margin-bottom: 0;
}

.card-header {
	margin-bottom: 24rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2D3436;
}

/* 信息网格布局 */
.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
}

.info-item {
	padding: 20rpx 24rpx;
	background-color: #F8F9FA;
	border-radius: 16rpx;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #F0F3F4;
	}
}

.info-label {
	color: #636E72;
	margin-bottom: 8rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.info-value {
	color: #2D3436;
	font-weight: 600;
	font-size: 28rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 特殊项目样式 */
.special-item {
	background-color: #FFF5F0;
	border: 1rpx solid rgba(255, 125, 69, 0.1);
	
	.info-label {
		color: #FF7D45;
		font-weight: 600;
	}
	
	.info-value {
		color: #2D3436;
		font-weight: 600;
	}
}

/* 好友信息卡片特殊样式 */
.friend-info-grid {
	grid-template-columns: 1fr;
	gap: 16rpx;
	
	.info-item {
		background-color: #FFF5F0;
		border: 1rpx solid rgba(255, 125, 69, 0.1);
		
		.info-label {
			color: #FF7D45;
			font-weight: 600;
		}
		
		.info-value {
			color: #2D3436;
			font-weight: 600;
		}
	}
}
</style> 