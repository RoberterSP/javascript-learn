<template>
  <div class="add-single-sign-on-container">
    <el-form class="default-width" label-position="top" label-width="80px" ref="addForm" :model="detail" :rules="addFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="detail.name" placeholder="例如：订单中心"></el-input>
      </el-form-item>
      <el-form-item label="服务名" prop="service_name">
        <el-select style="width: 100%;" v-model="detail.service_name" placeholder="请选择服务">
          <el-option v-for="(item, index) in meshList" :key="index"
          :label="item.code"
          :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="域名" prop="domain_name">
        <el-input v-model="detail.domain_name" placeholder="例如：order.nexttao.com"></el-input>
      </el-form-item>
      <div v-permission="'settingCenter_singleSignOn_edit'">
        <el-button
          type="primary"
          @click="saveForm('addForm')">保存</el-button>
        <el-button @click="cancelForm('addForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { NXMC_MESH_LIST_GET } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
export default {
  name: 'addFormContainer',
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
      addFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        service_name: [
          { required: true, message: '请选择服务', trigger: 'onchange' }
        ],
        domain_name: [
          { required: true, message: '域名不能为空', trigger: 'blur' }
        ]
      },
      detail: {},
      meshList: []
    }
  },
  mounted () {
    this.detail = JSON.parse(JSON.stringify(this.clientDetails))
  },
  created () {
    this.getMeshList()
  },
  methods: {
    getMeshList () {
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        this.meshList = res.data.mesh_list
      })
    },
    // 新增 保存
    saveForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) { // 是新增
            this.detail.num = '0'
            this.detail.end = ''
            this.$emit('saveForm', this.detail)
          } else {
            this.$emit('saveContent', this.detail)
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
  }
}
</script>
<style lang="less" scoped>
  @default-width: 425px;
  .default-width {
    width: @default-width;
  }
  .add-single-sign-on-container {
    height: auto;
    .el-form-item {
      width: 425px;
    }
  }
</style>
