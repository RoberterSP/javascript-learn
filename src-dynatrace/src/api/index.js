/* eslint-disable */
import {commonRequest, ERR_OK} from './config'
// import {postFile, commonRequest, ERR_OK, ERROR_SERVICE, INVALID_TOKEN, ERR_MSG, LOG_OUT} from './config'
import axios from 'axios'
import Vue from 'vue'
import bus from '@/assets/eventBus.js'

// POST/GET/PUT/DELETE 请求
function Request(url, method, params, data, visible = true, errcb = false) {
  if (visible) {
    Vue.prototype.$loading()
  }

  return new Promise(function (resolve, reject) {
    if (!(url.includes('login') || url.includes('logout'))) {
      if (data === undefined) {
        data = {}
      }
      data.namespace_code = window.localStorage.getItem('namespace_code') // 全局接口添加该参数
    }
    axios(commonRequest(url, method, params, data)).then((res) => {
      if (visible) Vue.prototype.$loading.close()
      if (res.data.code === ERR_OK) {
        resolve(res.data)
      } else if (res.data.code === 100003) {
        Vue.prototype.$loading.close()
        // Vue.prototype.$alert(res.data.message, '提示', {
        //   confirmButtonText: '确定',
        //   callback: action => {
        //     // Cookies.remove('NXDF_TOKEN')
        //     let url = window.location.protocol + '//' + window.location.host
        //     window.location = url
        //   }
        // })

        window.location = window.location.protocol + '//' + window.location.host
        bus.$emit('openMessage', {
          message: res.data.message,
          type: 'warning',
          duration: 1500
        })
      } else if (errcb) {
        // 对于错误信息，都展示在message 中
        bus.$emit('openMessage', {
          message: res.data.message,
          type: 'warning',
          duration: 0,
          showClose: true
        })

        resolve(res.data)

      } else {
        // Vue.prototype.$alert(res.data.message, '提示', {
        //     confirmButtonText: '确定'
        // })
        bus.$emit('openMessage', {
          message: res.data.message,
          type: 'warning',
          duration: 0,
          showClose: true
        })
      }
    }).catch(err => {
      Vue.prototype.$loading.close()
      if (err && err.data) {
        // Vue.prototype.$message.error(err.data.message)
        bus.$emit('openMessage', {
          message: err.data.message,
          type: 'error'
        })
      }
      reject(err)
    })
  })
}
// 接口

/**
 * 登录
 */
export function LOGIN_POST(data) {
  return Request('/api/v6/data/login/post', 'post', undefined, data, true, true)
}

/**
 * 获取权限数据
 */
export function AUTH_RESOURCE_GET(data) {
  return Request('/api/v6/data/auth/resource/get', 'post', undefined, data, false, false)
}

/**
 * 获取权限数据
 */
export function AUTH_NAMESPACE_GET(data) {
  return Request('/api/v6/data/auth/namespace/get', 'post', undefined, data, true)
}
/**
 * 获取首页指标数据
 */
export function NXMC_METRICS_HOME_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/home/get', 'post', undefined, data, false)
}
/**
 * 获取首页服务指标数据
 */
export function NXMC_METRICS_MESH_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/mesh/get', 'post', undefined, data, false, true)
}

// 获取首页 健康指数 指标数据
export function NXMC_METRICS_HEALTH_INDEX_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/health_index/get', 'post', undefined, data, false, true)
}
// 获取首页 访问请求 指标数据
export function NXMC_METRICS_REQUEST_INDEX_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/request_index/get', 'post', undefined, data, false, true)
}
// 获取首页 平均响应时间 指标数据
export function NXMC_METRICS_AVG_RES_TIME_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/avg_res_time/get', 'post', undefined, data, false,true)
}
// 获取首页 错误率 指标数据
export function NXMC_METRICS_REQ_ERROR_RATE_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/req_error_rate/get', 'post', undefined, data, false,true)
}
// 获取首页 吞吐量 指标数据
export function NXMC_METRICS_THROUGHPUT_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/throughput/get', 'post', undefined, data, false,true)
}
// 获取首页 应用排名 指标数据
export function NXMC_METRICS_APPS_RANK_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/apps_rank/get', 'post', undefined, data, false, true)
}
// 获取首页 服务热力图 指标数据
export function NXMC_METRICS_SERVICES_HEAT_MAP_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/services_heat_map/get', 'post', undefined, data, false, true)
}
// 获取首页 服务排名 指标数据
export function NXMC_METRICS_SERVICES_RANK_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/services_rank/get', 'post', undefined, data, false, true)
}
// 获取首页 接口调用概览 指标数据
export function NXMC_METRICS_INTERFACES_CALL_OVERVIEW_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/interfaces_call_overview/get', 'post', undefined, data, false,true)
}
// 获取首页 接口调用量 指标数据
export function NXMC_METRICS_INTERFACES_CALL_COUNT_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_call_count/get', 'post', undefined, data, false,true)
}
// 获取首页 接口错误率 指标数据
export function NXMC_METRICS_INTERFACES_ERROR_RATE_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/interfaces_error_rate/get', 'post', undefined, data, false,true)
}
// 获取首页 接口慢调用 指标数据
export function NXMC_METRICS_INTERFACES_SLOW_CALL_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/interfaces_slow_call/get', 'post', undefined, data, false, true)
}

// 获取服务用户列表
export function NXDF_SERVICE_USER_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/service_user/list/get', 'post', undefined, data, true)
}

// 应用列表
export function APP_LIST_GET(data) {
  return Request('/api/v6/data/app/list/get', 'post', undefined, data, true)
}

// 获取健康指数配置
export function NXDF_SETTING_HEALTH_INDEX_INFO_GET(data) {
  return Request('/api/v6/data/nxmc/setting/health_index/info/get', 'post', undefined, data, true)
}

// 获取健康指数配置
export function NXDF_SETTING_HEALTH_INDEX_UPDATE_GET(data) {
  return Request('/api/v6/data/nxmc/setting/health_index/update/post', 'post', undefined, data, true)
}

// 应用分类列表
export function APP_CATEGORY_LIST_GET(data) {
  return Request('/api/v6/data/app/category_list/get', 'post', undefined, data, true)
}

// 应用详情
export function APP_INFO_GET(data) {
  return Request('/api/v6/data/app/info/get', 'post', undefined, data, true)
}

// 删除应用
export function APP_DEL(data) {
  return Request('/api/v6/data/app/delete/post', 'post', undefined, data, true)
}

// 应用监控详情
export function APP_MONITOR_INFO_GET(data) {
  return Request('/api/v6/data/app/monitor/info/get', 'post', undefined, data, true)
}
// 应用监控-应用健康指数
export function APP_HEALTH_INDEX_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_health_index/get', 'post', undefined, data, true)
}
// 应用监控-应用平均响应时间
export function APP_AVG_RES_TIME_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_avg_res_time/get', 'post', undefined, data, true)
}
// 应用监控-应用失败率
export function APP_REQ_ERROR_RATE_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_req_error_rate/get', 'post', undefined, data, true)
}
// 应用监控-应用吞吐量
export function APP_THROUGHPUT_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_throughput/get', 'post', undefined, data, true)
}
// 应用监控-接口调用量
export function APP_INTERFACES_CALL_COUNT_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_interfaces_call_count/get', 'post', undefined, data, true)
}
// 应用监控-接口错误率
export function APP_INTERFACES_ERROR_RATE_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_interfaces_error_rate/get', 'post', undefined, data, true)
}
// 应用监控-接口慢调用
export function APP_INTERFACES_SLOW_CALL_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/app_interfaces_slow_call/get', 'post', undefined, data, true)
}
// 接口列表信息获取
export function API_LIST_GET(data) {
  return Request('/api/v6/data/api/list/get', 'post', undefined, data, true)
}
// 更新网关接口信息
export function API_UPDATE_POST(data) {
  return Request('/api/v6/data/api/update/post', 'post', undefined, data, true)
}
// 接口向网关发布
export function POST_MESH_ENDPOINT_DEPLOY(data) {
  return Request('/api/v6/data/api/deploy/post', 'POST', undefined, data, true)
}
// 取消接口向网关发布
export function POST_MESH_ENDPOINT_UNDEPLOY(data) {
  return Request('/api/v6/data/api/undeploy/post', 'POST', undefined, data, true)
}
// 更新API缓存
export function API_CACHE_UPDATE(data) {
  return Request('/api/v6/data/api/cache/update/post', 'POST', undefined, data, true)
}

// 获取网关接口路由规则列表
export function API_ROUTE_RULE_LIST_GET(data) {
  return Request('/api/v6/data/api/route_rule/list/get', 'post', undefined, data)
}

// 上传网关接口路由规则
export function UPLOAD_API_ROUTE_RULE(data) {
  return Request('/api/v6/data/api/route_rule/upload/post', 'post', undefined, data)
}

// 更新网关接口路由规则
export function UPDATE_API_ROUTE_RULE(data) {
  return Request('/api/v6/data/api/route_rule/update/post', 'post', undefined, data)
}

// 更新网关接口路由规则状态
export function UPDATE_API_ROUTE_RULE_STATUS(data) {
  return Request('/api/v6/data/api/route_rule/status/update/post', 'post', undefined, data)
}

// 删除网关接口路由规则
export function DELETE_API_ROUTE_RULE(data) {
  return Request('/api/v6/data/api/route_rule/delete/post', 'post', undefined, data)
}

// 接口向网关注册
export function API_REGISTER(data) {
  return Request('/api/v6/data/api/register/post', 'post', undefined, data)
}

// 取消接口向网关注册
export function API_UNREGISTER(data) {
  return Request('/api/v6/data/api/unregister/post', 'post', undefined, data)
}

// 查询订阅记录
export function SUBSCRIBE_RECORD_GET(data) {
  return Request('/api/v6/data/nxmc/subscribe_record/get', 'post', undefined, data, true)
}

// 删除订阅记录
export function SUBSCRIBE_RECORD_DELETE(data) {
  return Request('/api/v6/data/nxmc/subscribe_record_delete/post', 'post', undefined, data, true)
}

// 修改订阅记录
export function SUBSCRIBE_RECORD_EDIT(data) {
  return Request('/api/v6/data/nxmc/subscribe_record_edit/post', 'post', undefined, data, true)
}

// 修改订阅记录状态
export function SUBSCRIBE_RECORD_EDIT_STATUS(data) {
  return Request('/api/v6/data/nxmc/subscribe_record_status_edit/post', 'post', undefined, data, true)
}

// 事件订阅列表
export function SUBSCRIBE_EVENT_GET(data) {
  return Request('/api/v6/data/nxmc/subscribe_event/get', 'post', undefined, data, true)
}

//获取接口监控指标
export function NXMC_INTERFACE_METRICS_GET(data) {
  return Request('/api/v6/data/nxmc/interface/metrics/get', 'post', undefined, data, true)
}

// 获取应用指标数据
export function NXMC_METRICS_APP_GET(data) {
  return Request('/api/v6/data/app/api/get', 'POST', undefined, data, true)
}

// 获取接口指标数据
export function NXMC_METRICS_INTERFACE_GET(data) {
  return Request('/api/v6/data/api/app/get', 'POST', undefined, data, true)
}

// 获取应用接口过滤规则 -- list
export function APIRULE_LIST_GET(data) {
  return Request('/api/v6/data/app/api_rule/list/get', 'POST', undefined, data, true)
}

// 获取应用下的Scope信息 -- list
export function APP_SCOPE_LIST_GET(data) {
  return Request('/api/v6/data/app/scope/get', 'POST', undefined, data, true)
}

// 获取接口组信息 -- list
export function SCOPE_LIST_GET(data) {
  return Request('/api/v6/data/scope/list/get', 'POST', undefined, data, true)
}
// 应用创建
export function APP_CREATE_POST(data) {
  return Request('/api/v6/data/app/create/post', 'post', undefined, data, true)
}
// 应用修改
export function APP_UPDATE_POST(data) {
  return Request('/api/v6/data/app/update/post', 'post', undefined, data, true)
}
// 重置应用的app secret
export function APP_RESET_SECRET_POST(data) {
  return Request('/api/v6/data/app/reset_secret/post', 'post', undefined, data, true)
}

// 更新网关应用缓存数据
export function UPDATE_APP_CACHE(data) {
  return Request('/api/v6/data/app/cache/update/post', 'post', undefined, data, true)
}

// 接口组信息 -- update
export function SCOPE_UPDATE_POST(data) {
  return Request('/api/v6/data/scope/update/post', 'post', undefined, data, true)
}

// 接口组创建
export function SCOPE_CREATE_POST(data) {
  return Request('/api/v6/data/scope/create/post', 'post', undefined, data, true)
}

// 接口组删除
export function SCOPE_DELETE_POST(data) {
  return Request('/api/v6/data/scope/delete/post', 'POST', undefined, data, true)
}
// 区域Api获取 --更新
export function SCOPE_API_UPDATE(data) {
  return Request('/api/v6/data/scope/api/update/post', 'post', undefined, data, true)
}

// 区域Api获取
export function SCOPE_API_GET(data) {
  return Request('/api/v6/data/scope/api/get', 'post', undefined, data, true)
}
// 获取角色列表
export function ROLE_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/auth_group/list/get', 'post', undefined, data, true)
}
// 添加角色
export function ROLE_ADD_POST(data) {
  return Request('/api/v6/data/nxmc/auth_group/upload/post', 'post', undefined, data, true)
}
// 更新角色
export function ROLE_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/auth_group/update/post', 'post', undefined, data, true)
}
// 删除角色
export function ROLE_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/auth_group/delete/post', 'post', undefined, data, true)
}
// 获取角色可访问的资源数据
export function OWNER_SOURCE_LSIT_GET(data) {
  return Request('/api/v6/data/nxmc/auth_group/resource/list/get', 'post', undefined, data, true)
}
// 获取角色资源列表数据
export function AUTH_SOURCE_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/auth_resource/list/get', 'post', undefined, data, true)
}
// 设置角色权限
export function ROLE_AUTH_SOURCE_SET(data) {
  return Request('/api/v6/data/nxmc/auth_group/auth/post', 'post', undefined, data, true)
}
// 获取服务列表
export function NXMC_MESH_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/list/get', 'post', undefined, data)
}
// 区域Api获取
export function SUBSCRIBE_RECORD_CREATE(data) {
  return Request('/api/v6/data/nxmc/subscribe_record_create/post', 'post', undefined, data, true)
}

// 修改应用的Scope列表，传入的是完整Scope列表，后台需要清除当前所有，然后重新插入
export function APP_SCOPE_UPDATE_POST(data) {
  return Request('/api/v6/data/app/scope/update/post', 'post', undefined, data, true)
}
// 获取应用接口过滤规则
export function APP_RULE_UPLOAD_POST(data) {
  return Request('/api/v6/data/app/api_rule/upload/post', 'post', undefined, data, true)
}
// 更新系统用户数据
export function NXMC_AUTH_USER_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/auth_user/role/update/post', 'post', undefined, data, true)
}
// 单点登录白名单 列表
export function NXMC_SSO_WHITELIST_GET(data) {
  return Request('/api/v6/data/nxmc/sso_whitelist/list/get', 'post', undefined, data, true)
}
// 单点登录白名单 编辑
export function NXMC_SSO_WHITELIST_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/sso_whitelist/update/post', 'post', undefined, data, true)
}
// 单点登录白名单 新增
export function NXMC_SSO_WHITELIST_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/sso_whitelist/upload/post', 'post', undefined, data, true)
}
// 单点登录白名单 删除
export function NXMC_SSO_WHITELIST_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/sso_whitelist/delete/post', 'post', undefined, data, true)
}
// 删除应用接口过滤规则 删除
export function APP_API_RULE_DELETE_POST(data) {
  return Request('/api/v6/data/app/api_rule/delete/post', 'post', undefined, data, true)
}
// 删除应用接口过滤规则 更新
export function APP_API_RULE_STATUS_UPDATE_POST(data) {
  return Request('/api/v6/data/app/api_rule/status/update/post', 'post', undefined, data, true)
}

// 删除应用接口过滤规则 更新
export function APP_API_RULE_UPDATE_POST(data) {
  return Request('/api/v6/data/app/api_rule/update/post', 'post', undefined, data, true)
}
// 获取接口详情
export function API_INFO_GET(data) {
  return Request('/api/v6/data/api/info/get', 'post', undefined, data, true)
}
// 获取接口监控详情
export function API_MONITOR_INFO_GET(data) {
  return Request('/api/v6/data/api/monitor/info/get', 'post', undefined, data, true)
}
// 上传日志配置数据
export function CONFIG_LOG_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/config/log/upload/post', 'post', undefined, data, true)
}
// 上传日志配置数据
export function CONFIG_LOG_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/config/log/update/post', 'post', undefined, data, true)
}
// 上传日志配置数据 -- list
export function CONFIG_LOG_LIST_POST(data) {
  return Request('/api/v6/data/nxmc/config/log/list/get', 'post', undefined, data, true)
}
// 上传日志配置数据 -- delete
export function CONFIG_LOG_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/config/log/delete/post', 'post', undefined, data, true)
}
// 上传日志配置数据 -- 获取日志的部署组信息
export function CONFIG_LOG_DEPLOY_LIST(data) {
  return Request('/api/v6/data/nxmc/config/log/deploy/info/get', 'post', undefined, data, true)
}
// 上传日志配置数据 -- 更新状态
export function CONFIG_LOG_STATUS_UPDATE_LIST(data) {
  return Request('/api/v6/data/nxmc/config/log/status/update/post', 'post', undefined, data, true)
}

// 获取节点列表
export function MESH_NODE_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/node/list/get', 'post', undefined, data, true)
}

// 节点批量上线
export function MESH_NODE_ONLINE(data) {
  return Request('/api/v6/data/nxmc/mesh/node/online/post', 'post', undefined, data, true)
}

// 节点批量下线
export function MESH_NODE_OFFLINE(data) {
  return Request('/api/v6/data/nxmc/mesh/node/offline/post', 'post', undefined, data, true)
}

// 获取节点详情
export function MESH_NODE_INFO(data) {
  return Request('/api/v6/data/nxmc/mesh/node/info/get', 'post', undefined, data, true)
}

// 检查服务节点的Sidecar配置差异性
export function MESH_SIDECAR_CONFIG_CHECK(data) {
  return Request('/api/v6/data/nxmc/mesh/sidecar/config/check/post', 'post', undefined, data, true)
}

// 更新应用api接口过滤规则缓存数据
export function API_RULE_CACHE_UPDATE_CHECK(data) {
  return Request('/api/v6/data/app/api_rule/cache/update/post', 'post', undefined, data, true)
}

// 更新事件订阅缓存数据
export function NXMC_SUBSCRIBE_CACHE_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/subscribe_event_cache/update/post', 'post', undefined, data, true)
}

// 获取节点进程列表
export function MESH_NODE_PROCESS_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/node/process/list/get', 'post', undefined, data, true)
}

// 获取节点Sidecar配置信息
export function MESH_NODE_SIDECAR_CONFIG_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/node/sidecar/config/get', 'POST', undefined, data, true)
}

// 获取部署组列表
export function MESH_DEPLOY_GROUP_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/list/get', 'post', undefined, data, true)
}

// 获取部署组信息
export function MESH_DEPLOY_GROUP_INFO(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/info/get', 'post', undefined, data, true)
}
export function MESH_DEPLOY_GROUP_MONITOR_INFO(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/monitor/info/get', 'post', undefined, data, true)
}
// 获取部署组停止
export function MESH_DEPLOY_GROUP_STOP_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/stop/post', 'post', undefined, data, true)
}

// 获取部署组列表
export function NXMC_CONFIG_LOG_DEPLOY(data) {
  return Request('/api/v6/data/nxmc/config/log/deploy/post', 'post', undefined, data, true)
}

// 获取接口详细信息
export function GET_MESH_ENDPOINT_INFO(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint/info/get', 'post', undefined, data, true)
}

// 更新服务接口信息
export function UPDATE_MESH_ENDPOINT(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint/update/post', 'post', undefined, data, true)
}

// 获取预警策略列表
export function ALERT_RULE_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/alert_rule/list/get', 'post', undefined, data, true)
}
// 服务治理--节点标签列表
export function NXMC_SETTING_TAG_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/setting/tag/list/get', 'post', undefined, data, true)
}
// 服务治理--节点标签 新增
export function NXMC_SETTING_TAG_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/setting/tag/upload/post', 'post', undefined, data, true)
}
// 服务治理--节点标签 删除
export function NXMC_SETTING_TAG_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/setting/tag/delete/post', 'post', undefined, data, true)
}
// 服务治理--节点标签 更新
export function NXMC_SETTING_TAG_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/setting/tag/update/post', 'post', undefined, data, true)
}
// 获取配置模板列表
export function CONFIG_TEMPLATE_LIST(data) {
  return Request('/api/v6/data/nxmc/config/template/list/get', 'post', undefined, data, true)
}
// 获取系统用户列表
export function AUTH_USER_LIST(data) {
  return Request('/api/v6/data/nxmc/auth_user/list/get', 'post', undefined, data, true)
}
// 获取日志对象和字段
export function MONITORED_OBJECT_LIST(data) {
  return Request('/api/v6/data/nxmc/alert_rule/monitored_object/list/get', 'post', undefined, data, true)
}
// 获取告警通知方式
export function NOTIFICATION_TYPE_LIST(data) {
  return Request('/api/v6/data/nxmc/notification_type/list/get', 'post', undefined, data, true)
}
// 告警策略创建
export function ALERT_RULE_UPLOAD(data) {
  return Request('/api/v6/data/nxmc/alert_rule/upload/post', 'post', undefined, data, true)
}
// 获取预警规则详情
export function ALERT_RULE_INFO(data) {
  return Request('/api/v6/data/nxmc/alert_rule/info/get', 'post', undefined, data, true)
}
// 获取预警规则详情 -- 更新
export function ALERT_RULE_STATUS_UPDATE_INFO(data) {
  return Request('/api/v6/data/nxmc/alert_rule/status/update/post', 'post', undefined, data, true)
}

// 获取默认熔断规则数据
export function GET_DEFAULT_CIRCUIT_BREAKER_LIST(data) {
  return Request('/api/v6/data/nxmc/setting/default_circuit_breaker/info/get', 'post', undefined, data, true)
}

// 更新默认熔断规则数据
export function UPDATE_DEFAULT_CIRCUIT_BREAKER(data) {
  return Request('/api/v6/data/nxmc/setting/default_circuit_breaker/update/post', 'post', undefined, data, true)
}

// 获取熔断规则列表
export function GET_CIRCUIT_BREAKER_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/circuit_breaker/list/get', 'post', undefined, data, true)
}

// 上传熔断规则数据
export function UPLOAD_CIRCUIT_BREAKER(data) {
  return Request('/api/v6/data/nxmc/mesh/circuit_breaker/upload/post', 'post', undefined, data, true)
}

// 更新熔断规则数据
export function UPDATE_CIRCUIT_BREAKER(data) {
  return Request('/api/v6/data/nxmc/mesh/circuit_breaker/update/post', 'post', undefined, data, true)
}

// 删除熔断规则数据
export function DEL_CIRCUIT_BREAKER(data) {
  return Request('/api/v6/data/nxmc/mesh/circuit_breaker/delete/post', 'post', undefined, data, true)
}

// 更新熔断规则状态
export function UPDATE_CIRCUIT_BREAKER_STATUS(data) {
  return Request('/api/v6/data/nxmc/mesh/circuit_breaker/status/update/post', 'post', undefined, data, true)
}

// 上传健康规则
export function ADD_HEALTH_RULE(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint_health/upload/post', 'post', undefined, data, true)
}
// 更新健康规则
export function UPDATE_HEALTH_RULE(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint_health/update/post', 'post', undefined, data, true)
}
// 获取健康规则列表
export function GET_HEALTH_RULE_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint_health/list/get', 'post', undefined, data, true)
}
// 上传健康规则
export function DELETE_HEALTH_RULE(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint_health/delete/post', 'post', undefined, data, true)
}
// 上传健康规则
export function GET_GLOBAL_SETTING(data) {
  return Request('/api/v6/data/nxmc/setting/global_setting/get', 'post', undefined, data, true)
}

// 更新全局设置参数
export function NXDF_SETTING_GLOBAL_SETTING_UPDATE_GET(data) {
  return Request('/api/v6/data/nxmc/setting/global_setting/update/post', 'post', undefined, data, true)
}

// 获取默认健康规则
export function GET_DEFAULT_HEALTH_RULE_LIST(data) {
  return Request('/api/v6/data/nxmc/setting/default_endpoint_health/info/get', 'post', undefined, data, true)
}
// 更新默认健康规则
export function UPDATE_DEFAULT_HEALTH_RULE(data) {
  return Request('/api/v6/data/nxmc/setting/default_endpoint_health/update/post', 'post', undefined, data, true)
}
// 删除告警策略
export function ALERT_RULE_DELETE(data) {
  return Request('/api/v6/data/nxmc/alert_rule/delete/post', 'post', undefined, data, true)
}
// 告警策略更新
export function ALERT_RULE_UPDATE(data) {
  return Request('/api/v6/data/nxmc/alert_rule/update/post', 'post', undefined, data, true)
}
// 上传配置模板
export function CONFIG_TEMPLATE_UPLOAD(data) {
  return Request('/api/v6/data/nxmc/config/template/upload/post', 'post', undefined, data, true)
}
// 删除配置模板
export function CONFIG_TEMPLATE_DELETE(data) {
  return Request('/api/v6/data/nxmc/config/template/delete/post', 'post', undefined, data, true)
}
// 更新配置模板
export function CONFIG_TEMPLATE_UPDATE(data) {
  return Request('/api/v6/data/nxmc/config/template/update/post', 'post', undefined, data, true)
}
// 获取第三方服务机构列表
export function NXMC_THIRD_PARTY_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/third_party/list/get', 'post', undefined, data, true)
}
// 上传第三方服务机构数据
export function NXMC_THIRD_PARTY_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/third_party/upload/post', 'post', undefined, data, true)
}
// 更新第三方服务机构数据
export function NXMC_THIRD_PARTY_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/third_party/update/post', 'post', undefined, data, true)
}
// 删除第三方服务机构数据
export function NXMC_THIRD_PARTY_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/third_party/delete/post', 'post', undefined, data, true)
}
// 修改第三方服务机构状态数据
export function NXMC_THIRD_PARTY_STATUS_POST(data) {
  return Request('/api/v6/data/nxmc/third_party/status/update/post', 'post', undefined, data, true)
}
// 新增系统用户
export function NXMC_AUTH_USER_UPLOAD(data) {
  return Request('/api/v6/data/nxmc/auth_user/upload/post', 'POST', undefined, data, true)
}
// 修改系统用户
export function NXMC_AUTH_USER_UPDATE(data) {
  return Request('/api/v6/data/nxmc/auth_user/update/post', 'POST', undefined, data, true)
}
// 修改系统用户状态
export function NXMC_AUTH_USER_STATUS(data) {
  return Request('/api/v6/data/nxmc/auth_user/status/update/post', 'POST', undefined, data, true)
}
// 删除系统用户
export function NXMC_AUTH_USER_DELETE(data) {
  return Request('/api/v6/data/nxmc/auth_user/delete/post', 'POST', undefined, data, true)
}
// 修改系统用户密码
export function NXMC_AUTH_USERR_PASSWORD_UPDATE(data) {
  return Request('/api/v6/data/nxmc/auth_user/password/update/post', 'POST', undefined, data, true)
}
// 获取命名空间列表
export function NAME_SPACE_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/namespace/list/get', 'post', undefined, data, true)
}
// 上传命名空间数据
export function ADD_NAME_SPACE(data) {
  return Request('/api/v6/data/nxmc/namespace/upload/post', 'post', undefined, data, true)
}
// 更新命名空间数据
export function UPDATE_NAME_SPACE(data) {
  return Request('/api/v6/data/nxmc/namespace/update/post', 'post', undefined, data, true)
}
// 获取命名空间数据详情
export function GET_NAME_SPACE_INFO(data) {
  return Request('/api/v6/data/nxmc/namespace/info/get', 'post', undefined, data, true)
}
// 更新命名空间状态
export function UPDATE_NAME_SPACE_STATE(data) {
  return Request('/api/v6/data/nxmc/namespace/status/update/post', 'post', undefined, data, true)
}

// 更新命名空间缓存
export function UPDATE_NAME_SPACE_CACHE(data) {
  return Request('/api/v6/data/nxmc/namespace/cache/update/post', 'post', undefined, data, true)
}

// 上传资源菜单数据
export function NXMC_AUTH_RESOURCE_UPLOAD(data) {
  return Request('/api/v6/data/nxmc/auth_resource/upload/post', 'post', undefined, data, true)
}
// 更新资源状态数据
export function NXMC_AUTH_RESOURCE_STATUS_UPDATE(data) {
  return Request('/api/v6/data/nxmc/auth_resource/status/update/post', 'post', undefined, data, true)
}

// 更新资源菜单数据
export function NXMC_AUTH_RESOURCE_UPDATE(data) {
  return Request('/api/v6/data/nxmc/auth_resource/update/post', 'post', undefined, data, true)
}
// 删除资源菜单数据
export function NXMC_AUTH_RESOURCE_DELETE(data) {
  return Request('/api/v6/data/nxmc/auth_resource/delete/post', 'post', undefined, data, true)
}
// 删除资源菜单数据
export function NXMC_MESH_INFO_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/info/get', 'post', undefined, data, true)
}
export function NXMC_MESH_MONITOR_INFO_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/monitor/info/get', 'post', undefined, data, true)
}
// 获取程序包语言列表
export function NXMC_MESH_LANG_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/lang/get', 'post', undefined, data, true)
}
// 获取故障注入规则列表
export function NXMC_MESH_FAULT_INJECTION_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/fault_injection/list/get', 'post', undefined, data, true)
}
// 上传故障注入规则
export function NXMC_MESH_FAULT_INJECTION_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/fault_injection/upload/post', 'post', undefined, data, true)
}
// 更新故障注入规则
export function NXMC_MESH_FAULT_INJECTION_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/fault_injection/update/post', 'post', undefined, data, true)
}
// 删除故障注入规则
export function NXMC_MESH_FAULT_INJECTION_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/fault_injection/delete/post', 'post', undefined, data, true)
}
// 更新故障注入规则状态
export function NXMC_MESH_FAULT_INJECTION_STATUS_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/fault_injection/status/update/post', 'post', undefined, data, true)
}
// 获取节点标签列表
export function NODE_TAG_LIST(data) {
  return Request('/api/v6/data/nxmc/node/tag/list/get', 'POST', undefined, data, true)
}
// 获取服务接口列表
export function MESH_ENDPOINT_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint/list/get', 'POST', undefined, data, true)
}
// 获取服务路由规则列表
export function GET_MESH_ROUTE_RULE_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/route_rule/list/get', 'POST', undefined, data, true)
}
// 上传路由规则
export function POST_MESH_ROUTE_RULE_UPLOAD(data) {
  return Request('/api/v6/data/nxmc/mesh/route_rule/upload/post', 'POST', undefined, data, true)
}
// 更新路由规则
export function POST_MESH_ROUTE_RULE_UPDATE(data) {
  return Request('/api/v6/data/nxmc/mesh/route_rule/update/post', 'POST', undefined, data, true)
}
// 设置路由规则状态
export function POST_MESH_ROUTE_RULE_STATUS_UPDATE(data) {
  return Request('/api/v6/data/nxmc/mesh/route_rule/status/update/post', 'POST', undefined, data, true)
}
// 删除路由规则
export function POST_MESH_ROUTE_RULE_DELETE(data) {
  return Request('/api/v6/data/nxmc/mesh/route_rule/delete/post', 'POST', undefined, data, true)
}
// 服务列表 - 服务详情 - 服务鉴权列表
export function AUTH_RULE_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/auth_rule/list/get', 'POST', undefined, data, true)
}
// 服务列表 - 服务详情 - 服务鉴权列表-添加
export function AUTH_RULE_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/auth_rule/upload/post', 'POST', undefined, data, true)
}
// 服务列表 - 服务详情 - 服务鉴权列表-更新
export function AUTH_RULE_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/auth_rule/update/post', 'POST', undefined, data, true)
}
// 服务列表 - 服务详情 - 服务鉴权列表-更新
export function AUTH_STATUS_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/auth_rule/status/update/post', 'POST', undefined, data, true)
}
// 服务列表 - 服务详情 - 服务鉴权列表 -删除
export function AUTH_RULE_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/auth_rule/delete/post', 'POST', undefined, data, true)
}
// 服务列表 - 服务详情 - 更新服务信息
export function MESH_UPDATE(data) {
  return Request('/api/v6/data/nxmc/mesh/update/post', 'POST', undefined, data, true)
}
/*
 ** 获取计划任务列表
 */
export function CRON_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/cron/list/get', 'POST', undefined, data, true)
}
// 获取计划任务列表 --- 更新
export function CRON_LIST_STATUS_UPDATE_GET(data) {
  return Request('/api/v6/data/nxmc/cron/status/update/post', 'POST', undefined, data, true)
}

// 获取死信队列列表
export function GET_DEAD_QUEUE_LIST(data) {
  return Request('/api/v6/data/nxmc/dead_queue/list/get', 'POST', undefined, data, true)
}

// 获取死信队列详情
export function GET_DEAD_QUEUE_INFO(data) {
  return Request('/api/v6/data/nxmc/dead_queue/detail/get', 'POST', undefined, data, true)
}
// 服务列表 - 功能拓展 - 消息队列列表
export function MESSAGE_QUEUE_LIST(data) {
  return Request('/api/v6/data/nxmc/message_queue/list/get', 'POST', undefined, data, true)
}

// 服务列表 - 功能拓展 - 服务消息进程标签资源分配
export function NXMC_MESSAGE_PROCESS_TAG_RESOURCE(data) {
  return Request('/api/v6/data/nxmc/message_process_tag/resource/get', 'POST', undefined, data, true)
}
/*
 ** 获取消息进程标签列表
 */
export function MESSAGE_PROCESS_TAG_LIST(data) {
  return Request('/api/v6/data/nxmc/message_process_tag/list/get', 'POST', undefined, data, true)
}
//  消息队列- 编辑--队列列表
export function NXMC_MESSAGE_QUEUE_EDIT_POST(data) {
  return Request('/api/v6/data/nxmc/message_queue/update/post', 'POST', undefined, data, true)
}


// 死信队列修改
export function UPDATE_DEAD_QUEUE_INFO(data) {
  return Request('/api/v6/data/nxmc/dead_queue/update/post', 'POST', undefined, data, true)
}

// 死信队列删除
export function DELETE_DEAD_QUEUE_INFO(data) {
  return Request('/api/v6/data/nxmc/dead_queue/delete/post', 'POST', undefined, data, true)
}

// 死信队列重发
export function RETRY_DEAD_QUEUE_INFO(data) {
  return Request('/api/v6/data/nxmc/dead_queue/retry/post', 'POST', undefined, data, true)
}
/*
 ** 更新计划任务
 */
export function CRON_LIST_UPDATE(data) {
  return Request('/api/v6/data/nxmc/cron/update/post', 'POST', undefined, data, true)
}
/*
 ** 更新部署组信息
 */
export function DEPLOY_GROUP_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/update/post', 'POST', undefined, data, true)
}
/*
 ** 获取服务配置组列表
 */
export function CONFIG_GROUP_LIST(data) {
  return Request('/api/v6/data/nxmc/config/group/list/get', 'POST', undefined, data, true)
}
/*
 ** 更新服务配置列表
 */
export function NXMC_CONFIG_CASH_UPDATE(data) {
  return Request('/api/v6/data/nxmc/config/cache/update/post', 'POST', undefined, data, true)
}
// Sidecar配置批量检查状态获取
export function CONFIG_PATCH_STATUS_GET(data) {
  return Request('/api/v6/data/nxmc/mesh/sidecar/config/patch_check/status/get', 'POST', undefined, data, true)
}
// 创建配置组
export function CONFIG_GROUP_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/config/group/upload/post', 'POST', undefined, data, true)
}
// 更新配置组
export function CONFIG_GROUP_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/config/group/update/post', 'POST', undefined, data, true)
}

// 发布服务配置
export function DEPLOY_CONFIG_MESH(data) {
  return Request('/api/v6/data/nxmc/config/mesh/deploy/post', 'POST', undefined, data, true)
}

// 获取服务配置发布情况
export function GET_CONFIG_MESH_DEPLOY_INFO(data) {
  return Request('/api/v6/data/nxmc/config/mesh/deploy/info/get', 'POST', undefined, data, true)
}

// 服务配置回滚
export function ROLLBACK_CONFIG_MESH(data) {
  return Request('/api/v6/data/nxmc/config/mesh/rollback/post', 'POST', undefined, data, true)
}

// 获取配置历史版本信息
export function GET_CONFIG_MESH_VERSION(data) {
  return Request('/api/v6/data/nxmc/config/mesh/version/get', 'POST', undefined, data, true)
}

// 获取配置列表
export function CONFIG_MESH_LIST_POST(data) {
  return Request('/api/v6/data/nxmc/config/mesh/list/get', 'POST', undefined, data, true)
}
// Sidecar配置检查历史
export function CONFIG_CHECK_LIST_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/sidecar/config/check_history/list/get', 'POST', undefined, data, true)
}
// Sidecar配置检查历史记录删除
export function CONFIG_CHECK_DELETE_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/sidecar/config/check_history/delete/post', 'POST', undefined, data, true)
}
// Sidecar配置批量检查触发
export function CONFIG_PATCH_CHECK_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/sidecar/config/patch_check/post', 'POST', undefined, data, true)
}
// 设置节点标签数据
export function NODE_TAG_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/node/tag/post', 'POST', undefined, data, true)
}
// 获取部署组相关路由规则
export function DEPLOY_ROUTE_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/route_rule/list/get', 'POST', undefined, data, true)
}
// 获取部署组下相关服务配置信息
export function DEPLOY_MESH_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/mesh_config/list/get', 'POST', undefined, data, true)
}
// 获取部署组下相关日志配置信息
export function DEPLOY_LOG_LIST(data) {
  return Request('/api/v6/data/nxmc/mesh/deploy_group/log_config/list/get', 'POST', undefined, data, true)
}
// 上传服务配置数据
export function CONFIG_PATCH_UPLOAD_POST(data) {
  return Request('/api/v6/data/nxmc/config/mesh/upload/post', 'POST', undefined, data, true)
}
// 更新服务配置数据
export function CONFIG_PATCH_UPDATE_POST(data) {
  return Request('/api/v6/data/nxmc/config/mesh/update/post', 'POST', undefined, data, true)
}
// 删除服务配置数据
export function NXMC_CONFIG_MESH_DELETE(data) {
  return Request('/api/v6/data/nxmc/config/mesh/delete/post', 'POST', undefined, data, true)
}
// 模拟请求服务接口
export function ENDPOINT_MOCK_POST(data) {
  return Request('/api/v6/data/nxmc/mesh/endpoint/mock/post', 'POST', undefined, data, true)
}
// AGENT列表
export function AGENT_TEMPLATE_LIST(data) {
  return Request('/api/v6/data/nxmc/cds_agent/template/list/get', 'POST', undefined, data, true)
}
// SIDECAR配置信息
export function UTIL_ENVOY_CONFIG_INFO(data) {
  return Request('/api/v6/data/nxmc/util/envoy_config/info/get', 'POST', undefined, data, true)
}
//获取跟踪方法列表
export function TRACE_OVERVIEW_GET(data) {
  return Request('/api/v6/data/nxmc/trace/overview/get', 'post', undefined, data, true)
}
//查询调用链列表
export function TRACE_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/trace/list/get', 'post', undefined, data, true)
}

// 查询调用跟踪详情
export function TRACE_DETAIL_GET(data) {
  return Request('/api/v6/data/nxmc/trace/info/get', 'post', undefined, data, true)
}

// 接口健康指数
export function INTERFACE_HEALTH_INDEX(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_health_index/get', 'post', undefined, data, true)
}
// 接口平均响应时间
export function INTERFACE_AVG_RES_TIME(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_avg_res_time/get', 'post', undefined, data, true)
}
// 接口失败率
export function INTERFACE_REQ_ERROR_RATE(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_req_error_rate/get', 'post', undefined, data, true)
}
// 接口吞吐量
export function INTERFACE_THROUGHPUT(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_throughput/get', 'post', undefined, data, true)
}
// 接口应用调用量
export function INTERFACE_APPS_CALL_COUNT(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_apps_call_count/get', 'post', undefined, data, true)
}
// 接口应用错误率
export function INTERFACE_APPS_ERROR_CALL(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_apps_error_rate/get', 'post', undefined, data, true)
}
// 接口应用慢调用
export function INTERFACE_APPS_SLOW_CALL(data) {
  return Request('/api/v6/data/nxmc/metrics/interface_apps_slow_call/get', 'post', undefined, data, true)
}
//服务监控健康指数
export function SERVICE_HEALTH_INDEX(data) {
  return Request('/api/v6/data/nxmc/metrics/service_health_index/get', 'post', undefined, data, true)
}
//服务平均响应时间
export function SERVICE_AVG_RES_TIME(data) {
  return Request('/api/v6/data/nxmc/metrics/service_avg_res_time/get', 'post', undefined, data, true)
}
//服务失败率
export function SERVICE_REQ_ERROR_RATE(data) {
  return Request('/api/v6/data/nxmc/metrics/service_req_error_rate/get', 'post', undefined, data, true)
}
//服务吞吐量
export function SERVICE_THROUGHPUT(data) {
  return Request('/api/v6/data/nxmc/metrics/service_throughput/get', 'post', undefined, data, true)
}
//服务接口调用量
export function SERVICE_INTERFACE_CALL_COUNT(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interface_call_count/get', 'post', undefined, data, true)
}
//服务接口错误率
export function SERVICE_INTERFACE_ERROR_RATE(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interfaces_error_rate/get', 'post', undefined, data, true)
}
//服务接口慢调用
export function SERVICE_INTERFACE_SLOW_CALL(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interfaces_slow_call/get', 'post', undefined, data, true)
}
// 日志类型接口
export function LOGS_TYPE(data) {
  return Request('/api/v6/data/nxmc/logs/type/get', 'post', undefined, data, true)
}
// 日志类型接口
export function LOGS_FILED(data) {
  return Request('/api/v6/data/nxmc/logs/filed/get', 'post', undefined, data, true)
}
// 获取日志列表
export function LOGS_LIST(data) {
  return Request('/api/v6/data/nxmc/logs/list/get', 'post', undefined, data, true)
}
// 获取日志图表
export function LOGS_OVERVIEW(data) {
  return Request('/api/v6/data/nxmc/logs/overview/get', 'post', undefined, data, true)
}

// 其他 sidecar 保存
export function ENVOY_CONFIG_EDIT(data) {
  return Request('/api/v6/data/nxmc/util/envoy_config/edit/post', 'post', undefined, data, true)
}
// 其他 sidecar 刷新
export function ENVOY_CONFIG_UPDATE(data) {
  return Request('/api/v6/data/nxmc/util/envoy_config/update/post', 'post', undefined, data, true)
}
// 服务接口监控--服务接口健康指数
export function NXMC_SERVICE_INTERFACE_HEALTH_INDEX_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interfaces_health_index/get', 'post', undefined, data, true)
}
// 服务接口监控--服务接口平均响应时间
export function NXMC_SERVICE_INTERFACE_AVG_RES_TIME_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interfaces_avg_res_time/get', 'post', undefined, data, true)
}
// 服务接口监控--服务接口失败率
export function NXMC_SERVICE_INTERFACE_REQ_ERROR_RATE_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interfaces_req_error_rate/get', 'post', undefined, data, true)
}
// 服务接口监控--服务接口失败率
export function NXMC_SERVICE_INTERFACE_THROUGHPUT_GET(data) {
  return Request('/api/v6/data/nxmc/metrics/service_interfaces_throughput/get', 'post', undefined, data, true)
}
// 告警策略
export function NXMC_ALERT_LIST_GET(data) {
  return Request('/api/v6/data/nxmc/alert/list/get', 'post', undefined, data, true)
}
// 告警策略 chart图获取
export function NXMC_ALERT_OVERVIEW_GET(data) {
  return Request('/api/v6/data/nxmc/alert/overview/get', 'post', undefined, data, true)
}
// 告警详情
export function NXMC_ALERT_INFO(data) {
  return Request('/api/v6/data/nxmc/alert/info/get', 'post', undefined, data, true)
}
// 告警详情
export function NXMC_ALERT_DEAL_POST(data) {
  return Request('/api/v6/data/nxmc/alert/deal/post', 'post', undefined, data, true)
}

// 拓扑图数据
export function NXMC_TOPOLOGY_INFO_POST(data = {}) {
  return Request('api/v6/data/nxmc/service_relation/get', 'post', {}, data, true)
}

// 二级拓扑图数据
export function NXMC_TOPOLOGY_LEVEL2_INFO_POST(data = {}) {
  return Request('api/v6/data/nxmc/topology_relation/get', 'post', {}, data, true)
}
