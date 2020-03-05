<template>
  <div class="role_container p10">
    <h2 class="mb30">角色列表</h2>
    <div>

      <div class="addPanel mb20" v-if="!isShowBtn">
        <add-role @addHandle="addHandle" @cancelContent="cancleHandle"></add-role>
      </div>

      <el-button type="primary" v-else class="mb20" @click="addRole" v-permission="'settingCenter_roleList_add'">添加角色</el-button>

      <div class="user_list">
        <nt-table :tableData="roleList" :columns="columns" @deleteOne="deleteOne" :tableSet="roleListTableSet" :componentsName="'addRole'" @componentSaveContent="saveContent"></nt-table>
      </div>
    </div>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addRole from './addRole'
import authRole from './authRole'
import { ROLE_LIST_GET, ROLE_DELETE_POST } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
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
        textAlign: 'right',
        showDel: true, // 删除
        width: 50,
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

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.role_container {
  position: relative;
  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
  }
  .empower_btn{
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .source_name{
    display: flex;
    align-items: center;
    .name{
      width: 68px;
    }
    .line{
      flex: 1;
      background-color: #E6E6E6;
      height: 1px;
    }
  }
}
</style>
