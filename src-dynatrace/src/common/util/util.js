import {LESS_VAR_MAP} from 'common/util/constant'

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
    default:
      return data
  }
}

/**
 * 获取文字的长度
 * @param str
 * @param fontSize
 * @returns {number}
 */
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

export function getLessColor (lessVar = '@turq-06') {
  return LESS_VAR_MAP[lessVar]
}
