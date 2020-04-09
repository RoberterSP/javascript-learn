<template>
  <div class="editPanel">
    <el-form :model="ruleForm" :rules="{}" ref="ruleForm">
      <div>操作人：{{ruleForm.retry_user}}</div>
      <div>标识：{{ruleForm.message_code}}</div>
      <el-form-item label="错误数据">
        <el-input class="textarea" type="textarea" v-model="ruleForm.error_data" resize="none"></el-input>
      </el-form-item>
      <div class="btns mb32" v-permission="'serviceCenter_serviceDetail_deadMessageList_edit'">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="resetForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
      <div>错误日志：</div>
      <div class="error-msg">{{ruleForm.error_msg}}</div>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      ruleForm: {}
    }
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  computed: {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('valid submit!!', valid)
          this.$emit('saveContent', this.ruleForm, this.clientDetails)
          this.$emit('cancelContent')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      console.log(formName)
      this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    }
  },
  mounted () {
    if (this.clientDetails) {
      this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
    }
  },
  created () {
  },
  components: {
  }
}
</script>

<style lang="less">
@import "~common/style/variable";
.textarea {
  display: block;
  width: 50%;
  .el-textarea__inner {
    height: 200px;
  }
}
.error-msg {
  white-space: pre-wrap;
}

</style>
