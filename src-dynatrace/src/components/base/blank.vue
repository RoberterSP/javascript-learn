<template>
  <div class="init-app m24 p20">
    <div class="title default-label">{{blankData.title}}</div>
    <div class="des default-label mt8">{{blankData.subtitle}}</div>
    <div class="init-step mt9">
      <div class="step-item" :style="{width: (100 / blankData.img_num) + '%'}">
        <img class="step-img" :src="blankData.img_1" alt="" :style="{maxWidth: blankData.img_num > 1 ? '100%' : '800px'}">
        <div class="step-text"><span>{{blankData.img_1_title}}</span></div>
      </div>
      <div class="iconfont iconright icon-step" v-if="blankData.img_2"></div>
      <div class="step-item" v-if="blankData.img_2" :style="{width: (100 / blankData.img_num) + '%'}">
        <img class="step-img spec" :src="blankData.img_2" alt="">
        <div class="step-text"><span>{{blankData.img_2_title}}</span></div>
      </div>
      <div class="iconfont iconright icon-step" v-if="blankData.img_3"></div>
      <div class="step-item" v-if="blankData.img_3" :style="{width: (100 / blankData.img_num) + '%'}">
        <img class="step-img spec_third" :src="blankData.img_3" alt="">
        <div class="step-text"><span>{{blankData.img_3_title}}</span></div>
      </div>
    </div>
    <div class="oper">
      <el-button type="primary" @click="clickBtn">{{blankData.btn_text}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    blankData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {},
  methods: {
    clickBtn () {
      this.$emit('createScope')
    }
  },
  mounted () {},
  created () {},
  components: {}
}
</script>

<style scoped lang="less">
@import "~common/style/variable";
.init-app {
  padding-bottom: 28px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
  .title {
    font-size: 28px;
    font-weight: 500;
    line-height: 40px;
  }
  .des {
    line-height: 22px;
  }
  .init-step {
    display: flex;
    align-items: center;
    .step-item {
      width: 31.5%;
      height: auto;
      text-align: center;
      .step-img {
        width: 100%;
        max-width: 509px;
        height: auto;
      }
      .step-text {
        text-align: center;
        span {
          text-align: left
        }
      }
    }
    .icon-step {
      margin: 0 0.9%;
      width: 1%;
      height: auto;
      font-size: 16px;
      color: #F2F2F2
    }
  }
  .oper {
    margin-top: 28px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button--primary {
      background: #7DC540 !important;
      border-color: #7DC540 !important;
    }
  }
}

</style>
