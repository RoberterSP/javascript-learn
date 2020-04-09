<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>

    <div class="p20">
      <div class="flex">
        <DYCard class="margin-card appdetail_left">
          <DYHeader
            :icon="$route.params.lang"
            :title="detailData.name"
            no-gap
            class="mb10"
          >
            <DYButton slot="actions" type="primary" @click="edit"
                      v-permission="'serviceCenter_deployGroupDetail_baseInfo_edit'">编辑
            </DYButton>
          </DYHeader>

          <div>
            <DYSplitTitle
              type="detail"
              title="详情"
              iconClickEnable
              :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
              @onIconClick="isShowDetail = !isShowDetail"
            />

            <transition name="rollup">
              <div class="mt24 ml12" v-if="isShowDetail">
                <DYKeyValue
                  width="470"
                  v-for="item of keyValueList"
                  :key="`key-value-${item.value}`"
                  :text="item.text"
                  :value="item.value"
                />
              </div>
            </transition>

            <DYIndexBox
              theme="blue"
              :cards="boxCards"
            />

          </div>
        </DYCard>

      </div>

      <DYCard class="margin-card">
        <DYTabs class="row-action" :tabList="resourceTabs" @onClick="tabsClick" theme="blue"></DYTabs>

        <div class="row-content">
          <nt-table
            v-show="activeTab === 0"
            :tableData="endpoints"
            :tableSet="endpointsTableSet"
            :columns="endpointsColumns"
            @readDetail="readDetailEndpoints"
          ></nt-table>
          <nt-table
            v-show="activeTab === 1"
            :tableData="nodeList"
            :tableSet="nodeTableSet"
            :columns="nodeColumns"
            :componentsName="'tagsContent'"
            @readDetail="readDetailNode"
          ></nt-table>
        </div>
      </DYCard>

      <div class="detailPanel flex-between">
        <div class="block">

          <DYCard class=" margin-card">
            <DYHeader style="margin-bottom: 23px;" :title="`${alertRulesTotal} 预警`" sub-title="相应时间内，与部署组相关的预警信息"
                      type="small" no-gap/>
            <div v-for="(rule, index) in alertRules" :key="'rule' + index" class="alertRules">
              <div class="leftImg flex-center">
                <img src="@/assets/image/alert_rules.svg" alt="">
              </div>
              <div class="rightTitle">
                <p class="title">{{rule.name}}</p>
                <!-- todo 告警级别 -->
                <span class="subtitle">告警级别</span>
                <span class="subtitle">{{rule.created_at}}</span>
              </div>
            </div>
            <div v-show="alertRulesTotal > 3" @click="getAlertRules" class="full-width flex-center cursor-pointer">
              <img v-show="!rulesShow" src="@/assets/image/icon-arrow-down.svg" alt="">
              <img v-show="rulesShow" src="@/assets/image/icon-arrow-up.svg" alt="">
            </div>
          </DYCard>
        </div>

        <div class="block flex flex-column">
          <DYCard class=" margin-card">
            <DYHeader style="margin-bottom: 23px;" :title="`${routeTotal} 个路由配置`" type="small" no-gap/>
            <div v-for="(rule, index) in routes" :key="'rule' + index" class="alertRules">
              <div class="leftImg flex-center">
                <img src="@/assets/image/route_config.svg" alt="">
              </div>
              <div class="rightTitle">
                <p class="title">{{rule.name}}</p>
                <span class="subtitle">{{rule.code}}</span>
              </div>
            </div>
            <div v-show="routeTotal > 3" @click="getRoute" class="full-width flex-center cursor-pointer">
              <img v-show="!routeShow" src="@/assets/image/icon-arrow-down.svg" alt="">
              <img v-show="routeShow" src="@/assets/image/icon-arrow-up.svg" alt="">
            </div>
          </DYCard>

          <DYCard class=" margin-card">
            <DYHeader style="margin-bottom: 23px;" :title="`${logTotal} 个日志配置`" type="small" no-gap/>
            <div v-for="(log, index) in logs" :key="'log' + index" class="alertRules">
              <div class="leftImg flex-center">
                <img src="@/assets/image/log_config.svg" alt="">
              </div>
              <div class="rightTitle">
                <p class="title">{{log.name}}</p>
                <span class="subtitle">{{log.code}}</span>
              </div>
            </div>
            <div v-show="logTotal > 3" @click="getMesh" class="full-width flex-center cursor-pointer">
              <img v-show="!logShow" src="@/assets/image/icon-arrow-down.svg" alt="">
              <img v-show="logShow" src="@/assets/image/icon-arrow-up.svg" alt="">
            </div>
          </DYCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DYIndexBox from 'components/indexBox/DYIndexBox.vue'

import XChart from 'components/charts/charts.vue'
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import {
  ALERT_RULE_LIST_GET,
  DEPLOY_LOG_LIST,
  DEPLOY_MESH_LIST,
  DEPLOY_ROUTE_LIST,
  MESH_DEPLOY_GROUP_MONITOR_INFO,
  MESH_ENDPOINT_LIST,
  MESH_NODE_INFO,
  MESH_NODE_LIST
} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import '@/directives/currency.js'

export default {
  data () {
    return {
      rulesShow: false,
      routeShow: false,
      meshShow: false,
      logShow: false,
      DeployGroupInfo: {},
      detailData: {},
      resourceTabs: [{title: '接口'}, {title: '节点'}],
      isShowDetail: false,
      activeTab: 0,
      nodeList: [],
      endpoints: [],
      completeRules: [],
      completeRoute: [],
      completeMesh: [],
      completeLog: [],
      alertRules: [],
      routes: [],
      meshs: [],
      logs: [],
      alertRulesTotal: 0,
      routeTotal: 0,
      meshTotal: 0,
      logTotal: 0,
      nodeColumns: [
        {
          name: '名称',
          code: 'name',
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'endpoint'
        },
        {
          name: 'IP',
          code: 'ips',
          type: 'text'
        },
        {
          name: '标签',
          code: 'tags',
          type: 'tags',
          tag_name: 'name'
        },
        {
          name: '状态',
          code: 'status_str',
          type: 'text'
        }
      ],
      endpointsColumns: [
        {
          name: '接口',
          code: 'endpoint',
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'API'
        },
        {
          name: '名称',
          code: 'name',
          type: 'text'
        },
        {
          name: '状态',
          code: 'state_label',
          type: 'text',
          textAlign: 'right'
        }
      ],
      endpointsTableSet: {
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      nodeTableSet: {
        showOpenInfo: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      stepper: [{name: '部署组', routerTo: 'deployGroupList'}]
    }
  },
  computed: {
    keyValueList () {
      return [
        {
          text: '标识',
          value: this.detailData.code
        },
        {
          text: '开发语言',
          value: this.detailData.lang
        },
        {
          text: '服务提供商',
          value: this.detailData.third_party_name
        },
        {
          text: '负载均衡策略',
          value: this.detailData.lb_type_text
        },
        {
          text: '状态',
          value: this.detailData.status
        }
      ]
    },
    boxCards () {
      return {
        leftTop: {
          value: this.DeployGroupInfo.health_index,
          text: '健康指数',
          backgroundImage: 'health_index'
        },
        leftBottom: {
          value: this.DeployGroupInfo.total_request_num,
          filter: 'filterCount',
          text: '访问量',
          backgroundImage: 'request_num'
        },
        center: {
          noText: true,
          label: '基本信息'
        },
        rightTop: {
          value: this.DeployGroupInfo.avg_response_time,
          filter: 'currency',
          filterParams: ['ms'],
          text: '平均响应时间',
          backgroundImage: 'avg_response_time'
        },
        rightBottom: {
          value: this.DeployGroupInfo.total_traffic,
          filter: 'filterTraffic',
          text: '流量',
          backgroundImage: 'traffic'
        }
      }
    }
  },
  methods: {
    setClass (name) {
      let obj = {}
      obj[name] = true
      return obj
    },
    readDetailEndpoints (row) {
      this.$router.push({
        name: 'deployGroupServiceApiDetail',
        params: {
          fromDeployGroupDetail: true,
          detailData: this.detailData,
          detailApi: row,
          fromRouter: this.stepper
        }
      })
      // this.$router.push({ name: 'apiDetail', params: row })
    },
    readDetailNode (row) {
      this.$router.push({
        name: 'deployGroupNodeDetail',
        params: {detailData: this.detailData, nodeDetail: row, fromRouter: this.stepper, isShow: true}
      })
    },
    edit () {
      this.$router.push({
        name: 'deployBaseMessage',
        params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'deployBaseMessage'}}
      })
    },
    getAlertRules () {
      this.rulesShow = !this.rulesShow
      this.alertRules = []
      if (this.rulesShow) {
        this.alertRules = JSON.parse(JSON.stringify(this.completeRules))
      } else {
        this.alertRules = JSON.parse(JSON.stringify(this.completeRules)).splice(0, 3)
      }
    },
    getRoute () {
      this.routeShow = !this.routeShow
      this.routes = []
      if (this.routeShow) {
        this.routes = JSON.parse(JSON.stringify(this.completeRoute))
      } else {
        this.routes = JSON.parse(JSON.stringify(this.completeRoute)).splice(0, 3)
      }
    },
    getMesh () {
      this.meshShow = !this.meshShow
      this.meshs = []
      if (this.meshShow) {
        this.meshs = JSON.parse(JSON.stringify(this.completeMesh))
      } else {
        this.meshs = JSON.parse(JSON.stringify(this.completeMesh)).splice(0, 3)
      }
    },
    getLog () {
      this.logShow = !this.logShow
      this.logs = []
      if (this.logShow) {
        this.logs = JSON.parse(JSON.stringify(this.completeLog))
      } else {
        this.logs = JSON.parse(JSON.stringify(this.completeLog)).splice(0, 3)
      }
    },
    tabsClick (item, index) {
      this.activeTab = index
    },
    // 页面加载 初始化数据
    initPageData () {
      this.stepper.push({name: this.detailData.name, myCustomRouter: true, routerTo: 'deployGroupDetail'})
      bus.$emit('resetTime')
      // this.deploy_group_info_get({
      //   deploy_group_id: this.detailData.id,
      //   monitor_flag: true,
      //   time_range: 'Last 30 minutes'})
      this.mesh_node_list({page: 1, page_size: PAGESIZE, deploy_group_code: this.detailData.code})
      this.get_mesh_endpoint_list({page: 1, page_size: PAGESIZE, deploy_group_code: this.detailData.code})
      this.alert_rule_list_get({page: 1, page_size: PAGESIZE, deploy_group_code: this.detailData.code})
      this.deploy_route_list({deploy_group_id: this.detailData.id})
      // this.deploy_mesh_list({deploy_group_id: this.detailData.id})
      this.deploy_log_list({deploy_group_id: this.detailData.id})
    },
    mesh_node_list (data) {
      MESH_NODE_LIST(data).then(res => {
        // if (!this.$_hasRoute('nodeDetail')) {
        //   this.$set(this.nodeColumns[0], 'type', 'text')
        // }
        if (!this.$_hasRoute('deployGroupNodeDetail')) {
          this.$set(this.nodeColumns[0], 'type', 'text')
        }
        this.nodeList = res.data.mesh_nodes
        this.$set(this.resourceTabs[1], 'title', '节点(' + res.data.total + ')')
        this.nodeList.forEach(async x => {
          await MESH_NODE_INFO({
            node_id: x.id,
            deploy_group_code: this.detailData.code
          }).then(res => {
            let nodeInfo = res.data.node_info
            this.$set(x, 'ips', x.ip + '\n' + x.wan_ip)
            this.$set(x, 'total_endpoint_num', nodeInfo.total_endpoint_num)
            this.$set(x, 'total_process_num', nodeInfo.total_process_num)
            this.$set(x, 'tags', nodeInfo.tags)
            this.$set(x, 'status', nodeInfo.status)
            let statusStr = '已停止'
            if (nodeInfo.status === 'stop') {
              statusStr = '已停止'
            }
            if (nodeInfo.status === 'running') {
              statusStr = '运行中'
            }
            if (nodeInfo.status === 'offline') {
              statusStr = '已下线'
            }
            this.$set(x, 'status_str', statusStr)
          })
        })
      })
    },
    deploy_group_info_get (data) {
      MESH_DEPLOY_GROUP_MONITOR_INFO(data).then(res => {
        this.DeployGroupInfo = res.data.deploy_group_info
      })
    },
    get_mesh_endpoint_list (data) {
      MESH_ENDPOINT_LIST(data).then(res => {
        if (!this.$_hasRoute('deployGroupServiceApiDetail')) {
          this.$set(this.endpointsColumns[0], 'type', 'text')
        }
        this.endpoints = res.data.endpoints
        this.endpointsTableSet.paginationConfig.total = res.data.total
        this.$set(this.resourceTabs[0], 'title', '接口(' + res.data.total + ')')
        this.endpoints.forEach(item => {
          switch (item.state) {
            case 'unregistered':
              item.state_label = '未注册'
              break
            case 'registered':
              item.state_label = '已注册'
              break
            default:
              break
          }
        })
      })
    },
    alert_rule_list_get (data) {
      ALERT_RULE_LIST_GET(data).then(res => {
        this.alertRulesTotal = res.data.total
        this.completeRules = JSON.parse(JSON.stringify(res.data.alert_rules))
        if (res.data.total > 3) {
          this.alertRules = res.data.alert_rules.splice(0, 3)
        } else {
          this.alertRules = res.data.alert_rules
        }
      })
    },
    deploy_route_list (data) {
      DEPLOY_ROUTE_LIST(data).then(res => {
        this.routeTotal = res.data.total
        this.completeRoute = JSON.parse(JSON.stringify(res.data.route_rules))
        if (res.data.total > 3) {
          this.routes = res.data.route_rules.splice(0, 3)
        } else {
          this.routes = res.data.route_rules
        }
      })
    },
    deploy_mesh_list (data) {
      DEPLOY_MESH_LIST(data).then(res => {
        this.meshTotal = res.data.total
        this.completeMesh = JSON.parse(JSON.stringify(res.data.mesh_configs))
        if (res.data.total > 3) {
          this.meshs = res.data.mesh_configs.splice(0, 3)
        } else {
          this.meshs = res.data.mesh_configs
        }
      })
    },
    deploy_log_list (data) {
      DEPLOY_LOG_LIST(data).then(res => {
        this.logTotal = res.data.total
        this.completeLog = JSON.parse(JSON.stringify(res.data.log_configs))
        if (res.data.total > 3) {
          this.logs = res.data.log_configs.splice(0, 3)
        } else {
          this.logs = res.data.log_configs
        }
      })
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
    bus.$off('refreshNodeList')
  },
  mounted () {
    let that = this
    bus.$on('refreshNodeList', (data) => {
      that.nodeList.forEach((node, index) => {
        if (node.id === data.id) {
          that.$set(that.nodeList[index], 'tags', data.list)
        }
      })
    })
    if (this.$route.params && this.$route.params.id) {
      this.detailData = this.$route.params
      if (this.detailData.lb_type === 'ROUND_ROBIN') {
        this.detailData.lb_type_text = '轮询'
      } else if (this.detailData.lb_type === 'LEAST_REQUEST') {
        this.detailData.lb_type_text = '最小请求数'
      } else if (this.detailData.lb_type === 'RANDOM') {
        this.detailData.lb_type_text = '随机'
      }
      bus.$on('timeChanged', (data) => {
        if (data.code) {
          that.deploy_group_info_get({
            deploy_group_id: this.detailData.id,
            monitor_flag: true,
            time_range: data.code
          })
        } else {
          that.deploy_group_info_get({
            deploy_group_id: this.detailData.id,
            monitor_flag: true,
            start_time: data.start_time,
            end_time: data.end_time
          })
        }
      })

      // console.log(this.detailData)
      // if (this.detailData.standard && this.detailData.code !== 'nxgw') this.fcExt = true
      // if (this.detailData.standard || (!this.detailData.standard && !this.detailData.component)) this.serGo = true

      this.initPageData()
    } else {
      this.$router.push({name: 'deployGroupList'})
    }
  },
  created () {
  },
  components: {
    stepper,
    DYIndexBox,
    XChart,
    ntTable
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .wrapper {
    padding-bottom: 33px;

    .appdetail_left {
      width: 50%;
      flex-shrink: 0;

    }

    .detailPanel {
      align-items: flex-start;

      .block {
        width: 100%;

        .alertRules {
          margin-bottom: 10px;

          .leftImg {
            width: 56px;
            height: 53px;
            float: left;
          }

          .rightTitle {
            padding-left: 10px;
            padding-top: 6px;

            .title {
              font-size: 15px;
              font-weight: 500;
              color: rgba(69, 70, 70, 1);
              line-height: 21px;
              margin-bottom: 2px;
            }

            .subtitle {
              font-size: 12px;
              font-weight: 400;
              color: rgba(137, 137, 137, 1);
              line-height: 17px;
              margin-right: 4px;
            }
          }
        }

      }
    }
  }
</style>
