<template>
  <div>
    <DYHeader
      no-gap
      type="small"
      class="row-title"
      title="单点登录白名单"
    />

    <DYButton v-if="!isAdd" type="primary" class="row-action" @click="isAdd = true"
              v-permission="'settingCenter_singleSignOn_add'">添加白名单
    </DYButton>

    <div class="add-panel row-action" v-else>
      <add-form-container
        :isAdd="true"
        :clientDetails="addForm"
        @cancelForm="cancelForm"
        @saveForm="saveForm"></add-form-container>
    </div>

    <nt-table
      class="row-content"
      :tableData="tableList"
      :columns="columns"
      :tableSet="tableSet"
      :componentsName="'addFormContainer'"
      @deleteOne="deleteOne"
      @componentSaveContent="updateRowInof"/>
  </div>
</template>

<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addFormContainer from '@/views/settingCenter/setting/singleSignOn/addForm.vue'
import {
  NXMC_SSO_WHITELIST_DELETE_POST,
  NXMC_SSO_WHITELIST_GET,
  NXMC_SSO_WHITELIST_UPDATE_POST,
  NXMC_SSO_WHITELIST_UPLOAD_POST
} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  name: 'singleSignOn',
  data () {
    return {
      isAdd: false,
      tableSet: {
        showOpenInfo: true,
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
          name: '服务名', // 表头名字
          code: 'service_name', // 表身显示值
          type: 'text',
          textAlign: 'left'
        },
        {
          name: '域名', // 表头名字
          code: 'domain_name', // 表身显示值
          type: 'text',
          textAlign: 'left'
        },
        // {
        //   name: '服务用户数', // 表头名字
        //   code: 'total_users', // 表身显示值
        //   type: 'text',
        //   width: 100,
        //   textAlign: 'center'
        // },
        {
          name: '删除',
          code: '',
          disable: false,
          type: 'delete',
          textAlign: 'center',
          showDel: true, // 删除
          width: 60
        }
      ],
      addForm: {}
    }
  },
  methods: {
    // 获取 单点登录白名单列表
    getSSOWhiteList () {
      let data = {
        page_size: PAGESIZE,
        page: 1,
        name: ''
      }
      NXMC_SSO_WHITELIST_GET(data).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_singleSignOn_delete')) {
            this.$set(this.columns[3], 'disable', true)
          }
          this.tableList = res.data.sso_whitelist
          this.tableSet.paginationConfig.total = res.data.total
          this.$forceUpdate()
        }
      })
    },
    // 更新行信息
    updateRowInof (params) {
      const data = {
        name: params.name,
        service_name: params.service_name,
        domain_name: params.domain_name,
        sso_whitelist_id: params.sso_whitelist_id
      }
      NXMC_SSO_WHITELIST_UPDATE_POST({sso_whitelist: [data]}).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getSSOWhiteList()
        }
      })
    },
    // 新增-保存方法
    saveForm (params) {
      const data = {
        name: params.name,
        service_name: params.service_name,
        domain_name: params.domain_name
      }
      NXMC_SSO_WHITELIST_UPLOAD_POST({sso_whitelist: [data]}).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getSSOWhiteList()
          this.isAdd = false
        }
      })
    },
    // 删除
    deleteOne (row, index) {
      let arr = []
      this.tableList.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let data = {
        sso_whitelist_id: row.sso_whitelist_id
      }
      NXMC_SSO_WHITELIST_DELETE_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.getSSOWhiteList()
      })
    },
    // 新增-取消方法
    cancelForm () {
      this.isAdd = false
    }
  },
  created () {
    this.getSSOWhiteList()
  },
  components: {
    ntTable,
    addFormContainer
  }
}
</script>
