<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" @goRouter="goRouter"></stepper>
      <div class="content flex">
        <div class="left-content">
          <div class="side-title">接口设置</div>
          <div class="side-nav-title" v-if="!item.isHide" v-for="(item,index) in sideList" :key="index" :class="{'side-nav-active': item.active, 'side-nav-disable': item.locked}" @click="clickSide(item)">{{item.name}}</div>
        </div>
        <div class="right-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "~common/style/variable";
  .wrapper {
    .app-list {
      height: calc(100% - 30px);
      .content {
        width: 100%;
        height: 100%;
        padding: 24px 24px 23px 0;
        .left-content {
          width: 284px;
          flex-shrink:0;
          .side-title {
            padding: 20px 0 20px 24px;
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: @default-font-color;
          }
          .side-nav-title {
            cursor: pointer;
            height: 60px;
            padding-left: 24px;
            line-height: 60px;
            font-size: 15px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            &:hover {
              background: @theme-gray;
              color: @theme-color
            }
          }
          .side-nav-active {
            color: @theme-color;
            background: @theme-gray !important;
          }
          .side-nav-disable {
            color: rgba(204, 204, 204, 1);
          }
        }
        .right-content {
          background: #ffffff;
          display: inline-block;
          width: calc(100% - 284px);
        }
      }
    }
  }
</style>
<script>
import stepper from 'components/stepper/stepper.vue'
import routeRule from 'views/gatewayCenter/api/apiDetail/routeRule/routeRule.vue'

export default {
  data () {
    return {
      isShowComponent: '',
      detailData: false,
      sideList: [
        {
          name: '基本信息',
          code: 'apiBaseInfo',
          active: false
        },
        {
          name: '路由规则',
          code: 'routeRule',
          active: false
        }
      ],
      stepper: [
        {
          name: '接口',
          routerTo: 'apiList'
        }, {
          name: '',
          routerTo: 'apiDetail',
          myCoutomRouter: true
        }, {
          name: '设置',
          type: 'edit'
        }
      ]
    }
  },
  computed: {},
  methods: {
    goRouter (item) {
      this.$router.push({name: item.routerTo, params: this.detailData})
    },
    clickSide (obj) {
      this.sideList.forEach(item => {
        if (item.code === obj.code) {
          item.active = true
        } else {
          item.active = false
        }
      })
      this.isShowComponent = obj.code
      const stapObj = {
        name: obj.name,
        routerTo: '',
        type: 'edit'
      }
      this.$set(this.stepper, 3, stapObj)
      switch (obj.code) {
        case 'apiBaseInfo':
          // 消息列队
          this.$router.push({name: 'apiBaseInfo', params: {detailData: this.detailData}})
          break
        case 'routeRule':
          // 消息列队
          this.$router.push({name: 'routeRule', params: {detailData: this.detailData}})
          break
        default:
          break
      }
    }
  },
  mounted () {},
  created () {
    let accessRoutes = this.$store.getters.access_routes
    let superuser = this.$store.getters.superuser
    this.sideList.forEach(items => {
      items.isHide = false
      if (accessRoutes.indexOf(items.code) === -1 && !superuser) {
        items.isHide = true
      }
    })
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.$set(this.stepper[1], 'name', this.detailData.name)
    }
    if (this.$route.params && this.$route.params.showComponent) {
      this.isShowComponent = this.$route.params.showComponent
      this.clickSide(this.isShowComponent)
    }
  },
  components: {
    stepper,
    routeRule
  }
}
</script>
