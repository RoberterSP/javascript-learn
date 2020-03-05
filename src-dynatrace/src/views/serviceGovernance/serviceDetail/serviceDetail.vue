<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="royalblue"></stepper>
    <div class="detail_box">
      <div class="flex">
        <div class="appdetail_left">
          <div class="flex-between mt20">
            <div class="detail-title flex-start">
              <i class="iconfont iconService icon-title"></i>
              <div class="detail-tit_box">
                <div v-if="!editMode" class="title-top flex-start">
                  <div class="title-content">
                    <span class="ellipsis title-name">{{detailData.name}}</span>
                    <span class="iconfont iconedit pointer" @click="edit" v-permission="'serviceCenter_serviceDetail_edit'"></span>
                  </div>
                </div>
                <div class="nt-input" v-else>
                  <nt-input
                    ref="name"
                    :value="detailData.name"
                    @delete="editMode = false;"
                    @save="save"
                  ></nt-input>
                </div>

                <!-- <el-form v-show="editMode" :model="detailData" :rules="rules" ref="ruleForm" label-position="top">
                  <el-form-item class="mb10" prop="name">
                    <el-input v-model="detailData.name" placeholder="请输入内容"></el-input>
                    <div class="mt10" v-show="editMode">
                      <el-button @click="save('ruleForm')" type="primary">保存</el-button>
                      <el-button @click="cancel">取消</el-button>
                    </div>
                  </el-form-item>
                </el-form> -->
              </div>
            </div>
            <!-- <el-button v-show="!editMode" @click="edit" style="margin-right: 33px;" type="primary">编辑</el-button> -->
          </div>
          <div>
            <div class="detail-img flex-start" @click="isShowDetail=!isShowDetail">
              <span>
                <span class="column-icon iconfont"
                      :class="{'iconarrowdown': !isShowDetail,'iconarrowup': isShowDetail}"></span>
                <span>详情</span>
              </span>
              <span class="split"></span>
            </div>
            <div class="content" v-show="isShowDetail">
              <div class="content-detail flex-start">
                <span class="head-left">服务标识</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.code}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">监听端口</span>
                <span class="flex-start head-right ml8" >
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.port}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">开发语言</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.lang_text}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">服务提供商</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.third_party_text}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">健康检查URL</span>
                <span class="flex-start head-right ml8" v-if="detailData.health_check_url">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.health_check_url}}</span>
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
              <div :class="{show_right_block: blockSwitch}" class="left-block mt20">
                <h3>基本信息</h3>
                <div v-show="!blockSwitch" class="flex-center btn-box">
                  <div class="dVl-Lc">
                    <div @click="resourceDetail(0)" class="box node width-hover">
                      <div class="num">{{baseInfo.node || 0}}</div>
                      <div class="text">节点</div>
                    </div>
                    <div @click="resourceDetail(1)" class="box appliance width-hover">
                      <div class="num">{{baseInfo.deploy || 0}}</div>
                      <div class="text">部署组</div>
                    </div>
                  </div>
                  <div class="dVl-Dc">
                    <img src="@/assets/image/icon-step-detail.svg" alt="" class="rotate180">
                  </div>
                  <div style="height: 140px;" class="dVl-Fc" @click="switchBlock">
                    <div class="dVl-Xc dVl-Xc-hover">
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
                    <div @click="resourceDetail(2)" class="box endpoint width-hover">
                      <div class="num">{{baseInfo.api || 0}}</div>
                      <div class="text">服务接口</div>
                    </div>
                    <div @click="resourceDetail(3)" class="box bookevent width-hover">
                      <div class="num">{{baseInfo.record || 0}}</div>
                      <div class="text">订阅事件</div>
                    </div>
                  </div>
                </div>
                <div class="flex-center cursor_pointer" v-show="blockSwitch" @click="switchBlock">
                  <img class="blank-img" src="@/assets/image/related_data_thumbnail.png" alt="">
                </div>
              </div>
              <div @click="switchBlock" class="switchBtn flex flex-column">
                <div style="margin-bottom: 20px;"></div>
                <img src="~@/assets/image/icon-step.svg" alt="" :class="{rotate180: blockSwitch}">
                <div style="margin-top: 10px;"></div>
              </div>
              <div class="right-block mt20">
                <h3>服务监控</h3>
                <div v-show="blockSwitch" class="flex-center btn-box">
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
                  <div class="dVl-Dc" @click="switchBlock">
                    <img src="@/assets/image/icon-step-detail.svg" alt="" class="rotate180">
                  </div>
                  <div class="dVl-Fc">
                    <div class="dVl-Tc">
                      <div class="dVl-Gc">
                        <X-chart
                          ref="xchart"
                          :option="chartsOption"
                        ></X-chart>
                      </div>
                      <div class="dVl-Sc">
                        <span class="dVl-fd">{{meshInfo.avg_qps}}</span>
                        <span class="dVl-ed">/min</span>
                        <div class="dVl-ed">平均QPS</div>
                      </div>
                    </div>
                    <div class="dVl-Xc dVl-Xc-hover" @click="toMonitorService">
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
                        <span class="dVl-Wc">服务监控</span>
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
                <div class="flex-center cursor_pointer" v-show="!blockSwitch" @click="switchBlock">
                  <img class="blank-img" src="@/assets/image/server_thumbnail.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt10 ml30 mr30 mb30 detailPanel flex-between">
      <div class="block mr20">
        <div v-if="serGo" class="blockCard p15">
          <h2>服务治理</h2>
          <p class="default-label mb20">对服务做精细化管理</p>
          <div class="funcs mb30 flex-start">
            <div class="imgDiv flex-center">
              <img src="@/assets/image/router_rules.svg" alt="">
            </div>
            <div>
              <div class="mb20">
                <span class="default-label">服务路由</span>
                <span class="subTitle">通过设置接口路由规则，可正确匹配流量并规范流量的去向</span>
              </div>
              <el-button @click="goDetail(4)" v-if="isShowEle('routerRules')">查看详情</el-button>
            </div>
          </div>
          <div class="funcs mb30 flex-start">
            <div class="imgDiv flex-center">
              <img src="@/assets/image/authentication.svg" alt="">
            </div>
            <div>
              <div class="mb20">
                <span class="default-label">服务鉴权</span>
                <span class="subTitle">通过设置服务黑白名单鉴权规则，可正确限制服务的访问权限</span>
              </div>
              <el-button @click="goDetail(5)" v-if="isShowEle('authentication')">查看详情</el-button>
            </div>
          </div>
          <div class="funcs mb30 flex-start">
            <div class="imgDiv flex-center">
              <img src="@/assets/image/fault_injection.svg" alt="">
            </div>
            <div>
              <div class="mb20">
                <span class="default-label">故障注入</span>
                <span class="subTitle">通过设置服务故障注入规则，可提前确认上游服务的容错能力</span>
              </div>
              <el-button @click="goDetail(6)" v-if="isShowEle('faultInjection')">查看详情</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="block flex flex-column">
        <div class="blockCard p15">
          <h2>{{alertRulesTotal}} 预警</h2>
          <p style="margin-bottom: 23px;" class="default-label">相应时间内，与服务相关的预警信息</p>
          <div v-for="(rule, index) in alertRules" :key="'rule' + index" class="alertRules">
            <div class="leftImg flex-center">
              <img src="@/assets/image/alert_rules.svg" alt="">
            </div>
            <div class="rightTitle">
              <p class="title">{{rule.name}}</p>
              <!-- todo -->
              <span class="subtitle">告警级别</span>
              <span class="subtitle">{{rule.created_at}}</span>
            </div>
          </div>
          <div @click="getAlertRules" class="fullWidth flex-center cursor_pointer" v-if="completeRules.length > 3">
            <img v-show="!rulesShow" src="@/assets/image/icon-arrow-down.svg" alt="">
            <img v-show="rulesShow" src="@/assets/image/icon-arrow-up.svg" alt="">
          </div>
        </div>
        <div v-if="fcExt" class="blockCard p15 mt22">
          <h2>功能扩展</h2>
          <p class="default-label mb20">对于互道提供的服务，可以管理以下功能</p>
          <div class="funcs mb30 flex-start">
            <div class="imgDiv flex-center">
              <img src="@/assets/image/message_queue.svg" alt="">
            </div>
            <div>
              <div class="mb20">
                <span class="default-label">消息队列</span>
                <span class="subTitle">通过设置消息队列标签以及是否启用消费，可有效控制消息进程消费能力</span>
              </div>
              <el-button @click="goDetail(1)" v-if="isShowEle('messageQueueList')">查看详情</el-button>
            </div>
          </div>
          <div class="funcs mb30 flex-start">
            <div class="imgDiv flex-center">
              <img src="@/assets/image/dead_message.svg" alt="">
            </div>
            <div>
              <div class="mb20">
                <span class="default-label">死信队列</span>
                <span class="subTitle">通过重发死信信息，可使业务逻辑重试</span>
              </div>
              <el-button @click="goDetail(2)" v-if="isShowEle('deadMessageList')">查看详情</el-button>
            </div>
          </div>
          <div class="funcs mb30 flex-start">
            <div class="imgDiv flex-center">
              <img src="@/assets/image/task.svg" alt="">
            </div>
            <div>
              <div class="mb20">
                <span class="default-label">计划任务</span>
                <span class="subTitle">通过设置计划任务规则，可有效管理计划任务实施</span>
              </div>
              <el-button @click="goDetail(3)" v-if="isShowEle('taskList')">查看详情</el-button>
            </div>
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
import ntInput from 'components/base/input.vue'
import {
  ALERT_RULE_LIST_GET,
  MESH_DEPLOY_GROUP_LIST,
  MESH_ENDPOINT_LIST,
  MESH_NODE_LIST,
  MESH_UPDATE,
  NXMC_MESH_INFO_GET,
  SUBSCRIBE_RECORD_GET
} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import '@/directives/currency.js'

export default {
  data () {
    return {
      fcExt: false,
      serGo: false,
      editMode: false,
      blockSwitch: false,
      rulesShow: false,
      completeRules: [],
      meshInfo: {},
      baseInfo: {},
      detailData: {},
      detailDataBk: {},
      resourceTabs: [{title: '节点'}, {title: '部署组'}, {title: '服务接口'}, {title: '订阅事件'}],
      isShowDetail: false,
      totalBtnShow: false,
      activeTab: 0,
      alertRules: [],
      alertRulesTotal: 0,
      stepper: [
        {name: '服务列表', routerTo: 'serviceList'}
      ],
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ]
      },
      timePost: {
        code: 'Last 30 minutes'
      },
      // 光标数据
      chartsOption: {
        chart: {
          type: 'column',
          style: {
            margin: 0,
            padding: 0
          },
          height: 50,
          width: 90
        },
        title: {
          text: ''
        },
        xAxis: {
          visible: false
        },
        legend: {
          enabled: false
        },
        yAxis: {
          visible: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            enableMouseTracking: false
          }
        },
        tooltip: {
          enabled: false
        },
        series: [{
          name: '',
          color: '#4556d7',
          colorByPoint: false,
          data: []
        }]
      }
    }
  },
  computed: {
    isShowEle () {
      return key => {
        return this.$_hasRoute(key)
      }
    }
  },
  methods: {
    save (value) {
      this.mesh_update({
        mesh_id: this.detailData.id,
        name: value,
        info: this.detailData.info
      })
    },
    cancel () {
      this.$refs.ruleForm.resetFields()
      this.editMode = false
      this.detailData = JSON.parse(JSON.stringify(this.detailDataBk))
    },
    edit () {
      this.editMode = true
      this.$nextTick(() => {
        this.$refs.name.focus()
        this.$refs.name.select()
      })
    },
    goDetail (tag) {
      switch (tag) {
        case 1:
          // 消息队列
          this.$router.push({name: 'messageQueueList',
            params: {
              detailData: this.detailData,
              showComponent: {name: '消息队列', code: 'messageQueueList', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 2:
          // 死信列队
          this.$router.push({name: 'deadMessageList',
            params: {
              detailData: this.detailData,
              showComponent: {name: '死信队列', code: 'deadMessageList', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 3:
          // 计划任务
          this.$router.push({name: 'taskList',
            params: {
              detailData: this.detailData,
              showComponent: {name: '计划任务', code: 'taskList', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 4:
          // 服务路由
          this.$router.push({name: 'routerRules',
            params: {
              detailData: this.detailData,
              showComponent: {name: '服务路由', code: 'routerRules', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 5:
          // 服务鉴权
          this.$router.push({name: 'authentication',
            params: {
              detailData: this.detailData,
              showComponent: {name: '服务鉴权', code: 'authentication', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 6:
          // 故障注入
          this.$router.push({name: 'faultInjection',
            params: {
              detailData: this.detailData,
              showComponent: {name: '故障注入', code: 'faultInjection', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        default:
          break
      }
    },
    resourceDetail (activeTab) {
      switch (activeTab) {
        case 0:
          // 节点
          if (!this.$_hasRoute('serviceNode')) {
            return
          }
          this.$router.push({
            name: 'serviceNode',
            params: {
              showComponent: {name: '节点', code: 'serviceNode', serGo: this.serGo, fcExt: this.fcExt, setFirstOpen: true},
              detailData: this.detailData
            }
          })
          break
        case 1:
          // 部署组
          if (!this.$_hasRoute('deploymentGroup')) {
            return
          }
          this.$router.push({
            name: 'deploymentGroup',
            params: {
              showComponent: {name: '部署组', code: 'deploymentGroup', serGo: this.serGo, fcExt: this.fcExt, setFirstOpen: true},
              detailData: this.detailData
            }
          })
          break
        case 2:
          // 服务接口
          if (!this.$_hasRoute('serviceApi')) {
            return
          }
          this.stepper.push(
            {
              name: '服务接口',
              type: 'edit',
              routerTo: 'serviceApi',
              myCoutomRouter: true
            }
          )
          this.$router.push({
            name: 'serviceApi',
            params: {
              showComponent: {name: '服务接口', code: 'serviceApi', serGo: this.serGo, fcExt: this.fcExt, setFirstOpen: true},
              detailData: this.detailData,
              stepper: this.stepper
            }
          })
          break
        case 3:
          // 订阅事件
          if (!this.$_hasRoute('eventSubscribe')) {
            return
          }
          this.$router.push({
            name: 'eventSubscribe',
            params: {
              showComponent: {name: '订阅事件', code: 'eventSubscribe', serGo: this.serGo, fcExt: this.fcExt, setFirstOpen: true},
              detailData: this.detailData
            }
          })
          break
        default:
          break
      }
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
    tabsClick (item, index) {
      this.activeTab = index
    },
    switchBlock (tag) {
      if (tag === true) {
        this.blockSwitch = tag
      } else {
        this.blockSwitch = !this.blockSwitch
      }
      if (this.blockSwitch) {
        let data = {
          mesh_id: this.detailData.id,
          monitor_flag: true
        }
        if (this.timePost.code) {
          data.time_range = this.timePost.code
        } else {
          data.start_time = this.timePost.start_time
          data.end_time = this.timePost.end_time
        }
        this.mesh_info_get(data)
      } else {
        this.mesh_info_get({mesh_id: this.detailData.id})
      }
    },
    // 页面加载 初始化数据
    initPageData () {
      this.stepper.push({name: this.detailData.name})
      this.mesh_info_get({mesh_id: this.detailData.id})
      this.mesh_node_list({page: 1, page_size: 3, mesh_code: this.detailData.code})
      this.mesh_deploy_group_list({page: 1, page_size: 3, mesh_code: this.detailData.code})
      this.get_mesh_endpoint_list({page: 1, page_size: 3, mesh_code: this.detailData.code})
      this.alert_rule_list_get({page: 1, page_size: PAGESIZE, mesh_code: this.detailData.code})
      this.subscribe_record_get({page: 1, page_size: 3, category: 'inner', service_code: this.detailData.code})
    },
    mesh_node_list (data) {
      MESH_NODE_LIST(data).then(res => {
        this.$set(this.baseInfo, 'node', res.data.total)
      })
    },
    mesh_info_get (data) {
      NXMC_MESH_INFO_GET(data).then(res => {
        this.meshInfo = res.data.mesh_info
        if (data.monitor_flag) {
          this.chartsOption.series[0].data = res.data.mesh_info.avg_qps_overview.series[0].data
          if (this.chartsOption.series[0].data.length > 10) {
            this.chartsOption.series[0].data = this.chartsOption.series[0].data.slice(this.chartsOption.series[0].data.length - 10, this.chartsOption.series[0].data.length)
          }
          this.$refs['xchart'].drawChart(this.chartsOption)
        }
        this.$forceUpdate()
      })
    },
    mesh_deploy_group_list (data) {
      MESH_DEPLOY_GROUP_LIST(data).then(res => {
        this.$set(this.baseInfo, 'deploy', res.data.total)
      })
    },
    get_mesh_endpoint_list (data) {
      MESH_ENDPOINT_LIST(data).then(res => {
        this.$set(this.baseInfo, 'api', res.data.total)
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
    mesh_update (data) {
      MESH_UPDATE(data).then(res => {
        // this.$message('更新成功')
        bus.$emit('openMessage', {
          message: '更新成功！',
          type: 'success'
        })
        this.detailData.name = data.name
        this.$set(this.stepper[1], 'name', data.name)
        this.detailDataBk = JSON.parse(JSON.stringify(this.detailData))
        this.editMode = false
      })
    },
    subscribe_record_get (data) {
      SUBSCRIBE_RECORD_GET(data).then(res => {
        this.$set(this.baseInfo, 'record', res.data.total)
      })
    },
    toMonitorService () {
      if (!this.$_hasRoute('monitorService')) {
        return
      }
      this.$router.push({name: 'monitorService', params: {detailData: this.detailData}})
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    let that = this
    bus.$on('timeChanged', (data) => {
      that.timePost = data
      if (that.blockSwitch) {
        that.switchBlock(true)
      }
    })
    bus.$emit('resetTime')
    console.log('this.$route.params', this.$route.params)
    if (this.$route.params && this.$route.params.id) {
      this.detailData = this.$route.params
      this.detailDataBk = JSON.parse(JSON.stringify(this.$route.params))

      if (this.detailData.standard && this.detailData.code !== 'nxgw') this.fcExt = true
      if (this.detailData.standard || (!this.detailData.standard && !this.detailData.component)) this.serGo = true

      this.initPageData()
    } else {
      this.$router.push({name: 'serviceList'})
    }
  },
  created () {
  },
  components: {
    stepper,
    splitTitle,
    XChart,
    ntTable,
    ntInput,
    ntTabs
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";
.nt-input {
  width: 400px;
}
.iconedit {
  color: #00A1B2 !important;
  font-size: 24px;
}
  .wrapper {
    padding-bottom: 33px;

    .column-icon {
      color: #00A1B2;
    }

    .content {
      padding-top: 23px;
      padding-left: 27px;
      font-size: 12px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: rgba(69, 70, 70, 1);

      .content-detail {
        width: 470px;

        .head-left {
          line-height: 25px;
          font-size: 12px;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: rgba(69, 70, 70, 1);
          white-space: nowrap;
        }

        .head-right {
          font-size: 12px;
          font-family: SourceHanSansSC-Regular, SourceHanSansSC;
          font-weight: 400;
          color: rgba(69, 70, 70, 1);
          line-height: 12px;
          width: 100%;
          .head-right-text {
            white-space: nowrap
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
        font-size: 20px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: rgba(69, 70, 70, 1);
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
        width: 100%;
        padding: 0 20px;

        .detail-tit_box {
          width: 100%;
          margin-left: 7px;

          .title-top {
            font-size: 28px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: rgba(69, 70, 70, 1);
            line-height: 28px;
            padding-bottom: 5px;
          }

          .title-content {
            flex: 1;
            width: 0;
            display: flex;
            align-items: center;
          }

          .title-name {
            display: inline-block;
          }

          .title-bottom {
            display: block;
            font-size: 14px;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: rgba(69, 70, 70, 1);
            line-height: 16px;
          }
        }
      }

      .left-block {
        padding-left: 37px;
        width: calc(100% - 300px);
        transition: all 0.2s;
        -moz-transition: all 0.2s;
        -webkit-transition: all 0.2s;
        -o-transition: all 0.2s;

        .blank-img {
          width: 200px;
          margin-top: 40px;
        }
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

        .blank-img {
          width: 160px;
          margin-top: 80px;
        }
      }

      .show_right_block {
        width: 300px !important;
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
        .dVl-Xc-hover {
          &:hover {
            background-color: @royalblue-10;

            .dVl-Mc {
              background-color: @royalblue-10;
            }
          }
        }
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
          background: @royalblue-8;
          display: flex;
          align-items: baseline;
          cursor: pointer;
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
            background: @royalblue-8;
            display: flex;
            align-items: baseline;
            cursor: pointer;
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
              font-size: 24px;
              line-height: 52px;
              font-family: SourceHanSansSC-Medium, SourceHanSansSC;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
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
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            border: 1px solid transparent;
            font-size: 14px;
            padding: 2px 3px;
            cursor: pointer;

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
        font-size: 12px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: rgba(137, 137, 137, 1);
        line-height: 17px;

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
                border-radius: 3px;
                font-size: 14px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: rgba(0, 161, 178, 1);
                cursor: pointer;
              }
            }

            .text {
              font-size: 14px;
              font-family: SourceHanSansSC-Regular, SourceHanSansSC;
              font-weight: 400;
              color: rgba(69, 70, 70, 1);
              line-height: 20px;
            }

            .text-right {
              font-size: 12px;
              font-family: SourceHanSansSC-Regular, SourceHanSansSC;
              font-weight: 400;
              color: rgba(137, 137, 137, 1);
              line-height: 17px;
            }
          }
        }

        .box {
          max-width: 204px;
          min-width: 180px;
          height: 92px;
          background: @royalblue-8;
          border-radius: 4px;
          padding: 18px 31px;
          margin-bottom: 34px;
          position: relative;
          // &::before {
          //   background-image: url('./../../../assets/image/icon-application.svg');
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

          &.width-hover {
            cursor: pointer;

            &:hover {
              background: @royalblue-10;
            }
          }

          &:last-child {
            margin-bottom: 0
          }

          .num {
            font-size: 18px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 26px;
          }

          .text {
            font-size: 16px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 24px;
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
              // img {
              //   width: 100%;
              //   height: 100%;
              // }
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

          .funcs {
            width: 100%;
            height: 75px;

            .imgDiv {
              width: 123px;

              img {
                width: 132px;
                height: 60px;
              }
            }

            .subTitle {
              font-size: 12px;
              font-weight: 400;
              color: rgba(137, 137, 137, 1);
              line-height: 17px;
            }
          }
        }
      }
    }
  }
</style>
