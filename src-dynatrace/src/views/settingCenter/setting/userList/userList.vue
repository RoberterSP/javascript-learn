<template>
  <div class="third-party p10">
    <h2 class="mb30">用户列表</h2>

    <div class="add-content mb20" v-if="isAdd">
      <add-user-form
        :isAdd="true"
        :clientDetails="addForm"
        @cancelForm="cancelForm"
        @saveForm="saveForm"></add-user-form>
    </div>

    <div class="mb30" v-else>
      <el-button type="primary" @click="isAdd = true" v-permission="'settingCenter_roleList_add'">添加用户</el-button>
    </div>

    <div class="table-content">
      <nt-table
        :tableData="tableList"
        :columns="columns"
        :tableSet="tableSet"
        :componentsName="'addUserForm'"
        @deleteOne="deleteOne"
        @changeSwitch="changeSwitch"
        @componentSaveContent="updateRowInof"></nt-table>
    </div>
  </div>
</template>

<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addUserForm from '@/views/settingCenter/setting/userList/addForm.vue'
import {
  AUTH_USER_LIST,
  NXMC_AUTH_USER_UPLOAD,
  NXMC_AUTH_USER_UPDATE,
  NXMC_AUTH_USER_STATUS,
  NXMC_AUTH_USER_DELETE
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  name: 'userList',
  data () {
    return {
      isAdd: false,
      tableSet: {
        showOpenInfo: true,
        openInfoLabel: '编辑',
        edit: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      tableList: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name',
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '用户名', // 表头名
          code: 'login',
          type: 'text',
          textAlign: 'left'
        },
        {
          name: 'Email', // 表头名字
          code: 'email', // 表身显示值
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'active', // 表身显示值
          type: 'switch',
          textAlign: 'left',
          disable: false
        },
        {
          name: '删除',
          code: '',
          type: 'delete',
          textAlign: 'right',
          showDel: true, // 删除
          width: 50,
          disable: false
        }
      ],
      addForm: {
        login: '',
        name: '',
        active: false,
        email: '',
        info: '',
        password: '',
        passwordAgain: ''
      }
    }
  },
  methods: {
    // 获取 单点登录白名单列表
    getUserList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      AUTH_USER_LIST(data).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_userList_delete')) {
            this.$set(this.columns[4], 'disable', true)
          }
          if (!this.$_accessRoutes('settingCenter_userList_changeStatus')) {
            this.$set(this.columns[3], 'disable', true)
          }
          this.tableList = res.data.user_list
          this.tableSet.paginationConfig.total = res.data.total
          this.$forceUpdate()
        }
      })
    },
    // 更新行信息
    updateRowInof (params) {
      let data = {
        user_id: params.id,
        name: params.name,
        login: params.login,
        info: params.info,
        email: params.email,
        third_party_id: params.third_party_id,
        active: params.active ? params.active : false,
        password: params.password
      }
      NXMC_AUTH_USER_UPDATE(data).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getUserList()
        }
      })
    },
    // 新增-保存方法
    saveForm (params) {
      let data = {
        name: params.name,
        login: params.login,
        info: params.info,
        email: params.email,
        third_party_id: params.third_party_id,
        active: params.active ? params.active : false,
        password: params.password
      }
      NXMC_AUTH_USER_UPLOAD(data).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getUserList()
          this.isAdd = false
        }
      })
    },
    // 删除
    deleteOne (row, index) {
      let data = {
        user_id: row.id
      }
      NXMC_AUTH_USER_DELETE(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.getUserList()
      })
    },
    // 修改用户状态
    changeSwitch (code, row, val) {
      let that = this
      that.statusFuncClick(row)
    },
    statusFuncClick (data) {
      let that = this
      let _data = { user_id: data.id, active: !data.active }
      NXMC_AUTH_USER_STATUS(_data).then(res => {
        // that.$message({
        //   message: res.data.result,
        //   type: 'success'
        // })
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        that.getUserList()
      })
    },
    // 新增-取消方法
    cancelForm () {
      this.isAdd = false
    }
  },
  created () {
    this.getUserList()
  },
  components: {
    ntTable,
    addUserForm
  }
}
</script>

<style lang="less" scoped>
@import "~common/style/variable";

.third-party {
  .h3 {
    height: 26px;
    line-height: 26px;
    margin-bottom: 9px;
  }
  .add-third-party-container {
    width: 40%;
    min-width: 400px;
    padding: 8px 8px 8px 6px;
  }

  .add-content {
    padding: 21px 0 10px 12px;
    background: @default-gray;
  }
  .table-content {
    margin-top: 22px;
  }
}

</style>
