<template>
  <div class="dy-leftmenu">
    <div class="dtl-i navmenu">
      <div class="dtl-d">
        <a @click="goDashboard" class="dtl-f flex-center">
          <img src="static/img/logo_mini.png" alt="">
        </a>
        <span class="dql-a dql-l dtl-a" @click.stop="hide_menu()">
          <img src="~@/assets/image/dynatrace/icon_menu_left.svg" alt=""/>
        </span>
      </div>
      <div class="dtl-c">
        <div id="menuContent">
          <div class="dtl-b"></div>
          <div class="dtl-h" v-for="(item, index) in menu_list" :key="index">

            <!-- 如果存在二级菜单 -->
            <template v-if="item.children && item.children.length">
              <span class="dtl-j">{{item.title}}</span>
            </template>

            <template v-else>
              <router-link
                class="dtl-j dtl-e"
                :to="{name: item.name}"
                v-slot="{isActive, href}">

                <span :href="href" @click="goViews(item, isActive)">{{ item.title }}</span>
              </router-link>
            </template>

            <!-- 渲染二级菜单 -->
            <router-link
              class="dtl-e"
              v-for="(child_item, index1) in item.children"
              :key="'menu-' + index1"
              :to="{name: child_item.name}"
              v-slot="{isActive, href}">

              <span :href="href" :class="{'router-link-active' : isActive}" @click="goViews(child_item, isActive)">{{child_item.title}}</span>

            </router-link>
          </div>
        </div>
        <img :class="[bottomLogoPostion ? 'logoBottom01' : 'logoBottom02']" src="~@/assets/image/logo_bottom.png"
             alt="">
      </div>
    </div>
  </div>
</template>
<script>
import {clone} from 'lodash'

export default {
  name: 'DYLeftMenu',
  data () {
    return {
      showmenu: true,
      current_name: '',
      current_child_name: '',
      menu_list: [],
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
      bottomLogoPostion: true
    }
  },
  watch: {
    screenHeight (val) {
      this.setLogoDisplay(val)
    }
  },
  methods: {
    setLogoDisplay (val) {
      let menuContent = document.getElementById('menuContent')
      let menuHeight = parseInt(window.getComputedStyle(menuContent).height)

      this.bottomLogoPostion = val > menuHeight + 100
    },
    goDashboard () {
      this.$router.push({name: 'index'})
    },
    hide_menu () {
      this.$emit('show_menu', false)
      this.showmenu = false
    },
    goViews (item, isActive) {
      if (isActive) return

      window.document.title = item.title

      if (!!item.name && !item.children) {
        this.$emit('show_menu', true, this.current_name)
        this.$forceUpdate()

        this.$router.push({name: item.name})
      }
    }
  },
  mounted () {
    let menuList = clone(this.$store.getters.access_menus)

    menuList.forEach(data => {
      data.isShow = true
      if (data.children) {
        data.children.forEach(menu => {
          menu.isShow = true
        })
      }
    })
    menuList.unshift({
      title: '数据看板',
      name: 'index',
      isShow: true
    })
    this.menu_list = menuList

    window.onresize = () => { // 定义窗口大小变更通知事件
      this.screenHeight = document.documentElement.clientHeight // 窗口高度
    }
    this.setLogoDisplay(this.screenHeight)
  },
  created () {
  },
  components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

  .dy-leftmenu {
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 1004;

    .dtl-i {
      height: 100%;
      // position: fixed;
      // left: -236px;
      // top: 0;
      // bottom: 0;
      // z-index: 16;
      z-index: 1003;
      width: 236px;
      background-color: #525252;
      box-sizing: border-box;
      touch-action: pan-x pan-y;
      -ms-touch-action: pan-x pan-y;
      display: flex;
      display: -webkit-flex;
      display: -ms-flexbox;
      flex-direction: column;
      -ms-flex-direction: column;
      -webkit-flex-direction: column;
      -webkit-transition: left 120ms ease-out;
      transition: left 120ms ease-out;
    }

    .dtl-d {
      height: 44px;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;

      .dtl-f {
        position: relative;
        cursor: pointer;
        color: white;
        height: 44px;
        font-size: 20px;
        line-height: 49px;
        overflow: hidden;
        flex-grow: 1;
        flex-shrink: 0;

        img {
          width: 137px;
          height: 16px;
        }
      }

      .dql-a {
        cursor: pointer;
        display: inline-flex;
        width: 44px;
        height: 44px;
        background-color: transparent;
      }

      .dql-l {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;

        & > img {
          width: 20px;
          height: 20px;
        }

        img {
          width: 20px;
          height: 20px;
        }
      }
    }

    .dtl-c {
      flex-grow: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      .dtl-h {
        margin-top: 15px;

        .dtl-j {
          display: block;
          color: #b7b7b7;
          padding: 0 20px;
          font-size: 12px;
          line-height: 32px;
        }

        .dtl-e:hover,
        .dtl-e.router-link-active {
          background-color: #454646;
        }

        .dtl-e, .dtl-e:hover, .dtl-e:visited {
          display: block;
          color: white;
          cursor: pointer;
          padding: 0 20px;
          font-size: 14px;
          line-height: 32px;
          text-decoration: none;
        }
      }

      .dtl-b {
        margin-bottom: 16px;
      }
    }
  }

  .logoBottom01 {
    position: absolute;
    width: 99px;
    left: 60px;
    bottom: 35px;
  }

  .logoBottom02 {
    width: 99px;
    margin-top: 60px;
    margin-left: 60px;
    margin-bottom: 35px;
  }
</style>
