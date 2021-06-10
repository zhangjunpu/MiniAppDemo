const formatTime = (ti, type) => {
  const date = new Date(ti);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let week = date.getDay();
  switch (week) {
    case 1:
      week = '星期一';
      break;
    case 2:
      week = '星期二';
      break;
    case 3:
      week = '星期三';
      break;
    case 4:
      week = '星期四';
      break;
    case 5:
      week = '星期五';
      break;
    case 6:
      week = '星期六';
      break;
    case 0:
      week = '星期日';
      break;
  }

  let title = '';
  if (hour >= 2 && hour < 12) {
    title = '上午'
  } else if (hour >= 12 && hour < 19) {
    title = '下午'
  } else {
    title = '晚上'
  }

  const lastDate = [year, month, day];

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  switch (type) {
    case 'YYYY年MM月DD日':
      return `${formatNumber(year)}年${formatNumber(month)}月${formatNumber(day)}日`
    case 'YYYY-MM-DD':
      return lastDate.map(formatNumber).join('-')
    case 'MMDD':
      return `${ month}月${day}日`
    case 'YYYY.MM.DD':
      return lastDate.map(formatNumber).join('.')
    case 'MM.DD':
      return `${ month}.${day}`
    case 'HH:mm':
      return `${title}${hour>12?hour-12:hour}:${minute}`
    default:
      return {
        month: formatNumber(month),
          day: formatNumber(day),
          week,
      }
  }
}