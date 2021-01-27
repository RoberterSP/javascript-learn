<template>
  <div class="nt_select">
    <el-select
      style="width: 100%"
      v-model="value"
      :placeholder="placeholder"
      @change="change">
      <el-option
        v-for="item in arrData"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      value: ''
    }
  },
  props: {
    selectData: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    keyValue: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    arrData: {
      get () {
        let arr = []
        for (let i = 0; i < this.selectData.length; i++) {
          arr.push({
            value: this.selectData[i][this.keyValue[0]],
            label: this.selectData[i][this.keyValue[1]]
          })
        }
        return arr
      }
    }
  },
  methods: {
    change (val) {
      this.$emit('change', val)
    }
  },
  mounted () {
  },
  created () {
  },
  components: {}
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";
  @import './index.less';

  .nt_select {
    .el-select-dropdown {
      margin: 0 !important;
    }
  }
</style>
