// date.js
export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}

export function str2Date(dateStr, separator) {
	if (!separator) {
		separator = "-";
	}
	let dateArr = dateStr.split(separator);
	let year = parseInt(dateArr[0]);
	let month;
	//处理月份为04这样的情况
	if (dateArr[1].indexOf("0") == 0) {
		month = parseInt(dateArr[1].substring(1));
	} else {
		month = parseInt(dateArr[1]);
	}
	let day = parseInt(dateArr[2]);
	let date = new Date(year, month - 1, day);
	return date;
}


/**
 * 计算两个日期相隔年限，用于计算年龄等
 * @param {Object} date1
 * @param {Object} date2
 */
export function  calYear(date1,date2) {
	let a = new Date(date1).getFullYear();
	let b = new Date(date2).getFullYear();
	console.log(b-a);
	return b-a;
}

/**
 * 计算两个日期相隔年限，用于计算年龄等
 * @param {Object} date1
 * @param {Object} date2
 */
export function  calCurrentYear(date) {
	let a = new Date(date).getFullYear();
	let b = new Date().getFullYear();
	console.log(b-a);
	return b-a;
}

// 时间戳转日期
export function timestampToTime(timestamp) {
  // 时间戳为10位需*1000，时间戳为13位不需乘1000
  var date = new Date(timestamp);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = date.getHours() + ":";
  var m = date.getMinutes() + ":";
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}