<template>
  <div class="stepper-title" :class="['theme-' + theme]" :style="{minHeight: minHeight}">
    <div class="text">
      <message ref="message" @isChange="isChange"></message>
      <div class="flex-start" style="width: 100%;">
        <div
          v-for="(item,index) in stepperList"
          class="step-box"
          :style="{
            width: index === stepperList.length -1 ? '100%' : ''
          }"
          :key="index"
          :title="item.name"
          @click="goPage(item)">

          <template v-if="stepperList.length === 1">
              <div class="title-name end-text">
                {{item.name}}
              </div>
          </template>

          <template v-else>
            <div
              class="title-name"
              :style="{
                width: index === stepperList.length -1 ? '100%' : ''
              }"
              :class="{
                'first-text': (index < stepper.length -1 && !item.type && item.type !== 'edit') || (stepper.length === 1 && !item.type && item.type !== 'edit'),
                'end-text': !item.type && item.type !== 'edit' && index === stepper.length -1 && stepper.length !== 1 || item.endText,
                'edit-color-dark': (index < stepper.length -1 && item.type && item.type === 'edit') || (stepper.length === 1 && item.type && item.type === 'edit'),
                'edit-color-light': item.type && item.type === 'edit' && index === stepper.length -1 && stepper.length !== 1
              }">{{item.name}}
            </div>
            <div
              class="iconarrow_bc column-icon iconfont"
              v-show="index < stepper.length -1"
              :class="{
                'column-icon-dark': (index < stepper.length -1 && !item.type && item.type !== 'edit') || (stepper.length === 1 && !item.type && item.type !== 'edit'),
                'column-icon-light': !item.type && item.type !== 'edit' && index === stepper.length -1 && stepper.length !== 1 || item.endText,
                'column-icon-edit-dark': (index < stepper.length -1 && item.type && item.type === 'edit') || (stepper.length === 1 && item.type && item.type === 'edit'),
                'column-icon-edit-light': item.type && item.type === 'edit' && index === stepper.length -1 && stepper.length !== 1
              }"
            ></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*
传递的参数
stepper: [
  {
    name: '注册应用',
    routerTo: 'appList',
    myCoutomRouter: true
  }
]
@goRouter="goRouter"
goRouter (item) {
  this.$router.push({name: item.routerTo, params: this.detailData})
},
name: 显示的名字
routerTo: 跳转到某个页面的路由
myCoutomRouter: 自定义的路由,自己在父组件编写方法跳转 (方法: goRouter)
*/
import message from 'components/message/message.vue'

export default {
  data () {
    return {
      stepText: [],
      stepperList: [],
      minHeight: '30'
    }
  },
  props: {
    theme: {
      type: String,
      default: 'purple'
    },
    stepper: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  watch: {
    stepper (val) {
      if (val) {
        this.stepperList = val
        this.initStepper()
      }
    }
  },
  methods: {
    goPage (item) {
      if (item.myCoutomRouter) {
        this.$emit('goRouter', item)
      } else {
        if (item.routerTo) this.$router.push({name: item.routerTo})
      }

      // 添加回调函数
      item.callBack && item.callBack()
    },
    isChange (height) {
      this.minHeight = `${30 + height}px`
    },

    initStepper () {
      if (this.stepper.length > 0) {
        this.stepperList = this.stepper
        this.stepperList.forEach((item, index, arr) => {
          if (item.type && item.type === 'edit' && arr[index - 1].type !== 'edit') {
            arr[index - 1].endText = true
          }
        })
      }
    }
  },
  mounted () {
    this.initStepper()
  },
  components: {
    message
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  // create style
  .get-theme-color(@dark, @light) {
    .column-icon-dark::after {
      border-left: 7px solid @dark;
    }

    .column-icon-light::after {
      border-left: 7px solid @light;
    }

    .text .first-text {
      background: @dark;
    }

    .text .end-text {
      background: @light;
    }
  }

  .theme-config() {
    &.theme-royalblue {
      .get-theme-color(@royalblue-15, @royalblue-12);
    }

    &.theme-purple {
      .get-theme-color(@purple-15, @purple-12);
    }

    &.theme-blue {
      .get-theme-color(@blue-14, @blue-12);
    }

    &.theme-red {
      .get-theme-color(@red-15, @red-11);
    }

    &.theme-gray {
      .get-theme-color(@gray-15, @gray-11);
    }

    &.theme-gray-light {
      .get-theme-color(@gray-10, @gray-8);
    }
  }

  .stepper-title {
    width: 100%;
    min-height: 30px;

    .column-icon {
      font-size: 30px;
      position: absolute;
      top: -1px;
      right: -19px;
      z-index: 1;

      &::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        top: 0px;
        right: 14px;
        border-top: 16px solid transparent;
        z-index: 1;
        border-bottom: 15px solid transparent;
        position: absolute;
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
    }

    /*.column-icon-dark {
      &::after{
        border-left: 7px solid @purple-15;
      }
    }

    .column-icon-light {
      &::after{
        border-left: 7px solid @purple-12;
        right: 13px !important;
        top: 1px !important;
      }
    }
    */

    .column-icon-edit-dark {
      &::after {
        border-left: 7px solid @theme-edit-dark;
      }
    }

    .column-icon-edit-light {
      &::after {
        border-left: 7px solid @theme-edit-light;
      }
    }

    .step-box {
      position: relative;
    }

    .text {
      position: fixed;
      width: 100%;
      // z-index: 9;
      z-index: 1002; // 解决页面滚动时，slider组件的圆点，会覆盖到该元素上
      color: #ffffff;
      display: flex;
      flex-direction: column;
      min-height: 30px;
      white-space: nowrap;
      cursor: pointer;
      /*
          .first-text {
            background: @theme-purple-dark;
          }
          .end-text {
            background: @theme-purple-light;
          }
          */

      .edit-color-dark {
        background: @theme-edit-dark;
      }

      .edit-color-light {
        background: @theme-edit-light;
      }

      .title-name {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        padding-right: 15px;
      }

      .second-text {
        padding-left: 20px;
        width: 100%;
      }
    }

    .theme-config();
  }
</style>
