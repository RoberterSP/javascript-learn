<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <DYSplitTitle class="title h3-title-mb" :title="'基本信息'"></DYSplitTitle>
      <!-- 名称 -->
      <el-form-item class="default-width" label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <!-- 代码 -->
      <el-form-item class="default-width" label="标识" prop="code">
        <el-input v-model="ruleForm.code" :disabled="!create" placeholder="请输入标识"></el-input>
      </el-form-item>
      <el-form-item class="default-width" label="描述" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入描述"
          resize="none"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <p class="el-form-item__label">模版内容(yaml格式)</p>
      <div class="editor-container mb16" style="width: 100%;">
        <yaml-editor ref="jsonEditor" v-model="ruleForm.content" :mode="mode" @changed="onJsonCodeChange"/>
      </div>
      <!-- 操作按钮 -->
      <div v-if="create">
        <div class="btns" v-permission="'settingCenter_configTemplate_add'">
          <DYButtonGroup>
            <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
            <DYButton @click="resetForm('ruleForm')">取消</DYButton>
          </DYButtonGroup>
        </div>
      </div>
      <div v-else>
        <div class="btns" v-permission="'settingCenter_configTemplate_edit'">
          <DYButtonGroup>
            <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
            <DYButton @click="resetForm('ruleForm')">取消</DYButton>
          </DYButtonGroup>
        </div>
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
          message: res.data.result,
          type: 'success'
        })
      })
    },
    config_template_upload (data) {
      CONFIG_TEMPLATE_UPLOAD(data).then(res => {
        // this.$message('创建成功')
        bus.$emit('openMessage', {
          message: res.data.result,
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
