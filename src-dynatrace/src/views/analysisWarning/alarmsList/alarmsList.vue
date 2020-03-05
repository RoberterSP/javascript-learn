<template>
  <div class="alarmsList">
    <stepper :stepper="stepper" theme="red"></stepper>
    <!-- <div class="init-app m24 p20" v-if="!first_load && !alarms_list">
    </div> -->

    <div class="m20" v-if="!showBlank">
      <tags-input ref="curTagsInput" :filterKeys="filterKeys" :keysValue="filterKeysValue" @returnFilterFunc="returnFilterFunc"></tags-input>
    </div>
    <!--  v-if="alarms_list && alarms_list.length" -->
    <div class="panel_box flex">
      <div class="panel-left" v-if="!showBlank">
        <div class="filter">
          <div class="filter-item" v-for="(filter, index) in filterKeys" :key="index" :class="{select:filter.selected}" @click="tofilter(filter, index)">
            <div class="up">{{filter.name}}</div>
            <div class="down">
              <div>{{filter.select_name}}</div>
              <div>编辑</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-right" :style="{padding: showBlank ? '24px' : ''}">
        <div class="p20" v-if="this_page === 'filter-view'">
          <div class="head_title">{{filterViewData.name}}</div>
          <div class="desc">{{filterViewData.desc}}</div>
          <!-- ntredio -->
          <div class="filter_list_div">
            <nt-redio class="category-list" v-if="hardRender" :name="filterViewData[filterKeysValue[0]]" :list="filterViewData.list" :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
            <div class="footer" v-if="showOptTooltip">
              <div class="tag default-label">是否保存修改？</div>
              <el-button class="btn-cancel" @click="cancelPage(filterViewData)">取消</el-button>
              <el-button class="btn-save" type="primary" :disabled="!isNeedSave" @click="savePage(filterViewData)">保存</el-button>
            </div>
            </div>
          </div>
        <div v-if="this_page === 'list'">
          <div class="p20">
            <div class="app-list-title">
              <h2 class="head default-label"><span v-if="!showBlank">{{no_alarms_list.length}}个未确认告警</span></h2>
              <el-button @click="goPage('warningStrategy')" v-if="isShowEle('warningStrategy')">设置告警策略</el-button>
            </div>

            <!-- 无告警列表时候的样式 -->
            <div v-if="showBlank" class="no-alarms">
              <div class="no-alarms-tips flex">
                <icon type="healthy" size="38" class="mr10"></icon>
                很健康，没有问题
              </div>

              <p style="margin-bottom: 55px">NXMC的监控系统持续监视应用程序的每个部分，并对问题进行不同级别的告警。对于每个问题都会显示具体影响、根本原因，并提供异常日志便于快速解决问题。</p>

              <div class="no-alarms-pics flex">
                <img  v-for="i in 3" :key="i" :src="`static/img/alarms-pic${i}.png`" alt="">
              </div>
            </div>

          </div>
          <div class="clumn_chart mlr20" v-if="showOverview">
            <charts style="width:100%" :ref="clumnChartOptions.id" :chartId="clumnChartOptions.id" :option="clumnChartOptions.option"></charts>
            <div class="sf_chart_legend">
              <div class="legend_item" v-for="(item, index) in legends" :key="index">
                <div class="legend_item_icon">
                  <img src="~@/assets/image/dynatrace/red_chart_column.svg" alt="" v-if="item.title==='Open problems'" />
                  <img src="~@/assets/image/dynatrace/gray_chart_column.svg" alt="" v-else />
                </div>
                <span class="legent_item_tit">{{item.title}}</span>
              </div>
            </div>
          </div>
          <div class="show_total_num plr20 ptb15" v-if="showOverview">
            共{{alarms_list.length}}个告警
            <span v-if="time_range_obj.code">（{{time_range_obj.code}}）</span>
            <span v-else>（{{time_range_obj.start_time}} 至 {{time_range_obj.end_time}}）</span>
          </div>
          <div class="grid-list">
            <div class="grid" :class="[item.ack_status?'sure':'nosure']" v-for="(item, index) in alarms_list" :key="index" @click="goSetAlarmsPolicePage(item)">
              <div class="gg_up" :class="[item.ack_status?'sured':'noSured']">
                <div class="ggu_left">
                  <img src="~@/assets/image/icon_alert.svg" alt="" />
                </div>
                <div class="ggu_right">
                  <div>
                    <div class="ggur_title">{{item.name}}</div>
                    <div class="ggur_appid">{{item.code}}</div>
                  </div>
                  <div class="state_label">{{item.ack_status ? '确认' : '未确认'}}</div>
                </div>
              </div>
              <div class="gg_down">
                <div class="ggd_line">
                  <div class="ggdl_value">告警时间</div>
                  <div class="ggdl_name default-label">{{item.alert_time}}</div>
                </div>
                <div class="ggd_line">
                  <div class="ggdl_value">告警级别</div>
                  <div class="ggdl_name default-label">{{item.level==='crit' ? '高' : item.level==='warn' ? '低' : ''}}</div>
                </div>
                <div class="ggd_line">
                  <div class="ggdl_value">通知方式</div>
                  <div class="ggdl_name default-label">{{item.notification_type_text}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './alarmsList.less'
import bus from '@/assets/eventBus.js'
import stepper from 'components/stepper/stepper.vue'
import ntRedio from 'components/base/redio.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import charts from '@/components/charts/charts.vue'
import HighCharts from 'highcharts'
import icon from 'components/base/icon.vue'

import {
  NXMC_ALERT_LIST_GET,
  NXMC_ALERT_OVERVIEW_GET,
  ALERT_RULE_LIST_GET,
  NOTIFICATION_TYPE_LIST
} from '@/api/index.js'
import { PAGESIZE } from 'common/util/common.js'
const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      // 强制渲染
      hardRender: true,
      time_range_obj: {code: 'Last 30 minutes'},
      showOverview: false,
      alarms_list: [],
      no_alarms_list: [],
      stepper: [
        {
          name: '告警列表',
          routerTo: 'alarmsList',
          step: 1
        }
      ],
      this_page: 'list', // list 默认列表
      redioKeyValue: ['value', 'label'],
      filterTagsInputData: [],
      filterKeys: [
        {
          name: '告警规则',
          code: 'alert_code',
          type: 'select_obj',
          select_name: '任意',
          selected: false,
          list: [{
            label: DEFAULT_NAME,
            value: DEFAULT_NAME,
            default: true
          }, {
            label: 'testchen1234',
            value: 'testchen123',
            default: false
          }]
        },
        {
          name: '告警级别',
          code: 'level',
          type: 'select_obj',
          select_name: '任意',
          selected: false,
          list: [{
            label: DEFAULT_NAME,
            value: DEFAULT_NAME,
            default: true
          }, {
            label: '高',
            value: 'crit',
            default: false
          }, {
            label: '低',
            value: 'warn',
            default: false
          }]
        },
        {
          name: '当前状态',
          code: 'state',
          type: 'select_obj',
          select_name: '任意',
          selected: false,
          list: [{
            label: DEFAULT_NAME,
            value: DEFAULT_NAME,
            default: true
          }, {
            label: '正常',
            value: 'normal',
            default: false
          }, {
            label: '警告',
            value: 'warning',
            default: false
          }, {
            label: '紧急',
            value: 'critical',
            default: false
          }, {
            label: '未知',
            value: 'unknown',
            default: false
          }]
        }, {
          name: '通知方式',
          code: 'notification_type',
          type: 'select_obj',
          select_name: '任意',
          selected: false,
          list: []
        }
      ],
      filterKeysCopy: [],
      filterKeysValue: ['code', 'name'],
      filtersModel: [],
      isNeedSave: false,
      showOptTooltip: false,
      redioInfo: {},
      filterViewData: {
        title: '',
        desc: '',
        name: '',
        code: '',
        type: 'select_obj',
        list: []
      },
      legends: [{
        title: 'Open problems',
        color: '#DD172B'
      }, {
        title: 'Resolved problems',
        color: '#b8b8b8'
      }],
      clumnChartOptions: {
        id: 'alarms_clumn_chart',
        option: {
          chart: {
            height: 200,
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
              day: '%m-%d %H:%M'
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
          }],
          legend: {
            enabled: false
          },
          tooltip: {
            dateTimeLabelFormats: {
              second: '%Y-%m-%d %H:%M:%S',
              minute: '%Y-%m-%d %H:%M',
              hour: '%Y-%m-%d %H',
              day: '%Y-%m-%d',
              year: '%Y-%m-%d'
            },
            shared: true,
            crosshairs: true,
            borderColor: '#67D5E0',
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<table><tr><td style="color: {series.userOptions.fontColor};line-height:20px;"><span style="color:{point.color}">\u25A0 </span> {series.name}: &nbsp;</td>' +
            '<td style="text-align: right"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 0
          },
          plotOptions: {
            column: {
              grouping: false,
              borderWidth: 0,
              // 最大的柱子宽
              pointWidth: 12,
              maxPointWidth: 15,
              states: {
                hover: {
                  opacity: 1
                },
                inactive: {
                  opacity: 1
                }
              }
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
            name: 'Resolved problems...',
            type: 'column',
            color: '#b8b8b8',
            fontColor: '#282828',
            data: []
          }, {
            name: 'Open problems.',
            type: 'column',
            color: '#DD172B',
            fontColor: '#818181',
            pointPadding: 0, // 通过 pointPadding 和 pointPlacement 控制柱子位置
            pointPlacement: 0,
            data: []
          }]
        }
      }
    }
  },
  computed: {
    menuState: function () {
      return this.$store.state.openMenu
    },
    showBlank () {
      return !this.$loading.isLoading() && !this.alarms_list.length && !this.filtersModel.length
    },
    isShowEle () {
      return key => {
        return this.$_hasRoute(key)
      }
    }
  },
  watch: {
    menuState: function (newVal) {
      // console.log('左菜单伸缩state变化')
      // 菜单变化  echart图表自适应
      if (this.showOverview) {
        this.$refs['alarms_clumn_chart'].drawChart(this.clumnChartOptions.option)
      }
    }
  },
  methods: {
    // 处理时间x轴 的显示
    handleXAxisFormats () {
      let dateLabelFormats = '%H:%M'
      if (this.time_range_obj.code) {
        if (this.time_range_obj.code === 'Last 72 hours' || this.time_range_obj.code === 'Last 7 days' || this.time_range_obj.code === 'Last 30 days') {
          // 大于一天
          dateLabelFormats = '%m-%d %H:%M'
        }
      } else {
        if (this.time_range_obj.end_time - this.time_range_obj.start_time > 24 * 60 * 60 * 1000) {
          // 大于一天
          dateLabelFormats = '%m-%d %H:%M'
        }
      }
      this.clumnChartOptions.option.xAxis.tickPixelInterval = 150
      this.clumnChartOptions.option.xAxis.showFirstLabel = true

      this.clumnChartOptions.option.xAxis.dateTimeLabelFormats = {
        data: dateLabelFormats
      }
      this.clumnChartOptions.option.xAxis.labels = {
        formatter: function () {
          var labelVal = HighCharts.dateFormat(dateLabelFormats, this.value)
          var reallyVal = ''
          if (labelVal) {
            var arr = labelVal.split(' ')
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
    notification_type_list () {
      NOTIFICATION_TYPE_LIST().then(res => {
        res.data.notification_types.forEach(item => {
          item.label = item.name
          item.value = item.code
          item.default = false
        })
        res.data.notification_types.unshift(
          {
            label: DEFAULT_NAME,
            value: DEFAULT_NAME,
            default: true
          }
        )
        this.$set(this.filterKeys[3], 'list', res.data.notification_types)
        ALERT_RULE_LIST_GET({page: 1, page_size: PAGESIZE}).then(x => {
          x.data.alert_rules.forEach(item => {
            item.label = item.name
            item.value = item.code
            item.default = false
          })
          x.data.alert_rules.unshift(
            {
              label: DEFAULT_NAME,
              value: DEFAULT_NAME,
              default: true
            }
          )
          this.$set(this.filterKeys[0], 'list', x.data.alert_rules)
          this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
        })
      })
    },
    goPage (name) {
      this.$router.push({
        name: name,
        params: {
          router_code: name
        }
      })
    },
    tofilter (filter, filterIndex) {
      this.this_page = 'filter-view'
      this.hardRender = false
      this.filterKeys = JSON.parse(JSON.stringify(this.filterKeysCopy))
      this.showOptTooltip = true
      this.filterKeys.forEach(x => {
        x.selected = false
      })
      filter.selected = true
      this.filterViewData = JSON.parse(JSON.stringify(this.filterKeys[filterIndex]))
      setTimeout(() => {
        this.hardRender = true
      }, 0)
      // console.log('this.filterViewData', filter)
    },
    redioChecked (name, checked) {
      console.log('redioChecked', name, checked)
      let obj = this.filterKeys.find(row => row[this.filterKeysValue[0]] === name)
      obj.list.forEach(el => {
        if (el[this.redioKeyValue[0]] === checked) {
          el.default = true
          // 当选中的内容有变 才放开保存按钮
          if (el[this.redioKeyValue[1]] !== obj.select_name) {
            this.isNeedSave = true
            this.redioInfo = {
              key: obj.name,
              code: name,
              value: checked,
              value_label: el[this.redioKeyValue[1]]
            }
          } else {
            this.isNeedSave = false
          }
        } else {
          el.default = false
        }
      })
      const index = this.filterKeys.findIndex(item => item.code === name)
      this.filterViewData = JSON.parse(JSON.stringify(this.filterKeys[index]))
      this.$forceUpdate()
    },
    goSetAlarmsPolicePage (row) {
      this.$router.push({
        name: 'alarmsDetail',
        params: {
          detailData: row
        }
      })
    },
    savePage () {
      // 选择过 需要保存的
      if (this.redioInfo.value) {
        let findobj = this.filterKeys.find(row => row.code === this.redioInfo.code)
        findobj.list.forEach(item => {
          // radio
          if (item.default) {
            findobj.select_name = item.label
          }
        })
        let filterIndex = this.filtersModel.findIndex(row => row.code === this.redioInfo.code)
        if (filterIndex > -1) {
          this.filtersModel[filterIndex].value = this.redioInfo.value
          this.filtersModel[filterIndex].value_label = this.redioInfo.value_label
        } else {
          this.filtersModel.push({
            key: this.redioInfo.key,
            code: this.redioInfo.code,
            value_label: this.redioInfo.value_label,
            value: this.redioInfo.value
          })
        }
        this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
        this.$refs['curTagsInput'].setModelValues(this.filtersModel)
        this.redioInfo = {}
        this.showOptTooltip = false
        this.getAlarmsList()
      }
    },
    cancelPage () {
      this.this_page = 'list'
      this.redioInfo = {}
      this.filterKeys.forEach(x => {
        x.selected = false
      })
      this.showOptTooltip = false
      this.filterKeys = JSON.parse(JSON.stringify(this.filterKeysCopy))
    },
    returnFilterFunc (data) {
      this.filtersModel = data
      this.filterKeys.forEach(x => {
        let item = this.filtersModel.find(y => y.code === x.code)
        if (item) {
          // 回写左侧选中显示，及查询条件
          x.select_name = item.value_label
          x.selected_res = item.value
        } else {
          x.select_name = DEFAULT_NAME
          x.selected_res = ''
        }
        // 回写左侧各个redio选中
        if (x.code === 'alert_code') {
          this.redioDefault(this.filterKeys[0].list, x.selected_res)
        }
        if (x.code === 'level') {
          this.redioDefault(this.filterKeys[1].list, x.selected_res)
        }
        if (x.code === 'state') {
          this.redioDefault(this.filterKeys[2].list, x.selected_res)
        }
        if (x.code === 'notification_type') {
          this.redioDefault(this.filterKeys[3].list, x.selected_res)
        }
      })
      this.filterViewData = this.filterKeys.find(row => row.selected)
      this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      this.getAlarmsList()
    },
    redioDefault (list, value) {
      list.forEach(y => { y.default = false })
      let itemIdx = list.findIndex(y => y.value === value)
      if (itemIdx !== -1) {
        list[itemIdx].default = true
      } else {
        list[0].default = true
      }
      console.log(list, '1111', value)
      return list
    },
    // 获取告警列表
    getAlarmsList () {
      let params = {}
      if (this.time_range_obj.code) {
        params.time_range = this.time_range_obj.code
      } else {
        params.start_time = this.time_range_obj.start_time
        params.end_time = this.time_range_obj.end_time
      }
      this.filtersModel.forEach(data => {
        console.log('eEEE', data)
        if (data.value !== '任意') params[data.code] = data.value
      })
      this.this_page = 'list'
      this.no_alarms_list = []
      NXMC_ALERT_LIST_GET(params).then(res => {
        this.alarms_list = res.data.alert_list
        res.data.alert_list.forEach(data => {
          if (!data.ack_status) {
            this.no_alarms_list.push(data)
          }
        })
      })
    },
    getOverview () {
      this.handleXAxisFormats()
      let params = {}
      if (this.time_range_obj.code) {
        params.time_range = this.time_range_obj.code
      } else {
        params.start_time = this.time_range_obj.start_time
        params.end_time = this.time_range_obj.end_time
      }
      this.filtersModel.forEach(data => {
        params[data.code] = data.value
      })
      this.this_page = 'list'
      this.showOverview = true
      NXMC_ALERT_OVERVIEW_GET(params).then(res => {
        if (res.code === 0) {
          console.log('getOverview', res)
          let handelData = {
            'no_ack': [],
            'ack': []
          }
          if (res.data.overview_info.xAxis.length !== 0) {
            res.data.overview_info.xAxis.forEach((el, index) => {
              // 把字符串类型专程Date类型
              let someDate = new Date(Date.parse(el))
              // 进行Date.UTC处理
              let tms = el.indexOf(':') > -1 ? Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(), someDate.getMinutes()) : Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), 0, 0)
              res.data.overview_info.series.forEach(el1 => {
                let itemData = []
                if (el1.data.length !== 0) {
                  itemData = [tms, el1.data[index]]
                } else {
                  itemData = [tms, 0]
                }
                if (el1.name === 'no_ack') {
                  handelData['no_ack'].push(itemData)
                } else if (el1.name === 'ack') {
                  handelData['ack'].push(itemData)
                }
              })
            })
          }
          this.clumnChartOptions.option.series[0].data = handelData['ack']
          this.clumnChartOptions.option.series[1].data = handelData['no_ack']
          this.$refs['alarms_clumn_chart'].drawChart(this.clumnChartOptions.option)
          console.log(this.clumnChartOptions.option)
        }
      })
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    bus.$on('timeChanged', (obj) => {
      this.time_range_obj = obj
      console.log('timeChanged', obj)
      this.getAlarmsList()
      if (this.time_range_obj.code && (this.time_range_obj.code === 'Last 72 hours' || this.time_range_obj.code === 'Last 7 days' || this.time_range_obj.code === 'Last 30 days')) {
        // 大于一天
        this.getOverview()
      } else if (this.time_range_obj.end_time - this.time_range_obj.start_time > 24 * 60 * 60 * 1000) {
        // 大于一天
        this.getOverview()
      } else {
        this.showOverview = false
      }
    })
    bus.$emit('resetTime')
  },
  created () {
    this.filterTagsInputData = JSON.parse(JSON.stringify(this.filterKeys))
    this.notification_type_list()
  },
  components: {
    stepper,
    icon,
    ntRedio,
    tagsInput,
    charts
  }
}
</script>
<style scoped lang="less">
</style>
