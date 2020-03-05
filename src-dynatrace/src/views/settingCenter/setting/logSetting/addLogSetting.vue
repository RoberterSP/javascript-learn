<template>
  <div class="editPanel">
    <!-- 表单 -->
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：第三方接口请求日志"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code">
        <el-input v-model="ruleForm.code" :disabled="!!ruleForm.log_config_id" placeholder="例如：third_party_request"></el-input>
      </el-form-item>
      <nt-switch  @dyClick="switchChange" :title="'激活查询状态'" v-model="ruleForm.query_state" class="mb20"></nt-switch>
      <el-form-item label="日志路径" prop="path">
        <el-input v-model="ruleForm.path" placeholder="例如：/opt/dataforce/log/data_server/hird_party_request.log"></el-input>
      </el-form-item>
      <el-form-item class="mb-30" label="描述" prop="filter_conditions">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入描述"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <div class="btns" v-permission="'settingCenter_logSetting_edit'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import { CONFIG_LOG_UPLOAD_POST, CONFIG_LOG_UPDATE_POST } from '@/api'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      selectData: [],
      ruleForm: {
        name: '',
        code: '',
        path: '',
        info: '',
        query_state: false
      },
      rules: {
        name: [
          { required: true, message: '配置名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '配置标识不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '日志路径不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  methods: {
    addHeader () {
      this.ruleForm.headers.push({key: '', value: ''})
    },
    deleteHeader (index) {
      this.ruleForm.headers.splice(index, 1)
    },
    selected (val) {
      console.log(val)
    },
    switchChange () {
      this.ruleForm.query_state = !this.ruleForm.query_state
    },
    recordCreate () {
      let data = {
        name: this.ruleForm.name,
        code: this.ruleForm.code,
        path: this.ruleForm.path,
        info: this.ruleForm.info,
        query_state: this.ruleForm.query_state
      }
      this.subscribe_record_create(data)
    },
    recordUpdata () {
      let data = {
        log_config_id: this.ruleForm.log_config_id,
        name: this.ruleForm.name,
        code: this.ruleForm.code,
        path: this.ruleForm.path,
        info: this.ruleForm.info,
        query_state: this.ruleForm.query_state
      }
      this.subscribe_record_edit(data)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.log_config_id) {
            // 修改
            this.recordUpdata()
          } else {
            // 新增
            this.recordCreate()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      if (this.ruleForm.log_config_id) {
        this.$emit('cancelContent')
      } else {
        this.$refs[formName].resetFields()
        this.$emit('close')
      }
    },
    subscribe_record_create (data) {
      CONFIG_LOG_UPLOAD_POST(data).then(res => {
        bus.$emit('openMessage', {
          message: '创建成功',
          type: 'success'
        })
        this.$emit('close')
      })
    },
    // 修改订阅事件
    subscribe_record_edit (data) {
      CONFIG_LOG_UPDATE_POST(data).then(res => {
        // this.$message(res.data.result)
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.$emit('cancelContent')
        this.$emit('refresh')
      })
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
    ntSwitch
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.mt-23 {
  margin-top: 23px;
}
.mt-47 {
  margin-top: 47px;
}
// .mb-37 {
//   margin-bottom: 37px;
// }
.mb-30 {
  margin-bottom: 30px;
}

.editPanel {
  .tilte {
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
    margin-bottom: 10px;
  }
  .eventTitle {
    font-family: @default-font;
    font-size: 20px;
    color: @default-font-color;
    font-weight: 500;
    line-height: 29px;
    margin-bottom: 26px;
  }
  .eventSubTitle {
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
    margin-bottom: 28px;
  }
  .headerList {
    margin-bottom: 42px;
    .header {
      margin-bottom: 4px;
      .headTitle {
        width: 107px;
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
  .select {
    margin-bottom: 30px;
    width: @default-width;
  }
}
</style>
