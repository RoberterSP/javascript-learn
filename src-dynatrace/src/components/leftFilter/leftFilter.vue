<template>
    <div class="filter">
        <div class="filter-item" v-for="(filter, index) in filterList" :key="filter.code" :class="{select:filter.selected}"
               @click="onClick(filter.code, filter, index)">
            <div class="up">{{filter.name}}</div>
            <div class="down flex-between">
                <div>{{filter.select_name}}</div>
                <span>编辑</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'LeftFilter',
  data () {
    return {}
  },
  props: {
    filterList: {
      type: Array,
      default () { return [] }
    }
  },
  methods: {
    onClick (code, item, index) {
      this.$emit('click', code, item, index)
    }
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";
    .filter {
        .filter-item {
            cursor: pointer;
            width: 100%;
            min-height: 71px;
            border-bottom: 1px solid @gray-03;

            &.select {
              background: @gray-03;
            }

            .up {
              padding: 14px 0 0 16px;
              font-size: 18px;
              line-height: 26px;
              word-break: break-all;
            }

            .down {
              padding: 6px 16px;

              div {
                word-break: break-all;
                padding-right: 10px;
              }

              span {
                color: @turq-06;
                white-space: nowrap;
              }
            }
        }
    }
</style>