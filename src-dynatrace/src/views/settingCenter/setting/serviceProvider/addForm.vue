<template>
  <div class="add-single-sign-on-container">
    <el-form label-position="top" label-width="80px" ref="addForm" :model="pageDetails" :rules="addFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="pageDetails.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code">
        <el-input v-model="pageDetails.code" :disabled="!isAdd" placeholder="请输入标识"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact_user">
        <el-input v-model="pageDetails.contact_user" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contact_phone">
        <el-input v-model="pageDetails.contact_phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="info">
        <el-input type="textarea" v-model="pageDetails.info" resize="none" placeholder="请输入备注" :rows="5"></el-input>
      </el-form-item>
      <div class="btns" v-permission="'settingCenter_serviceProvider_edit'" v-if="!isAdd">
        <DYButtonGroup>
          <DYButton type="primary" @click="saveForm('addForm')">保存</DYButton>
          <DYButton @click="cancelForm('addForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
      <div class="btns" v-permission="'settingCenter_serviceProvider_add'" v-else>
        <DYButtonGroup>
          <DYButton type="primary" @click="saveForm('addForm')">保存</DYButton>
          <DYButton @click="cancelForm('addForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addThirdPartyForm',
  props: {
    isAdd: {
      required: false,
      type: Boolean,
      default: false
    },
    clientDetails: {
      required: true,
      type: Object,
      default: () => ({
        code: '',
        name: '',
        contact_user: '',
        contact_phone: '',
        info: ''
      })
    }
  },
  data () {
    return {
      pageDetails: {
        code: '',
        name: '',
        contact_user: '',
        contact_phone: '',
        info: ''
      },
      addFormRules: {
        code: [
          { required: true, message: '标识不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        contact_user: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        contact_phone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的联系方式' }
        ]
      }
    }
  },
  methods: {
    // 新增 保存
    saveForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) { // 是新增
            this.$emit('saveForm', this.pageDetails)
          } else {
            this.$emit('saveContent', this.pageDetails)
          }
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancelForm (formName) {
      this.$emit('cancelForm')
      this.$refs[formName].resetFields()
      if (!this.isAdd) {
        this.$emit('cancelContent')
      }
    }
  },
  created () {
    this.pageDetails = JSON.parse(JSON.stringify(this.clientDetails))
  }
}
</script>
<style lang="less" scoped>
.add-single-sign-on-container {
  .el-form{
    max-width: 400px;
  }
  .el-form-item.is-error {
    margin-bottom: 37px;
  }
}
</style>
