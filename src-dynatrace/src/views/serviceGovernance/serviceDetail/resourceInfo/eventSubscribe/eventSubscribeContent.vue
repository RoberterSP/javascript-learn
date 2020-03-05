<template>
  <div class="editPanel">
    <!-- 表单 -->
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item v-show="editMode" label="事件名称" prop="subscribe_code">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.subscribe_code"
          placeholder="请选择订阅事件"
          @change="selected">
          <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-show="!editMode&&ruleForm.subscribe_code">
        <p class="eventTitle">{{ruleForm.subscribe_name}}</p>
        <p class="eventSubTitle">订阅事件修改</p>
      </div>
      <el-form-item v-show="ruleForm.subscribe_code" label="通知地址" prop="callback_url">
        <el-input v-model="ruleForm.callback_url" placeholder="请输入通知地址"></el-input>
      </el-form-item>
      <el-form-item v-show="ruleForm.subscribe_code" label="过滤条件" prop="filter_conditions">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="例如：{'brand':['HLM','hl_hlm'], 'is_new': False}"
          v-model="ruleForm.filter_conditions">
        </el-input>
      </el-form-item>
      <p v-show="ruleForm.subscribe_code" class="tilte">自定义请求头</p>
      <div v-show="ruleForm.subscribe_code" class="headerList">
        <div class="flex-start header" v-for="(header, index) in ruleForm.headers" :key="'header'+index">
          <el-input class="headTitle" v-model="header.key" placeholder="键"></el-input>
          <span class="headmid">:</span>
          <el-input class="headBody" v-model="header.value" placeholder="值"></el-input>
          <img @click="deleteHeader(index)" src="@/assets/image/icon-delete.svg" alt="">
        </div>
      </div>
      <el-button v-show="ruleForm.subscribe_code" @click="addHeader">添加</el-button>
      <el-form-item v-show="ruleForm.subscribe_code" label="自定义返回验证脚本" class="mt-47" prop="response_statement">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5}"
          placeholder="例如：if response.get('message').lower() != 'success':
                result.update({
                    'status': False
                })
            else:
                result.update({
                    'status': True
                })"
          v-model="ruleForm.response_statement">
        </el-input>
      </el-form-item>
      <el-form-item v-show="ruleForm.subscribe_code" label="鉴权方式" prop="auth_type">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.auth_type"
          placeholder="鉴权方式">
          <el-option
            v-for="item in authList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="ruleForm.subscribe_code && ruleForm.auth_type === 'basic_auth'" label="用户名"
                    prop="response_statement">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item v-show="ruleForm.subscribe_code && ruleForm.auth_type === 'basic_auth'" label="用户密码"
                    prop="response_statement">
        <el-input v-model="ruleForm.password" type="text" placeholder="请输入用户密码"></el-input>
      </el-form-item>
      <nt-switch v-show="ruleForm.subscribe_code && editMode" @dyClick="switchChange" :title="'激活事件订阅'"
                 v-model="ruleForm.state"></nt-switch>
      <!-- <div v-show="ruleForm.subscribe_code" class="fullWidth mt-23 default-label">
        这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明
      </div> -->
      <div class="btns" v-permission="'serviceCenter_serviceDetail_filterRuleEdit'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import {SUBSCRIBE_EVENT_GET, SUBSCRIBE_RECORD_CREATE, SUBSCRIBE_RECORD_EDIT} from '@/api'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      selectData: [],
      authList: [{label: 'No Auth', value: 'no_auth'}, {label: 'Basic Auth', value: 'basic_auth'}],
      ruleForm: {
        callback_url: '',
        subscribe_code: '',
        filter_conditions: '',
        response_statement: '',
        auth_type: 'no_auth',
        state: false,
        headers: []
      },
      rules: {
        callback_url: [
          {required: true, message: '通知地址不能为空', trigger: 'blur'}
        ]
      }
      // headersAdd: false
    }
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      default: ''
    },
    clientDetails: Object
  },
  computed: {
    _category () {
      if (this.clientDetails && this.clientDetails.category) { return this.clientDetails.category } else return this.category
    }
  },
  methods: {
    addHeader () {
      if (this.ruleForm.headers.every(item => item.key && item.value)) {
        this.ruleForm.headers.push({key: '', value: ''})
      } else {
        bus.$emit('openMessage', {
          message: '请完善已有的自定义请求header信息',
          type: 'warning'
        })
      }
    },
    deleteHeader (index) {
      this.ruleForm.headers.splice(index, 1)
    },
    selected (val) {
      console.log(val)
    },
    switchChange () {
      this.ruleForm.state = !this.ruleForm.state
    },
    recordCreate () {
      let data = {
        subscribe_code: this.ruleForm.subscribe_code,
        category: this._category,
        record_list: [{
          callback_url: this.ruleForm.callback_url,
          filter_conditions: this.ruleForm.filter_conditions,
          response_statement: this.ruleForm.response_statement,
          headers: this.ruleForm.headers,
          auth_type: this.ruleForm.auth_type,
          state: this.ruleForm.state,
          username: this.ruleForm.username,
          password: this.ruleForm.password
        }]
      }

      const detailData = this.$route.params.detailData

      let extendData = {}

      if (this._category === 'inner') {
        extendData = {
          service_code: detailData.code,
          service_name: detailData.name
        }
      } else {
        extendData = {
          app_id: detailData.app_id,
          app: detailData.name
        }
      }

      Object.assign(data.record_list[0], extendData)

      this.subscribe_record_create(data)
    },
    recordUpdate () {
      let data = {
        subscribe_code: this.ruleForm.subscribe_code,
        category: this._category,
        record_list: [this.ruleForm]
      }

      const detailData = this.$route.params.detailData

      let extendData = {}

      if (this._category === 'inner') {
        extendData = {
          service_code: detailData.code,
          service_name: detailData.name
        }
      } else {
        extendData = {
          app_id: detailData.app_id,
          app: detailData.name
        }
      }

      Object.assign(data.record_list[0], extendData)

      this.subscribe_record_edit(data)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.headers.every(item => item.key && item.value)) {
            if (this.ruleForm.record_id) {
              // 修改
              this.recordUpdate()
            } else {
              // 新增
              this.recordCreate()
            }
          } else {
            bus.$emit('openMessage', {
              message: '请完善已有的自定义请求header信息',
              type: 'warning'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      if (!this.ruleForm.record_id) this.$refs[formName].resetFields()

      this.$emit('close')
      this.$emit('cancelContent')
    },
    subscribe_record_create (data) {
      SUBSCRIBE_RECORD_CREATE(data).then(res => {
        if (res.code === 0) {
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          // 清空表单
          this.resetForm('ruleForm')

          this.$emit('onCreate')
        } else {
          bus.$emit('openMessage', {
            message: '创建失败！',
            type: 'error'
          })
        }
      })
    },
    // 修改订阅事件
    subscribe_record_edit (data) {
      SUBSCRIBE_RECORD_EDIT(data).then(res => {
        // this.subscribe_record_get(this.recordPost)
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.$emit('cancelContent')
      })
    },
    subscribe_event_get (data) {
      SUBSCRIBE_EVENT_GET(data).then(res => {
        res.data.subscribe_list.map(item => {
          item.label = item.subscribe_name
          item.value = item.subscribe_code
        })
        this.selectData = res.data.subscribe_list
      })
    }
  },
  mounted () {
    this.subscribe_event_get({page_size: PAGESIZE, page: 1})
    if (this.clientDetails) {
      this.ruleForm = this.clientDetails

      // props 不允许改动，使用计算属性代替了
      // this.category = this.clientDetails.category
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
  // .mb-30 {
  //   margin-bottom: 30px;
  // }

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
