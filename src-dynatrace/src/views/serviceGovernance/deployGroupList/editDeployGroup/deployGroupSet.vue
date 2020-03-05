<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper
          :stepper="stepper"
          theme="blue"
          @goRouter="goRouter"
        ></stepper>
      <div class="content flex">
        <div class="left-content">
          <div class="side-title">部署组设置</div>
          <div class="side-nav-title" v-if="!item.isHide" v-for="(item, index) in sideList" :key="index" :class="{'side-nav-active': item.active, 'side-nav-disable': item.locked}" @click="clickSide(item)">{{item.name}}</div>
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
import baseMessage from 'views/serviceGovernance/deployGroupList/editDeployGroup/deployBaseMessage.vue'

export default {
  data () {
    return {
      isShowComponent: 'deployBaseMessage',
      detailData: {}, // 默认数据
      sideList: [
        {
          name: '基本信息',
          code: 'deployBaseMessage',
          active: true
        }
      ],
      stepper: [
        {
          name: '部署组',
          routerTo: 'deployGroupList'
        }, {
          name: '',
          routerTo: 'deployGroupDetail',
          myCoutomRouter: true
        }, {
          name: '设置',
          routerTo: '',
          type: 'edit'
        }, {
          name: '基本信息',
          routerTo: ''
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
        case 'deployBaseMessage':
          // 基本信息
          this.$router.push({name: 'deployBaseMessage', params: {detailData: this.detailData}})
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
      this.showComponent = this.$route.params.showComponent
      this.clickSide(this.showComponent)
    }
  },
  components: {
    stepper,
    baseMessage
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
          color: @default-font-color;
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
