<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper
          :stepper="stepper"
          @goRouter="goRouter"
        ></stepper>
      <div class="content flex">
        <div class="left-content">
          <div class="side-title">服务治理</div>
          <div class="side-nav-title" v-for="(item, index) in sideList" :key="index" :class="{'side-nav-active': item.active, 'side-nav-disable': item.locked}" @click="clickSide(item)">{{item.name}}</div>
        </div>
        <DYCard class="overflow-x-hidden">
          <router-view></router-view>
        </DYCard>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import routerRules from 'views/serviceGovernance/serviceDetail/serviceDetailGovernance/routerRules/routerRules.vue'
import authentication from 'views/serviceGovernance/serviceDetail/serviceDetailGovernance/authentication/authentication.vue'
import faultInjection from 'views/serviceGovernance/serviceDetail/serviceDetailGovernance/faultInjection/faultInjectionList.vue'
export default {
  data () {
    return {
      isShowComponent: 'routerRules',
      detailData: {}, // 默认数据
      sideList: [
        {
          name: '服务路由',
          code: 'routerRules',
          active: true
        },
        {
          name: '服务鉴权',
          code: 'authentication',
          active: false
        },
        {
          name: '故障注入',
          code: 'faultInjection',
          active: false
        }
      ],
      stepper: [
        {
          name: '服务列表',
          routerTo: 'serviceList'
        },
        {
          name: '',
          routerTo: 'serviceDetail',
          myCustomRouter: true
        },
        {
          name: '服务治理',
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
        type: 'edit'
      }
      this.$set(this.stepper, 3, stapObj)
      switch (obj.code) {
        case 'routerRules':
          // 消息列队
          this.$router.push({name: 'routerRules', params: {detailData: this.detailData}})
          break
        case 'authentication':
          // 消息列队
          this.$router.push({name: 'authentication', params: {detailData: this.detailData}})
          break
        case 'faultInjection':
          // 消息列队
          this.$router.push({name: 'faultInjection', params: {detailData: this.detailData}})
          break
        default:
          break
      }
    }
  },
  mounted () {
    this.$set(this.stepper, 3, {
      name: this.sideList[0].name,
      routerTo: '',
      type: 'edit'
    })
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.$set(this.stepper[1], 'name', this.detailData.name)
    }
    if (this.$route.params && this.$route.params.showComponent) {
      this.showComponent = this.$route.params.showComponent
      this.clickSide(this.showComponent)
    }
  },
  components: {
    stepper,
    routerRules,
    faultInjection,
    authentication
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
          font-weight: 500;
          color: @default-font-color;
        }
        .side-nav-title {
          cursor: pointer;
          height: 60px;
          padding-left: 24px;
          line-height: 60px;
          font-size: 15px;
          font-weight: 500;
          color: @default-font-color;
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
        }
      }
    }
  }
}
</style>
