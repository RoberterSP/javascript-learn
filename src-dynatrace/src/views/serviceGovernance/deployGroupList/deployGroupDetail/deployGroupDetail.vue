<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="detail_box">
      <div class="flex">
        <div class="appdetail_left">
          <div class="flex-between mt20">
            <div class="detail-title flex">
              <i class="iconfont icon-title" :class="setClass('icon' + $route.params.lang)"></i>
              <div class="detail-tit_box flex-center">
                <span class="title-top">{{detailData.name}}</span>
              </div>
            </div>
            <el-button @click="edit" style="margin-right: 33px;" type="primary" v-permission="'serviceCenter_deployGroupDetail_baseInfo_edit'">编辑</el-button>
          </div>
          <div>
            <div class="detail-img flex-start" @click="isShowDetail=!isShowDetail">
              <span>
                <span class="column-icon iconfont" :class="{'iconarrowdown': !isShowDetail,'iconarrowup': isShowDetail}"></span>
                <span>详情</span>
              </span>
              <span class="split"></span>
            </div>
            <div class="content" v-show="isShowDetail">
              <div class="content-detail flex-start">
                <span class="head-left">标识</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.code}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">开发语言</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.lang}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">服务提供商</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.third_party_name}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">负载均衡策略</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.lb_type_text}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">连接超时时间</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.connect_timeout}}s</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">状态</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.status}}</span>
                </span>
              </div>
            </div>
            <div style="overflow: scroll" class="flex">
              <div class="left-block mt20">
                <!-- <h3>相关数据</h3>
                <p class="default-label">描述描述描述描述描述描述描述</p> -->
                <div class="flex-center btn-box">
                  <div class="dVl-Lc">
                    <div class="box health_index">
                      <div class="num">{{meshInfo.health_index}}</div>
                      <div class="text">健康指数</div>
                    </div>
                    <div class="box request_num">
                      <div class="num">{{meshInfo.total_request_num}}</div>
                      <div class="text">访问量</div>
                    </div>
                  </div>
                  <div class="dVl-Dc">
                    <img src="@/assets/image/icon-step-detail.svg" alt="" class="rotate180">
                  </div>
                  <div style="height: 140px;" class="dVl-Fc">
                    <div class="dVl-Xc">
                      <div class="dVl-Jc">
                        <div class="dVl-Jc-1"></div>
                        <div class="dVl-Jc-2"></div>
                        <div class="dVl-Jc-3"></div>
                        <div class="dVl-Jc-4"></div>
                      </div>
                      <div class="dVl-Mc">
                        <div class="gwt-HTML">
                        </div>
                        <span class="dVl-Yc"></span>
                        <span class="dVl-Wc">基本信息</span>
                      </div>
                    </div>
                  </div>
                  <div class="dVl-Dc flex-end">
                    <img src="@/assets/image/icon-step-detail.svg" alt="">
                  </div>
                  <div class="dVl-Lc">
                    <div class="box avg_response_time">
                      <div class="num">{{meshInfo.avg_response_time | currency('ms')}}</div>
                      <div class="text">平均响应时间</div>
                    </div>
                    <div class="box traffic">
                      <div class="num">{{meshInfo.total_traffic | filterTraffic}}</div>
                      <div class="text">流量</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mid-content p15">
      <nt-tabs :tabList="resourceTabs" @tabsClick="tabsClick" theme="blue"></nt-tabs>
      <div class="mt10">
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
    </div>
    <div class="mt10 ml30 mr30 mb30 detailPanel flex-between">
      <div class="block mr20">
        <div class="blockCard p15">
          <h2>{{alertRulesTotal}} 预警</h2>
          <p style="margin-bottom: 23px;" class="default-label">相应时间内，与部署组相关的预警信息</p>
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
          <div v-show="alertRulesTotal > 3" @click="getAlertRules" class="fullWidth flex-center cursor_pointer">
            <img v-show="!rulesShow" src="@/assets/image/icon-arrow-down.svg" alt="">
            <img v-show="rulesShow" src="@/assets/image/icon-arrow-up.svg" alt="">
          </div>
        </div>
        <!-- <div class="blockCard mt22 p15">
          <h2 style="margin-bottom: 23px;">{{meshTotal}} 个服务配置</h2>
          <div v-for="(mesh, index) in meshs" :key="'mesh' + index" class="alertRules">
            <div class="leftImg flex-center">
              <img src="@/assets/image/service_config.svg" alt="">
            </div>
            <div class="rightTitle">
              <p class="title">{{mesh.name}}</p>
              <span class="subtitle">{{mesh.code}}</span>
            </div>
          </div>
          <div v-show="meshTotal > 3" @click="getMesh" class="fullWidth flex-center cursor_pointer">
            <img v-show="!routeShow" src="@/assets/image/icon-arrow-down.svg" alt="">
            <img v-show="routeShow" src="@/assets/image/icon-arrow-up.svg" alt="">
          </div>
        </div> -->
      </div>
      <div class="block flex flex-column">
        <div class="blockCard p15">
          <h2 style="margin-bottom: 23px;">{{routeTotal}} 个路由配置</h2>
          <div v-for="(rule, index) in routes" :key="'rule' + index" class="alertRules">
            <div class="leftImg flex-center">
              <img src="@/assets/image/route_config.svg" alt="">
            </div>
            <div class="rightTitle">
              <p class="title">{{rule.name}}</p>
              <span class="subtitle">{{rule.code}}</span>
            </div>
          </div>
          <div v-show="routeTotal > 3" @click="getRoute" class="fullWidth flex-center cursor_pointer">
            <img v-show="!routeShow" src="@/assets/image/icon-arrow-down.svg" alt="">
            <img v-show="routeShow" src="@/assets/image/icon-arrow-up.svg" alt="">
          </div>
        </div>
        <div class="blockCard mt22 p15">
          <h2 style="margin-bottom: 23px;">{{logTotal}} 个日志配置</h2>
          <div v-for="(log, index) in logs" :key="'log' + index" class="alertRules">
            <div class="leftImg flex-center">
              <img src="@/assets/image/log_config.svg" alt="">
            </div>
            <div class="rightTitle">
              <p class="title">{{log.name}}</p>
              <span class="subtitle">{{log.code}}</span>
            </div>
          </div>
          <div v-show="logTotal > 3" @click="getMesh" class="fullWidth flex-center cursor_pointer">
            <img v-show="!logShow" src="@/assets/image/icon-arrow-down.svg" alt="">
            <img v-show="logShow" src="@/assets/image/icon-arrow-up.svg" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XChart from 'components/charts/charts.vue'
import stepper from 'components/stepper/stepper.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import ntTabs from 'components/base/tabs.vue'
import {
  ALERT_RULE_LIST_GET,
  DEPLOY_LOG_LIST,
  DEPLOY_MESH_LIST,
  DEPLOY_ROUTE_LIST,
  MESH_DEPLOY_GROUP_INFO,
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
      meshInfo: {},
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
          icon_url: 'iconendpoint'
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
          icon_url: 'iconAPI'
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
      stepper: [{ name: '部署组', routerTo: 'deployGroupList' }]
    }
  },
  computed: {},
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
      this.$router.push({ name: 'deployGroupNodeDetail', params: {detailData: this.detailData, nodeDetail: row, fromRouter: this.stepper, isShow: true} })
    },
    edit () {
      this.$router.push({name: 'deployBaseMessage', params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'deployBaseMessage'}}})
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
      this.stepper.push({name: this.detailData.name, myCoutomRouter: true, routerTo: 'deployGroupDetail'})
      bus.$emit('resetTime')
      // this.mesh_info_get({
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
        this.nodeList.forEach(x => {
          MESH_NODE_INFO({
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
            this.$set(x, 'status_str', statusStr)
          })
        })
      })
    },
    mesh_info_get (data) {
      MESH_DEPLOY_GROUP_INFO(data).then(res => {
        this.meshInfo = res.data.deploy_group_info
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
        this.endpoints.map(item => {
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
      that.nodeList.map((node, index) => {
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
          that.mesh_info_get({
            deploy_group_id: this.detailData.id,
            monitor_flag: true,
            time_range: data.code})
        } else {
          that.mesh_info_get({
            deploy_group_id: this.detailData.id,
            monitor_flag: true,
            start_time: data.start_time,
            end_time: data.end_time})
        }
      })

      // console.log(this.detailData)
      // if (this.detailData.standard && this.detailData.code !== 'nxgw') this.fcExt = true
      // if (this.detailData.standard || (!this.detailData.standard && !this.detailData.component)) this.serGo = true

      this.initPageData()
    } else {
      this.$router.push({ name: 'deployGroupList' })
    }
  },
  created () {},
  components: {
    stepper,
    splitTitle,
    XChart,
    ntTable,
    ntTabs
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.wrapper {
  padding-bottom: 33px;
  .column-icon {
    color: #00A1B2;
  }
  .content {
    padding-top: 23px;
    padding-left: 27px;
    font-size:12px;
    font-family:SourceHanSansSC-Regular,SourceHanSansSC;
    font-weight:400;
    color:rgba(69,70,70,1);
    .content-detail {
      width: 470px;
      .head-left {
        line-height: 25px;
        font-size:12px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(69,70,70,1);
        white-space: nowrap;
      }
      .head-right {
        font-size:12px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(69,70,70,1);
        line-height:12px;
        width: 100%;
        .head-right-text {
          white-space:nowrap
        }
        .dashBorder {
          height: 12px;
          width: 100%;
          margin-right: 4px;
          align-items: flex-end;
          overflow: hidden;
          position: relative;
          &::after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50000px;
            border-bottom: 1px dotted #ccc;
          }
          .xiaofangge {
            width: 1px;
            height: 1px;
            background-color: #CCCCCC;
            margin-right: 1px;
          }
        }
      }
      .copy {
        color: #00A1B2;
        cursor: pointer;
      }
      .iconcopy {

        margin-left: 4px;
        color: #00A1B2;
        &:hover {
          color: #4FD5E0;
        }
      }
    }
    .detailTitle {
      color: #898989;
      margin-top: 22px;
    }
  }
  .form {
    padding: 15px;
    margin-top: 22px;
    background: #fff;
    .table-title {
      font-size:20px;
      font-family:SourceHanSansSC-Medium,SourceHanSansSC;
      font-weight:500;
      color:rgba(69,70,70,1);
    }
  }
  .appdetail_right {
    background: rgba(255, 255, 255, 1);
    flex: 1;
    margin-left: 14px;
    margin-right: 0 !important;
    height: 413px;
  }
  .detail_box {
    margin: 30px;
    margin-bottom: 0px;
  }
  .appdetail_left {
    background: rgba(255, 255, 255, 1);
    flex: 1;
    // margin-right: 14px;
    width: 50%;
    flex-shrink: 0;
    .btn {
      margin-right: 32px;
    }
    .detail-title {
      padding-left: 24px;
      .detail-tit_box {
        margin-left: 7px;
        .title-top {
          display: block;
          font-size:28px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(69,70,70,1);
          line-height:28px;
          padding-bottom: 5px;
        }
        .title-bottom {
          display: block;
          font-size:14px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(69,70,70,1);
          line-height:16px;
        }
      }
    }
    .left-block {
      padding-left: 37px;
      width: 100%;
    }
    .switchBtn {
      margin-top: 30px;
      margin-bottom: 43px;
      position: relative;
      img {
        width: 10px;
        position: absolute;
        top: 47%;
        left: -4px;
      }
      div {
        border-right: 1px solid @theme-gray;
        flex-grow: 1;
      }
    }
    .right-block {
      flex-grow: 1;
      padding-left: 37px;
    }
    .show_right_block {
      width: 30% !important;
    }
    .btn-box {
      margin-top: 30px;
      padding-right: 37px;
      margin-bottom: 43px;
    }
    .btn-other {
      padding-top: 11px !important;
    }
    .dVl-Dc {
      width: 50px;
    }

    .dVl-Fc {
      -ms-flex-basis: 180px;
      -webkit-flex-basis: 180px;
      font-size: 14px;
      position: relative;
      align-self: flex-end;
      .dVl-Xc {

        .dVl-Jc {
          div {
            position: absolute;
            border-radius: 30px;
            background: #fff;
            height: 3px;
            width: 3px;
            z-index: 10;
            &:first-child {
              top: 14px;
              left: 8px;
            }
          }
        }
        .dVl-Jc-2 {
          bottom: 14px;
          left: 8px;
        }
        .dVl-Jc-3 {
          top: 7px;
          right: 8px;
        }
        .dVl-Jc-4 {
          bottom: 7px;
          right: 8px;
        }
        width: 206px;
        height: 63px;
        color: #fff;
        background: @blue-6;
        display: flex;
        align-items: baseline;
        box-sizing: border-box;
        position: relative;
        padding-left: 23px;
        border-radius: 3px;
        &::before {
          position: absolute;
          background: #fff;
          width: 3px;
          height: 63px;
          top: 0px;
          content: '';
          left: 18px;
        }
        &::after {
          position: absolute;
          background: #fff;
          width: 3px;
          height: 63px;
          top: 0px;
          content: '';
          right: 18px;
        }
        .dVl-Mc {
          width: 206px;
          height: 63px;
          color: #fff;
          background: @blue-6;
          display: flex;
          align-items: baseline;
          box-sizing: border-box;
          padding-top: 6px;
          position: relative;
          padding-left: 23px;
          border-radius: 3px;
          .dVl-Yc {
            font-weight: 300;
            font-size: 24px;
            margin-right: 5px;
          }
          .dVl-Wc {
            font-size:24px;
            line-height: 52px;
            font-family:SourceHanSansSC-Medium,SourceHanSansSC;
            font-weight:500;
            color:rgba(255,255,255,1);
          }
        }
      }
      .dVl-Tc {
        display: flex;
        display: -webkit-flex;
        display: -ms-flexbox;
        margin-bottom: 18px;
        position: relative;
        .dVl-Sc {
          flex-basis: 75px;
          -ms-flex-basis: 75px;
          -webkit-flex-basis: 75px;
          white-space: nowrap;
          color: @default-font-color;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          border: 1px solid transparent;
          font-size:14px;
          padding: 2px 3px;
          .dVl-fd {
            font-size: 24px;
          }
          .dVl-ed {
            font-size: 14px;
          }
        }
        .dVl-Gc {
          width: 100px;
          height: 42px;
          padding-bottom: 10px;
          box-sizing: border-box;
          position: relative;
          bottom: -12px;
        }
      }
    }
    .detail-img {
      margin-top: 9px;
      width: 100%;
      height: 28px;
      padding: 0 20px;
      padding-left: 15px;
      font-size:12px;
      font-family:SourceHanSansSC-Regular,SourceHanSansSC;
      font-weight:400;
      color:rgba(137,137,137,1);
      line-height:17px;
      .split {
        margin-left: 12px;
        border: 0.5px solid #E6E6E6;
        flex-grow: 1;
      }
    }
    .dVl-Lc {
      .box-app {
        padding-left: 26px;
        margin-bottom: 33px;
        img {
          width: 102px;
          height: 60px;
          margin-right: 11px;
        }
        .api-text {
          margin-left: 10px;
          .look-detail {
            margin-top: 20px;
            .btn {
              width: 89px;
              height: 32px;
              border: 1px solid #00A1B2;
              border-radius:3px;
              font-size:14px;
              font-family:SourceHanSansSC-Regular,SourceHanSansSC;
              font-weight:400;
              color:rgba(0,161,178,1);
              cursor: pointer;
            }
          }
          .text {
            font-size:14px;
            font-family:SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight:400;
            color:rgba(69,70,70,1);
            line-height:20px;
          }
          .text-right {
            font-size:12px;
            font-family:SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight:400;
            color:rgba(137,137,137,1);
            line-height:17px;
          }
        }
      }
      .box {
        max-width: 204px;
        min-width: 180px;
        height: 92px;
        background: @blue-6;
        border-radius:4px;
        padding: 18px 31px;
        margin-bottom: 34px;
        position: relative;
        // &::before {
        //   background-image: url('./../../../../assets/image/traffic.svg');
        //   background-repeat: no-repeat;
        //   background-size: 66px 66px;
        //   content: "";
        //   position: absolute;
        //   width: 66px;
        //   height: 60px;
        //   left: -22px;
        //   bottom: -16px;
        //   opacity: 0.4;
        // }
        &:last-child {
          margin-bottom: 0
        }
        .num {
          font-size:18px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:26px;
        }
        .text {
          font-size:16px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:24px;
        }
      }
    }
  }
  .detailPanel {
    align-items: flex-start;
    .block {
      width: 100%;
      .blockCard {
        background-color: #FFF;
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
              color: rgba(69,70,70,1);
              line-height: 21px;
              margin-bottom: 2px;
            }
            .subtitle {
              font-size: 12px;
              font-weight: 400;
              color: rgba(137,137,137,1);
              line-height: 17px;
              margin-right: 4px;
            }
          }
        }
        .funcs {
          width: 100%;
          height: 75px;
          .imgDiv {
            width: 123px;
            img {
              width: 102px;
              height: 60px;
            }
          }
          .subTitle {
            font-size: 12px;
            font-weight: 400;
            color: rgba(137,137,137,1);
            line-height: 17px;
          }
        }
      }
    }
  }
  .mid-content {
    margin: 22px 30px 22px 30px;
    background-color: #fff;
  }
}
</style>
