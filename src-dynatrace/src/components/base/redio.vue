<template>
  <div class="dy-radio">
    <div class="radio-item" v-for="(item, index) in arrData" v-bind:key="index">
      <div class="redio_btn">
        <input type="radio" v-model="default_radio" :id="'id' + item.value" :name="name" v-bind:value="item.value" @change="radioChange(item)" />
        <label class="pointer" :for="'id' + item.value" @click="radioClick(item)">{{item.label}}</label>
      </div>
      <input type="text" class="input_val" v-model="inputValue" @input="inputValChange" v-if="item.haveInput && default_radio === item.value && (item.value === 'is' || item.value === 'is not')">
      <el-select
        class="input_val"
        v-model="selectValue"
        multiple
        remote
        filterable
        allow-create
        default-first-option
        placeholder=""
        @change="selectChange"
        v-if="item.haveInput && default_radio === item.value && (item.value === 'is one of' || item.value === 'is not one of')">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      default_radio: '',
      inputValue: '',
      options: [],
      selectValue: []
    }
  },
  props: {
    name: {
      type: String,
      default: 'redio'
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    keyValue: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    arrData: {
      get () {
        var arr = []
        if (this.list) {
          /* eslint-disable-next-line */
          // this.default_radio = ''
          this.list.forEach(x => {
            arr.push({
              value: x[this.keyValue[0]],
              label: x[this.keyValue[1]],
              haveInput: x.haveInput || false
            })
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            if (x.inputValue) this.inputValue = x.inputValue
          })
          var item = this.list.find(x => x.default)
          var item1 = this.list.find(x => x.haveInput)
          if (item && (!item1 || !item1.haveInput)) {
            // if (!this.default_radio) {
            // 获取默认值
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.default_radio = item[this.keyValue[0]]
            // }
          }
          var selectItem = this.list.find(x => x.isSelected)
          if (selectItem && (!item1 || !item1.haveInput)) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.default_radio = selectItem[this.keyValue[0]]
          }
        } else {
          /* eslint-disable-next-line */
          this.default_radio = ''
        }
        return arr
      }
    }
  },
  methods: {
    radioChange (item) {
      this.options = []
      this.selectValue = []
      this.inputValue = ''
      if (!item.haveInput) {
        this.$emit('redioChecked', this.name, this.default_radio)
      } else {
        this.default_radio = item.value
      }
    },
    radioClick (item) {
      this.options = []
      this.selectValue = []
      this.inputValue = ''
      if (!item.haveInput) {
        this.$emit('redioChecked', this.name, item.value)
      } else {
        this.default_radio = item.value
      }
    },
    inputValChange () {
      this.$emit('inputValChange', this.default_radio, this.inputValue)
    },
    selectChange () {
      // let value = ''
      // this.selectValue.forEach(item => {
      //   value += item + '|'
      // })
      // value = value.substring(0, value.length - 1)

      let value = this.selectValue.join('，')

      this.$emit('inputValChange', this.default_radio, value)
    }
  },
  mounted () {
    console.log(this.list)
    // this.$nextTick(() => {
    //   document.querySelectorAll('[name=' + this.name + ']').forEach(input => input.addEventListener('change', () => {
    //     var checked = document.querySelector('[name=' + this.name + ']:checked')
    //     console.log('redioChecked', checked.value)
    //     this.$emit('redioChecked', this.name, checked.value)
    //   }))
    // })
  },
  created () {
  },
  components: {}
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

.dy-radio {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .radio-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 25%;
    width: 33%;
    .redio_btn{
      display: flex;
      align-items: center;
    }
    input[type='radio'] {
      width: 20px;
      height: 20px;
      padding: 8px;
      background: rgba(255, 255, 255, 1);
      border: 2px solid @theme-color;
      border-radius: 50%;
      transition: 0.2s all linear;
      background-clip: content-box;
    }
    input[type='radio']:checked {
      padding: 4px;
      background: @theme-color;
      background-clip: content-box;
    }
    label {
      margin-left: 6px;
      line-height: 38px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 10px;
      font-size:14px;
      font-family:SourceHanSansSC-Regular,SourceHanSansSC;
      font-weight:400;
      color:rgba(69,70,70,1);
    }
    .input_val{
      justify-content: flex-end;
      border: 1px solid #CCCCCC;
    }
  }
}
@media only screen and (max-width: 1586px){
  .dy-radio .radio-item {
    width: 33%;
  }
}

@media only screen and (max-width: 1350px){
  .dy-radio .radio-item {
    width: 50%;
  }
}

@media only screen and (max-width: 1000px){
  .dy-radio .radio-item {
    width: 100%;
  }
}
</style>
