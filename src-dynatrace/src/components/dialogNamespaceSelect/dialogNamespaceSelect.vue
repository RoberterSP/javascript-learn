<template>
  <div>
    <el-dialog :visible.sync="currentValue" width="400px" :before-close=beforeClose>
      <div>
        <el-form ref="ruleForm" :model="form" label-width="80px" class="ruleNamespaceForm" :rules="rules" :show-close=false>
          <el-form-item label="选择分区" prop="namespaceCode">
            <el-select style="width: 100%;" v-model="form.namespaceCode" placeholder="请选择分区">
              <el-option v-for="(item ,index) in namespaces" :key="index" :label="item.name" :value="item.namespace_code"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <DYButton type="primary" @click="chooseNamespace('ruleForm')">登  录</DYButton>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AUTH_NAMESPACE_GET } from '@/api'
export default {
  data () {
    return {
      namespaces: [],
      form: {
        namespaceCode: ''
      },
      rules: {
        namespaceCode: [
          { required: true, message: '请选择Namespace', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    get_namespace () {
      AUTH_NAMESPACE_GET().then(res => {
        this.namespaces = res.data.namespaces
        window.localStorage.setItem('namespaces', JSON.stringify(this.namespaces))
      })
    },
    chooseNamespace (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('chooseNamespace', this.form.namespaceCode)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeClose () {
      this.$emit('beforeClose')
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>