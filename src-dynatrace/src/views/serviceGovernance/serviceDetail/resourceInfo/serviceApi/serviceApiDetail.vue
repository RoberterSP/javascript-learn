<template>
  <div class="wrapper" :class="['theme-' + theme]">
    <stepper v-if="!stepper.length" :stepper="myStepper" :theme="theme" @goRouter="goRouter"></stepper>

    <div :class="[$route.params.fromDeployGroupDetail ? 'deploy-group-detail' : '']">
      <div v-if="!isEditDetail" class="flex-column">
        <DYHeader
          no-gap
          icon="API"
          :title="detailApi.name"
          :sub-title="detailApi.state_str"
        >
          <DYButton slot="actions" type="primary" @click="editEndpointInfo"
                    v-permission="'serviceCenter_serviceDetail_edit'">编辑
          </DYButton>
        </DYHeader>

        <div class="mt10">
          <DYSplitTitle
            type="detail"
            title="详情"
            iconClickEnable
            :icon="isShowDetail ? 'arrowup' : 'arrowdown'"
            @onIconClick="isShowDetail = !isShowDetail"
          />

          <transition name="rollup">
            <div class="mt24 ml20" v-if="isShowDetail">
              <DYKeyValue
                width="470"
                v-for="item of tabList"
                :key="`key-value-${item.key}`"
                :text="item.text"
                :value="detailApi[item.key] ? detailApi[item.key] : '-'"
              />
            </div>
          </transition>

          <DYIndexBox
            :theme="theme"
            :cards="boxCards"
            :mini-chart-data="miniChartData"
          />
        </div>

        <div class="mt30">
          <DYHeader class="row-title" :title="`${list_count}个部署组`" type="small" no-gap/>
          <nt-table class="row-content"
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

          <div class="btns" v-permission="'serviceCenter_serviceDetail_edit'">
            <DYButtonGroup>
              <DYButton type="primary" @click="saveEndpointInfo">保存</DYButton>
              <DYButton @click="cancelShowEdit">取消</DYButton>
            </DYButtonGroup>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import XChart from 'components/charts/charts.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import stepper from 'components/stepper/stepper'
import DYIndexBox from 'components/indexBox/DYIndexBox.vue'

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
      miniChartData: [],

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
  computed: {
    boxCards () {
      return {
        leftTop: {
          value: this.endpointInfo.health_index,
          text: '健康指数',
          backgroundImage: 'health_index'
        },
        leftBottom: {
          value: this.endpointInfo.total_request_num,
          filter: 'filterCount',
          text: '访问量',
          backgroundImage: 'request_num'
        },
        center: {
          value: this.endpointInfo.avg_qps,
          unit: '/min',
          text: '平均QPS',
          label: '接口监控',
          onClick: () => this.goMonitor()
        },
        rightTop: {
          value: this.endpointInfo.avg_response_time,
          filter: 'currency',
          filterParams: ['ms'],
          text: '平均响应时间',
          backgroundImage: 'avg_response_time'
        },
        rightBottom: {
          value: this.endpointInfo.total_traffic,
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
        endpoint: this.detailApi.path,
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
        this.circuit_breakers = res.data.circuit_breakers
      })
      GET_HEALTH_RULE_LIST({
        page: 1,
        page_size: PAGESIZE
      }).then(res => {
        this.endpoint_healths = res.data.endpoint_healths
      })
    },
    // 应用详情获取
    app_info_get (postData) {
      GET_MESH_ENDPOINT_INFO(postData).then(res => {
        if (res.code === 0) {
          this.endpointInfo = res.data

          this.miniChartData = this.endpointInfo.avg_qps_overview.series[0].data
          if (this.miniChartData.length > 10) {
            this.miniChartData = this.miniChartData.slice(this.miniChartData.length - 10, this.miniChartData.length)
          }
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
            myCustomRouter: true,
            type: 'edit'
          })
        }

        // 设置部署组详情 step 跳转
        this.$set(this.myStepper[1], 'myCustomRouter', true)
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
            myCustomRouter: true,
            type: 'edit'
          })
        }

        this.stepper.push({
          name: this.detailApi.name,
          routerTo: 'serviceApiDetail',
          myCustomRouter: true,
          type: 'edit'
        })

        // 设置服务接口 step 跳转
        this.$set(this.stepper[2], 'myCustomRouter', true)
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
    const stepper = this.stepper.filter(step => !['serviceApiDetail', 'serviceApi'].includes(step.routerTo) && step.code !== 'edit')

    this.$emit('update:stepper', stepper)
  },
  components: {
    XChart,
    stepper,
    DYIndexBox,
    ntTable
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .wrapper {
    padding-bottom: 33px;
    /*min-width: 1570px !important;*/
    min-height: calc(100vh - 140px);
  }

  .deploy-group-detail {
    background-color: #fff;
    padding: 20px;
  }
</style>
