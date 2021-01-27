<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" @goRouter="goRouter"></stepper>
      <div class="content flex">
        <div class="left-content">
          <div class="side-title">功能扩展</div>
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
import deadMessage from 'views/serviceGovernance/serviceDetail/functionExtend/deadMessageList/deadMessageList.vue'
import messageQueue from 'views/serviceGovernance/serviceDetail/functionExtend/messageQueue/messageQueueList.vue'
import taskList from 'views/serviceGovernance/serviceDetail/functionExtend/taskList/taskList.vue'

export default {
  data () {
    return {
      isShowComponent: 'messageQueueList',
      detailData: {}, // 默认数据
      sideList: [
        {
          name: '消息队列',
          code: 'messageQueueList',
          active: true
        },
        {
          name: '死信队列',
          code: 'deadMessageList',
          active: false
        },
        {
          name: '计划任务',
          code: 'taskList',
          active: false
        }
      ],
      stepper: [
        {
          name: '服务列表',
          routerTo: 'serviceList'
        }, {
          name: '',
          routerTo: 'serviceDetail',
          myCustomRouter: true
        }, {
          name: '功能扩展',
          routerTo: '',
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
        case 'deadMessageList':
          // 消息列队
          this.$router.push({name: 'deadMessageList', params: {detailData: this.detailData}})
          break
        case 'messageQueueList':
          // 消息列队
          this.$router.push({name: 'messageQueueList', params: {detailData: this.detailData}})
          break
        case 'taskList':
          // 消息列队
          this.$router.push({name: 'taskList', params: {detailData: this.detailData}})
          break
        default:
          break
      }
    }
  },
  mounted () {},
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
    deadMessage,
    messageQueue,
    taskList
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
        }
      }
    }
  }
}
</style>
