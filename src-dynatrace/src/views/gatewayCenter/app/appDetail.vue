<template>
  <div>
    <stepper :stepper="stepper"></stepper>
    <div class="p20">
      <div class="flex">
        <DYCard class="margin-card half-width">
          <DYHeader
            class="mb10"
            no-gap
            icon="Application"
            :title="detailData.name"
          >
            <DYButton slot="actions" type="primary" @click="goDetail(1)"
                      v-permission="'gatewayCenter_appDetail_baseInfo_edit'">编辑
            </DYButton>
          </DYHeader>

          <div>

            <DYSplitTitle
              type="detail"
              title="详情"
              iconClickEnable
              :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
              @onIconClick="isShowDetail = !isShowDetail"
            ></DYSplitTitle>

            <transition name="rollup">
              <div class="content" v-show="isShowDetail">
                <DYKeyValue
                  v-for="item of keyValueList"
                  :key="`key-value-${item.value}`"
                  :text="item.text"
                  :value="
                  item.value === 'auth_type' ? (detailData.auth_type === 'token' ? 'Access Token' : 'App Key') : detailData[item.value]
                "
                  :enable-copy="item.enableCopy"
                />
              </div>
            </transition>

            <DYIndexBox
              :cards="boxCards"
              :mini-chart-data="miniChartData"
              scale-box
            />

          </div>
        </DYCard>

        <DYCard class="margin-card half-width">
          <DYHeader
            class="mb30"
            title="其它"
            no-gap
            sub-title="对应用做进一步精细化管理"
          />

          <div>
            <DYList
              class="mb32"
              mainTitle="接口添加"
              subTitle="通过与接口组进行关联，规范应用可以调用的接口列表">
              <template slot="img">
                <img src="~@/assets/image/api_add.svg" alt="">
              </template>
              <template slot="btn">
                <DYButton @click="goDetail(2)" slot="btn"
                          v-if="isShowEle('apiGroup')">查看详情
                </DYButton>
              </template>
            </DYList>

            <DYList
              class="mb32"
              mainTitle="接口过滤"
              subTitle="可为接口针对不同应用设置过滤规则，规范应用对接回的调用行为">
              <template slot="img">
                <img src="~@/assets/image/api_filter.svg" alt="">
              </template>
              <template slot="btn">
                <DYButton @click="goDetail(3)" slot="btn"
                          v-if="isShowEle('apiFilter')">查看详情
                </DYButton>
              </template>
            </DYList>

            <DYList
              mainTitle="事件订阅"
              subTitle="为应用添加事件订阅，当事件被触发时，会把相关数据主动推送给订阅方">
              <template slot="img">
                <img src="~@/assets/image/subscribe_record.svg" alt="">
              </template>
              <template slot="btn">
                <DYButton @click="goDetail(4)" slot="btn"
                          v-if="isShowEle('appEventSubscribe')">查看详情
                </DYButton>
              </template>
            </DYList>
          </div>
        </DYCard>
      </div>

      <DYCard class="margin-card">
        <DYHeader class="row-title" :title="`${tableData.length} 个接口`" type="small" no-gap/>
        <my-table
          class="row-content"
          :tableData="tableData"
          :columns="columns"
          :tableSet="tableSet"
          @readDetail="readDetail"
        />
      </DYCard>

    </div>

  </div>
</template>

<script>
import DYIndexBox from 'components/indexBox/DYIndexBox.vue'
import XChart from 'components/charts/charts.vue'
import stepper from 'components/stepper/stepper.vue'
import myTable from 'components/ntTable/ntTable.vue'
import {API_MONITOR_INFO_GET, APP_MONITOR_INFO_GET, NXMC_METRICS_APP_GET} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import '@/directives/currency.js'

export default {
  data () {
    return {
      time_range: '',
      appInfo: {}, // 健康指数, 平均qps
      detailData: {}, // 应用详情
      // 应用详情的健康指数
      praData: {
        // 健康指数
        health: 0,
        // 访问量
        avg_qps: 0,
        // 平均相应时间
        traffic: 0,
        // 流量
        req_count: 0
      },
      // 光标数据
      miniChartData: [],
      showStyle: 'row', // row column:
      isShowDetail: false,
      app_list: false,
      stepper: [
        {
          name: '应用列表',
          routerTo: 'appList'
        },
        {
          name: ''
        }
      ],
      filter_list: [
        {
          title: '分类',
          des: '任意'
        },
        {
          title: '创建者',
          des: '任意'
        },
        {
          title: '健康指数',
          des: '任意'
        }
      ],
      tableSet: {
        showOpenInfo: false,
        showPagination: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      tableData: [],
      columns: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'edit',
          icon_url: 'API'
        },
        {
          name: '名称', // 表头名字
          code: 'name', // 表身显示值
          type: 'text'
        },
        {
          name: '平均响应时间', // 表头名字
          code: 'avg_response_time', // 表身显示值
          type: 'text',
          width: 120,
          sortAbled: true,
          sortOrder: 'none',
          textAlign: 'right',
          textAiignWithoutIcon: true // 右对齐但是不希望和sort icon对齐仅和文字右对齐
        },
        {
          name: '调用次数', // 表头名字
          code: 'total_request_num', // 表身显示值
          type: 'text',
          width: 100,
          sortAbled: true,
          sortOrder: 'none',
          textAlign: 'right',
          textAiignWithoutIcon: true // 右对齐但是不希望和sort icon对齐仅和文字右对齐
        },
        {
          name: '成功率', // 表头名字
          code: 'success_rate', // 表身显示值
          type: 'text',
          width: 80,
          sortAbled: true,
          sortOrder: 'none',
          textAlign: 'right',
          textAiignWithoutIcon: true // 右对齐但是不希望和sort icon对齐仅和文字右对齐
        }
      ],

      keyValueList: [
        {
          text: 'APP ID',
          value: 'app_id',
          enableCopy: true
        },
        {
          text: 'APP Secret',
          value: 'app_secret',
          enableCopy: true
        },
        {
          text: '应用分类',
          value: 'category'
        },
        {
          text: '授权方式',
          value: 'auth_type'
        },
        {
          text: '用户名',
          value: 'username'
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
          value: this.appInfo.health_index,
          text: '健康指数',
          backgroundImage: 'health_index'
        },
        leftBottom: {
          value: this.appInfo.total_request_num,
          filter: 'filterCount',
          text: '访问量',
          backgroundImage: 'request_num'
        },
        center: {
          value: this.appInfo.avg_qps,
          unit: '/min',
          text: '平均QPS',
          label: '应用监控',
          onClick: () => {
            if (!this.$_hasRoute('monitorApplication')) {
              return
            }

            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.$router.push({name: 'monitorApplication', params: {detailData: this.detailData}})
          }
        },
        rightTop: {
          value: this.appInfo.avg_response_time,
          filter: 'currency',
          filterParams: ['ms'],
          text: '平均响应时间',
          backgroundImage: 'avg_response_time'
        },
        rightBottom: {
          value: this.appInfo.total_traffic,
          filter: 'filterTraffic',
          text: '流量',
          backgroundImage: 'traffic'
        }
      }
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  methods: {
    readDetail (data) {
      this.$router.push({
        name: 'apiDetail',
        params: data
      })
    },
    initApp () {
      this.$router.push({name: 'appDetail'})
    },
    cutShowStyle (style) {
      this.showStyle = style
    },
    getBottomDataFunc (data) {
      let postDataFir = {
        id: this.detailData.id,
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_METRICS_APP_GET(postDataFir).then(res => {
        if (res.code === 0) {
          this.tableSet.paginationConfig.total = res.data.total
          res.data.api.forEach(async (item, index) => {
            let postData = {id: item.id, app_id: this.detailData.app_id}
            if (data.code) {
              postData.time_range = data.code
            } else {
              postData.start_time = data.start_time
              postData.end_time = data.end_time
            }
            await API_MONITOR_INFO_GET(postData).then(data1 => {
              if (data1.code === 0) {
                item.avg_response_time = data1.data.api_info.avg_response_time
                item.total_request_num = data1.data.api_info.total_request_num
                item.success_rate = data1.data.api_info.success_rate.toFixed(2)
                this.$set(this.tableData, index, item)
              }
            })
            if (!this.$_hasRoute('apiDetail')) {
              this.$set(this.columns[0], 'type', 'text')
            }
          })
          this.tableSet.paginationConfig.total = res.data.total
        }
      })
    },
    // 应用详情获取
    app_info_get (postData) {
      APP_MONITOR_INFO_GET(postData).then(res => {
        if (res.code === 0) {
          this.appInfo = res.data.app_info

          this.miniChartData = res.data.app_info.avg_qps_overview.series[0].data
          if (this.miniChartData.length > 10) {
            this.miniChartData = this.miniChartData.slice(this.miniChartData.length - 10, this.miniChartData.length)
          }
        }
      })
    },
    // 页面加载 初始化数据
    initPageData () {
      let that = this
      bus.$on('timeChanged', (data) => {
        let postData = {
          id: this.detailData.id,
          monitor_flag: true
        }
        if (data.code) {
          postData.time_range = data.code
        } else {
          postData.start_time = data.start_time
          postData.end_time = data.end_time
        }
        that.app_info_get(postData)
        this.getBottomDataFunc(data)
      })
      bus.$emit('resetTime')
    },
    goDetail (tag) {
      switch (tag) {
        case 1:
          // 基本信息
          this.$router.push({
            name: 'baseInfo',
            params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'baseInfo'}}
          })
          break
        case 2:
          // 接口组
          this.$router.push({
            name: 'apiGroup',
            params: {detailData: this.detailData, showComponent: {name: '接口组', code: 'apiGroup'}}
          })
          break
        case 3:
          // 接口过滤
          this.$router.push({
            name: 'apiFilter',
            params: {detailData: this.detailData, showComponent: {name: '接口过滤', code: 'apiFilter'}}
          })
          break
        case 4:
          // 事件订阅
          this.$router.push({
            name: 'appEventSubscribe',
            params: {detailData: this.detailData, showComponent: {name: '事件订阅', code: 'appEventSubscribe'}}
          })
          break
        default:
          break
      }
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.id) {
      this.detailData = this.$route.params
      this.$set(this.stepper[1], 'name', this.detailData.name)
      this.initPageData()
    } else {
      this.$router.push({name: 'appList'})
    }
  },
  created () {
  },
  components: {
    stepper,
    XChart,
    DYIndexBox,
    myTable
  }
}
</script>

<style lang="less" scoped>
  .content {
    width: 80%;
    padding: 24px 0 0 12px
  }
</style>
