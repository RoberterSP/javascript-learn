<template>
  <div class="filterBox">
    <split-title :title="'添加接口'"></split-title>
    <div class="desc">已添加 {{tableData.data ? tableData.data.length : 0}} 个</div>
    <div class="addBtn">
      <div>
        <div class="search-bar-box">
          <search-bar
            v-model.trim="queryAdd"
            @search="searchAddScopeGroup"
            :placeholder="'搜索接口'"
          ></search-bar>
        </div>
        <div class="add-title">
          <!-- 该应用添加的接口组 -->
          <nt-table
            :tableData="tableData.data"
            :columns="tableData.columns"
            :tableSet="tableData.tableSet"
            @deleteOne="deleteOne"
          ></nt-table>
        </div>
      </div>
      <div>
        <div class="search-bar-box">
          <search-bar
            v-model.trim="query"
            @search="searchAllScopeGroup"
            :placeholder="'搜索接口'"
          ></search-bar>
        </div>
        <div class="add-title">
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
  </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import dyButton from 'components/base/button.vue'
import dySwitch from 'components/base/switch.vue'
import ntTabs from 'components/base/tabs.vue'
import searchBar from 'components/searchBar/searchBar.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import {
  SCOPE_API_GET,
  API_LIST_GET,
  SCOPE_API_UPDATE
} from '@/api'

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
            icon_url: 'iconAPI',
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
            disable: false,
            showDel: false, //
            sortAbled: false, // 是否显示排序
            sortOrder: 'none' // 排序
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
            textAlign: 'right',
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
            icon_url: 'iconAPI',
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
            // icon_url: 'iconplaceholder',
            // sortAbled: true, // 是否显示排序
            // sortOrder: 'none' // 排序方式
          },
          // {
          //   name: '公共接口', // 表头名字
          //   code: 'public_status', // 表身
          //   icon_urls: ['iconpositive', 'iconnegative'],
          //   type: 'idxIcon'
          // },
          {
            name: '详情日志', // 表头名字
            code: 'log_enable', // 表身显示的值
            type: 'switch',
            showDel: false, //
            sortAbled: false, // 是否显示排序
            sortOrder: 'none' // 排序
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
            textAlign: 'right' // 头部排序
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
      }
    }
  },
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          name: '',
          code: '',
          id: ''
        }
      }
    }
  },
  computed: {
    scopeDetail: {
      get: function () {
        return this.detailData
      },
      set: function () {}
    }
  },
  methods: {
    addApiFilter () {
      console.log('添加接口滤')
    },
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
        id: this.detailData.id,
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
    deleteOne (row, index) {
      let arr = []
      this.appScopeListCpoy.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let post = {
        id: this.detailData.id,
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
        id: this.scopeDetail.id,
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
        this.tableData.data.map(item => {
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
        this.tableDataApi.data.map(item => {
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
      this.detailData = this.$route.params.detailData
      this.app_scope_list_get()
    }
  },
  created () {},
  components: {
    splitTitle,
    dyButton,
    dySwitch,
    ntTabs,
    searchBar,
    // slotTable,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.filterBox {
  padding: 20px;
  .desc {
    font-size: 14px;
    font-weight: 400;
    color: rgba(69,70,70,1);
    line-height: 20px;
    // margin-left: 20px;
    margin-top: 8px;
  }
  .addBtn {
    // margin-top: 62px;
    .search-bar-box {
      width: 80%;
      margin-top: 32px;
    }
    .add-title {
      padding-top: 20px;
      .splitTitle {
        padding: initial !important;
      }
    }
    .form {
      .url-name {
        padding: 14px;
      }
    }
  }
}
</style>
