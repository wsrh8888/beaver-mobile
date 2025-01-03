import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 加载中文语言包
dayjs.locale('zh-cn')

// 扩展 dayjs 的相对时间插件
dayjs.extend(relativeTime)
export function dayFormat(val) {
	//转化为日期对象。
	const targetTime = dayjs.unix(val / 1000)
	// 返回相对时间的字符串描述; dayjs().from() 方法需要传入一个日期对象（比如 dayjs('2023-06-14')），而不是一个时间戳。
	return dayjs().to(dayjs(targetTime))
}

export function getTimeFormat(timestamp) {
	//console.log(dayjs(Number(timestamp)));//一定要把字符串转数字,这边我我传过来之前已经转了

	//console.log(dayjs(1703670843192).format("YYYY-MM-DD"));
	const now = Date.now(); // 获取当前时间戳  
	const date = dayjs(timestamp);
	let dayType; //时间范围
	let timePeriod; //早中晚
	if (date.isSame(dayjs(now), 'day')) {
		dayType = ''
	} else if (date.isSame(dayjs(now).subtract(1, 'day'), 'day')) {
		dayType = '昨天'
	} else {
		if (date.year() === dayjs(now).year()) {
			// 年份相同，返回格式：12/24 15:09  
			dayType = date.format('MM-DD'); 
			}
			else {
				dayType = date.format('YYYY/MM/DD');
			}
		}
		const hour = date.hour();
		if (hour >= 0 && hour < 12) {
			timePeriod = '上午';
		} else if (hour >= 12 && hour < 18) {
			timePeriod = '下午';
		} else {
			timePeriod = '晚上';
		}

		const formattedTime = date.format('HH:mm');
		return `${dayType}  ${timePeriod} ${formattedTime}`;
	}