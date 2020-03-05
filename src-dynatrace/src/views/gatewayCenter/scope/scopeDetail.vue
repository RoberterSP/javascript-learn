<template>
  <div>
    <stepper :stepper="stepper" theme="purple"></stepper>
    <div class="p24">
        <div class="tableContent pt16 pr17 pb40 pl16">
            <div class="flex-between head">
                <div>
                    <h2>{{detailData.name}}</h2>
                    <h4>共{{apiTotal}}个接口</h4>
                </div>
                <div class="btnGroup">
                    <el-button type="primary" @click="goScopeCreate(2)" v-permission= "'gatewayCenter_scopeDetail_scopeGroup_apiAdd'">添加接口</el-button>
                </div>
            </div>
            <nt-table
                class="scopeTable"
                ref="table"
                :tableData="tableData"
                :columns="columns"
                :tableSet="tableSet"
                @deleteOne="deleteOne"
                @changeSwitch="changeSwitch"
                @readDetail="readDetail"
            ></nt-table>
        </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { SCOPE_API_GET, SCOPE_API_UPDATE, API_UPDATE_POST } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      stepper: [{name: '接口组', routerTo: 'scopeList'}],
      detailData: {},
      apiTotal: 0,
      tableData: [],
      tableSet: {
        showPagination: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      columns: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'edit',
          icon_url: 'iconAPI'
        },
        {
          name: '名称', // 表头名字
          code: 'name', // 表身显示值
          type: 'text'
        },
        {
          name: '服务', // 表头名字
          code: 'mesh_code_list', // 表身显示值
          type: 'tags'
          // icon_url: 'iconplaceholder'
        },
        // {
        //   name: '公共接口', // 表头名字
        //   icon_urls: ['iconpositive', 'iconnegative'],
        //   type: 'idxIcon'
        // },
        {
          name: '详细日志', // 表头名字
          code: 'log_enable', // 表身显示值
          type: 'switch',
          disable: false
        },
        {
          name: '发布', // 表头名字
          code: 'stateStr', // 表身显示值
          type: 'text',
          width: '80'
        },
        {
          name: '删除', // 表头名字
          code: 'name', // 表身
          type: 'delete',
          disable: false,
          textAlign: 'right',
          width: 50
        }
      ]
    }
  },
  computed: {},
  methods: {
    readDetail (data) {
      this.$router.push({
        name: 'apiDetail',
        params: {
          scopeDetail: data,
          toDetailData: this.detailData,
          stepper: this.stepper
        }
      })
    },
    deleteOne (row, index) {
      let data = {
        id: this.detailData.id,
        items: []
      }
      let items = JSON.parse(JSON.stringify(this.tableDataBk))
      items.splice(index, 1)
      items.map(item => {
        data.items.push(item.id)
      })
      this.scope_api_update(data)
    },
    scope_api_update (data) {
      SCOPE_API_UPDATE(data).then(res => {
        this.scope_api_get({id: this.detailData.id, page_size: PAGESIZE, page: 1})
      })
    },
    changeSwitch (code, row, val) {
      let that = this
      let params = {
        endpoint_id: row.id,
        log_enable: !val
      }
      API_UPDATE_POST(params).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        that.scope_api_get({id: this.detailData.id, page_size: PAGESIZE, page: 1})
      })
    },
    scope_api_get (data) {
      SCOPE_API_GET(data).then(res => {
        if (data.page === 1) {
          this.tableSet.paginationConfig.currentPage = 1
        }
        this.tableData = res.data.api
        if (!this.$_hasRoute('apiDetail')) {
          this.$set(this.columns[0], 'type', 'text')
          this.$set(this.columns[3], 'disable', true)
        }
        if (!this.$_accessRoutes('gatewayCenter_scopeDetail_scopeGroup_apiDelete')) {
          this.$set(this.columns[5], 'disable', true)
        }
        this.tableDataBk = JSON.parse(JSON.stringify(res.data.api))
        this.apiTotal = res.data.total
        this.tableSet.paginationConfig.total = res.data.total
        this.tableData.map(item => {
          if (item.state === 'deployed') {
            item.stateStr = '已发布'
          } else {
            item.stateStr = '未发布'
          }
          if (item.public_status) {
            item.idxIcon = 0
          } else {
            item.idxIcon = 1
          }
        })
      })
    },
    goScopeCreate (tag) {
      switch (tag) {
        case 1:
          // 基本信息
          this.$router.push({name: 'scopeBaseInfo', params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'scopeBaseInfo'}}})
          break
        case 2:
          // 接口组
          this.$router.push({name: 'scopeGroup', params: {detailData: this.detailData, showComponent: {name: '添加接口', code: 'scopeGroup'}}})
          break
        default:
          break
      }
    }
  },
  mounted () {},
  created () {
    console.log(this.$route.params)
    if (this.$route.params && this.$route.params.id) {
      this.detailData = this.$route.params
      this.stepper.push({name: this.detailData.name, routerTo: 'scopeDetail', myCoutomRouter: true})
      this.scope_api_get({id: this.detailData.id, page_size: PAGESIZE, page: 1})
    } else {
      this.$router.push({ name: 'scopeList' })
    }
  },
  components: {
    stepper,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.tableContent {
    width: 100%;
    background-color: #fff;
    // .btnGroup {
    //     padding-right: 277px;
    // }
    .scopeTable {
      margin-top: 20px;
    }
    .head {
      align-items: flex-start;
    }
}
</style>
