
export const MARK_RADIUS = 8; // 红圈半径
export const DEL_RADIUS = 6; // 删除按钮半径
export const TOUCH_OFFSET = 5; // 触摸误差
export const IMAGE_MAX_SIZE = 1600; // 图片最大尺寸

/** 
 * 空白作业对勾符号
 */
export const symbolCorrect = {
	width: 48,
	height: 30,
	path0: function () {
		const path = new Path2D();
		path.moveTo(0, 17.9322971);
		path.bezierCurveTo(5.61532453, 24.4437317, 10.3525062, 28.1893917, 14.2115451, 29.169277);
		path.bezierCurveTo(16.8867392, 29.848561, 20.1217384, 24.1110756, 28.904537, 14.2758908);
		path.bezierCurveTo(30.9285487, 12.0093548, 33.9603697, 9.32524387, 38, 6.22355807);
		return path;
	},
	path1: function () {
		const path = new Path2D();
		path.moveTo(37.1310425, 5.66235352);
		path.bezierCurveTo(40.5802205, 3.23543294, 43.3124185, 1.68948546, 45.3276364, 1.02451108);
		path.bezierCurveTo(47.3428544, 0.359536699, 45.057332, 2.39352129, 38.4710693, 7.12646484);
		path.lineTo(37.1310425, 5.66235352);
		path.closePath();
		return path;
	},
};

/**
 * 创建Image
 */
export function createImage(canvas, imageUrl) {
	return new Promise((resolve, reject) => {
		const img = canvas.createImage();
		img.onload = res => resolve(img);
		img.onerror = reject;
		img.src = imageUrl;
	});
}

/**
 * 等比缩放原始尺寸为目标尺寸
 * @param {Number} srcWidth 原始宽度
 * @param {Number} srcHeight 原始高度
 * @param {Number} destWidth 目标宽度，默认1600
 * @param {Number} destHeight 目标高度，默认1600
 * @param {Boolean} isResizeMini 如果原始尺寸小于目标尺寸，是否缩放的，默认false
 */
export function resizeImage(srcWidth, srcHeight, destWidth, destHeight, isResizeMini) {
	const maxWidth = destWidth || IMAGE_MAX_SIZE;
	const maxHeight = destHeight || IMAGE_MAX_SIZE;
	const srcRatio = srcWidth / srcHeight;
	const destRatio = maxWidth / maxHeight;
	let width = srcWidth;
	let height = srcHeight;
	if (srcRatio >= destRatio && (srcWidth > maxWidth || isResizeMini)) {
		width = maxWidth;
		height = maxWidth / srcRatio;
	} else if (srcRatio < destRatio && (srcHeight > maxHeight || isResizeMini)) {
		height = maxHeight;
		width = maxHeight * srcRatio;
	}
	return { width, height };
}

/**
 * 获取删除按钮的Rect
 */
export function getDelRect(item) {
	const r = item.right;
	const t = item.top;
	const left = r - DEL_RADIUS;
	const top = t - DEL_RADIUS;
	const right = r + DEL_RADIUS;
	const bottom = t + DEL_RADIUS;
	return { left, top, right, bottom };
}

/**
 * 生成新的Mark信息
 */
export function generateMarkPoint(x, y) {
	const left = x - MARK_RADIUS - TOUCH_OFFSET;
	const top = y - MARK_RADIUS - TOUCH_OFFSET;
	const right = x + MARK_RADIUS + TOUCH_OFFSET;
	const bottom = y + MARK_RADIUS + TOUCH_OFFSET;
	return { x, y, left, top, right, bottom };
}

/**
 * 移动超出边界时的处理
 */
export function doOnMovingOutOfBounds(mark, width, height) {
	const { x, y, left, top, right, bottom } = mark;
	if (left < 0) {
		const offset = 0 - left;
		mark.left = 0;
		mark.right = right + offset;
		mark.x = x + offset;
	} else if (right > width) {
		const offset = right - width;
		mark.right = width;
		mark.left = left - offset;
		mark.x = x - offset;
	}
	if (top < 0) {
		const offset = 0 - top;
		mark.top = 0;
		mark.bottom = bottom + offset;
		mark.y = y + offset;
	} else if (bottom > height) {
		const offset = bottom - height;
		mark.bottom = height;
		mark.top = top - offset;
		mark.y = y - offset;
	}
}

/**
 * 生成坐标信息
 */
export function generateMarkLocation(marks, scale, width, height) {
	const result = { width, height };
	return new Promise((resolve, reject) => {
		if (!marks) {
			resolve(JSON.stringify(result));
			return;
		}
		const list = marks.map(item => {
			const { x, y } = item;
			return { x: x * scale, y: y * scale };
		});
		result.location = list;
		resolve(result);
	});
}

/**
 * 旋转坐标
 */
export function rotateMarkPoint(marks, height, scale) {
	return marks.map(item => {
		const x = (height - item.y) * scale;
		const y = item.x * scale;
		return generateMarkPoint(x, y);
	});
}
