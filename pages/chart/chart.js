// pages/chart/chart.js
import { selectQuery } from "../../utils/wx-helper";

const PADDING_V = 30;
const PADDING_H = 20;
const FONT_SIZE_WEEK = 11;
const FONT_SIZE_TIME = 10;
const COLOR_RECT = "#3BC7A8";
const COLOR_TEXT = "#999999";
const COLOR_LINE = "#FAFAFA";

Page({
	data: {
		canvasWidth: 0,
		canvasHeight: 0,
		list: [{
			"dayStr": "上周四",
			"dateList": []
		}, {
			"dayStr": "上周五",
			"dateList": []
		}, {
			"dayStr": "上周六",
			"dateList": []
		}, {
			"dayStr": "上周日",
			"dateList": []
		}, {
			"dayStr": "周一",
			"dateList": []
		}, {
			"dayStr": "周二",
			"dateList": []
		}, {
			"dayStr": "周三",
			"dateList": [{
				"startDate": 1622625606000,
				"endDate": 1622611721000
			}, {
				"startDate": 1622602308000,
				"endDate": 1622602298000
			}, {
				"startDate": 1622601568000,
				"endDate": 1622601546000
			}, {
				"startDate": 1622599589000,
				"endDate": 1622649599999
			}]
		}],
	},

	onLoad: function (options) {
		Promise.all([
			selectQuery("#canvas"),
			selectQuery(".canvas-view"),
		]).then(this._initCanvas);
	},

	/**
	 * 初始化Canvas
	 */
	_initCanvas(res) {
		console.log(res);
		const canvas = res[0].node;
		const ctx = canvas.getContext('2d');
		const { width } = res[1];
		const height = width * 0.58;
		this.canvas = { canvas, ctx, width, height };
		console.log(width, height);

		this.setData({
			canvasWidth: width,
			canvasHeight: height,
		});
		const dpr = wx.getSystemInfoSync().pixelRatio
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.scale(dpr, dpr);

		this._initChart();
		this._render();
	},

	/**
	 * 初始化图表数据
	 */
	_initChart() {
		const { canvas, width, height } = this.canvas;
		const { list } = this.data;
		console.log(canvas, width, height, list);
		let min = -1;
		let max = -1;
		list.forEach((item) => {
			const { dateList } = item;
			if (dateList) {
				dateList.forEach((it) => {
					const { startDate, endDate } = it;
					if (min === -1 && max === -1) {
						min = startDate;
						max = endDate;
					} else {
						if (startDate < min) min = startDate;
						if (endDate > max) max = endDate;
					}
				});
			}
		});
		console.log(min, max);
		const minData = new Date(min);
		const maxData = new Date(max);
		const minY = minData.getHours();
		const maxY = maxData.getMinutes() > 0 ? maxData.getHours() + 1 : maxData.getHours();
		const lineCount = maxY - minY + 1;
		console.log(minY, maxY, lineCount);
		
	},

	/**
	 * 渲染
	 */
	_render() {
		const { ctx, width, height } = this.canvas;
		ctx.clearRect(0, 0, width, height);

		ctx.rect(10, 10, width - 20, height - 20);
		ctx.fillStyle = COLOR_RECT;
		ctx.fill();

		// 画矩形
		const fontSize = 11;
		ctx.font = `${fontSize}px serif`;
		ctx.fillStyle = '#666';
		ctx.fillText("你好啊", 100, 100);

		// 画线
		const ly = y + 6;
		ctx.beginPath();
		ctx.moveTo(x - 3, ly);
		ctx.lineTo(x + w + 3, ly);
		ctx.stroke();
	},

})