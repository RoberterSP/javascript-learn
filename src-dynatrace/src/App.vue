<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive && routerSateAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && routerSateAlive">
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  provide () {
    return {
      reloadRouterAlive: this.reload
    }
  },
  data () {
    return {
      routerSateAlive: true
    }
  },
  methods: {
    reload () {
      this.routerSateAlive = false
      this.$nextTick(() => {
        this.routerSateAlive = true
      })
    }
  },
  mounted () {
  }
}
</script>

<style>
#app {
  /* font-family: 'PingFang SC', 'Microsoft YaHei'; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
}
</style>
