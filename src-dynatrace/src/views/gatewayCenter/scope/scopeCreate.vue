<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" @goRouter="goRouter"></stepper>
      <div class="content flex">
        <div class="left-content">
          <div class="side-title">接口组设置</div>
          <div class="side-nav-title" v-if="!item.isHide" v-for="(item,index) in sideList" :key="index" :class="{'side-nav-active': (item.active && !item.lock), 'side-nav-disable': item.lock}" @click="clickSide(item)">{{item.name}}</div>
        </div>
        <div class="right-content p10">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import baseInfo from 'views/gatewayCenter/scope/scopedetail/baseInfo/baseInfo.vue'
import scopeGroup from 'views/gatewayCenter/scope/scopedetail/scopeGroup/scopeGroup.vue'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      detailData: {},
      isShowComponent: 'scopeBaseInfo',
      sideList: [
        {
          name: '基本信息',
          code: 'scopeBaseInfo',
          active: false,
          lock: false
        },
        {
          name: '添加接口',
          code: 'scopeGroup',
          active: false,
          lock: false
        }
      ],
      stepper: [
        {
          name: '接口组',
          routerTo: 'scopeList'
        },
        {
          name: '创建',
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
      if (obj.lock) return
      this.sideList.forEach(item => {
        let active = item.active
        item.active = false
        if (item.code === obj.code) item.active = !active
      })
      this.isShowComponent = obj.code
      if (this.$route.params && this.$route.params.detailData) {
        const stapObj = {
          name: obj.name,
          routerTo: '',
          type: 'edit'
        }
        this.$set(this.stepper, 3, stapObj)
      }
      switch (obj.code) {
        case 'scopeBaseInfo':
          // 基本信息
          this.$router.push({name: 'scopeBaseInfo', params: {detailData: this.detailData}})
          break
        case 'scopeGroup':
          // 接口组
          this.$router.push({name: 'scopeGroup', params: {detailData: this.detailData}})
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
      let params = {
        name: this.detailData.name,
        routerTo: 'scopeDetail',
        myCoutomRouter: true
      }
      this.stepper.splice(1, 1, params)
    } else {
      this.sideList.forEach(item => {
        item.lock = false
        if (item.code !== 'scopeBaseInfo') item.lock = true
      })
    }
    this.stepper.push({
      name: '设置',
      routerTo: '',
      type: 'edit'
    })
    if (this.$route.params && this.$route.params.showComponent) {
      this.showComponent = this.$route.params.showComponent
      this.stepper.push({
        name: this.showComponent.name,
        routerTo: '',
        type: 'edit'
      })
      this.clickSide(this.showComponent)
    }
    bus.$on('scopeCreate', (info) => {
      this.$nextTick(() => {
        // 创建成功后，为 detail 赋值
        this.detailData = info
        // 并重新计算 step
        let params = {
          name: this.detailData.name,
          routerTo: 'scopeDetail',
          myCoutomRouter: true
        }
        this.stepper.splice(1, 1, params)
      })
      this.sideList.forEach((item, idx) => {
        this.$set(item, 'lock', false)
        // item.lock = false
      })
    })
  },
  beforeDestroy () {
    bus.$off('scopeCreate')
  },
  components: {
    stepper,
    baseInfo,
    scopeGroup
  }
}
</script>
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
          &:hover {
            color: rgba(204, 204, 204, 1);
            background: @default-gray;
          }
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
