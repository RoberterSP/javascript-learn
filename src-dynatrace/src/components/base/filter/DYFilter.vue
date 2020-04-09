<template>
  <div class="dy-filter" :disabled="computedDisabled">
    <label class="dy-filter-label" :for="inputId">
      <DYIcon type="filter" class="ml4 mr4"/>
      <span class="label-text no-warp">{{labelText}}</span>
    </label>

    <DYTag
      class="mr8 tag-item"
      radius-type="small"
      v-for="(tag, index) in selectedTags" :key="tag.value + index"
      @click="deleteTag(index)"
    >
      <span class="tag-key no-warp">{{tag.keyName}}</span>
      <span class="colon">：</span>
      <span v-if="tag.operator" class="mr8">{{tag.operator}}</span>
      <span class="tag-value ellipsis" v-if="tag.valueName">{{Array.isArray(tag.valueName) ? tag.valueName.join(',') : tag.valueName}}</span>
      <span class="tag-delete">
        <DYIcon actions type="delete"/>
      </span>
    </DYTag>

    <label class="temp-tag-key">{{currentSelected.label}}</label>

    <div class="dy-filter-input">
      <input
        :id="inputId"
        ref="filterInput"
        type="text"
        autocomplete="off"
        class="input-box"
        v-model="value"
        :typeof="currentSelected.input_type || 'text'"
        :placeholder="placeholder"
        :disabled="computedDisabled"
        @input="onInputChange"
        @keypress.enter="onInputEnter"
        @focus="openPopup"/>

      <!-- 快捷搜索弹框 -->
      <transition name="rollup">
        <!-- 输入框有值，且不在 选择中 状态的时候，认为是快捷搜索 -->
        <div class="input-popup" v-if="value.trim() !== '' && !currentSelected.value && !!quickSearch">
          <div class="item-list">
            <div class="item" @click="onQuickSearchClick">
              <span>{{quickSearch.label}}: </span>
              {{value}}
            </div>
          </div>
        </div>
      </transition>

      <transition name="rollup">
        <div class="input-popup" v-if="showPopup">

          <!-- key 选择 -->
          <div v-if="!currentSelected.value">
            <div class="item-list">
              <div class="item" v-for="item in computedFilterKeys" :key="item.value" @click="onKeyClick(item)">
                {{item.label}}
              </div>
            </div>
          </div>

          <!-- value 选择 -->
          <template v-else>
            <!-- 普通选择类型  -->
            <template v-if="currentSelected.type === 'select_obj'">
              <!-- 普通单选 -->
              <div class="item-list" v-if="!currentSelected.isMultiple">
                <EmptyState v-if="computedFilterValues.length === 0"/>

                <template v-else>
                  <div class="item" v-for="item in computedFilterValues" :key="item.value" @click="onValueClick(item)">
                    {{item.label}}
                  </div>
                </template>
              </div>

              <!-- 多选 -->
              <div class="item-list" v-else-if="currentSelected.isMultiple">
                <div class="item" v-for="item in computedFilterValues" :key="item.value" @click="onValueClick(item)">
                  {{item.label}}
                </div>
              </div>
            </template>

            <!-- 操作符模式 -->
            <template v-else-if="currentSelected.type === 'select_obj_operator'">
              <div class="item-list">
                <div class="item input-display empty-state" v-if="currentSelected.waitCustomValueInput">
                  <template v-if="!currentSelected.inputType || currentSelected.inputType === 'input'">
                    <span class="mr8">{{currentSelected.operator}}</span> {{value || '请输入自定义值'}}
                  </template>

                  <template v-if="currentSelected.inputType === 'tag'">
                    <el-select
                      v-model="operatorTagValues"
                      multiple
                      remote
                      filterable
                      allow-create
                      default-first-option />

                    <DYButton class="ml8" @click="onOperatorTagClick">确定</DYButton>
                  </template>
                </div>

                <EmptyState v-else-if="computedFilterValues.length === 0"/>

                <template v-else>
                  <div class="item" v-for="item in computedFilterValues" :key="item.value" @click="onValueClick(item)">
                    {{item.label}}
                  </div>
                </template>
              </div>
            </template>

            <!-- 普通文本输入类型 -->
            <template v-else-if="currentSelected.type === 'input'">
              <!-- 如果存在前后缀单位， 显示此预览框 -->
              <div class="item-list">
                <div class="item input-display empty-state">
                  <div class="input-unit mr8" v-if="currentSelected.unit">{{currentSelected.opt_symbol}}</div>
                  <div class="input-text">{{value || '请输入自定义值'}}</div>
                  <span class="input-unit ml8" v-if="currentSelected.opt_symbol">{{currentSelected.unit}}</span>
                </div>
              </div>
            </template>

            <!-- 选择 + input 的类型 -->
            <template v-else-if="currentSelected.type === 'select_custom_input_obj'">
              <div class="item-list">
                <div class="item input-display empty-state" v-if="currentSelected.waitCustomValueInput">
                  {{value || '请输入自定义值'}}
                </div>

                <EmptyState v-else-if="computedFilterValues.length === 0"/>

                <template v-else>
                  <div class="item" v-for="item in computedFilterValues" :key="item.value" @click="onValueClick(item)">
                    {{item.label}}
                  </div>
                </template>
              </div>
            </template>

            <!-- 时间模式 -->
            <template v-else-if="currentSelected.type === 'time'">
              <datePickContainer
                :show="true"
                :propsCurrTab="'custom'"
                theme="light"
                adsorbArrow="left"
                @onClickSure="onTimePickClickSure"
                ref="datePick" />
            </template>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import {filter, findIndex, uniqueId, clone} from 'lodash'
import datePickContainer from '@/components/navigation/datePickContainer.vue'
import moment from 'moment'

export default {
  name: 'DYFilter',
  data () {
    return {
      value: '',
      currentSelected: {}, // 是否在选择中，如果存在，就是只选了key 还没选value， 代表是选择中状态
      selectedTags: [],
      inputId: 'dy-filter-input',
      showPopup: false,
      currentValueList: [],
      isUpdate: false,

      operatorTagValues: []
    }
  },
  props: {
    labelText: {
      type: String,
      default: '过滤条件'
    },

    // filter 的汇总列表
    filterKeys: {
      type: Array,
      default: () => ([])
    },

    // 初始的 tag
    filtersModel: {
      type: Array,
      default: () => ([])
    },

    // 快捷搜索
    quickSearch: {
      type: Object | Boolean,
      default: () => ({
        label: '名称',
        key: 'name'
      })
    },

    placeholder: {
      type: String,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedFilterKeys () {
      // 旧格式兼容
      const filterKeys = this.filterKeys.map(item => ({
        ...item,
        label: item.name,
        value: item.code
      }))

      return filter(filterKeys, item => !this.selectedTags.some(tag => tag.key === item.value))
    },
    computedFilterValues () {
      return filter(this.currentValueList, item => item.label.includes(this.value))
    },
    computedDisabled () {
      // 当props 的disabled true， 或者选完了，都设置为disabled
      return this.disabled || (this.computedFilterKeys.length === 0 && !this.currentSelected.value)
    }
  },
  watch: {
    filtersModel: {
      handler (val) {
        this.selectedTags = val.map(item => ({
          key: item.code,
          keyName: item.key,
          value: item.value,
          valueName: item.value_label
        }))
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 当快捷搜索被点击
    onQuickSearchClick () {
      // 添加tag，默认为 selected
      this.addTag({
        key: this.quickSearch.key,
        keyName: this.quickSearch.label,
        value: this.value,
        valueName: this.value
      })

      // 重置 value
      this.value = ''

      // 通知父级
      this.emitData()
    },

    onKeyClick (item) {
      this.currentSelected = clone(item)

      this.currentValueList = item.list

      // 聚焦 input
      this.$refs.filterInput.focus()
    },

    // 列表选择类型的选择事件
    onValueClick (item) {
      const {type, isMultiple} = this.currentSelected

      const selectHandle = (add = {}) => {
        this.addTag({
          key: this.currentSelected.value,
          keyName: this.currentSelected.label,
          value: item.value,
          valueName: item.label,
          ...add
        })

        this.afterAddTag()
      }

      // 如果是多选，只添加tag，不执行其他
      if (type === 'select_obj' && isMultiple) {
        // 如果目前在选择状态中， 则只添加到 tag 的 value 和 valueName 数组
        // this.addTag({
        //   key: this.currentSelected.value,
        //   keyName: this.currentSelected.label,
        //   value: item.value,
        //   valueName: item.label
        // })

        // 普通单选
      } else if (type === 'select_obj' && !isMultiple) {
        selectHandle()

        // 通知父级 change 事件
        // this.emitData('change')

        // 自定义输入值的
      } else if (type === 'select_custom_input_obj') {
        if (item.value !== 'custom') {
          selectHandle()
        } else {
          this.$set(this.currentSelected, 'waitCustomValueInput', true)

          this.$refs.filterInput.focus()
        }

        // 单选 带操作符
      } else if (type === 'select_obj_operator') {
        if (item.haveInput) {
          this.$set(this.currentSelected, 'waitCustomValueInput', true)
          this.$set(this.currentSelected, 'operator', item.value)
          this.$set(this.currentSelected, 'inputType', item.inputType)

          this.$refs.filterInput.focus()
        } else {
          this.$set(this.currentSelected, 'operator', item.value)

          selectHandle({
            operator: item.value,
            inputType: item.inputType,
            valueName: ''
          })
        }
      }

      // 清空输入的 input 的 value
      this.value = ''
    },

    onInputChange () {
      // 如果输入框存在值，则进入判断
      if (this.value.trim() !== '') {
        // 第一种情况， 不在tag 选择过程中, 并且 开启了 quickSearch，认为是快捷搜索
        if (!this.currentSelected.value && !!this.quickSearch) {
          // 关闭 popup

          if (this.showPopup) this.closePopup()
        }

        // 删除完 value 后， 打开 popup
      } else if (this.value.trim() === '') {
        this.openPopup()
      }
    },

    // input 的 enter 事件
    onInputEnter () {
      // 如果开启了快捷搜索且在快捷搜索当中
      if (this.value.trim() !== '' && !this.currentSelected.value && !this.quickSearch) {
        this.onQuickSearchClick()
      }

      const pushInputHandle = (add = {}) => {
        this.addTag({
          key: this.currentSelected.value,
          keyName: this.currentSelected.label,
          value: this.value,
          valueName: this.value,
          ...add
        })

        this.afterAddTag()
      }

      // 如果当前是 input 类型
      if (this.currentSelected.type === 'input') {
        pushInputHandle()
      } else if (this.currentSelected.type === 'select_custom_input_obj' && this.currentSelected.waitCustomValueInput) {
        // 如果是自定义选择栏目， 且进入了等待用户输入状态
        pushInputHandle()
      } else if (this.currentSelected.type === 'select_obj_operator' && this.currentSelected.waitCustomValueInput && (!this.currentSelected.inputType || this.currentSelected.input)) {
        // 如果是自定义操作符模式，且是普通输入类型， 且进入了等待用户输入状态
        pushInputHandle({
          operator: this.currentSelected.operator
        })
      }
    },

    // 当确定 operator 模式的tag 选择后
    onOperatorTagClick () {
      const value = clone(this.operatorTagValues)

      this.addTag({
        key: this.currentSelected.value,
        keyName: this.currentSelected.label,
        operator: this.currentSelected.operator,
        value: this.value,
        valueName: value
      })

      this.afterAddTag()
    },

    // 当 点击了 time 模式后的确定后
    onTimePickClickSure (event) {
      const timeObj = {
        startTime: +event.start_time,
        endTime: +event.end_time
      }

      this.addTag({
        key: this.currentSelected.value,
        keyName: this.currentSelected.label,
        value: timeObj,
        valueName: `${moment(timeObj.startTime).format('YYYY-MM-DD HH:mm')} 至 ${moment(timeObj.endTime).format('YYYY-MM-DD HH:mm')}`
      })

      this.afterAddTag()
    },

    openPopup () {
      // 打开的时候，初始化 isUpdate 为false
      this.isUpdate = false

      // 绑定全局事件
      document.body.addEventListener('click', this.bodyClickHandle, true)
      this.showPopup = true
    },

    closePopup () {
      this.showPopup = false

      // 关闭弹出层的时候， 通知父级
      this.emitData()

      // close 的时候也要清除tempLabel
      // 重置缓存key value
      this.resetCurrentSelected()

      this.operatorTagValues = []

      document.body.removeEventListener('click', this.bodyClickHandle, true)
    },

    resetCurrentSelected () {
      this.currentSelected = {}
    },

    // 新增一个 tag， 在选择完成后新增
    addTag (item) {
      // 不添加重复的 key
      const findKeyIndex = findIndex(this.selectedTags, tag => tag.key === item.key)

      // 不存在，直接添加
      if (findKeyIndex === -1) {
        this.selectedTags.push(item)

        this.isUpdate = true
      } else {
        // 存在，修改
        this.$set(this.selectedTags, findKeyIndex, item)
      }
    },

    // 删除一个tag
    deleteTag (index) {
      this.selectedTags.splice(index, 1)

      this.isUpdate = true

      // 通知父级
      this.emitData()
    },

    // emit 父级
    emitData (eventName = 'returnFilterFunc') {
      if (this.isUpdate) {
        const emitData = this.getEmitData()

        this.$emit(eventName, emitData)
      }
    },

    // 获取 emit数据
    getEmitData () {
      // 构建返回数据

      /*
        * {
          key: this.getNameKey,
          code: 'name',
          value: this.nameQueryVal,
          value_label: this.nameQueryVal
        }
        * */

      const returnData = this.selectedTags.map(item => ({
        key: item.keyName,
        code: item.key,
        value: item.operator || item.value, // 如果是操作符模式，value 就是操作符
        value_label: item.valueName
      }))

      return returnData
    },

    afterAddTag () {
      // 重置缓存key value
      this.resetCurrentSelected()

      // 重置 input
      this.value = ''

      // 重置tag 多选
      this.operatorTagValues = []

      // 最后一个key value 选择完成后，关闭 popup
      if (this.computedFilterKeys.length === 0) {
        this.closePopup()
      }
    },

    bodyClickHandle (event) {
      // 判断是否点击的是当前元素
      const isFromSelf = this.checkSelf(event.target, this.$el)

      if (!isFromSelf) {
        this.closePopup()
      }
    },

    checkSelf (element, targetElement) {
      // 判断 当面的element 是否等于 targetElement
      if (element === null || element === targetElement) {
        return true
      }

      // 到body 的时候返回 false
      if (element.tagName === 'BODY') {
        return false
      }

      return this.checkSelf(element.parentNode, targetElement)
    }
  },
  created () {
    this.inputId = uniqueId(this.inputId)
  },
  mounted () {

  },
  destroyed () {
    document.body.removeEventListener('click', this.bodyClickHandle, true)
  },
  components: {
    datePickContainer,
    EmptyState: {
      functional: true,
      props: {
        label: String
      },
      render (h, context) {
        return (
          <div class="item empty-state">{context.props.label || '无数据'}</div>
        )
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable.less";

  .dy-disabled() {
    background-color: @gray-01;
  }

  .dy-filter {
    background-color: @gray-00;
    border-radius: @default-border-radius;
    border: 1px solid @gray-04;
    padding: 0 14px;
    min-height: 32px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &[disabled] {
      .dy-disabled();
    }

    &-label {
      line-height: 12px;
      color: @gray-06;

      .label-text {
        margin: 0 4px;
      }
    }

    .temp-tag-key {
      line-height: 12px;
      margin: 0 4px;
      color: @gray-06;
    }

    .tag-item {
      margin: 3px 4px;
      max-width: 400px;

      .tag-key {
        color: @gray-06;
      }

      .tag-value {
        color: @turq-06;
      }

      .tag-delete {
        font-size: 17px;
        margin-left: 3px;
      }
    }

    &-input {
      display: inline-block;
      position: relative;
      flex: 1;

      .input-box {
        border: none;
        width: 100%;

        &[disabled] {
          cursor: not-allowed;
          .dy-disabled();
        }

        /*&::placeholder {*/
        /*  font-size: 12px;*/
        /*}*/
      }
    }

    .input-popup {
      position: absolute;
      background: @gray-00;
      min-width: 113px;
      top: 25px;
      font-size: 12px;
      z-index: @popup-z-index;
    }

    .item-list {
      border: 1px solid @gray-04;
      width: 100%;
      max-height: 198px;
      overflow-y: auto;
      overscroll-behavior-y: contain;

      .item {
        padding: 8px 12px;
        cursor: pointer;

        &:not(.empty-state):hover {
          background-color: @turq-01;
        }
      }

      .input-display {
        display: inline-flex;
      }
    }
  }
</style>
