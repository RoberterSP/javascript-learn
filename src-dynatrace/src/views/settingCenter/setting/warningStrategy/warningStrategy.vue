<template>
  <div class="strategy">
    <DYHeader class="row-title" title="预警策略" type="small" no-gap />

    <div class="add-panel row-action" v-if="showContent">
      <addRule :create="true" @close="showContent = false" @create="onItemCreate"></addRule>
    </div>

    <DYButton class="row-action" v-else @click="showContent = true" type="primary" v-permission="'settingCenter_warningStrategy_add'">添加预警策略</DYButton>

    <nt-table
      class="row-content"
      ref="table"
      :tableData="tableData"
      :columns="columns"
      :tableSet="tableSet"
      :componentsName="'strategyContent'"
      @changeSwitch="changeSwitch"
      @componentSaveContent="onItemCreate"
      @deleteOne="deleteRow"
    ></nt-table>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import addRule from 'views/settingCenter/setting/warningStrategy/addRule.vue'
import {
  ALERT_RULE_DELETE,
  ALERT_RULE_INFO,
  ALERT_RULE_LIST_GET,
  ALERT_RULE_STATUS_UPDATE_INFO,
  ALERT_RULE_UPDATE
} from '@/api'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      showContent: false,
      tableSet: {
        showOpenInfo: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      tableData: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身
          type: 'switch',
          disable: false,
          width: '120',
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
  props: {
  },
  computed: {
  },
  methods: {
    onItemCreate () {
      let data = {page: 1, page_size: PAGESIZE}
      this.alert_rule_list_get(data)

      this.showContent = false
    },
    deleteRow (row) {
      this.alert_rule_delete({alert_rule_id: row.alert_rule_id})
    },
    changeSwitch (code, row, val) {
      let that = this
      let params = {
        alert_rule_id: row.alert_rule_id,
        state: !val
      }
      ALERT_RULE_STATUS_UPDATE_INFO(params).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let data = {page: 1, page_size: PAGESIZE}
        this.tableData = []
        that.alert_rule_list_get(data)
      })
    },
    alert_rule_info (data) {
      ALERT_RULE_INFO(data).then(res => {
        let postData = res.data
        postData.state = !postData.state

        postData.notification_user = res.data.notification_user.map(item => ({user_id: item.user_id}))

        this.alert_rule_update(postData)
      })
    },
    alert_rule_update (data) {
      ALERT_RULE_UPDATE(data).then(res => {
        // this.$message('更新成功')
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let data = {page: 1, page_size: PAGESIZE}
        this.tableData = []
        this.alert_rule_list_get(data)
      })
    },
    alert_rule_delete (data) {
      ALERT_RULE_DELETE(data).then(res => {
        // this.$message('删除成功')
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let data = {page: 1, page_size: PAGESIZE}
        this.tableData = []
        this.alert_rule_list_get(data)
      })
    },
    alert_rule_list_get (data) {
      ALERT_RULE_LIST_GET(data).then(res => {
        if (!this.$_accessRoutes('settingCenter_warningStrategy_changeStatus')) {
          this.$set(this.columns[2], 'disable', true)
        }
        if (!this.$_accessRoutes('settingCenter_warningStrategy_delete')) {
          this.$set(this.columns[3], 'disable', true)
        }
        this.tableData = res.data.alert_rules
      })
    }
  },
  mounted () {
  },
  created () {
    let data = {page: 1, page_size: PAGESIZE}
    this.alert_rule_list_get(data)
  },
  components: {
    ntSwitch,
    addRule,
    ntTable
  }
}
</script>
