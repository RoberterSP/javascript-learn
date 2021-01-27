<template>
  <div class="">
    <el-form ref="form" :rules="rules" :model="form">

      <DYHeader title="应用名称" type="small" no-gap/>

      <p class="mt8 h3titledesc-mb-style1 half-width">为外部应用创建一个名称以便更加方便的识别这个应用。同时系统也会为该应用自动生成 AppID 和 AppSecret</p>

      <el-form-item class="app-name" prop="appname">
        <el-input class="name-input" v-model="form.appname" placeholder="例如：互道ShopForce"></el-input>
      </el-form-item>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'分类'"></DYSplitTitle>
      <p class="h3titledesc-mb-style2">
        给新建的应用选择一个分类
      </p>

      <div class="category-list-box">
        <nt-radio class="category-list" :name="'category_list'" :list="category_list||[]" :keyValue="radioKeyValue"
                  v-on:radioChecked="radioChecked" />

        <div class="half-width" v-if="showCategoryListError">
          <DYAlert message="请选择分类!" type="warning" show-icon />
        </div>
      </div>

      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'App ID'" v-if="page_type=='edit'" />
      <div class="appid" v-if="page_type=='edit'">
        <span id="appid">{{form.app_id}}</span>
        <DYButton type="link" class="ml8" @click="copy()">复制</DYButton>
        <input id="appidinput"/>
      </div>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'App Secret'" v-if="page_type=='edit'" />
      <div class="appsecret" v-if="page_type=='edit'" style="line-height: 33px;">
        <span>{{form.app_secret}}</span>

        <span v-if="showResetLabel">
          <DYButton type="link" class="ml8" @click="resetLabelChange(false)">重置</DYButton>
        </span>
        <span v-else class="ml20">
          <span class="confirm-message">确定重置APP Secret？</span>
          <DYButton type="primary" class="ml20" @click="reset()">是</DYButton>
          <DYButton type="primary" class="ml10" @click="resetLabelChange(true)">否</DYButton>
        </span>

      </div>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'授权类型'" />
      <p class="half-width h3titledesc-mb-style1">
        AccessToken 方式为默认 App 鉴权方式，需要通过 app_id 和 app_sercert 计算出app_key,然后通过授权接口换取
        access_token。对于换取获得的Token，存在过期时间，且同一用户不可重复换取，重新换取后，会导致老的Token
        100s内过期。客户端在发起业务请求时，需要携带Token，对应请求Header名称为“Token”。
        Appkey 鉴权方式相对于 AccessToken 鉴权方式比较简单，只需通过 appkey
        反查相应的应用信息并验证。对于应用本身不属于Appkey鉴权方式的，无法通过验证。客户端在发起业务请求时，需要携带Appkey，对应请求Header名称为“appkey”。appkey值为企业网关分配的应用app_sercert。
      </p>

      <el-form-item class="form-user" prop="auth_type">
        <el-select class="map-user" v-model="form.auth_type" placeholder="请选择">
          <el-option v-for="item in auth_type_list||[]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'内部映射用户'"></DYSplitTitle>
      <p class="half-width h3titledesc-mb-style1">
        每一个应用都需要和一个服务型用户一一映射，用于在各服务内部甄别和记录不同应用的行为，并配置相应的权限。服务型用户需要在用户中心提前创建完毕。
      </p>

      <el-form-item class="form-user" prop="user_login">
        <el-select class="map-user" v-model="form.user_login" placeholder="请选择">
          <el-option v-for="item in user_list||[]" :key="item.id" :label="item.name" :value="item.login">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="btns" v-permission="'gatewayCenter_appDetail_baseInfo_edit'">
        <DYButton type="primary" @click="submitApp">保存</DYButton>
        <DYButton class="ml8" @click="cancel">取消</DYButton>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntRadio from 'components/base/radio.vue'

import {
  APP_CATEGORY_LIST_GET,
  APP_CREATE_POST,
  APP_RESET_SECRET_POST,
  APP_UPDATE_POST,
  NXDF_SERVICE_USER_LIST_GET
} from '@/api/index.js'
import App from 'mixins/app'
import {PAGESIZE} from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  mixins: [App],
  data () {
    return {
      detailData: false,
      page_type: 'create',
      showResetLabel: true,
      category_list: false,
      radioKeyValue: ['id', 'name'],
      user_list: false,
      auth_type_list: [{label: 'Access Token', value: 'token'}, {label: 'App Key', value: 'app_key'}],
      form: {
        appname: '',
        category_id: '',
        category_code: '',
        user_login: '',
        app_id: '',
        app_secret: '',
        auth_type: 'token'
      },
      rules: {
        appname: [
          {required: true, message: '名称不能为空!', trigger: 'blur'}
        ],
        user_login: [
          {required: true, message: '请选择用户!', trigger: 'change'}
        ],
        auth_type: [
          {required: true, message: '请选择授权类型!', trigger: 'change'}
        ]
      },
      showCategoryListError: false
    }
  },
  computed: {},
  methods: {
    // 获取应用分类列表
    readAppCategoryList () {
      APP_CATEGORY_LIST_GET().then(res => {
        let categoryList = res.data.result
        if (this.detailData.id) {
          categoryList.forEach(item => {
            if (item.id === this.detailData.category_id) {
              item.default = true
              this.$set(this.form, 'category_id', item.id)
              this.$set(this.form, 'category_code', item.code)
            }
          })
        } else {
          // 默认选中
          categoryList.forEach(item => {
            if (item.id === this.detailData.category_id) {
              item.default = true
              this.$set(this.form, 'category_id', item.id)
              this.$set(this.form, 'category_code', item.code)
            }
          })
        }
        this.category_list = categoryList
      })
    },
    // 获取应用分类列表
    readServiceUserList () {
      NXDF_SERVICE_USER_LIST_GET({
        page: 1,
        page_size: PAGESIZE
      }).then(res => {
        let userList = res.data.user_list
        this.user_list = userList
      })
    },
    // 复制appid
    copy () {
      const text = document.getElementById('appid').innerText
      let input = document.getElementById('appidinput')
      input.value = text // 修改文本框的内容
      input.select() // 选中文本
      try {
        if (document.execCommand('copy', false, null)) {
          // this.$message({message: '复制成功', type: 'success'})
          bus.$emit('openMessage', {
            message: '复制成功',
            type: 'success'
          })
        } else {
          // this.$message({message: '复制失败', type: 'error'})
          bus.$emit('openMessage', {
            message: '复制失败',
            type: 'error'
          })
        }
      } catch (err) {
        // this.$message({message: '复制失败', type: 'error'})
        bus.$emit('openMessage', {
          message: '复制失败',
          type: 'error'
        })
      }
    },
    resetLabelChange (bol) {
      this.showResetLabel = bol
    },
    // 重置app Secret
    reset () {
      let _this = this
      APP_RESET_SECRET_POST({
        id: this.detailData.id
      }).then(res => {
        if (res.code === 0) {
          _this.showResetLabel = true
          _this.form.app_secret = res.data.app_secret
          _this.detailData.app_secret = res.data.app_secret
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
        }
      })
    },
    radioChecked (name, checked) {
      this.showCategoryListError = false

      this.$set(this.form, 'category_id', parseInt(checked))
      let obj = this.category_list.find(row => row.id === parseInt(checked))
      this.$set(this.form, 'category_code', obj.code)
    },
    submitApp () {
      if (!this.form.category_id) {
        this.showCategoryListError = true
      }

      this.$refs.form.validate((valid) => {
        if (valid && !this.showCategoryListError) {
          let data = {
            name: this.form.appname,
            app_categ: this.form.category_id,
            username: this.form.user_login,
            auth_type: this.form.auth_type
          }
          // if (this.detailData) {
          //   this.detailData.name = this.form.appname
          //   this.detailData.app_categ = this.form.category_id
          //   this.detailData.username = this.form.category_id
          // }
          if (this.detailData.id) {
            // 编辑
            data.id = this.detailData.id
            APP_UPDATE_POST(data).then(res => {
              bus.$emit('openMessage', {
                message: res.data.result,
                type: 'success'
              })
              this.detailData.category = this.form.category_code
              this.detailData.name = this.form.appname
              this.detailData.username = this.form.user_login
              this.detailData.category_id = this.form.category_id
              this.detailData.auth_type = this.form.auth_type
              this.$store.commit('SET_APPLIST_STATE', this.detailData)
              bus.$emit('appCreate', this.detailData)
            })
          } else {
            // 创建
            APP_CREATE_POST(data).then(res => {
              bus.$emit('openMessage', {
                message: res.data.result,
                type: 'success'
              })
              let appInfo = res.data.app_info
              this.$store.commit('SET_APPLIST_STATE', appInfo)
              bus.$emit('appCreate', Object.assign(appInfo, {
                category_id: this.form.category_id,
                category: this.form.category_code
              }))
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
      if (this.detailData.id) {
        this.$router.push({name: 'appDetail', params: this.detailData})
      } else {
        // 如果是创建，直接返回应用列表
        this.$router.push({name: 'appList'})
      }
    }
  },
  mounted () {
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      console.log('detailData', this.$route.params.detailData)
      this.detailData = this.$route.params.detailData
      this.form.appname = this.detailData.name
      this.form.user_login = this.detailData.username
      this.form.auth_type = this.detailData.auth_type
      this.form.app_id = this.detailData.app_id
      this.form.app_secret = this.detailData.app_secret
      this.form.category_id = this.detailData.category_id
      this.form.category_code = this.detailData.category
      if (this.detailData.id) {
        this.page_type = 'edit'
      }
    }
    this.readAppCategoryList()
    this.readServiceUserList()
  },
  components: {
    ntRadio
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .app-name {
    width: 425px;
  }

  .appid {
    position: relative;
    margin: 0 0 16px;
    line-height: 32px;

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      border: 0;
      z-index: -1;
    }
  }

  .appsecret {
    margin: 0 0 16px;
    line-height: 20px;

    // 表单的二次确认
    .confirm-message {
      font-weight: @font-weight-07;
    }

    span {
      &:first-child {
        margin-left: 0;
      }
    }
  }

  .form-user {
    // margin-top: 37px;
    width: 425px;

    .map-user {
      width: 425px;
    }
  }

</style>
