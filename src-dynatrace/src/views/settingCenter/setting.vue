<template>
  <div>
    <stepper :stepper="stepper" @goRouter="goRouter" theme="gray"></stepper>
    <div class="content p24l0 flex">
      <leftmenu class="left-content" :leftMenu="left_menu" v-on:currentPage="setCurrentPage"></leftmenu>
      <div class="right-content p10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import leftmenu from 'components/navigation/leftmenuSecond.vue'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      stepper: [
        {
          name: '设置'
        },
        {
          name: ''
        },
        {
          name: ''
        }
      ],
      left_menu: {
        name: '设置',
        menuList: [
          {
            name: '用户权限',
            open: false,
            children: [
              {
                name: '角色列表',
                primission: 'roleList',
                code: 'roleList'
              }, {
                code: 'singleSignOn',
                primission: 'singleSignOn',
                name: '单点登录'
              }, {
                code: 'userPermissions',
                primission: 'userPermissions',
                name: '用户权限'
              }
            ]
          }, {
            name: '分析预警',
            open: false,
            children: [
              {
                name: '日志设置',
                primission: 'logSetting',
                code: 'logSetting'
              }, {
                name: '预警策略',
                primission: 'warningStrategy',
                code: 'warningStrategy'
              }, {
                code: 'healthIndex',
                primission: 'healthIndex',
                name: '健康水平'
              }
            ]
          }, {
            name: '服务治理',
            open: false,
            children: [
              {
                name: '熔断规则',
                primission: 'fuseGroup',
                code: 'fuseGroup'
              }, {
                name: '健康规则',
                primission: 'healthRule',
                code: 'healthRule'
              }, {
                code: 'tag',
                primission: 'tag',
                name: '标签'
              }, {
                name: '配置模板',
                primission: 'configTemplate',
                code: 'configTemplate'
              }
            ]
          }, {
            name: '首选项',
            open: false,
            children: [
              {
                code: 'nameSpace',
                primission: 'namespaceList',
                name: '命名空间'
              }, {
                name: '服务供应商',
                primission: 'serviceProvider',
                code: 'serviceProvider'
              }, {
                name: '资源列表',
                primission: 'sourceList',
                code: 'sourceList'
              }, {
                name: '用户列表',
                primission: 'userList',
                code: 'userList'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {},
  methods: {
    goRouter (item) {
      this.$router.push({name: item.routerTo})

      // 添加截取起始、长度字段，以及回调
      this.stepper.splice(item.spliceStart || 3, item.spliceLength || 1)
    },
    setCurrentPage (code) {
      this.falt(code)
      if (code) this.$router.push({name: code})
    },
    falt (code) {
      let accessRoutes = this.$store.getters.access_routes
      let superuser = this.$store.getters.superuser
      this.left_menu.menuList.forEach(item => {
        let arr = []
        if (item.children && item.children.length > 0) {
          item.children.forEach(items => {
            items.isHide = false
            if (accessRoutes.indexOf(items.primission) === -1 && !superuser) {
              items.isHide = true
            }
            if (!items.isHide) arr.push(items)
          })

          if (item.children.find(itemCode => !itemCode.isHide) === undefined) item.isHide = true
          let obj
          try {
            if (code) {
              obj = item.children.find(itemCode => itemCode.code === code)
              if (obj.isHide && arr.length > 0) {
                obj = arr[0]
              }
            }
          } catch (err) { console.log('err', err) }
          if (obj && obj.name) {
            this.$set(this.stepper[1], 'name', item.name)
            this.$set(this.stepper[2], 'name', obj.name)
            this.$set(this.stepper[2], 'routerTo', obj.code)
            // 添加点击角色列表后的回调
            this.$set(this.stepper[2], 'callBack', this.resetStepper)
            this.$router.push({name: obj.code})
          }
        }
      })
      this.stepper.splice(3, 1)
    },
    resetStepper () {
      // step 只保留前三个
      this.stepper.splice(3, this.stepper.length - 3)
    }
  },
  mounted () {
    if (this.$route.params.router_code) {
      this.setCurrentPage(this.$route.params.router_code)
    } else {
      this.falt('roleList')
    }
  },
  created () {
    bus.$on('addRouter', (item) => {
      if (item && item.length > 0) {
        // this.$set(this.stepper, 2, item[0])
        console.log('tag', this.stepper)
        this.stepper.push(...item)
      }
    })
  },
  destroyed () {
    bus.$off('addRouter')
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
