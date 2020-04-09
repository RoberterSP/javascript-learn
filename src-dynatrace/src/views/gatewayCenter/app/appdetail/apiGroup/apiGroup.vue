<template>
  <div>
    <DYHeader title="接口组" type="small" no-gap/>

    <div class="row-desc">已添加 {{tableData.data.length}} 个接口组</div>

    <div v-show="tableData.data.length > 0 || queryAdd">

      <DYTabs
        class="row-action"
        theme="purple"
        :tabList="tabList"
        @onClick="tabsClick"
      ></DYTabs>

      <div v-show="showAddGroup">
        <div class="search-bar-box row-action">
          <search-bar
            v-model.trim="queryAdd"
            @search="changeQueryAdd"
            :placeholder="'搜索接口组名称'"
          ></search-bar>
        </div>

        <div class="row-content">
          <!-- 该应用添加的接口组 -->
          <nt-table
            :tableData="tableData.data"
            :columns="tableData.columns"
            :tableSet="tableData.tableSet"
            @deleteOne="deleteOne"
          ></nt-table>
        </div>
      </div>

      <div v-show="!showAddGroup">
        <!-- 该应用添加的接口组的接口数量 -->
        <div class="row-content">
          <nt-table
            :tableData="tableDataEndpoints.data"
            :columns="tableDataEndpoints.columns"
            :tableSet="tableDataEndpoints.tableSet"
          ></nt-table>
        </div>
      </div>
    </div>

    <div v-show="showAddGroup">
      <div class="search-bar-box row-action">
        <search-bar
          v-model.trim="query"
          @search="change"
          :placeholder="'搜索接口组名称'"
        ></search-bar>
      </div>
      <div class="row-content">
        <!-- 所有的接口组 -->
        <nt-table
          :tableData="tableListData.data"
          :columns="tableListData.columns"
          :tableSet="tableListData.tableSet"
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
import {clone} from 'lodash'
import {APP_SCOPE_LIST_GET, APP_SCOPE_UPDATE_POST, NXMC_METRICS_APP_GET, SCOPE_LIST_GET} from '@/api'

export default {
  data () {
    return {
      detailData: {},
      showAddGroup: true,
      query: '', // 查询列表里面的接口组
      queryAdd: '', // 查询已经添加的接口组
      tabList: [{
        title: '接口组'
      }, {
        title: '包含(0)个接口（含公共接口）'
      }],
      tableData: {
        data: [],
        dataCache: [],
        columns: [
          {
            name: '已添加接口组', // 表头名
            code: 'name', // 表身
            type: 'text',
            width: 400,
            showicon: 'iconfont',
            icon_url: 'APIgroup1'
          },
          {
            name: '接口数', // 表头名
            code: 'endpoint_num', // 表身
            type: 'text',
            sortAbled: true, // 是否显示排序
            sortOrder: 'none', // 排序方式
            textAlign: 'right',
            textAiignWithoutIcon: true // 右对齐但是不希望和sort icon对齐仅和文字右对齐
          },
          {
            name: '删除', // 表头名字
            code: '', // 表身
            type: 'delete',
            showDel: true, // 删除
            textAlign: 'center',
            disable: false,
            width: 80
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
      // 接口数量
      tableDataEndpoints: {
        data: [],
        columns: [
          {
            name: '已添加接口', // 表头名
            code: 'endpoint', // 表身
            type: 'text',
            icon_url: 'API',
            width: 400,
            hasSort: false, // 排序
            showDel: false // 删除
          },
          {
            name: '名称', // 表头名
            code: 'name', // 表身
            type: 'text',
            hasSort: false, // 排序
            showDel: false // 删除
          },
          {
            name: '服务', // 表头名
            code: 'mesh_code_list', // 表身
            type: 'tags',
            hasSort: false, // 排序
            showDel: false // 删除
          },
          {
            name: '公共接口', // 表头名字
            code: 'public_status', // 表身显示值
            icon_urls: ['public', 'private'],
            type: 'idxIcon',
            textAlign: 'center'
          },
          {
            name: '发布', // 表头名字
            code: 'stateStr', // 表身
            type: 'text',
            width: '80',
            textAlign: 'right'
          }
        ],
        tableSet: {
          showOpenInfo: false,
          showPagination: true,
          paginationConfig: {
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 10,
            total: 14
          }
        }
      },
      tableListData: {
        data: [],
        dataCache: [],
        columns: [
          {
            name: '接口组', // 表头名
            code: 'name', // 表身
            type: 'text',
            width: 400,
            showicon: 'iconfont',
            icon_url: 'APIgroup1'
          },
          {
            name: '接口数', // 表头名
            code: 'endpoint_num', // 表身
            type: 'text',
            sortAbled: true, // 是否显示排序
            sortOrder: 'none', // 排序方式
            textAlign: 'right',
            textAiignWithoutIcon: true // 右对齐但是不希望和sort icon对齐仅和文字右对齐
          },
          {
            name: '添加', // 表头名字
            code: '', // 表身
            type: 'add',
            showDel: true, // 删除
            showApi: false, // 展示
            hasSort: false, // 排
            width: 80,
            disable: false,
            textAlign: 'center' // 头
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
      }
    }
  },
  methods: {
    // 拉取当前app 已添加的接口组 & 所有可用接口组
    async fetchAllList () {
      // scope_list_get 出来的数据通过 app_scope_list_get 的结果进行过滤
      await this.app_scope_list_get()

      this.scope_list_get()

      this.nxmc_metrice_app_get()
    },
    // input 框输入
    change () {
      this.tableListData.data = this.tableListData.dataCache.filter(item => item.name.includes(this.query))
    },
    changeQueryAdd () {
      this.tableData.data = this.tableData.dataCache.filter(item => item.name.includes(this.queryAdd))
    },
    // 是否展示接口组
    addColumn (row) {
      let arr = []
      this.tableData.data.forEach(item => arr.push(item.id))
      arr.push(row.id)
      let post = {
        id: this.detailData.id,
        scope_ids: arr
      }
      APP_SCOPE_UPDATE_POST(post).then(res => {
        this.fetchAllList()
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    tabsClick (item, index) {
      // eslint-disable-next-line no-unneeded-ternary
      this.showAddGroup = index === 0 ? true : false
    },
    // 删除
    deleteOne (row, index) {
      let arr = []
      this.tableData.data.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let post = {
        id: this.detailData.id,
        scope_ids: arr
      }
      APP_SCOPE_UPDATE_POST(post).then(res => {
        this.fetchAllList()
        // this.tableData.data.splice(index, 1)

        // #50923 此处直接更新会导致网速慢的时候数字变动两次
        // this.tabList[1].title = `已添加${this.tableData.data.length}个接口`

        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    // 获取已添加的接口组
    app_scope_list_get () {
      let post = {
        id: this.detailData.id
      }
      return APP_SCOPE_LIST_GET(post).then(res => {
        if (!this.$_accessRoutes('gatewayCenter_appDetail_scopeDelete')) {
          this.$set(this.tableData.columns[2], 'disable', true)
        }
        this.tableData.data = res.data.scope_list
        this.tableData.dataCache = clone(res.data.scope_list)
        this.tableData.tableSet.paginationConfig.total = res.data.total
      })
    },
    // 获取所有接口组
    scope_list_get () {
      const data = {
        page: 1,
        page_size: PAGESIZE
      }
      SCOPE_LIST_GET(data).then(res => {
        // 移除已经添加的接口组
        const addedIds = this.tableData.data.map(item => item.id)
        if (!this.$_accessRoutes('gatewayCenter_appDetail_scopeAdd')) {
          this.$set(this.tableListData.columns[2], 'disable', true)
        }
        this.tableListData.data = (res.data.scope_list && res.data.scope_list.filter(item => !addedIds.includes(item.id))) || []

        this.tableListData.dataCache = clone(this.tableListData.data)

        this.tableListData.tableSet.paginationConfig.total = res.data.total
      })
    },
    // 获取该应用下的所有接口
    nxmc_metrice_app_get () {
      let post = {
        id: this.detailData.id,
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_METRICS_APP_GET(post).then(res => {
        this.tableDataEndpoints.data = res.data.api
        this.tableDataEndpoints.tableSet.paginationConfig.total = res.data.total
        this.tabList[1].title = `包含(${this.tableDataEndpoints.data.length})个接口（含公共接口）`
        this.tableDataEndpoints.data.forEach(item => {
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
      this.fetchAllList()
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
  }

  .splitTitle {
    padding: initial !important;
  }

  .form {
    .url-name {
      padding: 14px;
    }
  }
</style>
