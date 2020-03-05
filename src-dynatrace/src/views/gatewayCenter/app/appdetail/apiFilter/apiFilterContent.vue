<template>
  <div class="filterBox">
    <div class="form-open">
      <div class="title">{{ruleForm.endpoint}}</div>
      <div class="label">接口过滤条件修改</div>
      <div class="input-box">
        <div class="tit">请求字段</div>
        <el-input type="textarea" v-model="ruleForm.request_fields" :rows="4" placeholder="例如：{'brand_id':[4571,4570],'store_id':3}"></el-input>
      </div>
      <div class="input-box">
        <div class="tit">结果字段</div>
        <el-input type="textarea" v-model="ruleForm.response_fields" :rows="4" placeholder="例如：{'brand_id':[4571,4570],'store_id':3}"></el-input>
      </div>
      <div class="input-box">
        <nt-switch
          :value="ruleForm.state"
          :title="'激活接口过滤'"
          @dyClick="ruleForm.state=!ruleForm.state"
        ></nt-switch>
      </div>
      <div class="btn" v-permission="'gatewayCenter_appDetail_filterRuleDelete'">
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import bus from '@/assets/eventBus.js'

import {
  APP_API_RULE_UPDATE_POST
} from '@/api'
export default {
  data () {
    return {
      ruleForm: {}
    }
  },
  props: {
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    submitForm () {
      this.app_rule_upload()
    },
    // 新增过滤规则
    app_rule_upload () {
      let data = {
        api_rule_id: this.ruleForm.id,
        app_id: this.ruleForm.app_id,
        endpoint_id: this.ruleForm.endpoint_id,
        state: this.ruleForm.state,
        request_fields: this.ruleForm.request_fields,
        response_fields: this.ruleForm.response_fields
      }
      APP_API_RULE_UPDATE_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.$emit('saveContent', this.ruleForm)
        // this.resetForm()
      })
    },
    resetForm () {
      this.$emit('cancelContent')
    }
  },
  mounted () {
    if (this.clientDetails) {
      this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
    }
  },
  created () {},
  components: {
    ntSwitch
  }
}
</script>
<style scoped lang="less">
 .form-open {
    .title {
      font-family:SourceHanSansSC-Medium,SourceHanSansSC;
      font-weight:500;
      color:rgba(69,70,70,1);
      line-height:55px;
      margin-bottom: 16px;
    }
    .label {
      font-size:14px;
      font-family:SourceHanSansSC-Regular,SourceHanSansSC;
      font-weight:400;
      color:rgba(69,70,70,1);
      line-height:20px;
    }
    .btn {
      margin-top: 42px;
    }
    .input-box {
      .tit {
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(69,70,70,1);
        line-height:46px;
      }
      .el-textarea {
        width: 425px !important;
        height: 112px;
        .el-textarea__inner {
          height: 112px;
        }
      }
    }
  }
</style>
