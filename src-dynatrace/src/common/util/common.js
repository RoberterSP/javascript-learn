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

  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

// 目标日期往前 N 天 , 支持格式转换
export function ExDays (targetDay, days, fmt) {
  var today = new Date(targetDay)
  var exDay = new Date((today / 1000 - 86400 * days) * 1000)
  if (fmt) {
    exDay = formatDate(exDay, fmt)
  }
  return exDay
}

// 将对象元素转换成字符串以作比较
function obj2key (obj, keys) {
  var n = keys.length
  var key = []
  while (n--) {
    key.push(obj[keys[n]])
  }
  return key.join('|')
}

// 对象去重
export function uniqeByKeys (array, keys) {
  var arr = []
  var hash = {}
  for (var i = 0, j = array.length; i < j; i++) {
    var k = obj2key(array[i], keys)
    if (!(k in hash)) {
      hash[k] = true
      arr.push(array[i])
    }
  }
  return arr
}

// 数组去重
export function dedupe (array) {
  return Array.from(new Set(array))
}

// 升降序
export function sortShop (list, tag, key) {
  if (tag) {
    // 升序
    list = list.sort((a, b) => {
      var _a = (a[key]) ? parseInt(a[key]) : -1
      var _b = (b[key]) ? parseInt(b[key]) : -1
      return _a - _b
    })
  } else {
    // 降序
    list = list.sort((a, b) => {
      var _a = (a[key]) ? parseInt(a[key]) : -1
      var _b = (b[key]) ? parseInt(b[key]) : -1
      return _b - _a
    })
  }
  return list
}

// 智能配补货商店列表筛选
export function dealRestockStoreList (list, storeList) {
  list.map(function (item) {
    item.adequate_rate = Math.round(item.adequate_rate * 100)
  })
  var oldarr = JSON.parse(JSON.stringify(storeList))
  oldarr.map(function (item01) {
    list.map(function (item02) {
      if (item01.shop_id === item02.shop_id) {
        item01.adequate_rate = item02.adequate_rate
        item01.join_store_id = item02.join_store_id
        item01.stage = item02.stage
        item01.toc_date = item02.toc_date
      }
    })
  })
  var arr1 = []
  var arr2 = []
  oldarr.map(function (item) {
    if (item.adequate_rate !== undefined) {
      arr1.push(item)
      if (item.adequate_rate >= 0 && item.adequate_rate <= 33) {
        item.class = 'warning'
      } else if (item.adequate_rate > 33 && item.adequate_rate <= 66) {
        item.class = 'suitable'
      } else {
        item.class = 'adequate'
      }
    } else {
      item.class = 'noCount'
      arr2.push(item)
    }
  })
  arr1 = sortShop(arr1, true)
  return [arr1, arr2]
}

// 筛选
export function arrFliter (list, val, key01, key02) {
  var arr = []
  // 删除左右两端的空格
  let valTrim = val.replace(/(^\s*)|(\s*$)/g, '')
  for (var i = 0; i < list.length; i++) {
    if (list[i][key01].toString().indexOf(valTrim) > -1) {
      arr.push(list[i])
    } else if (list[i][key02].toString().indexOf(valTrim) > -1) {
      arr.push(list[i])
    }
  }
  return arr
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

let para = (function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  // eslint-disable-next-line camelcase
  var query_string = {}
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    // If first entry with this name
    if (typeof query_string[pair[0]] === 'undefined') {
      query_string[pair[0]] = decodeURIComponent(pair[1])
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === 'string') {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])]
      query_string[pair[0]] = arr
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]))
    }
  }
  // eslint-disable-next-line camelcase
  return query_string
}())
export { para }

/**
 * 数组排序
 * @param  source 待排序数组
 * @param  orders 排序字段数组
 * @param  type  升序-asc 倒序-desc
 * 调用：var res = arraySortByName(arr, ['OpenTime'], 'desc').results;
 */
export function arraySortByName (source, orders, type) {
  if (source instanceof Array && orders instanceof Array && orders.length > 0) {
    var ordersc = orders.concat([])
    var sorttype = type || 'asc'
    var results = []
    var totalSum = {}

    function grouporder (source, orders, totalSum) {
      source.sort(function (a, b) {
        var convertA = a[orders[0]]
        var convertB = b[orders[0]]
        if (typeof convertA === 'string' && typeof convertB === 'string') {
          if (sorttype.toUpperCase() === 'ASC') {
            return convertA.localeCompare(convertB)
          } else {
            return convertB.localeCompare(convertA)
          }
        } else {
          if (sorttype.toUpperCase() === 'ASC') {
            return convertA - convertB
          } else {
            return convertB - convertA
          }
        }
      })

      var groupmap = new Map()
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
          var orderscopy = orders.concat([])
          grouporder(val, orderscopy, totalSum[key].children)
        }
      }
    }

    grouporder(source, ordersc, totalSum)

    return {
      results: results,
      totalSum: totalSum
    }
  } else {
    return source
  }
}
