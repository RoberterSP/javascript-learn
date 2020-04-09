<template>
  <div class="nx_board_item">
    <div class="box" v-for="(item, index) in viewData.seriesData" :key="index">
      <div class="val">
        <span class="val_span">{{item.value}}</span><span v-if="item.unit">{{item.unit}}</span>
      </div>
      <div class="unit_title">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      viewData: {}
    }
  },
  // 验证类型
  props: {
    comData: {
      type: Object,
      default: function () {
        return {
          seriesData: []
        }
      }
    }
  },
  watch: {
  },
  created () {
    this.viewData = this.comData
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.nx_board_item{
  .box{
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    flex-direction: column;
    border-bottom: 1px solid rgba(69,70,70,1);
    .val{
      font-size: 11px;
      font-weight: 500;
      color:rgba(255,255,255,1);
      line-height: 16px;
      .val_span{
        font-size: 21px;
        line-height: 26px;
      }
    }
    .unit_title{
      font-size: 11px;
      color:rgba(137,137,137,1);
      margin: 8px 0 3px 0;
      line-height: 16px;
    }
    &+.box{
      margin-left: 5px;
    }
  }
}
</style>
