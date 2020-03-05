<template>
  <div class="app" ref="app" :style="{minHeight: height + 'px'}">
    <div :class="[open_menu?'is_open_menu':'']">
        <sidebar class="sidebar" @show_menu="show_menu"></sidebar>
        <leftmenu v-show="open_menu" @show_menu="show_menu"></leftmenu>
        <!-- <navigation class="navigation"></navigation> -->
        <router-view class="content" ref="contents" :style="{paddingLeft: open_menu ? '236px' : '', minHeight: height + 'px'}"></router-view>
    </div>
  </div>
</template>
<script>
import Store from '@/store'
import sidebar from '@/components/navigation/sidebar.vue'
import leftmenu from 'components/navigation/leftmenu.vue'
export default {
  data () {
    return {
      height: '',
      open_menu: true
    }
  },
  mounted () {
    var screabHeight = document.documentElement.clientHeight
    this.height = screabHeight
  },
  methods: {
    show_menu (bol) {
      this.open_menu = bol
      Store.dispatch('setMenuState', bol)
    }
  },
  components: {
    sidebar,
    leftmenu
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";

.content {
  padding-top: 44px;
  background-color: @default-gray;
}
.app{
  min-width: 1280px;
}

</style>
