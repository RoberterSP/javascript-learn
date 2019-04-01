import {commonRequest, ERR_OK, INVALID_TOKEN} from './config'
// import {postFile, commonRequest, ERR_OK, ERROR_SERVICE, INVALID_TOKEN, ERR_MSG, LOG_OUT} from './config'
import axios from 'axios'
import Vue from 'vue'
import { Toast, Indicator } from 'mint-ui'
Vue.prototype.$toast = Toast
Vue.prototype.$loading = Indicator

// POST/GET/PUT/DELETE 请求
function Request (url, method, params, data, visible = true, errcb) {
  if (visible) {
    if (Vue.prototype.$bridge) {
      Vue.prototype.$bridge.callhandler('webviewLoadingShouldShow', { shouldShow: true })
    }
  }
  return new Promise(function (resolve, reject) {
    axios(commonRequest(url, method, params, data)).then((res) => {
      if (Vue.prototype.$bridge) {
        Vue.prototype.$bridge.callhandler('webviewLoadingShouldShow', { shouldShow: false })
      }
      if (res.data.code === ERR_OK) {
        resolve(res.data)
      } else if (res.data.code === INVALID_TOKEN) {
        if (Vue.prototype.$bridge) {
          Vue.prototype.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent(res.data.message), title: encodeURIComponent('提示') })
        }
      } else if (errcb) {
        resolve(res.data)
      } else {
        if (Vue.prototype.$bridge) {
          Vue.prototype.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent(res.data.message), title: encodeURIComponent('提示') })
        }
      }
    }).catch(err => {
      Vue.prototype.$toast(err)
      if (Vue.prototype.$bridge) {
        Vue.prototype.$bridge.callhandler('webviewLoadingShouldShow', { shouldShow: false })
        Vue.prototype.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('请求超时，请稍后再试~'), title: encodeURIComponent('提示') })
      }
      reject(err)
    })
  })
}

// 接口

/**
 * 获取全局配置信息
 */
export function GLOBAL_GET () {
  return Request('/api/v6/stock/toc/config/global/get', 'post', undefined, undefined)
}

/**
 * 查询订单列表
 * @param data
 * @constructor
 */
export const ORDER_LIST_GET = (data) => Request('/api/v6/shop/order/list/get', 'post', undefined, data)

/**
 * 查询订单明细
 * @param data
 * @constructor
 */
export const ORDER_DETAIL_GET = (data) => Request('/api/v6/shop/order/detail/get', 'post', undefined, data)

/**
 * 补货订单列表
 * @param data
 * @constructor
 */
export const RELOAD_LIST_GET = (data) => Request('/api/v6/shop/reload/list/get', 'post', undefined, data)

/**
 * 补货订单详情
 * @param data
 * @constructor
 */
export const RELOAD_DETAIL_GET = (data) => Request('/api/v6/shop/reload/detail/get', 'post', undefined, data)

/**
 * 补货单 拒绝
 * @param data
 * @constructor
 */
export const RELOAD_REJECT_POST = (data) => Request('/api/v6/shop/reload/reject/post', 'post', undefined, data)

/**
 * 补货单 审批
 * @param data
 * @constructor
 */
export const RELOAD_APPROVE_POST = (data) => Request('/api/v6/shop/reload/approve/post', 'post', undefined, data)

/**
 * 获取云仓发货单拒绝原因
 * @param data
 * @constructor
 */
export const CLOUD_REJECT_REASON_GET = (data) => Request('/api/v6/shop/doc/reason/list/get', 'post', undefined, data)

// 查看明细
/**
 * 负库存控制查询商品库存
 * @param data
 * @constructor
 */
export const NEGATIVE_STOCK_CONTROL_GET = (data) => Request('/api/v6/shop/negative/stock/control/get', 'post', null, data)
export const NEGATIVE_STOCK_CONTROL_GET_NOLOADING = (data) => Request('/api/v6/shop/negative/stock/control/get', 'post', null, data, false)

/**
 * 创建，修改 补货单
 * @param data
 * @constructor
 */
export const RELOAD_UPDATE_POST = (data) => Request('/api/v6/shop/reload/update/post', 'post', null, data)
export const RELOAD_CANCEL_GET = (data) => Request('/api/v6/shop/reload/cancel/post', 'post', null, data)
export const RELOAD_SUBMIT_GET = (data) => Request('/api/v6/shop/reload/submit/post', 'post', null, data)

/**
 * 商品可用计量单位
 * @param data
 * @constructor
 */
export const PRODUCT_UOM_GET = (data) => Request('/api/v6/shop/product/uom/get', 'post', null, data)

/**
 * 获取商品详情
 * @param data
 * @constructor
 */
export const PRODUCT_DETAIL_GET = (data) => Request('/api/v6/shop/open_api/product/detail/get', 'post', null, data)

/**
 * 获取商品(SKU)规格
 * @param data
 * @constructor
 */
export const PRODUCT_VARIANTINFO_GET = (data) => Request('/api/v6/data/product/variant/info/get', 'post', null, data)

/**
 * 获取商品列表
 * @param data
 * @constructor
 */
export const PRODUCT_LIST_GET = (data) => Request('/api/v6/shop/open_api/product/list/get', 'post', null, data)

/**
 * 商品类别列表
 * @param data
 * @constructor
 */
export const PRODUCT_CATEGORY_GET = (data) => Request('/api/v6/shop/open_api/product/category/get', 'post', null, data)

/**
 * 门店调拨可选门店
 * @param data
 * @constructor
 */
export const ORG_NEIGHBOR_GET = (data) => Request('/api/v6/shop/org/neighbor/get', 'post', null, data)

/**
 * 可选仓库列表
 * @param data
 * @constructor
 */
export const WAREHOUSE_LIST_GET = (data) => Request('/api/v6/shop/warehouse/list/get', 'post', null, data)

/**
 * 补货订单详情
 * @param data
 * @constructor
 */
export const RELOAD_DETAIL_GET_NOLOADING = (data) => Request('/api/v6/shop/reload/detail/get', 'post', null, data, false)
