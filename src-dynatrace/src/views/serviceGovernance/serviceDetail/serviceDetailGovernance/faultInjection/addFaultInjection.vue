<template>
  <div class="add_fault_box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code">
        <el-input v-model="ruleForm.code" placeholder="请输入标识" :disabled="!!ruleForm.id"></el-input>
      </el-form-item>
      <el-form-item label="优先级">
        <el-input v-model="ruleForm.priority" type="number" min=0 placeholder="请输入优先级"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.fault_type"
          placeholder=" 请选择类型">
          <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中断响应码" v-if="ruleForm.fault_type === 'abort'">
        <el-input v-model="ruleForm.abort_http_status" placeholder="请输入中断响应码"
                  onkeyup="if(! /^\d+$/.test(this.value)){this.value='';};if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};"
                  onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm" class="custom_width">
      <el-form-item label="固定延时" class="middle-form-item" v-if="ruleForm.fault_type === 'delay'">
        <ntSlider
          v-model="ruleForm.fixed_delay"
          :resident-tooltip="true"
          start-tooltip="bottom"
          show-input
          :show-input-controls="false"
          :min="0"
          :max="60"
          :marks="marks1"
          :format-tooltip="formatTooltip"
          :tooltip-class="'custom-tooltip'"
          class="format_width">
        </ntSlider>
        <span class="demonstration">秒</span>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm" class="custom_width">
      <el-form-item label="延时比例" class="middle-form-item" v-if="ruleForm.fault_type === 'delay'">
        <ntSlider
          v-model="ruleForm.delay_percentage"
          show-input
          start-tooltip="bottom"
          :show-input-controls="false"
          :marks="marks2"
          :format-tooltip="formatTooltip1"
          class="format_width"
          :resident-tooltip="true"
          :min="0"
          :max="100"
          :tooltip-class="'custom-tooltip'"
        >
        </ntSlider>
        <span class="demonstration">%</span>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm" class="custom_width">
      <el-form-item label="中断比例" class="middle-form-item" v-if="ruleForm.fault_type === 'abort'">
        <ntSlider
          v-model="ruleForm.abort_percentage"
          show-input
          :show-input-controls="false"
          :marks="marks2"
          :format-tooltip="formatTooltip1"
          class="format_width"
          :resident-tooltip="true"
          start-tooltip="bottom"
          :min="0"
          :max="100"
          :tooltip-class="'custom-tooltip'"
        >
        </ntSlider>
        <span class="demonstration">%</span>
      </el-form-item>
    </el-form>
    <el-form class="default-width" :model="ruleForm">
      <p class="tilte">Header标签</p>
      <div class="headerList">
        <div class="flex-start header" v-for="(header, index) in ruleForm.match_header" :key="`header${index}`">
          <el-input class="headTitle" v-model="header.key" placeholder="请输入键"></el-input>
          <span class="headmid">:</span>
          <el-input class="headBody" v-model="header.value" placeholder="请输入值"></el-input>
          <img @click="deleteHeader(index)" src="@/assets/image/icon-delete.svg" alt=""
               v-if="ruleForm.match_header.length">
        </div>
      </div>
      <el-button @click="addHeader" class="mb30">添加</el-button>
    </el-form>
    <el-form :model="ruleForm" class="custom_width">
      <el-form-item label="最大故障比例" class="middle-form-item">
        <ntSlider
          v-model="ruleForm.max_active_faults"
          show-input
          :show-input-controls="false"
          :marks="marks2"
          :format-tooltip="formatTooltip1"
          class="format_width"
          :resident-tooltip="true"
          start-tooltip="bottom"
          :min="0"
          :max="100"
          :tooltip-class="'custom-tooltip'"
        >
        </ntSlider>
        <span class="demonstration">%</span>
      </el-form-item>
    </el-form>
    <el-form class="default-width" :model="ruleForm">
      <el-form-item label="上游集群">
        <el-input v-model="ruleForm.upstream_cluster" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="下游节点">
        <el-input v-model="ruleForm.downstream_nodes" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item class="mb-30" label="备注" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入内容"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <el-form-item class="mb-10">
        <nt-switch
          :value="switchValue"
          :title="'激活故障注入规则'"
          @dyClick="switchChange"
        ></nt-switch>
      </el-form-item>
      <!-- <div class="tips">说明文案说明文案说明文案说明文案说明文案说明文案说明文案说明文案</div> -->
      <div class="btns" v-permission="'serviceCenter_serviceDetail_faultInjectionRuleList_edit'">
        <el-button @click="submitForm('ruleForm')" type="primary">保存
        </el-button>
        <el-button @click="cancleForm('ruleForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import {NXMC_MESH_FAULT_INJECTION_UPDATE_POST, NXMC_MESH_FAULT_INJECTION_UPLOAD_POST} from '@/api'
import ntSwitch from 'components/base/switch.vue'
import ntSlider from 'components/base/slider/slider'

import bus from '@/assets/eventBus.js'

export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => {
        return {
          name: '', // 名称
          code: '',
          fault_type: 'delay',
          match_header: []
        }
      }
    },
    meshCode: {
      type: String
    }
  },
  data () {
    return {
      switchValue: false, // 状态
      ruleForm: {
        name: '', // 名称
        code: '',
        fault_type: 'delay',
        match_header: []
      },
      rules: {
        code: [
          {required: true, message: '标识不能为空！', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '名称不能为空！', trigger: 'blur'}
        ]
      },
      selectData: [{
        value: 'delay',
        label: '延时'
      }, {
        value: 'abort',
        label: '中断'
      }],
      marks1: {0: '0秒', 60: '60秒'},
      marks2: {0: '0%', 100: '100%'}
    }
  },
  methods: {
    addHeader () {
      this.ruleForm.match_header.push({key: '', value: ''})
    },
    deleteHeader (index) {
      this.ruleForm.match_header.splice(index, 1)
    },
    formatTooltip (val) {
      return `${val}秒`
    },
    formatTooltip1 (val) {
      return `${val}%`
    },
    switchChange () {
      this.switchValue = !this.switchValue
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const haveValue = this.ruleForm.match_header.some(item => (item.key && !item.value) || (!item.key && item.value) || (!item.key && !item.value))
          const haveKey = this.ruleForm.match_header.some(item => (item.key && !item.value) || (!item.key && item.value) || (!item.key && !item.value))
          if (haveValue || haveKey) {
            // const tipStr = haveValue ? '值' : 'key'
            // this.$message({ message: `Header标签的${tipStr}不能为空`, type: 'error', duration: 2000 })
            bus.$emit('openMessage', {
              message: '请完善Header标签信息',
              type: 'warning'
            })
            return false
          }
          const params = {
            name: this.ruleForm.name,
            code: this.ruleForm.code
          }
          params.match_header = this.ruleForm.match_header
          params.state = this.switchValue
          params.fault_type = this.ruleForm.fault_type
          if (this.ruleForm.fault_type === 'delay') {
            params.fixed_delay = this.ruleForm.fixed_delay
            params.delay_percentage = this.ruleForm.delay_percentage
            params.abort_http_status = 0
            params.abort_percentage = 0
          } else {
            if (this.ruleForm.abort_http_status) params.abort_http_status = Number(this.ruleForm.abort_http_status)
            params.abort_percentage = this.ruleForm.abort_percentage
            params.fixed_delay = 0
            params.delay_percentage = 0
          }
          if (this.ruleForm.priority) params.priority = Number(this.ruleForm.priority)
          if (this.ruleForm.upstream_cluster) params.upstream_cluster = this.ruleForm.upstream_cluster
          if (this.ruleForm.downstream_nodes) params.downstream_nodes = this.ruleForm.downstream_nodes
          if (this.ruleForm.match_header_name) params.match_header_name = this.ruleForm.match_header_name
          if (this.ruleForm.match_header_name && this.ruleForm.match_header_value) params.match_header_value = this.ruleForm.match_header_value
          if (this.ruleForm.max_active_faults) params.max_active_faults = this.ruleForm.max_active_faults
          if (this.ruleForm.info) params.info = this.ruleForm.info
          if (this.ruleForm.id) {
            params.fault_injection_id = this.ruleForm.id
            params.mesh_code = this.ruleForm.mesh_code
            NXMC_MESH_FAULT_INJECTION_UPDATE_POST(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
              }
            })
          } else {
            params.mesh_code = this.meshCode
            NXMC_MESH_FAULT_INJECTION_UPLOAD_POST(params).then(res => {
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

      .empower_btn {
        margin-left: 16px;
      }

      .input_size {
        width: 46% !important;
      }

      .tilte {
        font-family: @default-font;
        font-size: @default-font-size;
        color: @default-font-color;
        font-weight: @default-font-weight;
        line-height: @default-line-height;
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

    .custom_width {
      width: 607px;
      margin-bottom: 42px;

      .format_width {
        width: 96%;
        float: left;
      }

      .demonstration {
        float: right;
      }
    }
  }
</style>
<style lang="less">
  .add_fault_box {
    .el-slider__button-wrapper {
      z-index: 1 !important;
    }
  }
</style>
