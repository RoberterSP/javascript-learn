<template>
  <div>
<!--    <message ref="message"></message>-->
    <div :style="{minHeight: height + 'px'}" class="backGround">
      <div class="loginBox flex">
        <div class="text-center">
          <div class="logo-img" :style="loadingImgStyle">
          </div>

          <transition name="fade">
            <div class="loading-box mt30" title="5" v-if="loading">
              <svg class="loading-spinner-svg" viewBox="0 0 30 30">
                <circle class="loading-spinner-path" cx="15" cy="15" r="12">

                </circle>
              </svg>
            </div>
          </transition>
        </div>

        <div class="item_body" v-if="!loading">
          <el-form class="default-width" ref="ruleForm" label-position="top">
            <el-form-item label="账号" v-show="!isShowSelect">
              <el-input v-model="ruleForm.userName" @keyup.enter.native="login" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" v-show="ruleForm.userName && !isShowSelect">
              <el-input v-model="ruleForm.passWord" @keyup.enter.native="login" type="password"
                        placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="命名空间" v-show="isShowSelect">
              <el-select
                style="width: 100%;"
                v-model="ruleForm.namespaceCode"
                placeholder="请选择命名空间">
                <el-option v-for="(item ,index) in namespaces" :key="index" :label="item.name"
                           :value="item.namespace_code"></el-option>
              </el-select>
            </el-form-item>
            <div class="btns" v-if="!isShowSelect">
              <el-button @click="login" type="primary" :disabled="!ruleForm.userName || !ruleForm.passWord">登录
              </el-button>
            </div>
            <div class="secondbtns" v-if="isShowSelect">
              <el-button @click="isShowSelect=false" class="cancel">返回</el-button>
              <el-button @click="chooseNamespace" type="primary" class="savesecond"
                         :disabled="!this.ruleForm.namespaceCode">登录
              </el-button>
            </div>
            <div v-if="errorMsg" class="errorMsg">
              <span>{{errorMsg}}</span>
            </div>
          </el-form>
          <!-- <div class="item flex-start">
            <input id="user" @keyup.enter="login" v-model="userName" type="text" placeholder="请输入用户名">
            <img v-if="userName&&userName.length" class="input_delete" src="static/img/input_delete.svg" alt="" @click="userName=''">
          </div>
          <div class="item flex-start">
            <div class="input_block flex-start" id="psw_invisible">
              <input v-if="!isshowPsw" id="psd" @keyup.enter="login" v-model="passWord" type="password" placeholder="请输入密码">
              <input v-if="isshowPsw" id="psd" @keyup.enter="login" v-model="passWord" type="text" placeholder="请输入密码">
              <img class="psd_icon" v-if="isshowPsw&&passWord&&passWord.length" @click="showPsw()" src="static/img/show_on.svg">
              <img class="psd_icon" v-if="!isshowPsw&&passWord&&passWord.length" @click="showPsw()" src="static/img/show_off.svg">
            </div>
            <img v-if="passWord&&passWord.length" class="input_delete" src="static/img/input_delete.svg" alt="" @click="passWord='';isshowPsw=false">
          </div>
          <div @click="login" class="login_btn flex-center" :class="[!canLogin || isClick ? 'isClick' : '']">
            <span>登录</span>
          </div> -->
        </div>
      </div>
    </div>
    <div class="logoBottom">
      <img src="static/img/logo_bottom.svg">
      <div class="text">Copyright © 2014 - 2020 www.nexttao.com</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import './login.less'
  import {AUTH_NAMESPACE_GET, AUTH_RESOURCE_GET, LOGIN_POST} from '@/api'
  // import message from 'components/message/message.vue'
  import {setTimeout} from 'timers'

import Cookies from '@/common/util/cookie.js'

  // import { sendPiwik } from 'static/projectPiwik.js'

  export default {
    data () {
      return {
        namespaceIsShow: false,
        isShowSelect: false,
        isshowPsw: false,
        height: '',
        // userName: '',
        passWord: '',
        canLogin: true,
        namespaces: [],
        errorMsg: '',
        rules: {
          namespaceCode: [
            {required: true, message: '请选择分区', trigger: 'change'}
          ]
        },
        ruleForm: {
          userName: '',
          passWord: '',
          namespaceCode: ''
        },
        alertClose: true,
        loading: false,
        userId: '',
        userName: ''
      }
    },
    computed: {
      isClick: function () {
        return !(this.userName && this.passWord)
      },
      loadingImgStyle () {
        if (!this.loading) return {}

        return {
          width: '598px',
          height: '170px',
          'margin-top': this.height / 2 - 170 + 'px'
        }
      }
    },
    components: {
      // message
    },
    methods: {
      getNamespace () {
        AUTH_NAMESPACE_GET().then(res => {
          this.namespaces = res.data.namespaces
          window.localStorage.setItem('namespaces', JSON.stringify(this.namespaces))
        })
      },
      // 选择namespace的下拉框
      chooseNamespace () {
        this.loading = true

        this.beforeClose()
        window.localStorage.setItem('namespace_code', this.ruleForm.namespaceCode)
        this.getAuthResource()

      },
      beforeClose () {
        this.namespaceIsShow = false
      },
      showPsw () {
        this.isshowPsw = !this.isshowPsw
      },
      login: function () {
        // Cookies.remove('NXDF_TOKEN')
        let that = this
        if (this.ruleForm.userName && this.ruleForm.passWord) {
          var data = {
            username: this.ruleForm.userName,
            password: this.ruleForm.passWord
          }
          this.login_post(data)
        } else if (!this.userName && this.passWord) {
          document.getElementById('user').focus()
        } else if (this.userName && !this.passWord) {
          document.getElementById('psd').focus()
        } else if (!this.userName && !this.passWord) {
          // this.$message({
          //   message: "请输入账号和密码",
          //   type: 'warning'
          // })
          this.errorMsg = '请输入账号和密码'
          setTimeout(() => {
            that.errorMsg = ''
          }, 2000)
          // bus.$emit('openMessage', {
          //   message: '请输入账号和密码',
          //   type: 'warning'
          // })
        }
      },
      // 获取权限
      getAuthResource () {
        let that = this
        return AUTH_RESOURCE_GET({}).then((res) => {
          this.canLogin = true
          if (res.code === 0) {
            // 设置权限信息
            that.$store.commit('actionPrimissionData', res.data)
            // // 默认跳转菜单的第一个
            // if (res.data.access_menus[0].children&&res.data.access_menus[0].children.length>0) {
            //   that.$router.push({ name: res.data.access_menus[0].children[0].name});
            // } else {
            //   that.$router.push({ name: res.data.access_menus[0].name});
            // }
            // 添加piwik
            window.localStorage.setItem('userId', this.userId)
            window.localStorage.setItem('userName', this.userName)
            window.localStorage.setItem('nameSpace', this.ruleForm.namespaceCode)
            // let script = document.createElement('script')
            // script.src = './static/projectPiwik.js'
            // script.type = 'text/javascript'
            // document.body.appendChild(script)
            // sendPiwik()
            that.$router.push({name: 'index', path: 'index/index'})
          } else {

            this.loading = false

            // that.$message({message: res.message, type:'warning'})
            this.errorMsg = res.message
            setTimeout(() => {
              that.errorMsg = ''
            }, 2000)
            // bus.$emit('openMessage', {
            //   message: res.message,
            //   type: 'warning'
            // })
          }
        })
      },
      // 接口调用
      login_post: function (data) {
        let that = this
        window.localStorage.clear()
        LOGIN_POST(data).then((res) => {
          this.canLogin = true
          if (res.code === 0) {
            // 获取权限
            that.$store.commit('setToken', res.data.AccessToken)
            Cookies.set('token', res.data.AccessToken)
            // window.sessionStorage.setItem('token', res.data.AccessToken)
            this.namespaceIsShow = true
            this.isShowSelect = true
            this.userId = res.data.id
            this.userName = res.data.name
            this.getNamespace()
          } else {
            // that.$message({message: res.message, type:'warning'})
            this.errorMsg = res.message
            setTimeout(() => {
              that.errorMsg = ''
            }, 2000)
            // bus.$emit('openMessage', {
            //   message: res.message,
            //   type: 'warning'
            // })
          }
        })
      }
    },
    mounted () {
      // Store.dispatch('setMenuState', false)

      var screabHeight = document.documentElement.clientHeight
      this.height = screabHeight
      Cookies.remove('token')
      // window.sessionStorage.removeItem('token')
    },

    destroyed () {
      // Store.dispatch('setMenuState', true)
    }
  }
</script>
