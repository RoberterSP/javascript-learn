<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="royalblue"></stepper>

    <div class="p20">
      <div class="flex">
        <DYCard class="appdetail_left margin-card">
          <DYHeader
            no-gap
            icon="Service"
            :edit-icon="true"
            edit-permission="serviceCenter_serviceDetail_edit"
            :title="detailData.name"
            @save="save"
          ></DYHeader>

          <div>
            <DYSplitTitle
              type="detail"
              title="详情"
              iconClickEnable
              :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
              @onIconClick="isShowDetail = !isShowDetail"
            ></DYSplitTitle>

            <transition name="rollup">
              <div class="content" v-if="isShowDetail">
                <DYKeyValue
                  v-for="item of keyValueList"
                  :key="`key-value-${item.value}`"
                  :text="item.text"
                  :value="detailData[item.value]"
                />
              </div>
            </transition>

            <div style="overflow: auto" class="flex">
              <div :class="{show_right_block: blockSwitch}" class="left-block mt20">
                <h3>基本信息</h3>

                <DYIndexBox v-if="!blockSwitch" theme="royalblue" :cards="boxCards"/>

                <div class="flex-center cursor-pointer" v-show="blockSwitch" @click="switchBlock">
                  <img class="blank-img" src="@/assets/image/related_data_thumbnail.png" alt="">
                </div>
              </div>

              <div @click="switchBlock" class="switchBtn flex flex-column cursor-pointer">
                <div style="margin-bottom: 20px;"></div>
                <DYIcon type="right" size="30" :class="{rotate180: blockSwitch}"></DYIcon>
                <div style="margin-top: 10px;"></div>
              </div>

              <div class="right-block mt20">
                <h3>服务监控</h3>

                <DYIndexBox v-if="blockSwitch" theme="royalblue" :mini-chart-data="miniChartData" chart-id="rightChart"
                            :cards="boxCardsRight"/>

                <div class="flex-center cursor-pointer" v-show="!blockSwitch" @click="switchBlock">
                  <img class="blank-img" src="@/assets/image/server_thumbnail.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </DYCard>
      </div>

      <div class="flex">
        <div class="detailPanel flex-between">

          <div class="blockCard half-width">
            <DYCard class="margin-card" v-if="serGo">
              <DYHeader class="mb20" title="服务治理" sub-title="对服务做精细化管理" type="small" no-gap/>

              <DYList
                class="mb30"
                mainTitle="服务路由"
                subTitle="通过设置接口路由规则，可正确匹配流量并规范流量的去向">
                <template slot="img">
                  <img src="~@/assets/image/router_rules.svg" alt="">
                </template>
                <template slot="btn">
                  <DYButton @click="goDetail(4)" slot="btn"
                            v-if="isShowEle('routerRules')">查看详情
                  </DYButton>
                </template>
              </DYList>

              <DYList
                class="mb30"
                mainTitle="服务鉴权"
                subTitle="通过设置服务黑白名单鉴权规则，可正确限制服务的访问权限">
                <template slot="img">
                  <img src="~@/assets/image/authentication.svg" alt="">
                </template>
                <template slot="btn">
                  <DYButton @click="goDetail(5)" slot="btn"
                            v-if="isShowEle('authentication')">查看详情
                  </DYButton>
                </template>
              </DYList>

              <DYList
                class="mb30"
                mainTitle="故障注入"
                subTitle="通过设置服务故障注入规则，可提前确认上游服务的容错能力">
                <template slot="img">
                  <img src="~@/assets/image/fault_injection.svg" alt="">
                </template>
                <template slot="btn">
                  <DYButton @click="goDetail(6)" slot="btn"
                            v-if="isShowEle('faultInjection')">查看详情
                  </DYButton>
                </template>
              </DYList>
            </DYCard>
          </div>

          <div class="block flex flex-column">
            <DYCard class="margin-card blockCard">
              <DYHeader :title="`${alertRulesTotal} 预警`" sub-title="相应时间内，与服务相关的预警信息"
                        type="small" no-gap/>

              <div v-for="(rule, index) in alertRules" :key="'rule' + index" class="alertRules mb10">
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
              <div @click="getAlertRules" class="full-width flex-center cursor-pointer" v-if="completeRules.length > 3">
                <img v-show="!rulesShow" src="@/assets/image/icon-arrow-down.svg" alt="">
                <img v-show="rulesShow" src="@/assets/image/icon-arrow-up.svg" alt="">
              </div>
            </DYCard>

            <DYCard v-if="fcExt" class="blockCard margin-card">
              <DYHeader class="mb20" title="功能扩展" sub-title="对于互道提供的服务，可以管理以下功能" type="small" no-gap/>
              <DYList
                class="mb30"
                mainTitle="消息队列"
                subTitle="通过设置消息队列标签以及是否启用消费，可有效控制消息进程消费能力">
                <template slot="img">
                  <img src="~@/assets/image/message_queue.svg" alt="">
                </template>
                <template slot="btn">
                  <DYButton @click="goDetail(1)" slot="btn"
                            v-if="isShowEle('messageQueueList')">查看详情
                  </DYButton>
                </template>
              </DYList>

              <DYList
                class="mb30"
                mainTitle="死信队列"
                subTitle="通过重发死信信息，可使业务逻辑重试">
                <template slot="img">
                  <img src="~@/assets/image/dead_message.svg" alt="">
                </template>
                <template slot="btn">
                  <DYButton @click="goDetail(2)" slot="btn"
                            v-if="isShowEle('deadMessageList')">查看详情
                  </DYButton>
                </template>
              </DYList>

              <DYList
                class="mb30"
                mainTitle="计划任务"
                subTitle="通过设置计划任务规则，可有效管理计划任务实施">
                <template slot="img">
                  <img src="~@/assets/image/task.svg" alt="">
                </template>
                <template slot="btn">
                  <DYButton @click="goDetail(3)" slot="btn"
                            v-if="isShowEle('taskList')">查看详情
                  </DYButton>
                </template>
              </DYList>
            </DYCard>
          </div>
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
import ntInput from 'components/base/input.vue'
import {ALERT_RULE_LIST_GET, MESH_UPDATE, NXMC_MESH_MONITOR_INFO_GET} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import '@/directives/currency.js'

export default {
  data () {
    return {
      fcExt: false,
      serGo: false,
      blockSwitch: false,
      rulesShow: false,
      completeRules: [],
      meshInfo: {},
      baseInfo: {},
      detailData: {},
      detailDataBk: {},
      resourceTabs: [{title: '节点'}, {title: '部署组'}, {title: '服务接口'}, {title: '事件订阅'}],
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
      miniChartData: [],

      // keyValue
      keyValueList: [
        {
          value: 'code',
          text: '服务标识'
        }, {
          value: 'port',
          text: '监听端口'
        }, {
          value: 'lang_text',
          text: '开发语言'
        }, {
          value: 'third_party_text',
          text: '服务提供商'
        }, {
          value: 'health_check_url',
          text: '健康检查URL'
        }, {
          value: 'status',
          text: '状态'
        }
      ]
    }
  },
  computed: {
    isShowEle () {
      return key => this.$_hasRoute(key)
    },
    boxCards () {
      return {
        leftTop: {
          value: this.baseInfo.node || 0,
          text: '节点',
          backgroundImage: 'node',
          onClick: () => this.resourceDetail(0)
        },
        leftBottom: {
          value: this.baseInfo.deploy || 0,
          text: '部署组',
          backgroundImage: 'appliance',
          onClick: () => this.resourceDetail(1)
        },
        center: {
          noText: true,
          label: '基本信息',
          onClick: () => this.switchBlock()
        },
        rightTop: {
          value: this.baseInfo.api || 0,
          text: '服务接口',
          backgroundImage: 'endpoint',
          onClick: () => this.resourceDetail(2)
        },
        rightBottom: {
          value: this.baseInfo.record || 0,
          text: '事件订阅',
          backgroundImage: 'bookevent',
          onClick: () => this.resourceDetail(3)
        }
      }
    },

    boxCardsRight () {
      return {
        leftTop: {
          value: this.meshInfo.health_index,
          text: '健康指数',
          backgroundImage: 'health_index'
        },
        leftBottom: {
          value: this.meshInfo.total_request_num,
          text: '访问量',
          backgroundImage: 'request_num'
        },
        center: {
          value: this.meshInfo.avg_qps,
          unit: '/min',
          text: '平均QPS',
          label: '服务监控',
          onClick: () => this.toMonitorService()
        },
        rightTop: {
          value: this.meshInfo.avg_response_time,
          filter: 'currency',
          filterParams: ['ms'],
          text: '平均响应时间',
          backgroundImage: 'avg_response_time'
        },
        rightBottom: {
          value: this.meshInfo.total_traffic,
          filter: 'filterTraffic',
          text: '流量',
          backgroundImage: 'traffic'
        }
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
    goDetail (tag) {
      switch (tag) {
        case 1:
          // 消息队列
          this.$router.push({
            name: 'messageQueueList',
            params: {
              detailData: this.detailData,
              showComponent: {name: '消息队列', code: 'messageQueueList', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 2:
          // 死信列队
          this.$router.push({
            name: 'deadMessageList',
            params: {
              detailData: this.detailData,
              showComponent: {name: '死信队列', code: 'deadMessageList', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 3:
          // 计划任务
          this.$router.push({
            name: 'taskList',
            params: {
              detailData: this.detailData,
              showComponent: {name: '计划任务', code: 'taskList', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 4:
          // 服务路由
          this.$router.push({
            name: 'routerRules',
            params: {
              detailData: this.detailData,
              showComponent: {name: '服务路由', code: 'routerRules', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 5:
          // 服务鉴权
          this.$router.push({
            name: 'authentication',
            params: {
              detailData: this.detailData,
              showComponent: {name: '服务鉴权', code: 'authentication', serGo: this.serGo, fcExt: this.fcExt}
            }
          })
          break
        case 6:
          // 故障注入
          this.$router.push({
            name: 'faultInjection',
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
              showComponent: {
                name: '节点',
                code: 'serviceNode',
                serGo: this.serGo,
                fcExt: this.fcExt,
                setFirstOpen: true
              },
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
              showComponent: {
                name: '部署组',
                code: 'deploymentGroup',
                serGo: this.serGo,
                fcExt: this.fcExt,
                setFirstOpen: true
              },
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
              myCustomRouter: true
            }
          )
          this.$router.push({
            name: 'serviceApi',
            params: {
              showComponent: {
                name: '服务接口',
                code: 'serviceApi',
                serGo: this.serGo,
                fcExt: this.fcExt,
                setFirstOpen: true
              },
              detailData: this.detailData,
              stepper: this.stepper
            }
          })
          break
        case 3:
          // 事件订阅
          if (!this.$_hasRoute('eventSubscribe')) {
            return
          }
          this.$router.push({
            name: 'eventSubscribe',
            params: {
              showComponent: {
                name: '事件订阅',
                code: 'eventSubscribe',
                serGo: this.serGo,
                fcExt: this.fcExt,
                setFirstOpen: true
              },
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
      // this.mesh_node_list({page: 1, page_size: 3, mesh_code: this.detailData.code})
      // this.mesh_deploy_group_list({page: 1, page_size: 3, mesh_code: this.detailData.code})
      // this.get_mesh_endpoint_list({page: 1, page_size: 3, mesh_code: this.detailData.code})
      this.alert_rule_list_get({page: 1, page_size: PAGESIZE, mesh_code: this.detailData.code})
      // this.subscribe_record_get({page: 1, page_size: 3, category: 'inner', service_code: this.detailData.code})
    },
    // mesh_node_list (data) {
    //   MESH_NODE_LIST(data).then(res => {
    //     this.$set(this.baseInfo, 'node', res.data.total)
    //   })
    // },
    mesh_info_get (data) {
      NXMC_MESH_MONITOR_INFO_GET(data).then(res => {
        this.meshInfo = res.data.mesh_info
        if (data.monitor_flag) {
          this.miniChartData = res.data.mesh_info.avg_qps_overview.series[0].data
          if (this.miniChartData.length > 10) {
            this.miniChartData = this.miniChartData.slice(this.miniChartData.length - 10, this.miniChartData.length)
          }
        } else {
          this.$set(this.baseInfo, 'node', this.meshInfo.total_node_num)
          this.$set(this.baseInfo, 'api', this.meshInfo.total_endpoint_num)
          this.$set(this.baseInfo, 'deploy', this.meshInfo.total_group_num)
          this.$set(this.baseInfo, 'record', this.meshInfo.total_event_num)
        }
        this.$forceUpdate()
      })
    },
    // mesh_deploy_group_list (data) {
    //   MESH_DEPLOY_GROUP_LIST(data).then(res => {
    //     this.$set(this.baseInfo, 'deploy', res.data.total)
    //   })
    // },
    // get_mesh_endpoint_list (data) {
    //   MESH_ENDPOINT_LIST(data).then(res => {
    //     this.$set(this.baseInfo, 'api', res.data.total)
    //   })
    // },
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
          message: res.data.result,
          type: 'success'
        })
        this.detailData.name = data.name
        this.$set(this.stepper[1], 'name', data.name)
        this.detailDataBk = JSON.parse(JSON.stringify(this.detailData))
        // this.editMode = false
      })
    },
    // subscribe_record_get (data) {
    //   SUBSCRIBE_RECORD_GET(data).then(res => {
    //     this.$set(this.baseInfo, 'record', res.data.total)
    //   })
    // },
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
    XChart,
    DYIndexBox,
    ntTable,
    ntInput
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .block {
    flex: 1;
  }

  .wrapper {
    padding-bottom: 33px;

    .content {
      padding-top: 24px;
      padding-left: 12px;
      width: 470px;
    }

    .appdetail_left {
      flex: 1;

      .left-block {
        padding-left: 37px;
        width: calc(100% - 300px);
        transition: all 0.2s;

        .blank-img {
          width: 200px;
          margin-top: 40px;
        }
      }

      .switchBtn {
        margin-top: 30px;
        margin-bottom: 43px;
        position: relative;
        align-items: center;

        .icon {
          color: @gray-03
        }

        div {
          border-right: @default-border-width solid @gray-03;
          flex-grow: 1;
        }

        &:hover {
          div {
            border-color: @turq-07
          }
          .icon {
            color: @turq-07
          }
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
    }

    .detailPanel {
      align-items: flex-start;
      width: 100%;

      .block {
          .alertRules {
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
