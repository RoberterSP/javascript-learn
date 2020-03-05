// START
/**
 *
 * 企业网关
 */
// 接口列表
// 应用列表
const Main = (resolve) => {
  import('@/main/main').then((module) => {
    resolve(module)
  })
}

const appList = (resolve) => {
  import('@/views/gatewayCenter/app/appList.vue').then((module) => {
    resolve(module)
  })
}
const appDetail = (resolve) => {
  import('@/views/gatewayCenter/app/appDetail.vue').then((module) => {
    resolve(module)
  })
}
const appCreate = (resolve) => {
  import('@/views/gatewayCenter/app/appCreate.vue').then((module) => {
    resolve(module)
  })
}
const baseInfo = (resolve) => {
  import('@/views/gatewayCenter/app/appdetail/baseInfo/baseInfo.vue').then((module) => {
    resolve(module)
  })
}
const apiFilter = (resolve) => {
  import('@/views/gatewayCenter/app/appdetail/apiFilter/apiFilter.vue').then((module) => {
    resolve(module)
  })
}
const apiGroup = (resolve) => {
  import('@/views/gatewayCenter/app/appdetail/apiGroup/apiGroup.vue').then((module) => {
    resolve(module)
  })
}
const appEventSubscribe = (resolve) => {
  import('@/views/gatewayCenter/app/appdetail/eventSubscribe/eventSubscribe.vue').then((module) => {
    resolve(module)
  })
}
const apiList = (resolve) => {
  import('@/views/gatewayCenter/api/apiList.vue').then((module) => {
    resolve(module)
  })
}
const apiDetail = (resolve) => {
  import('@/views/gatewayCenter/api/apiDetail.vue').then((module) => {
    resolve(module)
  })
}
const apiSetting = (resolve) => {
  import('@/views/gatewayCenter/api/apiSetting.vue').then((module) => {
    resolve(module)
  })
}
const routeRule = (resolve) => {
  import('@/views/gatewayCenter/api/apiDetail/routeRule/routeRule.vue').then((module) => {
    resolve(module)
  })
}
const apiBaseInfo = (resolve) => {
  import('@/views/gatewayCenter/api/apiDetail/baseInfo/baseInfo.vue').then((module) => {
    resolve(module)
  })
}
const scopeList = (resolve) => {
  import('@/views/gatewayCenter/scope/scopeList.vue').then((module) => {
    resolve(module)
  })
}
const scopeDetail = (resolve) => {
  import('@/views/gatewayCenter/scope/scopeDetail.vue').then((module) => {
    resolve(module)
  })
}
const scopeCreate = (resolve) => {
  import('@/views/gatewayCenter/scope/scopeCreate.vue').then((module) => {
    resolve(module)
  })
}
const scopeBaseInfo = (resolve) => {
  import('@/views/gatewayCenter/scope/scopedetail/baseInfo/baseInfo.vue').then((module) => {
    resolve(module)
  })
}
const scopeGroup = (resolve) => {
  import('@/views/gatewayCenter/scope/scopedetail/scopeGroup/scopeGroup.vue').then((module) => {
    resolve(module)
  })
}

// 监控中心
const monitorApplication = (resolve) => {
  import('@/views/monitorCenter/monitorApplication/monitorApplication.vue').then((module) => {
    resolve(module)
  })
}
const monitorApi = (resolve) => {
  import('@/views/monitorCenter/monitorApi/monitorApi.vue').then((module) => {
    resolve(module)
  })
}
// 管理设置
const setting = (resolve) => {
  import('@/views/settingCenter/setting.vue').then((module) => {
    resolve(module)
  })
}
// 服务治理
const serviceList = (resolve) => {
  import('@/views/serviceGovernance/serviceList/serviceList.vue').then((module) => {
    resolve(module)
  })
}
const deployGroupList = (resolve) => {
  import('@/views/serviceGovernance/deployGroupList/deployGroupList.vue').then((module) => {
    resolve(module)
  })
}

const nodeList = (resolve) => {
  import('@/views/serviceGovernance/nodeList/nodeList.vue').then((module) => {
    resolve(module)
  })
}

const nodeDetail = (resolve) => {
  import('@/views/serviceGovernance/nodeList/nodeDetail.vue').then((module) => {
    resolve(module)
  })
}

// 资源信息
const resourceInfo = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/resourceInfoMenu.vue').then((module) => {
    resolve(module)
  })
}
// 资源信息 -- 节点
const serviceNode = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/node/node.vue').then((module) => {
    resolve(module)
  })
}
const serviceNodeDetail = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/node/nodeDetail.vue').then((module) => {
    resolve(module)
  })
}

// 资源信息 -- 部署组
const deploymentGroup = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/deploymentGroup/deploymentGroup.vue').then((module) => {
    resolve(module)
  })
}
// 资源信息 -- 服务接口
const serviceApi = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/serviceApi/serviceApi.vue').then((module) => {
    resolve(module)
  })
}
// 资源信息 -- 事件订阅
const eventSubscribe = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/eventSubscribe/eventSubscribe.vue').then((module) => {
    resolve(module)
  })
}
// APP分发
const appDistribute = (resolve) => {
  import('@/views/serviceGovernance/serviceConfigure/appDistribute/appDistribute.vue').then((module) => {
    resolve(module)
  })
}
// APP分发详情
const appDistributeDetail = (resolve) => {
  import('@/views/serviceGovernance/serviceConfigure/appDistribute/appDistributeDetail.vue').then((module) => {
    resolve(module)
  })
}
const serviceApiDetail = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/resourceInfo/serviceApi/serviceApiDetail.vue').then((module) => {
    resolve(module)
  })
}
// 设置的开始
const serviceDetail = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/serviceDetail.vue').then((module) => {
    resolve(module)
  })
}
const healthIndex = (resolve) => {
  import('@/views/settingCenter/setting/healthIndex/healthIndex.vue').then((module) => {
    resolve(module)
  })
}
const roleList = (resolve) => {
  import('@/views/settingCenter/setting/userPower/roleList.vue').then((module) => {
    resolve(module)
  })
}
const authRole = (resolve) => {
  import('@/views/settingCenter/setting/userPower/authRole.vue').then((module) => {
    resolve(module)
  })
}
const userPermissions = (resolve) => {
  import('@/views/settingCenter/setting/userPermissions/userPermissions.vue').then((module) => {
    resolve(module)
  })
}
const singleSignOn = (resolve) => {
  import('@/views/settingCenter/setting/singleSignOn/singleSignOn.vue').then((module) => {
    resolve(module)
  })
}
const tag = (resolve) => {
  import('@/views/settingCenter/setting/tag/TagList.vue').then((module) => {
    resolve(module)
  })
}
const warningStrategy = (resolve) => {
  import('@/views/settingCenter/setting/warningStrategy/warningStrategy.vue').then((module) => {
    resolve(module)
  })
}
const logDeployDetail = (resolve) => {
  import('@/views/settingCenter/setting/logSetting/logDeployDetail.vue').then((module) => {
    resolve(module)
  })
}
const configTemplate = (resolve) => {
  import('@/views/settingCenter/setting/configTemplate/configTemplate.vue').then((module) => {
    resolve(module)
  })
}
const fuseGroup = (resolve) => {
  import('@/views/settingCenter/setting/fuseGroup/fuseGroupList.vue').then((module) => {
    resolve(module)
  })
}
const healthRule = (resolve) => {
  import('@/views/settingCenter/setting/healthRule/healthRuleList.vue').then((module) => {
    resolve(module)
  })
}
const serviceProvider = (resolve) => {
  import('@/views/settingCenter/setting/serviceProvider/serviceProvider.vue').then((module) => {
    resolve(module)
  })
}
const sourceList = (resolve) => {
  import('@/views/settingCenter/setting/sourceList/sourceList.vue').then((module) => {
    resolve(module)
  })
}

const nameSpace = (resolve) => {
  import('@/views/settingCenter/setting/nameSpace/nameSpaceList.vue').then((module) => {
    resolve(module)
  })
}

const userList = (resolve) => {
  import('@/views/settingCenter/setting/userList/userList.vue').then((module) => {
    resolve(module)
  })
}

const logSetting = (resolve) => {
  import('@/views/settingCenter/setting/logSetting/logSetting.vue').then((module) => {
    resolve(module)
  })
}
// 设置的结束
// 服务治理
const serviceDetailGovernance = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/serviceDetailGovernance.vue').then((module) => {
    resolve(module)
  })
}
// 模拟请求
const simulationRequest = (resolve) => {
  import('@/views/serviceGovernance/simulationRequest/simulationRequest.vue').then((module) => {
    resolve(module)
  })
}
// 模拟请求
const simulationRequestapiAdd = (resolve) => {
  import('@/views/serviceGovernance/simulationRequest/apiAdd.vue').then((module) => {
    resolve(module)
  })
}
// 服务治理 -- 服务路由
const routerRules = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/routerRules/routerRules.vue').then((module) => {
    resolve(module)
  })
}
// 服务治理 -- 服务鉴权
const authentication = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/authentication/authentication.vue').then((module) => {
    resolve(module)
  })
}
// 服务治理 -- 故障注入
const faultInjection = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/faultInjection/faultInjectionList.vue').then((module) => {
    resolve(module)
  })
}
const functionExtend = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/functionExtend/functionExtendMenu.vue').then((module) => {
    resolve(module)
  })
}
const deadMessageList = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/functionExtend/deadMessageList/deadMessageList.vue').then((module) => {
    resolve(module)
  })
}
const batchEditMessageQueue = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/functionExtend/messageQueue/batchEditMessageQueue.vue').then((module) => {
    resolve(module)
  })
}
const messageQueueList = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/functionExtend/messageQueue/messageQueueList.vue').then((module) => {
    resolve(module)
  })
}
const taskList = (resolve) => {
  import('@/views/serviceGovernance/serviceDetail/functionExtend/taskList/taskList.vue').then((module) => {
    resolve(module)
  })
}
const deployGroupDetail = (resolve) => {
  import('@/views/serviceGovernance/deployGroupList/deployGroupDetail/deployGroupDetail.vue').then((module) => {
    resolve(module)
  })
}
const editDeployGroupSet = (resolve) => {
  import('@/views/serviceGovernance/deployGroupList/editDeployGroup/deployGroupSet.vue').then((module) => {
    resolve(module)
  })
}
const deployBaseMessage = (resolve) => {
  import('@/views/serviceGovernance/deployGroupList/editDeployGroup/deployBaseMessage.vue').then((module) => {
    resolve(module)
  })
}
const serviceConfig = (resolve) => {
  import('@/views/serviceGovernance/serviceConfigure/serviceConfigureList.vue').then((module) => {
    resolve(module)
  })
}
const serviceConfigDetail = (resolve) => {
  import('@/views/serviceGovernance/serviceConfigure/serviceConfigureDetail.vue').then((module) => {
    resolve(module)
  })
}
const configCheckList = (resolve) => {
  import('@/views/serviceGovernance/configCheckList/configCheckList.vue').then((module) => {
    resolve(module)
  })
}
const configCheckDetail = (resolve) => {
  import('@/views/serviceGovernance/configCheckList/configCheckDetail.vue').then((module) => {
    resolve(module)
  })
}
const monitorService = (resolve) => {
  import('@/views/monitorCenter/monitorService/monitorService.vue').then((module) => {
    resolve(module)
  })
}
const settingOther = (resolve) => {
  import('@/views/settingCenter/other/other.vue').then((module) => {
    resolve(module)
  })
}
const agent = (resolve) => {
  import('@/views/settingCenter/other/agent/agent.vue').then((module) => {
    resolve(module)
  })
}
const sidecar = (resolve) => {
  import('@/views/settingCenter/other/sidecar/sidecar.vue').then((module) => {
    resolve(module)
  })
}
const apiTracing = (resolve) => {
  import('@/views/analysisWarning/apiTracing/apiTracing.vue').then((module) => {
    resolve(module)
  })
}

const logQuery = (resolve) => {
  import('@/views/analysisWarning/logQuery/logQuery.vue').then((module) => {
    resolve(module)
  })
}
const apiTracingDetail = (resolve) => {
  import('@/views/analysisWarning/apiTracing/apiTracingDetail.vue').then((module) => {
    resolve(module)
  })
}
const monitorServiceApi = (resolve) => {
  import('@/views/monitorCenter/monitorServiceApi/monitorServiceApi.vue').then((module) => {
    resolve(module)
  })
}
const alarmsList = (resolve) => {
  import('@/views/analysisWarning/alarmsList/alarmsList.vue').then((module) => {
    resolve(module)
  })
}
const alarmsDetail = (resolve) => {
  import('@/views/analysisWarning/alarmsList/alarmsDetail.vue').then((module) => {
    resolve(module)
  })
}

const serverTopology = (resolve) => {
  import('@/views/analysisWarning/serverTopology/serverTopology.vue').then((module) => {
    resolve(module)
  })
}

const asyncRouterMaps = [
  {
    path: '/serviceCenter',
    name: '服务治理',
    meta: {
      permission: []
    },
    component: Main,
    children: [{
      path: '/serviceCenter/serviceList',
      name: 'serviceList',
      meta: {
        permission: [],
        title: '服务列表',
        timeLevel: 3
      },
      component: serviceList
    },
    {
      path: '/serviceCenter/serviceDetail',
      name: 'serviceDetail',
      meta: {
        permission: [],
        title: '服务详情',
        timeLevel: 2
      },
      component: serviceDetail
    }, {
      path: '/serviceCenter/deployGroupList',
      name: 'deployGroupList',
      meta: {
        permission: [],
        title: '部署组列表'
      },
      component: deployGroupList
    }, {
      path: '/serviceCenter/deployGroupDetail',
      name: 'deployGroupDetail',
      meta: {
        permission: [],
        title: '部署组详情',
        timeLevel: 2
      },
      component: deployGroupDetail
    },
      // 同级添加部署组下面的服务接口详情
    {
      path: '/serviceCenter/deployGroupServiceApiDetail',
      name: 'deployGroupServiceApiDetail',
      meta: {
        permission: [],
        title: '部署组接口详情',
        timeLevel: 2
      },
      component: serviceApiDetail
    },
    {
      path: '/serviceCenter/deployGroupNodeDetail',
      name: 'deployGroupNodeDetail',
      meta: {
        permission: [],
        title: '部署组节点详情',
        timeLevel: 2
      },
      component: nodeDetail
    },
    {
      path: '/serviceCenter/simulationRequest',
      name: 'simulationRequest',
      meta: {
        permission: [],
        title: '模拟请求',
        timeLevel: 2
      },
      component: simulationRequest
    },
    {
      path: '/serviceCenter/simulationRequestapiAdd',
      name: 'simulationRequestapiAdd',
      meta: {
        permission: [],
        title: '接口添加',
        timeLevel: 2
      },
      component: simulationRequestapiAdd
    },
    {
      path: '/serviceCenter/editDeployGroupSet',
      name: 'editDeployGroupSet',
      meta: {
        permission: [],
        title: '部署组设置',
        timeLevel: 2
      },
      component: editDeployGroupSet,
      children: [{
        path: '/serviceCenter/editDeployGroupSet/deployBaseMessage',
        name: 'deployBaseMessage',
        meta: {
          permission: [],
          title: '基本信息',
          timeLevel: 2
        },
        component: deployBaseMessage
      }]
    }, {
      path: '/serviceCenter/resourceInfo',
      name: 'resourceInfo',
      meta: {
        permission: [],
        title: '资源列表',
        timeLevel: 2
      },
      children: [
        {
          path: '/serviceCenter/resourceInfo/serviceNode',
          name: 'serviceNode',
          meta: {
            permission: [],
            title: '节点列表',
            timeLevel: 3
          },
          component: serviceNode
        },
        {
          path: '/serviceCenter/resourceInfo/serviceNodeDetail',
          name: 'serviceNodeDetail',
          meta: {
            permission: [],
            title: '节点详情',
            timeLevel: 3
          },
          component: serviceNodeDetail
        },
        {
          path: '/serviceCenter/resourceInfo/deploymentGroup',
          name: 'deploymentGroup',
          meta: {
            permission: [],
            title: '部署组列表',
            timeLevel: 3
          },
          component: deploymentGroup
        }, {
          path: '/serviceCenter/resourceInfo/serviceApi',
          name: 'serviceApi',
          meta: {
            permission: [],
            title: '服务接口',
            timeLevel: 3
          },
          component: serviceApi
        }, {
          path: '/serviceCenter/resourceInfo/serviceApiDetail',
          name: 'serviceApiDetail',
          meta: {
            permission: [],
            title: '服务接口详情',
            timeLevel: 2
          },
          component: serviceApiDetail
        },
        {
          path: '/serviceCenter/resourceInfo/eventSubscribe',
          name: 'eventSubscribe',
          meta: {
            permission: [],
            title: '事件订阅',
            timeLevel: 3
          },
          component: eventSubscribe
        }, {
          path: '/serviceCenter/resourceInfo/routerRules',
          name: 'routerRules',
          meta: {
            permission: [],
            title: '服务路由'
          },
          component: routerRules
        }, {
          path: '/serviceCenter/resourceInfo/authentication',
          name: 'authentication',
          meta: {
            permission: [],
            title: '服务鉴权',
            timeLevel: 3
          },
          component: authentication
        }, {
          path: '/serviceCenter/resourceInfo/faultInjection',
          name: 'faultInjection',
          meta: {
            permission: [],
            title: '故障注入',
            timeLevel: 3
          },
          component: faultInjection
        }, {
          path: '/serviceCenter/resourceInfo/deadMessageList',
          name: 'deadMessageList',
          meta: {
            permission: [],
            title: '死信队列',
            timeLevel: 3
          },
          component: deadMessageList
        }, {
          path: '/serviceCenter/resourceInfo/taskList',
          name: 'taskList',
          meta: {
            permission: [],
            title: '计划任务',
            timeLevel: 3
          },
          component: taskList
        }, {
          path: '/serviceCenter/resourceInfo/messageQueueList',
          name: 'messageQueueList',
          meta: {
            permission: [],
            title: '消息队列',
            timeLevel: 3
          },
          component: messageQueueList
        }],
      component: resourceInfo
    }, {
      path: '/serviceCenter/functionExtend/batchEditMessageQueue',
      name: 'batchEditMessageQueue',
      meta: {
        permission: [],
        title: '消息队列批量编辑',
        timeLevel: 2
      },
      component: batchEditMessageQueue
    }, {
      path: '/serviceCenter/nodeList',
      name: 'nodeList',
      meta: {
        permission: [],
        title: '节点列表',
        timeLevel: 3
      },
      component: nodeList
    },
    {
      path: '/serviceCenter/nodeDetail',
      name: 'nodeDetail',
      meta: {
        permission: [],
        title: '节点详情'
      },
      component: nodeDetail
    },
    {
      path: '/serviceCenter/configCheckList',
      name: 'configCheckList',
      meta: {
        permission: [],
        title: '配置检查'
      },
      component: configCheckList
    },
    {
      path: '/serviceCenter/configCheckDetail',
      name: 'configCheckDetail',
      meta: {
        permission: [],
        title: '配置检查详情'
      },
      component: configCheckDetail
    },
    {
      path: '/serviceCenter/serviceConfig',
      name: 'serviceConfig',
      meta: {
        permission: [],
        title: '服务配置',
        timeLevel: 2
      },
      component: serviceConfig
    }, {
      path: '/serviceCenter/serviceConfigDetail',
      name: 'serviceConfigDetail',
      meta: {
        permission: [],
        title: '服务配置详情',
        timeLevel: 2
      },
      component: serviceConfigDetail
    }, {
      path: '/serviceCenter/serviceConfig/appDistribute',
      name: 'appDistribute',
      meta: {
        permission: [],
        title: '服务配置分发',
        timeLevel: 2
      },
      component: appDistribute
    }, {
      path: '/serviceCenter/serviceConfig/appDistributeDetail',
      name: 'appDistributeDetail',
      meta: {
        permission: [],
        title: '服务配置分发详情',
        timeLevel: 2
      },
      component: appDistributeDetail
    }]
  },
  {
    path: '/monitorCenter',
    name: '监控中心',
    meta: {
      permission: [],
      timeLevel: 2
    },
    component: Main,
    children: [{
      path: '/monitorCenter/monitorApplication',
      name: 'monitorApplication',
      meta: {
        permission: [],
        title: '应用监控',
        timeLevel: 2
      },
      component: monitorApplication
    }, {
      path: '/monitorCenter/monitorApi',
      name: 'monitorApi',
      meta: {
        permission: [],
        title: '接口监控',
        timeLevel: 2
      },
      component: monitorApi
    }, {
      path: '/monitorCenter/monitorService',
      name: 'monitorService',
      meta: {
        permission: [],
        title: '服务监控',
        timeLevel: 2
      },
      component: monitorService
    }, {
      path: '/monitorCenter/monitorServiceApi',
      name: 'monitorServiceApi',
      meta: {
        permission: [],
        title: '服务接口监控',
        timeLevel: 2
      },
      component: monitorServiceApi
    }]
  },
  {
    path: '/gatewayCenter',
    name: '企业网关',
    meta: {
      permission: [],
      timeLevel: 2
    },
    component: Main,
    children: [{
      path: '/gatewayCenter/appList',
      name: 'appList',
      meta: {
        permission: [],
        title: '应用列表',
        timeLevel: 2
      },
      component: appList
    },
    {
      path: '/gatewayCenter/appDetail',
      name: 'appDetail',
      meta: {
        permission: [],
        title: '应用详情',
        timeLevel: 2
      },
      component: appDetail
    },
    {
      path: '/gatewayCenter/appCreate',
      name: 'appCreate',
      meta: {
        permission: [],
        title: '应用设置',
        timeLevel: 2
      },
      children: [
        {
          path: '/gatewayCenter/appCreate/baseInfo',
          name: 'baseInfo',
          meta: {
            permission: [],
            title: '基本信息',
            timeLevel: 2
          },
          component: baseInfo
        },
        {
          path: '/gatewayCenter/appCreate/apiFilter',
          name: 'apiFilter',
          meta: {
            permission: [],
            title: '接口过滤',
            timeLevel: 2
          },
          component: apiFilter
        },
        {
          path: '/gatewayCenter/appCreate/apiGroup',
          name: 'apiGroup',
          meta: {
            permission: [],
            title: '接口组',
            timeLevel: 2
          },
          component: apiGroup
        },
        {
          path: '/gatewayCenter/appCreate/appEventSubscribe',
          name: 'appEventSubscribe',
          meta: {
            permission: [],
            title: '事件订阅',
            timeLevel: 2
          },
          component: appEventSubscribe
        }
      ],
      component: appCreate
    },
    {
      path: '/gatewayCenter/apiList',
      name: 'apiList',
      meta: {
        permission: [],
        title: '接口列表'
      },
      component: apiList
    },
    {
      path: '/gatewayCenter/apiSetting',
      name: 'apiSetting',
      meta: {
        permission: [],
        title: '接口设置',
        timeLevel: 2
      },
      children: [
        {
          path: '/gatewayCenter/apiSetting/routeRule',
          name: 'routeRule',
          meta: {
            permission: [],
            title: '路由规则',
            timeLevel: 2
          },
          component: routeRule
        }, {
          path: '/gatewayCenter/apiSetting/apiBaseInfo',
          name: 'apiBaseInfo',
          meta: {
            permission: [],
            title: '基础信息'
          },
          component: apiBaseInfo
        }
      ],
      component: apiSetting
    },
    {
      path: '/gatewayCenter/apiDetail',
      name: 'apiDetail',
      meta: {
        permission: [],
        title: '接口详情',
        timeLevel: 2
      },
      component: apiDetail
    }, {
      path: '/gatewayCenter/scopeList',
      name: 'scopeList',
      meta: {
        permission: [],
        title: '接口组',
        timeLevel: 3
      },
      component: scopeList
    }, {
      path: '/gatewayCenter/scopeList/scopeDetail',
      name: 'scopeDetail',
      meta: {
        permission: [],
        title: '接口组详情',
        timeLevel: 2
      },
      component: scopeDetail
    }, {
      path: '/gatewayCenter/scopeList/scopeCreate',
      name: 'scopeCreate',
      meta: {
        permission: [],
        title: '接口组设置',
        timeLevel: 2
      },
      component: scopeCreate,
      children: [
        {
          path: '/gatewayCenter/scopeList/scopeDetail/baseInfo',
          name: 'scopeBaseInfo',
          meta: {
            permission: [],
            title: '基本信息',
            timeLevel: 2
          },
          component: scopeBaseInfo
        },
        {
          path: '/gatewayCenter/scopeList/scopeDetail/scopeGroup',
          name: 'scopeGroup',
          meta: {
            permission: [],
            title: '添加接口',
            timeLevel: 2
          },
          component: scopeGroup
        }
      ]
    }]
  },
  {
    path: '/settingCenter',
    name: '管理设置',
    component: Main,
    meta: {
      permission: []
    },
    children: [{
      path: '/settingCenter/setting',
      name: 'setting',
      meta: {
        settingCenter: [],
        title: '用户列表'
      },
      children: [
        {
          path: '/settingCenter/setting/healthIndex',
          name: 'healthIndex',
          meta: {
            permission: [],
            title: '健康水平'
          },
          component: healthIndex
        },
        {
          path: '/settingCenter/setting/logDeployDetail',
          name: 'logDeployDetail',
          meta: {
            permission: [],
            title: '日志配置分发'
          },
          component: logDeployDetail
        },
        {
          path: '/settingCenter/setting/roleList',
          name: 'roleList',
          meta: {
            permission: [],
            title: '角色列表'
          },
          component: roleList
        },
        {
          path: '/settingCenter/setting/roleList/authRole',
          name: 'authRole',
          meta: {
            permission: [],
            title: '角色授权'
          },
          component: authRole
        },
        {
          path: '/settingCenter/setting/singleSignOn',
          name: 'singleSignOn',
          meta: {
            permission: [],
            title: '单点登录白名单'
          },
          component: singleSignOn
        },
        {
          path: '/settingCenter/setting/userPermissions',
          name: 'userPermissions',
          meta: {
            permission: [],
            title: '用户权限'
          },
          component: userPermissions
        },
        {
          path: '/settingCenter/setting/logSetting',
          name: 'logSetting',
          meta: {
            permission: [],
            title: '日志设置'
          },
          component: logSetting
        },
        {
          path: '/settingCenter/setting/warningStrategy',
          name: 'warningStrategy',
          meta: {
            permission: [],
            title: '预警策略'
          },
          component: warningStrategy
        },
        {
          path: '/settingCenter/setting/fuseGroup',
          name: 'fuseGroup',
          meta: {
            permission: [],
            title: '熔断规则'
          },
          component: fuseGroup
        },
        {
          path: '/settingCenter/setting/healthRule',
          name: 'healthRule',
          meta: {
            permission: [],
            title: '健康规则'
          },
          component: healthRule
        }, {
          path: '/settingCenter/setting/tag',
          name: 'tag',
          meta: {
            permission: [],
            title: '标签'
          },
          component: tag
        },
        {
          path: '/settingCenter/setting/configTemplate',
          name: 'configTemplate',
          meta: {
            permission: [],
            title: '配置模板'
          },
          component: configTemplate
        },
        {
          path: '/settingCenter/setting/nameSpace',
          name: 'nameSpace',
          meta: {
            permission: [],
            title: '命名空间'
          },
          component: nameSpace
        },
        {
          path: '/settingCenter/setting/serviceProvider',
          name: 'serviceProvider',
          meta: {
            permission: [],
            title: '服务提供商'
          },
          component: serviceProvider
        },
        {
          path: '/settingCenter/setting/userList',
          name: 'userList',
          meta: {
            permission: [],
            title: '用户列表'
          },
          component: userList
        },
        {
          path: '/settingCenter/setting/sourceList',
          name: 'sourceList',
          meta: {
            permission: [],
            title: '资源列表'
          },
          component: sourceList
        }
      ],
      component: setting
    }, {
      path: '/settingCenter/other',
      name: 'other',
      meta: {
        settingCenter: [],
        title: '其他'
      },
      children: [
        {
          path: '/settingCenter/other/agent',
          name: 'agent',
          meta: {
            permission: [],
            title: 'Agnet命令列表'
          },
          component: agent
        },
        {
          path: '/settingCenter/other/sidecar',
          name: 'sidecar',
          meta: {
            permission: [],
            title: 'SideCar配置'
          },
          component: sidecar
        }
      ],
      component: settingOther
    }]
  },
  {
    path: '/analysisWarning',
    name: '分析预警',
    component: Main,
    meta: {
      permission: []
    },
    children: [{
      path: '/analysisWarning/serverTopology',
      name: 'serverTopology',
      meta: {
        title: '服务拓扑',
        timeLevel: 2
      },
      component: serverTopology
    }, {
      path: '/analysisWarning/apiTracing',
      name: 'apiTracing',
      meta: {
        title: '调用跟踪',
        timeLevel: 2
      },
      component: apiTracing
    }, {
      path: '/analysisWarning/logQuery',
      name: 'logQuery',
      meta: {
        title: '日志查询',
        timeLevel: 2
      },
      component: logQuery
    }, {
      path: '/analysisWarning/apiTracing/apiTracingDetail',
      name: 'apiTracingDetail',
      meta: {
        title: '调用跟踪详情',
        timeLevel: 2
      },
      component: apiTracingDetail
    }, {
      path: '/analysisWarning/alarmsList',
      name: 'alarmsList',
      meta: {
        title: '告警列表',
        timeLevel: 2
      },
      component: alarmsList
    }, {
      path: '/analysisWarning/alarmsDetail',
      name: 'alarmsDetail',
      meta: {
        title: '告警列表详情'
      },
      component: alarmsDetail
    }]
  }
]
export default asyncRouterMaps
