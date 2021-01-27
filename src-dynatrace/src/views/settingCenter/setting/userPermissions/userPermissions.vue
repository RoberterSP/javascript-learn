<template>
  <div class="user_permissions_container">
    <DYHeader title="用户权限" type="small" no-gap/>
    <div class="mt20"></div>
    <edit-roles v-if="!isShowBtn" @cancelContent="cancleHandle"></edit-roles>
    <div class="user_list">
      <nt-table
        :tableData="userPermissions"
        :columns="columns"
        :tableSet="tableSet"
        :componentsName="'editRoles'"
        @componentSaveContent="saveHandle"
      ></nt-table>
    </div>
  </div>
</template>
<script>
// import { mapActions, mapState } from 'vuex'
import ntTable from 'components/ntTable/ntTable.vue'
import editRoles from './editRoles.vue'
import {AUTH_USER_LIST, NXMC_AUTH_USER_UPDATE_POST} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'

export default {
  data () {
    return {
      isShowBtn: true,
      userPermissions: [],
      columns: [{
        name: '名称', // 表头名
        code: 'name',
        type: 'text'
      }, {
        name: '角色', // 表头名
        code: 'group_names',
        type: 'tags'
      }],
      tableSet: {
        showOpenInfo: true, // 是否显示展开按钮
        openInfoLabel: '编辑',
        showPagination: true,
        allCheck: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      page: 1 // 第几页
    }
  },
  computed: {},
  methods: {
    // 更新系统用户数据
    updateAuthUserInfo (params) {
      let _this = this
      let data = {
        user_id: params.user_id,
        name: params.name,
        groups: params.groups,
        login: params.login,
        email: params.email,
        info: params.info
      }
      NXMC_AUTH_USER_UPDATE_POST(data).then(res => {
        if (res.code === 0) {
          _this.getUserPermissionsList()
        }
      })
    },
    // 获取系统用户列表
    getUserPermissionsList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      AUTH_USER_LIST(data).then(res => {
        this.isShowBtn = true
        res.data.user_list.forEach(item => {
          let groupNames = []
          let groupIds = []
          item.groups.forEach(el => {
            groupNames.push(el.name)
            groupIds.push(el.gid)
          })
          item.group_ids = groupIds
          item.group_names = groupNames
          // item.group_names = groupNames.join(', ')
        })
        this.userPermissions = res.data.user_list
        this.tableSet.paginationConfig.total = res.data.total
        this.$forceUpdate()
      })
    },
    cancleHandle () {
      this.isShowBtn = true
    },
    // 修改角色提交
    saveHandle (params, row) {
      this.updateAuthUserInfo(params)
    }
  },
  mounted () {
    this.getUserPermissionsList({page: this.page, pageSize: PAGESIZE})
  },
  created () {
  },
  components: {
    ntTable,
    editRoles
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .user_permissions_container {
    .desc {
      margin-top: 9px;
      width: 50%;
      line-height: 20px;
    }
  }
</style>
