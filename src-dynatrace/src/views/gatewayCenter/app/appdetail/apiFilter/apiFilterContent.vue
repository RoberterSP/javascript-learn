<template>
  <div class="filterBox">
    <div class="form-open">
      <div class="title">{{ruleForm.endpoint}}</div>
      <div class="label">接口过滤条件修改</div>
      <div class="input-box">
        <div class="tit">请求字段</div>
        <el-input type="textarea" v-model="ruleForm.request_fields" :rows="4" resize="none" placeholder="例如：{'brand_id':[4571,4570],'store_id':3}"></el-input>
      </div>
      <div class="input-box">
        <div class="tit">结果字段</div>
        <el-input type="textarea" v-model="ruleForm.response_fields" :rows="4" resize="none" placeholder="例如：['count','list:store_id,vip_no']"></el-input>
      </div>
      <div class="input-box">
        <nt-switch
          :value="ruleForm.state"
          :title="'激活接口过滤'"
          @dyClick="ruleForm.state=!ruleForm.state"
        ></nt-switch>
      </div>
      <div class="btn" v-permission="'gatewayCenter_appDetail_filterRuleEdit'" v-if="!ruleForm.id">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm()">保存</DYButton>
          <DYButton @click="resetForm()">取消</DYButton>
        </DYButtonGroup>
      </div>
      <div class="btn" v-permission="'gatewayCenter_appDetail_filterRuleAdd'" v-else>
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm()">保存</DYButton>
          <DYButton @click="resetForm()">取消</DYButton>
        </DYButtonGroup>
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
      font-weight:500;
      color:rgba(69,70,70,1);
      line-height:55px;
      margin-bottom: 16px;
    }
    .label {
      font-size:14px;
      font-weight:400;
      color:rgba(69,70,70,1);
      line-height:20px;
    }
    .btn {
      margin-top: 42px;
    }
    .input-box {
      .tit {
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
