<template>
  <div>
    <stepper :stepper="stepper" theme="purple"></stepper>
    <div class="p20">
      <DYCard class="margin-card">
        <DYHeader
          class="row-title"
          no-gap
          :title="detailData.name"
          :sub-title="`共${apiTotal}个接口`"
        >
          <DYButton slot="actions" type="primary" @click="goScopeCreate(2)"
                    v-permission="'gatewayCenter_scopeDetail_scopeGroup_apiAdd'">添加接口
          </DYButton>
        </DYHeader>

        <nt-table
          class="row-content"
          ref="table"
          :tableData="tableData"
          :columns="columns"
          :tableSet="tableSet"
          @deleteOne="deleteOne"
          @readDetail="readDetail"
        ></nt-table>
      </DYCard>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import {SCOPE_API_GET, SCOPE_API_UPDATE} from '@/api'
import {PAGESIZE} from 'common/util/common.js'

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
          icon_url: 'API'
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
          // icon_url: 'placeholder'
        },
        // {
        //   name: '公共接口', // 表头名字
        //   icon_urls: ['positive', 'negative'],
        //   type: 'idxIcon'
        // },
        {
          name: '发布', // 表头名字
          code: 'stateStr', // 表身显示值
          type: 'text',
          width: '80'
        },
        {
          name: '详细日志', // 表头名字
          code: 'log_enable', // 表身显示值
          type: 'switch',
          disable: true,
          textAlign: 'right'
        },
        {
          name: '删除', // 表头名字
          code: 'name', // 表身
          type: 'delete',
          disable: false,
          textAlign: 'center',
          width: 60
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
      data.items = items.map(item => item.id)

      this.scope_api_update(data)
    },
    scope_api_update (data) {
      SCOPE_API_UPDATE(data).then(res => {
        this.scope_api_get({id: this.detailData.id, page_size: PAGESIZE, page: 1})
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
        }
        if (!this.$_accessRoutes('gatewayCenter_scopeDetail_scopeGroup_apiDelete')) {
          this.$set(this.columns[5], 'disable', true)
        }
        this.tableDataBk = JSON.parse(JSON.stringify(res.data.api))
        this.apiTotal = res.data.total
        this.tableSet.paginationConfig.total = res.data.total

        this.tableData.forEach(item => {
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
          this.$router.push({
            name: 'scopeBaseInfo',
            params: {detailData: this.detailData, showComponent: {name: '基本信息', code: 'scopeBaseInfo'}}
          })
          break
        case 2:
          // 接口组
          this.$router.push({
            name: 'scopeGroup',
            params: {detailData: this.detailData, showComponent: {name: '添加接口', code: 'scopeGroup'}}
          })
          break
        default:
          break
      }
    }
  },
  mounted () {
  },
  created () {
    console.log(this.$route.params)
    if (this.$route.params && this.$route.params.id) {
      this.detailData = this.$route.params
      this.stepper.push({name: this.detailData.name, routerTo: 'scopeDetail', myCustomRouter: true})
      this.scope_api_get({id: this.detailData.id, page_size: PAGESIZE, page: 1})
    } else {
      this.$router.push({name: 'scopeList'})
    }
  },
  components: {
    stepper,
    ntTable
  }
}
</script>
