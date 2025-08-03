// 防抖函数
export function debounce(fn, delay) {
	let t = null;
	return function (e) {
		if (t !== null) {
			clearTimeout(t)
		}
		t = setTimeout(() => {
			// 定时器指向window，这里让他指回input
			fn.call(this, e);
		}, delay)
	}
}
