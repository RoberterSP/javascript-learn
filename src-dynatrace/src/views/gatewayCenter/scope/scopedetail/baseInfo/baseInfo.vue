<template>
  <div class="page">
    <DYSplitTitle class="title" :title="'接口组'"></DYSplitTitle>
    <p class="desc">规范应用能访问的接口，对于接口组添加的的接口，应用添加接口组后才能有权限访问。</p>
    <el-form class="default-width" :model="form" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item prop="name" label="名称">
        <el-input class="name-input" v-model="form.name" placeholder="例如: 订单相关"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="标识">
        <el-input class="name-input" v-model="form.code" :disabled="!!form.id" placeholder="例如: order_gp"></el-input>
      </el-form-item>
      <div class="footer btns" v-permission="'gatewayCenter_scopeDetail_baseInfo_edit'">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitApp">保存</DYButton>
          <DYButton @click="cancel">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntRadio from 'components/base/radio.vue'
import {SCOPE_CREATE_POST, SCOPE_UPDATE_POST} from '@/api/index.js'
import bus from '@/assets/eventBus.js'
import {clone} from 'lodash'

export default {
  data () {
    return {
      page_type: 'create',
      rules: {
        name: [
          {required: true, message: '名称不能为空!', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '标识不能为空!', trigger: 'blur'}
        ]
      },
      detailDataCopy: {},
      form: {
        name: '',
        code: '',
        id: ''
      }
    }
  },
  props: {
    detailData: {
      type: Object,
      default: () => ({
        name: '',
        code: '',
        id: ''
      })
    }
  },
  // computed: {
  //   form: {
  //     get () {
  //       return this.detailData
  //     },
  //     set () {
  //     }
  //   }
  // },
  methods: {
    submitApp () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            name: this.form.name,
            code: this.form.code
          }
          if (this.form.id) {
            data.id = this.form.id
            SCOPE_UPDATE_POST(data).then(res => {
              // this.$message({message: res.data.result, type: 'success'})
              bus.$emit('openMessage', {
                message: res.data.result,
                type: 'success'
              })
            })
          } else {
            SCOPE_CREATE_POST(data).then(res => {
              // this.$message({message: res.data.result, type: 'success'})
              bus.$emit('openMessage', {
                message: res.data.result,
                type: 'success'
              })
              this.detailDataCopy = res.data.scope_info
              this.$emit('setNav', res.data.scope_info)
              bus.$emit('scopeCreate', res.data.scope_info)
              // this.$router.push({name: 'scopeDetail', params: res.data.scope_info})
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel () {
      this.$router.push({name: 'scopeList'})
    }
  },
  mounted () {
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      console.log('detailData', this.$route.params.detailData)

      if (!this.$route.params.detailData.code) {
        this.detailDataCopy.name = ''
        this.detailDataCopy.code = ''
        this.detailDataCopy.id = ''
      } else {
        this.detailDataCopy = this.$route.params.detailData
      }

      if (this.detailDataCopy.id) {
        this.page_type = 'edit'
      }
    } else {
      this.detailDataCopy = clone(this.detailData)
    }

    this.form.name = this.detailDataCopy.name
    this.form.code = this.detailDataCopy.code
    this.form.id = this.detailDataCopy.id
  },
  components: {
    ntRadio
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .default-width {
    width: @default-form-width;
  }

  .desc {
    margin-top: 8px;
    width: 50%;
    margin-bottom: 34px;
  }

</style>
