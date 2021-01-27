<template>
  <div>
    <DYHeader class="row-title" title="服务鉴权" type="small" no-gap/>

    <div v-if="showNew" class="add-panel row-action">
      <authentication-content :editMode="true" @close="autn_rule_list_get" :clientDetails="detailData"
                              :mesh-code='meshCode'
                              @cancelContent="cancelContent"></authentication-content>
    </div>

    <DYButton v-else class="row-action" type="primary" @click="add" v-permission="'serviceCenter_serviceDetail_authRuleList_add'">添加规则</DYButton>

    <nt-table
      class="row-content"
      ref="table"
      :tableData="tableData"
      :columns="columns"
      :tableSet="tableSet"
      :componentsName="'authenticationContent'"
      :componentProps="{meshCode: meshCode}"
      @componentSaveContent="autn_rule_list_get"
      @changeSwitch="changeSwitch"
      @deleteOne="deleteRow"
    ></nt-table>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import authenticationContent
  from '@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/authentication/authenticationContent.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import {
  AUTH_RULE_DELETE_POST,
  AUTH_RULE_LIST_GET,
  AUTH_STATUS_UPDATE_POST,
  SUBSCRIBE_RECORD_DELETE,
  SUBSCRIBE_RECORD_EDIT
} from '@/api'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      showNew: false,
      clientData: {},
      tableSet: {
        showOpenInfo: true, // 是否显示展开按钮
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
          showicon: 'iconfont',
          icon_url: 'authentication',
          type: 'text'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '鉴权方式',
          type: 'icon',
          icon_url: 'text',
          textAlign: 'center'
        },
        {
          name: '优先级',
          code: 'priority',
          type: 'text',
          textAlign: 'right'
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示的值
          type: 'switch',
          disable: false,
          textAlign: 'right'
        },
        {
          name: '删除', // 表头名字
          code: '', // 表身显示的值
          type: 'delete',
          textAlign: 'center',
          width: 60,
          disable: false
        }
      ],
      meshCode: ''
    }
  },
  computed: {},
  methods: {
    // 切换 -- table
    changeSwitch (code, row) {
      let data = {
        auth_rule_id: row.id,
        state: !row.state
      }
      this.auth_status_update_post(data)
    },
    // 修改 -- 状态
    auth_status_update_post (data) {
      AUTH_STATUS_UPDATE_POST(data).then(res => {
        // this.$message(res.data.result)
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.autn_rule_list_get()
      })
    },
    // 添加 -- table
    add () {
      this.showNew = true
    },
    cancelContent () {
      this.showNew = false
    },
    // 删除 -- table
    deleteRow (row) {
      let data = {
        auth_rule_id: row.id
      }
      AUTH_RULE_DELETE_POST(data).then(res => {
        // this.$message(res.data.result)
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.autn_rule_list_get()
      })
    },
    // 列表
    autn_rule_list_get () {
      let data = {
        mesh_code: this.detailData.code
      }
      AUTH_RULE_LIST_GET(data).then(res => {
        if (!this.$_accessRoutes('serviceCenter_serviceDetail_authRuleList_delete')) {
          this.$set(this.columns[5], 'disable', true)
        }
        if (!this.$_accessRoutes('serviceCenter_serviceDetail_authRuleList_changeStatus')) {
          this.$set(this.columns[4], 'disable', true)
        }
        this.tableData = res.data.auth_rules
        this.tableSet.paginationConfig.total = res.data.length
        this.showNew = false
      })
    },
    // 修改
    subscribe_record_edit (data) {
      SUBSCRIBE_RECORD_EDIT(data).then(res => {
        this.subscribe_record_get(this.recordPost)
      })
    },
    // 删除
    subscribe_record_delete (data, row) {
      SUBSCRIBE_RECORD_DELETE(data).then(res => {
        this.$refs.table.deleteCancel(row)
        this.subscribe_record_get(this.recordPost)
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      console.log('tag', this.detailData)
      this.meshCode = this.detailData.code
      this.autn_rule_list_get()
    }
  },
  components: {
    ntSwitch,
    authenticationContent,
    ntTable
  }
}
</script>
<style scoped lang="less">

  .query {
    width: 80%;
  }
</style>
