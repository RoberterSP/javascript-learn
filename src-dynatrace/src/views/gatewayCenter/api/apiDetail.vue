<template>
  <div class="wrapper">
    <stepper :stepper="stepper" theme="purple" @goRouter="goRouter"></stepper>
    <div class="detail_box">
      <div class="flex">
        <div class="appdetail_left">
          <div class="flex-between mt20">
            <div class="detail-title flex">
              <i class="iconfont iconAPI icon-title"></i>
              <div class="detail-tit_box">
                <span class="title-top">{{detailData.name}}</span>
                <span class="title-bottom">{{detailData.state === 'undeployed' ? '未发布' : '已发布'}}</span>
              </div>
            </div>
            <el-button class="mr20" type="primary" @click="goDetail('apiBaseInfo')" v-permission= "'gatewayCenter_apiDetail_baseInfo_edit'">编辑</el-button>
          </div>
          <div>
            <div class="detail-img flex-start" @click="isShowDetail=!isShowDetail">
              <span>
                <span class="column-icon iconfont" :class="{'iconarrowdown': !isShowDetail,'iconarrowup': isShowDetail}"></span>
                <span>详情</span>
              </span>
              <span class="split"></span>
            </div>
            <div class="content" v-show="isShowDetail">
              <div class="content-detail flex-start">
                <span class="head-left">接口URL</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.endpoint}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">接口别名</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.alias_endpoint ? detailData.alias_endpoint : '-'}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">所属服务</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.mesh_code}}</span>
                </span>
              </div>
              <div class="content-detail flex-start">
                <span class="head-left">记录日志详情</span>
                <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailData.log_enable ? "开启" : "关闭"}}</span>
                </span>
              </div>
            </div>
            <div style="overflow: scroll">
              <div class="flex-center btn-box scale-box">
                <div class="dVl-Lc">
                  <div class="box health_index">
                    <div class="num">{{appInfo.health_index}}</div>
                    <div class="text">健康指数</div>
                  </div>
                  <div class="box">
                    <div class="num request_num">{{appInfo.total_request_num | filterCount}}</div>
                    <div class="text">访问量</div>
                  </div>
                </div>
                <div class="dVl-Dc">
                  <img src="@/assets/image/icon-step-detail.svg" alt="" class="rotate180">
                </div>
                <div class="dVl-Fc">
                  <div class="dVl-Tc">
                    <div class="dVl-Gc">
                      <X-chart
                        ref="xchart"
                        :option="chartsOption"
                      ></X-chart>
                    </div>
                    <div class="dVl-Sc">
                      <span class="dVl-fd">{{appInfo.avg_qps}}</span>
                      <span class="dVl-ed">/min</span>
                      <div class="dVl-ed">平均QPS</div>
                    </div>
                  </div>
                  <div @click="goMonitor" class="dVl-Xc">
                    <div class="dVl-Jc">
                      <div class="dVl-Jc-1"></div>
                      <div class="dVl-Jc-2"></div>
                      <div class="dVl-Jc-3"></div>
                      <div class="dVl-Jc-4"></div>
                    </div>
                    <div class="dVl-Mc">
                      <div class="gwt-HTML">
                      </div>
                      <span class="dVl-Yc"></span>
                      <span class="dVl-Wc">接口监控</span>
                    </div>
                  </div>
                </div>
                <div class="dVl-Dc flex-end">
                  <img src="@/assets/image/icon-step-detail.svg" alt="">
                </div>
                <div class="dVl-Lc">
                  <div class="box avg_response_time">
                    <div class="num">{{appInfo.avg_response_time | currency('ms')}}</div>
                    <div class="text">平均响应时间</div>
                  </div>
                  <div class="box traffic">
                    <div class="num">{{appInfo.total_traffic | filterTraffic}}</div>
                    <div class="text">流量</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="appdetail_right appdetail_left">
          <div class="flex-between">
            <div class="detail-title">
              <img src="" alt="">
              <div class="detail-tit_box">
                <span class="title-top">其他</span>
                <span class="title-bottom">对接口做进一步精细化管理</span>
              </div>
            </div>
          </div>
          <div>
            <div class="btn-box flex-start btn-other">
              <div class="dVl-Lc">
                <div class="box-app flex-start">
                  <div class="img">
                    <img src="~@/assets/image/router_rules_apidetail.svg" alt="" />
                  </div>
                  <div class="api-text">
                    <div class="">
                      <span class="text">路由规则</span>
                      <span class="text-right">对于存在多个服务提供同一接口时，通过设置路由规则，可规范应用访问服务资源</span>
                    </div>
                    <div class="look-detail">
                      <div @click="goDetail('routeRule')" class="btn flex-center" v-if="isShowEle('apiGroup')">查看详情</div>
                    </div>
                  </div>
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
import XChart from 'components/charts/charts.vue'
import ntSwitch from 'components/base/switch.vue'
import stepper from 'components/stepper/stepper.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import { API_MONITOR_INFO_GET } from '@/api/index.js'
import '@/directives/currency.js'
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
      chartsOption: {
        chart: {
          type: 'column',
          style: {
            margin: 0,
            padding: 0
          },
          height: 50,
          width: 90
        },
        title: {
          text: ''
        },
        xAxis: {
          visible: false
        },
        legend: {
          enabled: false
        },
        yAxis: {
          visible: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            enableMouseTracking: false
          }
        },
        tooltip: {
          enabled: false
        },
        series: [{
          name: '',
          color: '#A972CC',
          colorByPoint: false,
          data: []
        }]
      }
    }
  },
  computed: {
    isShowEle () {
      return key => {
        return this.$_hasRoute(key)
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
      this.$router.push({ name: 'appDetail' })
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
          this.chartsOption.series[0].data = res.data.api_info.avg_qps_overview.series[0].data
          if (this.chartsOption.series[0].data.length > 10) {
            this.chartsOption.series[0].data = this.chartsOption.series[0].data.slice(this.chartsOption.series[0].data.length - 10, this.chartsOption.series[0].data.length)
          }
          this.$refs['xchart'].drawChart(this.chartsOption)
          this.$forceUpdate()
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
          this.$router.push({name: 'apiSetting', params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'apiBaseInfo'}}})
          break
        case 'routeRule':
          // 接口组
          this.$router.push({name: 'apiSetting', params: {detailData: this.detailData, showComponent: {name: '路由规则', code: 'routeRule'}}})
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
      this.$router.push({ name: 'apiList' })
    }
  },
  created () {},
  components: {
    stepper,
    splitTitle,
    XChart,
    ntSwitch
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.wrapper {
  padding-bottom: 33px;
  /*min-width: 1546px !important;*/
  .column-icon {
    color: #00A1B2;
  }
  .content {
    padding: 20px;
    font-size:12px;
    color:rgba(69,70,70,1);

    .content-detail {
      .head-left {
        line-height: 25px;
        white-space: nowrap;
      }
      .head-right {
        line-height:12px;
        width: 100%;
        .head-right-text {
          white-space:nowrap
        }
        .dashBorder {
          height: 12px;
          width: 100%;
          margin-right: 4px;
          align-items: flex-end;
          overflow: hidden;
          position: relative;
          &::after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50000px;
            border-bottom: 1px dotted #ccc;
          }
        }
      }
    }
    .detailTitle {
      color: #898989;
      margin-top: 22px;
    }
  }
  .form {
    padding: 15px;
    margin-top: 22px;
    background: #fff;
    .table-title {
      font-size:20px;
      font-family:SourceHanSansSC-Medium,SourceHanSansSC;
      font-weight:500;
      color:rgba(69,70,70,1);
    }
  }
  .appdetail_right {
    background: rgba(255, 255, 255, 1);
    flex: 1;
    margin-left: 14px;
    margin-right: 0 !important;
    /*height: 413px;*/
  }
  .detail_box {
    margin: 30px 30px 0px;
  }
  .appdetail_left {
    background: rgba(255, 255, 255, 1);
    flex: 1;
    margin-right: 14px;
    width: 50%;
    flex-shrink: 0;
    .btn {
      margin-right: 32px;
    }
    .detail-title {
      padding-left: 24px;
      .detail-tit_box {
        .title-top {
          display: block;
          font-size:28px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(69,70,70,1);
          line-height:28px;
          padding-bottom: 5px;
        }
        .title-bottom {
          display: block;
          font-size:14px;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          color:rgba(69,70,70,1);
          line-height:16px;
        }
      }
    }
    .btn-box {
      padding-top: 30px;
      padding-left: 37px;
      padding-right: 37px;
      margin-bottom: 43px;
    }
    .btn-other {
      padding-top: 11px !important;
      padding-left: 15px !important;
    }
    .dVl-Dc {
      width: 50px;
    }

    .dVl-Fc {
      -ms-flex-basis: 180px;
      -webkit-flex-basis: 180px;
      font-size: 14px;
      position: relative;
      align-self: flex-end;
      .dVl-Xc {
        &:hover {
          background-color: @purple-12;
          .dVl-Mc {
            background-color: @purple-12;
          }
        }
        .dVl-Jc {
          div {
            position: absolute;
            border-radius: 30px;
            background: #fff;
            height: 3px;
            width: 3px;
            z-index: 10;
            &:first-child {
              top: 14px;
              left: 8px;
            }
          }
        }
        .dVl-Jc-2 {
          bottom: 14px;
          left: 8px;
        }
        .dVl-Jc-3 {
          top: 7px;
          right: 8px;
        }
        .dVl-Jc-4 {
          bottom: 7px;
          right: 8px;
        }
        width: 206px;
        height: 63px;
        color: #fff;
        background: @purple-8;
        display: flex;
        align-items: baseline;
        cursor: pointer;
        box-sizing: border-box;
        position: relative;
        padding-left: 23px;
        border-radius: 3px;
        &::before {
          position: absolute;
          background: #fff;
          width: 3px;
          height: 63px;
          top: 0px;
          content: '';
          left: 18px;
        }
        &::after {
          position: absolute;
          background: #fff;
          width: 3px;
          height: 63px;
          top: 0px;
          content: '';
          right: 18px;
        }
        .dVl-Mc {
          width: 206px;
          height: 63px;
          color: #fff;
          background: @purple-8;
          display: flex;
          align-items: baseline;
          cursor: pointer;
          box-sizing: border-box;
          padding-top: 6px;
          position: relative;
          padding-left: 23px;
          border-radius: 3px;
          .dVl-Yc {
            font-weight: 300;
            font-size: 24px;
            margin-right: 5px;
          }
          .dVl-Wc {
            font-size:24px;
            line-height: 52px;
            font-family:SourceHanSansSC-Medium,SourceHanSansSC;
            font-weight:500;
            color:rgba(255,255,255,1);
          }
        }
      }
      .dVl-Tc {
        display: flex;
        display: -webkit-flex;
        display: -ms-flexbox;
        margin-bottom: 18px;
        position: relative;
        .dVl-Sc {
          flex-basis: 75px;
          -ms-flex-basis: 75px;
          -webkit-flex-basis: 75px;
          white-space: nowrap;
          color: @default-font-color;
          font-family:SourceHanSansSC-Regular,SourceHanSansSC;
          font-weight:400;
          border: 1px solid transparent;
          font-size:14px;
          padding: 2px 3px;
          cursor: pointer;
          .dVl-fd {
            font-size: 24px;
          }
          .dVl-ed {
            font-size: 14px;
          }
        }
        .dVl-Gc {
          width: 100px;
          height: 42px;
          padding-bottom: 10px;
          box-sizing: border-box;
          position: relative;
          bottom: -12px;
        }
      }
    }
    .detail-img {
      margin-top: 9px;
      width: 100%;
      height: 28px;
      padding: 0 20px;
      padding-left: 15px;
      font-size:12px;
      font-family:SourceHanSansSC-Regular,SourceHanSansSC;
      font-weight:400;
      color:rgba(137,137,137,1);
      line-height:17px;
      .split {
        margin-left: 12px;
        border: 0.5px solid #E6E6E6;
        flex-grow: 1;
      }
    }
    .dVl-Lc {
      .box-app {
        padding-left: 11px;
        margin-bottom: 33px;
        img {
          width: 102px;
          height: 60px;
          margin-right: 11px;
        }
        .api-text {
          margin-left: 10px;
          .look-detail {
            margin-top: 20px;
            .btn {
              width: 89px;
              height: 32px;
              border: 1px solid #00A1B2;
              border-radius:3px;
              font-size:14px;
              font-family:SourceHanSansSC-Regular,SourceHanSansSC;
              font-weight:400;
              color:rgba(0,161,178,1);
              cursor: pointer;
            }
          }
          .text {
            font-size:14px;
            font-family:SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight:400;
            color:rgba(69,70,70,1);
            line-height:20px;
          }
          .text-right {
            font-size:12px;
            font-family:SourceHanSansSC-Regular,SourceHanSansSC;
            font-weight:400;
            color:rgba(137,137,137,1);
            line-height:17px;
          }
        }
      }
      .box {
        max-width: 204px;
        min-width: 180px;
        height: 92px;
        background: @purple-8;
        border-radius:4px;
        padding: 18px 31px;
        margin-bottom: 34px;
        position: relative;
        // &::before {
        //   background-image: url('./../../../assets/image/icon-application.svg');
        //   background-repeat: no-repeat;
        //   background-size: 66px 66px;
        //   content: "";
        //   position: absolute;
        //   width: 66px;
        //   height: 60px;
        //   left: -22px;
        //   bottom: -16px;
        //   opacity: 0.4;
        // }
        /*&:hover {*/
        /*  background: #7C38A1;*/
        /*}*/
        &:last-child {
          margin-bottom: 0
        }
        .num {
          font-size:18px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:26px;
        }
        .text {
          font-size:16px;
          font-family:SourceHanSansSC-Medium,SourceHanSansSC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:24px;
        }
      }
    }
  }
}
</style>
