// import md5 from 'js-md5'
import Store from '@/store'

// 设备号获取计算机名
function getDeviceId () {
  var os = require('os')
  var hostname = os.hostname()
  return hostname
}

// 计算签名
function getSign (clientId, deviceId, nonce, clientSecret) {
  const hashStr = 'clientId=' + clientId + '&deviceId=' + deviceId + '&nonce=' + nonce + '&clientSecret=' + clientSecret
  return md5(hashStr)
}

// 随机字符串
function randomString (len) {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890'
  var maxPos = $chars.length
  var pwd = ''
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function getHeaders () {
  const clientId = 'psst-mall' // 应用ID
  const clientSecret = 'db0127ad4ab899ef13140b21b64958a1' // 应用ID
  const deviceId = getDeviceId() // 设备号
  const nonce = randomString(32) // 随机字符串
  const sign = getSign(clientId, deviceId, nonce, clientSecret).toUpperCase() // 签名
  const tokenAssign = Store.state.userInfo.token // 签名

  return {
    'clientId': clientId,
    'clientSecret': clientSecret, // 应用秘钥
    'deviceId': deviceId, // 移动设备Id
    'nonce': nonce, // 随机字符串
    'sign': sign, // 签名
    'token': tokenAssign // 访问令牌
  }
}

// 日期转换
export function DateFormat (date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 当前日期往前 N 天 , 支持格式转换
export function ExDays (days, fmt) {
  var today = new Date()
  var exDay = new Date((today / 1000 - 86400 * days) * 1000)
  if (fmt) {
    exDay = DateFormat(exDay, fmt)
  }
  return exDay
}

export function timeConversionFunc (type, val) {
  let result = {
    start_time: '',
    end_time: ''
  }
  switch (type) {
    case 'min':
      result.end_time = new Date().getTime()
      result.start_time = new Date().getTime() - val * 60 * 1000
      return result
      break
    case 'hour':
      result.end_time = new Date().getTime()
      result.start_time = new Date().getTime() - val * 60 * 60 * 1000
      return result
      break
    case 'day':
      result.end_time = new Date().getTime()
      result.start_time = new Date().getTime() - val * 24 * 60 * 60 * 1000
      return result
      break
    case 'week':
      result.end_time = new Date().getTime()
      result.start_time = new Date().getTime() - val * 7 * 24 * 60 * 60 * 1000
      return result
      break
  }
}

export function currencyFunc (item, subsidiary = '', accuracy = 2) {
  // accuracy:精确到几位， subsidiary：附加单位
  let data = JSON.parse(JSON.stringify(item))
  switch (data.type) {
    // 暂时三种类型 流量 ，响应时间， 次数
    case 'flow':
      // 流量 （KB, M, G）
      if (Number(data.value) - (1024 * 1024 * 1024) >= 0) {
        data.unit = 'T'
        if (data.value % (1024 * 1024 * 1024) === 0) {
          data.value = (data.value / (1024 * 1024 * 1024))
        } else {
          data.value = (data.value / (1024 * 1024 * 1024)).toFixed(accuracy)
        }
      } else if (Number(data.value) - (1024 * 1024) >= 0 && Number(data.value) - (1024 * 1024 * 1024) < 0) {
        data.unit = 'G'
        if (data.value % (1024 * 1024) === 0) {
          data.value = (data.value / (1024 * 1024))
        } else {
          data.value = (data.value / (1024 * 1024)).toFixed(accuracy)
        }
      } else if (Number(data.value) - 1024 >= 0 && Number(data.value) - (1024 * 1024) < 0) {
        data.unit = 'M'
        if (data.value % 1024 === 0) {
          data.value = (data.value / 1024)
        } else {
          data.value = (data.value / 1024).toFixed(accuracy)
          // 有不能整除，但是保留两位后.00 的情况， 就直接不要小数了
          if (data.value - Math.ceil(data.value) === 0) {
            data.value = parseInt(Math.ceil(data.value))
          }
        }
      } else if (Number(data.value) - 1024 < 0) {
        data.unit = 'KB'
        data.value = data.value.toFixed(accuracy)
      }
      return data
      break
    // case 'time':
    //   data.unit = ''
    //   // ms || s || min || hour
    //   if (Number(data.value) - 1*60*60*1000 >= 0) {
    //     // data.unit = data.type==='time' ? '亿ms' : '亿次'
    //     data.unit = 'h'
    //     if (data.value % 1*60*60*1000 === 0) {
    //       data.value = (data.value / 1*60*60*1000)
    //     } else {
    //       data.value = (data.value / 1*60*60*1000).toFixed(accuracy)
    //     }
    //   } else if (Number(data.value) - 1*60*1000 >= 0 && Number(data.value) - 1*60*60*1000 < 0) {
    //     // data.unit = data.type==='time' ? '万ms' : '万次'
    //     data.unit = 'min'
    //     if (data.value % 1*60*1000 === 0) {
    //       data.value = (data.value / 1*60*1000)
    //     } else {
    //       data.value = (data.value / 1*60*1000).toFixed(accuracy)
    //       // 有不能整除，但是保留两位后.00 的情况， 就直接不要小数了
    //       if (data.value - Math.ceil(data.value) === 0) {
    //         data.value = parseInt(Math.ceil(data.value))
    //       }
    //     }
    //   } else if (Number(data.value) - 1*1000 >= 0 && Number(data.value) - 1*60*1000 < 0) {
    //     // data.unit = data.type==='time' ? '万ms' : '万次'
    //     data.unit = 's'
    //     if (data.value % 1000 === 0) {
    //       data.value = (data.value / 1*1000)
    //     } else {
    //       data.value = (data.value / 1*1000).toFixed(accuracy)
    //       // 有不能整除，但是保留两位后.00 的情况， 就直接不要小数了
    //       if (data.value - Math.ceil(data.value) === 0) {
    //         data.value = parseInt(Math.ceil(data.value))
    //       }
    //     }
    //   } else if (Number(data.value) - 10000 < 0) {
    //     data.unit = 'ms'
    //   }
    //   if (subsidiary) {
    //     data.unit = data.unit + subsidiary
    //   }
    //   return data
    //   break
    case 'time':
    case 'count':
    case 'common':
      data.unit = ''
      // ms || 次数 （万， 亿）
      if (Number(data.value) - 100000000 >= 0) {
        // data.unit = data.type==='time' ? '亿ms' : '亿次'
        data.unit = '亿'
        if (data.value % 100000000 === 0) {
          data.value = (data.value / 100000000)
        } else {
          data.value = (data.value / 100000000).toFixed(accuracy)
        }
      } else if (Number(data.value) - 10000 >= 0 && Number(data.value) - 100000000 < 0) {
        // data.unit = data.type==='time' ? '万ms' : '万次'
        data.unit = '万'
        if (data.value % 10000 === 0) {
          data.value = (data.value / 10000)
        } else {
          data.value = (data.value / 10000).toFixed(accuracy)
          // 有不能整除，但是保留两位后.00 的情况， 就直接不要小数了
          if (data.value - Math.ceil(data.value) === 0) {
            data.value = parseInt(Math.ceil(data.value))
          }
        }
      } else if (Number(data.value) - 10000 < 0) {
        data.unit = ''
      }
      if (subsidiary) {
        data.unit = data.unit + subsidiary
      }
      return data
      break
    default:
      return data
      break
  }
}

export function getTextWidth (str, fontSize) {
  if (!getTextWidth.txt) {
    let txt = document.createElement('span')
    txt.style.position = 'absolute'

    //  避免遮挡其他元素
    txt.style.zIndex = -10
    txt.style.visibility = 'hidden'

    //  一定要加载到DOM中才能计算出字符宽度
    document.body.appendChild(txt)
    getTextWidth.txt = txt
  }
  //  控制字符的字体大小
  getTextWidth.txt.style.fontSize = fontSize + 'px'
  //  设置字符内容
  getTextWidth.txt.textContent = str
  //  返回计算结果
  return getTextWidth.txt.offsetWidth
}
