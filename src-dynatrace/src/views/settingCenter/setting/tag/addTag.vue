<template>
  <div class="add-tag-container-box">
    <div class="add-tag-container">
      <el-form label-position="top" label-width="80px" ref="tagForm" :model="clientDetails" :rules="tagFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="clientDetails.name" placeholder="例如：订单相关"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="clientDetails.code" :disabled="!isAdd" placeholder="例如：order_gp"></el-input>
        </el-form-item>

        <div v-permission="'settingCenter_tagList_edit'">
          <el-button
            type="primary"
            @click="saveForm">保存</el-button>
          <el-button @click="cancelForm">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addTag',
  props: {
    isAdd: {
      required: false,
      type: Boolean,
      default: false
    },
    clientDetails: {
      required: true,
      type: Object,
      default: () => {
        return {
          name: '',
          service_name: '',
          domain_name: ''
        }
      }
    }
  },
  data () {
    return {
      tagFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '标识不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增 保存
    saveForm () {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) { // 是新增
            this.clientDetails.info = ''
            this.$emit('saveForm', this.clientDetails)
          } else {
            this.$emit('saveContent', this.clientDetails)
          }
          this.$refs.tagForm.resetFields()
        } else {
          return false
        }
      })
    },
    cancelForm () {
      this.$emit('cancelForm')
      this.$refs.tagForm.resetFields()
      if (!this.isAdd) {
        this.$emit('cancelContent')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-tag-container {
  width: 40%;
  min-width: 400px;
  // .el-form-item.is-error {
  //   margin-bottom: 37px;
  // }
}
</style>
