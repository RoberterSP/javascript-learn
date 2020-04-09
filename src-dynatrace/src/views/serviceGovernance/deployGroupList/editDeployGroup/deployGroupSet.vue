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
        <DYCard class="overflow-x-hidden">
          <router-view></router-view>
        </DYCard>
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
          myCustomRouter: true
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
        item.active = item.code === obj.code
      })
      this.isShowComponent = obj.code
      const stapObj = {
        name: obj.name,
        routerTo: '',
        type: 'edit'
      }
      this.$set(this.stepper, 3, stapObj)
      if (obj.code === 'deployBaseMessage') {
        this.$router.push({name: 'deployBaseMessage', params: {detailData: this.detailData}})
      } else {

      }
    }
  },
  mounted () {},
  created () {
    let accessRoutes = this.$store.getters.access_routes
    let superUser = this.$store.getters.superuser
    this.sideList.forEach(items => {
      items.isHide = accessRoutes.indexOf(items.code) === -1 && !superUser
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
