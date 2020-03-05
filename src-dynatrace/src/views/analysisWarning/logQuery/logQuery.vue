<template>
  <div class="log_Query_wrapper">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="apiList">
      <div class="headTitle">
        <div class="head_title_l">
          <div class="bannericon iconfont iconlog"></div>
          <div class="h_title">日志查询</div>
        </div>
      </div>

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
            <tags-input ref="tagFilter" :filterKeys="filterKeys" :keysValue="filterKeysValue"
                        conditionType="log"
                        :disabled="!checkedLogType" :checkedLogType="checkedLogType"
                        :isCustom="searchValue === 'custom'" :queryValue="queryStr"
                        @returnFilterFunc="returnFilterFunc"
                        @onEnter="onCustomInputEnter"
                        @inputVal="inputVal"

            ></tags-input>
          </div>
        </div>

        <!--        <el-button type="primary" class="btn_margin ml20 mb20" @click="searchHandle" :disabled="!checkedLogType">-->
        <!--          查询结果-->
        <!--        </el-button>-->
      </div>
    </div>

    <!--      #51006 默认不显示，有查询动作后再展示 -->
    <div class="app-list flex" v-if="operated">
      <div class="app-left">
        <div class="filter mb24" v-if="checkedWorkBreak.length > 0">
          <div class="filter-tip filter-tip_check"><span>已选字段</span><span class="delete_all" @click="deleteAll">删除全部</span></div>
          <div class="filter-item" v-for="(filter, index) in checkedWorkBreak" :key="index">
            <div class="up">{{filter.name}}</div>
            <div class="down" @click="deleteFilter(index, filter)"><i class="el-icon-close add_icon"></i></div>
          </div>
        </div>
        <div class="filter">
          <div class="filter-tip">筛选字段</div>
          <div class="filter-item" v-if="!filterTyleList.length">无筛选字段</div>
          <div class="filter-item" v-for="(filter, index) in filterTyleList" :key="index" v-if="filterTyleList.length && filter.name">
            <div class="up">{{filter.name}}</div>
            <div class="down" @click="tofilter(filter, index)">
              <img src="../../../assets/image/add.svg"
                   class="add_icon"></div>
          </div>
        </div>
      </div>
      <div class="app-right">
        <div class="container">
          <p class="tip">查询结果</p>

          <template v-if="!loglist.length && !clumnChartOptions.option.series[0].data.length">
            <p class="no-data">没有符合筛选条件的结果</p>
          </template>

          <template v-else>
            <div class="app-grash">
              <charts ref="logBarChart" :chartId="clumnChartOptions.id" :option="clumnChartOptions.option"></charts>
            </div>
            <div class="app-data-list" v-if="showTable">
              <my-table :tableData="loglist" :tableSet="tableSet" :columns="columns" :componentsName="'logDetail'"
                        @changePage="changePage"></my-table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import myTable from 'components/ntTable/ntTable.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'
import {LOGS_FILED, LOGS_LIST, LOGS_OVERVIEW, LOGS_TYPE} from '@/api'
import charts from '@/components/charts/charts.vue'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
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
        haveInput: true
      }, {
        label: 'is not one of',
        value: 'is not one of',
        haveInput: true
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
            color: '#14A8F5',
            fontColor: '#282828',
            data: [
              // [Date.UTC(2010, 3, 1), 3],
              // [Date.UTC(2010, 3, 2), 0.5],
              // [Date.UTC(2010, 3, 3), 1],
              // [Date.UTC(2010, 3, 4), 2],
              // [Date.UTC(2010, 3, 5), 4],
              // [Date.UTC(2010, 3, 6), 1.4],
              // [Date.UTC(2010, 3, 7), 1]
            ]
          }]
        }
      },

      // 初始化查询标识符
      operated: false
    }
  },
  computed: {
    menuState: function () {
      return this.$store.state.openMenu
    }
  },
  watch: {
    menuState: function (newVal) {
      // 菜单变化  echart图表自适应
      this.$nextTick(() => {
        this.$refs['logBarChart'] && this.$refs['logBarChart'].drawChart(this.clumnChartOptions.option)
      })
    }
  },
  methods: {
    returnFilterFunc (data) {
      console.log('filter', data)
      this.queryStr = ''
      let fieldList = {}
      data.forEach(item => {
        fieldList[item.key] = {
          operator: item.value,
          value: item.value_label
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

    changeValue (val, reset = true) {
      this.checkedLogType = val
      LOGS_FILED({log_type: val}).then(res => {
        if (res.code === 0) {
          res.data.fileds_list.forEach((item, index) => {
            item.list = this.detailFilterList
            item.type = 'select_obj'
            item.positionIndex = index
          })
          this.filterKeys = res.data.fileds_list
          this.filterTyleList = JSON.parse(JSON.stringify(res.data.fileds_list))
        }
      })
      this.checkedWorkBreak = []
      // 添加容错， 应用监控过来的会直接调用 changeValue， 此时 copyColumn 还是空
      this.columns = this.copyColumns.length ? JSON.parse(JSON.stringify(this.copyColumns)) : this.columns

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
      this.seachTable()
    },
    deleteFilter (index, type) {
      this.showTable = false
      this.checkedWorkBreak.splice(index, 1)
      this.filterTyleList.splice(type.positionIndex, 1, type)
      this.columns.forEach((col, idex) => {
        if (col.code === type.name) this.columns.splice(idex, 1)
      })
      if (this.columns.length === 1) this.columns = JSON.parse(JSON.stringify(this.copyColumns))
      this.seachTable()
    },
    deleteAll () {
      this.showTable = false
      this.checkedWorkBreak.forEach(item => {
        this.filterTyleList.splice(item.positionIndex, 1, item)
      })
      this.checkedWorkBreak = []
      this.columns = JSON.parse(JSON.stringify(this.copyColumns))
      this.seachTable()
    },
    searchHandle () {
      // 点击查询按钮后，将标识符设置为true
      this.operated = true

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
      this.seachTable()
      this.getGrash(params)
    },
    seachTable () {
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
    getGrash (params) {
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
          this.$refs['logBarChart'] && this.$refs['logBarChart'].drawChart(this.clumnChartOptions.option)
        }
      })
    },
    changePage (page) {
      this.tableSet.paginationConfig.currentPage = page
      this.seachTable()
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
        this.changeValue(this.checkedLogType, false)
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
          this.$refs.tagFilter.setModelValues(this.$route.params.logFiltersModel)
          this.returnFilterFunc(this.$route.params.logFiltersModel)
        }
      })
    }
    this.copyColumns = JSON.parse(JSON.stringify(this.columns))

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
    tagsInput,
    charts
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .no-data {
    color: #454646;
  }

  .headTitle {
    position: relative;
    padding: 18px 32px 19px 16px;
    width: 100%;
    height: 73px;
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid @blue-12;

    .head_title_l {
      display: flex;
      align-items: center;
      height: 40px;

      .bannericon {
        width: 36px;
        height: 40px;
        font-size: 36px;
        line-height: 40px;
      }

      .h_title {
        margin-left: 11px;
        height: 40px;
        font-size: 28px;
        line-height: 40px;
        font-weight: 500;
      }
    }
  }

  .filter_box {
    background-color: #fff;

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
    min-height: calc(100vh - 74px);
    margin-top: 24px;

    .app-left {
      width: 230px;
      margin-right: 8px;
      padding: 0 16px;
      box-sizing: border-box;

      .filter {
        .filter-tip {
          padding-bottom: 23px;
          color: #454646;
          font-size: 14px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 500;
          text-align: left;
          border-bottom: 1px solid #E6E6E6;
        }

        .filter-tip_check {
          display: flex;
          justify-content: space-between;

          .delete_all {
            color: #00A1B2;
          }
        }

        .filter-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0 6px 0;
          border-bottom: 1px solid #E6E6E6;

          .up {
            font-size: 14px;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: @default-font-color;
            line-height: 20px;
          }

          .down {
            .add_icon {
              width: 14px;
              height: 14px;
              cursor: pointer;
            }
          }
        }
      }
    }

    .app-right {
      width: calc(100% - 230px);
      background: rgba(255, 255, 255, 1);
      background-clip: content-box;

      .container {
        padding: 16px;

        .tip {
          font-size: 20px;
          color: #454646;
          font-weight: 500;
          margin-bottom: 27px;
        }

        .app-grash {
          width: 100%;
          height: 147px;
        }
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
