/* eslint-disable no-inner-declarations */
// 统一设置分页器的 pagesize
export const PAGESIZE = 4000

/*
--------时间戳转化为正常日期格式化--------------------------
@method formatDate
@param  {oject} [dates] 日期时间 new Date()
@param {string} [fmt] 时间格式 yyyy-MM-dd hh:mm:ss
@return {string} [fmt] 时间字符串 2014-02-05 02:00:00
----------------------------------------------------
*/
export function formatDate (dates, fmt) {
  let o = {
    'M+': dates.getMonth() + 1, // 月份
    'd+': dates.getDate(), // 日
    'h+': dates.getHours(), // 小时
    'm+': dates.getMinutes(), // 分
    's+': dates.getSeconds(), // 秒
    'q+': Math.floor((dates.getMonth() + 3) / 3), // 季度
    'S': dates.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 目标日期往前 N 天 , 支持格式转换
export function ExDays (targetDay, days, fmt) {
  let today = new Date(targetDay)
  let exDay = new Date((today / 1000 - 86400 * days) * 1000)
  if (fmt) {
    exDay = formatDate(exDay, fmt)
  }
  return exDay
}

// 将对象元素转换成字符串以作比较
function obj2key (obj, keys) {
  let n = keys.length
  let key = []
  while (n--) {
    key.push(obj[keys[n]])
  }
  return key.join('|')
}

// 对象去重
export function uniqeByKeys (array, keys) {
  let arr = []
  let hash = {}
  for (let i = 0, j = array.length; i < j; i++) {
    let k = obj2key(array[i], keys)
    if (!(k in hash)) {
      hash[k] = true
      arr.push(array[i])
    }
  }
  return arr
}

/**
 * 数组排序
 * @param  source 待排序数组
 * @param  orders 排序字段数组
 * @param  type  升序-asc 倒序-desc
 * 调用：var res = arraySortByName(arr, ['OpenTime'], 'desc').results;
 */
export function arraySortByName (source, orders, type) {
  if (source instanceof Array && orders instanceof Array && orders.length > 0) {
    let ordersc = orders.concat([])
    let sorttype = type || 'asc'
    let results = []
    let totalSum = {}

    // 此处使用的是引用类型，改名不易读
    // check_flag_begin
    const grouporder = (source, orders, totalSum) => {
      source.sort(function (a, b) {
        let convertA = a[orders[0]]
        let convertB = b[orders[0]]
        if (typeof convertA === 'string' && typeof convertB === 'string') {
          if (sorttype.toUpperCase() === 'ASC') {
            return convertA.localeCompare(convertB)
          }
          return convertB.localeCompare(convertA)
        }
        if (sorttype.toUpperCase() === 'ASC') {
          return convertA - convertB
        }
        return convertB - convertA
      })

      let groupmap = new Map()

      source.forEach((item) => {
        if (groupmap.has(item[orders[0]])) {
          groupmap.get(item[orders[0]]).push(item)
        } else {
          groupmap.set(item[orders[0]], [])
          groupmap.get(item[orders[0]]).push(item)
        }
      })

      orders.shift()

      for (let [key, val] of groupmap) {
        totalSum[key] = {}
        totalSum[key].name = key
        totalSum[key].value = val.length
        if (orders.length === 0) {
          results = results.concat(val)
        } else {
          totalSum[key].children = {}
          let orderscopy = orders.concat([])
          grouporder(val, orderscopy, totalSum[key].children)
        }
      }
    }
    // check_flag_end

    grouporder(source, ordersc, totalSum)

    return {
      results,
      totalSum
    }
  }
  return source
}
