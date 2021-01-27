<template>
  <div class="log_Query_wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="apiList">
      <DYPageHeader title="日志查询" icon="log" theme="blue" @eventGetHeight="getHeight"/>
      <div class="filter_box">
        <div class="filter_content">
          <el-select style="margin-left: 20px" v-model="checkedLogType" placeholder="请选择日志类型" @change="changeValue">
            <el-option
              v-for="item in logType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="searchValue"
            class="mr8 ml8"
            :disabled="!checkedLogType"
            @change="selectSearchVaule">
            <el-option
              v-for="item in searchType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="filter_div">
            <DYFilter
              v-if="searchValue !== 'custom'"
              class="input-filter"
              :filtersModel="filtersModel"
              :filterKeys="filterKeys"
              :quickSearch="false"
              :placeholder="filterPlaceholder"
              @returnFilterFunc="returnFilterFunc"
            />

            <div class="input-filter" v-else>
              <el-input ref="tags_input" class="tags_input" type="text" size="11" v-model="queryStr"
                        placeholder="Search... (e.g. status:200 AND extension:PHP)"
                        @input="inputVal"
                        @keypress.native.enter="onCustomInputEnter"
              >
                <i slot="suffix" class="el-input__icon" @click="onCustomInputEnter">
                  <DYIcon type="search"></DYIcon>
                </i>
              </el-input>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- #51006 默认不显示，有查询动作后再展示 -->
    <div class="app-list flex" v-if="operated" :style="{minHeight: appHeight + 'px'}">

      <div class="app-left">
        <div class="filter mb24" v-if="checkedWorkBreak.length > 0">
          <div class="filter-tip filter-tip_check"><span>已选字段</span><span class="delete_all"
                                                                          @click="deleteAll">删除全部</span></div>
          <div class="filter-item" v-for="(filter, index) in checkedWorkBreak" :key="index">
            <div>{{filter.name}}</div>

            <DYIcon type="delete" size="20" actions @click="deleteFilter(index, filter)"/>

          </div>
        </div>
        <div class="filter">
          <div class="filter-tip">筛选字段</div>
          <div class="filter-item" v-if="!filterTyleList.length">无筛选字段</div>
          <div class="filter-item" v-for="(filter, index) in filterTyleList" :key="index"
               v-if="filterTyleList.length && filter.name">
            <div class="up">{{filter.name}}</div>
            <DYIcon type="add" size="20" actions @click="tofilter(filter, index)"></DYIcon>
          </div>
        </div>
      </div>

      <div class="app-right">
        <DYCard class="full-height">
          <DYHeader class="row-title" title="查询结果" type="small" no-gap/>

          <template v-if="!loglist.length && !clumnChartOptions.option.series[0].data.length">
            <p class="no-data row-content">没有符合筛选条件的结果</p>
          </template>

          <template v-else>
            <div class="app-grash row-content">
              <charts ref="logBarChart" :chartId="clumnChartOptions.id" :option="clumnChartOptions.option"></charts>
            </div>
            <div class="app-data-list" v-if="showTable">
              <my-table :tableData="loglist" :tableSet="tableSet" :columns="columns" :componentsName="'logDetail'"
                        @changePage="changePage"></my-table>
            </div>
          </template>
        </DYCard>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import myTable from 'components/ntTable/ntTable.vue'
import {LOGS_FILED, LOGS_LIST, LOGS_OVERVIEW, LOGS_TYPE} from '@/api'
import charts from '@/components/charts/charts.vue'
import bus from '@/assets/eventBus.js'
import {getLessColor} from 'common/util/util'
import {clone, isArray} from 'lodash'

export default {
  data () {
    return {
      appHeight: '',
      pageHeaderHeight: '',
      time_range_obj: {code: 'Last 30 minutes'}, // 时间
      showTable: true,
      copyColumns: [],
      columns: [
        {
          name: '时间', // 表头名
          code: '@timestamp', // 表身
          type: 'text'
        },
        {
          name: '内容', // 表头名字
          code: 'log_content', // 表身显示值
          type: 'html',
          width: 550
        }
      ],
      stepper: [
        {
          name: '日志查询',
          routerTo: 'logQuery',
          step: 1
        }
      ],
      filterKeys: [],
      filtersModel: [],
      tableSet: {
        hidePagination: true,
        truePage: true,
        showOpenInfo: true,
        openInfoLabel: '详情',
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      pageNum: 1, // 第几页
      logType: [], // 日志类型
      checkedLogType: '', // 被选中的日志类型
      searchType: [{
        label: '筛选条件',
        value: 'search_term'
      }, {
        label: '自定义',
        value: 'custom'
      }],
      searchValue: 'search_term',
      filterKeysValue: ['type', 'name'],
      detailFilterList: [{
        label: 'is',
        value: 'is',
        haveInput: true
      }, {
        label: 'is not',
        value: 'is not',
        haveInput: true
      }, {
        label: 'is one of',
        value: 'is one of',
        haveInput: true,
        inputType: 'tag'
      }, {
        label: 'is not one of',
        value: 'is not one of',
        haveInput: true,
        inputType: 'tag'
      }, {
        label: 'exists',
        value: 'exists'
      }, {
        label: 'dose not exists',
        value: 'dose not exists'
      }],
      loglist: [], // 列表数据
      checkedWorkBreak: [], // 选择的字断树形
      searchData: {}, // 搜索对象
      queryStr: '', // 自定义搜索内容
      filterTyleList: [],
      chartsData: [],
      clumnChartOptions: {
        id: 'log_bar_chart',
        option: {
          chart: {
            height: 147,
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
            shared: true,
            crosshairs: true,
            borderColor: '#67D5E0',
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<table><tr><td style="color: {series.userOptions.fontColor};line-height:20px;"><span style="color:{point.color}">\u25A0 </span> {series.name}: &nbsp;</td>' +
                '<td style="text-align: right"><b>{point.y}</b></td></tr>',
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
            color: getLessColor('@blue-05'),
            fontColor: '#282828',
            data: []
          }]
        }
      },

      // 初始化查询标识符
      operated: false,

      filterPlaceholder: ''
    }
  },
  computed: {
    menuState () {
      return this.$store.state.openMenu
    }
  },
  watch: {
    menuState (newVal) {
      // 菜单变化  echart图表自适应
      this.$nextTick(() => {
        this.$refs.logBarChart && this.$refs.logBarChart.drawChart(this.clumnChartOptions.option)
      })
    }
  },
  methods: {
    getHeight (value) {
      console.log('getHeight==>', value)
      this.pageHeaderHeight = value
    },
    returnFilterFunc (data) {
      console.log('filter', data)
      this.queryStr = ''
      let fieldList = {}
      data.forEach(item => {
        fieldList[item.key] = {
          operator: item.value,
          value: isArray(item.value_label) ? item.value_label.join(',') : item.value_label
        }
      })
      this.searchData.field_list = fieldList

      // 触发搜索
      this.searchHandle()
    },
    inputVal (val) {
      this.searchData = {}
      this.queryStr = val
    },

    // 触发搜索
    onCustomInputEnter () {
      this.searchHandle()
    },

    changeValue (val, reset = true, fromTimeChange = false) {
      this.filtersModel = []
      // 如果是日期变动引起的函数调用， 则不执行 field 拉取
      if (!fromTimeChange) {
        this.checkedLogType = val

        let params = {log_type: val}

        if (this.time_range_obj && this.time_range_obj.code) {
          params.time_range = this.time_range_obj.code
        } else {
          params.start_time = Number(this.time_range_obj.start_time)
          params.end_time = Number(this.time_range_obj.end_time)
        }

        LOGS_FILED(params).then(res => {
          if (res.code === 0) {
            res.data.fileds_list = res.data.fileds_list.map((item, index) => {
              let newItem = {}

              newItem.list = this.detailFilterList
              // newItem.type = 'select_obj'
              newItem.type = 'select_obj_operator'
              newItem.positionIndex = index
              newItem.code = item.name
              newItem.key = item.name
              newItem.value = item.value
              newItem.value_label = item.value

              return {
                ...item,
                ...newItem
              }
            })

            this.filterKeys = res.data.fileds_list
            this.filterTyleList = clone(res.data.fileds_list)

            if (this.filterKeys.length === 0) {
              this.filterPlaceholder = '该日志类型下暂无可过滤条件'
            } else {
              this.filterPlaceholder = ''
            }
          }
        })

        // 如果只修改时间，则不清空筛选
        this.checkedWorkBreak = []
        // 添加容错， 应用监控过来的会直接调用 changeValue， 此时 copyColumn 还是空
        this.columns = this.copyColumns.length ? clone(this.copyColumns) : this.columns
      }

      // 如果 reset false，则不执行清空逻辑
      if (reset) {
        this.searchValue = 'search_term'
        this.selectSearchVaule()
      }
      this.searchHandle()
    },
    tofilter (type, index) {
      this.showTable = false
      this.checkedWorkBreak.push(type)
      this.filterTyleList.splice(index, 1, {type: '', name: ''})
      this.columns.forEach((col, idex) => {
        if (col.code === 'log_content') this.columns.splice(idex, 1)
      })
      this.columns.push({
        name: type.name.replace(type.name[0], type.name[0].toUpperCase()),
        code: type.name,
        type: 'html'
      })
      this.searchTable()
    },
    deleteFilter (index, type) {
      this.showTable = false
      this.checkedWorkBreak.splice(index, 1)
      this.filterTyleList.splice(type.positionIndex, 1, type)
      this.columns.forEach((col, idex) => {
        if (col.code === type.name) this.columns.splice(idex, 1)
      })
      if (this.columns.length === 1) this.columns = clone(this.copyColumns)
      this.searchTable()
    },
    deleteAll () {
      this.showTable = false
      this.checkedWorkBreak.forEach(item => {
        this.filterTyleList.splice(item.positionIndex, 1, item)
      })
      this.checkedWorkBreak = []
      this.columns = JSON.parse(JSON.stringify(this.copyColumns))
      this.searchTable()
    },
    searchHandle () {
      // 点击查询按钮后，将标识符设置为true
      this.operated = true
      // topHeader: 44px & stepper: 30px & filter: 72px & pageHeader: this.pageHeaderHeight
      this.appHeight = document.documentElement.clientHeight - this.pageHeaderHeight - 146
      if (!this.checkedLogType) return
      this.tableSet.paginationConfig.currentPage = 1
      const params = {
        log_type: this.checkedLogType,
        page_size: this.tableSet.paginationConfig.pageSize,
        page: this.tableSet.paginationConfig.currentPage
      }
      if (this.time_range_obj && this.time_range_obj.code) {
        params.time_range = this.time_range_obj.code
      } else {
        params.start_time = Number(this.time_range_obj.start_time)
        params.end_time = Number(this.time_range_obj.end_time)
      }
      if (this.searchData.field_list) params.field_list = this.searchData.field_list
      if (this.queryStr) params.query_string = this.queryStr
      this.searchTable()
      this.getGraph(params)
    },
    searchTable () {
      const params = {
        log_type: this.checkedLogType,
        page_size: this.tableSet.paginationConfig.pageSize,
        page: this.tableSet.paginationConfig.currentPage
      }
      if (this.time_range_obj && this.time_range_obj.code) {
        params.time_range = this.time_range_obj.code
      } else {
        params.start_time = Number(this.time_range_obj.start_time)
        params.end_time = Number(this.time_range_obj.end_time)
      }
      if (this.searchData.field_list) params.field_list = this.searchData.field_list
      if (this.queryStr) params.query_string = this.queryStr
      LOGS_LIST(params).then(res => {
        const newList = []

        // 51174, 这里需要过滤掉高亮为命名空间的值
        const nameSpace = window.localStorage.getItem('namespace_code')
        const Reg = new RegExp(`^.*>(${nameSpace})<.*$`)

        res.data.result.forEach(item => {
          Object.keys(item.highlight).forEach(key => {
            item.source[key] = ''
            item.highlight[key].forEach(light => {
              let highLight = light || ''

              highLight = highLight.replace(Reg, ($1, $2) => $2)

              item.source[key] += highLight
            })
          })
          newList.push(item.source)
        })
        newList.forEach(item => {
          let logContent = ''
          Object.keys(item).forEach(i => {
            logContent += `<span style="color: #898989">${i}:</span><span style="margin-right: 24px;">${item[i]}</span>`
          })
          item.log_content = logContent
        })

        this.loglist = newList
        this.tableSet.paginationConfig.total = res.data.total
        this.showTable = true
      })
    },
    getGraph (params) {
      LOGS_OVERVIEW(params).then(res => {
        if (res.code === 0 && res.data.overview_info.series) {
          this.chartsData = res.data.overview_info.series[0].data
          let handleData = []
          res.data.overview_info.series[0].data.forEach((el, index) => {
            // 把字符串类型专程Date类型
            let someDate = new Date(Date.parse(res.data.overview_info.xAxis[index]))
            // 进行Date.UTC处理
            let tms = res.data.overview_info.xAxis[index].indexOf(':') > -1 ? Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), someDate.getHours(), someDate.getMinutes()) : Date.UTC(someDate.getFullYear(), someDate.getMonth(), someDate.getDate(), 0, 0)
            handleData.push([tms, el])
          })
          this.clumnChartOptions.option.series[0].data = handleData
          this.clumnChartOptions.option.series[0].name = res.data.overview_info.series[0].name
          this.$refs.logBarChart && this.$refs.logBarChart.drawChart(this.clumnChartOptions.option)
        }
      })
    },
    changePage (page) {
      this.tableSet.paginationConfig.currentPage = page
      this.searchTable()
    },
    selectSearchVaule () {
      this.queryStr = ''
      this.searchData = {}
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    bus.$on('timeChanged', (obj) => {
      this.time_range_obj = obj
      if (this.checkedLogType) {
        this.changeValue(this.checkedLogType, false, true)
      }
    })

    bus.$emit('resetTime')

    if (this.$route.params && this.$route.params.detailData) {
      const detail = this.$route.params.detailData

      // this.queryStr = detail.queryStr
      // this.searchValue = 'custom'
      this.changeValue(detail.logType, false)

      this.$nextTick(() => {
        if (this.$route.params.logFiltersModel) {
          this.filtersModel = this.$route.params.logFiltersModel
          // this.$refs.tagFilter.setModelValues(this.$route.params.logFiltersModel)
          this.returnFilterFunc(this.$route.params.logFiltersModel)
        }
      })
    }
    this.copyColumns = clone(this.columns)

    LOGS_TYPE({}).then(res => {
      res.data.result.forEach(item => {
        item.label = item.title
        item.value = item.code
      })
      this.logType = res.data.result

      this.$forceUpdate()
    })
  },
  created () {
  },
  components: {
    stepper,
    myTable,
    charts
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .no-data {
    color: #454646;
  }

  .filter_box {
    background-color: @gray-00;

    .filter_content {
      display: flex;
      align-items: center;
      padding: 20px;

      .filter_div {
        flex: 1;
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }

  .app-list {
    // min-height: calc(100vh - 74px);
    padding-top: 24px;

    .app-left {
      width: 230px;
      margin-right: 8px;
      padding: 0 16px;
      box-sizing: border-box;

      .filter {
        .filter-tip {
          padding: 16px 0;
          color: #454646;
          font-weight: 500;
          border-bottom: 1px solid @gray-03;
        }

        .filter-tip_check {
          display: flex;
          justify-content: space-between;

          .delete_all {
            color: @turq-06;
          }
        }

        .filter-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0 6px 0;
          border-bottom: 1px solid @gray-03;
        }
      }
    }

    .app-right {

      .app-grash {
        width: 100%;
        height: 147px;
      }

      .app-data-list {
        padding: 40px 16px 0 16px;
      }
    }
  }
</style>
<style lang="less">
  .log_Query_wrapper {
    i {
      font-size: 16px;
      font-weight: bolder;
      color: rgba(0, 161, 178, 1);
    }
  }
</style>
