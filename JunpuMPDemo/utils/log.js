export const enableLog = true;

/**
 * 打印debug信息
 */
export function logd(...args) {
	if (enableLog && args) {
		console.log(...args);
	}
}

/**
 * 打印错误信息
 */
export function loge(err) {
	if (err) {
		console.error(err);
	}
}
