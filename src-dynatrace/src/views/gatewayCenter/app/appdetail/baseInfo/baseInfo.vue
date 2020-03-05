<template>
  <div class="page p10">
    <el-form ref="form" :rules="rules" :model="form">
      <h2>应用名称</h2>
      <!-- <split-title class="title" :title="'应用名称'"></split-title> -->
      <div class="desc default-label">
        为外部应用创建一个名称以便更加方便的识别这个应用。同时系统也会为该应用自动生成 AppID 和 AppSecret
      </div>
      <el-form-item class="app-name" prop="appname">
        <el-input class="name-input" v-model="form.appname" placeholder="例如：互道ShopForce"></el-input>
      </el-form-item>
      <split-title class="title" :title="'分类'"></split-title>
      <div class="desc default-label">
        给新建的应用选择一个分类
      </div>

      <div class="category-list-box">
        <nt-redio class="category-list" :name="'category_list'" :list="category_list||[]" :keyValue="redioKeyValue"
                  v-on:redioChecked="redioChecked"></nt-redio>

        <div class="category-list__error" v-if="showCategoryListError">
          <nt-alert message="请选择分类!" type="warning" show-icon></nt-alert>
        </div>
      </div>

      <split-title class="title" :title="'App ID'" v-if="page_type=='edit'"></split-title>
      <div class="appid default-label" v-if="page_type=='edit'">
        <span id="appid">{{form.app_id}}</span>
        <a class="default-label" @click="copy()">复制</a>
        <input id="appidinput"/>
      </div>
      <split-title class="title" :title="'App Secret'" v-if="page_type=='edit'"></split-title>
      <div class="appsecret default-label" v-if="page_type=='edit'" style="line-height: 32px;">
        <span>{{form.app_secret}}</span>
        <span v-if="showResetLabel"><a class="default-label" style="color: #00A1B2;margin-left: 20px;"
                                       @click="resetLabelChange(false)">重置</a></span>
        <span v-else style="margin-left: 20px;">
          <span>确定重置APP Secret？</span>
          <el-button type="primary" @click="reset()">是</el-button>
          <el-button type="primary" @click="resetLabelChange(true)">否</el-button>
        </span>
      </div>
      <split-title class="title" :title="'授权类型'"></split-title>
      <div class="desc default-label">
        AccessToken方式为默认App鉴权方式，需要通过app_id和app_sercert计算出app_key,然后通过授权接口换取access_token。对于换取获得的Token，存在过期时间，且同一用户不可重复换取，重新换取后，会导致老的Token 100s内过期。客户端在发起业务请求时，需要携带Token，对应请求Header名称为“Token”。
        Appkey鉴权方式相对于AccessToken鉴权方式比较简单，只需通过appkey反查相应的应用信息并验证。对于应用本身不属于Appkey鉴权方式的，无法通过验证。客户端在发起业务请求时，需要携带Appkey，对应请求Header名称为“appkey”。appkey值为企业网关分配的应用app_sercert。
      </div>

      <el-form-item class="form-user" prop="auth_type">
        <el-select class="map-user" v-model="form.auth_type" placeholder="请选择">
          <el-option v-for="item in auth_type_list||[]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <split-title class="title" :title="'内部映射用户'"></split-title>
      <div class="desc default-label">
        每一个应用都需要和一个服务型用户一一映射，用于在各服务内部甄别和记录不同应用的行为，并配置相应的权限。服务型用户需要在用户中心提前创建完毕。
      </div>

      <el-form-item class="form-user" prop="user_login">
        <el-select class="map-user" v-model="form.user_login" placeholder="请选择">
          <el-option v-for="item in user_list||[]" :key="item.id" :label="item.name" :value="item.login">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="footer" v-permission= "'gatewayCenter_appDetail_baseInfo_edit'">
        <el-button type="primary" @click="submitApp">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntRedio from 'components/base/redio.vue'
import ntAlert from 'components/base/alert.vue'

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
      redioKeyValue: ['id', 'name'],
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
          categoryList.map(item => {
            if (item.id === this.detailData.category_id) {
              item.default = true
              this.$set(this.form, 'category_id', item.id)
              this.$set(this.form, 'category_code', item.code)
            }
          })
        } else {
          // 默认选中
          categoryList.map(item => {
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
      var text = document.getElementById('appid').innerText
      var input = document.getElementById('appidinput')
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
    redioChecked (name, checked) {
      this.showCategoryListError = false

      this.$set(this.form, 'category_id', parseInt(checked))
      let obj = this.category_list.find(row => row.id === parseInt(checked))
      this.$set(this.form, 'category_code', obj.code)
    },
    submitApp () {
      if (!this.form.category_id) {
        this.showCategoryListError = true
      }

      this.$refs['form'].validate((valid) => {
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
              var appInfo = res.data.app_info
              this.$store.commit('SET_APPLIST_STATE', appInfo)
              bus.$emit('appCreate', Object.assign(appInfo, {category_id: this.form.category_id, category: this.form.category_code}))
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
    splitTitle,
    ntRedio,
    ntAlert
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .page {
    .desc {
      margin-top: 8px;
      width: 50%;
      line-height: 20px;
    }

    .app-name {
      margin: 28px 0 50px;
      width: 425px;
    }

    .category-list-box {
      padding-bottom: 40px;
    }

    .category-list__error {
      width: 50%;
    }

    .category-list {
      margin: 27px 0 10px 5px;
    }

    .appid {
      position: relative;
      margin: 15px 0 50px;
      line-height: 20px;

      a {
        margin-left: 26px;
        color: @theme-color;
        line-height: 20px;
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
      margin: 42px 0 20px;
    }
  }
</style>
