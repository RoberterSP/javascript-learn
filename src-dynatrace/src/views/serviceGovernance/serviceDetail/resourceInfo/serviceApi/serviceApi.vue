<template>
  <div class="page p10">
    <div class="p10t6">
      <div class="flex head-title">
        <h2 class="h2-title">{{lise_count + '个服务接口'}}</h2>
        <div class="head_title_r">
          <el-button type="primary" class="mr10" @click="goSimulationRequest" v-if="isShowEle('simulationRequest')">模拟请求</el-button>

          <!-- 更多popup -->
          <ntPopover :show.sync="showMorePopup" type="small">
            <el-button icon="el-icon-more" slot="reference" @click="showMorePopup = true" v-if="isShowPrimission"></el-button>
            <div class="footer">
              <div class="second_sure_footer" v-if="confirmBatchRegister && !confirmBatchCancelRegister">
                <div class="popup-title default-label">确认批量注册？</div>
                <div class="btnsArray flex-between">
                  <el-button type="primary" class="mr10" @click="sureBatchRegister()" :disabled="chooseList && !chooseList.length">
                    是
                  </el-button>
                  <el-button  type="primary" @click="cancelSure()">否</el-button>
                </div>
              </div>
              <el-button v-permission="'serviceCenter_serviceDetail_apiList_patchReg'" @click="batchRegister" type="primary" v-show="!confirmBatchRegister && !confirmBatchCancelRegister">批量注册</el-button>
              <el-button v-permission="'serviceCenter_serviceDetail_apiList_patchUnReg'" @click="cancelRegister" type="primary" v-show="!confirmBatchRegister && !confirmBatchCancelRegister">取消注册</el-button>

              <div class="second_sure_footer" v-if="confirmBatchCancelRegister && !confirmBatchRegister">
                <div class="popup-title default-label">确认取消注册？</div>
                <div class="btnsArray flex-between">
                  <el-button type="primary" @click="sureBatchCancelRegister()"
                             class="mr10"
                             :disabled="chooseList && !chooseList.length">是
                  </el-button>
                  <el-button type="primary" @click="cancelSure()">否</el-button>
                </div>
              </div>
            </div>
          </ntPopover>
        </div>
      </div>
      <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->
      <el-input class="search" suffix-icon="el-icon-search" v-model="select_name" placeholder="请输入接口api" clearable
                @change="readMeshEndpointList()"></el-input>
      <nt-table class="table-list"
                ref="tableList"
                :tableData="endpoint_list||[]"
                :columns="columns"
                :tableSet="tableSet"
                @readDetail="readDetail"
                @checkAll="checkAll"
                @checkOne="checkOne"
      ></nt-table>
    </div>
  </div>
</template>

<script>
import {API_REGISTER, API_UNREGISTER, MESH_ENDPOINT_LIST} from '@/api/index.js'
import {PAGESIZE} from 'common/util/common.js'
import ntTable from 'components/ntTable/ntTable.vue'
import ntPopover from 'components/base/popover.vue'

import {setTimeout} from 'timers'
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
          icon_url: 'iconAPI'
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
    isShowPrimission () {
      return !(!this.$_hasPermissions('serviceCenter_serviceDetail_apiList_patchReg') && !this.$_hasPermissions('serviceCenter_serviceDetail_apiList_patchUnReg'))
    },
    isShowEle () {
      return key => {
        return this.$_hasRoute(key)
      }
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
      this.$set(this.stepper[2], 'myCoutomRouter', true)
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
        let endpoints = res.data.endpoints
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
            that.endpoint_list.map((item, index) => {
              let _b = that.endpointRouterList.find((items) => {
                return items.endpoint === item.endpoint
              })
              if (_b) {
                that.$refs.tableList.checkOne(index)
              }
            })
          }
        }, 500)
      })
    },
    showBatchRegister () {
      this.confirmBatchRegister = true
      this.confirmBatchCancelRegister = false
    },
    showBatchCancelRegister () {
      this.confirmBatchRegister = false
      this.confirmBatchCancelRegister = true
    },
    cancelSure () {
      this.confirmBatchRegister = false
      this.confirmBatchCancelRegister = false
    },
    sureBatchRegister () {
      if (!this.chooseList) {
        return
      }
      var endpointIds = this.chooseList.map(x => x.id) || []
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
      var endpointIds = this.chooseList.map(x => x.id) || []
      if (endpointIds.length <= 0) {
        return
      }
      API_UNREGISTER({
        endpoint_ids: endpointIds
      }).then(res => {
        this.confirmBatchCancelRegister = false
        this.endpointRouterList = []
        this.readMeshEndpointList()
      })
    },
    readDetail (row) {
      this.$router.push({name: 'serviceApiDetail', params: {detailData: this.detailData, detailApi: row, showComponent: {setFirstOpen: true}}})
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
    ntPopover
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .head_title_r {
    display: flex;

    .surePopup {
      width: 180px;
      z-index: 11;
      right: 63px;
      top: 0px;
      background: rgba(69, 70, 70, 1);
      border-radius: 3px;
      position: absolute;
      padding: 20px;

      .title {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        margin-bottom: 11px;
      }

      .btn-cancel {
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 1);
        background: @default-font-color;

        &:hover, &:focus {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 1);
        }
      }
    }

    .footer {
      text-align: center;

      .second_sure_footer {
        .popup-title {
          margin-top: 10px;
          margin-bottom: 11px;
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
        }

        .btnsArray {
          .el-button {
            margin-bottom: 10px;

            & + button {
              margin-top: 0px;
            }
          }
        }
      }

      button {
        margin-left: 0;

        & + button {
          margin-top: 5px;
        }
      }
    }

    .contain {
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      padding: 11px 0;
      margin-top: 32px;
    }
  }

  .page {
    .head-title {
      position: relative;
      justify-content: flex-end;

      .h2-title {
        margin-right: auto;
      }

      .popup {
        position: absolute;
        top: 0;
        right: 0;
        padding: 20px;
        width: 344px;
        background: rgba(69, 70, 70, 1);
        border-radius: 3px;
        z-index: 10;
      }
    }

    .desc {
      margin-top: 8px;
      width: 50%;
      line-height: 20px;
    }

    // .table-list {
    //   margin-top: 20px;
    // }
    .search {
      width: 80%;
      margin-top: 32px;
      margin-bottom: 20px;
    }
  }
</style>
