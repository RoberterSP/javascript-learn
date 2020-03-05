/* eslint-disable camelcase */

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

export function getData (data) {
  let newArr = []
  let newObj = {}
  let parentIds = []
  let levelTag = 0
  let parentTimestamp
  let parentduration
  let endTimeList = []
  data.map(item => {
    item.collapse = false
    item.toShow = true
    endTimeList.push(item.timestamp + item.duration)
    if (item.parent_id === '-') {
      // 父节点开始时间
      parentTimestamp = item.timestamp
    }
  })
  // 父节点的耗时
  parentduration = endTimeList[endTimeList.indexOf(Math.max.apply(Math, endTimeList))] - parentTimestamp
  data.map(item => {
    // 过滤client
    if (item.kind === 'SERVER') {
      if (item.parent_id === '-') {
        item.level = levelTag
        // 耗时
        item.delayPercent = Math.abs((((item.timestamp - parentTimestamp) / parentduration) * 100))
        // 耗时占比
        item.durationPercent = (item.duration / parentduration * 100).toFixed(2) < 1 ? 1 : (item.duration / parentduration * 100).toFixed(2)
        // 判断使用单位
        if (item.duration > 1000) {
          item.showDuration = (item.duration / 1000).toFixed(3) + 'ms'
        } else {
          item.showDuration = item.duration + 'μs'
        }
        levelTag += 1
        parentIds.push(item.id)
        newArr.push(item)
      } else {
        // key
        let arr = []
        if (newObj[item.parent_id]) {
          arr = newObj[item.parent_id]
        }
        arr.push(item)
        newObj[item.parent_id] = arr
      }
      // 子节点
      // if (item.parent_id !== '-') {
      //     // key
      //     let arr = []
      //     if (newObj[item.parent_id]) {
      //         arr = newObj[item.parent_id]
      //     }
      //     arr.push(item)
      //     newObj[item.parent_id] = arr
      // }
    }
  })
  let secondArr = []
  // key
  sortList(newArr, secondArr, newObj)

  // 顶部时间线 start
  let timeArr = []
  for (let i = 0; i < 5; i++) {
    if (i > 0) {
      timeArr.push((parentduration / 5000000 * i).toFixed(3) + 's')
    }
  }
  timeArr.push((parentduration / 1000000).toFixed(3) + 's')
  // 顶部时间线 end
  let safeBreak = 0
  while (safeBreak < data.length) {
    let hasPush = false
    let nextIds = []
    parentIds.map(parent_id => {
      data.map(item => {
        if (item.parent_id === parent_id && item.kind === 'SERVER') {
          item.level = levelTag
          item.delayPercent = Math.abs((((item.timestamp - parentTimestamp) / parentduration) * 100))
          item.durationPercent = (item.duration / parentduration * 100).toFixed(2) < 0.1 ? 0.1 : (item.duration / parentduration * 100).toFixed(2)
          if (item.duration > 1000) {
            item.showDuration = (item.duration / 1000).toFixed(3) + 'ms'
          } else {
            item.showDuration = item.duration + 'μs'
          }
          hasPush = true
          nextIds.push(item.id)
        }
      })
    })
    if (hasPush) {
      levelTag += 1
      parentIds = nextIds
    } else {
      parentIds = []
    }
    safeBreak += 1
  }
  let servicesList = getServicesList(secondArr)
  return {
    arr: secondArr,
    maxlevel: levelTag - 1,
    timeArr: timeArr,
    obj: newObj,
    servicesList: servicesList,
    wholeList: data
  }
}

function sortList (newArr, secondArr, newObj) {
  newArr.map(item => {
    secondArr.push(item)
    if (newObj[item.id]) {
      sortList(newObj[item.id], secondArr, newObj)
    }
  })
}
function getServicesList (list) {
  let arr = []
  let nameList = []
  list.map(item => {
    if (!(nameList.indexOf(item.name) > -1)) {
      item.usedTimes = 1
      arr.push(item)
      nameList.push(item.name)
    } else {
      arr.map(newItem => {
        if (newItem.name === item.name) {
          newItem.usedTimes += 1
        }
      })
    }
  })
  return arr
}

export function getDialogData (data, item) {
  let secondTable = [{
    key: 'traceId',
    value: item.traceId
  },
  {
    key: 'spanId',
    value: item.id
  },
  {
    key: 'parent_id',
    value: item.parent_id
  }
  ]
  let startTimestamp
  let _data = []
  data.map(span => {
    if (item.parent_id === span.parent_id) {
      _data.push(span)
    }
  })

  _data.map(span => {
    if (span.kind === 'CLIENT') {
      startTimestamp = span.timestamp
    }
  })
  let firstTable = []
  _data.map(span => {
    // if (span.id === item.id) {
    if (span.kind === 'SERVER') {
      let obj1 = {
        Address: span.localEndpoint.ipv4 + ':' + span.localEndpoint.port,
        Date: DateFormat(new Date(Math.floor((span.timestamp - span.duration) / 1000)), 'yyyy/MM/dd/ hh:mm:ss')
      }
      let obj2 = {
        Address: span.localEndpoint.ipv4 + ':' + span.localEndpoint.port,
        Date: DateFormat(new Date(Math.floor(span.timestamp / 1000)), 'yyyy/MM/dd/ hh:mm:ss')
      }
      obj1.Annotation = 'Server Send'
      obj2.Annotation = 'Server Receive'
      obj1.Relative = (span.timestamp - span.duration - startTimestamp)
      if (Math.abs(obj1.Relative) > 1000) {
        obj1.Relative = Math.abs((obj1.Relative / 1000).toFixed(3)) + 'ms'
      } else {
        obj1.Relative = Math.abs(obj1.Relative) + 'μs'
      }
      obj2.Relative = (span.timestamp - startTimestamp)
      if (Math.abs(obj2.Relative) > 1000) {
        obj2.Relative = Math.abs((obj2.Relative / 1000).toFixed(3)) + 'ms'
      } else {
        obj2.Relative = Math.abs(obj2.Relative) + 'μs'
      }
    } else {
      // eslint-disable-next-line no-redeclare
      var obj1 = {
        Address: span.localEndpoint.ipv4 + ':' + span.localEndpoint.port,
        Date: DateFormat(new Date(Math.floor((span.timestamp - span.duration) / 1000)), 'yyyy/MM/dd/ hh:mm:ss')
      }
      // eslint-disable-next-line no-redeclare
      var obj2 = {
        Address: span.localEndpoint.ipv4 + ':' + span.localEndpoint.port,
        Date: DateFormat(new Date(Math.floor(span.timestamp / 1000)), 'yyyy/MM/dd/ hh:mm:ss')
      }
      obj1.Annotation = 'Client Send'
      obj2.Annotation = 'Client Receive'
      obj1.Relative = 0
      obj2.Relative = span.duration
      if (obj1.Relative > 1000) {
        obj1.Relative = (obj1.Relative / 1000).toFixed(3) + 'ms'
      } else {
        obj1.Relative = obj1.Relative + 'μs'
      }
      if (obj2.Relative > 1000) {
        obj2.Relative = (obj2.Relative / 1000).toFixed(3) + 'ms'
      } else {
        obj2.Relative = obj2.Relative + 'μs'
      }
    }
    firstTable.push(obj1)
    firstTable.push(obj2)
    // }
  })
  // 返回
  firstTable.sort(function (a, b) {
    var order = ['Client Send', 'Server Receive', 'Server Send', 'Client Receive']
    return order.indexOf(a.Annotation) - order.indexOf(b.Annotation)
  })
  return {
    secondTable: secondTable,
    firstTable: firstTable
  }
}

function DateFormat (date, fmt) {
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
// 接口追踪
export function trackList (arr, filterArr, list) {
  list = []
  if (arr && arr.length > 0) {
    arr.map((items) => {
      let item = getData(items)
      console.log('item', item)
      let obj = {}
      obj.timeArr = item.timeArr
      obj.spans = item.arr.length
      if (filterArr && filterArr.length > 0) {
        let flag = true
        filterArr.map((val) => {
          item.servicesList.map((service) => {
            let _cur = item.servicesList.find((_val) => {
              return _val.localEndpoint.serviceName === val
            })
            if (!_cur) {
              flag = false
              return false
            }
          })
        })
        if (flag) {
          obj.servicesList = item.servicesList
          obj.currentObj = item.wholeList
          let _obj = {}
          items.map((data) => {
            if (data.parent_id === '-') {
              obj.rootNote = data.localEndpoint.serviceName
              obj.time = DateFormat(new Date(parseInt(data.timestamp / 1000)), 'yyyy-MM-dd hh:mm:ss')
              if (data.kind === 'SERVER') {
                _obj = data
              }
            }
          })
          if (_obj) {
            let _percentTotal = 0
            obj.servicesList.map((_val) => {
              _percentTotal = _percentTotal + _val.duration * _val.usedTimes
            })
            let _time = parseInt(_obj.duration * _obj.usedTimes / 1000)
            obj.percent = parseInt((_time / (_percentTotal / 1000)) * 100) + '%'
            list.push(obj)
          }
        }
      } else {
        obj.servicesList = item.servicesList
        obj.currentObj = item.wholeList
        let _obj = {}
        items.map((data) => {
          if (data.parent_id === '-') {
            obj.rootNote = data.localEndpoint.serviceName
            obj.time = DateFormat(new Date(parseInt(data.timestamp / 1000)), 'yyyy-MM-dd hh:mm:ss')
            if (data.kind === 'SERVER') {
              _obj = data
            }
          }
        })
        if (_obj) {
          let _percentTotal = 0
          obj.servicesList.map((_val) => {
            _percentTotal = _percentTotal + _val.duration * _val.usedTimes
          })
          let _time = parseInt(_obj.duration * _obj.usedTimes / 1000)
          obj.percent = parseInt((_time / (_percentTotal / 1000)) * 100) + '%'
          list.push(obj)
        }
      }
    })
  }
  return list
}

// 以下新写的函数
// 调用跟踪list 改装
export function trackHandleList (arr) {
  let list = []
  let that = this
  arr.forEach(element => {
    let endTimeList = []
    let servicesList = []
    let firstDuration = ''
    let parentIds = []
    let firstCLIENTLeval = element.findIndex(item => item && (!item.parent_id || item.parent_id === '-') && item.kind === 'CLIENT')
    let firstSERVERLeval = element.findIndex(item => item && (!item.parent_id || item.parent_id === '-') && item.kind === 'SERVER')
    element.forEach((data) => {
      endTimeList.push(data.timestamp + data.duration)
    })
    if (firstCLIENTLeval < 0 && firstSERVERLeval < 0) {
      // 说明第一跳 未返回
      element.forEach((data, index) => {
        let parentId = data.parent_id
        let bol = true
        element.forEach(item => {
          if (item.id === parentId) {
            bol = false
          }
        })
        // bol 为true,说明找到了特殊的第一跳
        if (bol) {
          data.level = 0
          data.parent_id = '-'
        }
        try {
          that.$forceUpdate()
        } catch (err) {}
      })
      try {
        firstCLIENTLeval = element.findIndex(row => row && row.parent_id === '-' && row.kind === 'CLIENT')
        firstSERVERLeval = element.findIndex(row => row && row.parent_id === '-' && row.kind === 'SERVER')
      } catch (err) {}
    }
    try {
      let firstTime
      if (firstCLIENTLeval > -1) {
        firstDuration = element[firstCLIENTLeval].duration
        firstTime = element[firstCLIENTLeval].timestamp
        element[firstCLIENTLeval].level = 0
      } else if (firstSERVERLeval > -1) {
        firstDuration = element[firstSERVERLeval].duration
        firstTime = element[firstCLIENTLeval].timestamp
      }
      if (firstSERVERLeval > -1) {
        element[firstSERVERLeval].level = 0
      }
      element.forEach(data => {
        if (data.parent_id && data.parent_id !== '-' && parentIds.indexOf(data.parent_id) < 0) {
          parentIds.push(data.parent_id)
        }
        data.time = DateFormat(new Date(parseInt(data.timestamp / 1000)), 'yyyy-MM-dd hh:mm:ss')
        let serviceName = data.localEndpoint.serviceName
        let servicesIndex = servicesList.findIndex(item => item.localEndpoint && item.localEndpoint.serviceName === serviceName)
        if (servicesIndex > -1) {
          servicesList[servicesIndex].usedTimes++
          servicesList[servicesIndex].duration = data.duration + servicesList[servicesIndex].duration
        } else {
          servicesList.push({
            localEndpoint: data.localEndpoint,
            usedTimes: 1,
            duration: data.duration
          })
        }
      })
      let parentduration = endTimeList[endTimeList.indexOf(Math.max.apply(Math, endTimeList))] - firstTime
      // 时间数组
      let timeArr = []
      for (let i = 0; i < 5; i++) {
        if (i > 0) {
          timeArr.push((parentduration / 5000000 * i).toFixed(3) + 's')
        }
      }
      timeArr.push((parentduration / 1000000).toFixed(3) + 's')

      // element 赋值数组， 当前id， 等级levelTag
      let levelClass = firstSERVERLeval > -1 ? firstSERVERLeval : firstCLIENTLeval
      levelFunc(element, element[levelClass].id, 0)
      list.push({
        spansCount: element.length,
        servicesList: servicesList.reverse(),
        currentObjList: element,
        duration: firstDuration,
        wholeList: element,
        timeArr: timeArr,
        maxlevel: parentIds.length + 1
      })
    } catch (err) {}
    /// ////////////
  })
  return list
}

// element 赋值数组， 当前id， 等级levelTag
function levelFunc (arr, id, levelTag) {
  // LEVEL 逐级往上赋值
  arr.forEach(data => {
    if (data.parent_id === id) {
      data.level = levelTag + 1
      levelFunc(arr, data.id, data.level)
    }
  })
}

// 重写
export function getData3 (arr) {
  let endTimeList = []
  let parentduration
  let wholeSpansArr = []
  let parentIds = []
  let findFirstIndex = arr.findIndex(item => (item.level === 0 && item.kind === 'CLIENT'))
  findFirstIndex = findFirstIndex > -1 ? findFirstIndex : arr.findIndex(item => (item.level === 0 && item.kind === 'SERVER'))
  let globalCTObj = arr[findFirstIndex]
  arr.forEach(data => {
    endTimeList.push(data.timestamp + data.duration)
    if (wholeSpansArr.indexOf(data.id) < 0) {
      wholeSpansArr.push(data.id)
    }
    if (data.parent_id && data.parent_id !== '-' && parentIds.indexOf(data.parent_id) < 0) {
      parentIds.push(data.parent_id)
    }
  })
  // 父节点的耗时
  parentduration = endTimeList[endTimeList.indexOf(Math.max.apply(Math, endTimeList))] - globalCTObj.timestamp
  arr.sort(compareSort('level'))
  let tempArr = []
  arr.forEach(data => {
    // 耗时占比
    data.delayPercent = Math.abs(((data.timestamp - globalCTObj.timestamp) / parentduration * 100))
    // 耗时占比
    data.durationPercent = (data.duration / parentduration * 100).toFixed(2) < 1 ? 1 : (data.duration / parentduration * 100).toFixed(2)
    // 判断使用单位
    if (data.duration > 1000) {
      data.showDuration = (data.duration / 1000).toFixed(3) + 'ms'
    } else {
      data.showDuration = data.duration + 'μs'
    }
    data.toShow = true

    let findObj = arr.find(rowItem => (rowItem.id === data.id && rowItem.kind === 'SERVER'))
    if (findObj) {
    } else {
      findObj = arr.find(rowItem => rowItem.id === data.id && rowItem.kind === 'CLIENT')
    }
    let isExit = tempArr.findIndex(rowItem => rowItem.id === data.id)
    if (isExit < 0) {
      tempArr.push(findObj)
    }
  })

  let secondArr = [tempArr[0]]
  let testarr = tempArr
  // testarr: 完整的要展示的level平级打平的数组; secondArr: 最终组合的数组; 查找子级的父id
  IteratedArray(testarr, secondArr, secondArr[0].id)

  let obj = {
    chartData: secondArr,
    obj: parentIds
  }
  return obj
}

// 递归组合数组
function IteratedArray (testarr, secondArr, id) {
  testarr.forEach(data => {
    if (data.parent_id === id) {
      secondArr.push(data)
      IteratedArray(testarr, secondArr, data.id)
    }
  })
}

// 数组排序
function compareSort (property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

//  调用跟踪详情 行点击 table数据 改装
export function getDialogSpansData (data, item) {
  let globalCT = 0
  let globalCTObj = data.find(rowItem => ((rowItem.parent_id === '-' || !rowItem.parent_id) && rowItem.kind === 'CLIENT'))
  globalCT = globalCTObj ? globalCTObj.timestamp : (data.find(rowItem => ((rowItem.parent_id === '-' || !rowItem.parent_id) && rowItem.kind === 'SERVER'))).timestamp

  let secondTable = [{
    key: 'traceId',
    value: item.traceId
  },
  {
    key: 'spanId',
    value: item.id
  },
  {
    key: 'parentId',
    value: item.parent_id
  }
  ]
  // let startTimestamp
  let _data = []
  console.log('data!!!', data)
  data.map(span => {
    if (item.id === span.id) {
      _data.push(span)
    }
  })

  let firstTable = []
  console.log('_data@@@', _data)
  _data.map(span => {
    // if (span.id === item.id) {
    let obj1 = {}
    let obj2 = {}
    if (span.kind === 'SERVER') {
      obj1 = {
        ipv4: span.localEndpoint.ipv4,
        serviceName: span.localEndpoint.serviceName,
        tags: span.tags,
        Address: span.localEndpoint.ipv4 + '<br />' + span.localEndpoint.serviceName,
        Date: DateFormat(new Date(Math.floor((span.timestamp + span.duration) / 1000)), 'yyyy/MM/dd hh:mm:ss')
      }
      obj2 = {
        ipv4: span.localEndpoint.ipv4,
        serviceName: span.localEndpoint.serviceName,
        tags: span.tags,
        Address: span.localEndpoint.ipv4 + '<br />' + span.localEndpoint.serviceName,
        Date: DateFormat(new Date(Math.floor(span.timestamp / 1000)), 'yyyy/MM/dd hh:mm:ss')
      }
      obj1.Annotation = 'Server Send'
      obj1.sort = 3
      obj2.Annotation = 'Server Receive'
      obj2.sort = 2
      obj1.Relative = (span.timestamp + span.duration - globalCT)
      obj1.RelativeCur = (span.timestamp + span.duration - globalCT)
      if (Math.abs(obj1.Relative) > 1000) {
        obj1.Relative = Math.abs((obj1.Relative / 1000).toFixed(3)) + 'ms'
      } else {
        obj1.Relative = Math.abs(obj1.Relative) + 'μs'
      }
      obj2.Relative = (span.timestamp - globalCT)
      obj2.RelativeCur = (span.timestamp - globalCT)
      if (Math.abs(obj2.Relative) > 1000) {
        obj2.Relative = Math.abs((obj2.Relative / 1000).toFixed(3)) + 'ms'
      } else {
        obj2.Relative = Math.abs(obj2.Relative) + 'μs'
      }
    } else {
      obj1 = {
        ipv4: span.localEndpoint.ipv4,
        serviceName: span.localEndpoint.serviceName,
        tags: span.tags,
        Address: span.localEndpoint.ipv4 + '<br />' + span.localEndpoint.serviceName,
        Date: DateFormat(new Date(Math.floor((span.timestamp) / 1000)), 'yyyy/MM/dd hh:mm:ss')
      }
      obj2 = {
        ipv4: span.localEndpoint.ipv4,
        serviceName: span.localEndpoint.serviceName,
        tags: span.tags,
        Address: span.localEndpoint.ipv4 + '<br />' + span.localEndpoint.serviceName,
        Date: DateFormat(new Date(Math.floor((span.timestamp + span.duration) / 1000)), 'yyyy/MM/dd hh:mm:ss')
      }
      obj1.Annotation = 'Client Send'
      obj2.sort = 1
      obj2.Annotation = 'Client Receive'
      obj2.sort = 4
      obj1.RelativeCur = span.timestamp - globalCT
      obj1.Relative = span.timestamp - globalCT
      obj2.Relative = span.duration
      obj2.RelativeCur = span.duration
      if (obj1.Relative > 1000) {
        obj1.Relative = (obj1.Relative / 1000).toFixed(3) + 'ms'
      } else {
        obj1.Relative = obj1.Relative + 'μs'
      }
      if (obj2.Relative > 1000) {
        obj2.Relative = (obj2.Relative / 1000).toFixed(3) + 'ms'
      } else {
        obj2.Relative = obj2.Relative + 'μs'
      }
    }
    firstTable.push(obj1)
    firstTable.push(obj2)
  })

  // 返回
  firstTable.sort(function (a, b) {
    var order = ['Client Send', 'Server Receive', 'Server Send', 'Client Receive']
    return order.indexOf(a.Annotation) - order.indexOf(b.Annotation)
  })
  let startSite = 0 // 初始化的位置: 10%  坐标轴
  if (firstTable.length > 0) {
    let totalTime = firstTable[firstTable.length - 1].RelativeCur - firstTable[0].RelativeCur

    firstTable[0].left = startSite

    firstTable.forEach((item, index) => {
      if (index !== 0) {
        firstTable[index].left = Math.abs(((firstTable[index].RelativeCur) / totalTime) * 100 - startSite * 2) > 100 ? 90 : Math.abs(((firstTable[index].RelativeCur) / totalTime) * 100 - startSite * 2)
      }
    })

    // firstTable[2].left = Math.abs(((firstTable[2].RelativeCur) / totalTime) * 100 - startSite * 2) > 100 ? 90 : Math.abs(((firstTable[2].RelativeCur) / totalTime) * 100 - startSite * 2)
    // firstTable[3].left = Math.abs(((firstTable[3].RelativeCur) / totalTime) * 100 - startSite * 2) > 100 ? 90 : Math.abs(((firstTable[3].RelativeCur) / totalTime) * 100 - startSite * 2)
  }
  return {
    secondTable: secondTable,
    firstTable: firstTable
  }
}
