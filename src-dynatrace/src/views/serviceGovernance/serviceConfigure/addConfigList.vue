<template>
  <div class="add-box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="配置标识" prop="code">
        <el-input v-model="ruleForm.code" placeholder="请输入内容" :disabled="!!ruleForm.mesh_config_id"></el-input>
      </el-form-item>
      <el-form-item label="配置类型">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.config_type"
          placeholder=" 请选择类型">
          <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="ruleForm.config_type === 'key_value'">
        <p class="el-form-item__label">配置内容</p>
        <div class="headerList">
          <div class="flex-start header" v-for="(header, index) in ruleForm.configContent" :key="`header${index}`">
            <el-input class="headTitle" v-model="header.key" placeholder="请输入key值"></el-input>
            <span class="headmid">:</span>
            <el-input class="headBody" v-model="header.value" placeholder="请输入value值"></el-input>
            <img @click="deleteContent(index)" src="@/assets/image/icon-delete.svg" alt="">
          </div>
        </div>
        <div class="el-button-form-item">
          <DYButton @click="addContent">添加配置内容</DYButton>
        </div>
      </div>
    </el-form>
    <div v-if="ruleForm.config_type === 'file'">
      <p class="default-label mb10">模版内容(yaml格式)</p>
      <div class="editor-container">
        <yaml-editor ref="jsonEditor" v-model="ruleForm.content" :mode="mode" @changed="onJsonCodeChange"/>
      </div>
    </div>
    <el-form class="default-width" :model="ruleForm">
      <el-form-item class="mb-30" label="配置描述" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入内容"
          resize="none"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <DYButton @click="againCheck('ruleForm')" v-if="selectedTemplate">重选模版</DYButton>
      <DYButtonGroup>
        <DYButton type="primary" :disabled="!ruleForm.name || !ruleForm.code" @click="submitForm('ruleForm')">保存</DYButton>
        <DYButton @click="cancleForm('ruleForm')">取消</DYButton>
      </DYButtonGroup>
    </el-form>
  </div>
</template>
<script>
import yamlEditor from 'components/yamlEditor/index.vue'
import { CONFIG_PATCH_UPLOAD_POST, CONFIG_PATCH_UPDATE_POST } from '@/api'
import bus from '@/assets/eventBus.js'
export default {
  props: {
    selectedTemplate: {
      type: Boolean
    },
    clientDetails: {
      type: Object,
      default: () => ({
        name: '',
        code: '',
        config_type: 'key_value',
        configContent: [{key: '', value: ''}],
        content: ''
      })
    },
    groupId: {
      type: Number,
      default: () => 1
    }
  },
  data () {
    return {
      mode: 'text/yaml',
      ruleForm: {
        name: '',
        code: '',
        config_type: 'key_value',
        configContent: [{key: '', value: ''}],
        content: ''
      },
      rules: {
        code: [
          { required: true, message: '配置组标识不能为空！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '配置组名称不能为空！', trigger: 'blur' }
        ]
      },
      selectData: [{
        label: '键值对形式',
        value: 'key_value'
      },
      {
        label: '文本形式',
        value: 'file'
      }]
    }
  },
  methods: {
    addContent () {
      this.ruleForm.configContent.push({key: '', value: ''})
    },
    deleteContent (index) {
      this.ruleForm.configContent.splice(index, 1)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            code: this.ruleForm.code
          }
          params.info = this.ruleForm.info || ''
          if (this.ruleForm.config_type === 'key_value') {
            if (this.ruleForm.configContent.length > 0) {
              const haveValue = this.ruleForm.configContent.some(item => item.key && !item.value)
              const haveKey = this.ruleForm.configContent.some(item => !item.key && item.value)
              const noContent = this.ruleForm.configContent.some(item => !item.key && !item.value)
              if (noContent) {
                // this.$message({ message: '请添加配置内容', type: 'warning' })
                bus.$emit('openMessage', {
                  message: '请添加配置内容',
                  type: 'warning'
                })
                return false
              } else if (haveValue || haveKey) {
                const tipStr = haveValue ? '值' : 'key'
                // this.$message({ message: `配置内容的${tipStr}不能为空`, type: 'warning' })
                bus.$emit('openMessage', {
                  message: `配置内容的${tipStr}不能为空`,
                  type: 'warning'
                })
                return false
              }
            } else {
              // this.$message({ message: '请添加配置内容', type: 'warning' })
              bus.$emit('openMessage', {
                message: '请添加配置内容',
                type: 'warning'
              })
              return false
            }
            this.ruleForm.content = JSON.stringify(this.ruleForm.configContent)
          }
          if (this.ruleForm.config_type === 'file' && !this.ruleForm.content) {
            // this.$message({ message: '请添加模版内容', type: 'warning' })
            bus.$emit('openMessage', {
              message: '请添加模版内容',
              type: 'warning'
            })
            return false
          }
          params.content = this.ruleForm.content
          params.config_type = this.ruleForm.config_type
          if (this.ruleForm.mesh_config_id) {
            params.mesh_config_id = this.ruleForm.mesh_config_id
            CONFIG_PATCH_UPDATE_POST(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
              }
            })
          } else {
            params.group_id = this.groupId
            CONFIG_PATCH_UPLOAD_POST(params).then(res => {
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
      if (!this.ruleForm.mesh_config_id) this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    },
    onJsonCodeChange (newCode) {
      try {
        JSON.parse(newCode)
      } catch (error) {}
    },
    againCheck () {
      this.$emit('againCheck')
    }
  },
  mounted () {
    if (this.clientDetails.mesh_config_id || this.clientDetails.id) {
      this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
      if (this.ruleForm.config_type === 'key_value') {
        this.$set(this.ruleForm, 'configContent', JSON.parse(this.ruleForm.content))
      } else {
        this.$set(this.ruleForm, 'configContent', [{key: '', value: ''}])
      }
    }
  },
  created () {
  },
  components: {
    yamlEditor
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
    .again_btn{
      margin-left: 16px;
    }
    .tilte {
      margin-bottom: 10px;
    }
    .headerList {
      margin-bottom: 20px;
      .header {
        margin-bottom: 4px;
        .headTitle {
          width: 117px;
        }
        .headmid {
          width: 14px;
          margin-left: 17px;
          margin-right: 9px;
        }
        .headBody {
          width: 238px;
        }
        img {
          width: 12px;
          height: 12px;
          margin-left: 14px;
          cursor: pointer;
        }
      }
    }
  }
  .editor-container{
    margin-bottom: 37px;
    width: 50%;
  }
}
</style>
