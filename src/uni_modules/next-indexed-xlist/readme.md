# next-indexed-xlist适用于uni-app项目的通讯录、城市、地址索引列表组件
### 本组件目前兼容微信小程序、H5 app
### 本组件是通讯录、城市、地址索引列表组件，自带搜索功能，可自定义显示字段，用于通讯录列表、城市列表、地址列表等

> 遇到问题或有建议可以加入QQ群(<font color=#f00>455948571</font>)反馈;  
> 如果觉得组件不错，<font color=#f00>给五星鼓励鼓励</font>咯;
> 
> 本插件居于npmjs开源包[js-pinyin](https://www.npmjs.com/package/js-pinyin) 进行开发，详细插件功能可以到npm上进行查看;

### 如果有使用问题请加群

注意：如果插件问题，请务必给一个完整的复现demo，谢谢配合；
[点击链接加入群聊前端开发（uniapp插件）】](https://qm.qq.com/q/S1bJzQfJAG)

### 使用示例

``` html
<template>
	<view class="page-main">
		<next-indexed-xlist :dataList="dataList" :showAvatar="true" @itemclick="itemclick">
			<!--这是默认插槽,额外添加部分-->
			<!-- 	<view class="content-block">
				<view class="title"><text>历史记录:</text></view>
				<view class="btn"><text>朝阳区</text></view>
				<view class="btn"><text>东城区</text></view>
				<view class="btn"><text>海淀区</text></view>
			</view> -->
			<!--自定义name插槽-->
			<!-- <template #name="{data: item}">
				<view><text>测试name</text></view>
			</template> -->
			<!--自定义phone插槽-->
			<!-- <template #phone="{data: item}">
				<view><text>测试phone</text></view>
			</template> -->
		</next-indexed-xlist>
	</view>
</template>
```
### vue3使用
``` ts
<script setup lang="ts">
	import { ref } from "vue";
	// 通讯录数据形式
	const dataList = ref([{
		id: '1',
		name: '刘**',
		phone: '181****5576',
		img: 'https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300'
	}, {
		id: '2',
		name: '王**',
		phone: '181****5576',
		img: 'https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300'
	}, {
		id: '3',
		name: '黎**',
		phone: '181****5576',
		img: 'https://img2.baidu.com/it/u=453253244,3693084626&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '4',
		name: '王**',
		phone: '181****5576',
		img: 'https://img2.baidu.com/it/u=453253244,3693084626&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '5',
		name: '马**',
		phone: '181****5576',
		img: 'https://c-ssl.dtstatic.com/uploads/item/202005/17/20200517225139_Awrwa.thumb.1000_0.jpeg'
	}, {
		id: '6',
		name: '韩**',
		phone: '181****5576',
		img: 'https://c-ssl.dtstatic.com/uploads/item/202005/17/20200517225139_Awrwa.thumb.1000_0.jpeg'
	}, {
		id: '7',
		name: '张**',
		phone: '181****5576',
		img: 'https://img0.baidu.com/it/u=2337762009,1252339875&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '8',
		name: '杨**',
		phone: '181****5576',
		img: 'https://img0.baidu.com/it/u=2337762009,1252339875&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '9',
		name: '张**',
		phone: '18198045576',
		img: 'https://img2.baidu.com/it/u=2638426337,2608406797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '10',
		name: '李**',
		phone: '181****1176',
		img: 'https://img2.baidu.com/it/u=2638426337,2608406797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '11',
		name: '陈**',
		phone: '153****5576',
		img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201412%2F25%2F20141225133106_zjyfa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1687677419&t=3464ddbfcb8ad0291ed5f38374f23869'
	}, {
		id: '12',
		name: '李**',
		phone: '131****5576',
		img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201412%2F25%2F20141225133106_zjyfa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1687677419&t=3464ddbfcb8ad0291ed5f38374f23869'
	}, {
		id: '13',
		name: '唐**',
		phone: '181****3476',
		img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201412%2F25%2F20141225133106_zjyfa.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1687677419&t=3464ddbfcb8ad0291ed5f38374f23869'
	}, {
		id: '14',
		name: '刘**',
		phone: '181****5576',
		img: 'https://img2.baidu.com/it/u=453253244,3693084626&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '15',
		name: '秦**',
		phone: '181****5576',
		img: 'https://img2.baidu.com/it/u=453253244,3693084626&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	}, {
		id: '16',
		name: '朱**',
		phone: '181****5576',
		img: 'https://c-ssl.dtstatic.com/uploads/item/202005/17/20200517225139_Awrwa.thumb.1000_0.jpeg'
	}])
	
	// 地址数据形式
	// const dataList = ref([{
	// 	"id": 6,
	// 	"code": "110101000000",
	// 	"name": "东城区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "DC",
	// 	"deleted": 0
	// }, {
	// 	"id": 10,
	// 	"code": "110105000000",
	// 	"name": "朝阳区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "CY",
	// 	"deleted": 0
	// }, {
	// 	"id": 13,
	// 	"code": "110106000000",
	// 	"name": "丰台区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "FT",
	// 	"deleted": 0
	// }, {
	// 	"id": 14,
	// 	"code": "110107000000",
	// 	"name": "石景山区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "SJS",
	// 	"deleted": 0
	// }, {
	// 	"id": 15,
	// 	"code": "110108000000",
	// 	"name": "海淀区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "HD",
	// 	"deleted": 0
	// }, {
	// 	"id": 16,
	// 	"code": "110109000000",
	// 	"name": "门头沟区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "MTG",
	// 	"deleted": 0
	// }, {
	// 	"id": 19,
	// 	"code": "110111000000",
	// 	"name": "房山区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "FS",
	// 	"deleted": 0
	// }, {
	// 	"id": 20,
	// 	"code": "110112000000",
	// 	"name": "通州区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "TZ",
	// 	"deleted": 0
	// }, {
	// 	"id": 21,
	// 	"code": "110113000000",
	// 	"name": "顺义区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "SY",
	// 	"deleted": 0
	// }, {
	// 	"id": 22,
	// 	"code": "110114000000",
	// 	"name": "昌平区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "CP",
	// 	"deleted": 0
	// }, {
	// 	"id": 23,
	// 	"code": "110115000000",
	// 	"name": "大兴区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "DX",
	// 	"deleted": 0
	// }, {
	// 	"id": 25,
	// 	"code": "110116000000",
	// 	"name": "怀柔区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "HR",
	// 	"deleted": 0
	// }, {
	// 	"id": 26,
	// 	"code": "110117000000",
	// 	"name": "平谷区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "PG",
	// 	"deleted": 0
	// }, {
	// 	"id": 27,
	// 	"code": "110118000000",
	// 	"name": "密云区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "MY",
	// 	"deleted": 0
	// }, {
	// 	"id": 28,
	// 	"code": "110119000000",
	// 	"name": "延庆区",
	// 	"parentCode": "110100000000",
	// 	"level": 3,
	// 	"abbr": "YQ",
	// 	"deleted": 0
	// }])
	function itemclick(e) {
		console.log('点击列表回调：', e)
	}
</script>
<style lang="scss">
	.content-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		background-color: #fff;
		.title {
			color: #333;
			padding: 20rpx;
			margin-right: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.btn {
			color: #ccc;
			padding: 10rpx;
			border: 1rpx solid #ccc;
			border-radius: 10rpx;
			margin: 20rpx 10rpx;
			font-size: 28rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
		}
	}
</style>
```
### vue2使用
``` ts
export default {
	data () {
		return {
			dataList: [{
				id: '1',
				name: '刘**',
				phone: '181****5576',
				img: 'https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300'
			}, {
				id: '2',
				name: '王**',
				phone: '181****5576',
				img: 'https://img1.baidu.com/it/u=1016138010,1907110459&fm=253&fmt=auto&app=138&f=JPEG?w=300&h=300'
			}, {
				id: '3',
				name: '黎**',
				phone: '181****5576',
				img: 'https://img2.baidu.com/it/u=453253244,3693084626&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
			}, {
				id: '4',
				name: '王**',
				phone: '181****5576',
				img: 'https://img2.baidu.com/it/u=453253244,3693084626&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
			}]
		}
	},
	methods: {
		itemclick(e) {
			console.log('点击列表回调：', e)
		}
	}
}
```
### 属性说明
| 名称                        | 类型           | 默认值                  | 描述           				|
| ----------------------------|--------------- | ---------------------- | ----------------------|
| dataList                    | Array          | []                     | 数据源									|
| idKey                       | String         | id                     | 显示的主键key值				|
| nameKey                     | String         | name                   | 显示的名字key值				|
| phoneKey                    | String         | phone                  | 显示的电话key值				|
| imgKey                      | String         | img                    | 显示的头像key值				|
| radius                      | Number         | 4rpx                   | 头像圆角(rpx、px、%) 	|
| showAvatar                  | Boolean        | true                   | 是否显示头像					 	|
| isInterlock                 | Boolean        | false                  | 是否双向联动						|


## Event 事件
|事件名	|说明																										|类型	|回调参数	|
|----		|----																										|----	|----			|
|itemclick|菜单项item点击事件																		|emit	|Object		|

### 微信小程序在线体验
![](https://lixueshiaa.github.io/webtest/www/static/img/ponder_next.png)

### 预览

***

|                              (通信录演示效果)                  			 						|                      (地区选择演示效果)          										 						 |
| :-----------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
| ![](https://lixueshiaa.github.io/webtest/www/static/next-indexed-list-a.gif) 		| ![](https://lixueshiaa.github.io/webtest/www/static/next-indexed-list-b.gif) 		 |