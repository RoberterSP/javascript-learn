<template>
  <div class="add-box add-health-rule">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <DYSplitTitle class="title h3-title-mb" :title="'基本信息'"></DYSplitTitle>
      <el-form-item class="default-width" label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：订单相关" :disabled="ruleForm.type === 'default'"></el-input>
      </el-form-item>
      <el-form-item class="default-width" label="标识" prop="code">
        <el-input v-model="ruleForm.code" placeholder="例如：order_gp"
                  :disabled="!!(ruleForm.id || ruleForm.type === 'default')"></el-input>
      </el-form-item>
    </el-form>
    <DYSplitTitle class="title h3-title-pt" :title="'规则设置'"></DYSplitTitle>
    <p class="mt24 half-width">接口的健康判定规则由“满意”、“容忍”、“沮丧”这三个区间通过响应时间数值“T”来划分，T值代表着用户对接口性能满意的响应时间界限或者说是“门槛”（Threshold）。系统会根据接口设置的健康规则，对每一次调用的实际响应时间判定并记录其所在的满意度区间。不同的接口可以设置不同的健康规则</p>

    <div class="desc">
      <span>单位响应时间：1 T = <span v-if="!globalEdit">{{globleSetting.apdex}} ms</span></span>
      <div class="set_input_value el-input" v-if="ruleForm.code === 'default'">
        <div class="iconfont icon_edit" v-permission="'settingCenter_healthRule_apdex_edit'" @click="editGlobal(globleSetting)" v-if="!globalEdit"><DYIcon type="edit"></DYIcon></div>
        <nt-input
          v-else
          :value="globleSetting.copyapdex"
          @delete="globalEdit = false"
          @save="saveForm"
        ></nt-input>
      </div>
    </div>
    <div class="rule_move_box">
      <div class="slider-box">
        <ntSlider
          start-tooltip="bottom"
          end-tooltip="top"
          v-model="health_index_arr"
          range
          show-tooltip
          :resident-tooltip="true"
          :min="0"
          :max="50"
          :marks="{0: '0T', 50: '50T'}"
          @input="sliderInput"
          :step="0.5"
          :format-tooltip="formatTooltip"
          :tooltip-class="'custom-tooltip'"
          class="format_width">
        </ntSlider>

        <div class="slider-left" v-bind:style="{'width': slider_arr[0]}"></div>
        <div class="slider-right" v-bind:style="{'width': slider_arr[1]}"></div>
        <div class="default-model1" v-bind:style="{'left': default_data.start_left}" v-if="ruleForm.type !== 'default'">
          <div class="dm-dot">
            <div class="dm-desc resident-tooltip">{{default_data.start}}T</div>
          </div>

        </div>
        <div class="default-model2" v-bind:style="{'left': default_data.end_left}" v-if="ruleForm.type !== 'default'">
          <div class="dm-dot">
            <div class="dm-desc resident-tooltip">{{default_data.end}}T</div>
          </div>
        </div>
        <div class="p_end"></div>
      </div>
    </div>
    <div class="table_list mt10 pb16">
      <el-table
        :data="tableList"
        style="width: 100%">
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :align="column.align"
          :width="column.width">
          <template slot="header" slot-scope="scope">
            <div class="flex header-style">
              <div class="title">{{column.name}}</div>
              <div class="split" v-if="index < 2"></div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="title" v-if="index === 0">
              <i class="iconfont green" v-if="scope.row.name === '满意'"><DYIcon type="manyi"></DYIcon></i>
              <i class="iconfont yellow" v-if="scope.row.name === '容忍'"><DYIcon type="yiban"></DYIcon></i>
              <i class="iconfont red" v-if="scope.row.name === '沮丧'"><DYIcon type="shiwang"></DYIcon></i>
              {{scope.row.name}}
            </div>
            <div class="title" v-if="index === 1">{{scope.row.start}}<span class="pl8">T</span></div>
            <div class="title" v-if="index === 2 && (scope.row.end || scope.row.index === 0 || scope.row.index === 1)">
              <div class="input_handle">
                <el-input v-model="scope.row.end" placeholder="请输入内容" class="input_width" @input="inputVal(scope.row)"
                          onkeyup="if(! /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.value)){this.value='';}"
                          @blur="invalidData(scope.row)"
                ></el-input>
                <span class="pl8">T</span>
              </div>
            </div>
            <div class="title" v-if="index === 2 && !scope.row.end && scope.row.index === 2">
              -
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mt16 mb24" v-if="ruleForm.type !== 'default'">
      <nt-switch
        :value="switchValue"
        :title="'激活健康规则'"
        @dyClick="switchChange"
      ></nt-switch>
    </div>

    <div class="el-form">
      <div class="btns" v-permission="'settingCenter_healthRule_edit'" v-if="!ruleForm.id">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="cancleForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
      <div class="btns" v-permission="'settingCenter_healthRule_add'" v-else>
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="cancleForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </div>
  </div>
</template>
<script>
import {ADD_HEALTH_RULE, GET_GLOBAL_SETTING, UPDATE_DEFAULT_HEALTH_RULE, UPDATE_HEALTH_RULE, NXDF_SETTING_GLOBAL_SETTING_UPDATE_GET} from '@/api'
import ntTable from 'components/ntTable/ntTable.vue'
import ntSwitch from 'components/base/switch.vue'
import ntSlider from 'components/base/slider/slider.vue'
import ntInput from 'components/base/input.vue'
import './index.less'
import bus from '@/assets/eventBus.js'

export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => ({
        name: '', // 角色名称
        code: '' // 标识
      })
    }
  },
  data () {
    return {
      slider_arr: [],
      health_index_configs: [],
      health_index_arr: ['', ''],
      globleSetting: {}, // 全局配置参数
      switchValue: false, // 是否激活健康规则
      ruleForm: {
        id: '', // 角色id
        name: '', // 角色名称
        code: '' // 标识
      },
      rules: {
        name: [
          {required: true, message: '名称不能为空', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '标识不能为空', trigger: 'blur'}
        ]
      },
      columns: [
        {
          name: '满意度区间', // 表头名
          code: 'name',
          type: 'text',
          width: '500',
          align: 'left'
        },
        {
          name: '响应时间从', // 表头名字
          code: 'start', // 表身显示值
          type: 'text'
        },
        {
          name: '至', // 表头名字
          code: 'end', // 表身显示值
          type: 'text',
          width: '150'
        }
      ],
      tableList: [{
        index: 0,
        name: '满意',
        start: '',
        end: ''
      },
      {
        index: 1,
        name: '容忍',
        start: '',
        end: ''
      },
      {
        index: 2,
        name: '沮丧',
        start: '',
        end: ''
      }],
      isEdit: false,
      globalEdit: false,
      default_data: {}
    }
  },
  methods: {
    saveForm (value) {
      NXDF_SETTING_GLOBAL_SETTING_UPDATE_GET({
        global_setting_info: {
          apdex: value
        }
      }).then(res => {
        this.$set(this.globleSetting, 'apdex', value)
        console.log('this.globleSetting', this.globleSetting)
        this.globalEdit = false
      })
    },
    editGlobal (globleSetting) {
      this.isEdit = true
      this.globalEdit = true
      globleSetting.copyapdex = globleSetting.apdex
    },
    switchChange () {
      this.switchValue = !this.switchValue
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.tableList[0].end || !this.tableList[1].end) {
            // this.$message({ message: '区间结束值不能为空', type: 'error', duration: 2000 })
            bus.$emit('openMessage', {
              message: '区间结束值不能为空',
              type: 'warning'
            })
            return
          }
          const params = {
            name: this.ruleForm.name,
            code: this.ruleForm.code
          }
          this.tableList.forEach((item, index) => {
            const {start, end} = item
            if (index === 0) params.satisfaction = `${start}|${end}`
            if (index === 1) params.tolerance = `${start}|${end}`
            if (index === 2) params.despondent = `${start}|${end}`
          })
          params.state = this.switchValue
          if (this.ruleForm.id) {
            params.endpoint_health_id = this.ruleForm.id
            UPDATE_HEALTH_RULE(params).then(res => {
              if (res.code === 0) {
                this.$emit('saveContent', this.ruleForm)
              }
            })
          } else {
            if (this.ruleForm.type === 'default') {
              const defaultOpt = {
                satisfaction: params.satisfaction,
                tolerance: params.tolerance,
                despondent: params.despondent
              }
              UPDATE_DEFAULT_HEALTH_RULE(defaultOpt).then(res => {
                if (res.code === 0) {
                  this.$emit('saveContent', this.ruleForm)
                }
              })
            } else {
              ADD_HEALTH_RULE(params).then(res => {
                if (res.code === 0) {
                  this.$emit('addHandle')
                }
              })
            }
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
    },
    inputVal (row) {
      if (row.index === 0 || row.index === 1) {
        this.$set(this.tableList[row.index + 1], 'start', row.end)
      }
    },
    invalidData (row) {
      // if (Number(row.end) <= Number(row.start)) {
      //   this.$message({ message: '最大值不能小于等于最小值', type: 'error', duration: 2000 })
      //   this.$set(this.tableList[row.index], 'end', '')
      //   this.$set(this.tableList[row.index + 1], 'start', '')
      // }
      // if (this.tableList[row.index + 1] && this.tableList[row.index + 1].end && Number(row.end) >= Number(this.tableList[row.index + 1].end)) {
      //   this.$message({ message: '上一个区间最大值不能大于等于下一个区间最大值', type: 'error', duration: 2000 })
      //   this.$set(this.tableList[row.index], 'end', '')
      //   this.$set(this.tableList[row.index + 1], 'start', '')
      // }
      this.getWidth()
    },
    getWidth () {
      this.health_index_arr = [Number(this.tableList[1].start), Number(this.tableList[1].end)]
      this.slider_arr = [(this.health_index_arr[0] / 50) * 100 + '%', ((50 - this.health_index_arr[1]) / 50) * 100 + '%']
    },
    sliderInput (val) {
      this.$set(this.tableList[0], 'end', val[0])
      this.$set(this.tableList[1], 'start', val[0])
      this.$set(this.tableList[1], 'end', val[1])
      this.$set(this.tableList[2], 'start', val[1])
      this.getWidth()
    },
    formatTooltip (val) {
      return `${val}T`
    }
  },
  mounted () {
    console.log(this.$store.state.defaultHealthRule)
    this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
    if (this.ruleForm.satisfaction) {
      const satisfaction = this.ruleForm.satisfaction.split('|')
      this.tableList[0].start = satisfaction[0] || ''
      this.tableList[0].end = satisfaction[1] || ''
    }
    if (this.ruleForm.tolerance) {
      const tolerance = this.ruleForm.tolerance.split('|')
      this.tableList[1].start = tolerance[0] || ''
      this.tableList[1].end = tolerance[1] || ''
    }
    if (this.ruleForm.despondent) {
      const despondent = this.ruleForm.despondent.split('|')
      this.tableList[2].start = despondent[0] || ''
      this.tableList[2].end = despondent[1] || ''
    }
    if (this.ruleForm.code !== 'default' && this.$store.state.defaultHealthRule) {
      const defaultData = this.$store.state.defaultHealthRule.tolerance.split('|')
      this.default_data.start = defaultData[0] || ''
      this.default_data.start_left = (defaultData[0] / 50) * 100 + '%'
      this.default_data.end = defaultData[1] || ''
      this.default_data.end_left = (defaultData[1] / 50) * 100 + '%'
    }
    this.switchValue = this.ruleForm.state || false
    this.getWidth()
  },
  created () {
    GET_GLOBAL_SETTING({code: 'apdex'}).then(res => {
      this.globleSetting = res.data.global_setting_info
    })
  },
  components: {
    ntTable,
    ntSlider,
    ntSwitch,
    ntInput
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";
.icon_edit {
  color: @turq-06 !important;
  font-size: 24px;
}
  .add-box {
    .default-width {
      width: 425px;

      .mb-30 {
        margin-bottom: 30px;
      }

      .rule_set_info {
        color: #454646;
      }
    }

    .desc {
      margin-top: 8px;
      line-height: 20px;
    }

    .header-style {
      display: flex !important;
      align-items: center;
      // margin-left: -20px;
      .title {
        line-height: 16px;
        margin: 0;
      }

      .split {
        border-bottom: 1px solid @gray-03;
        -webkit-box-flex: 1;
        flex-grow: 1;
        padding: initial !important;
        margin-bottom: 2px;
      }

      &:last-child {
        justify-content: center;
      }
    }

    .input_handle {
      display: flex;
      align-items: center;
    }

    .input_width {
      width: 100px;
    }
    .set_input_value {
      width: 300px;
      input {
        line-height: 20px !important;
        height: 22px !important;
      }
    }
    .rule_move_box {
      margin-left: 8px;
      width: 90%;
      height: 70px;

      .slider-box {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        margin: 30px 0 30px 15px;
      }

      .format_width {
        width: 100%;
        height: 100%;
      }

      .p_end {
        position: absolute;
        top: 10.5px;
        right: -15px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid rgba(220, 23, 42, 1);
      }

      .slider-left {
        position: absolute;
        top: 16px;
        left: 0;
        width: 0;
        height: 10px;
        background: rgba(42, 176, 111, 1);
      }

      .slider-right {
        position: absolute;
        top: 16px;
        right: 0;
        width: 0;
        height: 10px;
        background: rgba(220, 23, 42, 1);
      }

      .dm-desc {
        position: absolute;
        left: -22px;
        background-color: @gray-04;
      }

      .default-model1 {
        position: absolute;
        left: 10%;

        .dm-dot {
          position: absolute;
          top: 13px;
          left: -8px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          border: 2px solid rgba(0, 161, 178, 0.3);
        }

        .dm-desc {
          top: 20px;
        }
      }

      .default-model2 {
        position: absolute;
        left: 50%;

        .dm-dot {
          position: absolute;
          top: 13px;
          left: -8px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          border: 2px solid rgba(0, 161, 178, 0.3);
        }

        .dm-desc {
          top: -40px;
        }
      }
    }

    .title {
      display: flex;
      align-items: center;
    }

    .iconfont {
      font-size: 20px;
      margin-right: 10px;

      &.red {
        color: @red-05;
      }

      &.yellow {
        color: @warning-color;
      }

      &.green {
        color: #2AB06F;
      }
    }
  }
</style>
<style lang="less">
  .table_list {
    .el-table {
      padding: 10px;
    }
    .el-table td, .el-table th.is-leaf {
      border-bottom: none !important;
    }

    .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
      padding-left: initial !important;
    }

    .el-input__inner {
      text-align: right;
    }
  }
</style>
