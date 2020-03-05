<template>
  <div class="">
    <div class="sf-tagsinput">
      <div class="tagsinput_prev" v-if="!isCustom">
        <i class="iconfont-icon iconfont iconfilter"></i>
        <span>过滤条件</span>
      </div>
      <div class="tagsinput_values" v-if="!isCustom">
        <span class="tag_item" v-for="(item, index) in modelValues" :key="index"
              :class="[item.value||item.value==0?'':'no_value_key']">
          <span class="tag_invert" v-if="item.invert">{{item.invert}}</span>
          <span class="tag_key">{{item.key}}：</span>
          <span class="tag_val" v-if="item.value||item.value==0">{{item.value_label || item.value}}</span>
          <span class="tags_remove" v-if="item.value||item.value==0" @click="removeTag(index)"><i
            class="el-icon-close"></i></span>
        </span>

        <div class="tagsinput_input">

          <el-input ref="tags_input" id="input-id" class="tags_input" type="text" size="11" v-model="nameQueryVal"
                    :placeholder="(!currFilterKeys.length && conditionType === 'log' && checkedLogType) ? '该日志类型下暂无可过滤条件' : ''"
                    :disabled="!currFilterKeys.length"
                    autocomplete="off"
                    @change="filterNameClick"
                    @input="filterList"
                    @focus="inputFocus($event)"
                    @blur="inputBlur">
          </el-input>
          <div class="filter_keys_pop name_filter" :class="[vergeOfEdge?'vergeOfEdge':'']"
               v-show="nameQueryVal && userInputQuery">
            <div class="key_item" @click="filterNameClick()">{{getNameKey}}：<span
              class="name_value">{{nameQueryVal}}</span></div>
          </div>
          <!-- 选择键值 popup -->
          <div class="filter_keys_pop" :class="[vergeOfEdge?'vergeOfEdge':'']"
               v-show="show_filter_keys_pop && !nameQueryVal">
            <div v-for="(item, index) in currFilterKeys" :key="index" class="key_item" @click="filterKeysClick(item)">
              {{item.label}}
            </div>
          </div>
          <!-- 填写 popup -->
          <div class="filter_values_pop" :class="[vergeOfEdge?'vergeOfEdge':'']" v-show="show_filter_values_pop">
            <div class="container">
              <div class="pop-body">
                <!-- Http value  有自定义input -->
                <div v-if="currFilterObj.type==='select_custom_input_obj'" class="select_custom_input-section">
                  <nt-redio class="radio-list" :label="currFilterObj.value" :list="currFilterObj.list"
                            :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"></nt-redio>
                  <div class="custom_input_box"><input type="text" v-model="currFilterObj.filterInputVal" v-onlyNumber/>
                  </div>
                </div>
                <div v-if="currFilterObj.type==='select_obj' && !currFilterObj.isMultiple">
                  <nt-redio class="radio-list" :label="currFilterObj.value" :list="currFilterObj.list"
                            :keyValue="redioKeyValue" v-on:redioChecked="redioChecked"
                            @inputValChange="inputValChange"></nt-redio>
                </div>
                <div v-if="currFilterObj.type==='select_obj' && currFilterObj.isMultiple">
                  <nt-checkbox class="category-list" :name="currFilterObj[keysValue[0]]" :list="currFilterObj.list"
                               :keyValue="checkboxKeyValue" v-on:checkboxChecked="checkboxChecked"></nt-checkbox>
                </div>
                <div v-if="currFilterObj.type==='input'" class="filter_input-section">
                  <span v-if="currFilterObj.opt_symbol">{{currFilterObj.opt_symbol}}</span>
                  <input :type="currFilterObj.input_type?currFilterObj.input_type:'text'"
                         v-model="currFilterObj.filterInputVal"/>
                  <span v-if="currFilterObj.unit">{{currFilterObj.unit}}</span>
                </div>

                <!-- 日期类型 -->
                <div class="timeComp">
                  <datePickContainer
                    v-if="currFilterObj.type==='time'"
                    :show="true"
                    :propsCurrTab="'custom'"
                    theme="light"
                    adsorbArrow="left"
                    @onClickSure="onTimePickClickSure"
                    ref="datePick"></datePickContainer>
                </div>

              </div>
              <div class="bottom" v-if="currFilterObj.type !== 'time'">
                <el-button type="primary" :disabled="sureDisabled" @click="sureClick(currFilterObj)">确认</el-button>
                <el-button @click="cancelClick(currFilterObj)">取消</el-button>
              </div>
            </div>
            <!-- <div v-for="(item, index) in currFilterKeys" :key="index" class="key_item" @click="filterKeysClick(item)">{{item.label}}</div> -->
          </div>
        </div>
      </div>
      <div class="tagsinput_values" v-if="isCustom">
        <div class="tagsinput_input">
          <el-input ref="tags_input" class="tags_input" type="text" size="11" v-model="queryStr"
                    placeholder="Search... (e.g. status:200 AND extension:PHP)"
                    @input="inputVal"
                    @keypress.native.enter="onEnter"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="onEnter"></i>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/common/util/resource/jquery-1.8.3.min'
import './tagsInput.less'
import ntRedio from 'components/base/redio.vue'
import ntCheckbox from 'components/base/checkbox.vue'
import datePickContainer from '@/components/navigation/datePickContainer.vue'
import moment from 'moment'

export default {
  data () {
    return {
      // 确认按钮 是否可点击
      sureDisabled: true,
      // currFilterKeys: [],
      modelValues: [],
      show_filter_keys_pop: false,
      show_filter_values_pop: false,
      redioKeyValue: ['value', 'label'],
      checkboxKeyValue: ['value', 'label'],
      currFilterObj: {
        value: '',
        opt_symbol: '',
        input_type: 'text',
        unit: '',
        type: '',
        list: [],
        filterInputVal: '',
        timeObj: {}
      },
      // 是否贴边 ，改变定位
      vergeOfEdge: false,
      // tagsinput的offsetWidth
      offsetWidth: '',
      queryStr: '',
      nameQueryVal: '', // 根据名称搜索的内容
      currFilterObjCopy: {}
    }
  },
  props: {
    defaultKeyName: {
      type: String,
      default: '名称'
    },
    conditionType: String,
    // 过滤的键值集合
    filterKeys: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    // 传进来的filterKeys  的键值对
    keysValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    isCustom: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    queryValue: {
      type: String,
      default: () => {
        return ''
      }
    },
    checkedLogType: {
      type: String,
      default: () => {
        return ''
      }
    },
    userInputQuery: {
      type: Boolean,
      default: () => {
        return false
      }
    }
    // // 初始化value
    // initFilterModel: {
    //   type: Object,
    //   default: {}
    // }
  },
  computed: {
    currFilterKeys: {
      get () {
        let arr = []
        // 过滤新的filterKeys组
        if (this.modelValues.length) {
          this.filterKeys.forEach(row => {
            let isHave = this.modelValues.findIndex(data => data.key === row[this.keysValue[1]])

            if (isHave < 0 || row.isMultiple) {
              // 多选的允许 多填
              row['label'] = row[this.keysValue[1]]
              row['value'] = row[this.keysValue[0]]
              arr.push(row)
            }
          })
        } else {
          this.filterKeys.forEach(row => {
            row['label'] = row[this.keysValue[1]]
            row['value'] = row[this.keysValue[0]]
            arr.push(row)
          })
        }
        return arr
      }
    },
    getNameKey () {
      const obj = this.filterKeys.find(item => item.code === 'name')
      if (obj !== undefined) {
        return obj.name
      }
      return this.defaultKeyName
    }
  },
  watch: {
    'currFilterObj': {
      handler: function () {
        this.sureDisabledHandle()
      },
      deep: true
    },
    'queryValue': function (val) {
      this.queryStr = val
    },
    'isCustom': function (val) {
      if (val) this.modelValues = []
    },
    'checkedLogType': function (val) {
      this.modelValues = []
    }
  },
  created () {
  },
  methods: {
    onTimePickClickSure (event) {
      const timeObj = {
        startTime: +event.start_time,
        endTime: +event.end_time
      }

      Object.assign(this.currFilterObj, {timeObj})

      this.sureClick(this.currFilterObj)
    },

    filterList () {
      const data = JSON.parse(JSON.stringify(this.currFilterObjCopy))
      if (data.filter && data.list && data.list.length > 0) {
        const filterValue = data.list.filter(item => item.value.indexOf(this.nameQueryVal) >= 0)
        this.currFilterObj.list = JSON.parse(JSON.stringify(filterValue))
        this.show_filter_values_pop = this.currFilterObj.list.length > 0
      }
    },
    // // 设置过滤组件的model
    // setModelValues (data) {
    //   this.modelValues = data
    // },
    // 监听确定按钮 状态
    sureDisabledHandle () {
      let bol = true
      let selectObj
      if (this.currFilterObj) {
        switch (this.currFilterObj.type) {
          case 'select_custom_input_obj':
            // 自定义选择 + input
            if (this.currFilterObj.list && this.currFilterObj.list.length) {
              selectObj = this.currFilterObj.list.find(row => row.isSelected) || this.currFilterObj.list.find(row => row.default)
            }
            if (selectObj) {
              if (selectObj.value === 'custom') {
                bol = !this.currFilterObj.filterInputVal
              } else {
                bol = false
              }
            } else {
              // 未选择
              bol = true
            }
            break
          case 'select_obj':
            if (this.currFilterObj.list && this.currFilterObj.list.length) {
              selectObj = this.currFilterObj.list.find(row => row.isSelected) || this.currFilterObj.list.find(row => row.default)
            }
            // 选择
            if (selectObj) {
              if (selectObj.haveInput && selectObj.inputValue) {
                bol = false
              } else bol = selectObj.haveInput
            } else {
              // 未选择
              bol = true
            }
            break
          case 'input':
            // 纯input
            bol = !this.currFilterObj.filterInputVal
            break
        }
      }
      this.sureDisabled = bol
    },
    // radio选中案件
    redioChecked (label, checked) {
      // console.log(label, checked)
      // radio 选中
      this.currFilterObj.list.forEach(data => {
        if (data.value === checked) {
          data.isSelected = true
          return
        }
        data.isSelected = false
      })
      this.currFilterObj.list = JSON.parse(JSON.stringify(this.currFilterObj.list))
      // console.log(this.currFilterObj)
      this.$forceUpdate()
    },
    inputValChange (checked, inputVal) {
      this.currFilterObj.list.forEach(data => {
        if (data.value === checked) {
          data.isSelected = true
          data.inputValue = inputVal
          return
        }
        delete data.inputValue
        data.isSelected = false
      })
      this.currFilterObj.list = JSON.parse(JSON.stringify(this.currFilterObj.list))
      this.$forceUpdate()
    },
    checkboxChecked (name, checked) {
      // console.log('checkboxChecked', name, checked)
      this.currFilterObj.list.forEach(el => {
        let isCheck = checked.findIndex(row => row.label === el[this.checkboxKeyValue[1]] && row.value === el[this.checkboxKeyValue[0]])
        if (isCheck > -1) {
          el.checked = true
          el.isSelected = true
        } else {
          el.checked = false
          el.isSelected = false
        }
      })
      this.currFilterObj.list = JSON.parse(JSON.stringify(this.currFilterObj.list))
      this.$forceUpdate()
    },
    inputBlur () {
      setTimeout(() => {
        this.show_filter_keys_pop = false
      }, 100)
    },
    inputFocus (e) {
      if (this.show_filter_values_pop) {
        // 正在选择值
        return
      }
      this.offsetWidth = e.target.offsetWidth
      this.popPosition('filter_keys_pop', e.target.offsetWidth)
      if (this.currFilterKeys.length && !this.show_filter_values_pop) {
        this.show_filter_keys_pop = true
      } else {
        // let lastKeyValue = this.modelValues[this.modelValues.length-1].value
        // if (!lastKeyValue && lastKeyValue!==0 ) {
        //   this.currFilterObj = this.currFilterKeys.filter(row => row.label === this.modelValues[this.modelValues.length-1].key)
        //   this.popPosition('filter_values_pop', e.target.offsetWidth)
        //   this.show_filter_values_pop = true
        // }
      }
    },
    // 判断popup 定左还是右
    popPosition (popupType, offsetWidth = null) {
      // eslint-disable-next-line no-unneeded-ternary
      offsetWidth = offsetWidth ? offsetWidth : this.offsetWidth
      this.offsetWidth = offsetWidth
      setTimeout(() => {
        // console.log('filter_pop =》 Width', offsetWidth, $('.'+popupType).width())
        // eslint-disable-next-line no-undef
        if (offsetWidth - 30 > $('.' + popupType).width()) {
          this.vergeOfEdge = false
        } else {
          this.vergeOfEdge = true
        }
      }, 0)
    },
    // 移除过滤条件 tag
    removeTag (index) {
      this.resetCurrFilterObj()
      this.modelValues.splice(index, 1)
      this.$emit('returnFilterFunc', this.modelValues)
      this.$forceUpdate()
    },
    // 根据名称急性搜索
    filterNameClick () {
      if (!this.nameQueryVal || !this.userInputQuery) return
      var input = document.getElementById('input-id')
      input.blur()
      this.modelValues.forEach((item, index) => {
        if (item.value === null) {
          this.modelValues.splice(index, 1)
        }
      })
      const keyIndex = this.modelValues.findIndex(item => item.code === 'name')
      if (keyIndex >= 0) {
        this.modelValues.splice(keyIndex, 1)
      }
      this.modelValues.push({
        key: this.getNameKey,
        code: 'name',
        value: this.nameQueryVal,
        value_label: this.nameQueryVal
      })
      this.resetCurrFilterObj()
      this.nameQueryVal = ''
      this.$emit('returnFilterFunc', this.modelValues)
    },
    // 过滤键值click
    filterKeysClick (item) {
      let len = this.modelValues.length - 1
      if (len > -1 && !this.modelValues[len].value && this.modelValues[len].value !== 0) {
        // 如果上一个过滤选项 还没有填值  则替换掉
        this.modelValues.splice(len, 1)
      }
      this.modelValues.push({
        key: item.label,
        code: item.value,
        value: null,
        value_label: null
      })
      let currFilterObj = JSON.parse(JSON.stringify(item))
      currFilterObj.filterInputVal = ''
      this.currFilterObj = currFilterObj
      this.currFilterObjCopy = JSON.parse(JSON.stringify(item))
      // console.log('currFilterObj', this.currFilterObj)
      this.show_filter_keys_pop = false
      this.popPosition('filter_values_pop')
      this.show_filter_values_pop = true
      // console.log(this.modelValues)
    },
    // 确定
    sureClick (currFilterObj) {
      let selectObj = false
      // console.log('点击确定', currFilterObj)
      if (this.nameQueryVal) this.nameQueryVal = ''
      switch (currFilterObj.type) {
        case 'time':
          // 设置值
          const {timeObj} = currFilterObj

          this.modelValues[this.modelValues.length - 1].value = timeObj
          this.modelValues[this.modelValues.length - 1].value_label = `${moment(timeObj.startTime).format('YYYY-DD-MM HH:mm')} 至 ${moment(timeObj.endTime).format('YYYY-DD-MM HH:mm')}`

          break

        case 'select_custom_input_obj':
          // 自定义选择 + input
          if (this.currFilterObj.list && this.currFilterObj.list.length) {
            selectObj = this.currFilterObj.list.find(row => row.isSelected) || this.currFilterObj.list.find(row => row.default)
          }
          if (selectObj) {
            if (selectObj.value === 'custom') {
              if (!this.currFilterObj.filterInputVal) {
                // 自定义  但是未填写值
                alert('未填写值')
                return
              } else {
                this.modelValues[this.modelValues.length - 1].value = this.currFilterObj.filterInputVal
                this.modelValues[this.modelValues.length - 1].value_label = selectObj.label
              }
            } else {
              this.modelValues[this.modelValues.length - 1].value = selectObj.value
              this.modelValues[this.modelValues.length - 1].value_label = selectObj.label
            }
          } else {
            // 未选择
            alert('请选择')
            return
          }
          break
        case 'select_obj':
          if (this.currFilterObj.list && this.currFilterObj.list.length) {
            if (this.currFilterObj.isMultiple) {
              // 多选 添加
              let checkedList = this.currFilterObj.list.filter(row => {
                return row.checked
              })
              let modelValues = this.modelValues.filter(row => {
                return row.key !== this.currFilterObj[this.keysValue[1]]
              })
              if (checkedList && checkedList.length) {
                checkedList.forEach(el => {
                  modelValues.push({
                    key: this.currFilterObj[this.keysValue[1]],
                    code: this.currFilterObj[this.keysValue[0]],
                    value_label: el.label,
                    value: el.value
                  })
                })
                this.modelValues = modelValues
                // console.log('modelValues', checkedList, this.modelValues)
              } else {
                // 未选择
                alert('请选择')
                return
              }
            } else {
              // 单选 做替换value即可
              selectObj = this.currFilterObj.list.find(row => row.isSelected) || this.currFilterObj.list.find(row => row.default)
              if (selectObj) {
                if (selectObj.haveInput && selectObj.inputValue) {
                  if (selectObj.value.indexOf('not') > 0) {
                    this.modelValues[this.modelValues.length - 1].invert = 'not'
                  } else {
                    delete this.modelValues[this.modelValues.length - 1].invert
                  }
                  this.modelValues[this.modelValues.length - 1].value_label = selectObj.inputValue
                  this.modelValues[this.modelValues.length - 1].value = selectObj.value
                } else {
                  this.modelValues[this.modelValues.length - 1].value_label = selectObj.label
                  this.modelValues[this.modelValues.length - 1].value = selectObj.value
                }
              } else {
                // 未选择
                alert('请选择')
                return
              }
            }
          }
          break
        case 'input':
          // 纯input
          if (!this.currFilterObj.filterInputVal) {
            // 未填写值
            alert('未填写值')
            return
          } else {
            this.modelValues[this.modelValues.length - 1].value = this.currFilterObj.filterInputVal
          }
          break
      }
      // this.show_filter_values_pop = false
      this.resetCurrFilterObj()
      // console.log(this.modelValues)
      this.$emit('returnFilterFunc', this.modelValues)
    },
    // 重置选中过滤 pop的绑定值
    resetCurrFilterObj () {
      this.currFilterObj = {
        value: '',
        opt_symbol: '',
        input_type: 'text',
        unit: '',
        type: '',
        list: [],
        filterInputVal: '',
        timeObj: {}
      }
      this.show_filter_values_pop = false
      this.currFilterObjCopy = JSON.parse(JSON.stringify(this.currFilterObj))
      this.$forceUpdate()
    },
    // 取消
    cancelClick (currFilterObj) {
      // 取消时，当最后一个没有输入值时，移除
      let lastKeyValue = this.modelValues[this.modelValues.length - 1].value
      if (!lastKeyValue && lastKeyValue !== 0) {
        this.modelValues.splice(this.modelValues.length - 1, 1)
      }
      this.show_filter_values_pop = false
      this.resetCurrFilterObj()
    },
    inputVal () {
      this.$emit('inputVal', this.queryStr)
    },
    onEnter () {
      this.$emit('onEnter')
    },
    setModelValues (data) {
      this.modelValues = data
    }
  },
  components: {
    ntRedio,
    datePickContainer,
    ntCheckbox
  }
}
</script>

<style scoped lang="less">
  .el-input__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
