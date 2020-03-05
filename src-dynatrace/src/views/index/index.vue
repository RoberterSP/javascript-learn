<template>
  <div class="index_main">
    <stepper :stepper="[]"></stepper>
    <div class="dCj-a" data-cache="content" data-page-content="canvas" >
      <div class="dwd-g dj-a dwd-b dwd-t dwd-m dwd-J">
        <div class="dwd-K">
          <div class="dwd-A">
            <div class="dab-e">
              <div class="dab-h dab-g" title="数据看板">数据看板</div>
            </div>
          </div>
        </div>
        <div class="dwd-w grid-viewport" :class="[isEdit?'grid-edit':'']">
          <div class="grid-dashboard">
            <!--  内容 start-->
            <div class="grid-dashboard-column" v-for="(parItem, parKey, parIndex) in viewColumnList" :key="parIndex" :style="{'left': parIndex*342+'px'}">
              <div class="grid-tile grid-capturePointerEvents dwd-o">
                <div class="grid-tileMenu"></div>
                <div class="grid-tileContent">
                  <div class="dN-p dC-qb dN-c dN-b dN-d" data-sizex="2" data-sizey="1">
                    <div class="dC-pb">
                      <div class="dK-a dK-b">
                        <div class="dab-e" >
                          <div class="dab-h dab-g inlineLabelViewText" >{{parItem.title}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-tile" v-for="(item, key, index) in parItem.viewList" :key="index" :style="{'width': item.sizex*152+'px', 'height': item.sizey*152+'px'}">
                <div class="grid-tileMenu"></div>
                <div class="grid-tileContent">
                  <div class="dN-p dC-qb dN-d" :sizex="item.sizex" :sizey="item.sizey">
                    <div class="dC-pb">
                      <div class="dC-t dmb-b" :class="[item.needAllFine?'':'dlb-c']" :data-layer="dataLayerIndex">
                        <div style="display: flex;flex-direction: column">
                          <div class="dC-G dmb-c">
                            <span class="dC-sb dmb-e gwt-title" >{{item.title}}</span>
                          </div>
                          <!-- 中间图表 -->
                          <!-- 中间图表 -->
                          <!-- 服务治理 start -->
                          <div class="dC-s" v-if="key==='service_governance'">
                            <div class="dhb-h">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                            <div class="dhb-b">
                              <div class="dC-j dhb-d">
                                <div  class="dhb-e dC-db dC-T">
                                  <span class="dC-b" ></span>
                                  <span class="dC-fb" >{{item.list[dataLayerIndex-1].num}}</span>
                                </div>
                                <!-- <div class="dhb-j dC-ob dC-x">Type something</div> -->
                                <div class="flex-start">
                                  <div class="dhb-g dC-ob dC-e dhb-a">
                                    <i class="iconfont" style="line-height: 16px;margin-right: 2px;"
                                       :class="[`icon${item.list[dataLayerIndex-1].icon}`]"></i>
                                    {{item.list[dataLayerIndex-1].name}}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- 服务治理 end -->
                          <!-- 蜂窝 start -->
                          <div class="dC-s dbb-c" v-if="item.viewType==='hexbin'">
                            <div style="width: 100%; height: 100%; padding: 0px; margin: 0px;">
                              <d3-hexbin :ref="'hexbin_chart_'+parItem.columnIndex+''+item.sequence" :hexbinData="item" :canvasId="'hexbin_chart_'+parItem.columnIndex+''+item.sequence"></d3-hexbin>
                            </div>
                          </div>
                          <!-- 蜂窝 start -->
                          <!-- 单纯数字展示 start -->
                          <div class="dC-s dbb-c" v-if="key==='interface'||key==='application'||key==='warning'||key==='event'">
                            <div style="width: 100%; height: 100%; padding: 0px; margin: 0px;">
                              <div style="width: 100%; height: 100%;">
                                <!-- <div class="dbb-a">
                                  <div class="-dbb-b dbb-d" >
                                    <canvas></canvas>
                                  </div>
                                </div> -->
                                <div class="flex-start groups" v-if="item.type==='Interface'">
                                  <div class="group flex-start">
                                    <div><img src="~@/assets/image/board_icon_innerface.svg" title="" />接口数</div>
                                    <span>{{item.total_endpoint_num}}</span>
                                  </div>
                                  <div class="group flex-start">
                                    <div><img src="~@/assets/image/board_icon_innerface.svg" title="" />已发布</div>
                                    <span>{{item.total_deployed_endpoint_num}}</span>
                                  </div>
                                </div>
                                <div class="dC-j dC-db dC-e dC-T" v-else>
                                  <span v-if="item.normal_num||item.normal_num===0">{{item.normal_num}}</span>
                                  <span class="dC-b red" v-if="item.error_num||item.error_num===0" >{{item.error_num}}</span>
                                  <span class="dC-fb" v-if="item.total_num||item.total_num===0">/{{item.total_num}}</span>
                                </div>
                                <span class="dlb-b dC-ob dC-i dC-e" v-if="item.total_num!=0&&item.normal_num===item.total_num">All fine</span>
                              </div>
                            </div>
                          </div>
                          <!-- 单纯数字展示 end -->
                          <!-- 健康linechart start -->
                          <area-line-chart :ref="'area_line_chart_'+parItem.columnIndex+''+item.sequence" v-if="item.viewType==='healthLineChart'" :chartId="'area_line_chart_'+parItem.columnIndex+''+item.sequence" :comData="item" style="margin-top:12px;"></area-line-chart>
                          <!-- 健康linechart end -->
                          <!-- 访问请求seriesViewBoard start -->
                          <series-view-board :comData="item" v-if="item.viewType==='seriesViewBoard'"></series-view-board>
                          <!-- 访问请求seriesViewBoard end -->
                          <!-- 应用tab start -->
                          <div class="applicationTab" v-if="item.viewType==='applicationTab'">
                            <div class="sf_view_tab" v-if="item.tabList && item.tabList.length">
                              <div class="tab_item" v-for="(tabitem, index) in item.tabList" :key="index" :class="[item.applicationTabIndex===index?'active': '']"
                              @click="ApplicationTtabClick(tabitem, index)">
                                {{tabitem.name}}
                              </div>
                            </div>
                            <area-line-chart :ref="'area_line_chart_'+parItem.columnIndex+''+item.sequence" :chartId="'area_line_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></area-line-chart>
                          </div>
                          <!-- 应用tab end -->
                          <!-- 圆环图 start -->
                          <div class="dC-s dbb-c" v-if="item.viewType==='pieChart'" style="margin-bottom: -12px;">
                            <pie-chart :ref="'pie_chart_'+parItem.columnIndex+''+item.sequence" :chartId="'pie_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></pie-chart>
                          </div>
                          <!-- 圆环图 end -->
                          <!-- 服务热力图 start -->
                          <div class="dC-s dbb-c" v-if="item.viewType==='serviceHeatMap'" style="margin-bottom: -12px;height: 100%">
                            <treemap-chart :ref="'treemap_chart_'+parItem.columnIndex+''+item.sequence" :chartId="'treemap_chart_'+parItem.columnIndex+''+item.sequence" :comData="item" style="margin-top:18px;"></treemap-chart>
                            <div class="dC-G dmb-c" style="margin-top:24px;">
                              <span class="dC-sb dmb-e gwt-title">服务排名</span>
                            </div>
                            <bar-stack-chart :ref="'bar_stack_chart_'+parItem.columnIndex+''+item.sequence" style="margin-top:4px;" :chartId="'bar_stack_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></bar-stack-chart>
                          </div>
                          <!-- 服务热力图 end -->
                          <!-- 调用概览 start -->
                          <div class="dC-s dbb-c" v-if="item.viewType==='overviewInvocation'" style="margin-bottom: -12px;height: 100%">
                            <line-column-chart :ref="'line_column_chart_'+parItem.columnIndex+''+item.sequence" style="margin-top:18px;" :chartId="'line_column_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></line-column-chart>
                            <div class="dC-G dmb-c">
                              <span class="dC-sb dmb-e gwt-title">接口调用量</span>
                            </div>
                            <bar-stack-chart :ref="'bar_stack_chart_'+parItem.columnIndex+''+item.sequence" style="margin-top:2px;" :chartId="'bar_stack_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></bar-stack-chart>
                          </div>
                          <!-- 调用概览 end -->
                          <!-- 慢调用，错误率 start -->
                          <div class="dC-s dbb-c" v-if="item.viewType==='barChart'" style="margin-bottom: -12px;height: 100%">
                            <!-- <bar-chart :ref="'bar_chart_'+parItem.columnIndex+''+item.sequence" style="margin-top:18px;" :chartId="'bar_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></bar-chart> -->
                            <bar-stack-chart :ref="'bar_stack_chart_'+parItem.columnIndex+''+item.sequence" style="margin-top:18px;" :chartId="'bar_stack_chart_'+parItem.columnIndex+''+item.sequence" :comData="item"></bar-stack-chart>
                          </div>
                          <!-- 慢调用，错误率 end -->
                        </div>
                      </div>
                    </div>
                    <!-- 点击跳转 透明遮盖   start -->
                    <a class="dN-e" href="#" :class="[item.viewType==='applicationTab'?'tabView':'']" v-if="key!=='slow_call'&&key!=='error_rate'&&key!=='call_overview'&&key!=='service_heat_map'"></a>
                    <!-- 点击跳转 透明遮盖  end -->
                    <!-- 加载时的loading  start -->
                    <div class="dN-j gwt-tileLoader" v-show="item.showLoading">
                      <div class="dzs-c">
                        <div class="dpl-c">
                          <div class="dpl-b">
                            <div class="dpl-a"></div>
                          </div>
                          <div class="dpl-b">
                            <div class="dpl-a"></div>
                          </div>
                        </div>
                      </div>
                      <span class="dzs-d"></span>
                    </div>
                    <!-- 加载时的loading  end -->
                    <!-- 空icon占位 start -->
                    <div class="dN-n" :class="{'isHexbin': item.viewType === 'hexbin'}" v-if="item.showEmpty && !item.showLoading">
                      <img class="dN-h" :src="item.emptyIconSrc" v-if="item.emptyIconSrc" />
                      <div class="dN-k" v-if="item.emptyIconSrc && item.viewType!=='hexbin'">暂无数据</div>
                      <div class="dN-l" v-if="item.emptyBgSrc">
                        <img :src="item.emptyBgSrc" alt="" />
                      </div>
                    </div>
                    <!-- 空icon占位  end -->
                  </div>
                </div>
              </div>
            </div>
            <!--  内容 end   -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import HighCharts from 'highcharts'
import $ from '@/common/util/resource/jquery-1.8.3.min'
import './index.less'
import d3Hexbin from 'components/d3hexbin/d3hexbin.vue'
import areaLineChart from '@/components/miniChart/areaLineChart/areaLineChart.vue'
import seriesViewBoard from '@/components/seriesViewBoard/seriesViewBoard.vue'
import pieChart from '@/components/miniChart/pieChart/pieChart.vue'
import treemapChart from '@/components/miniChart/treemapChart/treemapChart.vue'
import barStackChart from '@/components/miniChart/barStackChart/barStackChart.vue'
import lineColumnChart from '@/components/miniChart/lineColumnChart/lineColumnChart.vue'
import barChart from '@/components/miniChart/barChart/barChart.vue'
import { currencyFunc } from '@/common/util/util'
import bus from '@/assets/eventBus.js'
import {
  NXMC_METRICS_HOME_GET,
  NXMC_METRICS_MESH_GET,
  NXMC_METRICS_HEALTH_INDEX_GET,
  NXMC_METRICS_REQUEST_INDEX_GET,
  NXMC_METRICS_AVG_RES_TIME_GET,
  NXMC_METRICS_REQ_ERROR_RATE_GET,
  NXMC_METRICS_THROUGHPUT_GET,
  NXMC_METRICS_APPS_RANK_GET,
  NXMC_METRICS_SERVICES_HEAT_MAP_GET,
  NXMC_METRICS_SERVICES_RANK_GET,
  NXMC_METRICS_INTERFACES_CALL_OVERVIEW_GET,
  NXMC_METRICS_INTERFACES_CALL_COUNT_GET,
  NXMC_METRICS_INTERFACES_ERROR_RATE_GET,
  NXMC_METRICS_INTERFACES_SLOW_CALL_GET
} from '@/api'
// import { barChartData1, barChartData2, lineColumnChartData } from '@/common/mock/usdeur'
import stepper from 'components/stepper/stepper.vue'
export default {
  data() {
    return {
      // 页面是否编辑状态 后期
      isEdit: false,
      time_range_obj: {code: 'Last 30 minutes'},
      // 页面视图  自定义数据
      viewColumnList: {
        'brief_overview': {
          title: '简要概述',
          columnIndex: 0,
          viewList: {
            'warning': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '预警',
              viewType: '1',
              error_num: 0,
              total_num: 0,
              sequence: 0,
              // 切换数据时展示loading
              showLoading: false
            },
            'interface': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '接口',
              viewType: '1',
              type: 'Interface',
              total_endpoint_num: 0,
              total_deployed_endpoint_num: 0,
              sequence: 1,
              showLoading: false
            },
            'application': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '应用',
              viewType: '1',
              normal_num: 0,
              sequence: 2,
              showLoading: false
            },
            'event': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '事件',
              viewType: '1',
              needAllFine: true,
              normal_num: 0,
              sequence: 3,
              showLoading: false
            },
            'service': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '服务',
              needAllFine: true,
              canvas_width: '100',
              canvas_height: '70',
              viewType: 'hexbin',
              total_num: 0,
              normal_num: 0,
              error_num: 0,
              sequence: 4,
              emptyIconSrc: require('@/assets/image/dashboard/icon_health_placeholder.svg'),
              showLoading: false
            },
            'node': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '节点',
              canvas_width: '100',
              canvas_height: '70',
              viewType: 'hexbin',
              total_num: 0,
              normal_num: 0,
              error_num: 0,
              sequence: 5,
              emptyIconSrc: require('@/assets/image/dashboard/icon_health_placeholder.svg'),
              showLoading: false
            },
            'service_governance': {
              minWidth: 304,
              minHeight: 152,
              sizex: 2,
              sizey: 1,
              title: '服务治理',
              viewType: 'serviceGovernance',
              sequence: 6,
              list: [{
                name: '路由',
                icon: 'route',
                num: 0
              }, {
                name: '部署组',
                icon: 'Appliance',
                num: 0
              }, {
                name: '服务',
                icon: 'Service',
                num: 0
              }, {
                name: '应用',
                icon: 'Application',
                num: 0
              }],
              showLoading: false
            }
          }
        },
        'application_overview': {
          title: '应用概览',
          columnIndex: 1,
          viewList: {
            'health_index': {
              minWidth: 304,
              minHeight: 152,
              sizex: 2,
              sizey: 1,
              sequence: 0,
              title: '健康指数',
              viewType: 'healthLineChart',
              halfChart: true,
              total: 0,
              chartOptions: {
                series: [{data:[]}],
                noYAxis: true
              },
              emptyBgSrc: require('@/assets/image/dashboard/img01.svg'),
              showLoading: false
            },
            'access_request': {
              minWidth: 304,
              minHeight: 152,
              sizex: 2,
              sizey: 1,
              sequence: 1,
              title: '访问请求',
              viewType: 'seriesViewBoard',
              seriesData: [{
                unit: '次',
                value: '0',
                type: 'count',
                name: '访问量'
              }, {
                unit: 'KB',
                value: '0',
                type: 'flow',
                name: '流量'
              }, {
                unit: '次',
                value: '0',
                type: 'count',
                name: 'QPS'
              }],
              showLoading: false
            },
            'application_tab': {
              minWidth: 304,
              minHeight: 304,
              sizex: 2,
              sizey: 2,
              sequence: 2,
              title: '',
              viewType: 'applicationTab',
              tabList: [{
                name: '平均响应时间',
                id: '1',
                seriesColor: 'rgba(88,133,255,1)',
                areaColor: 'rgba(81,107,252,0.5)',
                yAxisFormat: '{value}ms'
              }, {
                name: '错误率',
                id: '2',
                seriesColor: 'rgba(195,150,224,1)',
                areaColor: 'rgba(162,112,196,0.78)',
                yAxisFormat: '{value}%'
              }, {
                name: '吞吐量',
                id: '3',
                seriesColor: 'rgba(20,168,245,1)',
                areaColor: 'rgba(20,168,245,0.5)',
                yAxisFormat: '{value}/s'
              }],
              appList: [],
              applicationTabIndex: 0,
              chartOptions: {
                series: [{data:[]}],
                chartHeight: 120,
              },
              emptyIconSrc: require('@/assets/image/dashboard/icon_db_placeholder.svg'),
              showLoading: false
            }
          }
        },
        'service_overview': {
          title: '服务概览',
          columnIndex: 2,
          viewList: {
            'service_type': {
              minWidth: 304,
              minHeight: 152,
              sizex: 2,
              sizey: 1,
              sequence: 0,
              title: '服务类型',
              viewType: 'seriesViewBoard',
              seriesData: [{
                value: 0,
                name: '非标型'
              }, {
                value: 0,
                name: '业务型'
              }, {
                value: 0,
                name: '组件型'
              }],
              showLoading: false
            },
            'deployment_group': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              sequence: 1,
              title: '部署组',
              viewType: 'pieChart',
              chartOptions: {
                data: [],
                total_num: 0,
                chartHeight: 100
              },
              emptyBgSrc: require('@/assets/image/dashboard/img02.svg'),
              showLoading: false
            },
            'route': {
              minWidth: 152,
              minHeight: 152,
              sizex: 1,
              sizey: 1,
              title: '路由',
              sequence: 2,
              viewType: 'pieChart',
              chartOptions: {
                data: [],
                total_num: 0,
                chartHeight: 100
              },
              emptyBgSrc: require('@/assets/image/dashboard/img03.svg'),
              showLoading: false
            },
            'service_heat_map': {
              minWidth: 304,
              minHeight: 304,
              sizex: 2,
              sizey: 2,
              sequence: 3,
              title: '服务热力图',
              viewType: 'serviceHeatMap',
              chartOptions: {
                data: [],
                chartHeight: 100
              },
              barStackChartOptions: {
                data: [],
                noYAxis: true,
                chartHeight: 84,
                // themeColor: '#5272C9'
              },
              emptyIconSrc: require('@/assets/image/dashboard/icon_db_placeholder.svg'),
              showLoading: false
            }
          }
        },
        'interface_overview': {
          title: '接口概览',
          columnIndex: 3,
          viewList: {
            'call_overview': {
              minWidth: 304,
              minHeight: 304,
              sizex: 2,
              sizey: 2,
              sequence: 0,
              title: '调用概览',
              viewType: 'overviewInvocation',
              lineColumnChartOptions: {
                data: [],
                yAxis1_max: 1,
                chartHeight: 115
              },
              barStackChartOptions: {
                data: [],
                noYAxis: true,
                chartHeight: 80
              },
              emptyIconSrc: require('@/assets/image/dashboard/icon_db_placeholder.svg'),
              showLoading: false
            },
            'slow_call': {
              minWidth: 304,
              minHeight: 152,
              sizex: 2,
              sizey: 1,
              sequence: 1,
              title: '慢调用',
              viewType: 'barChart',
              barStackChartOptions: {
                data: [],
                noYAxis: true,
                chartHeight: 80
              },
              // chartOptions: {
              //   data: [],
              //   noYAxis: true,
              //   themeColor: '#B7C2FC',
              //   chartHeight: 80
              // },
              emptyBgSrc: require('@/assets/image/dashboard/img04.svg'),
              showLoading: false
            },
            'error_rate': {
              minWidth: 304,
              minHeight: 152,
              sizex: 2,
              sizey: 1,
              sequence: 2,
              title: '错误率',
              viewType: 'barChart',
              barStackChartOptions: {
                data: [],
                noYAxis: true,
                chartHeight: 80
              },
              // chartOptions: {
              //   data: [],
              //   noYAxis: true,
              //   themeColor: '#A972CC',
              //   chartHeight: 80
              // },
              emptyBgSrc: require('@/assets/image/dashboard/img01.svg'),
              showLoading: false
            }
          }
        }
      },
      // 服务治理 高亮index
      dataLayerIndex: 4,
      // 服务治理 高亮定时器
      serviceGovernanceTimer: null,
      namespace_code: ''
    }
  },
  computed: {
  },
  destroyed () {
    clearInterval(this.serviceGovernanceTimer)
    this.serviceGovernanceTimer = null
  },
  methods: {
    handleCommonParams () {
      let postParams = {}
      if (this.time_range_obj && this.time_range_obj.code) {
        postParams.time_range = this.time_range_obj.code
      } else {
        postParams.start_time = this.time_range_obj.start_time
        postParams.end_time = this.time_range_obj.end_time
      }
      return postParams
    },
    updateHomeView () {
      // this.$loading()
      Object.keys(this.viewColumnList).forEach(key1 => {
        Object.keys(this.viewColumnList[key1].viewList).forEach(key2 => {
          this.viewColumnList[key1].viewList[key2].showLoading = true
          this.viewColumnList[key1].viewList[key2].showEmpty = false
        })
      })
      // 获取首页指标数据 (简要概览)
      this.getBriefOverviewData()
      // 获取首页服务指标数据 （服务概览 上半部分）
      this.getServicesOverviewData()
      // 剩余
      this.getIndicationChartData()
    },
    // 获取首页指标数据 (简要概览)
    async getBriefOverviewData () {
      let _that = this
      let data = await this.handleCommonParams()
      NXMC_METRICS_HOME_GET(data).then((res) => {
        // console.log('获取首页指标数据', res)
        if (res.code === 0) {
          // 简要概览 -> 预警
          this.viewColumnList['brief_overview'].viewList['warning'].total_num = res.data.total_problem_num
          this.viewColumnList['brief_overview'].viewList['warning'].error_num = res.data.total_wait_handel_problem_num
          this.viewColumnList['brief_overview'].viewList['warning'].showLoading = false
          // 简要概览 -> 接口
          this.viewColumnList['brief_overview'].viewList['interface'].total_endpoint_num = res.data.total_endpoint_num
          this.viewColumnList['brief_overview'].viewList['interface'].total_deployed_endpoint_num = res.data.total_deployed_endpoint_num
          this.viewColumnList['brief_overview'].viewList['interface'].showLoading = false
          // 简要概览 -> 应用
          this.viewColumnList['brief_overview'].viewList['application'].normal_num = res.data.total_app_num
          this.viewColumnList['brief_overview'].viewList['application'].showLoading = false
          // 简要概览 -> 事件
          this.viewColumnList['brief_overview'].viewList['event'].normal_num = res.data.total_event_num
          this.viewColumnList['brief_overview'].viewList['event'].showLoading = false
          // 简要概览 -> 服务
          this.viewColumnList['brief_overview'].viewList['service'].total_num = res.data.total_mesh_num
          this.viewColumnList['brief_overview'].viewList['service'].error_num = res.data.total_error_mesh_num
          this.viewColumnList['brief_overview'].viewList['service'].normal_num = res.data.total_normal_mesh_num
          if (res.data.total_mesh_num) {
            this.$nextTick(() => {
              if (this.$refs['hexbin_chart_'+this.viewColumnList['brief_overview'].columnIndex + '' + this.viewColumnList['brief_overview'].viewList['service'].sequence][0]) {
                this.$refs['hexbin_chart_'+this.viewColumnList['brief_overview'].columnIndex + '' + this.viewColumnList['brief_overview'].viewList['service'].sequence][0].resetDrawView(this.viewColumnList['brief_overview'].viewList['service'])
              }
            })
          } else {
            this.viewColumnList['brief_overview'].viewList['service'].showEmpty = true
          }
          this.viewColumnList['brief_overview'].viewList['service'].showLoading = false
          // 简要概览 -> 节点
          this.viewColumnList['brief_overview'].viewList['node'].total_num = res.data.total_node_num
          this.viewColumnList['brief_overview'].viewList['node'].error_num = res.data.total_error_node_num
          this.viewColumnList['brief_overview'].viewList['node'].normal_num = res.data.total_normal_node_num
          if (res.data.total_node_num) {
            this.$nextTick(() => {
              if (this.$refs['hexbin_chart_'+this.viewColumnList['brief_overview'].columnIndex + '' + this.viewColumnList['brief_overview'].viewList['node'].sequence][0]) {
                this.$refs['hexbin_chart_'+this.viewColumnList['brief_overview'].columnIndex + '' + this.viewColumnList['brief_overview'].viewList['node'].sequence][0].resetDrawView(this.viewColumnList['brief_overview'].viewList['node'])
              }
            })
          } else {
            this.viewColumnList['brief_overview'].viewList['node'].showEmpty = true
          }
          this.viewColumnList['brief_overview'].viewList['node'].showLoading = false
          // 简要概览 -> 服务治理
          this.viewColumnList['brief_overview'].viewList['service_governance'].list[2].num = res.data.total_mesh_num
          this.viewColumnList['brief_overview'].viewList['service_governance'].list[3].num = res.data.total_app_num
          this.viewColumnList['brief_overview'].viewList['service_governance'].list[1].num = res.data.total_deploy_group_num
          this.viewColumnList['brief_overview'].viewList['service_governance'].list[0].num = res.data.total_route_rule_num
        } else {
        }

        this.viewColumnList['brief_overview'].viewList['service_governance'].showLoading = false
      })
    },
    // 获取首页服务指标数据 （服务概览 上半部分）
    async getServicesOverviewData () {
      let _that = this
      NXMC_METRICS_MESH_GET({namespace_code: this.namespace_code}).then((res) => {
        // console.log('------获取首页服务指标数据', res)
        if (res.code === 0) {
          // 服务概览 -> 服务类型
          this.viewColumnList['service_overview'].viewList['service_type'].seriesData[0].value = res.data.total_lang_num
          this.viewColumnList['service_overview'].viewList['service_type'].seriesData[1].value = res.data.total_business_num
          this.viewColumnList['service_overview'].viewList['service_type'].seriesData[2].value = res.data.total_component_num

          // 服务概览 -> 部署组
          this.viewColumnList['service_overview'].viewList['deployment_group'].chartOptions.total_num = res.data.total_deploy_group_num
          if (res.data.total_deploy_group_num) {
            let startedDeployPercent = ((res.data.total_started_deploy_group_num/res.data.total_deploy_group_num).toFixed(2))*100
            this.viewColumnList['service_overview'].viewList['deployment_group'].chartOptions.data = [
              {name:'已停止', y: 100 - startedDeployPercent, value: res.data.total_stopped_deploy_group_num, color: '#5D5D5D'},
              {name: '运行中', y: startedDeployPercent, value: res.data.total_started_deploy_group_num, color: 'rgba(162,112,196,1)'}
            ]
            this.$nextTick(() => {
              if (this.$refs['pie_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['deployment_group'].sequence][0]) {
                this.$refs['pie_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['deployment_group'].sequence][0].resetDrawView(this.viewColumnList['service_overview'].viewList['deployment_group'])
              }
            })
          } else {
            this.viewColumnList['service_overview'].viewList['deployment_group'].showEmpty = true
          }


          // 服务概览 -> 路由
          this.viewColumnList['service_overview'].viewList['route'].chartOptions.total_num = res.data.total_route_rule_num
          if (res.data.total_route_rule_num) {
            let enabledRoutePercent = ((res.data.total_enabled_route_rule_num/res.data.total_route_rule_num).toFixed(2))*100
            this.viewColumnList['service_overview'].viewList['route'].chartOptions.data = [
              {name:'禁用', y: 100 - enabledRoutePercent, value: res.data.total_disabled_route_rule_num, color: '#5D5D5D'},
              {name: '启用', y: enabledRoutePercent, value: res.data.total_enabled_route_rule_num, color: 'rgba(162,112,196,1)'}
            ]
            this.$nextTick(() => {
              if (this.$refs['pie_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['route'].sequence][0]) {
                this.$refs['pie_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['route'].sequence][0].resetDrawView(this.viewColumnList['service_overview'].viewList['route'])
              }
            })
          } else {
            this.viewColumnList['service_overview'].viewList['route'].showEmpty = true
          }

        } else {
          this.viewColumnList['service_overview'].viewList['deployment_group'].showEmpty = true
          this.viewColumnList['service_overview'].viewList['route'].showEmpty = true
        }
        this.viewColumnList['service_overview'].viewList['service_type'].showLoading = false
        this.viewColumnList['service_overview'].viewList['route'].showLoading = false
        this.viewColumnList['service_overview'].viewList['deployment_group'].showLoading = false
      })
    },
    // 查询指标
    async getIndicationChartData () {
      let postParams = await this.handleCommonParams()
      // 获取健康指数
      this.getHealthIndexData(postParams)
      // 获取访问请求
      this.getRequestIndexData(postParams)
      // 平均响应时间
      this.ApplicationTtabClick(this.viewColumnList['application_overview'].viewList['application_tab'].tabList[0], 0)
      // 获取服务排名
      this.getServicesRankData(postParams)
      // 服务热力图
      this.getServicesHeatMapData(postParams)
      // 接口调用量
      this.getInterfacesCallCountData(postParams)
      // 调用概览
      this.getInterfacesCallOverviewData(postParams)
      // 错误率
      this.getInterfacesErrorRateData(postParams)
      // 慢调用
      this.getInterfacesSlowCallData(postParams)
    },
    getHealthIndexData (postParams) {
      let _that = this

      NXMC_METRICS_HEALTH_INDEX_GET(postParams).then((res) => {
        // console.log('获取 健康指数', res)
        if (res.code === 0) {
          // 应用概览 -> 健康指数
          if (res.data.xAxis.length && res.data.series.length && res.data.series[0].data.length) {
            let handleData = []
            res.data.series[0].data.forEach((ITEM, INDEX) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(res.data.xAxis[INDEX]))
              // 进行Date.UTC处理
              let tms = Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(),someDate.getMinutes())
              handleData.push([tms, ITEM])
            })
            res.data.series[0].data = handleData
            this.viewColumnList['application_overview'].viewList['health_index'].total = res.data.total
            this.viewColumnList['application_overview'].viewList['health_index'].chartOptions.series = res.data.series
            // 计算刻度间隔
            this.viewColumnList['application_overview'].viewList['health_index'].chartOptions.tickInterval = (handleData[handleData.length-1][0] - handleData[0][0])/3
            this.viewColumnList['application_overview'].viewList['health_index'].chartOptions.xAxisType = 'datetime'
            this.$nextTick(() => {
              if (this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['health_index'].sequence][0]) {
                this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['health_index'].sequence][0].resetDrawView(this.viewColumnList['application_overview'].viewList['health_index'])
              }
            })
          } else {
            this.viewColumnList['application_overview'].viewList['health_index'].showEmpty = true
          }

        } else {
          this.viewColumnList['application_overview'].viewList['health_index'].showEmpty = true
        }

        this.viewColumnList['application_overview'].viewList['health_index'].showLoading = false
      })
    },
    getRequestIndexData (postParams) {
      let _that = this
      NXMC_METRICS_REQUEST_INDEX_GET(postParams).then((res) => {
        // console.log('获取 访问请求', res)
        if (res.code === 0) {
          // 应用概览 -> 访问请求
          let seriesData = []
          let subsidiary = ''
          res.data.series.forEach(data => {
            data.value = data.data
            switch (data.name) {
              case '访问量':
              case 'QPS':
                data.type = 'count'
                subsidiary = '次'
                break;
              case '流量':
                data.type = 'flow'
                subsidiary = ''
            }
            seriesData.push(currencyFunc(data, subsidiary, 1))
          })
          this.viewColumnList['application_overview'].viewList['access_request'].seriesData = seriesData

        }
        this.viewColumnList['application_overview'].viewList['access_request'].showLoading = false
      })
    },
    // tab点击事件
    async ApplicationTtabClick (item, index) {
      let _that = this
      let postParams = await this.handleCommonParams()
      this.viewColumnList['application_overview'].viewList['application_tab'].showLoading = true
      this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = false
      switch (index) {
        case 0:
          // 平均响应时间
          this.getAvgResTimeData(postParams, item, index)
          // 获取应用排名
          this.getAppsRankData(postParams, 'avg_res_time')
          break
        case 1:
          // 错误率
          this.getReqErrorRateData(postParams, item, index)
          // 获取应用排名
          this.getAppsRankData(postParams, 'req_error_rate')
          break
        case 2:
          // 吞吐量
          this.getThroughputData(postParams, item, index)
          // 获取应用排名
          this.getAppsRankData(postParams, 'throughput')
          break
      }
    },
    getAvgResTimeData (postParams, item={}, index=0) {
      let _that = this
      NXMC_METRICS_AVG_RES_TIME_GET(postParams).then((res) => {
        // console.log('获取 平均响应时间', res)
        if (res.code === 0) {
          // 应用概览 -> 平均响应时间
          if (res.data.xAxis.length && res.data.series.length && res.data.series[0].data.length) {
            let handleData = []
            res.data.series[0].data.forEach((ITEM, INDEX) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(res.data.xAxis[INDEX]))
              // 进行Date.UTC处理
              let tms = Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(),someDate.getMinutes())
              handleData.push([tms, ITEM])
            })
            res.data.series[0].data = handleData
            // 计算刻度间隔
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.tickInterval = (handleData[handleData.length-1][0] - handleData[0][0])/3
            this.viewColumnList['application_overview'].viewList['application_tab'].applicationTabIndex = index
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.seriesColor = item.seriesColor
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.areaColor = item.areaColor
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.yAxisFormat = item.yAxisFormat
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.series = res.data.series
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.xAxisType = 'datetime'
            this.$forceUpdate()
            this.$nextTick(() => {
              if (this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['application_tab'].sequence][0]) {
                this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['application_tab'].sequence][0].resetDrawView(this.viewColumnList['application_overview'].viewList['application_tab'])
              }
            })
          } else {
            this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = true
          }
        } else {
          this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = true
        }

        this.viewColumnList['application_overview'].viewList['application_tab'].showLoading = false
      })
    },
    getReqErrorRateData (postParams, item={}, index=0) {
      let _that = this
      NXMC_METRICS_REQ_ERROR_RATE_GET(postParams).then((res) => {
        // console.log('获取 错误率', res)
        if (res.code === 0) {
          // 应用概览 -> 错误率
          if (res.data.xAxis.length && res.data.series.length && res.data.series[0].data.length) {
            let handleData = []
            res.data.series[0].data.forEach((ITEM, INDEX) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(res.data.xAxis[INDEX]))
              // 进行Date.UTC处理
              let tms = Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(),someDate.getMinutes())
              handleData.push([tms, ITEM])
            })
            res.data.series[0].data = handleData
            // 计算刻度间隔
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.tickInterval = (handleData[handleData.length-1][0] - handleData[0][0])/3
            this.viewColumnList['application_overview'].viewList['application_tab'].applicationTabIndex = index
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.seriesColor = item.seriesColor
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.areaColor = item.areaColor
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.yAxisFormat = item.yAxisFormat
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.series = res.data.series
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.xAxisType = 'datetime'
            this.$forceUpdate()
            this.$nextTick(() => {
              if (this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['application_tab'].sequence][0]) {
                this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['application_tab'].sequence][0].resetDrawView(this.viewColumnList['application_overview'].viewList['application_tab'])
              }
            })
          } else {
            this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = true
          }
        } else {
          this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = true
        }

        this.viewColumnList['application_overview'].viewList['application_tab'].showLoading = false
      })
    },
    getThroughputData (postParams, item={}, index=0) {
      let _that = this
      NXMC_METRICS_THROUGHPUT_GET(postParams).then((res) => {
        // console.log('获取 吞吐量', res)
        if (res.code === 0) {
          // 应用概览 -> 吞吐量
          if (res.data.xAxis.length && res.data.series.length && res.data.series[0].data.length) {
            let handleData = []
            res.data.series[0].data.forEach((ITEM, INDEX) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(res.data.xAxis[INDEX]))
              // 进行Date.UTC处理
              let tms = Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(),someDate.getMinutes())
              handleData.push([tms, ITEM])
            })
            res.data.series[0].data = handleData
            // 计算刻度间隔
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.tickInterval = (handleData[handleData.length-1][0] - handleData[0][0])/3
            this.viewColumnList['application_overview'].viewList['application_tab'].applicationTabIndex = index
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.seriesColor = item.seriesColor
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.areaColor = item.areaColor
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.yAxisFormat = item.yAxisFormat
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.series = res.data.series
            this.viewColumnList['application_overview'].viewList['application_tab'].chartOptions.xAxisType = 'datetime'
            this.$forceUpdate()
            this.$nextTick(() => {
              if (this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['application_tab'].sequence][0]) {
                this.$refs['area_line_chart_'+this.viewColumnList['application_overview'].columnIndex + '' + this.viewColumnList['application_overview'].viewList['application_tab'].sequence][0].resetDrawView(this.viewColumnList['application_overview'].viewList['application_tab'])
              }
            })
          } else {
            this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = true
          }
        } else {
          this.viewColumnList['application_overview'].viewList['application_tab'].showEmpty = true
        }

        this.viewColumnList['application_overview'].viewList['application_tab'].showLoading = false
      })
    },
    getAppsRankData (postParams, rankType='') {
      let _that = this
      postParams.index = rankType
      let type = ''
      let subsidiary = ''
      if (rankType === 'avg_res_time') {
        type = 'time'
        subsidiary = 'ms'
      } else if (rankType === 'throughput') {
        type = 'common'
        subsidiary = '/s'
      } else {
        type = ''
        subsidiary = '%'
      }
      NXMC_METRICS_APPS_RANK_GET(postParams).then((res) => {
        // console.log('获取 应用排名', res)
        if (res.code === 0)  {
          // appList: name + value
          let appList = []
          if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data && res.data.series[0].data.length) {
            res.data.series[0].data.forEach((item, index) => {
              if (type) {
                let linval = {
                  name: res.data.yAxis[index],
                  value: item,
                  type: type
                }
                appList.push(currencyFunc(linval, subsidiary, 0))
              } else {
                appList.push({
                  name: res.data.yAxis[index],
                  value: item,
                  unit: subsidiary
                })
              }
            })
          }
          this.viewColumnList['application_overview'].viewList['application_tab'].appList = appList
        }

        this.viewColumnList['application_overview'].viewList['application_tab'].showLoading = false
      })
    },
    getServicesHeatMapData (postParams) {
      let _that = this
      NXMC_METRICS_SERVICES_HEAT_MAP_GET(postParams).then((res) => {
        // console.log('获取 服务热力图', res)
        if (res.code === 0) {
          if (res.data.data && res.data.data.length) {
            this.viewColumnList['service_overview'].viewList['service_heat_map'].chartOptions.data = res.data.data
            this.$nextTick(() => {
              if (this.$refs['treemap_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['service_heat_map'].sequence][0]) {
                this.$refs['treemap_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['service_heat_map'].sequence][0].resetDrawView(this.viewColumnList['service_overview'].viewList['service_heat_map'])
              }
            })
          } else {
            this.viewColumnList['service_overview'].viewList['service_heat_map'].showEmpty = true
          }
        } else {
          this.viewColumnList['service_overview'].viewList['service_heat_map'].showEmpty = true
        }

        this.viewColumnList['service_overview'].viewList['service_heat_map'].showLoading = false
      })
    },
    getServicesRankData (postParams) {
      let _that = this
      NXMC_METRICS_SERVICES_RANK_GET(postParams).then((res) => {
        // console.log('获取 服务排名', res)
        if (res.code === 0) {
          if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data.length) {
            this.viewColumnList['service_overview'].viewList['service_heat_map'].barStackChartOptions.data = res.data.series[0].data
            this.viewColumnList['service_overview'].viewList['service_heat_map'].barStackChartOptions.categories = res.data.yAxis
            this.viewColumnList['service_overview'].viewList['service_heat_map'].barStackChartOptions.themeColor = '#5272C9'
            this.viewColumnList['service_overview'].viewList['service_heat_map'].barStackChartOptions.tooltip = {
              formatter: function () {
                return this.x
              }
            }
            this.$nextTick(() => {
              if (this.$refs['bar_stack_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['service_heat_map'].sequence][0]) {
                this.$refs['bar_stack_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['service_heat_map'].sequence][0].resetDrawView(this.viewColumnList['service_overview'].viewList['service_heat_map'])
              }
            })
          }
        }
        this.viewColumnList['service_overview'].viewList['service_heat_map'].showLoading = false
      })
    },
    getInterfacesCallOverviewData (postParams) {
      let _that = this
      NXMC_METRICS_INTERFACES_CALL_OVERVIEW_GET(postParams).then((res) => {
        // console.log('获取 接口调用概览', res)
        if (res.code === 0) {
          if (res.data.xAxis.length && res.data.series.length && res.data.series[0].data.length) {
            let resultData = [{
              name: '',
              type: 'column',
              color: '#714191',
              data: []
            }, {
              type: 'column',
              name: '',
              color: '#BA8ED6',
              data: []
            }, {
              type: 'spline',
              name: '',
              color: '#D3DAFD',
              lineWidth: 1,
              marker: {
                radius: 1.5,
                lineWidth: 0,
                fillColor: '#DEBBF3',
                symbol: 'square'
              },
              yAxis: 1,
              data: []
            }]
            res.data.series.forEach((ITEM, parindex) => {
              let iIndex = 0
              if (ITEM.name === '错误率') {
                iIndex = 2
              }
              if (ITEM.name === '错误数') {
                iIndex = 1
              }
              if (ITEM.name === '总数') {
                iIndex = 0
              }
              resultData[iIndex].name = ITEM.name
              let handleData = []
              ITEM.data.forEach((son, INDEX) => {
                // 把字符串类型专程Date类型
                let someDate = new Date(Date.parse(res.data.xAxis[INDEX]))
                // 进行Date.UTC处理
                let tms = Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(),someDate.getMinutes())
                if (ITEM.name === '总数') {
                  handleData.push([tms, son - res.data.series[1].data[INDEX]])
                } else if (ITEM.name === '错误率') {
                  handleData.push([tms, son/100])
                } else {
                  handleData.push([tms, son])
                }
              })
              resultData[iIndex].data = handleData
            })
            // console.log('resultData', resultData)
            // 计算刻度间隔
            this.viewColumnList['interface_overview'].viewList['call_overview'].lineColumnChartOptions.tickInterval = (resultData[0].data[resultData[0].data.length-1][0] - resultData[0].data[0][0])/3
            this.viewColumnList['interface_overview'].viewList['call_overview'].lineColumnChartOptions.data = resultData
            this.viewColumnList['interface_overview'].viewList['call_overview'].lineColumnChartOptions.legends = [{
              name: '错误率',
              color: '#DEBBF3'
            }, {
              name: '错误数',
              color: '#BA8ED6'
            }, {
              name: '总数',
              color: '#714191'
            }]
            // this.handleXAxisFormats(this.viewColumnList['interface_overview'].viewList['call_overview'].lineColumnChartOptions)
            this.$nextTick(() => {
              if (this.$refs['line_column_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['call_overview'].sequence][0]) {
                this.$refs['line_column_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['call_overview'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['call_overview'])
              }
            })
          } else {
            this.viewColumnList['interface_overview'].viewList['call_overview'].showEmpty = true
          }
        } else {
          this.viewColumnList['interface_overview'].viewList['call_overview'].showEmpty = true
        }
        this.viewColumnList['interface_overview'].viewList['call_overview'].showLoading = false
      })
    },
    getInterfacesCallCountData (postParams) {
      let _that = this
      NXMC_METRICS_INTERFACES_CALL_COUNT_GET(postParams).then((res) => {
        // console.log('获取 接口调用量', res)
        if (res.code === 0) {
          if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data.length) {
            this.viewColumnList['interface_overview'].viewList['call_overview'].barStackChartOptions.data = res.data.series[0].data
            this.viewColumnList['interface_overview'].viewList['call_overview'].barStackChartOptions.categories = res.data.yAxis
            this.viewColumnList['interface_overview'].viewList['call_overview'].barStackChartOptions.themeColor = '#5A71C1'
            this.viewColumnList['interface_overview'].viewList['call_overview'].barStackChartOptions.tooltip = {
              formatter: function () {
                return this.x
              }
            }
            this.$nextTick(() => {
              if (this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['call_overview'].sequence][0]) {
                this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['call_overview'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['call_overview'])
              }
            })
          }
        }
        this.viewColumnList['interface_overview'].viewList['call_overview'].showLoading = false
      })
    },
    getInterfacesErrorRateData (postParams) {
      let _that = this
      NXMC_METRICS_INTERFACES_ERROR_RATE_GET(postParams).then((res) => {
        // console.log('获取 接口错误率', res)
        if (res.code === 0) {
          if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data.length) {
            this.viewColumnList['interface_overview'].viewList['error_rate'].barStackChartOptions.data = res.data.series[0].data
            this.viewColumnList['interface_overview'].viewList['error_rate'].barStackChartOptions.categories = res.data.yAxis
            this.viewColumnList['interface_overview'].viewList['error_rate'].barStackChartOptions.themeColor = '#A972CC'
            this.viewColumnList['interface_overview'].viewList['error_rate'].barStackChartOptions.tooltip = {
              formatter: function () {
                return this.x
              }
            }
            this.$nextTick(() => {
              if (this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['error_rate'].sequence][0]) {
                this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['error_rate'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['error_rate'])
              }
            })
          } else {
            this.viewColumnList['interface_overview'].viewList['error_rate'].showEmpty = true
          }
          // if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data.length) {
          //   this.viewColumnList['interface_overview'].viewList['error_rate'].chartOptions.data = res.data.series[0].data
          //   this.viewColumnList['interface_overview'].viewList['error_rate'].chartOptions.categories = res.data.yAxis
          //   this.viewColumnList['interface_overview'].viewList['error_rate'].chartOptions.tooltip = {
          //     formatter: function () {
          //       return this.x
          //     }
          //   }
          //   this.$nextTick(() => {
          //     if (this.$refs['bar_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['error_rate'].sequence][0]) {
          //       this.$refs['bar_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['error_rate'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['error_rate'])
          //     }
          //   })
          // } else {
          //   this.viewColumnList['interface_overview'].viewList['error_rate'].showEmpty = true
          // }

        } else {
          this.viewColumnList['interface_overview'].viewList['error_rate'].showEmpty = true
        }
        this.viewColumnList['interface_overview'].viewList['error_rate'].showLoading = false
      })
    },
    getInterfacesSlowCallData (postParams) {
      let _that = this
      NXMC_METRICS_INTERFACES_SLOW_CALL_GET(postParams).then((res) => {
        // console.log('获取 接口慢调用', res)
        if (res.code === 0) {
          if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data.length) {
            this.viewColumnList['interface_overview'].viewList['slow_call'].barStackChartOptions.data = res.data.series[0].data
            this.viewColumnList['interface_overview'].viewList['slow_call'].barStackChartOptions.categories = res.data.yAxis
            this.viewColumnList['interface_overview'].viewList['slow_call'].barStackChartOptions.themeColor = '#B7C2FC'
            this.viewColumnList['interface_overview'].viewList['slow_call'].barStackChartOptions.tooltip = {
              formatter: function () {
                return this.x
              }
            }
            this.$nextTick(() => {
              if (this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['slow_call'].sequence][0]) {
                this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['slow_call'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['slow_call'])
              }
            })
          } else {
            this.viewColumnList['interface_overview'].viewList['slow_call'].showEmpty = true
          }
          // if (res.data.yAxis.length && res.data.series.length && res.data.series[0].data.length) {
          //   this.viewColumnList['interface_overview'].viewList['slow_call'].chartOptions.data = res.data.series[0].data
          //   this.viewColumnList['interface_overview'].viewList['slow_call'].chartOptions.categories = res.data.yAxis
          //   this.viewColumnList['interface_overview'].viewList['slow_call'].chartOptions.tooltip = {
          //     formatter: function () {
          //       return this.x
          //     }
          //   }
          //   this.$nextTick(() => {
          //     if (this.$refs['bar_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['slow_call'].sequence][0]) {
          //       this.$refs['bar_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['slow_call'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['slow_call'])
          //     }
          //   })
          // } else {
          //   this.viewColumnList['interface_overview'].viewList['slow_call'].showEmpty = true
          // }

        } else {
          this.viewColumnList['interface_overview'].viewList['slow_call'].showEmpty = true
        }

        this.viewColumnList['interface_overview'].viewList['slow_call'].showLoading = false

        // this.$loading.close()
      })
    },
    // 切换服务治理
    switchServiceGovernance () {
      if (this.dataLayerIndex === 1) {
        this.dataLayerIndex = 4
        return
      }
      this.dataLayerIndex--
    },
    // 处理时间x轴 的显示
    handleXAxisFormats (options) {
      let dateLabelFormats = '%H:%M'
      if (this.time_range_obj.code) {
        if (this.time_range_obj.code === 'Last 72 hours' || this.time_range_obj.code === 'Last 7 days' || this.time_range_obj.code === 'Last 30 days') {
          // 大于一天
          dateLabelFormats = '%m.%d'
        }
      } else {
        if (this.time_range_obj.end_time - this.time_range_obj.start_time > 24 * 60 * 60 * 1000) {
          // 大于一天
          dateLabelFormats = '%m.%d'
        }
      }
      options.xAxis_dateTimeLabelFormats = {
        data: dateLabelFormats
      }
      options.xAxis_labels = {
        formatter: function () {
          var labelVal = HighCharts.dateFormat(dateLabelFormats, this.value)
          return labelVal
        }
      }
      return options
    },
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    this.updateHomeView()
    let _this = this
    bus.$on('timeChanged', (obj) => {
      _this.time_range_obj = obj
      // _this.$loading()
      Object.keys(_this.viewColumnList).forEach(key1 => {
        Object.keys(_this.viewColumnList[key1].viewList).forEach(key2 => {
          if (key1 !== 'brief_overview' && key2 !== 'service_type' && key2 !== 'deployment_group' && key2 !== 'route') {
            _this.viewColumnList[key1].viewList[key2].showLoading = true
            _this.viewColumnList[key1].viewList[key2].showEmpty = false
          }

          if (key2 === 'warning') {
            _this.viewColumnList[key1].viewList[key2].showLoading = true
            _this.viewColumnList[key1].viewList[key2].showEmpty = false
          }
        })
      })
      this.getBriefOverviewData()
      this.getIndicationChartData()
    })
    bus.$emit('resetTime')
    window.onresize = () => {
      if (this.$refs['bar_stack_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['service_heat_map'].sequence][0]) {
        this.$refs['bar_stack_chart_'+this.viewColumnList['service_overview'].columnIndex + '' + this.viewColumnList['service_overview'].viewList['service_heat_map'].sequence][0].resetDrawView(this.viewColumnList['service_overview'].viewList['service_heat_map'])
      }
      if (this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['call_overview'].sequence][0]) {
        this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['call_overview'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['call_overview'])
      }
      if (this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['slow_call'].sequence][0]) {
        this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['slow_call'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['slow_call'])
      }
      if (this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['error_rate'].sequence][0]) {
        this.$refs['bar_stack_chart_'+this.viewColumnList['interface_overview'].columnIndex + '' + this.viewColumnList['interface_overview'].viewList['error_rate'].sequence][0].resetDrawView(this.viewColumnList['interface_overview'].viewList['error_rate'])
      }
    }
  },
  created () {
    this.namespace_code = window.localStorage.getItem('namespace_code')
    clearInterval(this.serviceGovernanceTimer)
    this.serviceGovernanceTimer = null
    this.serviceGovernanceTimer = setInterval(this.switchServiceGovernance, 3000)
  },
  components: {
    stepper,
    d3Hexbin,
    areaLineChart,
    seriesViewBoard,
    pieChart,
    treemapChart,
    barStackChart,
    barChart,
    lineColumnChart
  }
};
</script>

<style lang="less" scoped>
.applicationTab{
  height: 100%;
}
.sf_view_tab{
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(69,70,70,1);
  margin-bottom: 24px;
  .tab_item{
    flex: 1;
    text-align: center;
    height: 19px;
    line-height: 19px;
    font-size:11px;
    font-family:SourceHanSansSC-Regular,SourceHanSansSC;
    font-weight:400;
    color:rgba(255,255,255,1);
    color: #898989;
    &.active{
      background:rgba(82,82,82,1);
      color: #ffffff;
    }
  }
}
</style>
