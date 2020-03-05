<template>
  <div class="btn" @click="clickBtn()">
    <span>{{text}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    text: {
      type: String,
      default: '添加接口过滤'
    }
  },
  computed: {},
  methods: {
    clickBtn () {
      this.$emit('click')
    }
  },
  mounted () {},
  created () {},
  components: {}
}
</script>

<style scoped lang="less">
@import "~common/style/variable";
.btn {
    cursor: pointer;
    background:@theme-color;
    border-radius:3px;
    display: inline-block;
    span {
        display: inline-block;
        font-size:14px;
        font-family:SourceHanSansSC-Regular,SourceHanSansSC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:20px;
        padding: 5px 24px 7px 23px;
    }
}

</style>
