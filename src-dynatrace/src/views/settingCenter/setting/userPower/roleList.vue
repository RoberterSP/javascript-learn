<template>
  <div class="role_container">
    <DYHeader
      no-gap
      class="row-title"
      type="small"
      title="角色列表"
    />

    <div class="add-panel row-action" v-if="!isShowBtn">
      <add-role @addHandle="addHandle" @cancelContent="cancleHandle"></add-role>
    </div>

    <DYButton type="primary" v-else class="row-action" @click="addRole" v-permission="'settingCenter_roleList_add'">
      添加角色
    </DYButton>

    <div class="row-content">
      <nt-table :tableData="roleList" :columns="columns" @deleteOne="deleteOne" :tableSet="roleListTableSet"
                :componentsName="'addRole'" @componentSaveContent="saveContent"/>
    </div>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addRole from './addRole'
import authRole from './authRole'
import {ROLE_DELETE_POST, ROLE_LIST_GET} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      isShowBtn: true,
      columns: [{
        name: '名称', // 表头名
        code: 'name',
        type: 'text'
      }, {
        name: '删除',
        code: '',
        type: 'delete',
        textAlign: 'center',
        showDel: true, // 删除
        width: 60,
        disable: false
      }],
      roleList: [], // 角色列表
      page: 1, // 第几页
      curCheckedNode: [], // 当前被选中的节点对象数组
      roleListTableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: PAGESIZE
        }
      }
    }
  },
  methods: {
    // 点击添加绝收按钮
    addRole () {
      this.isShowBtn = false
    },
    // 添加
    addHandle () {
      this.isShowBtn = true
      this.getRoleList()
    },
    // 取消
    cancleHandle () {
      this.isShowBtn = true
    },
    // 删除
    deleteOne (row, index) {
      let data = {
        group_id: row.id
      }
      ROLE_DELETE_POST(data).then(res => {
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.getRoleList()
      })
    },
    getRoleList () {
      ROLE_LIST_GET({page: this.page, page_size: PAGESIZE}).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_roleList_delete')) {
            this.$set(this.columns[1], 'disable', true)
          }
          this.roleList = res.data.group_list
          this.roleListTableSet.paginationConfig.total = res.data.total
        }
      })
    },
    saveContent () {
      this.getRoleList()
    }
  },
  mounted () {
    this.$parent.resetStepper && this.$parent.resetStepper()
  },
  created () {
    this.getRoleList()
  },
  components: {
    ntTable,
    addRole,
    authRole
  }
}
</script>
