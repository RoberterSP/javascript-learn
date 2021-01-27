<template>
<div class="blank_page p20">
  <div class="btn_handle" v-if="blankObj.btnPositon === 'top'">
    <DYButton type="primary" @click="handleBtn">{{blankObj.btnName}}</DYButton>
  </div>
  <div :class="blankObj.btnPositon === 'top' ? 'm16 p24': ''">
    <h1 class="mb10" v-html="blankObj.title"></h1>
    <div class="sub_title mb20" v-html="blankObj.subTitle"></div>
    <div class="blank_content">
      <div class="page_content" v-for="(item, index) in blankObj.list" :key="index">
        <div class="detail_content">
          <img :src="item.img" class="blank_img"/>
          <div class="step_text" v-html="item.stepText"></div>
        </div>
        <div class="right_arrow" v-if="index < blankObj.list.length - 1"></div>
      </div>
    </div>
  </div>
  <div class="btn_handle" v-if="blankObj.btnPositon === 'bottom' || !blankObj.btnPositon">
    <DYButton type="primary" @click="handleBtn">{{blankObj.btnName}}</DYButton>
  </div>
</div>
</template>
<script>
export default {
  props: {
    blankObj: {
      type: Object,
      default () {
        return {
          btnPositon: 'bottom',
          btnName: '创建',
          title: 'User session analysis requires real-user monitoring data',
          subTitle: 'Dynatrace monitors all service requests (including outgoing requests and database requests) all the way down to the code-level. Deploy Dynatrace to access all service-related charts, code-level analysis, environment topology visualizations, error analysis, method hotspots and response time analysis.',
          list: [
            {
              img: 'http://6120491.s21i.faiusr.com/2/ABUIABACGAAg0725rAUoiLv9qAQwrAI4rAI.jpg',
              stepText: '<a href="" class="link_url">Deploy Dynatrace now</a>to get started. Once you\'ve set up application monitoring you can filter your users and user sessions and benefit from highly granular user session analysis.'
            },
            {
              img: 'http://6120491.s21i.faiusr.com/2/ABUIABACGAAg0725rAUoiLv9qAQwrAI4rAI.jpg',
              stepText: '<a href="" class="link_url">Deploy Dynatrace now</a>to get started. Once you\'ve set up application monitoring you can filter your users and user sessions and benefit from highly granular user session analysis.'
            },
            {
              img: 'http://6120491.s21i.faiusr.com/2/ABUIABACGAAg0725rAUoiLv9qAQwrAI4rAI.jpg',
              stepText: 'to get started. Once you\'ve set up application monitoring you can filter your users and user sessions and benefit from highly granular user session analysis.'
            }
          ]
        }
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    handleBtn () {
      this.$emit('handleBtn')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~common/style/variable";
.blank_page{
  height: 100%;
  background: #fff;
  min-height: 319px;
  .page_content{
    display: flex;
    flex-wrap: wrap;
  }
  .blank_content{
    display: flex;
    margin-bottom: 52px;
    .detail_content{
      -webkit-flex: 1 1 100px;
      .blank_img{
        display: block;
        max-width: 100%;
        max-height: 200px;
        margin: 0 auto;
      }
    }
    .right_arrow{
      position: relative;
      width: 40px;
      min-width: 40px;
    }
    .right_arrow::after{
      content: "";
      position: absolute;
      left: 0;
      width: 0;
      height: 0;
      margin: auto;
      margin-left: 15px;
      top: 0;
      bottom: 0;
      border-style: solid;
      border-width: 8px 0 8px 10px;
      border-color: transparent transparent transparent #ccc;
    }
  }
  .btn_handle{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
<style lang="less">
@import "~common/style/variable";
.blank_content{
  .detail_content{
    .link_url{
        color: @turq-06;
      }
  }
}
</style>
