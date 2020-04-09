<template>
  <div class="app" ref="app" :style="{minHeight: height + 'px'}">
    <DYLayout :class="[open_menu ? 'is_open_menu' : '']">
      <template slot="up">
        <sidebar @show_menu="show_menu"></sidebar>
      </template>
      <template slot="left">
        <div :style="{width: open_menu ? '236px' : ''}">
          <DYLeftMenu v-show="open_menu" @show_menu="show_menu"></DYLeftMenu>
        </div>
      </template>
      <template slot="content">
        <router-view class="main-content" ref="contents" :style="{minHeight: height + 'px'}"></router-view>
      </template>
    </DYLayout>
  </div>
</template>
<script>
import Store from '@/store'
import sidebar from '@/components/navigation/sidebar.vue'

export default {
  data () {
    return {
      height: '',
      open_menu: true
    }
  },
  mounted () {
    this.height = document.documentElement.clientHeight
  },
  methods: {
    show_menu (bol) {
      this.open_menu = bol
      Store.dispatch('setMenuState', bol)
    }
  },
  components: {
    sidebar
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";

.main-content {
  padding-top: 44px;
  background-color: @gray-02;
}
.app{
  min-width: 1280px;
}

</style>
