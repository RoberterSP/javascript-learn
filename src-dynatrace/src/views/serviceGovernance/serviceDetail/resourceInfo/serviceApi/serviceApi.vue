<template>
  <div>
    <DYHeader class="row-title" :title="`${lise_count}个服务接口`" type="small" no-gap>

      <div slot="actions">
        <DYButtonGroup>
          <DYButton type="primary" @click="goSimulationRequest" v-if="isShowEle('simulationRequest')">模拟请求</DYButton>

          <DYPopover :show.sync="showMorePopup" type="small">
            <DYButton slot="reference" @click="showMorePopup = true" v-if="isShowPermission">
              <DYIcon type="more" size="14"/>
            </DYButton>

            <div v-if="confirmBatchRegister && !confirmBatchCancelRegister">
              <p class="no-warp mb10">确认批量注册？</p>

              <DYButtonGroup between>
                <DYButton theme="dark" type="primary" @click="sureBatchRegister()"
                          :disabled="chooseList && !chooseList.length">是
                </DYButton>
                <DYButton theme="dark" @click="cancelSure()">否</DYButton>
              </DYButtonGroup>
            </div>

            <DYButtonGroup direction="column">
              <DYButton theme="dark" @click="batchRegister"
                        v-permission="'serviceCenter_serviceDetail_apiList_patchReg'"
                        v-show="!confirmBatchRegister && !confirmBatchCancelRegister">批量注册
              </DYButton>
              <DYButton theme="dark" @click="cancelRegister"
                        v-permission="'serviceCenter_serviceDetail_apiList_patchUnReg'"
                        v-show="!confirmBatchRegister && !confirmBatchCancelRegister">取消注册
              </DYButton>
            </DYButtonGroup>

            <div v-if="confirmBatchCancelRegister && !confirmBatchRegister">
              <p class="no-warp mb10">确认取消注册？</p>

              <DYButtonGroup between>
                <DYButton theme="dark" type="primary" @click="sureBatchCancelRegister()"
                          :disabled="chooseList && !chooseList.length">是
                </DYButton>
                <DYButton theme="dark" @click="cancelSure()">否</DYButton>
              </DYButtonGroup>
            </div>
          </DYPopover>
        </DYButtonGroup>
      </div>
    </DYHeader>

    <div class="search row-action">
      <search-bar
        v-model.trim="select_name"
        @search="readMeshEndpointList"
        :placeholder="'请输入接口api'"
      />
    </div>
    <nt-table class="row-content"
              ref="tableList"
              :tableData="endpoint_list||[]"
              :columns="columns"
              :tableSet="tableSet"
              @readDetail="readDetail"
              @checkAll="checkAll"
              @checkOne="checkOne"
    ></nt-table>
  </div>
</template>

<script>
import {API_REGISTER, API_UNREGISTER, MESH_ENDPOINT_LIST} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import ntTable from 'components/ntTable/ntTable.vue'
import searchBar from 'components/searchBar/searchBar.vue'

import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      lise_count: 0,
      isRegister: false, // 批量注册
      isCancelRegister: false, // 取消批量注册
      showMorePopup: false,
      endpoint_list: false,
      endpointRouterList: [],
      columns: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'API'
        }, {
          name: '名称', // 表头名字
          code: 'name', // 表身显示值
          type: 'text'
        }, {
          name: '熔断组', // 表头名字
          code: 'circuit_breaker_name', // 表身显示值
          type: 'text',
          width: 120
        }, {
          name: '健康规则', // 表头名字
          code: 'endpoint_health_name', // 表身显示值
          type: 'text',
          width: 100
        }, {
          name: '接口类型', // 表头名字
          code: 'endpoint_type_str', // 表身显示值
          type: 'text',
          width: 80
        }, {
          name: '状态', // 表头名字
          code: 'state_str', // 表身显示值
          type: 'text',
          width: 60
        }, {
          name: '全选', // 表头名字
          code: 'check', // 表身显示值
          type: 'checkbox',
          textAlign: 'right',
          width: 80
        }
      ],
      confirmBatchRegister: false,
      confirmBatchCancelRegister: false,
      chooseList: [],
      tableSet: {
        showPagination: false,
        showOpenInfo: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 5000
        },
        allCheck: false
      },
      select_name: '',
      detailData: {},
      stepper: []
    }
  },
  computed: {
    isShowPermission () {
      return !(!this.$_hasPermissions('serviceCenter_serviceDetail_apiList_patchReg') && !this.$_hasPermissions('serviceCenter_serviceDetail_apiList_patchUnReg'))
    },
    isShowEle () {
      return key => this.$_hasRoute(key)
    }
  },
  methods: {
    goSimulationRequest () {
      if (this.chooseList && !this.chooseList.length) {
        bus.$emit('openMessage', {
          message: '请选择接口',
          type: 'warning'
        })
        return
      }
      this.$set(this.stepper[2], 'myCustomRouter', true)
      this.$set(this.stepper[2], 'routerTo', 'serviceApi')
      this.$router.push({
        name: 'simulationRequest',
        params: {apiData: this.chooseList, stepper: this.stepper, todetailData: this.detailData}
      })
    },
    batchRegister () {
      if (this.chooseList && !this.chooseList.length) {
        bus.$emit('openMessage', {
          message: '请选择要注册的接口',
          type: 'warning'
        })
        return
      }
      this.confirmBatchRegister = true
    },
    cancelRegister () {
      if (this.chooseList && !this.chooseList.length) {
        bus.$emit('openMessage', {
          message: '请选择要取消注册的接口',
          type: 'warning'
        })
        return
      }
      this.confirmBatchCancelRegister = true
    },
    readMeshEndpointList () {
      let data = {
        page: 1,
        page_size: PAGESIZE,
        mesh_code: this.detailData.code
      }
      if (this.select_name) {
        data.name = this.select_name
      }
      let that = this
      MESH_ENDPOINT_LIST(data).then(res => {
        if (!this.$_hasRoute('serviceApiDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        let {endpoints} = res.data
        this.lise_count = res.data.total || 0
        this.$set(this.tableSet.paginationConfig, 'total', res.data.total || 0)
        this.endpoint_list = endpoints
        this.endpoint_list.forEach(x => {
          let stateStr = '未注册'
          if (x.state === 'unregistered') {
            stateStr = '未注册'
          }
          if (x.state === 'registered') {
            stateStr = '已注册'
          }
          if (x.state === 'deployed') {
            stateStr = '已发布'
          }
          this.$set(x, 'state_str', stateStr)
          let endpointTypeStr = '常规接口'
          if (x.endpoint_type === 'normal') {
            endpointTypeStr = '常规接口'
          }
          if (x.endpoint_type === 'internal') {
            endpointTypeStr = '内部接口'
          }
          if (x.endpoint_type === 'public') {
            endpointTypeStr = '公共接口'
          }
          this.$set(x, 'endpoint_type_str', endpointTypeStr)
          this.$set(x, 'check', false)
        })
        this.showMorePopup = false
        this.chooseList = []
        setTimeout(() => {
          if (that.endpointRouterList.length > 0) {
            that.endpoint_list.forEach((item, index) => {
              let _b = that.endpointRouterList.find((items) => items.endpoint === item.endpoint)
              if (_b) {
                that.$refs.tableList.checkOne(index)
              }
            })
          }
        }, 500)
      })
    },
    cancelSure () {
      this.confirmBatchRegister = false
      this.confirmBatchCancelRegister = false
    },
    sureBatchRegister () {
      if (!this.chooseList) {
        return
      }
      let endpointIds = this.chooseList.map(x => x.id) || []
      if (endpointIds.length <= 0) {
        return
      }
      API_REGISTER({
        endpoint_ids: endpointIds
      }).then(res => {
        this.confirmBatchRegister = false
        this.endpointRouterList = []
        this.readMeshEndpointList()
      })
    },
    sureBatchCancelRegister () {
      if (!this.chooseList) {
        return
      }
      let endpointIds = this.chooseList.map(x => x.id) || []
      if (endpointIds.length <= 0) {
        return
      }
      API_UNREGISTER({
        endpoint_ids: endpointIds
      }).then(() => {
        this.confirmBatchCancelRegister = false
        this.endpointRouterList = []
        this.readMeshEndpointList()
      })
    },
    readDetail (row) {
      this.$router.push({
        name: 'serviceApiDetail',
        params: {detailData: this.detailData, detailApi: row, showComponent: {setFirstOpen: true}}
      })
    },
    checkAll (list) {
      this.chooseList = list
      console.log('checkAll', list)
    },
    checkOne (list, notList) {
      this.chooseList = list
      console.log('checkOne', list, notList)
    }
  },
  mounted () {
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.stepper = this.$route.params.stepper
      if (this.$route.params.endpointList && this.$route.params.endpointList.length > 0) {
        this.endpointRouterList = this.$route.params.endpointList
      }
      this.readMeshEndpointList()
    } else {
      this.$router.push({name: 'serviceList'})
    }
  },
  components: {
    ntTable,
    searchBar
  }
}
</script>
<style scoped lang="less">
  .search {
    width: 80%;
  }
</style>
