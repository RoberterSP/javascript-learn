<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" @goRouter="goRouter"></stepper>
      <div class="content flex">
        <div class="left-content">
          <h1 class="side-title">应用设置</h1>
          <div class="side-nav-title" v-if="!item.isHide" v-for="(item,index) in sideList" :key="index" :class="{'side-nav-active': (item.active && !item.lock), 'side-nav-disable': item.lock}" @click="clickSide(item)">{{item.name}}</div>
        </div>
        <DYCard class="full-width overflow-x-hidden">
          <router-view></router-view>
        </DYCard>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import baseInfo from 'views/gatewayCenter/app/appdetail/baseInfo/baseInfo.vue'
import apiFilter from 'views/gatewayCenter/app/appdetail/apiFilter/apiFilter.vue'
import apiGroup from 'views/gatewayCenter/app/appdetail/apiGroup/apiGroup.vue'
import eventSubscribe from 'views/gatewayCenter/app/appdetail/eventSubscribe/eventSubscribe.vue'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      isShowComponent: 'baseInfo',
      detailData: {}, // 默认数据
      sideList: [
        {
          name: '基本信息',
          code: 'baseInfo',
          active: false,
          lock: false
        }, {
          name: '接口组',
          code: 'apiGroup',
          active: false,
          lock: false
        }, {
          name: '接口过滤',
          code: 'apiFilter',
          active: false,
          lock: false
        }, {
          name: '事件订阅',
          code: 'appEventSubscribe',
          active: false,
          lock: false
        }
      ],
      stepper: [
        {
          name: '应用列表',
          routerTo: 'appList'
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
        let {active} = item
        item.active = false
        if (item.code === obj.code) item.active = !active
      })
      this.isShowComponent = obj.code
      if (this.$route.params && this.$route.params.detailData.id) {
        const stapObj = {
          name: obj.name,
          routerTo: '',
          type: 'edit'
        }
        this.$set(this.stepper, 3, stapObj)
      }
      switch (obj.code) {
        case 'baseInfo':
          // 基本信息
          this.$router.push({name: 'baseInfo', params: {detailData: this.detailData}})
          break
        case 'apiFilter':
          // 接口组
          this.$router.push({name: 'apiFilter', params: {detailData: this.detailData}})
          break
        case 'apiGroup':
          // 接口过滤
          this.$router.push({name: 'apiGroup', params: {detailData: this.detailData}})
          break
        case 'appEventSubscribe':
          // 事件订阅
          this.$router.push({name: 'appEventSubscribe', params: {detailData: this.detailData}})
          break
        default:
          break
      }
    },

    computeStep () {
      let params = {
        name: this.detailData.name,
        routerTo: 'appDetail',
        myCustomRouter: true
      }
      this.stepper.splice(1, 1, params)
    }
  },
  mounted () {
  },
  created () {
    let accessRoutes = this.$store.getters.access_routes
    let superUser = this.$store.getters.superuser
    this.sideList.forEach(items => {
      items.isHide = false
      if (accessRoutes.indexOf(items.code) === -1 && !superUser) {
        items.isHide = true
      }
    })
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.computeStep()
    } else {
      this.sideList.forEach(item => {
        item.lock = item.code !== 'baseInfo'
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
    bus.$on('appCreate', (info) => {
      this.$nextTick(() => {
        // 创建成功后，为 detail 赋值
        this.detailData = info
        // 并重新计算 step
        this.computeStep()
      })
      this.sideList.forEach((item, idx) => {
        this.$set(item, 'lock', false)
        // item.lock = false
      })
    })
  },
  beforeDestroy () {
    console.log('destroy')
    bus.$off('appCreate')
  },
  components: {
    stepper,
    eventSubscribe,
    baseInfo,
    apiFilter,
    apiGroup
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
        }
        .side-nav-title {
          cursor: pointer;
          height: 60px;
          padding-left: 24px;
          line-height: 60px;
          font-size: 15px;
          font-weight: 500;

          &:hover {
            background: @gray-03;
            color: @turq-06
          }
        }
        .side-nav-active {
          color: @turq-06;
          background: @gray-03 !important;
        }
        .side-nav-disable {
          color: rgba(204, 204, 204, 1);
          &:hover {
            color: rgba(204, 204, 204, 1);
            background: @gray-02;
          }
        }
      }
    }
  }
}
</style>
