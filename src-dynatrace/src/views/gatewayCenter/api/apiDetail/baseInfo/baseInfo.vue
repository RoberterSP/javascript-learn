<template>
  <div class="add_deploy_box p10">
      <el-form class="default-width" :model="form" :rules="rules" ref="ruleForm" label-position="top">
        <el-form-item prop="name" class="mb-57" label="接口名称">
          <el-input class="name-input" v-model="form.name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="mb-57" label="接口URL">
          <el-input class="name-input" v-model="form.endpoint" :disabled="form.id" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="mb-57" label="接口别名">
          <el-input class="name-input" v-model="form.alias_endpoint" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" class="custom_width">
        <nt-switch :title="'记录日志详情'" v-model="form.log_enable" @dyClick="switchChange"></nt-switch>
      </el-form>
      <el-form class="default-width" :model="ruleForm">
        <el-form-item class="mb-30" label="备注" prop="info">
          <el-input
            type="textarea"
            :rows="5"
            :autosize="{ minRows: 5, maxRows: 5 }"
            placeholder="请输入内容"
            v-model="form.info">
          </el-input>
        </el-form-item>
        <div class="btns"  v-permission= "'gatewayCenter_apiDetail_baseInfo_edit'">
          <el-button type="primary" @click="submitApp">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntSwitch from 'components/base/switch.vue'
import { API_UPDATE_POST } from '@/api/index.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      page_type: 'create',
      rules: {
        name: [
          { required: true, message: '名称不能为空!', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    detailData: {
      type: Object,
      default: () => {
        return {
          name: '',
          endpoint: '',
          alias_endpoint: '',
          log_enable: false,
          info: '',
          id: ''
        }
      }
    }
  },
  computed: {
    form: {
      get: function () {
        return this.detailData
      },
      set: function () {}
    }
  },
  methods: {
    switchChange () {
      this.form.log_enable = !this.form.log_enable
    },
    submitApp () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let data = {
            name: this.form.name,
            code: this.form.code,
            log_enable: this.form.log_enable
          }
          data.endpoint_id = this.form.id
          API_UPDATE_POST(data).then(res => {
            bus.$emit('openMessage', {
              message: res.data.result,
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          console.log(this.form)
          return false
        }
      })
    },
    cancel () {
      this.$router.push({name: 'apiList'})
    }
  },
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      console.log('detailData', this.$route.params.detailData)
      if (!this.$route.params.detailData.endpoint) {
        this.detailData.name = ''
        this.detailData.endpoint = ''
        this.detailData.id = ''
        this.detailData.alias_endpoint = ''
        this.detailData.info = ''
      } else {
        this.detailData = this.$route.params.detailData
      }
      this.form.name = this.detailData.name
      this.form.endpoint = this.detailData.endpoint
      this.form.alias_endpoint = this.detailData.alias_endpoint
      this.form.info = this.detailData.info
      if (this.detailData.id) {
        this.page_type = 'edit'
      }
    }
  },
  components: {
    splitTitle,
    ntSwitch
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
