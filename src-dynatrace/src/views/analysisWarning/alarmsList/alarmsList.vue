<template>
  <div class="alarmsList">
    <stepper :stepper="stepper" theme="red" />

    <div class="m20" v-if="!showBlank">
<!--      <tags-input ref="curTagsInput" :filterKeys="filterKeys" :keysValue="filterKeysValue"-->
<!--                  @returnFilterFunc="returnFilterFunc" />-->

      <DYFilter
        class="input-filter"
        :filtersModel="filtersModel"
        :filterKeys="filterKeys"
        :quickSearch="false"
        @returnFilterFunc="returnFilterFunc"
      />
    </div>

    <div class="panel_box flex" :style="{minHeight: appHeight + 'px'}">
      <div class="panel-left" v-if="!showBlank">
        <left-filter :filter-list="filterKeys" @click="tofilter"/>
      </div>

      <template v-if="showBlank">
        <div class="p20 full-width">
          <DYCard class="margin-card">
            <DYHeader
              no-gap
              :title="`${no_alarms_list.length}个未确认告警`"
            >
              <DYButton slot="actions" @click="goPage('warningStrategy')" v-if="isShowEle('warningStrategy')">设置告警策略</DYButton>
            </DYHeader>

            <!-- 无告警列表时候的样式 -->
            <div class="no-alarms">
              <div class="no-alarms-tips flex">
                <DYIcon type="healthy" size="38" class="mr10"></DYIcon>
                很健康，没有问题
              </div>

              <p style="margin-bottom: 55px">
                NXMC的监控系统持续监视应用程序的每个部分，并对问题进行不同级别的告警。对于每个问题都会显示具体影响、根本原因，并提供异常日志便于快速解决问题。</p>

              <div class="no-alarms-pics flex">
                <img v-for="i in 3" :key="i" :src="`static/img/alarms-pic${i}.png`" alt="">
              </div>
            </div>
          </DYCard>
        </div>
      </template>

      <div v-else class="app-right">

        <DYCard class="full-height" v-if="this_page === 'filter-view'">

          <DYHeader :title="filterViewData.name" type="small" no-gap/>

          <div class="row-desc">{{filterViewData.desc}}</div>

          <!-- ntRadio -->
          <div class="filter_list_div">
            <nt-radio class="category-list" v-if="hardRender" :name="filterViewData[filterKeysValue[0]]"
                      :list="filterViewData.list" :keyValue="radioKeyValue" v-on:radioChecked="radioChecked"/>

          </div>
        </DYCard>

        <template v-if="this_page === 'list'">
          <DYCard class="full-height">
            <DYHeader
              class="row-title"
              no-gap
              :title="`${no_alarms_list.length}个未确认告警`"
            >
              <DYButton slot="actions" @click="goPage('warningStrategy')" v-if="isShowEle('warningStrategy')">设置告警策略</DYButton>
            </DYHeader>

            <div class="clumn_chart ml20 mr20" v-if="showOverview">
              <charts style="width:100%" :ref="clumnChartOptions.id" :chartId="clumnChartOptions.id"
                      :option="clumnChartOptions.option"></charts>
              <div class="sf_chart_legend">
                <div class="legend_item" v-for="(item, index) in legends" :key="index">
                  <div class="legend_item_icon">
                    <img src="~@/assets/image/dynatrace/red_chart_column.svg" alt="" v-if="item.title==='Open problems'"/>
                    <img src="~@/assets/image/dynatrace/gray_chart_column.svg" alt="" v-else/>
                  </div>
                  <span class="legent_item_tit">{{item.title}}</span>
                </div>
              </div>
            </div>

            <div class="show_total_num row-title mt32" v-if="showOverview">
              共{{alarms_list.length}}个告警
              <span v-if="time_range_obj.code">（{{time_range_obj.code}}）</span>
              <span v-else>（{{time_range_obj.start_time}} 至 {{time_range_obj.end_time}}）</span>
            </div>

            <div class="grid-list row-content">
              <DYMiniCard
                enable-click
                class="grid"
                :theme="item.ack_status ? 'gray' : 'red'"
                v-for="(item, index) in alarms_list"
                :key="index"
                icon="alert"
                :title="item.name"
                :sub-title="item.code"
                :show-state="true"
                :state="item.ack_status"
                @click="goSetAlarmsPolicePage(item)"
              >
                <div class="gg_down">
                  <div class="ggd_line">
                    <div class="ggdl_value">告警时间</div>
                    <div class="ggdl_name default-label">{{item.alert_time}}</div>
                  </div>
                  <div class="ggd_line">
                    <div class="ggdl_value">告警级别</div>
                    <div class="ggdl_name default-label">{{item.level==='crit' ? '高' : item.level==='warn' ? '低' : ''}}
                    </div>
                  </div>
                  <div class="ggd_line">
                    <div class="ggdl_value">通知方式</div>
                    <div class="ggdl_name default-label">{{item.notification_type_text}}</div>
                  </div>
                </div>
              </DYMiniCard>
            </div>

          </DYCard>
        </template>
      </div>
    </div>

    <DYConfirmationDialog
      :show="showOptTooltip"
      message="是否保存修改？"
      okText="保存"
      :okDisabled="!isNeedSave"
      @onOk="savePage"
      @onCancel="cancelPage"
    />

  </div>
</template>

<script>
import bus from '@/assets/eventBus.js'
import stepper from 'components/stepper/stepper.vue'
import ntRadio from 'components/base/radio.vue'
// import tagsInput from '@/components/tagsInput/tagsInput.vue'
import charts from '@/components/charts/charts.vue'
import HighCharts from 'highcharts'
import leftFilter from '@/components/leftFilter/leftFilter.vue'

import {
  ALERT_RULE_LIST_GET,
  NOTIFICATION_TYPE_LIST,
  NXMC_ALERT_LIST_GET,
  NXMC_ALERT_OVERVIEW_GET
} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'

const DEFAULT_NAME = '任意'

export default {
  data () {
    return {
      appHeight: '',
      showBlank: false,
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
      radioKeyValue: ['value', 'label'],
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
      radioInfo: {},
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
    menuState () {
      return this.$store.state.openMenu
    },
    isShowEle () {
      return key => this.$_hasRoute(key)
    }
  },
  watch: {
    menuState (newVal) {
      // console.log('左菜单伸缩state变化')
      // 菜单变化  echart图表自适应
      if (this.showOverview) {
        this.$refs.alarms_clumn_chart.drawChart(this.clumnChartOptions.option)
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
        name,
        params: {
          router_code: name
        }
      })
    },
    tofilter (code, filter, filterIndex) {
      // topHeader: 44px & stepper: 30px & filter: 72px & confirm: 56px
      this.appHeight = document.documentElement.clientHeight - 202
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
    radioChecked (name, checked) {
      console.log('radioChecked', name, checked)
      let obj = this.filterKeys.find(row => row[this.filterKeysValue[0]] === name)
      obj.list.forEach(el => {
        if (el[this.radioKeyValue[0]] === checked) {
          el.default = true
          // 当选中的内容有变 才放开保存按钮
          if (el[this.radioKeyValue[1]] !== obj.select_name) {
            this.isNeedSave = true
            this.radioInfo = {
              key: obj.name,
              code: name,
              value: checked,
              value_label: el[this.radioKeyValue[1]]
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
      // topHeader: 44px & stepper: 30px & filter: 72px
      this.appHeight = document.documentElement.clientHeight - 146
      // 选择过 需要保存的
      if (this.radioInfo.value) {
        let findobj = this.filterKeys.find(row => row.code === this.radioInfo.code)
        findobj.list.forEach(item => {
          // radio
          if (item.default) {
            findobj.select_name = item.label
          }
        })
        let filterIndex = this.filtersModel.findIndex(row => row.code === this.radioInfo.code)
        if (filterIndex > -1) {
          this.filtersModel[filterIndex].value = this.radioInfo.value
          this.filtersModel[filterIndex].value_label = this.radioInfo.value_label
        } else {
          this.filtersModel.push({
            key: this.radioInfo.key,
            code: this.radioInfo.code,
            value_label: this.radioInfo.value_label,
            value: this.radioInfo.value
          })
        }
        this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
        // this.$refs.curTagsInput.setModelValues(this.filtersModel)
        this.radioInfo = {}
        this.showOptTooltip = false
        this.getAlarmsList()
      }
    },
    cancelPage () {
      // topHeader: 44px & stepper: 30px & filter: 72px
      this.appHeight = document.documentElement.clientHeight - 146
      this.this_page = 'list'
      this.radioInfo = {}
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
        // 回写左侧各个radio选中
        if (x.code === 'alert_code') {
          this.radioDefault(this.filterKeys[0].list, x.selected_res)
        }
        if (x.code === 'level') {
          this.radioDefault(this.filterKeys[1].list, x.selected_res)
        }
        if (x.code === 'state') {
          this.radioDefault(this.filterKeys[2].list, x.selected_res)
        }
        if (x.code === 'notification_type') {
          this.radioDefault(this.filterKeys[3].list, x.selected_res)
        }
      })
      this.filterViewData = this.filterKeys.find(row => row.selected)
      this.filterKeysCopy = JSON.parse(JSON.stringify(this.filterKeys))
      this.getAlarmsList()
    },
    radioDefault (list, value) {
      list.forEach(y => {
        y.default = false
      })
      let itemIdx = list.findIndex(y => y.value === value)
      if (itemIdx !== -1) {
        list[itemIdx].default = true
      } else {
        list[0].default = true
      }

      return list
    },
    // 获取告警列表
    getAlarmsList () {
      this.showBlank = false

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

        // this.alarms_list = [{'state': 'warning', 'code': 'testchen123', 'alert_time': '2020-03-25 15:14:36', 'name': '\u65e5\u5fd7\u76d1\u63a7\uff1atestchen123[warning]', 'ack_status': false, 'level': 'warn', 'notification_type': 'mail', 'notification_type_text': 'mail'}]

        res.data.alert_list.forEach(data => {
          if (!data.ack_status) {
            this.no_alarms_list.push(data)
          }
        })

        if (this.alarms_list.length === 0) {
          this.showBlank = !this.filtersModel.length
        }
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
                  handelData.no_ack.push(itemData)
                } else if (el1.name === 'ack') {
                  handelData.ack.push(itemData)
                }
              })
            })
          }
          this.clumnChartOptions.option.series[0].data = handelData.ack
          this.clumnChartOptions.option.series[1].data = handelData.no_ack
          this.$refs.alarms_clumn_chart.drawChart(this.clumnChartOptions.option)
          console.log(this.clumnChartOptions.option)
        }
      })
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    // topHeader: 44px & stepper: 30px & filter: 72px
    this.appHeight = document.documentElement.clientHeight - 146
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
    ntRadio,
    // tagsInput,
    charts,
    leftFilter
  }
}
</script>

<style lang="less" scoped>
  @import './alarmsList.less';
</style>
