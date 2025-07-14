<script lang="ts">
import { defineComponent } from 'vue';
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { getLocal } from './utils/local';
import WsManager from '@/ws-manager/ws'
import { useInitStore } from '@/pinia/init/init'
import { track } from '@/logger/track'

export default defineComponent({
	setup() {		
		onLaunch( async () => {
			console.log("App Launch");
			
			// 上报版本信息（仅在启动时调用一次）
			try {
				await reportVersionApi();
				console.log('版本信息上报成功');
			} catch (error) {
				console.error('版本信息上报失败:', error);
			}
			
			// 追踪应用启动
			track.view('APP_LAUNCH', {
				timestamp: Date.now(),
				hasToken: !!getLocal('token')
			})
			
			const initStore = useInitStore();
			
			// 无论是否有token，都先测试认证接口是否可用
			try {
				await initStore.getAuthentication();
				console.log('认证接口测试成功');
			} catch (error) {
				console.error('认证接口测试失败:', error);
				// 认证接口不可用，可能是网络问题或服务端问题
				uni.showToast({
					title: '网络连接异常，请检查网络设置',
					icon: 'none',
					duration: 3000
				});
			}
			
			if (!getLocal('token')) {
				// 没有token，跳转到登录页
				// 检查当前页面路径，避免重复导航
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				const currentPath = currentPage?.route;
				
				if (currentPath !== 'pages/login/login') {
					uni.reLaunch({
						url: 'pages/login/login'
					});
				}
				return
			}
			
			// 有token，初始化应用
			await initStore.initApp()
		});


		onHide(() => {

		});

		return {
		};
	}
});
</script>


<style>
page {
	height: 100vh;

}

#app {
	color: #333;
}

/* 这个高度我们得手动去掉，否则纵向滚动做不了，它会撑开盒子高度导致两个滚动条 */
:deep(.uni-app--showtabbar uni-page-wrapper::after) {
	display: none !important;
	height: 0 !important;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
}
</style>
