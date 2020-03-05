<template>
  <div class="add-box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：互道测试环境"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code">
        <el-input v-model="ruleForm.code" placeholder="例如：nexttao_dev" :disabled="!!ruleForm.id"></el-input>
      </el-form-item>
      <el-form-item label="Consul DataCenter" prop="consul_namespace_code">
        <el-input v-model="ruleForm.consul_namespace_code" placeholder="例如：nexttao_dev"></el-input>
      </el-form-item>
      <el-form-item label="K8S NameSpace" prop="k8s_namespace_code">
        <el-input v-model="ruleForm.k8s_namespace_code" placeholder="例如：nexttao_dev"></el-input>
      </el-form-item>
      <el-form-item class="mb-30">
        <nt-switch
          :value="switchValue"
          :title="'启用'"
          @dyClick="switchChange"
        ></nt-switch>
      </el-form-item>
      <div class="btns" v-permission="'settingCenter_namespaceList_edit'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="cancleForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { ADD_NAME_SPACE, UPDATE_NAME_SPACE } from '@/api'
import ntSwitch from 'components/base/switch.vue'
export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => {
        return {
          name: '', // 角色名称
          consul_namespace_code: '',
          code: '',
          k8s_namespace_code: ''
        }
      }
    }
  },
  data () {
    return {
      switchValue: false, // 状态
      ruleForm: {
        id: '', // 角色id
        name: '', // 角色名称
        consul_namespace_code: '',
        code: '',
        k8s_namespace_code: ''

      },
      rules: {
        code: [
          { required: true, message: '标识不能为空！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ],
        consul_namespace_code: [
          { required: true, message: 'Consul DataCenter不能为空！', trigger: 'blur' }
        ],
        k8s_namespace_code: [
          { required: true, message: 'K8S NameSpace不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    switchChange () {
      this.switchValue = !this.switchValue
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            code: this.ruleForm.code,
            consul_namespace_code: this.ruleForm.consul_namespace_code,
            k8s_namespace_code: this.ruleForm.k8s_namespace_code
          }
          params.state = this.switchValue
          if (this.ruleForm.id) {
            params.namespace_id = this.ruleForm.id
            UPDATE_NAME_SPACE(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
              }
            })
          } else {
            ADD_NAME_SPACE(params).then(res => {
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
    this.switchValue = this.ruleForm.state || false
  },
  created () {
  },
  components: {
    ntSwitch
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
