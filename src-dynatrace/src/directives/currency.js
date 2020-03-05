import Vue from 'vue'
import { currencyFunc } from '@/common/util/util.js'
Vue.filter('currency', function (value, currency = '', decimals = false) {
  if (!isFinite(value) || (!value && value !== 0)) return ''
  value = currency ? value + ' ' + currency : value
  return value
})

// 流量
Vue.filter('filterTraffic', function (value) {
  if (!isFinite(value) || (!value && value !== 0)) return ''
  let res = currencyFunc({type: 'flow', value: value}, '', 2)
  value = res.value + res.unit
  return value
})

// 次数
Vue.filter('filterCount', function (value) {
  if (!isFinite(value) || (!value && value !== 0)) return ''
  let res = currencyFunc({type: 'common', value: value}, '次', 2)
  value = res.value + res.unit
  return value
})
