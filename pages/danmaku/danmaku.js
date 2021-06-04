//index.js
var that = undefined;
var doommList = [];
var i = 0;
var ids = 0;
var cycle = null //计时器

// 弹幕参数
class Doomm {
	constructor(text, top, time, color) { //内容，顶部距离，运行时间，颜色（参数可自定义增加）
		this.text = text;
		this.top = top;
		this.time = time;
		this.color = color;
		this.display = true;
		this.id = i++;
	}
}
// 弹幕字体颜色
function getRandomColor() {
	let rgb = []
	for (let i = 0; i < 3; ++i) {
		let color = Math.floor(Math.random() * 256).toString(16)
		color = color.length == 1 ? '0' + color : color
		rgb.push(color)
	}
	return '#' + rgb.join('')
}

Page({
	data: {
		doommData: [],
		arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	},
	onLoad: function () {
		that = this;
		cycle = setInterval(function () {
			let arr = that.data.arr
			if (arr[ids] == undefined) {
				ids = 0
				// 1.循环一次，清除计时器
				// doommList = []
				// clearInterval(cycle)

				// 2.无限循环弹幕
				doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor()));
				if (doommList.length > 5) { //删除运行过后的dom
					doommList.splice(0, 1)
				}
				that.setData({
					doommData: doommList
				})
				ids++
			} else {
				doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor()));
				if (doommList.length > 5) {
					doommList.splice(0, 1)
				}
				that.setData({
					doommData: doommList
				})
				ids++
			}
		}, 1000)

	},
	onHide() {
		clearInterval(cycle)
		ids = 0;
		doommList = []
	},
	onUnload() {
		clearInterval(cycle)
		ids = 0;
		doommList = []
	},
	bindbt: function () {
		doommList.push(new Doomm("这是我的弹幕", Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
		this.setData({
			doommData: doommList
		})
	}
})