<template>
  <div class="add-box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="配置组名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="配置组标识" prop="code">
        <el-input v-model="ruleForm.code" placeholder="请输入内容" :disabled="ruleForm.group_id && ruleForm.code ? true : false"></el-input>
      </el-form-item>
      <el-form-item class="mb-30" label="描述" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入内容"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <div class="btns">
        <el-button @click="submitForm('ruleForm')" type="primary" :disabled="!ruleForm.name || !ruleForm.code">保存</el-button>
        <el-button @click="cancleForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { CONFIG_GROUP_UPLOAD_POST, CONFIG_GROUP_UPDATE_POST } from '@/api'
export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => {
        return {
          name: '',
          code: ''
        }
      }
    }
  },
  data () {
    return {
      ruleForm: {
        group_id: '',
        name: '',
        code: ''
      },
      rules: {
        code: [
          { required: true, message: '配置组标识不能为空！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '配置组名称不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            code: this.ruleForm.code,
            info: this.ruleForm.info
          }
          if (this.ruleForm.group_id) {
            params.group_id = this.ruleForm.group_id
            CONFIG_GROUP_UPDATE_POST(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
              }
            })
          } else {
            CONFIG_GROUP_UPLOAD_POST(params).then(res => {
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
      if (!this.ruleForm.group_id) this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    }
  },
  mounted () {
    this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
  },
  created () {
  },
  components: {
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
    .empower_btn{
      margin-left: 16px;
    }
  }
}
</style>
