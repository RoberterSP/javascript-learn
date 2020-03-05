<template>
  <div class="page p10">
    <split-title class="title" :title="'接口组'"></split-title>
    <div class="desc default-label">规范应用能访问的接口，对于接口组添加的的接口，应用添加接口组后才能有权限访问。</div>
    <el-form class="default-width" :model="form" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item prop="name" class="mb-57" label="名称">
        <el-input class="name-input" v-model="form.name" placeholder="例如: 订单相关"></el-input>
      </el-form-item>
      <el-form-item prop="code" class="mb-57" label="标识">
        <el-input class="name-input" v-model="form.code" :disabled="!!form.id" placeholder="例如: order_gp"></el-input>
      </el-form-item>
      <div class="footer" v-permission= "'gatewayCenter_scopeList_add'">
        <el-button type="primary" @click="submitApp">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntRedio from 'components/base/redio.vue'
import { SCOPE_CREATE_POST, SCOPE_UPDATE_POST } from '@/api/index.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      page_type: 'create',
      rules: {
        name: [
          { required: true, message: '名称不能为空!', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '标识不能为空!', trigger: 'blur' }
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
          code: '',
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
    submitApp () {
      this.$refs['ruleForm'].validate((valid) => {
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
              this.detailData = res.data.scope_info
              this.$emit('setNav', res.data.scope_info)
              bus.$emit('scopeCreate', res.data.scope_info)
              // this.$router.push({name: 'scopeDetail', params: res.data.scope_info})
            })
          }
        } else {
          console.log('error submit!!')
          console.log(this.form)
          return false
        }
      })
    },
    cancel () {
      this.$router.push({name: 'scopeList'})
    }
  },
  mounted () {},
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      console.log('detailData', this.$route.params.detailData)
      if (!this.$route.params.detailData.code) {
        this.detailData.name = ''
        this.detailData.code = ''
        this.detailData.id = ''
      } else {
        this.detailData = this.$route.params.detailData
      }
      this.form.name = this.detailData.name
      this.form.code = this.detailData.code
      if (this.detailData.id) {
        this.page_type = 'edit'
      }
    }
  },
  components: {
    splitTitle,
    ntRedio
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}
// .mb-57 {
//   margin-bottom: 57px;
// }
.page {
  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
    margin-bottom: 34px;
  }
  .app-name {
    margin: 28px 0 50px;
    width: 425px;
  }
  .category-list {
    margin: 27px 0 50px 5px;
  }
  .appid {
    position: relative;
    margin: 15px 0 50px;
    line-height:20px;
    a {
      margin-left: 26px;
      color: @theme-color;
      line-height:20px;
    }
    input {
      position: absolute;
      width: 1px;
      height: 1px;
      border: 0;
      z-index: -1;
    }
  }
  .appsecret {
    margin: 15px 0 50px;
    line-height: 20px;
    span {
      margin-left: 6px;
      &:first-child {
        margin-left: 0;
      }
    }
    button {
      margin-left: 10px;
      &:first-child {
        margin-left: 20px;
      }
    }
  }
  .form-user {
    margin-top: 37px;
    width: 425px;
    .map-user {
      width: 425px;
    }
  }
  .footer {
    margin: 0px 0 20px;
    button {
      margin-left: 24px;
      &:first-child {
        margin-left: 16px;
      }
    }
  }
}
</style>
