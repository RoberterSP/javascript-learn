<template>
  <!-- 未找着对应页面  -->
  <div class="add_fault_box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form :model="ruleForm" class="custom_width" :inline="true">
        <el-form-item style="width:65%" class="full-content" label="执行间隔">
          <div style="{paddingLeft: '30px'}">
            <ntSlider
              v-model="ruleForm.interval_number"
              :in-form="true"
              show-input
              :min="0"
              :max="120"
              :show-input-controls="false"
              :marks="marks"
              :format-tooltip="formatTooltip"
              class="format_width"
              start-tooltip="bottom"
              :resident-tooltip="true"
              :tooltip-class="'custom-tooltip'"
            >
            </ntSlider>
          </div>
        </el-form-item>
        <el-form-item style="width: 10%;" label="间隔单位">
          <el-select
            style="width: 100%; margin: 2px 0;"
            v-model="ruleForm.interval_type"
            @change="selected"
            placeholder="请选择间隔单位">
            <el-option
              v-for="item in selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-form :model="ruleForm" class="custom_width" :inline="true">
        <el-form-item style="width:75%" class="full-content" label="调用次数">
          <ntSlider
            v-model="ruleForm.numbercall"
            show-input
            :in-form="true"
            :min="-1"
            :max="20"
            :show-input-controls="false"
            :marks="marks1"
            :format-tooltip="formatTooltip1"
            class="format_width"
            start-tooltip="bottom"
            :resident-tooltip="true"
            :tooltip-class="'custom-tooltip'"
          >
          </ntSlider>
        </el-form-item>
      </el-form>
      <el-form-item label="下一次执行时间" prop="nextcall">
        <el-date-picker
          v-model="ruleForm.nextcall"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择下一次执行时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优先级(0=紧急)">
        <el-input v-model="ruleForm.priority" type="number" min=0 placeholder="请输入优先级"></el-input>
      </el-form-item>
      <div class="switch_form_item">
        <nt-switch
          :value="ruleForm.active"
          :title="'激活任务'"
          @dyClick="switchChange"
        ></nt-switch>
      </div>
      <el-form-item label="类型">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.type"
          placeholder="请选择类型">
          <el-option
            v-for="item in selectType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对象" v-if="ruleForm.type === 'call'">
        <el-input v-model="ruleForm.model" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="方法" v-if="ruleForm.type === 'call'">
        <el-input v-model="ruleForm.function" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="call" v-if="ruleForm.type === 'call'">
        <el-input v-model="ruleForm.args" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="消息代码" v-if="ruleForm.type === 'message'">
        <el-input v-model="ruleForm.message_name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="消息参数" v-if="ruleForm.type === 'message'">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入内容"
          resize="none"
          v-model="ruleForm.message_args">
        </el-input>
      </el-form-item>
      <!-- <div class="tips">说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案</div> -->
      <div class="btns" v-permission="'serviceCenter_serviceDetail_cronList_edit'">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')" :disabled="!ruleForm.name">保存</DYButton>
          <DYButton @click="cancleForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>
<script>
import { CRON_LIST_UPDATE } from '@/api'
import ntSwitch from 'components/base/switch.vue'
import ntSlider from 'components/base/slider/slider.vue'

export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => ({
        name: '' // 名称
      })
    },
    meshCode: {
      type: String
    }
  },
  data () {
    return {
      interval_type_text: '秒',
      switchValue: false, // 状态
      ruleForm: {
        name: '' // 名称
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ]
      },
      selectType: [{
        value: 'message',
        label: '发送消息'
      }, {
        value: 'call',
        label: '调用方法'
      }],
      selectData: [{
        value: 'seconds',
        label: '秒'
      }, {
        value: 'minutes',
        label: '分'
      }, {
        value: 'hours',
        label: '时'
      }, {
        value: 'work_days',
        label: '工作日'
      }, {
        value: 'days',
        label: '天'
      }, {
        value: 'weeks',
        label: '周'
      }, {
        value: 'months',
        label: '月'
      }],
      marks: {0: '0', 120: '120'},
      marks1: {'-1': '不限制', 20: '20'}
    }
  },
  methods: {
    selected (val) {
      this.interval_type_text = (this.selectData.find(item => item.value === val)).label
      this.marks = {
        0: `0${this.interval_type_text}`,
        120: `120${this.interval_type_text}`
      }
    },
    formatTooltip (val) {
      let format = val + this.interval_type_text
      return `${format}`
    },
    formatTooltip1 (val) {
      return `${val}`
    },
    switchChange () {
      this.ruleForm.active = !this.ruleForm.active
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            cron_id: this.ruleForm.id,
            name: this.ruleForm.name,
            type: this.ruleForm.type,
            interval_number: this.ruleForm.interval_number,
            interval_type: this.ruleForm.interval_type,
            numbercall: this.ruleForm.numbercall,
            doall: this.ruleForm.doall,
            nextcall: this.ruleForm.nextcall,
            priority: +this.ruleForm.priority,
            model: this.ruleForm.model,
            function: this.ruleForm.function,
            message_name: this.ruleForm.message_name,
            args: this.ruleForm.args,
            active: this.ruleForm.active,
            message_args: this.ruleForm.message_args,
            mesh_code: this.ruleForm.mesh_code
          }
          if (this.ruleForm.id) {
            CRON_LIST_UPDATE(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
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
    this.selected(this.ruleForm.interval_type)
    this.switchValue = this.ruleForm.active || false
  },
  created () {
  },
  components: {
    ntSwitch,
    ntSlider
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.add_fault_box {
  .default-width {
    width: 425px;
    .mb-30 {
      margin-bottom: 30px;
    }
    .empower_btn{
      margin-left: 16px;
    }

    .input_size{
      width: 46% !important;
    }
    .tilte {
      margin-bottom: 10px;
    }
    .headerList {
      margin-bottom: 20px;
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
  }
  .custom_width{
    width: 925px;
    .format_width{
      padding-left: 30px;
      width: 100%;
    }
  }

  .demonstration {
    margin-left: 10px;
    margin-right: 10px;
  }

  .full-content .el-form-item__content {
    width: 100%;
    padding-left: 30px;
  }

  .el-slider__marks {
    .el-slider__marks-text {
      width: 80px;
      &:first-child {
        left: 0 !important;
        transform: translateX(0) !important;
      }
    }
  }
}
</style>
