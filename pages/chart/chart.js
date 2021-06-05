// pages/chart/chart.js
import { selectQuery } from "../../utils/wx-helper";

const PADDING_V = 30; // 图标区域上下留白
const PADDING_H = 20; // 图标区域左右留白
const FONT_SIZE_WEEK = 11; // 星期字号 px
const FONT_SIZE_TIME = 10; // 时间字号 px
const COLOR_RECT = "#3BC7A8"; // 柱子颜色
const COLOR_TEXT = "#999999"; // 文字颜色
const COLOR_LINE = "#FAFAFA"; // 线颜色
const ITEM_WIDTH = 12; // 柱子宽度
const TEXT_SPACING = 5; // 文字空白间距

Page({
	data: {
		canvasWidth: 0,
		canvasHeight: 0,
		list: [{
			"dayStr": "上周四",
			"dateList": [{
				"startDate": 1620280800000,
				"endDate": 1620288000000
			}]
		}, {
			"dayStr": "上周五",
			"dateList": [{
				"startDate": 1620289800000,
				"endDate": 1620290340000
			}]
		}, {
			"dayStr": "上周六",
			"dateList": []
		}, {
			"dayStr": "上周日",
			"dateList": []
		}, {
			"dayStr": "周一",
			"dateList": [{
				"startDate": 1620293940000,
				"endDate": 1620301140000
			}, {
				"startDate": 1620304740000,
				"endDate": 1620308340000
			},]
		}, {
			"dayStr": "周二",
			"dateList": []
		}, {
			"dayStr": "周三",
			"dateList": []
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
		const canvas = res[0].node;
		const ctx = canvas.getContext('2d');
		const { width } = res[1];
		const height = width * 0.58;
		this.canvas = { canvas, ctx, width, height };

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
		const { width, height } = this.canvas;
		const { list } = this.data;

		const chartWidth = width - PADDING_H * 2;
		const chartHeight = height - PADDING_V * 2;

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
		const minDate = new Date(min);
		const maxDate = new Date(max);
		let minY = minDate.getHours();
		let maxY = maxDate.getMinutes() > 0 ? maxDate.getHours() + 1 : maxDate.getHours();
		const lineCount = maxY - minY;
		console.log(minY, maxY, lineCount);

		let arr = [];
		if (lineCount > 6) {
			const offset = Math.ceil(lineCount / 6);
			for (let i = 0; i <= 6; i++) {
				const curCount = minY + i * offset;
				if (curCount > maxY) break;
				arr[i] = curCount;
			}
		} else {
			for (let i = 0; i <= lineCount; i++) {
				arr[i] = min + 1 * i;
			}
		}
		// 如果最大值超过24，则整体减小
		if (arr && arr.length > 0) {
			const lastItem = arr[arr.length - 1];
			if (lastItem > 24) {
				const offset = lastItem - 24;
				arr = arr.map(item => item - offset);
			}
		}

		console.log(arr);
		minY = arr[0];
		maxY = arr[arr.length - 1];
		this._clearDateToHours(minDate, minY);
		this._clearDateToHours(maxDate, maxY);
		console.log({ minDate, maxDate });
		const minTimes = minDate.getTime();
		const maxTimes = maxDate.getTime();
		const lineSpacing = chartHeight / (arr.length - 1);
		const itemSpacing = (chartWidth - ITEM_WIDTH * list.length) / list.length;
		this.chartData = { chartWidth, chartHeight, minTimes, maxTimes, lineSpacing, itemSpacing, arr };
	},

	/**
	 * 设定指定时间戳到指定小时
	 */
	_clearDateToHours(date, hours) {
		date.setHours(hours);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
	},

	/**
	 * 渲染
	 */
	_render() {
		const { ctx, width, height } = this.canvas;
		const { chartWidth, chartHeight, minTimes, maxTimes, lineSpacing, itemSpacing, arr } = this.chartData;
		const { list } = this.data;
		console.log(this.chartData);
		// 清除画布
		ctx.clearRect(0, 0, width, height);

		// 画线
		arr.forEach((item, i) => {
			const y = PADDING_V + chartHeight - i * lineSpacing;

			// 画线
			ctx.beginPath();
			ctx.moveTo(PADDING_H, y);
			ctx.lineTo(PADDING_H + chartWidth, y);
			ctx.strokeStyle = COLOR_LINE;
			ctx.lineWidth = 1;
			ctx.stroke();

			// 画时间
			ctx.font = `${FONT_SIZE_TIME}px sans-serif`;
			ctx.fillStyle = COLOR_TEXT;
			ctx.textAlign = 'right';
			ctx.fillText(item, PADDING_H - TEXT_SPACING, y + 3);
		});

		// 画小时
		const { width: hoursWidth } = ctx.measureText(arr[arr.length - 1]);
		ctx.textAlign = 'left';
		ctx.fillText("小时", PADDING_H - TEXT_SPACING - hoursWidth, PADDING_V - TEXT_SPACING - FONT_SIZE_TIME)

		list.forEach((item, index) => {
			const { dayStr, dateList } = item;
			const itemCenterX = PADDING_H + itemSpacing / 2 + ITEM_WIDTH / 2 + (ITEM_WIDTH + itemSpacing) * index;
			const b = PADDING_V + chartHeight;

			// 画星期
			const week = dayStr;
			ctx.font = `${FONT_SIZE_WEEK}px sans-serif`;
			ctx.fillStyle = COLOR_TEXT;
			ctx.textAlign = 'center';
			const weekY = b + TEXT_SPACING + FONT_SIZE_WEEK;
			ctx.fillText(week, itemCenterX, weekY);

			// 画时间条
			dateList.forEach((it, i) => {
				const { startDate, endDate } = it;
				const allTimes = maxTimes - minTimes;
				const h = (endDate - startDate) / allTimes * chartHeight;
				const space = (startDate - minTimes) / allTimes * chartHeight;
				const l = itemCenterX - ITEM_WIDTH / 2;
				const t = b - space - h;

				ctx.fillStyle = COLOR_RECT;
				ctx.rect(l, t, ITEM_WIDTH, h);
				ctx.fill();
			});
		});

	},

})