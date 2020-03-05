<template>
  <div class="leftmenu">
    <div class="dtl-i navmenu">
      <div class="dtl-d">
        <a @click="goDashboard" class="dtl-f flex-center">
          <img src="../../../static/img/logo_mini.png" alt="">
        </a>
        <span class="dql-a dql-l dtl-a" @click.stop="hide_menu()">
          <img src="~@/assets/image/dynatrace/icon_menu_left.svg" alt="" />
        </span>
      </div>
      <div class="dtl-c">
        <div id="menuContent">
          <div class="dtl-b"></div>
          <div class="dtl-h" v-for="(item, index) in menu_list" :key="index">
            <span class="dtl-j" :class="[item.children&&item.children.length?'':'dtl-e']" @click="goViews(item)">{{item.title}}</span>
            <a class="dtl-e" v-for="(child_item, index1) in item.children" :key="index1" @click="goViews(child_item)">{{child_item.title}}</a>
          </div>
        </div>
        <img :class="[bottomLogoPostion ? 'logoBottom01' : 'logoBottom02']" src="~@/assets/image/logo_bottom.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showmenu: true,
      current_name: '',
      current_child_name: '',
      menu_list: [],
      screenHeight: document.documentElement.clientHeight, //屏幕高度
      bottomLogoPostion: true
    }
  },
  watch:{
    'screenHeight' (val) {
      this.setLogoDisplay(val)
    }
  },
  methods: {
    setLogoDisplay (val) {
      let menuContent = document.getElementById('menuContent')
      let menuHeight = parseInt(window.getComputedStyle(menuContent).height)
      if (val > menuHeight + 100) {
        this.bottomLogoPostion = true
      } else {
        this.bottomLogoPostion = false
      }
    },
    goDashboard () {
      this.$router.push({name: 'index'})
    },
    hide_menu () {
      this.$emit('show_menu', false)
      this.showmenu = false
    },
    goViews (item) {
      window.document.title = item.title
      if (!!item.name && !item.children) {
        this.$emit('show_menu', true, this.current_name)
        this.$forceUpdate()
        this.$router.push({ name: item.name })
      }
    }
  },
  mounted () {
    let that = this;
    window.onresize = function () { // 定义窗口大小变更通知事件
      that.screenHeight = document.documentElement.clientHeight //窗口高度
    }
    this.setLogoDisplay(that.screenHeight)
  },
  created () {
    let menuList = JSON.parse(JSON.stringify(this.$store.getters.access_menus))
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
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

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
