// pages/cert/cert.js
import { selectQuery, canvasToTempFilePath, saveImageToPhotosAlbum, toast } from "../../utils/wx-helper";
import { logd, loge } from "../../utils/log";
import { createImage, resizeImage } from "../../utils/mark-utils";

Page({
	data: {
		isShow: false,
		name: "",
		canvasWidth: 0,
		canvasHeight: 0,
		image: null,
		isLoading: false,
	},

	onLoad: function (options) {
		this._initCanvas();
	},

	/**
	 * 初始化Canvas
	 */
	_initCanvas() {
		Promise.all([
			selectQuery("#canvas"),
			selectQuery(".canvas-view"),
		]).then(res => {
			const canvas = res[0].node;
			const ctx = canvas.getContext('2d');
			const { width, height } = res[1];
			this.canvas = { canvas, ctx, width, height };
			// 加载图片
			this._loadImage("/assets/images/ic_cert.jpg");
		});
	},

	/**
	 * 加载图片
	 */
	_loadImage(url) {
		const { canvas, ctx, width: w, height: h } = this.canvas;

		createImage(canvas, url).then(img => {
			this.data.image = img;
			const { width, height } = img;
			resizeCanvas(width, height);
			// this._render();
		}).catch(loge);

		/** 重新计算canvas大小 */
		const resizeCanvas = (imgWidth, imgHeight) => {
			// 根据图片大小和view大小，计算应该显示多大
			const { width, height } = resizeImage(imgWidth, imgHeight, w, h);
			this.setData({
				canvasWidth: width,
				canvasHeight: height,
			});
			canvas.width = imgWidth;
			canvas.height = imgHeight;
			const scale = imgWidth / width;
			ctx.scale(scale, scale);
			logd("canvas resize:", canvas.width, canvas.height, "scale:", scale, "canvas view resize:", width, height);
			this.info = { scale, width, height, imgWidth, imgHeight };
		}
	},

	/**
	 * 清除画布
	 */
	_clearCanvas() {
		const { canvas, ctx } = this.canvas;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},

	/**
	 * 渲染
	 */
	_render() {
		const { canvas, ctx } = this.canvas;
		const { width, height, imgWidth } = this.info;
		const { image, name } = this.data;
		this._clearCanvas();

		// 画图
		ctx.drawImage(image, 0, 0, width, height);

		// 画文字
		const fontSize = width / imgWidth * 30;
		ctx.font = `${fontSize}px serif`;
		ctx.fillStyle = '#666';
		const { width: w } = ctx.measureText(name);
		const x = (width - w) / 2;
		const y = height / 2.4;
		ctx.fillText(name, x, y);

		// 画线
		const ly = y + 6;
		ctx.beginPath();
		ctx.moveTo(x - 3, ly);
		ctx.lineTo(x + w + 3, ly);
		ctx.stroke();
	},

	/**
	 * 保存图片
	 */
	handleSaveImage(e) {
		const { canvas } = this.canvas;
		const { imgWidth, imgHeight } = this.info;

		this._setLoading(true);
		canvasToTempFilePath({
			canvas: canvas,
			destWidth: imgWidth,
			destHeight: imgHeight
		}).then(res => {
			const { tempFilePath } = res;
			return saveImageToPhotosAlbum(tempFilePath);
		}).then(res => {
			toast("已保存到相册");
			this._setLoading(false);
		}).catch(err => {
			loge(err);
			this._setLoading(false);
		});
	},

	_setLoading(isLoading) {
		this.setData({ isLoading });
	},

	handleInputName(e) {
		const { value } = e.detail;
		this.data.name = value + "老师";
	},

	/**
	 * 获取证书
	 */
	handleGetCert(e) {
		const { name } = this.data;
		this.setData({
			name,
			isShow: true
		});
		this._render();
	},

	/**
	 * 返回输入姓名
	 */
	handleBackInput(e) {
		this._clearCanvas();
		this.setData({
			isShow: false,
			name: ""
		});
	}
})