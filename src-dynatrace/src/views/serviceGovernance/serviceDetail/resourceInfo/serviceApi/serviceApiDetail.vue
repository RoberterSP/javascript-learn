<template>
  <div class="wrapper" :class="['theme-' + theme]">
    <stepper v-if="!stepper.length" :stepper="myStepper" :theme="theme" @goRouter="goRouter"></stepper>
    <div v-if="!isEditDetail" class="flex-column">
      <div class="m10 p15 appdetail_left">
        <div class="flex-between">
          <div class="detail-title">
            <i class="iconfont iconAPI icon-title"></i>
            <div class="detail-tit_box">
              <span class="title-top">{{detailApi.name}}</span>
              <span class="title-bottom">{{detailApi.state_str}}</span>
            </div>
            <el-button type="primary" @click="editEndpointInfo" v-permission="'serviceCenter_serviceDetail_edit'">编辑</el-button>
          </div>
        </div>
        <div>
          <div class="detail-img flex-start" @click="isShowDetail=!isShowDetail">
              <span>
                <span class="column-icon iconfont"
                      :class="{'iconarrowdown': !isShowDetail,'iconarrowup': isShowDetail}"></span>
                <span>详情</span>
              </span>
            <span class="split"></span>
          </div>
          <div class="content" v-show="isShowDetail">
            <div class="content-detail flex-start"
                 v-for="item in tabList"
                 :key="item.key">
              <span class="head-left">{{item.text}}</span>
              <span class="flex-start head-right ml8">
                  <div class="dashBorder flex"></div>
                  <span class="head-right-text">{{detailApi[item.key] ? detailApi[item.key] : '-'}}</span>
                </span>
            </div>
          </div>
          <div style="overflow: scroll">
            <div class="flex-center btn-box scale-box">
              <div class="dVl-Lc">
                <div class="box health_index">
                  <div class="num">{{endpointInfo.avg_qps}}</div>
                  <div class="text">平均QPS</div>
                </div>
                <div class="box request_num">
                  <div class="num">{{endpointInfo.total_request_num | filterCount}}</div>
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
                    <span class="dVl-fd">{{endpointInfo.avg_qps}}</span>
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
                  <div class="num">{{endpointInfo.avg_response_time | currency('ms')}}</div>
                  <div class="text">平均响应时间</div>
                </div>
                <div class="box traffic">
                  <div class="num">{{endpointInfo.total_traffic | filterTraffic}}</div>
                  <div class="text">流量</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m10 p15 appdetail_right appdetail_left">
        <div class="flex-between">
          <div class="detail-title">
            <div class="detail-tit_box">
              <span class="title-top">{{list_count}}个部署组</span>
              <!-- <span class="title-bottom">文字描述</span> -->
            </div>
          </div>
        </div>
        <nt-table class="table-list"
                  :tableData="deploy_groups || []"
                  :columns="columns"
                  :tableSet="tableSet"
                  :componentsName="'deployGroupsContent'"
        ></nt-table>
      </div>
    </div>

    <div v-else class="p20">
      <el-form ref="form" label-position="top">
        <el-form-item label="名称">
          <p>{{detailApi.name}}</p>
        </el-form-item>

        <el-form-item label="URL">
          <p>{{detailApi.endpoint}}</p>
        </el-form-item>

        <el-form-item label="熔断组">
          <el-select v-model="detailApi.circuit_breaker_code" clearable style="width: 300px">
            <el-option v-for="(item, index) in circuit_breakers||[]" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="健康规则">
          <el-select v-model="detailApi.endpoint_health_code" clearable style="width: 300px">
            <el-option v-for="(item, index) in endpoint_healths||[]" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="接口类型">
          <el-select v-model="detailApi.endpoint_type" style="width: 300px">
            <el-option v-for="(item, index) in endpoint_types||[]" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="footer" v-permission="'serviceCenter_serviceDetail_edit'">
          <el-button type="primary" @click="saveEndpointInfo">保存</el-button>
          <el-button @click="cancelShowEdit">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import XChart from 'components/charts/charts.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import stepper from 'components/stepper/stepper'

import {
  GET_CIRCUIT_BREAKER_LIST,
  GET_HEALTH_RULE_LIST,
  GET_MESH_ENDPOINT_INFO,
  UPDATE_MESH_ENDPOINT
} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import '@/directives/currency.js'

export default {
  props: {
    stepper: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      theme: '',
      // 自己管理的step，如果父级没有传递step 过来， 则自己管理的step 生效
      myStepper: [],
      endpointInfo: {}, // 健康指数, 平均qps
      detailData: {}, // 应用详情
      detailApi: {},
      praData: { // 应用详情的健康指数
        health: 0, // 健康指数
        avg_qps: 0, // 访问量
        traffic: 0, // 平均相应时间
        req_count: 0 // 流量
      },
      tabList: [
        {key: 'name', text: '名称'}, {key: 'endpoint', text: 'URL'},
        {key: 'state_str', text: '状态'}, {key: 'circuit_breaker_name', text: '熔断组'},
        {key: 'endpoint_health_name', text: '健康规则'},
        {key: 'endpoint_type_str', text: '接口类型'}
      ],
      isShowDetail: false,
      isEditDetail: false,
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
          color: '#4556d7',
          colorByPoint: false,
          data: []
        }]
      },
      list_count: 0,
      deploy_groups: false,
      columns: [
        {
          name: '名称', // 表头名
          code: 'deploy_group_code', // 表身
          type: 'text'
        }
      ],
      tableSet: {
        showOpenInfo: true,
        hidePagination: true
      },
      circuit_breakers: false,
      endpoint_healths: false,
      endpoint_types: [
        {
          code: 'normal',
          name: '常规接口'
        },
        {
          code: 'internal',
          name: '内部接口'
        },
        {
          code: 'public',
          name: '公共接口'
        }
      ]
    }
  },
  computed: {},
  beforeDestroy () {
    bus.$off('timeChanged')
  },
  methods: {
    goMonitor () {
      if (!this.$_hasRoute('monitorServiceApi')) {
        return
      }
      // this.$router.push({name: 'monitorApi', params: {detailData: this.detailData}})
      this.$router.push({
        name: 'monitorServiceApi',
        params: {
          stepper: this.stepper.length > 0 ? this.stepper : this.myStepper,
          detailApi: this.detailApi,
          todetailData: this.detailData
        }
      })
      const routerParam = {
        path: this.detailApi.path,
        code: this.detailData.code,
        stepperName: this.detailData.name
      }
      window.localStorage.setItem('routerParam', JSON.stringify(routerParam))
      // this.$router.push({name: 'serviceApiDetail', params: {detailData: this.detailData, detailApi: row}})
    },
    readMeshEndpointInfo () {
      GET_MESH_ENDPOINT_INFO({
        endpoint_id: this.detailApi.id
      }).then(res => {
        let endpointInfo = res.data.endpoint_info
        this.deploy_groups = endpointInfo
        this.list_count = endpointInfo ? endpointInfo.length : 0
      })
    },
    initEditData () {
      let that = this
      bus.$on('timeChanged', (data) => {
        let postData = {
          endpoint_id: this.detailApi.id,
          monitor_flag: true
        }
        if (data.code) {
          postData.time_range = data.code
        } else {
          postData.start_time = data.start_time
          postData.end_time = data.end_time
        }
        that.app_info_get(postData)
      })
      bus.$emit('resetTime')
      GET_CIRCUIT_BREAKER_LIST({
        page: 1,
        page_size: PAGESIZE
      }).then(res => {
        let circuitBreakers = res.data.circuit_breakers
        this.circuit_breakers = circuitBreakers
      })
      GET_HEALTH_RULE_LIST({
        page: 1,
        page_size: PAGESIZE
      }).then(res => {
        let endpointHealths = res.data.endpoint_healths
        this.endpoint_healths = endpointHealths
      })
    },
    // 应用详情获取
    app_info_get (postData) {
      GET_MESH_ENDPOINT_INFO(postData).then(res => {
        if (res.code === 0) {
          this.endpointInfo = res.data
          this.chartsOption.series[0].data = res.data.avg_qps_overview.series[0].data
          if (this.chartsOption.series[0].data.length > 10) {
            this.chartsOption.series[0].data = this.chartsOption.series[0].data.slice(this.chartsOption.series[0].data.length - 10, this.chartsOption.series[0].data.length)
          }
          this.$refs['xchart'].drawChart(this.chartsOption)
          this.$forceUpdate()
        }
      })
    },
    // 进入编辑页面
    editEndpointInfo () {
      this.isEditDetail = true

      // 添加编辑 step
      const step = {
        name: '编辑',
        code: 'edit',
        type: 'edit'
      }
      if (this.$route.params.fromDeployGroupDetail) {
        this.myStepper.push(step)
      } else {
        this.stepper.push(step)
      }
    },

    saveEndpointInfo () {
      let data = {
        endpoint_id: this.detailApi.id,
        endpoint_type: this.detailApi.endpoint_type
      }

      let circuitBreaker, endpointHealth

      if (this.detailApi.circuit_breaker_code) {
        circuitBreaker = this.circuit_breakers.find(x => x.code === this.detailApi.circuit_breaker_code)
        if (circuitBreaker) {
          data.circuit_breaker_id = circuitBreaker.id
        }
      }
      if (this.detailApi.endpoint_health_code) {
        endpointHealth = this.endpoint_healths.find(x => x.code === this.detailApi.endpoint_health_code)
        if (endpointHealth) {
          data.endpoint_health_id = endpointHealth.id
        }
      }

      UPDATE_MESH_ENDPOINT(data).then(res => {
        this.cancelShowEdit()

        // 同步外层显示数据
        if (endpointHealth) {
          this.detailApi.endpoint_health_name = endpointHealth.name
        }

        if (circuitBreaker) this.detailApi.circuit_breaker_name = circuitBreaker.name
      })
    },

    cancelShowEdit () {
      this.isEditDetail = false
      if (this.$route.params.fromDeployGroupDetail) {
        this.myStepper.pop()
      } else {
        this.stepper.pop()
      }
    },

    goRouter (item) {
      item.goRouter && item.goRouter()
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailApi) {
      this.detailData = this.$route.params.detailData
      this.detailApi = this.$route.params.detailApi

      if (this.$route.params.fromRouter) {
        // 如果父级没有传递来 stepper， 则使用自己的 step
        this.myStepper = this.$route.params.fromRouter
      } else {
        this.$set(this.stepper[1], 'name', this.detailData.name)
      }

      if (this.$route.params.fromDeployGroupDetail) {
        if (this.myStepper[this.myStepper.length - 1].name !== this.detailApi.name) {
          this.myStepper.push({
            name: this.detailApi.name,
            routerTo: 'deployGroupServiceApiDetail',
            myCoutomRouter: true,
            type: 'edit'
          })
        }

        // 设置部署组详情 step 跳转
        this.$set(this.myStepper[1], 'myCoutomRouter', true)
        this.$set(this.myStepper[1], 'goRouter', () => {
          this.$router.push({
            name: 'deployGroupDetail',
            params: this.detailData
          })
        })
      } else {
        if (this.stepper[this.stepper.length - 1].name !== this.detailApi.name) {
          this.myStepper.push({
            name: this.detailApi.name,
            routerTo: 'deployGroupServiceApiDetail',
            myCoutomRouter: true,
            type: 'edit'
          })
        }

        this.stepper.push({
          name: this.detailApi.name,
          routerTo: 'serviceApiDetail',
          myCoutomRouter: true,
          type: 'edit'
        })

        // 设置服务接口 step 跳转
        this.$set(this.stepper[2], 'myCoutomRouter', true)
        this.$set(this.stepper[2], 'goRouter', () => {
          this.$router.push({
            name: 'serviceApi',
            params: this.$route.params
          })
        })

        // 左侧菜单 如果存在 ，设置左侧菜单为 serviceApi
        this.$parent.falt && this.$parent.falt('serviceApi', false)
      }

      this.readMeshEndpointInfo()
    } else {
      // 如果是来自部署组详情
      if (this.$route.params.fromDeployGroupDetail) {
        this.$router.push({name: 'serviceCenter'})
      } else {
        this.$router.push({name: 'resourceInfo'})
      }
    }

    const stepper = this.stepper.length ? this.stepper : this.myStepper

    if (stepper[0].name === '部署组' || stepper[0].name === '服务列表') {
      this.theme = 'blue'
    }

    this.initEditData()
  },
  created () {
  },
  destroyed () {
    // 页面销毁时，step 删除本页面，和编辑页
    const stepper = this.stepper.filter(step => {
      return !['serviceApiDetail', 'serviceApi'].includes(step.routerTo) && step.code !== 'edit'
    })

    this.$emit('update:stepper', stepper)
  },
  components: {
    splitTitle,
    XChart,
    stepper,
    ntTable
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  @dark: @blue-14;
  @light: @blue-6;

  .theme-config() {
    &.theme-blue {
      .dVl-Mc {
        background: @light !important;
      }

      .dVl-Xc {
        background: @light !important;

        &:hover {
          background: @dark !important;

          .dVl-Mc {
            background: @dark !important;
          }
        }
      }

      .dVl-Lc .box {
        background: @light !important;

        &:hover {
          background: @light !important;
        }
      }
    }
  }

  .wrapper {
    padding-bottom: 33px;
    /*min-width: 1570px !important;*/
    min-height: calc(100vh - 140px);

    .column-icon {
      color: #00A1B2;
    }

    .content {
      padding-top: 23px;
      padding-left: 27px;
      font-size: 12px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: rgba(69, 70, 70, 1);

      .content-detail {
        line-height: 20px;
        width: 470px;

        .head-left {
          line-height: 25px;
          white-space: nowrap;
        }

        .head-right {
          line-height: 12px;
          width: 100%;

          .head-right-text {
            white-space: nowrap
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

      .footer {
        margin: 10px 0;
      }

      .detailTitle {
        color: #898989;
        margin-top: 22px;
      }
    }

    .appdetail_right {
      background: rgba(255, 255, 255, 1);
      flex: 1;
    }

    .appdetail_left {
      background: rgba(255, 255, 255, 1);
      flex: 1;
      /*min-width: 630px;*/
      flex-shrink: 0;

      .btn {
        margin-right: 32px;
      }

      .detail-title {
        display: flex;
        align-items: center;
        width: 100%;

        .iconplaceholder {
          display: flex;
          font-size: 36px;
        }

        .detail-tit_box {
          margin: 0 11px;

          .title-top {
            display: block;
            font-size: 28px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: rgba(69, 70, 70, 1);
            line-height: 28px;
            padding-bottom: 5px;
          }

          .title-bottom {
            display: block;
            font-size: 14px;
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            color: rgba(69, 70, 70, 1);
            line-height: 16px;
          }
        }

        .el-button--primary {
          margin-left: auto;
          height: 100%;
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
            background-color: #7C38A1;

            .dVl-Mc {
              background-color: #7C38A1;
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
          background: @theme-purple-light;
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
            background: @theme-purple-light;
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
              font-size: 24px;
              line-height: 52px;
              font-family: SourceHanSansSC-Medium, SourceHanSansSC;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
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
            font-family: SourceHanSansSC-Regular, SourceHanSansSC;
            font-weight: 400;
            border: 1px solid transparent;
            font-size: 14px;
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
        padding: 0 20px 0 15px;
        font-size: 12px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: rgba(137, 137, 137, 1);
        line-height: 17px;

        .split {
          margin-left: 12px;
          border: 0.5px solid #E6E6E6;
          flex-grow: 1;
        }
      }

      .dVl-Lc {
        .box-app {
          padding-left: 11px;

          &.box-app:not(:last-child) {
            margin-bottom: 33px;
          }

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
                border-radius: 3px;
                font-size: 14px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: rgba(0, 161, 178, 1);
                cursor: pointer;
              }
            }

            .text {
              font-size: 14px;
              font-family: SourceHanSansSC-Regular, SourceHanSansSC;
              font-weight: 400;
              color: rgba(69, 70, 70, 1);
              line-height: 20px;
            }

            .text-right {
              font-size: 12px;
              font-family: SourceHanSansSC-Regular, SourceHanSansSC;
              font-weight: 400;
              color: rgba(137, 137, 137, 1);
              line-height: 17px;
            }
          }
        }

        .box {
          max-width: 204px;
          min-width: 180px;
          height: 92px;
          background: @theme-purple-light;
          border-radius: 4px;
          padding: 18px 31px;
          cursor: pointer;
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
          &:hover {
            background-color: #7C38A1;
          }

          &:last-child {
            margin-bottom: 0
          }

          .num {
            font-size: 18px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 26px;
          }

          .text {
            font-size: 16px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 24px;
          }
        }
      }
    }

    .theme-config;
  }
</style>
