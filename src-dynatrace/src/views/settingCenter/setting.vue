<template>
  <div>
    <stepper :stepper="stepper" @goRouter="goRouter" theme="gray"></stepper>
    <!-- <div class="content p24l0 flex">
      <DYLeftMenuSecond class="left-content" :leftMenu="left_menu" v-on:currentPage="setCurrentPage"></DYLeftMenuSecond>
      <div class="right-content p10">
        <router-view></router-view>
      </div>
    </div> -->
    <DYLayout class="pt24 pr24 pb24">
      <template slot="left">
        <DYLeftMenuSecond class="left-content" :leftMenu="left_menu" v-on:currentPage="setCurrentPage"></DYLeftMenuSecond>
      </template>
      <template slot="content">
        <DYCard class="overflow-x-hidden">
          <router-view></router-view>
        </DYCard>
      </template>
    </DYLayout>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
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
                permission: 'roleList',
                code: 'roleList'
              }, {
                code: 'singleSignOn',
                permission: 'singleSignOn',
                name: '单点登录'
              }, {
                code: 'userPermissions',
                permission: 'userPermissions',
                name: '用户权限'
              }
            ]
          }, {
            name: '分析预警',
            open: false,
            children: [
              {
                name: '日志设置',
                permission: 'logSetting',
                code: 'logSetting'
              }, {
                name: '预警策略',
                permission: 'warningStrategy',
                code: 'warningStrategy'
              }, {
                code: 'healthIndex',
                permission: 'healthIndex',
                name: '健康水平'
              }
            ]
          }, {
            name: '服务治理',
            open: false,
            children: [
              {
                name: '熔断规则',
                permission: 'fuseGroup',
                code: 'fuseGroup'
              }, {
                name: '健康规则',
                permission: 'healthRule',
                code: 'healthRule'
              }, {
                code: 'tag',
                permission: 'tag',
                name: '标签'
              }, {
                name: '配置模板',
                permission: 'configTemplate',
                code: 'configTemplate'
              }
            ]
          }, {
            name: '首选项',
            open: false,
            children: [
              {
                code: 'nameSpace',
                permission: 'namespaceList',
                name: '命名空间'
              }, {
                name: '服务供应商',
                permission: 'serviceProvider',
                code: 'serviceProvider'
              }, {
                name: '资源列表',
                permission: 'sourceList',
                code: 'sourceList'
              }, {
                name: '用户列表',
                permission: 'userList',
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
      let superUser = this.$store.getters.superuser
      this.left_menu.menuList.forEach(item => {
        let arr = []
        if (item.children && item.children.length > 0) {
          item.children.forEach(items => {
            items.isHide = accessRoutes.indexOf(items.permission) === -1 && !superUser

            if (!items.isHide) arr.push(items)
          })

          if (item.children.find(itemCode => !itemCode.isHide) === undefined) item.isHide = true

          let obj

          try {
            if (code) {
              obj = item.children.find(itemCode => itemCode.code === code)
              if (obj.isHide && arr.length > 0) {
                ({obj} = arr)
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
    stepper
  }
}
</script>
