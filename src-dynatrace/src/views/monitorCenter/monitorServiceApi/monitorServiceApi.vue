<template>
  <div class="wrapper">
    <stepper :stepper="stepper" @goRouter="goRouter" theme="blue"></stepper>
    <div class="monitorApplication">
      <DYPageHeader theme="blue" icon="API" :title="detailApi.name"/>
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
          theme="blue"
          :tab-list="tabList"
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
                <!-- <svg v-if="item.chartType === 'line'">
                  <path fill="none" d="M 0 11 L 16 11" class="highcharts-graph" :stroke="item.color" stroke-width="2"></path>
                </svg>
                <svg v-if="item.chartType === 'column'">
                  <path fill="none" d="M 1.6 16 L 1.6 10 L 2.4000000000000004 10 L 2.4000000000000004 16 M 5.6000000000000005 16 L 5.6000000000000005 4 L 6.4 4 L 6.4 16 M 9.600000000000001 16 L 9.600000000000001 12 L 10.4 12 L 10.4 16 M 13.600000000000001 16 L 13.600000000000001 8 L 14.4 8 L 14.4 16" :stroke="item.color" stroke-width="1" stroke-opacity="1"></path>
                </svg> -->
              </div>
              <span class="legent_item_tit">{{item.title}}</span>
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
import searchBar from 'components/searchBar/searchBar.vue'
import '@/directives/currency.js'
/* eslint-disable-next-line */
import {
  NXDF_SETTING_HEALTH_INDEX_INFO_GET,
  NXMC_SERVICE_INTERFACE_AVG_RES_TIME_GET,
  NXMC_SERVICE_INTERFACE_HEALTH_INDEX_GET,
  NXMC_SERVICE_INTERFACE_REQ_ERROR_RATE_GET,
  NXMC_SERVICE_INTERFACE_THROUGHPUT_GET
} from '@/api'
import {healthLineChartOption} from '@/common/mock/usdeur'

export default {
  data () {
    return {
      tabTheme: 'service',
      time_range: {code: 'Last 30 minutes'},
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
          routerTo: 'serviceList',
          step: 1
        },
        {
          name: '服务title',
          routerTo: 'serviceDetail',
          step: 2
        },
        {
          name: '服务监控',
          routerTo: 'monitorService',
          step: 3
        },
        {
          name: '接口监控',
          routerTo: '',
          step: 4
        }
      ],
      pieChartOptions: [
        {
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
      legends: [],
      tabList: [{
        title: '响应时间',
        value: 'avg_res_time',
        subTit: '应用最慢排名',
        legends: [{
          title: 'Requests time',
          color: '#526CFF',
          chartType: 'line'
        }, {
          title: 'Requests',
          color: '#B9C5FF',
          chartType: 'column'
        }]
      }, {
        title: '失败率',
        value: 'req_error_rate',
        subTit: '应用失败次数TOP排名',
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
        }]
      }, {
        title: '吞吐量',
        value: 'throughput',
        subTit: '应用调用次数最多排名',
        legends: [{
          title: 'Throughputs',
          color: '#526CFF',
          chartType: 'line'
        }, {
          title: 'Requests',
          color: '#B9C5FF',
          chartType: 'column'
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
      }],

      detailApi: {}
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
    goRouter (item) {
      if (item.routerTo === 'serviceApi') {
        this.$router.push({
          name: 'serviceApi',
          params: {
            showComponent: {name: '服务接口', code: 'serviceApi', serGo: true, fcExt: true},
            stepper: this.$route.params.stepper,
            detailData: this.todetailData
          }
        })
      } else if (item.routerTo === 'deployGroupDetail') {
        this.$router.push({
          name: 'deployGroupDetail',
          params: this.todetailData
        })
      } else if (item.routerTo === 'serviceApiDetail') {
        this.$router.push({
          name: 'serviceApiDetail',
          params: {
            detailData: this.todetailData,
            detailApi: this.detailApi,
            showComponent: {
              name: '服务接口',
              code: 'serviceApi',
              fcExt: this.fcExt,
              serGo: this.serGo
            }
          }
        })
      } else if (item.routerTo === 'deployGroupServiceApiDetail') {
        let stepper = [].concat(this.stepper)

        stepper.pop()

        this.$router.push({
          name: 'deployGroupServiceApiDetail',
          params: {
            fromDeployGroupDetail: true,
            detailData: this.todetailData,
            detailApi: this.detailApi,
            fromRouter: stepper
          }
        })
      } else {
        this.$router.push({name: 'serviceDetail', params: this.todetailData})
      }
    },
    linkLabelClick (row) {
      console.log(row)
    },
    // 自定义排序
    changeOrder (column, sortkey) {
      this.isChange = true
      let destOrder = (column.sortOrder === 'none' || !column.sortOrder) ? 'asc' : column.sortOrder === 'asc' ? 'desc' : column.sortOrder === 'desc' ? 'asc' : 'none'
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
      this.legends = item.legends
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
      this.avg_totalSum = 0
      this.error_totalSum = 0
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
          await this.nxmc_api_avg_res_time_get()
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
          await this.nxmc_api_error_rate_get()
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
          await this.nxmc_api_throughput_get()
          this.$refs.columnChart.drawChart(this.columnLineChartOption.option)
          break
      }
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
          this.filterModelValues[findIndex].value_label = trItem.path
          this.query = ''
        } else {
          return
        }
      } else {
        this.filterModelValues.push({
          key: '名称',
          code: 'endpoint',
          value: trItem.path,
          value_label: trItem.path
        })
        this.query = ''
      }
      // this.$refs.tagsInput.setModelValues(this.filterModelValues)
      this.nxmc_api_health_index_get()
      this.tabClick(this.tabList[this.tab_active_index], this.tab_active_index)
    },
    // tbMoreClick (event, trItem) {
    //   this.click_pop_position = {
    //     x: event.pageX - 175,
    //     y: event.pageY - 150
    //   }
    //   this.tableData.forEach(data => {
    //     data.show_click_pop = false
    //   })
    //   trItem.show_click_pop = true
    //   this.currentClickItem = trItem
    // },
    // skipPage (type, currentClickItem) {
    //   this.$router.push({
    //     name: type,
    //     params: {
    //       fromtType: 'monitorApi',
    //       detailData: { ...currentClickItem, logType: 'envoy_access' }
    //     }
    //   })
    // },
    // closeClickPop (trItem) {
    //   this.currentClickItem = false
    //   this.tableData.forEach(data => {
    //     data.show_click_pop = false
    //   })
    // },
    // 过滤条件 调用
    returnFilterFunc (data) {
      console.log('过滤条件回传', data)
      this.filterModelValues = data
      this.nxmc_api_health_index_get()
      this.tabClick(this.tabList[this.tab_active_index], this.tab_active_index)
    },
    handleCommonParams (isTable = false) {
      let postParams = {
        namespace: this.namespace_code,
        // path: this.detailApi.endpoint
        path: this.detailApi.path
      }
      if (this.stepper[0].name === '部署组') {
        postParams.service_code = this.todetailData.mesh_code
      } else {
        postParams.service_code = this.routerParam.code
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
              [reallyVal] = arr
            } else {
              reallyVal = arr[0] + '<br/>' + arr[1]
            }
          }
          return reallyVal
        }
      }
    },
    // 获取指标 - 接口健康指数
    async nxmc_api_health_index_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('healthChartOption')
      NXMC_SERVICE_INTERFACE_HEALTH_INDEX_GET(params).then(res => {
        if (res.code === 0) {
          console.log('健康指数@@@', res)
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
          console.log('this.pieChartOptions[1].option.series', this.pieChartOptions[1].option.series)
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
          // this.nxmc_api_health_index_get()
        }
      })
    },
    // 获取指标 - 接口平均响应时间
    async nxmc_api_avg_res_time_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('columnLineChartOption')
      return NXMC_SERVICE_INTERFACE_AVG_RES_TIME_GET(params).then(res => {
        if (res.code === 0) {
          console.log('接口平均响应时间', res)
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
    // 获取指标 - 接口失败率
    async nxmc_api_error_rate_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('columnLineChartOption')
      return NXMC_SERVICE_INTERFACE_REQ_ERROR_RATE_GET(params).then(res => {
        if (res.code === 0) {
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
    // 获取指标 - 接口吞吐量
    async nxmc_api_throughput_get () {
      let params = await this.handleCommonParams()
      await this.handleXAxisFormats('columnLineChartOption')
      return NXMC_SERVICE_INTERFACE_THROUGHPUT_GET(params).then(res => {
        if (res.code === 0) {
          console.log('接口吞吐量', res)
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
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    bus.$on('timeChanged', (data) => {
      this.time_range = {}
      this.time_range = data
      this.nxmc_api_health_index_get()
      this.tabClick(this.tabList[this.tab_active_index], this.tab_active_index)
    })
    bus.$emit('resetTime')
  },
  created () {
    this.namespace_code = window.localStorage.getItem('namespace_code')
    this.routerParam = JSON.parse(window.localStorage.getItem('routerParam'))
    if (this.$route.params.todetailData) {
      this.stepper = []
      this.todetailData = this.$route.params.todetailData
      this.detailApi = this.$route.params.detailApi
      let step = [{
        name: '接口监控',
        routerTo: ''
      }]
      this.stepper = [...this.$route.params.stepper, ...step]
      this.$set(this.stepper[this.stepper.length - 1], 'type', 'edit')
    } else {
      if (this.routerParam && this.routerParam.stepperName) {
        this.$set(this.stepper[1], 'name', this.routerParam.stepperName)
      }
    }

    if (this.stepper[0].name === '部署组') {
      this.tabTheme = 'deploy-group'
    }

    if (this.todetailData) {
      if (this.todetailData.standard && this.todetailData.code !== 'nxgw') this.fcExt = true
      if (this.todetailData.standard || (!this.todetailData.standard && !this.todetailData.component)) this.serGo = true
    }

    // this.tabClick(this.tabList[0], 0)
    this.nxmc_setting_health_index_info_get()
  },
  components: {
    stepper,
    charts,
    searchBar
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";
  @import './monitorServiceApi';

  .empty {
    width: 100%;

    .iconrecords {
      width: 80px;
      height: 83px;
      margin-top: 29px;
      font-size: 80px;
    }

    span {
      margin-left: 10px;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
    }
  }
</style>
