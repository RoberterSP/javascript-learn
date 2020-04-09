<template>
  <div class="add_deploy_box">
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="负载均衡策略">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.lb_type"
          placeholder=" 请选择类型">
          <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm" class="custom_width">
      <el-form-item label="连接超时时间">
        <ntSlider
          v-model="ruleForm.connect_timeout"
          show-input
          in-form
          :show-input-controls="false"
          :min="0"
          :max="5"
          :step="0.05"
          :marks="marks1"
          :format-tooltip="formatTooltip"
          class="format_width"
          start-tooltip="bottom"
          :resident-tooltip="true"
          :tooltip-class="'custom-tooltip'"
          demonstration="秒"
        >
        </ntSlider>

      </el-form-item>
      <div class="switch_form_item">
        <nt-switch
          :value="switchValue"
          :title="'激活异常弹出策略'"
          @dyClick="switchChange"
        ></nt-switch>
      </div>
      <template v-if="switchValue">
        <el-form-item label="异常阈值">
          <ntSlider
            v-model="ruleForm.consecutive_num"
            show-input
            in-form
            :show-input-controls="false"
            :min="0"
            :max="20"
            :marks="marks2"
            class="format_width"
            start-tooltip="bottom"
            :resident-tooltip="true"
            :tooltip-class="'custom-tooltip'"
            demonstration="次"
          >
          </ntSlider>

        </el-form-item>
        <el-form-item label="异常基础弹出时间">
          <ntSlider
            v-model="ruleForm.base_ejection_time"
            show-input
            in-form
            :show-input-controls="false"
            :min="0"
            :max="120"
            :marks="marks3"
            :format-tooltip="formatTooltip1"
            class="format_width"
            start-tooltip="bottom"
            :resident-tooltip="true"
            :tooltip-class="'custom-tooltip'"
            demonstration="秒"
          >
          </ntSlider>
        </el-form-item>
        <el-form-item label="异常最大弹出节点数">
          <ntSlider
            v-model="ruleForm.max_ejection_percent"
            show-input
            in-form
            :show-input-controls="false"
            :min="0"
            :max="20"
            :marks="marks4"
            :format-tooltip="formatTooltip2"
            class="format_width"
            start-tooltip="bottom"
            :resident-tooltip="true"
            :tooltip-class="'custom-tooltip'"
            demonstration="个"
          >
          </ntSlider>

        </el-form-item>
        <el-form-item label="异常统计间隔">
          <ntSlider
            v-model="ruleForm.interval"
            show-input
            in-form
            :show-input-controls="false"
            :min="0"
            :max="180"
            :marks="marks5"
            :format-tooltip="formatTooltip3"
            class="format_width"
            start-tooltip="bottom"
            :resident-tooltip="true"
            :tooltip-class="'custom-tooltip'"
            demonstration="秒"
          >
          </ntSlider>
        </el-form-item>
      </template>
    </el-form>
    <el-form class="default-width" :model="ruleForm">
      <el-form-item label="备注" prop="info">
        <el-input
          type="textarea"
          :rows="5"
          :autosize="{ minRows: 5, maxRows: 5 }"
          placeholder="请输入内容"
          resize="none"
          v-model="ruleForm.info">
        </el-input>
      </el-form-item>
      <div class="btns" v-permission="'serviceCenter_deployGroupDetail_baseInfo_edit'">
        <DYButtonGroup>
          <DYButton type="primary" :disabled="!ruleForm.name" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="cancleForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>
<script>
import { DEPLOY_GROUP_UPDATE_POST } from '@/api'
import ntSwitch from 'components/base/switch.vue'
import ntSlider from 'components/base/slider/slider.vue'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      switchValue: false, // 状态
      ruleForm: {
        name: '', // 名称
        lb_type: 'ROUND_ROBIN'
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ]
      },
      selectData: [{
        value: 'ROUND_ROBIN',
        label: '轮询'
      }, {
        value: 'LEAST_REQUEST',
        label: '最小请求数'
      }, {
        value: 'RANDOM',
        label: '随机'
      }],
      marks1: {0: '0秒', 5: '5秒'},
      marks2: {0: '0次', 20: '20次'},
      marks3: {0: '0秒', 120: '120秒'},
      marks4: {0: '0个', 20: '20个'},
      marks5: {0: '0秒', 180: '180秒'}
    }
  },
  methods: {
    formatTooltip (val) {
      return `${val}秒`
    },
    formatTooltip1 (val) {
      return `${val}秒`
    },
    formatTooltip2 (val) {
      return `${val}个`
    },
    formatTooltip3 (val) {
      return `${val}秒`
    },
    switchChange () {
      this.switchValue = !this.switchValue
      this.ruleForm.outlier_detection_status = this.switchValue
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            this.ruleForm.deploy_group_id = this.ruleForm.id
            DEPLOY_GROUP_UPDATE_POST(this.ruleForm).then(res => {
              if (res.code === 0) {
                bus.$emit('openMessage', {
                  message: res.data.result,
                  type: 'success'
                })
                this.$router.push({
                  name: 'deployGroupDetail',
                  params: this.$route.params.detailData
                })
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
      this.$router.push({
        name: 'deployGroupDetail',
        params: this.$route.params.detailData
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.ruleForm = this.$route.params.detailData
    }
    this.switchValue = this.ruleForm.outlier_detection_status || false
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
.add_deploy_box {
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
    width: 725px;
    .format_width{
      width: 96%;
      padding-left: 15px;
      float: left;
    }
    .demonstration{
      float: right;
    }
  }
}
</style>
<style lang="less">
.add_deploy_box{
  .el-slider__button-wrapper{
    z-index: 1 !important;
  }
  .el-slider__marks-text{
    width: 40px;
    &:first-child{
      left: 3% !important;
    }
  }
}
</style>
