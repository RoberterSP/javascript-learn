<template>
  <div>
    <stepper :stepper="stepper" theme="blue"></stepper>
    <DYPageHeader title="配置检查" icon="Applicationhealth" theme="blue">
      <DYButton slot="actions" type="primary" @click="startConfigCheck" v-permission="'serviceCenter_configCheckList_startConfigCheck'">开始检查</DYButton>
    </DYPageHeader>

    <div class="down p20">
      <div style="width: 80%" class="mb20">
        <search-bar
          v-model.trim="query"
          @search="queryTable"
          :placeholder="'请输入内容'"
        />
      </div>

      <DYCard>
        <DYHeader class="row-title" :title="`${total}次配置检查`" type="small" no-gap />
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
import searchBar from 'components/searchBar/searchBar.vue'
import { CONFIG_CHECK_LIST_POST, CONFIG_CHECK_DELETE_POST, CONFIG_PATCH_CHECK_POST } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
import {debounce} from 'lodash'

export default {
  data () {
    return {
      query: '',
      total: 0,
      stepper: [{ name: '配置检查', routerTo: 'configCheckList' }],
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
          name: '操作用户', // 表头名
          code: 'create_username', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'Applicationhealth'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text',
          width: 320
        },
        {
          name: '检查时间', // 表头名字
          code: 'created_at', // 表身显示值
          type: 'text'
        },
        {
          name: '检查节点数量', // 表头名字
          code: 'total_node_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          textAlign: 'right',
          width: 120,
          sortOrder: 'none',
          textAiignWithoutIcon: true
        },
        {
          name: '删除',
          code: '',
          type: 'delete',
          disable: false,
          textAlign: 'center',
          width: 60,
          showDel: true
        }
      ],
      queryTable: debounce(this.queryTableHandle, 300)
    }
  },
  computed: {},
  methods: {
    queryTableHandle () {
      let data = {
        page: 1,
        page_size: PAGESIZE,
        name: this.query
      }
      this.check_history_list_get(data)
    },

    startConfigCheck () {
      let params = {}
      CONFIG_PATCH_CHECK_POST(params).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let data = {
          page: 1,
          page_size: PAGESIZE
        }
        this.check_history_list_get(data)
      })
    },
    readDetail (row) {
      this.$router.push({ name: 'configCheckDetail', params: {configCheckDetail: row} })
    },
    check_history_list_get (data) {
      CONFIG_CHECK_LIST_POST(data).then(res => {
        if (data.page === 1) {
          this.tableSet.paginationConfig.currentPage = 1
        }
        if (!this.$_accessRoutes('serviceCenter_configCheckList_delete')) {
          this.$set(this.columns[4], 'disable', true)
        }
        if (!this.$_hasRoute('configCheckDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        this.tableData = res.data.history_list
        this.tableSet.paginationConfig.total = res.data.total
        this.total = res.data.total
      })
    },
    // 删除
    deleteOne (row, index) {
      let arr = []
      this.tableData.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let data = {
        history_id: row.id
      }
      CONFIG_CHECK_DELETE_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let data = {
          page: 1,
          page_size: PAGESIZE
        }
        this.check_history_list_get(data)
      })
    }
  },
  mounted () {},
  created () {
    let data = {
      page: 1,
      page_size: PAGESIZE
    }
    this.check_history_list_get(data)
  },
  components: {
    stepper,
    ntTable,
    searchBar
  }
}
</script>
