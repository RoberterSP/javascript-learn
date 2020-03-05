<template>
  <div>
    <stepper :stepper="stepper" @goRouter="goRouter" :theme="theme"></stepper>
    <div class="content p24l0 flex">
      <leftmenu ref="leftmenu" class="left-content" :leftMenu="left_menu" v-on:currentPage="setCurrentPage"></leftmenu>
      <div class="right-content p10">
        <router-view :stepper.sync="stepper"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import leftmenu from 'components/navigation/leftmenuSecond.vue'
export default {
  data () {
    return {
      theme: 'blue',
      isShowComponent: 'serviceNode',
      stepper: [
        {
          name: '服务列表',
          routerTo: 'serviceList'
        },
        {
          name: '',
          routerTo: 'serviceDetail',
          myCoutomRouter: true
        },
        {
          name: '',
          type: 'edit'
        }
      ],
      left_menu: {
        name: '设置',
        menuList: [
          {
            name: '基本信息',
            open: false,
            children: [
              {
                name: '节点',
                code: 'serviceNode'
              }, {
                name: '部署组',
                code: 'deploymentGroup'
              }, {
                name: '服务接口',
                code: 'serviceApi'
              }, {
                name: '订阅事件',
                code: 'eventSubscribe'
              }
            ]
          }, {
            name: '服务治理',
            open: false,
            children: [
              {
                name: '服务路由',
                code: 'routerRules'
              }, {
                name: '服务鉴权',
                code: 'authentication'
              }, {
                name: '故障注入',
                code: 'faultInjection'
              }
            ]
          }, {
            name: '功能扩展',
            open: false,
            children: [
              {
                name: '消息队列',
                code: 'messageQueueList'
              }, {
                name: '死信队列',
                code: 'deadMessageList'
              }, {
                name: '计划任务',
                code: 'taskList'
              }
            ]
          }
        ]
      },
      detailData: {}
    }
  },
  computed: {},
  methods: {
    goRouter (item) {
      // 优先执行回调
      if (item.goRouter) {
        item.goRouter()
      } else {
        this.$router.push({name: item.routerTo, params: this.detailData, stepper: this.stepper})
      }
    },
    setCurrentPage (code) {
      this.$set(this.stepper[1], 'name', this.detailData.name)
      this.falt(code)
      this.$router.push({
        name: code,
        params: { detailData: this.detailData, stepper: this.stepper }
      })
    },

    falt (code, setStep = true, setOpen = false) {
      if (setOpen) {
        this.$set(this.left_menu.menuList[0], 'open', true)
      }
      let accessRoutes = this.$store.getters.access_routes
      let superuser = this.$store.getters.superuser
      this.left_menu.menuList.forEach((item, pidx) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(items => {
            items.isHide = false
            if (accessRoutes.indexOf(items.code) === -1 && !superuser) {
              items.isHide = true
            }
          })
          if (item.children.find(itemCode => !itemCode.isHide) === undefined) item.isHide = true
          let obj = item.children.find(itemCode => itemCode.code === code)
          let idx = item.children.findIndex(itemCode => itemCode.code === code)
          if (obj && obj.name) {
            if (setStep && this.stepper[2]) {
              this.$set(this.stepper[2], 'name', obj.name)
              this.$set(this.stepper[2], 'routerTo', obj.code)
            }
            this.$refs.leftmenu.initMenu(idx, pidx, obj.code)
          }
        }
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.$set(this.stepper[1], 'name', this.$route.params.detailData.name)

      if (this.$route.params.showComponent) {
        this.$set(this.stepper[2], 'name', this.$route.params.showComponent.name)
        this.$set(this.left_menu.menuList[1], 'hide', !this.$route.params.showComponent.serGo)
        this.$set(this.left_menu.menuList[2], 'hide', !this.$route.params.showComponent.fcExt)
        this.falt(this.$route.params.showComponent.code, false, !!this.$route.params.showComponent.setFirstOpen)
      }
    } else {
      // go back
    }
  },
  created () {
  },
  components: {
    stepper,
    leftmenu
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.right-content {
  width: calc(100% - 238px);
  background:rgba(255,255,255,1);
}
</style>
