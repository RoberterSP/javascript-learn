<template>
  <div class="dy-checkbox">
    <div v-if="arrData.length" class="checkbox-item" v-for="(item, index) in arrData" v-bind:key="index">
      <label :for="item.value">
        <span class="sf-checkbox__input" :class="[item.checked?'is-checked':'']">
          <span class="sf-checkbox__inner">
            <img src="~@/assets/image/dynatrace/icon_checkbox__inner_checked.svg" alt="" v-if="item.checked" />
            <img src="~@/assets/image/dynatrace/icon_checkbox__inner.svg" alt="" v-else />
          </span>
          <input type="checkbox" v-model="item.checked" :id="item.value" :name="name" @change="checkboxChange($event, item)"/>
        </span>
        <span class="sf-checkbox__label">{{item.label}}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      default_checkbox: '',
      arrData: []
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
    // arrData: {
    //   get () {
    //     var arr = []
    //     if (this.list) {
    //       this.list.forEach(x => {
    //         arr.push({
    //           value: x[this.keyValue[0]],
    //           label: x[this.keyValue[1]],
    //           checked: false
    //         })
    //       })
    //       var defaultArr = this.list.filter(x => x.checked)
    //       this.$emit('checkboxChecked', this.name, defaultArr)
    //     }
    //     return arr
    //   }
    // }
  },
  watch: {
    'arrData': {
      handler: function () {
        // let defaultArr = this.arrData.filter(x => x.checked)
        // this.$emit('checkboxChecked', this.name, defaultArr)
      },
      deep: true
    }
  },
  methods: {
    checkboxChange (event, item) {
      let defaultArr = []
      if (item.label === '任意' && item.checked) {
        // 勾选的任意
        this.arrData.forEach((data, index) => {
          data.checked = index === 0
        })
        defaultArr = this.arrData.filter(x => x.checked)
      } else {
        this.arrData[0].checked = false
        defaultArr = this.arrData.filter(x => x.checked)
      }
      this.$emit('checkboxChecked', this.name, defaultArr)
    },
    setCheckboxArr (arr) {
      var list = []
      if (arr) {
        arr.forEach(x => {
          list.push({
            value: x[this.keyValue[0]],
            label: x[this.keyValue[1]],
            checked: x.checked ? x.checked : false
          })
        })
      }
      this.arrData = list
      // console.log('arrData', this.arrData)
    }
  },
  mounted () {
  },
  created () {
    this.setCheckboxArr(this.list)
  },
  components: {}
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

.dy-checkbox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .checkbox-item {
    display: flex;
    align-items: center;
    width: 33%;
    .sf-checkbox__input{
      white-space: nowrap;
      cursor: pointer;
      outline: none;
      display: inline-block;
      line-height: 1;
      position: relative;
      vertical-align: middle;
      .sf-checkbox__inner{
        display: inline-block;
        position: relative;
        border: 2px solid @theme-color;
        border-radius: 0;
        box-sizing: border-box;
        width: 20px;
        height: 20px;
        background-color: #fff;
        z-index: 1;
        text-align: center;
        img{
          width: 16px;
          height: 16px;
          margin-top: 0px;
          // fill: #00a1b2;
          // stroke-width: 64;
          // stroke: #00a1b2;
          // margin-top: 2px;
          opacity: 0;
        }
      }
      &.is-checked .sf-checkbox__inner {
        // background-color: @theme-color;
        border-color: @theme-color;
        img{
          opacity: 1;
        }
      }
      input[type='checkbox'] {
        opacity: 0;
        outline: none;
        position: absolute;
        margin: 0;
        width: 0;
        height: 0;
        z-index: -1;
      }
    }
    .sf-checkbox__label{
      font-size:14px;
      font-family:SourceHanSansSC-Regular,SourceHanSansSC;
      font-weight:400;
      color:rgba(69,70,70,1);
      line-height: 38px;
      margin-left: 10px;
    }
    label {
      margin-left: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 10px;
      display: flex;
      align-items: center;
    }
  }
}
@media only screen and (max-width: 1586px){
  .dy-checkbox .checkbox-item {
    width: 33%;
  }
}

@media only screen and (max-width: 1350px){
  .dy-checkbox .checkbox-item {
    width: 50%;
  }
}

@media only screen and (max-width: 1000px){
  .dy-checkbox .checkbox-item {
    width: 100%;
  }
}
</style>
