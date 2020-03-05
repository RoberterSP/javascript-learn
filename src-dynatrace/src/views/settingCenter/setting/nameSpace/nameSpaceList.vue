<template>
  <div class="role_container p10">
    <h2 class="mb30">命名空间</h2>
    <div class="add-content mb20" v-if="!isShowBtn" >
      <add-name-space @addHandle="addHandle" @cancelContent="cancleHandle"></add-name-space>
    </div>
    <el-button v-else type="primary" class="mb30" @click="addNameSpace" v-permission="'settingCenter_namespaceList_add'">添加命名空间</el-button>
    <div class="user_list">
      <nt-table :tableData="nameSpaceList" :columns="columns" :tableSet="nameSpaceListTableSet" :componentsName="'addNameSpace'" @changeSwitch="changeSwitch" @componentSaveContent="saveContent"></nt-table>
    </div>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addNameSpace from './addNameSpace'
import { NAME_SPACE_LIST_GET, GET_NAME_SPACE_INFO, UPDATE_NAME_SPACE_STATE } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      isShowBtn: true,
      columns: [{
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
        name: '服务数量', // 表头名
        code: 'total_mesh_num',
        type: 'text'
      },
      {
        name: '节点数量', // 表头名
        code: 'total_node_num',
        type: 'text'
      },
      {
        name: '启用/禁用', // 表头名
        code: 'state',
        disable: false,
        type: 'switch'
      }],
      nameSpaceList: [], // 角色列表
      page: 1, // 第几页
      curCheckedNode: [], // 当前被选中的节点对象数组
      nameSpaceListTableSet: { // 角色列表分页设置
        showOpenInfo: true, // 是否显示展开按钮
        hidePagination: true
      }
    }
  },
  computed: {
  },
  methods: {
    // 点击添加按钮
    addNameSpace () {
      this.isShowBtn = false
    },
    // 添加
    addHandle () {
      this.isShowBtn = true
      this.getNameSpaceList()
    },
    // 取消
    cancleHandle () {
      this.isShowBtn = true
    },
    getNameSpaceList () {
      NAME_SPACE_LIST_GET({page: this.page, page_size: PAGESIZE}).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_namespaceList_changeStatus')) {
            this.$set(this.columns[4], 'disable', true)
          }
          res.data.namespaces.forEach(async (item, index) => {
            await GET_NAME_SPACE_INFO({namespace_id: item.id}).then(data => {
              const info = data.data.namespace_info
              item.status = info.status
              item.total_node_num = info.total_node_num
              item.total_group_num = info.total_group_num
              item.total_mesh_num = info.total_mesh_num
              this.$set(this.nameSpaceList, index, item)
            })
          })
        }
      })
    },
    changeSwitch (code, row, val) {
      const params = {}
      params.state = !row.state
      params.namespace_id = row.id
      UPDATE_NAME_SPACE_STATE(params).then(res => {
        if (res.code === 0) {
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getNameSpaceList()
          // this.nameSpaceList.some(item => {
          //   if (item.id === row.id) {
          //     item.state = params.state
          //     return true
          //   }
          //   return false
          // })
        }
      })
    },
    saveContent () {
      this.getNameSpaceList()
    }
  },
  mounted () {
  },
  created () {
    this.getNameSpaceList()
  },
  components: {
    ntTable,
    addNameSpace
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

  .add-content {
    padding: 21px 0 10px 12px;
    background: @default-gray;
  }
}
</style>
