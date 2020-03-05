<template>
  <div class="">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <split-title class="title" :title="'基本信息'"></split-title>
      <!-- 名称 -->
      <el-form-item class="default-width mt-34" label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：接口响应时间监控"></el-input>
      </el-form-item>
      <!-- 标识 -->
      <el-form-item class="mt37" label="标识" prop="code">
        <el-input v-model="ruleForm.code" :disabled="!create" placeholder="例如：ApiResponseTimeMonitor"></el-input>
      </el-form-item>
      <!-- 联系人 -->
      <el-form-item class="mt37" label="联系人" prop="contact">
        <el-select
          multiple
          style="width: 100%;"
          v-model="ruleForm.notification_user"
          placeholder="请选择联系人">
          <el-option
            v-for="item in authUserList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 描述 -->
      <el-form-item label="描述" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入描述"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <split-title class="title" :title="'预警规则'"></split-title>
      <!-- 监控对象 -->
      <el-form-item class="default-width mt-34" label="监控对象" prop="monitored_object">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.monitored_object"
          @change="monitoredObjectChange"
          placeholder="请选择监控对象">
          <el-option
            v-for="item in monitoredObjectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 过滤条件 -->
      <p class="default-label">过滤条件</p>
      <div class="mt18" v-for="(filter, index) in ruleForm.filters_condition" :key="'filter' + index">
        <div class="flex-start mb8">
          <el-select
            style="width: 100%;"
            v-model="filter.field"
            placeholder="请选择字段">
            <el-option
              v-for="item in fieldList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            class="ml10"
            style="width: 100%;"
            v-model="filter.operator"
            placeholder="请选择字段操作符">
            <el-option
              v-for="item in filtersOperatorList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-input class="mb8" v-model="filter.value" placeholder="请输入内容"></el-input>
        <el-button @click="deleteFilter(index)">删除</el-button>
      </div>
      <el-button @click="addFilter" class="mb44 mt34">添加</el-button>
      <!-- 周期 -->
      <p class="default-label">周期</p>
      <div class="mt18 flex-start">
        <el-input type="number" v-model="ruleForm.cycle_value" class="mr10" placeholder="请输入内容"></el-input>
        <el-select
          v-model="ruleForm.cycle_unit"
          placeholder="请选择单位">
          <el-option
            v-for="item in cycleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 字段 -->
      <el-form-item class="mt18" label="字段" prop="field">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.field"
          placeholder="请选择字段" clearable>
          <el-option
            v-for="item in fieldListNoText"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 统计方法 -->
      <el-form-item class="mt18" label="统计方法" prop="func">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.func"
          placeholder="请选择统计方法" clearable>
          <el-option
            v-for="item in funcList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 阀值设置 -->
      <p class="default-label">阀值设置</p>
      <div v-for="(thresholdItem, tIndex) in ruleForm.threshold_setting" :key="'threshold' + tIndex" class="mt18">
        <div class="flex-start mb8">
          <el-select
            class="mr10 fullWidth"
            v-model="thresholdItem.level"
            placeholder="请选择等级">
            <el-option
              v-for="item in levelList"
              :key="'threshold' + tIndex + item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            class="mr10 fullWidth"
            v-model="thresholdItem.operator"
            placeholder="请选择操作符">
            <el-option
              v-for="item in thresholdOperatorList"
              :key="'threshold' + tIndex + item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input type="number" v-model="thresholdItem.threshold" placeholder="请输入内容"></el-input>
        </div>
        <el-select
          multiple
          class="mb8"
          style="width: 100%;"
          v-model="thresholdItem.notification_type"
          placeholder="请选择通知方式">
          <el-option
            v-for="item in notificationList"
            :key="'threshold' + tIndex + item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="deleteThresholdSetting(tIndex)">删除</el-button>
      </div>
      <el-button @click="addThresholdSetting" class="mb44 mt34">添加</el-button>
      <!-- 激活预警策略 -->
      <nt-switch class="mt18 mb24" @dyClick="switchChange" :title="'激活预警策略'" v-model="ruleForm.state"></nt-switch>
      <!-- 操作按钮 -->
      <div class="btns" v-permission="'settingCenter_warningStrategy_edit'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import splitTitle from 'components/splitTitle/splitTitle.vue'
import { AUTH_USER_LIST, MONITORED_OBJECT_LIST, NOTIFICATION_TYPE_LIST, ALERT_RULE_UPLOAD, ALERT_RULE_INFO, ALERT_RULE_UPDATE } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      authUserList: [],
      monitoredObjectList: [],
      fieldList: [],
      fieldListNoText: [],
      funcList: [
        { label: '平均值', value: 'avg' },
        { label: '最小值', value: 'min' },
        { label: '最大值', value: 'max' },
        { label: '总数', value: 'sum' }
      ],
      filtersOperatorList: [
        { label: '等于', value: 'is' },
        { label: '不等于', value: 'is not' }
      ],
      notificationList: [],
      thresholdOperatorList: [
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' },
        { label: '等于', value: '=' }
      ],
      levelList: [
        { label: '高', value: 'crit' },
        { label: '低', value: 'warn' }
      ],
      cycleList: [
        { label: '分', value: 'm' },
        { label: '小时', value: 'h' },
        { label: '天', value: 'd' }
      ],
      ruleForm: {
        name: '',
        code: '',
        notification_user: [],
        info: '',
        monitored_object: '',
        filters_condition: [],
        cycle_unit: '',
        state: false,
        threshold_setting: [
          {
            level: '',
            operator: '',
            threshold: '',
            notification_type: []
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '标识不能为空', trigger: 'blur' }
        ],
        notification_user: [
          { required: true, message: '请选择联系人', trigger: 'change' }
        ],
        monitored_object: [
          { required: true, message: '请选择监控对象', trigger: 'change' }
        ],
        cycle_value: [
          { required: true, message: '周期不能为空', trigger: 'blur' }
        ],
        cycle_unit: [
          { required: true, message: '请选择周期单位', trigger: 'change' }
        ]
      },
      ruleFormBk: {}
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
    deleteThresholdSetting (index) {
      this.ruleForm.threshold_setting.splice(index, 1)
    },
    addThresholdSetting () {
      this.ruleForm.threshold_setting.push({
        level: '',
        operator: '',
        threshold: '',
        notification_type: []
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm))
          data.cycle_value = parseInt(data.cycle_value)
          console.log(data)

          let userArr = []
          this.ruleForm.notification_user.map(item => {
            userArr.push({user_id: item})
          })
          data.notification_user = userArr
          // data.threshold = parseInt(data.threshold)

          if (!data.field) {
            delete data.field
          }

          if (!data.func) {
            delete data.func
          }

          if (this.create) {
            // 创建
            this.alert_rule_upload(data)
          } else {
            this.alert_rule_update(data)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      if (this.clientDetails) {
        this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormBk))
      } else {
        this.$refs[formName].resetFields()
      }
      this.$emit('close')
      this.$emit('cancelContent')
    },
    switchChange () {
      this.ruleForm.state = !this.ruleForm.state
    },
    addFilter () {
      this.ruleForm.filters_condition.push({field: '', operator: '', value: ''})
    },
    deleteFilter (index) {
      this.ruleForm.filters_condition.splice(index, 1)
    },
    alert_rule_update (data) {
      ALERT_RULE_UPDATE(data).then(res => {
        // this.$message('更新成功')
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })

        this.$emit('saveContent')
      })
    },
    monitoredObjectChange (val, isEdit) {
      if (!isEdit) {
        this.ruleForm.filters_condition = []
      }

      this.monitoredObjectInfo && this.monitoredObjectInfo.map(item => {
        if (item.code === val) {
          this.fieldList = []
          this.fieldListNoText = []
          item.field_info && item.field_info.map(info => {
            this.fieldList.push({
              label: info.fieldKey,
              value: info.fieldKey,
              type: info.fieldType
            })
            if (info.fieldType !== 'string') {
              this.fieldListNoText.push({
                label: info.fieldKey,
                value: info.fieldKey,
                type: info.fieldType
              })
            }
          })
        }
      })
    },
    auth_user_list (data) {
      AUTH_USER_LIST(data).then(res => {
        this.authUserList = []
        res.data.user_list.map(item => {
          this.authUserList.push({
            label: item.name,
            value: item.id
          })
        })
      })
    },
    monitored_object_list (data) {
      return MONITORED_OBJECT_LIST(data).then(res => {
        this.monitoredObjectInfo = res.data.monitored_object_info
        res.data.monitored_object_info.map(item => {
          this.monitoredObjectList.push({
            label: item.name,
            value: item.code
          })
        })
      })
    },
    notification_type_list (data) {
      NOTIFICATION_TYPE_LIST(data).then(res => {
        res.data.notification_types.map(item => {
          this.notificationList.push({
            value: item.code,
            label: item.name
          })
        })
      })
    },
    alert_rule_upload (data) {
      ALERT_RULE_UPLOAD(data).then(res => {
        // this.$message('创建成功')
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })

        this.$emit('create')
      })
    },
    alert_rule_info (data) {
      ALERT_RULE_INFO(data).then(res => {
        this.ruleForm = res.data
        let arr = []
        res.data.notification_user.map(item => {
          arr.push(item.user_id)
        })
        this.ruleForm.notification_user = arr
        this.ruleFormBk = JSON.parse(JSON.stringify(this.ruleForm))
      })
    }
  },
  mounted () {
  },
  created () {
    // watch 调用的monitoredObjectChange 中依赖  monitored_object_list 请求的结果， 所以用await 等待
    (async () => {
      this.auth_user_list({ page: 1, page_size: PAGESIZE })
      this.notification_type_list({})
      await this.monitored_object_list({ page: 1, page_size: PAGESIZE })

      if (this.clientDetails) {
        this.alert_rule_info({alert_rule_id: this.clientDetails.alert_rule_id})
      }
    })()
  },
  watch: {
    'ruleForm.monitored_object' (val) {
      if (val !== '') {
        this.monitoredObjectChange(val, true)
      }
    }
  },
  components: {
    splitTitle,
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
.mt-34 {
  margin-top: 34px;
}

.w425 {
  width: 42.5%;
}
.w45 {
  width: 45%;
}
</style>
