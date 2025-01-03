<template>
	<view class="next-list">
		<scroll-view @scroll="scrollCallback" class="next-scroll-left" scroll-y="true" :scroll-with-animation="true"
			:scroll-into-view="scrollIntoView">
			<view id="TOP"><slot></slot></view>
			<view class="left-list" v-for="(item,index) of scrollLeftObj" :key="index" :id="index!='#'?index:'BOTTOM'">
				<view :id="`item${index}`" class="left-item-title" v-if="item && item.length">{{index}}</view>
				<view class="left-item-card" v-for="(mess,inx) in item" @click.stop="chooseItem(mess)">
					<view v-if="showSelect">
							<!--checkbox 选择 -->
							<checkbox :value="mess[idKey]" :checked="checkedIdArg.includes(mess[idKey])" @change="chooseItem(mess)"></checkbox>

					</view>	
					<view v-if="showAvatar">
						<image :style="'border-radius:'+radius" class="left-item-card-img img-info" :src="mess[imgKey]"
							v-if="mess[imgKey]" @click.stop="preview(mess[imgKey])"></image>
						<view :style="'border-radius:'+radius" class="left-item-card-img" v-else>
							{{mess[nameKey] && mess[nameKey].slice(0,1) || ''}}
						</view>
					</view>	
					<view class="left-item-card-info"
						:style="inx<item.length-1?'border-bottom: solid #F4F4F4 1rpx;':''">
						<slot v-if="$slots.name" name="name" :data="mess"></slot>
						<view v-else class="left-item-card-name">{{mess[nameKey] || ''}}</view>
						<slot v-if="$slots.phone" name="phone" :data="mess"></slot>
						<view class="left-item-card-phone" v-else-if="mess[phoneKey]">{{mess[phoneKey]}}</view>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="!hasData">
				<image class="no-data-img" :src="noDataImgSrc"></image>
				<view class="no-data-name">暂无数据</view>
			</view>
		</scroll-view>
		<view class="next-scroll-right" v-if="hasData">
			<image class="next-scroll-right-top" :src="nextScrollRightTopSrc" @click.stop="scrollTop"></image>
			<view :class="{'next-scroll-right-name':true,'next-scroll-right-select':item==scrollIntoViewCopy}"
				v-for="(item,index) in scrollRightList" :key="index" @click.stop="chooseType(item)">{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	import nextSearchImgSrc from '../../static/search.png'
	import noDataImgSrc from '../../static/noData.png'
	import nextScrollRightTopSrc from '../../static/top.png'
	import pinyin from './js-pinyin/pinyin.js/'
	
	
	// 创建pinyin实例
	const pinyinInstance = new pinyin({charCase:0})
	
	const position = {}
	
	export default {
		props: {
			showSelect: {
				type: Boolean,
				default: false
			},
			dataList: {
				type: Array,
				required: true,
				default: () => {
					return []
				}
			},
			//显示的主键key值
			idKey: {
				type: String,
				default: 'id'
			},
			nameKey: {
				type: String,
				default: 'name'
			},
			phoneKey: {
				type: String,
				default: 'phone'
			},
			imgKey: {
				type: String,
				default: 'img'
			},
			radius: {
				type: String,
				default: '6rpx'
			},
			showAvatar: {
				type: Boolean,
				default: true
			},
			isInterlock: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				searchStr: '',
				scrollIntoView: '',
				scrollIntoViewCopy: '',
				scrollLeftObj: {},
				oldObj: {},
				scrollRightList: [],
				hasData: true,
				nextSearchImgSrc,
				noDataImgSrc,
				nextScrollRightTopSrc,
				checkedIdArg: []
			};
		},
		created() {
			this.$watch(() => this.dataList, (newList) => {
				if (newList && newList.length) this.cleanData(newList)
				if(this.isInterlock) {
					this.$nextTick(() => {
						Object.keys(this.scrollRightList).map(key => {
							const query = uni.createSelectorQuery().in(this).select(`#item${this.scrollRightList[key]}`);
							query && query.boundingClientRect(res => {
								const { top } = res
								position[this.scrollRightList[key]] = top
							}).exec()
						})
					})
				}
			}, {
				immediate: true,
				deep: true,
			})
		},
		methods: {
			search() {
				if (this.searchStr) {
					let has = false
					this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
					for (let i in this.scrollLeftObj) {
						this.scrollLeftObj[i] = this.scrollLeftObj[i].filter(item => {
							return (item[this.nameKey].indexOf(this.searchStr) != -1) || item[this.phoneKey]
								.indexOf(this.searchStr) != -1
						})
						if (this.scrollLeftObj[i].length) has = true
					}
					if (has) this.hasData = true
					else this.hasData = false
				} else {
					this.hasData = true
					this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
				}
			},
			scrollCallback(e) {
				const { detail } = e
				const { scrollTop, scrollHeight } = detail
				if (this.scrollIntoView === 'TOP') {
					this.scrollIntoView = ''
				}
				
				if (this.isInterlock) {
					for (let key in position) {
						if (position[key] - scrollTop > 0 && position[key] - scrollTop <= scrollHeight) {
							this.scrollIntoViewCopy = key
							return
						}
					}
				}	
			},
			scrollTop() {
				this.scrollIntoView = 'TOP'
			},
			cleanData(list) {
				this.scrollRightList = this.getLetter()
				let newList = []
				list.forEach(res => {
					let initial = pinyinInstance.getCamelChars(res[this.nameKey].trim())
					let firsfirs = initial ? initial.substring(0, 1) : ''
					if (!newList[firsfirs]) newList[firsfirs] = []
					newList[firsfirs].push({
						[this.idKey]: res[this.idKey] || '',
						[this.nameKey]: res[this.nameKey].trim() || '',
						[this.phoneKey]: res[this.phoneKey] || '',
						[this.imgKey]: res[this.imgKey] || ''
					})
				})
				this.scrollRightList.forEach(t => {
					if (newList[t]) {
						this.$set(this.scrollLeftObj, t, newList[t])
					} else {
						this.$set(this.scrollLeftObj, t, [])
					}
				})
				let surplusList = []
				for (var i in newList) {
					let han = this.scrollRightList.find(v => {
						return v == i
					})
					if (!han) surplusList.push(newList[i])
				}
				surplusList.forEach(item => {
					this.scrollLeftObj['#'] = this.scrollLeftObj['#'].concat(item)
				})
				this.oldObj = JSON.parse(JSON.stringify(this.scrollLeftObj))
				
				// 过滤不存在的关键索引
				const existList = Object.keys(this.scrollLeftObj).filter(key => {
					return this.scrollLeftObj[key].length
				})
				this.scrollRightList = this.scrollRightList.filter(key => {
					return existList.some(k => k === key)
				})
			},
			getLetter() {
				let list = []
				for (var i = 0; i < 26; i++) {
					list.push(String.fromCharCode(65 + i))
				}
				list.push('#')
				return list
			},
			chooseType(item) {
				if (item == '#') item = 'BOTTOM'
				this.scrollIntoView = item
				this.scrollIntoViewCopy = item
			},
			preview(img) {
				uni.previewImage({
					current: 0,
					urls: [img]
				})
			},
			chooseItem(item) {console.log(item,'==');
				this.checkedIdArg.push(item.userId)
				this.$emit('itemclick', item)
			}
		},
	};
</script>
<style>
	/deep/ ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	}
</style>
<style lang="scss" scoped>
	.next-list {
		width: 100%;
		height: 100vh;
		background-color: #fff;
		box-sizing: border-box;
		padding-top: 1px;
		.next-search {
			// display: none;
			width: 100%;
			height: 106rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			z-index: 9999;
			top: 0;
			left: 0;
			.next-search-img {
				width: 32rpx;
				height: 32rpx;
				position: absolute;
				left: 64rpx;
			}
		
			.next-input {
				width: calc(100% - 64rpx);
				height: 72rpx;
				background: #EEEEEE;
				border-radius: 36rpx;
				padding: 0 32rpx 0 80rpx;
				box-sizing: border-box;
				color: #333333;
			}
		
			.next-placeholder {
				color: #777777;
			}
		}
		.next-scroll-left {
			height: 100%;
			padding-top: 0rpx;
			
			.left-list {
				height: auto;
				margin-bottom: 20rpx;
				.left-item-title {
					width: calc(100% - 24rpx);
					height: 60rpx;
					padding-left: 24rpx;
					text-align: left;
					line-height: 60rpx;
					font-size: 26rpx;
					color: #999;
				}

				.left-item-card {
					width: 100%;
					height: 112rpx;
					background-color: #FFFFFF;
					box-sizing: border-box;
					padding-left: 24rpx;
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.left-item-card-img {
						width: 80rpx;
						min-width: 80rpx;
						height: 80rpx;
						background-color: #CFCFCF;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 36rpx;
						font-weight: bold;
						color: #FFFFFF;
					}

					.img-info {
						background: none;
						border: solid #f0f0f0 1rpx;
					}

					.left-item-card-info {
						position: relative;
						width: 100%;
						margin-left: 32rpx;
						height: 100%;
						display: flex;
						align-items: flex-start;
						justify-content: center;
						flex-direction: column;

						.left-item-card-name {
							font-size: 30rpx;
							line-height: 30rpx;
							color: #333333;
						}

						.left-item-card-phone {
							margin-top: 14rpx;
							font-size: 28rpx;
							line-height: 28rpx;
							color: #999999;
						}
					}
					.left-item-card-info::before{
						content: '';
						position: absolute;
						width: 100%;
						height: 2rpx;
						background-color: #ccc;
						top: 100%;

					}
				}
			}

			.no-data {
				width: 100%;
				display: flex;
				align-items: center;
				justify-items: center;
				flex-direction: column;
				margin-top: 25%;

				.no-data-img {
					width: 200rpx;
					height: 200rpx;
				}

				.no-data-name {
					margin-top: 20rpx;
					font-size: 28rpx;
					color: #666666;
				}
			}
		}

		.next-scroll-right {
			position: fixed;
			right: 0rpx;
			top: 50%;
			transform: translateY(-47%);
			z-index: 999 !important;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;

			.next-scroll-right-top {
				width: 32rpx;
				height: 32rpx;
				margin-right: 14rpx;
				z-index: 999 !important;
			}

			.next-scroll-right-name {
				width: 32rpx;
				padding-right: 14rpx;
				height: 28rpx;
				font-size: 22rpx;
				color: #333333;
				line-height: 22rpx;
				margin-top: 8rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.next-scroll-right-select {
				padding: 0;
				margin-right: 14rpx;
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
				background: #2991FF;
				color: #FFFFFF;
			}
		}
	}
</style>