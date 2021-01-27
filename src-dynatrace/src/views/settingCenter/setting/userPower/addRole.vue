<template>
  <div class="add-box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：服务治理权限组"></el-input>
      </el-form-item>
      <el-form-item class="mb-30" label="备注" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入备注"
          resize="none"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <el-button class="empower_btn" @click="empower('ruleForm')" v-if="ruleForm.id" v-permission="'settingCenter_roleList_auth'">授权</el-button>
      <div class="btns" v-if="ruleForm.id" v-permission="'settingCenter_roleList_edit1'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="cancleForm('ruleForm')">取消</el-button>
      </div>
      <div class="btns" v-else v-permission="'settingCenter_roleList_add1'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="cancleForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import { ROLE_ADD_POST, ROLE_UPDATE_POST } from '@/api'
import bus from '@/assets/eventBus.js'
export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => ({
        name: '', // 角色名称
        info: '' // 备注
      })
    }
  },
  data () {
    return {
      ruleForm: {
        id: '', // 角色id
        name: '', // 角色名称
        info: '' // 备注
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    empower (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let obj = [
            {
              name: this.ruleForm.name,
              // myCustomRouter: true,
              type: 'edit'
            },
            {
              name: '授权',
              type: 'edit'
            }
          ]
          bus.$emit('addRouter', obj)
          this.$router.push({name: 'authRole', params: {detailData: {id: this.ruleForm.id, name: this.ruleForm.name}}})
        } else {
          return false
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            info: this.ruleForm.info
          }
          if (this.ruleForm.id) {
            params.group_id = this.ruleForm.id
            ROLE_UPDATE_POST(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
              }
            })
          } else {
            ROLE_ADD_POST(params).then(res => {
              if (res.code === 0) {
                this.$emit('addHandle')
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancleForm (formName) {
      if (!this.ruleForm.id) this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    }
  },
  mounted () {
    this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
  },
  created () {
  },
  components: {
    ntTable
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.add-box {
  .default-width {
    width: 425px;
    .mb-30 {
      margin-bottom: 30px;
    }
  }
}
</style>
