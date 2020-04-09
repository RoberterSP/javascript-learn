<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="royalblue" @goRouter="goRouter"></stepper>
    <div class="monitorApplication">
      <DYPageHeader theme="royalblue" icon="Service" :title="detailData.name" />
      <div class="filter_div m20">
        <!-- <input type="text" placeholder="过滤条件"/> -->
<!--        <tags-input ref="tagsInput" :filterKeys="filterKeys" :keysValue="keysValue"-->
<!--                    @returnFilterFunc="returnFilterFunc"></tags-input>-->

        <DYFilter
          class="input-filter"
          :filters-model="filterModelValues"
          :filterKeys="filterKeys"
          :quickSearch="false"
          @returnFilterFunc="returnFilterFunc"
        />
      </div>
      <div class="health ml20 mr20">
        <div class="tit p16">健康指数</div>
        <div class="circleDiv">
          <div class="fx">
            <div class="pie_chart">
              <charts :ref="pieChartOptions[0].id" :chartId="pieChartOptions[0].id"
                      :option="pieChartOptions[0].option"></charts>
              <div class="data_view">
                <div class="val">{{healthTotal}}</div>
                <div>{{headthEvaluate}}</div>
              </div>
            </div>
          </div>
          <div class="fx">
            <div class="pie_chart">
              <charts :ref="pieChartOptions[1].id" :chartId="pieChartOptions[1].id"
                      :option="pieChartOptions[1].option"></charts>
              <div class="data_view">
                <div class="view_item">
                  <div class="flex">
                    <span>{{pieChartOptions[1].option.series[0].data[0].y}}%</span>
                    <DYIcon type="manyi" class="iconfont green"></DYIcon>
                  </div>
                  <div class="flex">
                    <span>{{pieChartOptions[1].option.series[0].data[1].y}}%</span>
                    <DYIcon type="yiban" class="iconfont yellow"></DYIcon>
                  </div>
                  <div class="flex">
                    <span>{{pieChartOptions[1].option.series[0].data[2].y}}%</span>
                    <DYIcon type="shiwang" class="iconfont red"></DYIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="line_chart">
          <charts ref="healthlineChart" :chartId="healthChartOption.id" :option="healthChartOption.option"></charts>
        </div>
      </div>
      <div class="section m20">

        <DYTabs
          :tabList="tabList"
          theme="royalblue"
          @onClick="tabClick"
        />
        <div class="column_chart p16">
          <charts ref="columnChart" :chartId="columnLineChartOption.id" :option="columnLineChartOption.option"></charts>
          <div class="sf_chart_legend">
            <div class="legend_item" v-for="(item, index) in legends" :key="index">
              <div class="legend_item_icon">
                <img src="~@/assets/image/dynatrace/blue_chart_line.svg" alt="" v-if="item.chartType === 'line'"/>
                <img src="~@/assets/image/dynatrace/purple_chart_column.svg" alt=""
                     v-if="item.chartType === 'column' && item.title!=='Failed Requests'"/>
                <img src="~@/assets/image/dynatrace/red_chart_column.svg" alt=""
                     v-if="item.chartType === 'column' && item.title==='Failed Requests'"/>
              </div>
              <span class="legent_item_tit">{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="table_view ml20 mr20 pb20 pt20">
        <div class="tit pl16 pr16">{{tabList[tab_active_index].subTit}}</div>
        <div class="search-bar-box pl30 pr30 pt30" style="width: 80%;">
          <search-bar
            v-model.trim="query"
            @search="searchBarFunc"
            :placeholder="'搜索关键字'"
          ></search-bar>
        </div>
        <div class="my-table p16" ref='table' v-if="!isChange">
          <div class="el-table" style="width: 100%;">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 99.99%;">
              <!-- 表头信息 -->
              <thead>
              <tr>
                <th v-for="(column, index) in columns"
                    :key="index"
                    :style="{'width': column.columnWidth ? column.columnWidth : 'auto'}">
                  <div class="cell">
                    <div class="flex header-style">
                      <div class="split" v-if="column.textAlign==='right'"></div>
                      <div class="title">
                        {{column.name}}
                        <span class="caret-wrapper" @click.stop="changeOrder(column, column.code)"
                              v-if="!!column.sortAbled">
                            <!-- <i class="sort-caret ascending"
                              :style="{'border-bottom-color': column.sortOrder === 'asc' ? 'rgb(82, 82, 82)' : '#c0c4cc'}"
                            ></i>
                            <i class="sort-caret descending"
                              :style="{'border-top-color': column.sortOrder === 'desc' ? 'rgb(82, 82, 82)' : '#c0c4cc'}"
                            ></i> -->
                            <img class="sort_icon" src="~@/assets/image/icon_rank.svg" title=""
                                 v-if="column.sortOrder === 'none'||!column.sortOrder"/>
                            <img class="sort_icon" src="~@/assets/image/icon_rank_up.svg" title=""
                                 v-if="column.sortOrder === 'asc'"/>
                            <img class="sort_icon" src="~@/assets/image/icon_rank_down.svg" title=""
                                 v-if="column.sortOrder === 'desc'"/>
                          </span>
                      </div>
                      <div class="split" v-if="!column.textAlign || column.textAlign==='left'"></div>
                    </div>
                  </div>
                </th>
                <th>
                  <div class="cell">
                    <div class="flex header-style">
                      <div class="split"></div>
                      <div class="title">操作</div>
                      <div class="split"></div>
                    </div>
                  </div>
                </th>
              </tr>
              </thead>
              <!-- 表身信息 -->
              <tbody>
              <tr v-for="(trItem, trIndex) in tableData" :key="trIndex" class="self-table__row"
                  @mouseenter.prevent="mouseEnterTr($event, trIndex)"
                  @mouseleave.prevent="mouseLeaveTr($event, trIndex)">
                <td v-for="(column, tdIndex) in columns"
                    :key="tdIndex"
                    :style="{'width': column.columnWidth ? column.columnWidth : 'auto'}">
                  <div class="cell">
                    <!-- text link_label -->
                    <div v-if="column.type === 'link_label'">
                      <div class="flex header-style"
                           :class="{'flex-end': column.textAlign === 'right' || !column.textAlign, 'flex-start': column.textAlign === 'left'}">
                        <div class="title highlight_label" @click="linkLabelClick(trItem)">{{trItem[column.code]}}</div>
                      </div>
                    </div>
                    <!-- text -->
                    <div v-if="column.type === 'text'">
                      <div class="flex header-style"
                           :class="{'flex-end': column.textAlign === 'right' || !column.textAlign, 'flex-start': column.textAlign === 'left', 'align-width-word': column.textAiignWithoutIcon}">
                        <div class="title" v-if="column.unit">{{trItem[column.code] | currency(column.unit)}}</div>
                        <div class="title" v-else>{{trItem[column.code]}}</div>
                      </div>
                    </div>
                    <!-- 长条 -->
                    <div v-if="column.type === 'sliver'">
                      <div class="flex header-style"
                           :class="{'flex-end': column.textAlign === 'right' || !column.textAlign, 'flex-start': column.textAlign === 'left'}">
                        <div class="title">
                          <!-- :style="{'width': }" -->
                          <div v-if="tab_active_index===0" class="slip"
                               :style="{'width': (trItem[column.code]/avg_totalSum*100).toFixed(2)+'%'}"
                               style="color:#fff"></div>
                          <div v-if="tab_active_index===1" class="slip"
                               :style="{'width': (trItem[column.code]/error_totalSum*100).toFixed(2)+'%'}"
                               style="color:#fff"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell opt_cell">
                    <div class="flex header-style flex-center">
                      <div class="title">
                        <a class="tb_filter" :class="[trItem.show_click_pop?'':'no_click_pop']"
                           @click.stop="tbFilterClick(trItem)">
                          <div class="column-icon iconfont iconfilter"></div>
                          <div class="hover_pop">筛选</div>
                        </a>
                        <a class="tb_more" :class="[trItem.show_click_pop?'':'no_click_pop']"
                           @click.stop="tbMoreClick($event, trItem)">
                          <DYIcon type="more" size="14"></DYIcon>
                          <div class="hover_pop">更多</div>
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="flex-center empty" v-if="!tableData.length">
              <DYIcon type="records" size="80" class="mt30"></DYIcon>
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 更多popup -->
          <div class="click_pop" v-show="currentClickItem && currentClickItem.show_click_pop"
               :style="{'left': click_pop_position.x+'px', 'top': click_pop_position.y+'px'}">
            <div class="head">分析</div>
            <div class="line" @click.stop="skipPage('logQuery', currentClickItem)">日志详情</div>
            <div class="line" @click.stop="skipPage('apiTracing', currentClickItem)">调用跟踪</div>
            <span @click.stop="closeClickPop(currentClickItem)">
              <DYIcon type="delete" size="12"></DYIcon>
            </span>
          </div>
          <!-- table 行的 hover popup -->
          <div class="sf_popup" :style="{'left': clientX+'px', 'top': clientY+'px'}" ref="sf_popup"
               v-show="currentHoverItem">
            <div class="name">{{currentHoverItem.endpoint}}</div>
            <div class="explain">Values are calculated over whole timefram.</div>
            <div class="sec">
              <div class="line">
                <p>调用次数</p>
                <div class="dot"></div>
                <div class="val" v-if="currentHoverItem.unit">{{currentHoverItem.call_count | currency('次')}}</div>
                <div class="val" v-else>{{currentHoverItem.call_count}}</div>
              </div>
              <div class="line">
                <p>调用次数</p>
                <div class="dot"></div>
                <div class="val" v-if="currentHoverItem.unit">{{currentHoverItem.call_count | currency('次')}}</div>
                <div class="val" v-else>{{currentHoverItem.call_count}}</div>
              </div>
            </div>
            <div class="sec">
              <div class="line">
                <p>平均响应时间</p>
                <div class="dot"></div>
                <div class="val">{{currentHoverItem.avg_res_time | currency('ms')}}</div>
              </div>
              <div class="line">
                <p>平均响应时间</p>
                <div class="dot"></div>
                <div class="val">{{currentHoverItem.avg_res_time | currency('ms')}}</div>
              </div>
              <div class="line">
                <p>调用次数</p>
                <div class="dot"></div>
                <div class="val">{{currentHoverItem.call_count | currency('次')}}</div>
              </div>
            </div>
            <div class="sec">
              <div class="line">
                <p>失败率</p>
                <div class="dot"></div>
                <div class="val">{{currentHoverItem.req_error_rate | currency('%')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HighCharts from 'highcharts'
import bus from '@/assets/eventBus.js'
import '@/components/ntTable/index.less'
import stepper from 'components/stepper/stepper.vue'
import charts from '@/components/charts/charts.vue'
// import tagsInput from '@/components/tagsInput/tagsInput.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import '@/directives/currency.js'
/* eslint-disable-next-line */
import {
  MESH_ENDPOINT_LIST,
  NXDF_SETTING_HEALTH_INDEX_INFO_GET,
  SERVICE_AVG_RES_TIME,
  SERVICE_HEALTH_INDEX,
  SERVICE_INTERFACE_CALL_COUNT,
  SERVICE_INTERFACE_ERROR_RATE,
  SERVICE_INTERFACE_SLOW_CALL,
  SERVICE_REQ_ERROR_RATE,
  SERVICE_THROUGHPUT
} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import {healthLineChartOption} from '@/common/mock/usdeur'

export default {
  data () {
    return {
      time_range: {code: 'Last 30 minutes'},
      start_time: (new Date()).getTime(),
      end_time: (new Date()).getTime(),
      query: '',
      detailData: {},
      healthTotal: 100,
      headthEvaluate: '',
      healthPositions: [],
      // 过滤组件绑定值
      filterModelValues: [],
      stepper: [
        {
          name: '服务列表',
          routerTo: 'serviceList'
        },
        {
          name: '服务title',
          routerTo: 'serviceDetail',
          myCustomRouter: true
        },
        {
          name: '服务监控',
          routerTo: ''
        }
      ],
      pieChartOptions: [{
        id: 'pie_chart001',
        option: {
          chart: {
            height: 100,
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0]
          },
          credits: {
            // 不显示水印
            enabled: false
          },
          title: {
            text: ''
          },
          tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.0f}%</b>'
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: false
              },
              startAngle: -130, // 圆环的开始角度
              endAngle: 130, // 圆环的结束角度
              center: ['50%', '55%']
            }
          },
          series: [{
            type: 'pie',
            name: '健康水平评分',
            innerSize: '70%',
            data: [{
              name: '健康',
              color: '#2AB06F',
              y: 0
            }, {
              name: '其他',
              color: '#E6E6E6',
              y: 0
            }]
          }]
        }
      }, {
        id: 'pie_chart002',
        option: {
          chart: {
            height: 100,
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0]
          },
          credits: {
            // 不显示水印
            enabled: false
          },
          title: {
            text: ''
          },
          tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.0f}%</b>'
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: false
              },
              center: ['50%', '55%']
            }
          },
          series: [{
            type: 'pie',
            name: '健康水平占比图',
            innerSize: '70%',
            data: [{
              name: '健康',
              color: '#2AB06F',
              y: 0
            }, {
              name: '异常',
              color: '#F5D30F',
              y: 0
            }, {
              name: '危险',
              color: '#DC172A',
              y: 0
            }]
          }]
        }
      }],
      healthChartOption: {
        id: 'healthlineChart000',
        option: healthLineChartOption
      },
      columnLineChartOption: {
        id: 'columnLineChart000',
        option: {
          chart: {
            height: 330,
            skipClone: true,
            style: {
              overflow: 'visible'
            },
            // spacing : [0, 0 , 0, 0],
            backgroundColor: '#fff',
            zoomType: 'x'
          },
          lengend: {
            enabled: false
          },
          credits: {
            // 不显示水印
            enabled: false
          },
          title: {
            text: ''
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%Y-%m-%d %H:%M'
            },
            crosshair: {
              color: '#67D5E0',
              width: 3,
              zIndex: 3
            },
            labels: {
              y: 20,
              style: {
                color: '#686868',
                fontSize: '11px',
                fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
                fontWeight: 400,
                lineHeight: '16px'
              }
            },
            title: {
              text: null
            },
            lineColor: '#D3DBEE'
          },
          yAxis: [{
            gridLineColor: '#F1F1F1', // 网格线颜色
            lineColor: '#F1F1F1', // 轴线颜色
            lineWidth: 1,
            min: 0,
            labels: {
              x: -8,
              format: '{value} ms',
              style: {
                color: '#686868',
                fontSize: '11px',
                fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
                fontWeight: 400,
                lineHeight: '16px'
              }
            },
            title: {
              text: null
            }
          }, {
            title: {
              text: ''
            },
            opposite: true,
            gridLineWidth: 0,
            lineColor: '#F1F1F1', // 轴线颜色
            lineWidth: 1,
            labels: {
              format: '{value}',
              style: {
                color: '#686868',
                fontSize: '11px',
                fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
                fontWeight: 400,
                lineHeight: '16px'
              }
            }
          }],
          legend: {
            enabled: false
          },
          tooltip: {
            shared: true,
            crosshairs: true,
            borderColor: '#67D5E0',
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<table><tr><td style="color: {series.userOptions.fontColor};line-height:20px;"><span style="color:{point.color}">\u25A0 </span> {series.name}: &nbsp;</td>' +
                '<td style="text-align: right"><b>{point.y} {series.userOptions.unit}</b></td></tr>',
            footerFormat: '</table>',
            // valueDecimals: 2,
            dateTimeLabelFormats: {
              second: '%Y-%m-%d %H:%M:%S',
              minute: '%Y-%m-%d %H:%M',
              hour: '%Y-%m-%d %H',
              day: '%Y-%m-%d',
              year: '%Y-%m-%d'
            }
          },
          plotOptions: {
            column: {
              grouping: false,
              borderWidth: 0,
              // 最大的柱子宽
              maxPointWidth: 20,
              states: {
                hover: {
                  opacity: 1
                },
                inactive: {
                  opacity: 1
                }
              }
            },
            line: {
              lineWidth: 2,
              marker: {
                enabled: false
              },
              dataLabels: {}
            },
            series: {
              states: {
                hover: {
                  opacity: 1
                },
                inactive: {
                  opacity: 1
                }
              }
            }
          },
          series: [{
            name: 'Requests',
            type: 'column',
            color: '#B9C5FF',
            fontColor: '#898989',
            unit: '',
            yAxis: 1,
            data: []
          }, {
            name: 'Failed Requests',
            type: 'column',
            color: '#DD172B',
            fontColor: '#898989',
            unit: '',
            pointPadding: 0, // 通过 pointPadding 和 pointPlacement 控制柱子位置
            pointPlacement: 0,
            yAxis: 1,
            data: []
          }, {
            name: 'Response time',
            type: 'line',
            color: '#4E68FF',
            fontColor: '#0A0A0A',
            unit: 'ms',
            data: []
          }, {
            name: 'Throughputs',
            type: 'line',
            color: '#4E68FF',
            fontColor: '#0A0A0A',
            unit: '/s',
            data: []
          }]
        }
      },
      columns: [],
      legends: [],
      tabList: [{
        title: '响应时间',
        value: 'avg_res_time',
        subTit: '接口最慢排名',
        legends: [{
          title: 'Requests time',
          color: '#526CFF',
          chartType: 'line'
        }, {
          title: 'Requests',
          color: '#B9C5FF',
          chartType: 'column'
        }],
        columns: [{
          columnWidth: '300px',
          name: '接口',
          textAlign: 'left',
          code: 'path',
          type: 'link_label'
        }, {
          columnWidth: '300px',
          name: '名称',
          textAlign: 'left',
          code: 'name',
          type: 'text'
        }, {
          columnWidth: '300px',
          name: '总耗时',
          textAlign: 'left',
          code: 'total_rep_time',
          type: 'sliver',
          sortOrder: 'none',
          sortAbled: true
        }, {
          columnWidth: '',
          name: '平均响应时间',
          textAlign: 'right',
          code: 'avg_rep_time',
          unit: 'ms',
          type: 'text',
          sortOrder: 'none',
          sortAbled: true,
          textAiignWithoutIcon: true
        }]
      }, {
        title: '失败率',
        value: 'req_error_rate',
        subTit: '接口失败次数TOP排名',
        legends: [{
          title: 'Failure rate',
          color: '#526CFF',
          chartType: 'line'
        }, {
          title: 'Failed Requests',
          color: '#DC1025',
          chartType: 'column'
        }, {
          title: 'Requests',
          color: '#B9C5FF',
          chartType: 'column'
        }],
        columns: [{
          columnWidth: '300px',
          name: '接口',
          textAlign: 'left',
          code: 'path',
          type: 'link_label'
        }, {
          columnWidth: '300px',
          name: '名称',
          textAlign: 'left',
          code: 'name',
          type: 'text'
        }, {
          columnWidth: '300px',
          name: '失败次数',
          textAlign: 'right',
          code: 'error_count',
          type: 'sliver',
          sortOrder: 'none',
          sortAbled: true,
          textAiignWithoutIcon: true
        }, {
          columnWidth: '',
          name: '失败率',
          textAlign: 'right',
          code: 'error_rate',
          unit: '%',
          type: 'text',
          sortOrder: 'none',
          sortAbled: true,
          textAiignWithoutIcon: true
        }]
      }, {
        title: '吞吐量',
        value: 'throughput',
        subTit: '接口调用次数最多排名',
        legends: [{
          title: 'Throughputs',
          color: '#526CFF',
          chartType: 'line'
        }, {
          title: 'Requests',
          color: '#B9C5FF',
          chartType: 'column'
        }],
        columns: [{
          columnWidth: '300px',
          name: '接口',
          textAlign: 'left',
          code: 'path',
          type: 'link_label'
        }, {
          columnWidth: '300px',
          name: '名称',
          textAlign: 'left',
          code: 'name',
          type: 'text'
        }, {
          columnWidth: '',
          name: '调用次数',
          textAlign: 'right',
          code: 'total_call_num',
          type: 'text',
          unit: '次',
          sortOrder: 'none',
          sortAbled: true,
          textAiignWithoutIcon: true
        }]
      }],
      tab_active_index: 0,
      tableData: [],
      // table行 hover 的pop位置
      clientX: -1000,
      clientY: -1000,
      // table点击 更多按钮 的行data
      currentClickItem: false,
      // table当前hover的行data
      currentHoverItem: false,
      // table点击 更多按钮 的pop位置
      click_pop_position: {},
      isChange: false,
      // 总耗时  用于计算占比
      avg_totalSum: 0,
      // 总失败次数  用于计算占比
      error_totalSum: 0,
      keysValue: ['code', 'name'],
      filterKeys: [{
        name: '名称',
        code: 'endpoint',
        type: 'select_obj',
        list: []
      }, {
        name: 'HTTP code',
        code: 'status_code',
        list: [{
          label: 'HTTP code 5xx',
          value: '5xx'
        }, {
          label: 'HTTP code 4xx',
          value: '4xx'
        }, {
          label: 'no HTTP code',
          value: '-'
        }, {
          label: 'Custom HTTP code',
          value: 'custom'
        }],
        type: 'select_custom_input_obj'
      }, {
        name: '业务代码',
        code: 'status',
        type: 'input'
      }, {
        name: '响应时间',
        code: 'resp_time',
        input_type: 'number',
        opt_symbol: '>',
        unit: 'ms',
        type: 'input'
      }]
    }
  },
  computed: {
    menuState () {
      return this.$store.state.openMenu
    }
  },
  watch: {
    menuState (newVal) {
      // console.log('左菜单伸缩state变化')
      // 菜单变化  echart图表自适应
      this.$nextTick(() => {
        this.$refs.pie_chart001.drawChart(this.pieChartOptions[0].option)
        this.$refs.pie_chart002.drawChart(this.pieChartOptions[1].option)
        this.$refs.healthlineChart.drawChart(this.healthChartOption.option)
        this.$refs.columnChart.drawChart(this.columnLineChartOption.option)
      })
    }
  },
  methods: {
    searchBarFunc () {
      this.tableDataTypeFunc()
      // if (this.query) {
      //   let findStr = this.query.toLowerCase()
      //   this.tableData = this.tableData.filter(row => row.path.toLowerCase().indexOf(findStr) > -1)
      // }
    },
    goRouter (item) {
      this.$router.push({name: item.routerTo, params: this.detailData})
    },
    linkLabelClick (row) {
      this.$router.push({
        name: 'serviceApiDetail',
        params: {
          detailData: this.detailData,
          detailApi: row,
          showComponent: {
            setFirstOpen: true,
            fcExt: this.fcExt,
            serGo: this.serGo,
            name: '服务接口'
          },
          fromPage: 'monitorService'
        }
      }
      )
      // const routerParam = {
      //   path: row.path,
      //   code: this.detailData.code,
      //   stepperNmae: this.detailData.name
      // }
      // window.localStorage.setItem('routerParam', JSON.stringify(routerParam))
    },
    // 自定义排序
    changeOrder (column, sortkey) {
      this.isChange = true
      let destOrder = (column.sortOrder === 'none' || !column.sortOrder) ? 'asc' : column.sortOrder === 'asc' ? 'desc' : column.sortOrder === 'desc' ? 'asc' : 'none'
      this.columns.forEach(column => {
        if (column.sortAbled) {
          column.sortOrder = 'none'
        }
      })
      column.sortOrder = destOrder
      this.tableData = this.sortFunc(this.tableData, sortkey, destOrder)
      this.$nextTick(() => {
        this.isChange = false
      })
      // console.log('sortArr', this.tableData)
    },
    sortFunc (arr, key, type) {
      switch (type) {
        case 'asc':
          // 从小到大
          let min
          for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < arr.length; j++) {
              if (arr[i][key] > arr[j][key]) {
                min = arr[j]
                arr[j] = arr[i]
                arr[i] = min
              }
            }
          }
          break
        case 'desc':
          // 从大到小
          let max
          // 遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
          for (let i = 0; i < arr.length; i++) {
            // 外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
            for (let j = i; j < arr.length; j++) {
              if (arr[i][key] < arr[j][key]) {
                // 如果arr[j]大就把此时的值赋值给最大值变量max
                max = arr[j]
                arr[j] = arr[i]
                arr[i] = max
              }
            }
          }
          break
      }
      return arr
    },
    async tabClick (item, index) {
      this.isChange = true
      this.tab_active_index = index
      this.columns = JSON.parse(JSON.stringify(item.columns))
      this.legends = item.legends
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.avg_totalSum = 0
      this.error_totalSum = 0
      this.query = ''
      switch (item.value) {
        case 'avg_res_time':
          this.columnLineChartOption.option.yAxis[0].labels.format = '{value} ms'
          this.columnLineChartOption.option.yAxis[1].labels.format = '{value}'
          this.columnLineChartOption.option.series[2].unit = 'ms'
          this.columnLineChartOption.option.yAxis[1].visible = true
          this.columnLineChartOption.option.series[0].yAxis = 1
          this.columnLineChartOption.option.series[2].name = 'Requests time'
          this.columnLineChartOption.option.series[1].data = []
          this.columnLineChartOption.option.series[2].data = []
          this.columnLineChartOption.option.series[0].data = []
          await this.nxmc_app_avg_res_time_get()
          this.$refs.columnChart.drawChart(this.columnLineChartOption.option)
          break
        case 'req_error_rate':
          this.tableData.forEach(DATA => {
            this.error_totalSum = this.error_totalSum + DATA.error_count
          })
          this.columnLineChartOption.option.yAxis[0].labels.format = '{value} %'
          this.columnLineChartOption.option.yAxis[1].labels.format = '{value}'
          this.columnLineChartOption.option.series[2].unit = '%'
          this.columnLineChartOption.option.series[0].yAxis = 1
          this.columnLineChartOption.option.yAxis[1].visible = true
          this.columnLineChartOption.option.series[2].name = 'Failed rate'
          this.columnLineChartOption.option.series[1].data = []
          this.columnLineChartOption.option.series[2].data = []
          this.columnLineChartOption.option.series[0].data = []
          await this.nxmc_app_error_rate_get()
          this.$refs.columnChart.drawChart(this.columnLineChartOption.option)
          break
        case 'throughput':
          this.columnLineChartOption.option.yAxis[0].labels.format = '{value} /s'
          this.columnLineChartOption.option.yAxis[1].labels.format = '{value}'
          this.columnLineChartOption.option.series[2].unit = '/s'
          this.columnLineChartOption.option.yAxis[1].visible = true
          this.columnLineChartOption.option.series[0].yAxis = 1
          this.columnLineChartOption.option.series[2].name = 'Throughputs'
          this.columnLineChartOption.option.series[1].data = []
          this.columnLineChartOption.option.series[2].data = []
          this.columnLineChartOption.option.series[0].data = []
          await this.nxmc_app_throughput_get()
          this.$refs.columnChart.drawChart(this.columnLineChartOption.option)
          break
      }
      this.tableDataTypeFunc()
    },
    mouseEnterTr (event, trIndex) {
      // this.currentHoverItem = this.tableData[trIndex]
      // // 330 为距离左边的距离 ui设计
      // this.clientX = event.pageX - event.offsetX + 330
      // // 240为弹窗高度； 16是ui设计距离
      // this.clientY = event.pageY - event.offsetY - 240 - 16
    },
    mouseLeaveTr (event, trIndex) {
      // this.currentHoverItem = false
      // this.clientX = -1000
      // this.clientY = -1000
    },
    tbFilterClick (trItem) {
      let findIndex = this.filterModelValues.findIndex(row => row.code === 'endpoint')
      if (findIndex > -1) {
        if (this.filterModelValues[findIndex].value !== trItem.path) {
          this.filterModelValues[findIndex].value = trItem.path
          this.filterModelValues[findIndex].value_label = trItem.name
          this.query = ''
        } else {
          return
        }
      } else {
        this.filterModelValues.push({
          key: '名称',
          code: 'endpoint',
          value: trItem.path,
          value_label: trItem.name
        })
        this.query = ''
      }
      // this.$refs.tagsInput.setModelValues(this.filterModelValues)
      this.nxmc_app_health_index_get()
      this.tabClick(this.tabList[this.tab_active_index], this.tab_active_index)
    },
    tbMoreClick (event, trItem) {
      const eventRect = event.target.getBoundingClientRect()
      const tableRect = this.$refs.table.getBoundingClientRect()

      this.click_pop_position = {
        x: eventRect.x - tableRect.x - 160 + eventRect.width,
        y: eventRect.y - tableRect.y - 142 + eventRect.height
      }

      this.tableData.forEach(data => {
        data.show_click_pop = false
      })
      trItem.show_click_pop = true
      this.currentClickItem = trItem
    },
    skipPage (type, currentClickItem) {
      this.$router.push({
        name: type,
        params: {
          fromType: 'monitorApi',
          detailData: {
            queryStr: currentClickItem.path,
            logType: 'envoy_access'
          },
          logFiltersModel: [
            {
              key: 'path',
              value: 'is',
              value_label: currentClickItem.path
            },
            {
              key: 'sr_service_code',
              value: 'is',
              value_label: this.detailData.code
            }
          ],
          filtersModel: [
            {
              key: '链路名称',
              code: 'name',
              value: currentClickItem.path,
              value_label: currentClickItem.path
            },
            {
              key: '上游服务',
              code: 'sr_service_code',
              value: this.detailData.code,
              value_label: this.detailData.name
            }
          ]
        }
      })
    },
    closeClickPop (trItem) {
      this.currentClickItem = false
      this.tableData.forEach(data => {
        data.show_click_pop = false
      })
    },
    // 过滤条件 调用
    returnFilterFunc (data) {
      console.log('过滤条件回传', data)
      this.filterModelValues = data
      this.nxmc_app_health_index_get()
      this.tabClick(this.tabList[this.tab_active_index], this.tab_active_index)
    },
    handleCommonParams (isTable = false) {
      let postParams = {
        service_code: this.detailData.code
      }
      if (this.time_range && this.time_range.code) {
        postParams.time_range = this.time_range.code
      } else {
        postParams.start_time = this.time_range.start_time
        postParams.end_time = this.time_range.end_time
      }
      if (this.query) {
        postParams.query = this.query
      }
      if (this.filterModelValues.length) {
        let filters = {}
        this.filterModelValues.forEach(data => {
          filters[data.code] = data.value
        })
        postParams.filters = [filters]
      }
      return postParams
    },
    chartSwitch (data, type) {
      switch (type) {
        case 'req_count_top':
          this.$refs.lineChart.drawPie(data)
          break
        case 'avg_resp_time_top':
          this.$refs.lineChart.drawPie(data)
          break
        case 'error_req_count_top':
          this.$refs.lineChart.drawPie(data)
          break
        case 'health_level':
          this.$refs.lineChart.drawPie(data)
          break
      }
    },
    // 处理时间x轴 的显示
    handleXAxisFormats (type) {
      let dateLabelFormats = '%H:%M'
      if (this.time_range.code) {
        if (this.time_range.code === 'Last 72 hours' || this.time_range.code === 'Last 7 days' || this.time_range.code === 'Last 30 days') {
          // 大于一天
          dateLabelFormats = '%m-%d %H:%M'
        }
      } else {
        if (this.time_range.end_time - this.time_range.start_time > 24 * 60 * 60 * 1000) {
          // 大于一天
          dateLabelFormats = '%m-%d %H:%M'
        }
      }
      this[type].option.xAxis.tickPixelInterval = 150
      this[type].option.xAxis.showFirstLabel = true
      this[type].option.xAxis.dateTimeLabelFormats = {
        data: dateLabelFormats
      }
      this[type].option.xAxis.labels = {
        formatter () {
          let labelVal = HighCharts.dateFormat(dateLabelFormats, this.value)
          let reallyVal = ''
          if (labelVal) {
            let arr = labelVal.split(' ')
            if (labelVal.length <= 5) {
              reallyVal = arr[0]
            } else {
              reallyVal = arr[0] + '<br/>' + arr[1]
            }
          }
          return reallyVal
        }
      }
    },
    // 获取指标 - 应用健康指数
    async nxmc_app_health_index_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('healthChartOption')
      SERVICE_HEALTH_INDEX(params).then(res => {
        if (res.code === 0) {
          console.log('应用健康指数@@@', res)
          // 左上半环
          this.healthTotal = res.data.total.toFixed(0)
          if (res.data.total >= this.healthPositions[2]) {
            this.headthEvaluate = '健康'
            this.pieChartOptions[0].option.series[0].data[0].color = '#2AB06F'
          } else if (res.data.total >= this.healthPositions[1] && res.data.total < this.healthPositions[2]) {
            this.pieChartOptions[0].option.series[0].data[0].color = '#F5D30F'
            this.headthEvaluate = '异常'
          } else if (res.data.total < this.healthPositions[1]) {
            this.pieChartOptions[0].option.series[0].data[0].color = '#DC172A'
            this.headthEvaluate = '危险'
          }
          this.pieChartOptions[0].option.series[0].data[0].y = res.data.total
          this.pieChartOptions[0].option.series[0].data[1].y = 100 - res.data.total
          this.$refs.pie_chart001.drawChart(this.pieChartOptions[0].option)
          // 右上 环形
          if (res.data.health_level) {
            res.data.health_level.data.forEach((data, index) => {
              this.pieChartOptions[1].option.series[0].data[index].y = data
            })
            this.$refs.pie_chart002.drawChart(this.pieChartOptions[1].option)
          }
          // 健康指数图
          let handleData = []
          res.data.series[0].data.forEach((el, index) => {
            // 把字符串类型专程Date类型
            let someDate = new Date(Date.parse(res.data.xAxis[index]))
            // 进行Date.UTC处理
            let tms = res.data.xAxis[index].indexOf(':') > -1 ? Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(), someDate.getMinutes()) : Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), 0, 0)
            handleData.push([tms, el])
          })
          // 计算彩红柱子的x轴坐标
          let min = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes())
          if (handleData.length > 1) {
            min = handleData[0][0] - (handleData[1][0] - handleData[0][0])
            this.healthChartOption.option.series[3].pointInterval = min
          } else if (handleData.length === 1) {
            min = handleData[0][0] - 3600000
            this.healthChartOption.option.series[3].pointInterval = 3600000
          }
          this.healthChartOption.option.series[3].pointStart = handleData.length && handleData[0][0]
          // 左边的彩柱子
          this.healthChartOption.option.xAxis.min = min
          this.healthChartOption.option.series[0].data = [[min, parseFloat((this.healthPositions[3] - this.healthPositions[2]).toFixed(2))]]
          this.healthChartOption.option.series[1].data = [[min, parseFloat((this.healthPositions[2] - this.healthPositions[1]).toFixed(2))]]
          this.healthChartOption.option.series[2].data = [[min, this.healthPositions[1]]]
          this.healthChartOption.option.series[3].data = handleData
          if (!handleData.length) {
            // 后台无返回数据时，让彩虹柱子靠左
            this.healthChartOption.option.series[3].data = [[min + 3600000, -1]]
          }
          console.log('this.healthChartOption.option', this.healthChartOption.option)
          this.$refs.healthlineChart.drawChart(this.healthChartOption.option)
        }
      })
    },
    // 获取健康指标 y轴范围柱子 彩色
    nxmc_setting_health_index_info_get () {
      let _this = this
      NXDF_SETTING_HEALTH_INDEX_INFO_GET({}).then(res => {
        if (res.code === 0) {
          res.data.health_index_configs.forEach(data => {
            let arr = [0]
            this.healthObj = {}
            res.data.health_index_configs.forEach(data => {
              arr.push(data.max_value)
              this.healthObj[data.max_value] = data.name
            })
            this.healthPositions = arr
            this.healthChartOption.option.yAxis[0].tickPositions = arr
            this.healthChartOption.option.yAxis[1].tickPositions = arr
            this.healthChartOption.option.yAxis[0].plotLines.forEach((it, index) => {
              it.value = arr[index + 1]
            })
            this.healthChartOption.option.yAxis[1].labels = {
              formatter () {
                let result = _this.healthObj
                return result[this.value]
              },
              style: {
                color: 'rgb(102, 102, 102)',
                whiteSpace: 'nowrap',
                fontSize: 10
              }
            }
          })
          // this.$refs['healthlineChart'].drawChart(this.healthChartOption.option)
          // 健康接口重复调用注释
          // this.nxmc_app_health_index_get()
        }
      })
    },
    // 获取指标 - 应用平均响应时间
    async nxmc_app_avg_res_time_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('columnLineChartOption')
      return SERVICE_AVG_RES_TIME(params).then(res => {
        if (res.code === 0) {
          console.log('服务平均响应时间', res)
          let handelData = {
            'response_time': [],
            'requests': []
          }
          if (res.data.xAxis.length !== 0) {
            res.data.xAxis.forEach((el, index) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(el))
              // 进行Date.UTC处理
              let tms = el.indexOf(':') > -1 ? Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(), someDate.getMinutes()) : Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), 0, 0)
              res.data.series.forEach(el1 => {
                let itemData = []
                if (el1.data.length !== 0) {
                  itemData = [tms, el1.data[index]]
                } else {
                  itemData = [tms, 0]
                }
                if (el1.code === 'Response time') {
                  handelData.response_time.push(itemData)
                } else if (el1.code === 'Reuqests') {
                  handelData.requests.push(itemData)
                }
              })
            })
          }
          this.columnLineChartOption.option.series[2].data = handelData.response_time
          this.columnLineChartOption.option.series[0].data = handelData.requests
        }
      })
    },
    // 获取指标 - 应用失败率
    async nxmc_app_error_rate_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('columnLineChartOption')
      return SERVICE_REQ_ERROR_RATE(params).then(res => {
        if (res.code === 0) {
          console.log('服务失败率', res)
          let handelData = {
            'failure_rate': [],
            'failure_requests': [],
            'requests': []
          }
          if (res.data.xAxis.length !== 0) {
            res.data.xAxis.forEach((el, index) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(el))
              // 进行Date.UTC处理
              let tms = el.indexOf(':') > -1 ? Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(), someDate.getMinutes()) : Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), 0, 0)
              res.data.series.forEach(el1 => {
                let itemData = []
                if (el1.data.length !== 0) {
                  itemData = [tms, el1.data[index]]
                } else {
                  itemData = [tms, 0]
                }
                if (el1.code === 'Failure rate') {
                  handelData.failure_rate.push(itemData)
                } else if (el1.code === 'Requests') {
                  handelData.requests.push(itemData)
                } else if (el1.code === 'Failure requests') {
                  handelData.failure_requests.push(itemData)
                }
              })
            })
          }
          this.columnLineChartOption.option.series[0].data = handelData.requests
          this.columnLineChartOption.option.series[1].data = handelData.failure_requests
          this.columnLineChartOption.option.series[2].data = handelData.failure_rate
        }
      })
    },
    // 获取指标 - 应用吞吐量
    async nxmc_app_throughput_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('columnLineChartOption')
      return SERVICE_THROUGHPUT(params).then(res => {
        if (res.code === 0) {
          console.log('服务吞吐量', res)
          let handelData = {
            'throughput': [],
            'requests': []
          }
          if (res.data.xAxis.length !== 0) {
            res.data.xAxis.forEach((el, index) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(el))
              // 进行Date.UTC处理
              let tms = el.indexOf(':') > -1 ? Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(), someDate.getMinutes()) : Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), 0, 0)
              res.data.series.forEach(el1 => {
                let itemData = []
                if (el1.data.length !== 0) {
                  itemData = [tms, el1.data[index]]
                } else {
                  itemData = [tms, 0]
                }
                if (el1.code === 'Throughput') {
                  handelData.throughput.push(itemData)
                } else if (el1.code === 'Requests') {
                  handelData.requests.push(itemData)
                }
              })
            })
          }
          this.columnLineChartOption.option.series[2].data = handelData.throughput
          this.columnLineChartOption.option.series[0].data = handelData.requests
        }
      })
    },
    tableDataTypeFunc () {
      switch (this.tab_active_index) {
        case 0:
          this.nxmc_app_interfaces_call_count_get()
          break
        case 1:
          this.nxmc_app_interfaces_slow_call_get()
          break
        case 2:
          this.nxmc_app_interfaces_error_rate_get()
          break
      }
    },
    // 获取table - 接口调用量
    async nxmc_app_interfaces_error_rate_get () {
      let params = await this.handleCommonParams(true)
      SERVICE_INTERFACE_CALL_COUNT(params).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.$nextTick(() => {
            this.isChange = false
          })
        }
      })
    },
    // 获取table - 接口错误率
    async nxmc_app_interfaces_slow_call_get () {
      let params = await this.handleCommonParams(true)
      SERVICE_INTERFACE_ERROR_RATE(params).then(res => {
        if (res.code === 0) {
          this.error_totalSum = 0
          this.tableData = res.data.data
          this.tableData.forEach(DATA => {
            this.error_totalSum = this.error_totalSum + DATA.error_count
          })
          this.$nextTick(() => {
            this.isChange = false
          })
        }
      })
    },
    // 获取table - 接口慢调用
    async nxmc_app_interfaces_call_count_get () {
      let params = await this.handleCommonParams(true)
      SERVICE_INTERFACE_SLOW_CALL(params).then(res => {
        if (res.code === 0) {
          this.avg_totalSum = 0
          this.tableData = res.data.data
          this.tableData.forEach(DATA => {
            this.avg_totalSum = this.avg_totalSum + DATA.total_rep_time
          })
          this.$nextTick(() => {
            this.isChange = false
          })
        }
      })
    },
    // 获取应用名称过滤项
    getEndpointList () {
      let List = []
      let params = {
        mesh_code: this.detailData.code,
        page: 1,
        page_size: PAGESIZE
      }
      MESH_ENDPOINT_LIST(params).then(res => {
        if (res.code === 0) {
          res.data.endpoints.forEach(DATA => {
            List.push({
              label: DATA.name,
              value: DATA.endpoint
            })
          })
        }
      })
      this.filterKeys[0].list = List
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    bus.$on('timeChanged', (obj) => {
      this.time_range = obj
      this.nxmc_app_health_index_get()
      this.tabClick(this.tabList[this.tab_active_index], this.tab_active_index)
    })
    bus.$emit('resetTime')
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.$set(this.stepper[1], 'name', this.detailData.name)
      this.getEndpointList()
      this.tab_active_index = 0
      // this.tabClick(this.tabList[0], 0)
      this.nxmc_setting_health_index_info_get()

      if (this.detailData.standard && this.detailData.code !== 'nxgw') this.fcExt = true
      if (this.detailData.standard || (!this.detailData.standard && !this.detailData.component)) this.serGo = true
    } else {
      this.$router.push({name: 'serviceList'})
    }
  },
  components: {
    stepper,
    charts,
    // tagsInput,
    searchBar
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";
  @import './monitorService.less';
</style>
