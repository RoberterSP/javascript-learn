<template>
  <div class="navigation">
    <div class="dql-v">
      <div class="dql-m">
        <span class="dql-a dql-l dql-n" @click.stop="show_menu()">
          <img src="~@/assets/image/dynatrace/icon_menu_show.svg" alt="" />
        </span>
        <a @click="goDashboard" class="dql-a dql-l dql-n" >
          <img src="~@/assets/image/board_icon_func.svg" title="" />
        </a>
        <!-- <div class="dql-q">
          <span class="dql-a dql-l dql-r dql-t">
            <img src="~@/assets/image/board_icon_search.svg" title="" />
          </span>
          <div class="dql-s dql-t">
            <div title="Ctrl+Shift+F">
              <input type="text" class="dpg-f" maxlength="100" placeholder="Search AAA: prh88065...">
            </div>
          </div>
        </div> -->
      </div>
      <div class="dql-p dj-a">
        <!-- 日期空间 -->
        <date-pick ref="datePick"></date-pick>
        <!-- <img src="~@/assets/image/board_icon_chat.svg" title="" /> -->
        <img src="~@/assets/image/board_icon_avatar.svg" title="" @click="goOut()" @mouseenter.stop="mouseenterout()"/>
        <div class="cursor p20" v-show="loginOut" @mouseleave="mouseleaveout()">
          <!-- <p>{{ userName }}</p>
          <div class="bottom"></div>
          <el-collapse-transition>
              <ul class="dropdown-menu" v-show="loginOut">
                <li class="cursor"><a @click="handleCommand()">{{$t('sidebar.logout')}}</a></li>
              </ul>
          </el-collapse-transition> -->
          <div class="user_name mb10">{{ userName }}</div>
          <div class="check_name_space">
            <el-form ref="ruleForm" :model="form" label-position="top" class="formNavStyle">
              <el-form-item :label="$t('sidebar.nameSpace')" prop="namespaceCode">
                <div class="space_name" v-if="!showSelectBox"><span class="name">{{spaceName}}</span><span class="replace_name" @click="replaceNameSpace">切换</span></div>
                <el-select class="select_name" v-model="form.namespaceCode" placeholder="$t('sidebar.pleaseSelectArea')" @visible-change="changeNamespace" v-if="showSelectBox">
                  <el-option v-for="(item ,index) in namespaces" :key="index" :label="item.name" :value="item.namespace_code"></el-option>
                </el-select>
                <div v-if="showSelectBox" class="pt10">
                  <el-button type="primary" @click="onSure">确认</el-button>
                  <el-button @click="onCancle">取消</el-button>
                </div>
                <div @click="handleCommand()" class="logo_out pt10">
                  {{$t('sidebar.logout')}}
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from '@/common/util/cookie.js'
import datePick from '@/components/navigation/datePick.vue'
import './index.less'

export default {
  data () {
    return {
      form: {
        namespaceCode: window.localStorage.getItem('namespace_code')
      },
      namespaces: [],
      menu_show: true,
      menu_name: '',
      userName: '',
      isBiTag: 0,
      isEntTag: 0,
      activeLeft: 198,
      tags: 1,
      loginOut: false,
      isShowUl: false,
      isShowEnt: false,
      namespaceCode: window.localStorage.getItem('namespace_code'),
      spaceName: '', // 命名空间名字
      showSelectBox: false, // 展示选择命名空间的选择框
      showBox: false
    }
  },
  inject: ['reloadRouterAlive'],
  methods: {
    goDashboard () {
      this.$router.push({name: 'index'})
    },
    changeNamespace (val) {
      this.showBox = val
    },
    show_menu (menuName) {
      this.$emit('show_menu', true)
      this.menu_show = true
      if (menuName) {
        this.menu_name = menuName
      }
    },
    mouseenter (tag) {
      this.isEntTag = tag
      this.isShowEnt = !this.isShowEnt
      this.activeLeft = 198 + 116 * (tag - 1)
    },
    mouseleave () {
      this.activeLeft = 198 + 116 * (this.isBiTag - 1)
      this.isShowUl = false
      this.isShowEnt = false
    },
    // 登出点击
    goOut () {
      this.loginOut = !this.loginOut
    },
    mouseenterout () {
      this.loginOut = true
      // pick 添加了mouseleave 方法， 不需要hide 了
      // this.$refs.datePick.hide()
    },
    mouseleaveout () {
      if (!this.showBox) this.loginOut = false
    },
    switchTab: function (_router) {
      switch (_router) {
        case 'configure':
          this.isBiTag = 5
          this.mouseleave()
          break
        case 'index':
          this.isBiTag = 1
          this.mouseleave()
          break
        case 'gateway':
          this.isBiTag = 2
          this.mouseleave()
          break
        case 'monitor':
          this.isBiTag = 4
          this.mouseleave()
          break
        case 'serviceList':
          this.isBiTag = 3
          this.mouseleave()
          break
        case 'permission':
          this.isBiTag = 6
          this.mouseleave()
          break
        default:
          break
      }
    },
    goChildPage (name) {
      var loc = window.location.href.substring(
        0,
        window.location.href.indexOf('views')
      )
      window.location.href = loc + name
    },
    handleCommand () {
      // Cookies.remove('NXDF_TOKEN')
      let url = window.location.protocol + '//' + window.location.host
      window.location = url
    },
    replaceNameSpace () {
      this.showSelectBox = true
    },
    onSure () {
      this.showSelectBox = false
      if (this.namespaceCode === this.form.namespaceCode) return
      this.getSpaceName()
      // this.$router.push({name: 'index', path: 'index/index'})
      this.reloadRouterAlive()
    },
    onCancle () {
      this.showSelectBox = false
    },
    getSpaceName () {
      const name = this.namespaces.find(item => item.namespace_code === this.form.namespaceCode)
      if (name) {
        this.spaceName = name.name
        this.namespaceCode = name.namespace_code
        window.localStorage.setItem('namespace_code', this.namespaceCode)
      }
    }
  },
  mounted () {
    this.getSpaceName()
  },
  created: function () {
    try {
      this.namespaces = JSON.parse(window.localStorage.getItem('namespaces'))
    } catch (err) {
    }
    this.menu_name = this.$route.matched[0].meta.title
    this.userName = this.$store.state.userName
    let _router = this.$route.path.split('/')[1]
    this.switchTab(_router)
  },
  watch: {
    $route (val, old) {
      this.$refs.datePick.routeChange(val)
      let _router = this.$route.path.split('/')[1]
      this.menu_name = this.$route.matched[0].meta.title
      this.switchTab(_router)
    }
  },
  components: {
    datePick
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
</style>
