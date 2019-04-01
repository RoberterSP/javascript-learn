/* eslint-disable */
import { PRODUCT_UOM_GET } from './index.js'

export function getHeaders () {
  return {
  }
}

export const getUrlParameter = function () {
  let obj = {}
  let reg = /([^?=&]+)=([^?=&#]+)/g
  window.location.href.replace(reg, function () {
    obj[arguments[1]] = arguments[2]
  })
  return obj
}


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
export const uuid = function () {
  let s = []
  let hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  let uuid = s.join('')
  return uuid
}

export const getDefaultUoms = function (productCodes, isDefault) {
  return new Promise(async (resolve, reject) => {
    try {
      let newProductUoms = {}
      // 获取单位
      let { data } = await PRODUCT_UOM_GET({ product_codes: productCodes })
      if (data) {
        let { product_uoms: productUoms = [] } = data
        if (isDefault) {
          Object.keys(productUoms).forEach(key => {
            productUoms[key].forEach(data => {
              if (data.uom_type === 'sale') {
                // 默认单位
                newProductUoms[key] = {}
                newProductUoms[key].uom_name = data.uom_name
                newProductUoms[key].uom_id = data.uom_id
                newProductUoms[key].unit_price = data.sale_price
              }
            })
          })
        } else {
          Object.keys(productUoms).forEach((key, index) => {
            newProductUoms[key] = {}
            newProductUoms[key].uoms = []
            let uoms = []
            productUoms[key].forEach(data => {
              // 默认单位
              uoms.push({
                uom_name: data.uom_name,
                uom_id: data.uom_id,
                uom_type: data.uom_type
              })
            })
            newProductUoms[key].uoms = uoms
          })
        }
        resolve(newProductUoms)
      }
    } catch (e) {
      reject(e)
    }
  })
}
