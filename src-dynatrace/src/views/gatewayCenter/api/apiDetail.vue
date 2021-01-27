<template>
  <div>
    <stepper :stepper="stepper" theme="purple" @goRouter="goRouter"></stepper>

    <div class="flex p20">
      <DYCard class="margin-card half-width">
        <DYHeader
          class="mb10"
          no-gap
          icon="API"
          :title="detailData.name"
          :sub-title="detailData.state === 'undeployed' ? '未发布' : '已发布'"
        >
          <DYButton slot="actions" type="primary" @click="goDetail('apiBaseInfo')"
                    v-permission="'gatewayCenter_apiDetail_baseInfo_edit'">编辑
          </DYButton>
        </DYHeader>

        <DYSplitTitle
          type="detail"
          title="详情"
          iconClickEnable
          :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
          @onIconClick="isShowDetail = !isShowDetail"
        />

        <transition name="rollup">
          <div class="content" v-if="isShowDetail">
            <DYKeyValue
              v-for="item of keyValueList"
              :key="`key-value-${item.text}`"
              :text="item.text"
              :value="item.value"
            />
          </div>
        </transition>

        <DYIndexBox
          :cards="boxCards"
          :mini-chart-data="miniChartData"
          scale-box
        />

      </DYCard>

      <DYCard class="margin-card">
        <DYHeader
          class="mb30"
          no-gap
          title="其他"
          sub-title="对接口做进一步精细化管理"
        />

        <DYList
          class="mb32"
          mainTitle="路由规则"
          subTitle="对于存在多个服务提供同一接口时，通过设置路由规则，可规范应用访问服务资源">
          <template slot="img">
            <img src="~@/assets/image/router_rules_apidetail.svg" alt="">
          </template>
          <template slot="btn">
            <DYButton @click="goDetail('routeRule')"
                      v-if="isShowEle('apiGroup')">查看详情
            </DYButton>
          </template>
        </DYList>
      </DYCard>

    </div>
  </div>
</template>

<script>
import XChart from 'components/charts/charts.vue'
import ntSwitch from 'components/base/switch.vue'
import stepper from 'components/stepper/stepper.vue'
import {API_MONITOR_INFO_GET} from '@/api/index.js'
import '@/directives/currency.js'
import DYIndexBox from 'components/indexBox/DYIndexBox.vue'
// import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      appInfo: {}, // 健康指数, 平均qps
      detailData: {}, // 应用详情
      showStyle: 'row', // row column:
      isShowDetail: false,
      app_list: false,
      stepper: [
        {
          name: '接口',
          routerTo: 'apiList'
        },
        {
          name: ''
        }
      ],
      toDetailData: {},
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
      // 光标数据
      miniChartData: []
    }
  },
  computed: {
    isShowEle () {
      return key => this.$_hasRoute(key)
    },
    keyValueList () {
      return [
        {
          text: '接口URL',
          value: this.detailData.endpoint
        },
        {
          text: '接口别名',
          value: this.detailData.alias_endpoint || '-'
        },
        {
          text: '所属服务',
          value: this.detailData.mesh_code
        },
        {
          text: '记录日志详情',
          value: this.detailData.log_enable ? '开启' : '关闭'
        }
      ]
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
          label: '接口监控',
          onClick: () => this.goMonitor()
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
  methods: {
    goRouter (item) {
      this.$router.push({name: item.routerTo, params: this.toDetailData})
    },
    goMonitor () {
      if (!this.$_hasRoute('monitorApi')) {
        return
      }
      this.$router.push({name: 'monitorApi', params: {detailData: this.detailData}})
    },
    initApp () {
      this.$router.push({name: 'appDetail'})
    },
    cutShowStyle (style) {
      this.showStyle = style
    },
    switchChange () {
      this.ruleForm.state = !this.ruleForm.state
    },
    // 应用详情获取
    api_info_get (postData) {
      API_MONITOR_INFO_GET(postData).then(res => {
        if (res.code === 0) {
          this.appInfo = res.data.api_info

          this.miniChartData = res.data.api_info.avg_qps_overview.series[0].data
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
        that.api_info_get(postData)
      })
      bus.$emit('resetTime')
    },
    goDetail (name) {
      this.detailData.code = name
      switch (name) {
        case 'apiBaseInfo':
          // 基本信息
          this.$router.push({
            name: 'apiSetting',
            params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'apiBaseInfo'}}
          })
          break
        case 'routeRule':
          // 接口组
          this.$router.push({
            name: 'apiSetting',
            params: {detailData: this.detailData, showComponent: {name: '路由规则', code: 'routeRule'}}
          })
          break
        default:
          break
      }
    }
  },
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  mounted () {
    if (this.$route.params && this.$route.params.scopeDetail) {
      this.toDetailData = this.$route.params.toDetailData
      this.detailData = this.$route.params.scopeDetail
      this.$set(this.stepper, 0, this.$route.params.stepper[0])
      this.$set(this.stepper, 1, this.$route.params.stepper[1])
      this.stepper.push(
        {
          name: this.detailData.name
        }
      )
      this.initPageData()
    } else if (this.$route.params && this.$route.params.id) {
      this.detailData = this.$route.params
      this.stepper[1].name = this.detailData.name
      this.initPageData()
    } else {
      this.$router.push({name: 'apiList'})
    }
  },
  created () {
  },
  components: {
    stepper,
    XChart,
    DYIndexBox,
    ntSwitch
  }
}
</script>

<style lang="less" scoped>
  .content {
    width: 80%;
    padding: 24px 0 0 12px
  }
</style>
