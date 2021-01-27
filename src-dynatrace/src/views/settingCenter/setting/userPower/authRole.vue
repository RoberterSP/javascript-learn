<template>
  <div class="auth_container">
    <DYHeader class="row-title" :title="detailData.name" type="small" no-gap>
      <div slot="actions">
        <DYButtonGroup>
          <DYButton @click="cancle">取消</DYButton>
          <DYButton type="primary" @click="onSure">确认</DYButton>
        </DYButtonGroup>
      </div>
    </DYHeader>
    <div class="mt44">
      <div>
        <div class="source_name"><span class="name">资源名称</span> <div class="line"></div></div>
            <div style="margin-top: 18px;"></div>
            <div class="tree_list_container">
                <el-tree
                    :data="authSourceList"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    default-expand-all
                    highlight-current
                    check-strictly
                    :props="defaultProps"
                    @check="handleCheckBox"
                    class="tree_list">
                </el-tree>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { ROLE_AUTH_SOURCE_SET, OWNER_SOURCE_LSIT_GET, AUTH_SOURCE_LIST_GET } from '@/api'
export default {
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled (data) {
          return !data.state
        }
      },
      detailData: false,
      roleList: [], // 角色列表
      authSourceList: [],
      selectedSourceList: [],
      treeRealeseObj: false,
      curCheckedNode: [] // 当前被选中的节点对象数组
    }
  },
  computed: {
  },
  methods: {
    // 点击取消按钮
    cancle () {
      this.$router.push({name: 'roleList'})
    },
    // 点击确认按钮
    onSure () {
      ROLE_AUTH_SOURCE_SET({resources: this.selectedSourceList, group_id: this.detailData.id}).then(res => {
        if (res.code === 0) this.setShowPage(false)
      }).catch(() => {
        this.$router.push({name: 'roleList'})
      })
    },
    // 树形树形框被选中
    handleCheckBox (curData, treeData) {
      this.curCheckedNode = []
      this.getTreeChild(curData)
      // 全部取消
      if (treeData.checkedKeys.length <= 0) {
        this.$refs.tree.setCheckedKeys([])
      } else if (treeData.checkedKeys.length > 0 && treeData.checkedKeys.indexOf(curData.id) > -1) {
        // 选中
        this.curCheckedNode.forEach(item => {
          this.$refs.tree.setChecked(item.id, true, false)
        })
        this.setCheckParentNode(curData)
      } else {
        // 取消
        this.curCheckedNode.forEach(item => {
          this.$refs.tree.setChecked(item.id, false, false)
        })
        this.cancleCheckNode(curData)
      }
      this.selectedSourceList = this.$refs.tree.getCheckedKeys()
    },
    // 选择父级节点
    setCheckParentNode (node) {
      if (node.type === 'operation') {
        this.$refs.tree.setChecked(node.parent_id, true, false)
      }
      if (node.type === 'page' || node.type === 'menu') {
        if (this.treeRealeseObj[node.parent_id] !== undefined) {
          const parentObj = this.treeRealeseObj[node.parent_id]
          this.$refs.tree.setChecked(parentObj.id, true, false)
          // if (parentObj.children !== undefined) {
          //   const selectedSourceList = this.$refs.tree.getCheckedKeys()
          //   const everyObj = parentObj.children.every(item => {
          //     return selectedSourceList.indexOf(item.id) > -1
          //   })
          //   if (everyObj) {
          //     this.$refs.tree.setChecked(parentObj.id, true, false)
          //   }
          // }
        }
      }
      if (this.treeRealeseObj[node.parent_id] !== undefined) {
        this.setCheckParentNode(this.treeRealeseObj[node.parent_id])
      }
    },
    // 选择父级节点
    cancleCheckNode (node) {
      // if (node.type === 'page' || node.type === 'menu') {
      //   if (this.treeRealeseObj[node.parent_id] !== undefined) {
      //     const parentObj = this.treeRealeseObj[node.parent_id]
      //     const selectedSourceList = this.$refs.tree.getCheckedKeys()
      //     const everyObj = parentObj.children.some(item => {
      //       return selectedSourceList.indexOf(item.id) > -1 && item.type === 'operation'
      //     })
      //     if (!everyObj) this.$refs.tree.setChecked(parentObj.id, false, false)
      //   }
      // }
      // if (this.treeRealeseObj[node.parent_id] !== undefined) {
      //   this.cancleCheckNode(this.treeRealeseObj[node.parent_id])
      // }
    },
    getTreeChild (treeObj) {
      if (undefined === treeObj || treeObj === null || (!treeObj) instanceof Object) {
        return
      }
      this.curCheckedNode.push(treeObj)
      if (treeObj.children && treeObj.children.length > 0) {
        for (let child of treeObj.children) {
          this.getTreeChild(child)
        }
      }
    },
    buildParentList (treeList, obj) {
      treeList.forEach(tree => {
        obj[tree.id] = tree
        if (tree.children !== undefined) {
          this.buildParentList(tree.children, obj)
        }
      })
      return obj
    },
    getRoleSourceList () {
      AUTH_SOURCE_LIST_GET({auth_flag: true}).then(res => {
        if (res.code === 0) {
          this.authSourceList = res.data.resource_list
          const obj = this.buildParentList(res.data.resource_list, {})
          this.treeRealeseObj = obj
        }
      })
    },
    getOwneerRoleList (groupId) {
      OWNER_SOURCE_LSIT_GET({group_id: groupId}).then(res => {
        if (res.code === 0) {
          res.data.resource_ids.forEach(id => {
            this.$refs.tree.setChecked(id, true, false)
          })
          this.selectedSourceList = res.data.resource_ids
        }
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.getRoleSourceList()
      this.getOwneerRoleList(this.detailData.id)
    } else {
      this.$router.go(-1)
    }
  },
  created () {
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
  .mt44 {
    margin-top: 44px;
  }
</style>
<style lang="less">
.tree_list{
  .el-tree-node__content{
    height: 32px !important;
  }
}
.auth_container {
  position: relative;
}
</style>
