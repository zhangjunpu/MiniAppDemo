/**
 * 显示、隐藏loading
 * @param {Boolean} flag show or hide
 */
export function loading(flag) {
	flag = flag === undefined ? true : flag
	if (flag) {
		wx.showLoading({
			title: '加载中…',
		});
	} else {
		wx.hideLoading()
	}
}

/**
 * 吐司
 * @param {string} msg 
 */
export function toast(msg) {
	if (msg && typeof msg === "string") {
		wx.showToast({
			title: msg,
			icon: 'none'
		});
	}
}

/**
 * 回首页
 */
export function goHome() {
	wx.reLaunch({
		url: '/pages/home/home',
	});
}

/**
 * 获得view的信息
 * @param {String} selectId 选择器
 */
export function selectQuery(selectId) {
	return new Promise((resolve, reject) => {
		wx.createSelectorQuery()
			.select(selectId)
			.fields({ node: true, size: true })
			.exec(res => resolve(res[0]));
	});
}

/**
 * 选择图片
 */
export function chooseImage(count) {
	return new Promise((resolve, reject) => {
		wx.chooseImage({
			count: count || 1,
			sizeType: ['original'],
			sourceType: ['album', 'camera'],
			success: resolve,
			fail: reject,
		})
	});
}

/**
 * 获取图片信息
 */
export function getImageInfo(src) {
	return new Promise((resolve, reject) => {
		wx.getImageInfo({
			src,
			success: resolve,
			fail: reject,
		});
	});
}

/**
 * canvas生成临时文件
 */
export function canvasToTempFilePath(option) {
	return new Promise((resolve, reject) => {
		wx.canvasToTempFilePath({
			canvasId: option.canvasId,
			canvas: option.canvas,
			x: option.x,
			y: option.y,
			width: option.width,
			height: option.height,
			destWidth: option.destWidth,
			destHeight: option.destHeight,
			fileType: option.fileType || 'jpg',
			quality: option.quality,
			success: resolve,
			fail: reject,
		});
	});
}

/**
 * 保存图片到相册
 */
export function saveImageToPhotosAlbum(filePath) {
	return new Promise((resolve, reject) => {
		wx.saveImageToPhotosAlbum({
			filePath,
			success: resolve,
			fail: reject,
		})
	});
}
