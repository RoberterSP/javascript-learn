<template>
  <div class="editRoles">
    <el-form class="default-width" :model="editRolesForm" :rules="rules" ref="editRolesForm" label-position="top">
      <el-form-item class="mb-30" label="角色" prop="group_ids">
        <el-select v-model="editRolesForm.group_ids" placeholder="请选择角色" multiple>
          <el-option v-for="(item, index) in roleList" :key="index"
          :label="item.name"
          :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="btns" v-permission="'settingCenter_userPermissions_edit'">
        <el-button type="primary" @click="submitForm('editRolesForm')">保存</el-button>
        <el-button @click="cancleForm('editRolesForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import { ROLE_LIST_GET } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data () {
    return {
      editRolesForm: {
        user_id: '',
        name: '',
        group_ids: [],
        groups: [] // 角色
      },
      rules: {
        group_ids: [
          { required: true, message: '角色不能为空', trigger: 'change' }
        ]
      },
      roleList: []
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            user_id: _this.editRolesForm.id,
            name: _this.editRolesForm.name,
            groups: _this.editRolesForm.group_ids,
            login: _this.editRolesForm.login,
            email: _this.editRolesForm.email,
            info: _this.editRolesForm.info
          }
          _this.$emit('saveContent', params, _this.editRolesForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancleForm (formName) {
      if (!this.editRolesForm.id) this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    },
    // 获取角色列表 下拉
    getRoleList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      ROLE_LIST_GET(data).then(res => {
        this.roleList = res.data.group_list
        this.$forceUpdate()
      })
    }
  },
  mounted () {
    this.editRolesForm = JSON.parse(JSON.stringify(this.clientDetails))
  },
  created () {
    this.getRoleList()
  },
  components: {
    ntTable
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.editRoles {
  .el-form{
    .el-select{
      width: 100%;
    }
  }
  .default-width {
    width: 250px;
    // .mb-37 {
    //   margin-bottom: 37px;
    // }
    .mb-30 {
      margin-bottom: 30px;
    }
    .empower_btn{
      margin-left: 16px;
    }
  }
}
</style>
