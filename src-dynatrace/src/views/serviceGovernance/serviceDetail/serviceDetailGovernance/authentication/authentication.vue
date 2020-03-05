<template>
  <div class="eventSub">
    <h2 class="mb30">服务鉴权</h2>
    <div v-if="showNew" class="addPanel">
      <authentication-content :editMode="true" @close="autn_rule_list_get" :clientDetails="detailData" @cancelContent="cancelContent"></authentication-content>
    </div>
    <el-button v-else @click="add" class="mb30" type="primary" v-permission="'serviceCenter_serviceDetail_authRuleList_add'">添加规则</el-button>
    <nt-table
      ref="table"
      :tableData="tableData"
      :columns="columns"
      :tableSet="tableSet"
      :componentsName="'authenticationContent'"
      @componentSaveContent="autn_rule_list_get"
      @changeSwitch="changeSwitch"
      @deleteOne="deleteRow"
    ></nt-table>
  </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntSwitch from 'components/base/switch.vue'
import authenticationContent from '@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/authentication/authenticationContent.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { AUTH_RULE_LIST_GET, SUBSCRIBE_RECORD_DELETE, SUBSCRIBE_RECORD_EDIT, AUTH_STATUS_UPDATE_POST, AUTH_RULE_DELETE_POST } from '@/api'
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
          icon_url: 'iconauthentication',
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
          icon_url: 'icontext'
        },
        {
          name: '优先级',
          code: 'priority',
          type: 'text'
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示的值
          type: 'switch',
          disable: false
        },
        {
          name: '删除', // 表头名字
          code: '', // 表身显示的值
          type: 'delete',
          textAlign: 'right',
          width: 50,
          disable: false
        }
      ]
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
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      console.log('tag', this.detailData)
      this.meshCode = this.detailData.code
      this.autn_rule_list_get()
    }
  },
  components: {
    splitTitle,
    ntSwitch,
    authenticationContent,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.ml-20 {
  margin-left: 20px;
}
.mt-23 {
  margin-top: 23px;
}
.mt-8 {
  margin-top: 8px;
}
.mt-47 {
  margin-top: 47px;
}
// .mb-37 {
//   margin-bottom: 37px;
// }
.mb-30 {
  margin-bottom: 30px;
}

.eventSub {
  padding: 10px;

  .query {
    width: 80%;
    margin-top: 76px;
    margin-bottom: 20px;
    margin-left: 15px;
  }
}
</style>
