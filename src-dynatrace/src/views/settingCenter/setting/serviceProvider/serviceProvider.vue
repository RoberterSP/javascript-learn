<template>
  <div>
    <DYHeader class="row-title" title="服务供应商" type="small" no-gap />

    <div class="row-action add-panel" v-if="isAdd">
      <add-third-party-form
        :isAdd="true"
        :clientDetails="addForm"
        @cancelForm="cancelForm"
        @saveForm="saveForm"></add-third-party-form>
    </div>

    <div v-else class="row-action">
      <DYButton type="primary" @click="isAdd = true" v-permission="'settingCenter_namespaceList_add'">添加服务供应商</DYButton>
    </div>

    <div class="row-content">
      <nt-table
        :tableData="tableList"
        :columns="columns"
        :tableSet="tableSet"
        :componentsName="'addThirdPartyForm'"
        @deleteOne="deleteOne"
        @changeSwitch="changeSwitch"
        @componentSaveContent="updateRowInof"></nt-table>
    </div>
  </div>
</template>

<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addThirdPartyForm from '@/views/settingCenter/setting/serviceProvider/addForm.vue'
import {
  NXMC_THIRD_PARTY_LIST_GET,
  NXMC_THIRD_PARTY_UPLOAD_POST,
  NXMC_THIRD_PARTY_UPDATE_POST,
  NXMC_THIRD_PARTY_DELETE_POST,
  NXMC_THIRD_PARTY_STATUS_POST
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  name: 'serviceProvider',
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
          code: 'name', // 表身
          type: 'text'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '联系人', // 表头名字
          code: 'contact_user', // 表身显示值
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '启用/禁用', // 表头名字
          code: 'state', // 表身显示值
          type: 'switch',
          disable: false,
          textAlign: 'right'
        },
        {
          name: '删除',
          code: '',
          type: 'delete',
          textAlign: 'center',
          showDel: true, // 删除
          width: 60,
          disable: false
        }
      ],
      addForm: {
        code: '',
        name: '',
        contact_user: '',
        contact_phone: '',
        info: ''
      }
    }
  },
  methods: {
    // 获取 单点登录白名单列表
    getThirdPartyList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      NXMC_THIRD_PARTY_LIST_GET(data).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_serviceProvider_delete')) {
            this.$set(this.columns[4], 'disable', true)
          }
          if (!this.$_accessRoutes('settingCenter_serviceProvider_changeStatus')) {
            this.$set(this.columns[3], 'disable', true)
          }
          this.tableList = res.data.third_party_list
          this.tableSet.paginationConfig.total = res.data.total
          this.$forceUpdate()
        }
      })
    },
    // 更新行信息
    updateRowInof (params) {
      let data = {
        third_party_id: params.id,
        name: params.name,
        code: params.code,
        info: params.info,
        contact_phone: params.contact_phone,
        contact_user: params.contact_user
      }
      NXMC_THIRD_PARTY_UPDATE_POST(data).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getThirdPartyList()
        }
      })
    },
    // 新增-保存方法
    saveForm (params) {
      let data = {
        name: params.name,
        code: params.code,
        info: params.info,
        contact_user: params.contact_user,
        contact_phone: params.contact_phone
      }
      NXMC_THIRD_PARTY_UPLOAD_POST(data).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getThirdPartyList()
          this.isAdd = false
        }
      })
    },
    // 删除
    deleteOne (row, index) {
      let data = {
        third_party_id: row.id
      }
      NXMC_THIRD_PARTY_DELETE_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.getThirdPartyList()
      })
    },
    // 修改用户状态
    changeSwitch (code, row, val) {
      let that = this
      that.statusFuncClick(row)
    },
    statusFuncClick (data) {
      let that = this
      let _data = { third_party_id: data.id, state: !data.state }
      NXMC_THIRD_PARTY_STATUS_POST(_data).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        that.getThirdPartyList()
      })
    },
    // 新增-取消方法
    cancelForm () {
      this.isAdd = false
    }
  },
  created () {
    this.getThirdPartyList()
  },
  components: {
    ntTable,
    addThirdPartyForm
  }
}
</script>
