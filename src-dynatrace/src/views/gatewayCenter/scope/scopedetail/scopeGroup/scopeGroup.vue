<template>
  <div>
    <DYHeader type="small" no-gap :title="'添加接口'"/>

    <div class="row-desc">已添加 {{tableData.data ? tableData.data.length : 0}} 个</div>

    <div class="search-bar-box row-action">
      <search-bar
        v-model.trim="queryAdd"
        @search="searchAddScopeGroup"
        :placeholder="'搜索接口'"
      ></search-bar>
    </div>
    <div class="add-title row-content">
      <!-- 该应用添加的接口组 -->
      <nt-table
        :tableData="tableData.data"
        :columns="tableData.columns"
        :tableSet="tableData.tableSet"
        @deleteOne="deleteOne"
      ></nt-table>
    </div>

    <div>
      <div class="search-bar-box row-action">
        <search-bar
          v-model.trim="query"
          @search="searchAllScopeGroup"
          :placeholder="'搜索接口'"
        ></search-bar>
      </div>
      <div class="add-title row-content">
        <!-- 所有的接口组 -->
        <nt-table
          :tableData="tableDataApi.data"
          :columns="tableDataApi.columns"
          :tableSet="tableDataApi.tableSet"
          @addColumn="addColumn"
        ></nt-table>
      </div>
    </div>
  </div>
</template>

<script>
import dySwitch from 'components/base/switch.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import {API_LIST_GET, SCOPE_API_GET, SCOPE_API_UPDATE} from '@/api'
import {clone} from 'lodash'

export default {
  data () {
    return {
      scope_ids: [], // 已经添加的接口组信息
      scopeGroup: {}, // 某个应用的详情信息
      showGroup: false, // 是否展示group
      query: '', // 查询列表里面的接口组
      queryAdd: '', // 查询已经添加的接口组
      tabList: [{
        title: '接口组'
      }, {
        title: '已添加五个接口'
      }],
      tableData: {
        data: [],
        columns: [
          {
            name: '已添加接口', // 表头名
            code: 'endpoint', // 表身
            type: 'text',
            showicon: 'iconfont',
            icon_url: 'API',
            sortAbled: false, // 排序
            showDel: false // 删除
          },
          {
            name: '名称', // 表头名
            code: 'name', // 表身
            type: 'text',
            sortAbled: false, // 排序
            showDel: false // 删除
          },
          {
            name: '服务', // 表头名
            code: 'mesh_code_list', // 表身
            type: 'tags'
          },
          {
            name: '详情日志', // 表头名字
            code: 'log_enable', // 表身显示的值
            type: 'switch',
            disable: true,
            showDel: false, //
            sortAbled: false, // 是否显示排序
            sortOrder: 'none', // 排序
            textAlign: 'right'
          },
          {
            name: '发布', // 表头名字
            code: 'stateStr', // 表身显示值
            type: 'text',
            disable: false,
            width: '80'
          },
          {
            name: '删除', // 表头名字
            code: '', // 表身
            type: 'delete',
            disable: false,
            textAlign: 'center',
            width: 50,
            showDel: true, // 删除
            hasSort: false
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            defaultPage: 5,
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 5,
            total: 14
          }
        }
      },
      // 所有接口数量
      tableDataApi: {
        data: [],
        columns: [
          {
            name: '接口', // 表头名
            code: 'endpoint', // 表身
            type: 'text',
            showicon: 'iconfont',
            icon_url: 'API',
            sortAbled: false, // 排序
            showDel: false // 删除
          },
          {
            name: '名称', // 表头名
            code: 'name', // 表身
            type: 'text',
            sortAbled: false, // 排序
            showDel: false // 删除
          },
          {
            name: '服务', // 表头名
            code: 'mesh_code_list', // 表身
            type: 'tags'
            // showicon: 'iconfont',
            // icon_url: 'placeholder',
            // sortAbled: true, // 是否显示排序
            // sortOrder: 'none' // 排序方式
          },
          // {
          //   name: '公共接口', // 表头名字
          //   code: 'public_status', // 表身
          //   icon_urls: ['positive', 'negative'],
          //   type: 'idxIcon'
          // },
          {
            name: '详情日志', // 表头名字
            code: 'log_enable', // 表身显示的值
            disable: true,
            type: 'switch',
            showDel: false, //
            sortAbled: false, // 是否显示排序
            sortOrder: 'none', // 排序
            textAlign: 'right'
          },
          {
            name: '发布', // 表头名字
            code: 'stateStr', // 表身显示值
            type: 'text',
            width: '80'
          },
          {
            name: '添加', // 表头名字
            code: 'log_enable', // 表身显示的值
            type: 'add',
            width: 50,
            disable: false,
            showDel: false, //
            sortAbled: false, // 是否显示排序
            sortOrder: 'none', // 排序
            textAlign: 'center' // 头部排序
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            defaultPage: 5,
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 5,
            total: 14
          }
        },
        appScopeListCpoy: []
      },
      detailDataCopy: {}
    }
  },
  props: {
    detailData: {
      type: Object,
      default: () => ({
        name: '',
        code: '',
        id: ''
      })
    }
  },
  methods: {
    // input 框输入
    searchAddScopeGroup () {
      this.app_scope_list_get()
    },
    searchAllScopeGroup () {
      this.api_list_get()
    },
    // 是否展示接口组
    addColumn (row) {
      let arr = []
      this.appScopeListCpoy.forEach(item => arr.push(item.id))
      arr.push(row.id)
      let post = {
        id: this.detailDataCopy.id,
        items: arr
      }
      SCOPE_API_UPDATE(post).then(res => {
        // this.tableData.data.push(row)
        this.queryAdd = ''
        this.app_scope_list_get()
        this.api_list_get()
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    // 删除
    deleteOne (row) {
      let arr = []
      this.appScopeListCpoy.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let post = {
        id: this.detailDataCopy.id,
        items: arr
      }
      SCOPE_API_UPDATE(post).then(res => {
        // this.tableData.data.splice(index, 1)
        const index = this.appScopeListCpoy.findIndex(item => item.id === row.id)
        if (index > -1) this.appScopeListCpoy.splice(index, 1)
        this.app_scope_list_get()
        this.api_list_get()
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    // 获取已经添加的scope信息
    async app_scope_list_get () {
      let post = {
        id: this.detailDataCopy.id,
        page: 1,
        page_size: PAGESIZE
      }
      if (this.queryAdd) post.name = this.queryAdd
      await SCOPE_API_GET(post).then(res => {
        if (!this.queryAdd) this.appScopeListCpoy = JSON.parse(JSON.stringify(res.data.api))
        if (!this.$_accessRoutes('gatewayCenter_scopeDetail_scopeGroup_apiDelete')) {
          this.$set(this.tableData.columns[5], 'disable', true)
        }
        this.tableData.data = res.data.api
        this.api_list_get()
        if (this.queryAdd) this.tableData.tableSet.paginationConfig.currentPage = 1
        this.tableData.tableSet.paginationConfig.total = res.data.total
        this.tableData.data.forEach(item => {
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
    // 接口调用方法
    api_list_get () {
      let data = {
        page: 1,
        page_size: PAGESIZE,
        public_status: false
      }
      if (this.query) data.name = this.query
      API_LIST_GET(data).then(res => {
        this.tableDataApi.data = res.data.api
        if (!this.$_accessRoutes('gatewayCenter_scopeDetail_scopeGroup_apiAdd')) {
          this.$set(this.tableDataApi.columns[5], 'disable', true)
        }
        let apiList = []
        if (this.appScopeListCpoy.length) {
          res.data.api.forEach(ele => {
            let findIndex = this.appScopeListCpoy.findIndex(row => row.id === ele.id)
            if (findIndex < 0) {
              apiList.push(ele)
            }
          })
          this.tableDataApi.data = apiList
        } else {
          this.tableDataApi.data = res.data.api
        }
        this.tableDataApi.tableSet.paginationConfig.total = res.data.total - this.tableData.tableSet.paginationConfig.total
        if (this.query) this.tableDataApi.tableSet.paginationConfig.currentPage = 1
        this.tableDataApi.data.forEach(item => {
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
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailDataCopy = clone(this.$route.params.detailData)

      this.app_scope_list_get()
    } else {
      this.detailDataCopy = clone(this.detailData)
    }
  },
  created () {
  },
  components: {
    dySwitch,
    searchBar,
    // slotTable,
    ntTable
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .search-bar-box {
    width: 80%;
    margin-top: 32px;

  }

</style>
