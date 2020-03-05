<template>
    <div class="search-box">
      <div class="searchBar flex-start">
        <img src="@/assets/image/icon-input-search.svg" alt="" @click="search" v-show="showSearch"/>
        <input type="text"
          :placeholder="placeholder"
          v-model="currentValue"
          @keyup.enter="search"
          @input ="inputFunc"
          @focus="focus"
          @blur="blur">
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentValue: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    search: function () {
      this.$emit('search')
    },
    inputFunc: function () {
      this.$emit('change')
    },
    focus: function () {
      this.$emit('focus')
    },
    blur: function () {
      this.$emit('blur')
    },
    choose: function (item) {
      this.$emit('choose', item)
    }
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";
.search-box {
  display: inline-block;
  width: 100%;
  .searchBar {
    background: #ffffff;
    height: 32px;;
    display: flex;
    position: relative;
    input {
      width: 100%;
      height: 100%;
      padding-left: 12px;
      padding-right: 28px;
      color:rgba(137,137,137,1);
      line-height:20px;
      font-size:14px;
      font-family:SourceHanSansSC-Regular,SourceHanSansSC;
      font-weight:400;
      border-radius: 4px;
    }
    img {
      cursor: pointer;
      position: absolute;
      right: 10px;
      width: 12px;
      height: 12px;
    }
  }
}
</style>
