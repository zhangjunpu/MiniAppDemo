// pages/chart/chart.js
import { selectQuery } from "../../utils/wx-helper";
import { createImage } from "../../utils/mark-utils";
import { loge } from "../../utils/log";

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
			"dayStr": "上周三",
			"dateList": [{
				"startDate": 1622606942000,
				"endDate": 1622649599999
			}]
		}, {
			"dayStr": "上周四",
			"dateList": [{
				"startDate": 1622685282000,
				"endDate": 1622735999999
			}]
		}, {
			"dayStr": "上周五",
			"dateList": [{
				"startDate": 1622777319000,
				"endDate": 1622822399999
			}]
		}, {
			"dayStr": "上周六",
			"dateList": [{
				"startDate": 1622856945000,
				"endDate": 1622908799999
			}]
		}, {
			"dayStr": "上周日",
			"dateList": []
		}, {
			"dayStr": "周一",
			"dateList": [{
				"startDate": 1623035656000,
				"endDate": 1623036107000
			}, {
				"startDate": 1623036124000,
				"endDate": 1623055405000
			}, {
				"startDate": 1623056477000,
				"endDate": 1623081599999
			}]
		}, {
			"dayStr": "周二",
			"dateList": [{
				"startDate": 1623116061000,
				"endDate": 1623116062000
			}, {
				"startDate": 1623117388000,
				"endDate": 1623135639000
			}, {
				"startDate": 1623139813000,
				"endDate": 1623141464000
			}, {
				"startDate": 1623141472000,
				"endDate": 1623149152000
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
		const canvas = res[0].node;
		const ctx = canvas.getContext('2d');
		const { width } = res[1];

		const resizeCanvas = (width, height) => {
			this.setData({
				canvasWidth: width,
				canvasHeight: height,
			});
			const dpr = wx.getSystemInfoSync().pixelRatio;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			ctx.scale(dpr, dpr);
		}

		const renderDelay = (flag, img, w) => {
			setTimeout(() => {
				if (flag)
					this._render();
				else
					this._renderEmptyView(img, w);
			}, 100);
		}

		if (true) {
			const height = width * 0.58;
			this.canvas = { canvas, ctx, width, height };
			resizeCanvas(width, height);
			this._initChart();
			renderDelay(true);
		} else {
			createImage(canvas, "/assets/images/none.png").then(img => {
				const { width: imgWidth, height: imgHeight } = img;
				const height = imgWidth > width ? (width / imgWidth) * imgHeight : imgHeight;
				const w = Math.min(imgWidth, width);
				this.canvas = { canvas, ctx, width, height };
				console.log("img", imgWidth, imgHeight);
				resizeCanvas(width, height);
				renderDelay(false, img, w);
			}).catch(loge);
		}
	},

	/**
	 * 渲染空数据
	 */
	_renderEmptyView(img, w) {
		const { canvas, ctx, width, height } = this.canvas;
		// 清除画布
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// 画空数据图片
		const x = (width - w) / 2;
		ctx.drawImage(img, x, 0, width, height);
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
					const start = new Date(startDate);
					const end = new Date(endDate);
					const startHours = start.getHours();
					const endHours = end.getMinutes() > 0 ? end.getHours() + 1 : end.getHours();
					if (min === -1 && max === -1) {
						min = startHours;
						max = endHours;
					} else {
						if (startHours < min) min = startHours;
						if (endHours > max) max = endHours;
					}
				});
			}
		});
		const lineCount = max - min;
		console.log(min, max, lineCount);

		let arr = [];
		if (lineCount > 6) {
			const offset = Math.ceil(lineCount / 6);
			for (let i = 0; i <= 6; i++) {
				const curCount = min + i * offset;
				arr[i] = curCount;
				if (curCount >= max) break;
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
		min = arr[0];
		max = arr[arr.length - 1];
		const lineSpacing = chartHeight / (arr.length - 1);
		const itemSpacing = (chartWidth - ITEM_WIDTH * list.length) / list.length;
		this.chartData = { chartWidth, chartHeight, min, max, lineSpacing, itemSpacing, arr };
		this.tempDate = new Date();
	},

	/**
	 * 渲染
	 */
	_render() {
		const { canvas, ctx, width, height } = this.canvas;
		const { list } = this.data;
		const { chartWidth, chartHeight, min, max, lineSpacing, itemSpacing, arr } = this.chartData;
		const tempDate = this.tempDate;
		console.log("_render", this.chartData);
		// 清除画布
		ctx.clearRect(0, 0, canvas.width, canvas.height);

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
				tempDate.setTime(startDate);
				this._clearDateToHours(tempDate, min);
				const minTimes = tempDate.getTime();
				this._clearDateToHours(tempDate, max);
				const maxTimes = tempDate.getTime();
				const allTimes = maxTimes - minTimes;
				const h = (endDate - startDate) / allTimes * chartHeight;
				const space = (startDate - minTimes) / allTimes * chartHeight;
				const l = itemCenterX - ITEM_WIDTH / 2;
				const t = b - space - h;
				
				ctx.fillStyle = COLOR_RECT;
				ctx.rect(l, t, ITEM_WIDTH, h);
				// this._drawRoundRect(l, t, l + ITEM_WIDTH, t + h, ITEM_WIDTH / 2, ctx);
				ctx.fill();
			});
		});
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
	 * 画圆角矩形
	 */
	_drawRoundRect(left, top, right, bottom, radius, ctx) {
		const w = right - left;
		const h = bottom - top;
		const r = Math.min(radius, Math.min(w / 2, h / 2));
		console.log("origin", left, top, right, bottom, "radius", radius);
		console.log(`${w}/${h}, r:${r}`);
		ctx.beginPath();
		ctx.moveTo(left, top + r);
		ctx.arcTo(left, top, left + r, top, r);
		ctx.lineTo(right - r, top);
		ctx.arcTo(right, top, right, top + r, r);
		ctx.lineTo(right, bottom - r);
		ctx.arcTo(right, bottom, right - r, bottom, r);
		ctx.lineTo(left + r, bottom);
		ctx.arcTo(left, bottom, left, bottom - r, r);
		ctx.closePath();
		ctx.stroke();
	},

})