<script lang="ts">
import { defineComponent } from 'vue';
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { getLocal } from './utils/local';
import WsManager from '@/ws-manager/ws'
import { useInitStore } from '@/pinia/init/init'

export default defineComponent({
	setup() {
		onLaunch( async () => {
			console.log("App Launch");
			const initStore = useInitStore();
			if (!getLocal('token')) {
				uni.reLaunch({
					url: 'pages/login/login'
				});
				return
			}
			await initStore.initApp()

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
