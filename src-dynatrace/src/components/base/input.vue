<template>
  <div class="dy-input">
    <div class="set_input_value el-input">
      <input  type="text" ref="input" v-model="dyValue" autocomplete="off" :placeholder="placeholder" onkeyup="if(! /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.dyValue)){this.dyValue='';}" class="el-input__inner">
      <span class="el-input__suffix flex-center" v-if="dyValue">
        <span class="el-input__suffix-inner el-input__icon iconfont el-input__clear flex-center" @click="saveValue">
          <DYIcon type="checkOK"></DYIcon>
        </span>
        <span class="el-input__suffix-inner el-input__icon iconfont el-input__clear flex-center" @click="deleteValue">
          <DYIcon type="delete"></DYIcon>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dyValue: this.value
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    value: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  // computed: {
  //   value: {
  //     get: () => {
  //       return this.value
  //     },
  //     set: () => {}
  //   }
  // },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    select () {
      this.$refs.input.select()
    },
    deleteValue () {
      this.$emit('delete', this.dyValue)
    },
    saveValue () {
      this.$emit('save', this.dyValue)
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
.dy-input {
  .iconfont {
    color: @turq-06;
    font-size: 24px;
  }
  input {
    height: 40px;
    line-height: 40px;
    padding: 0 60px 0 6px;
    color: #454646;
    font-size:28px;
    border: 1px solid #979797;
    border-radius:3px;
  }
}
.el-input__icon {
  line-height: 42px !important;
}

</style>
