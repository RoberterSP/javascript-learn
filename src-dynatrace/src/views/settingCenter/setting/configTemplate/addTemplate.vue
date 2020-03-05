<template>
  <div>
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <h4>基本信息</h4>
      <!-- 名称 -->
      <el-form-item class="mt18" label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <!-- 代码 -->
      <el-form-item class="mt37" label="标识" prop="code">
        <el-input v-model="ruleForm.code" :disabled="!create" placeholder="请输入标识"></el-input>
      </el-form-item>
      <el-form-item class="mt37" label="描述" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入描述"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <p class="default-label mb10">模版内容(yaml格式)</p>
      <div class="editor-container" style="width: 100%;">
        <yaml-editor ref="jsonEditor" v-model="ruleForm.content" :mode="mode" @changed="onJsonCodeChange"/>
      </div>
      <!-- 操作按钮 -->
      <div class="btns mt37" v-permission="'settingCenter_configTemplate_edit'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { CONFIG_TEMPLATE_UPLOAD, CONFIG_TEMPLATE_UPDATE } from '@/api'
import yamlEditor from 'components/yamlEditor/index.vue'
// import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      mode: 'text/yaml',
      content: '',
      ruleForm: {
        name: '',
        code: '',
        info: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '标识不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    create: {
      type: Boolean,
      default: false
    },
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.create) {
            // 创建
            this.config_template_upload(this.ruleForm)
          } else {
            let data = {
              template_id: this.ruleForm.id,
              name: this.ruleForm.name,
              code: this.ruleForm.code,
              info: this.ruleForm.info,
              content: this.ruleForm.content
            }
            this.config_template_update(data)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('close')
    },
    config_template_update (data) {
      CONFIG_TEMPLATE_UPDATE(data).then(res => {
        // this.$message('更新成功')
        bus.$emit('openMessage', {
          message: '更新成功',
          type: 'success'
        })
      })
    },
    config_template_upload (data) {
      CONFIG_TEMPLATE_UPLOAD(data).then(res => {
        // this.$message('创建成功')
        bus.$emit('openMessage', {
          message: '创建成功',
          type: 'success'
        })
        this.$emit('update')
      })
    },
    onJsonCodeChange (newCode) {
      try {
        this.ruleForm.content = JSON.parse(newCode)
      } catch (error) {}
    }
  },
  mounted () {
  },
  created () {
    if (this.clientDetails) {
      this.ruleForm = this.clientDetails
    }
  },
  components: {
    yamlEditor
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.w425 {
  width: 42.5%;
}
.w45 {
  width: 45%;
}
// .mt37 {
//   margin-top: 37px;
// }
</style>
