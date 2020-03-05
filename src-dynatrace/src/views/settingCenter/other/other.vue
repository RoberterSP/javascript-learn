<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" theme="gray"></stepper>
      <div class="content flex">
        <div class="left-content">
          <div class="side-title">其它</div>
          <div class="side-nav-title" v-for="(item,index) in sideList" :key="index" :class="{'side-nav-active': item.active, 'side-nav-disable': !item.active}" @click="clickSide(item)">{{item.name}}</div>
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

export default {
  data () {
    return {
      isShowComponent: 'baseInfo',
      detailData: {}, // 默认数据
      sideList: [
        {
          name: 'Agent命令列表',
          code: 'agent',
          active: true
        },
        {
          name: 'Sidecar配置',
          code: 'sidecar',
          active: false
        }
      ],
      stepper: [
        {
          name: '其它',
          routerTo: 'other'
        }
      ]
    }
  },
  computed: {},
  methods: {
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
        routerTo: ''
      }
      this.$set(this.stepper, 1, stapObj)
      switch (obj.code) {
        case 'agent':
          // agent
          this.$router.push({name: 'agent'})
          break
        case 'sidecar':
          // sidecar
          this.$router.push({name: 'sidecar'})
          break
        default:
          break
      }
    }
  },
  mounted () {},
  created () {
    this.clickSide(this.sideList[0])
  },
  components: {
    stepper
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
        width: 238px;
        flex-shrink:0;
        .side-title {
          padding: 20px 0 20px 24px;
          font-size: 26px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: @default-font-color;
          line-height: 33px;
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
        // .side-nav-disable {
        //   color: rgba(204, 204, 204, 1);
        // }
      }
      .right-content {
        background: #ffffff;
        display: inline-block;
        width: calc(100% - 238px);
      }
    }
  }
}
</style>
