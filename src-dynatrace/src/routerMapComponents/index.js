const files = require.context('./', true, /\.js$/)

let componentMaps = {
  'main': (resolve) => import('@/main/main.vue').then((module) => { resolve(module) }),
  // 企业网关
  'gatewayCenter_appList': (resolve) => import('@/views/gatewayCenter/app/appList.vue').then((module) => { resolve(module) }),
  'gatewayCenter_appDetail': (resolve) => import('@/views/gatewayCenter/app/appDetail.vue').then((module) => { resolve(module) }),
  'gatewayCenter_appCreate': (resolve) => import('@/views/gatewayCenter/app/appCreate.vue').then((module) => { resolve(module) }),
  'gatewayCenter_apiList': (resolve) => import('@/views/gatewayCenter/api/apiList.vue').then((module) => { resolve(module) }),
  'gatewayCenter_apiDetail': (resolve) => import('@/views/gatewayCenter/api/apiDetail.vue').then((module) => { resolve(module) }),
  'gatewayCenter_apiDetail_apiSetting': (resolve) => import('@/views/gatewayCenter/api/apiSetting.vue').then((module) => { resolve(module) }),
  'gatewayCenter_scopeList': (resolve) => import('@/views/gatewayCenter/scope/scopeList.vue').then((module) => { resolve(module) }),
  'gatewayCenter_scopeDetail': (resolve) => import('@/views/gatewayCenter/scope/scopeDetail.vue').then((module) => { resolve(module) }),
  'gatewayCenter_scopeCreate': (resolve) => import('@/views/gatewayCenter/scope/scopeCreate.vue').then((module) => { resolve(module) }),
  // 监控中心
  'monitorCenter_monitorApplication': (resolve) => import('@/views/monitorCenter/monitorApplication/monitorApplication.vue').then((module) => { resolve(module) }),
  // 管理设置
  'settingCenter_userList': (resolve) => import('@/views/settingCenter/setting.vue').then((module) => { resolve(module) }),
  'settingCenter_other': (resolve) => import('@/views/settingCenter/other/other.vue').then((module) => { resolve(module) }),
  'settingCenter_agent': (resolve) => import('@/views/settingCenter/other/agent/agent.vue').then((module) => { resolve(module) }),
  'settingCenter_sidecar': (resolve) => import('@/views/settingCenter/other/sidecar/sidecar.vue').then((module) => { resolve(module) }),
  // 服务治理
  'serviceCenter_serviceList': (resolve) => import('@/views/serviceGovernance/serviceList/serviceList.vue').then((module) => { resolve(module) }),
  'serviceCenter_simulationRequest': (resolve) => import('@/views/serviceGovernance/simulationRequest/simulationRequest.vue').then((module) => { resolve(module) }),
  'serviceCenter_simulationRequest_simulationRequestapiAdd': (resolve) => import('@/views/serviceGovernance/simulationRequest/apiAdd.vue').then((module) => { resolve(module) }),
  'serviceCenter_nodeList': (resolve) => import('@/views/serviceGovernance/nodeList/nodeList.vue').then((module) => { resolve(module) }),
  'serviceCenter_nodeList_serviceNodeDetail': (resolve) => import('@/views/serviceGovernance/nodeList/nodeDetail.vue').then((module) => { resolve(module) }),
  'serviceGovernance_serviceDetail_resourceInfo': (resolve) => import('@/views/serviceGovernance/serviceDetail/resourceInfo/resourceInfoMenu.vue').then((module) => { resolve(module) }),
  'serviceGovernance_serviceDetail_nodeDetail': (resolve) => import('@/views/serviceGovernance/serviceDetail/resourceInfo/node/nodeDetail.vue').then((module) => { resolve(module) }),
  'serviceGovernance_serviceDetail_serviceApiDetail': (resolve) => import('@/views/serviceGovernance/serviceDetail/resourceInfo/serviceApi/serviceApiDetail.vue').then((module) => { resolve(module) }),
  'serviceCenter_serviceDetail': (resolve) => import('@/views/serviceGovernance/serviceDetail/serviceDetail.vue').then((module) => { resolve(module) }),
  'serviceGovernance_serviceDetailGovernance': (resolve) => import('@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/serviceDetailGovernance.vue').then((module) => { resolve(module) }),
  'serviceCenter_functionExtend': (resolve) => import('@/views/serviceGovernance/serviceDetail/functionExtend/functionExtendMenu.vue').then((module) => { resolve(module) }),
  'serviceCenter_serviceDetail_deadMessageList': (resolve) => import('@/views/serviceGovernance/serviceDetail/functionExtend/deadMessageList/deadMessageList.vue').then((module) => { resolve(module) }),
  'serviceCenter_batchEditMessageQueue': (resolve) => import('@/views/serviceGovernance/serviceDetail/functionExtend/messageQueue/batchEditMessageQueue.vue').then((module) => { resolve(module) }),
  'serviceCenter_deployGroupDetail': (resolve) => import('@/views/serviceGovernance/deployGroupList/deployGroupDetail/deployGroupDetail.vue').then((module) => { resolve(module) }),
  // 分析预警
  'analysisWarning_apiTracing': (resolve) => import('@/views/analysisWarning/apiTracing/apiTracing.vue').then((module) => { resolve(module) })
}
files.keys().forEach((key) => {
  if (key === './index.js') return
  Object.assign(componentMaps, files(key).default)
})
export default componentMaps
