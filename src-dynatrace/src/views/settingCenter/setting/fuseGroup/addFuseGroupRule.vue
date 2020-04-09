<template>
  <div class="">
    <!-- 表单 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <DYSplitTitle class="title h3-title-mb" :title="'基本信息'"></DYSplitTitle>
      <el-form-item class="default-width" label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="例如：订单相关" :disabled="ruleForm.code==='default'"></el-input>
      </el-form-item>
      <el-form-item class="default-width" label="标识" prop="code">
        <el-input v-model="ruleForm.code" placeholder="例如：order_gp"
                  :disabled="ruleForm.code==='default' || !!ruleForm.id"></el-input>
      </el-form-item>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'移动窗口'"></DYSplitTitle>
      <div class="move-box">
        <div class="progress-per">
          <ntSlider v-model="slider"
                    show-tooltip
                    :min="0"
                    :max="60"
                    :resident-tooltip="true"
                    :marks="{0: '0分钟', 60: '60分钟'}"
                    :format-tooltip="v => v + ' 分钟'"
                    :tooltip-class="'custom-tooltip'"
                    start-tooltip="bottom"
                    @change="changeSlider"
                    class="format_width">
          </ntSlider>
        </div>
      </div>
      <div class="left-right mb16">
        <div class="rolling_window">
          <div>时间粒度：</div>
          <el-form-item class="granularity" prop="granularity">
            <el-select v-model="ruleForm.granularity" @change="onGranularityChange" placeholder="请选择">
              <el-option
                v-for="(item, key) in timeList"
                :key="item"
                :label="item+ ' 分钟(时间粒度) × ' + numList[key]"
                :value="item">
              </el-option>
            </el-select>
            <!-- <el-input class="default-width input-right" v-model="ruleForm.granularity" placeholder="请输入内容"></el-input> -->
          </el-form-item>
          <!--          <div class="unit">分钟</div>-->
        </div>
        <!--        <div class="rolling_window">-->
        <!--          <div>个数：</div>-->
        <!--          <el-form-item class="granularity" prop="rolling_window">-->
        <!--            <el-select v-model="ruleForm.rolling_window" @change="resetTime" placeholder="请选择">-->
        <!--              <el-option-->
        <!--                v-for="item in numList"-->
        <!--                :key="item"-->
        <!--                :label="item"-->
        <!--                :value="item">-->
        <!--              </el-option>-->
        <!--            </el-select>-->
        <!--            &lt;!&ndash; <el-input class="default-width input-right" v-model="ruleForm.rolling_window" placeholder="请输入内容"></el-input> &ndash;&gt;-->
        <!--          </el-form-item>-->
        <!--          <div class="unit">个</div>-->
        <!--        </div>-->
      </div>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'阈值'"></DYSplitTitle>
      <div class="threshold">
        <div>
          <div class="threshold-name el-form-item__label">调用次数阈值</div>
          <div class="move-box">
            <div class="progress-per">
              <ntSlider v-model="ruleForm.threshold"
                        start-tooltip="bottom"
                        show-input
                        :resident-tooltip="true"
                        :show-input-controls="false"
                        :min="0"
                        :max="50"
                        :marks="{0: '0次', 50: '50次'}"
                        :format-tooltip="v => v + ' 次'"
                        class="format_width">
              </ntSlider>

              <div slot="reference" class="default_circle"
                   :style="{'top': '', 'left': `calc(${defaultFuseGroup.threshold / 50} * 440px - 8px)`}"
                   v-if="ruleForm.code !== 'default'"></div>
              <div class="resident-tooltip disabled"
                   :style="{'top': '35px', 'left': `calc(${defaultFuseGroup.threshold / 50} * 440px - 30px)`}"
                   v-if="ruleForm.code !== 'default'">{{this.defaultFuseGroup.threshold}}次
              </div>
            </div>
            <span class="demonstration">次</span>
          </div>
        </div>

        <div>
          <div class="threshold-name el-form-item__label">错误比例阈值</div>
          <div class="move-box">
            <div class="progress-per">
              <ntSlider
                start-tooltip="bottom"
                v-model="ruleForm.err_percent_hundred"
                slider-type="error"
                show-input
                :resident-tooltip="true"
                :show-input-controls="false"
                :min="0"
                :max="100"
                :marks="{0: '0%', 100: '100%'}"
                :format-tooltip="v => v + '%'"
                :tooltip-class="'custom-tooltip'"
                class="format_width">
              </ntSlider>

              <div class="default_circle"
                   :style="{'top': '', 'left': `calc(${defaultFuseGroup.err_percent} * 440px - 8px)`}"
                   v-if="ruleForm.code !== 'default'"></div>
              <div class="resident-tooltip disabled"
                   :style="{'top': '35px', 'left': `calc(${defaultFuseGroup.err_percent} * 440px - 30px)`}"
                   v-if="ruleForm.code !== 'default'">{{parseInt(defaultFuseGroup.err_percent * 100)}}%
              </div>
            </div>
            <span class="demonstration">%</span>
          </div>
        </div>
      </div>

      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'熔断恢复时间设置'"></DYSplitTitle>
      <div class="fuse-time">
        <div class="move-box">
          <div class="slider-box">
            <ntSlider
              start-tooltip="bottom"
              end-tooltip="top"
              v-model="recovery_time_arr"
              range
              :resident-tooltip="true"
              show-tooltip
              :min="0"
              :max="200"
              :marks="{0: '0秒', 200: '200秒'}"
              :format-tooltip="v => v + ' 秒'"
              :tooltip-class="'custom-tooltip'"
              @change="sliderInput"
              class="format_width">
            </ntSlider>
            <div class="slider-left" v-bind:style="{'width': slider_arr[0]}"></div>
            <div class="slider-right" v-bind:style="{'width': slider_arr[1]}"></div>
            <div class="p_end"></div>
            <div class="default_circle"
                 :style="{'top': '', 'left': `calc(${defaultFuseGroup.min_recovery_time / 200 * 100}% - 8px)`}"
                 v-if="ruleForm.code !== 'default'"></div>
            <div class="resident-tooltip disabled"
                 :style="{'top': '35px', 'left': `calc(${defaultFuseGroup.min_recovery_time / 200 * 100}% - 30px)`}"
                 v-if="ruleForm.code !== 'default'">{{this.defaultFuseGroup.min_recovery_time}}秒
            </div>
            <div class="default_circle"
                 :style="{'top': '', 'left': `calc(${defaultFuseGroup.max_recovery_time / 200 * 100}% - 8px)`}"
                 v-if="ruleForm.code !== 'default'"></div>
            <div class="resident-tooltip disabled"
                 :style="{'top': '-25px', 'left': `calc(${defaultFuseGroup.max_recovery_time / 200 * 100}% - 30px)`}"
                 v-if="ruleForm.code !== 'default'">{{this.defaultFuseGroup.max_recovery_time}}秒
            </div>
          </div>
        </div>
        <div class="fuse-item mb16">
          <div>熔断后，经过</div>
          <el-form-item class="granularity" prop="min_recovery_time">
            <el-input-number :controls="false" class="default-width" v-model="ruleForm.min_recovery_time"
                             @change="emitSyncChange('recovery_time')"
            ></el-input-number>
          </el-form-item>
          <div>秒进入半开状态</div>
        </div>
        <div class="fuse-item">
          <div class="space">经过</div>
          <el-form-item class="granularity" prop="max_recovery_time">
            <el-input-number :controls="false" class="default-width" v-model="ruleForm.max_recovery_time"
                             @input="emitSyncChange('recovery_time')"
            ></el-input-number>
          </el-form-item>
          <div>秒自动恢复关闭状态</div>
        </div>
      </div>
      <DYSplitTitle class="title h3-title-mb h3-title-pt" :title="'异常判定类型'"></DYSplitTitle>
      <el-form-item>
        <div class="checkbox">
          <el-checkbox v-model="ruleForm.check_types_arr[0]">HTTP通信异常</el-checkbox>
        </div>
        <el-form-item class="checkbox" prop="need_check_codes" ref="need_check_codes">
          <el-checkbox v-model="ruleForm.check_types_arr[1]">业务功能异常</el-checkbox>
          <div class="text" v-if="ruleForm.check_types_arr[1]">指定异常码</div>

          <div class="sf-tagsinput" v-if="ruleForm.check_types_arr[1]">
            <div class="tagsinput_values">
              <span class="tag_item" v-for="(item, index) in ruleForm.need_check_codes_arr" :key="index">
                <span class="tag_val" v-if="item||item==0">{{item}}</span>
                <span class="tags_remove" v-if="item||item==0" @click="removeTag(index)">
                  <DYIcon type="delete" class="iconClose" size="14"></DYIcon>
                </span>
              </span>
              <div class="tagsinput_input">
                <input ref="tags_input" class="tags_input" type="text" placeholder="请输入指定异常码回车键结束" size="11"
                       @keyup.enter="tagsInputkeyupEnter($event)" v-onlyNumber>
              </div>
            </div>
          </div>

        </el-form-item>
        <div class="checkbox">
          <el-checkbox v-model="ruleForm.check_types_arr[2]">请求响应时间异常</el-checkbox>
          <div class="text" v-if="ruleForm.check_types_arr[2]">响应时间</div>
          <div class="move-box" v-if="ruleForm.check_types_arr[2]">
            <div class="progress-per">
              <ntSlider
                v-model="ruleForm.max_response_time"
                show-input
                :show-input-controls="false"
                :min="0"
                :max="60"
                start-tooltip="bottom"
                :resident-tooltip="true"
                :marks="{0: '0秒', 60: '60秒'}"
                :format-tooltip="v => v + ' 秒'"
                :tooltip-class="'custom-tooltip'"
                class="format_width">
              </ntSlider>
            </div>
            <span class="demonstration">秒</span>
          </div>
        </div>
      </el-form-item>
      <div class="switch_form_item">
        <nt-switch :title="'启用熔断组'" v-model="ruleForm.state" @dyClick="switchChange"></nt-switch>
      </div>
      <div class="btns" v-permission="'settingCenter_fusingGroup_edit'" v-if="!ruleForm.id">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="resetForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
      <div class="btns" v-permission="'settingCenter_fusingGroup_add'" v-else>
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="resetForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import ntSwitch from 'components/base/switch.vue'
import ntSlider from 'components/base/slider/slider.vue'

import {UPDATE_CIRCUIT_BREAKER, UPDATE_DEFAULT_CIRCUIT_BREAKER, UPLOAD_CIRCUIT_BREAKER} from '@/api'

export default {
  data () {
    return {
      selectData: [],
      timeList: [],
      numList: [],
      slider: 0,
      ruleForm: {
        name: '',
        code: '',
        granularity: 0,
        rolling_window: 0,
        threshold: 0,
        err_percent: 0,
        err_percent_hundred: 0,
        min_recovery_time: 0,
        max_recovery_time: 0,
        check_types: '',
        check_types_arr: [false, false, false],
        state: false,
        need_check_codes_arr: []
      },
      recovery_time_arr: [0, 0],
      rules: {
        name: [
          {required: true, message: '名称不能为空！', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '标识不能为空！', trigger: 'blur'}
        ]
      },
      isSubmit: false
    }
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    clientDetails: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    ...mapState(['defaultFuseGroup']),
    slider_arr () {
      return [this.recovery_time_arr[0] * 100 / 200 + '%', (200 - this.recovery_time_arr[1]) * 100 / 200 + '%']
    }
  },
  watch: {
    'recovery_time_arr': {
      handler () {
        [this.ruleForm.min_recovery_time, this.ruleForm.max_recovery_time] = this.recovery_time_arr
      },
      deep: true
    }
  },
  methods: {
    // 同步输入框与拖动条
    emitSyncChange (type) {
      if (type === 'recovery_time') {
        this.recovery_time_arr = [this.ruleForm.min_recovery_time, this.ruleForm.max_recovery_time]
      }
    },

    changeSlider (val) {
      this.timeList = []
      this.numList = []
      for (let i = 1; i <= val; i++) {
        if ((val / i) % 1 === 0) {
          this.timeList.push(i)
          this.numList.push(val / i)
        }
      }
      this.slider = val; // 在此赋值，是为了防止拖动之后，标点会跳回到初始值0

      [this.ruleForm.granularity, this.ruleForm.rolling_window] = this.timeList
    },

    onGranularityChange (value) {
      // 查找index
      const index = this.timeList.findIndex(x => x === value)

      this.ruleForm.rolling_window = this.numList[index]
    },
    // resetTime (val) {
    //   if (val) {
    //     this.ruleForm.granularity = this.slider / val
    //   }
    // },
    switchChange () {
      this.ruleForm.state = !this.ruleForm.state
    },
    recordCreate () {
    },
    recordUpdata () {
    },
    submitForm (formName) {
      this.isSubmit = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          if (this.ruleForm.id) {
            // 修改
            let data = {
              circuit_breaker_id: this.ruleForm.id,
              name: this.ruleForm.name,
              code: this.ruleForm.code,
              granularity: parseInt(this.ruleForm.granularity),
              rolling_window: parseInt(this.ruleForm.rolling_window),
              threshold: parseInt(this.ruleForm.threshold),
              err_percent: parseInt(this.ruleForm.err_percent_hundred) / 100,
              min_recovery_time: parseInt(this.ruleForm.min_recovery_time),
              max_recovery_time: parseInt(this.ruleForm.max_recovery_time),
              state: this.ruleForm.state
            }
            let checkTypesArr = []
            if (this.ruleForm.check_types_arr[0]) checkTypesArr.push('http_code')
            if (this.ruleForm.check_types_arr[1]) checkTypesArr.push('status_code')
            if (this.ruleForm.check_types_arr[2]) checkTypesArr.push('response_time')
            data.check_types = checkTypesArr.join(',')
            if (this.ruleForm.check_types_arr[1]) {
              data.need_check_codes = this.ruleForm.need_check_codes_arr + ''
            }
            if (this.ruleForm.check_types_arr[2]) {
              data.max_response_time = this.ruleForm.max_response_time
            }
            console.log(data)
            UPDATE_CIRCUIT_BREAKER(data).then(res => {
              this.$emit('saveContent', this.ruleForm)
              this.$emit('cancelContent')
            })
          } else {
            if (this.ruleForm.type === 'default') {
              // 修改
              let data = {
                granularity: parseInt(this.ruleForm.granularity),
                rolling_window: parseInt(this.ruleForm.rolling_window),
                threshold: parseInt(this.ruleForm.threshold),
                err_percent: parseInt(this.ruleForm.err_percent_hundred) / 100,
                min_recovery_time: parseInt(this.ruleForm.min_recovery_time),
                max_recovery_time: parseInt(this.ruleForm.max_recovery_time)
              }
              let checkTypesArr = []
              if (this.ruleForm.check_types_arr[0]) checkTypesArr.push('http_code')
              if (this.ruleForm.check_types_arr[1]) checkTypesArr.push('status_code')
              if (this.ruleForm.check_types_arr[2]) checkTypesArr.push('response_time')
              data.check_types = checkTypesArr.join(',')
              if (this.ruleForm.check_types_arr[1]) {
                data.need_check_codes = this.ruleForm.need_check_codes_arr + ''
              }
              if (this.ruleForm.check_types_arr[2]) {
                data.max_response_time = this.ruleForm.max_response_time
              }
              UPDATE_DEFAULT_CIRCUIT_BREAKER(data).then(res => {
                this.$emit('saveContent', this.ruleForm)
                this.$emit('cancelContent')
              })
            } else {
              // 新增
              let data = {
                name: this.ruleForm.name,
                code: this.ruleForm.code,
                granularity: parseInt(this.ruleForm.granularity),
                rolling_window: parseInt(this.ruleForm.rolling_window),
                threshold: parseInt(this.ruleForm.threshold),
                err_percent: parseInt(this.ruleForm.err_percent_hundred) / 100,
                min_recovery_time: parseInt(this.ruleForm.min_recovery_time),
                max_recovery_time: parseInt(this.ruleForm.max_recovery_time),
                state: this.ruleForm.state
              }
              let checkTypesArr = []
              if (this.ruleForm.check_types_arr[0]) checkTypesArr.push('http_code')
              if (this.ruleForm.check_types_arr[1]) checkTypesArr.push('status_code')
              if (this.ruleForm.check_types_arr[2]) checkTypesArr.push('response_time')
              data.check_types = checkTypesArr.join(',')
              if (this.ruleForm.check_types_arr[1]) {
                data.need_check_codes = this.ruleForm.need_check_codes_arr + ''
              }
              if (this.ruleForm.check_types_arr[2]) {
                data.max_response_time = this.ruleForm.max_response_time
              }
              console.log(data)
              UPLOAD_CIRCUIT_BREAKER(data).then(res => {
                this.$emit('submitContent')
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.recovery_time_arr = [0, 0]
      this.$emit('cancelContent')
    },
    sliderInput () {

    },
    // 状态码tagsInput
    tagsInputkeyupEnter (event) {
      let value = JSON.parse(JSON.stringify(event.target.value))
      if (!this.ruleForm.need_check_codes_arr.length) {
        this.$refs.need_check_codes.resetField()
      }
      event.target.value = ''
      if (value && this.ruleForm.need_check_codes_arr.indexOf(value) < 0) {
        this.ruleForm.need_check_codes_arr.push(value)
      }
    },
    removeTag (idx) {
      this.ruleForm.need_check_codes_arr.splice(idx, 1)
    }
  },
  readFunc () {
    UPLOAD_CIRCUIT_BREAKER({}).then(res => {
    })
    UPDATE_CIRCUIT_BREAKER({}).then(res => {
    })
  },
  mounted () {
    console.log('clientDetails', this.clientDetails)
    if (this.clientDetails) {
      let ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
      ruleForm.err_percent_hundred = parseInt(ruleForm.err_percent * 100)
      let checkTypesArr = ruleForm.check_types.split(',')
      ruleForm.check_types_arr = [false, false, false]
      ruleForm.need_check_codes_arr = ruleForm.need_check_codes.split(',')
      checkTypesArr.forEach(x => {
        if (x === 'http_code') ruleForm.check_types_arr[0] = true
        if (x === 'status_code') ruleForm.check_types_arr[1] = true
        if (x === 'response_time') ruleForm.check_types_arr[2] = true
      })
      this.recovery_time_arr = [ruleForm.min_recovery_time, ruleForm.max_recovery_time]
      console.log(ruleForm)
      this.slider = ruleForm.rolling_window * ruleForm.granularity

      // 直接触发一次时间粒度事件
      this.changeSlider(ruleForm.rolling_window)

      this.ruleForm = ruleForm
    }
  },
  created () {
  },
  components: {
    ntSwitch,
    ntSlider
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  @default-width: 425px;
  .default-width {
    width: @default-width;
  }

  .tilte {
    margin-bottom: 10px;
  }

  .eventTitle {
    font-size: 20px;
    font-weight: 500;
    line-height: 29px;
    margin-bottom: 26px;
  }

  .select {
    margin-bottom: 30px;
    width: @default-width;
  }

  .move-box {
    // margin: 44px 0;
    padding-left: 15px;
    width: 640px;
    min-height: 60px;
    display: flex;

    .progress-per {
      position: relative;
      margin-left: 8px;
      width: 600px;
      height: 100px;

      .format_width {
        width: 100%;
        float: left;
      }

      .default_circle {
        position: absolute;
        top: 13px;
        left: 0;
        width: 16px;
        height: 16px;
        border: 2px solid @turq-06;
        background-color: @turq-06;
        border-radius: 50%;
        opacity: 0.5;
      }

    }

    .demonstration {
      line-height: 38px;
      margin-left: 10px;
    }
  }

  .left-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 625px;

    .rolling_window {
      display: flex;
      align-items: center;

      .el-form-item {
        margin: 0;
      }

      .default-width {
        width: 122px;
      }

      .unit {
        margin-left: 4px;
      }
    }
  }

  .threshold {
    .threshold-name {
      // margin-top: 31px;
    }
  }

  .fuse-time {
    .progress-bar {
      display: flex;
      align-items: center;
      width: 600px;
      height: 120px;

      .p_head {
        width: 38px;
        font-size: 18px;
      }

      .progress {
        position: relative;
        display: flex;
        align-items: center;
        width: 90%;
        height: 120px;

        .one {
          width: 30%;
          height: 10px;
          background: rgba(220, 23, 42, 1);
        }

        .two {
          width: 30%;
          height: 10px;
          background: rgba(255, 225, 28, 1);
        }

        .three {
          width: 40%;
          height: 10px;
          background: rgba(42, 176, 111, 1);
        }

        .des-one {
          position: absolute;
          top: 48px;
          left: 30%;
          transform: translateX(-11px);
          width: 22px;
          height: 22px;
          background: rgb(0, 161, 178);
          border: 2px solid #fff;
          border-radius: 100%;

          .triangle {
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 8px solid rgb(0, 161, 178);
          }

          .ppo_desc {
            position: absolute;
            top: 28px;
            left: -22px;
            width: 61px;
            height: 25px;
            background: rgb(0, 161, 178);
            border: 1px solid rgb(0, 161, 178);
            border-radius: @default-border-radius;
            font-size: 10px;
            color: rgba(255, 255, 255, 1);
            line-height: 25px;
            text-align: center;
          }
        }

        .des-two {
          position: absolute;
          top: 48px;
          left: 60%;
          transform: translateX(-11px);
          width: 22px;
          height: 22px;
          background: rgb(0, 161, 178);
          border: 2px solid #fff;
          border-radius: 100%;

          .triangle {
            position: absolute;
            top: -10px;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: 0;
            height: 0;
            border-top: 8px solid rgb(0, 161, 178);
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
          }

          .ppt_desc {
            position: absolute;
            top: -35px;
            left: -22px;
            width: 61px;
            height: 25px;
            background: rgb(0, 161, 178);
            border: 1px solid rgb(0, 161, 178);
            border-radius: @default-border-radius;
            font-size: 10px;
            color: rgba(255, 255, 255, 1);
            line-height: 25px;
            text-align: center;
          }
        }
      }

      .p_end {
        margin-left: 5px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid rgba(42, 176, 111, 1);
      }
    }

    .fuse-item {
      display: flex;
      align-items: center;

      &:last-child {
        margin-bottom: 16px;
      }

      .space {
        padding-left: 55px;
      }

      .default-width {
        width: 122px;
      }

      .granularity {
        margin: 0 5px;
      }
    }
  }

  .checkbox {
    padding: 5px 0;
    margin: 0;

    .text {
      margin-left: 25px;
    }

    .move-box {
      margin: 5px 0 5px 25px;
    }

    .sf-tagsinput {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding-bottom: 0;
      margin-bottom: 10px;
      padding-left: 15px;
      width: 80%;
      min-height: 32px;
      border: 1px solid @gray-04;
      border-radius: @default-border-radius;
      background-color: #fff;
      margin-left: 25px;

      .tagsinput_values {
        display: flex;
        flex-wrap: wrap;
        flex: 1;

        .tag_item {
          display: flex;
          align-items: center;
          height: 26px;
          border-radius: @default-border-radius;
          border: 1px solid rgba(230, 230, 230, 1);
          background-color: @gray-02;
          font-weight: 400;
          color: rgba(137, 137, 137, 1);
          font-size: 12px;
          line-height: 18px;
          padding-left: 4px;
          padding-right: 5px;
          margin-right: 5px;
          margin-top: 1px;

          &.no_value_key {
            border: 0;
            background-color: rgba(0, 0, 0, 0);
          }

          .tag_key {
            white-space: nowrap;
          }

          .tag_val {
            color: rgba(0, 161, 178, 1);
            max-width: 220px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .tags_remove {
            cursor: pointer;
            margin-left: 5px;
            line-height: 15px;

            .iconClose {
              font-weight: bolder;
              color: rgba(0, 161, 178, 1);
            }
          }
        }
      }

      .tagsinput_input {
        flex: 1;
        position: relative;
        min-width: 60px;
        display: flex;
        align-items: center;

        input {
          width: 100%;
          height: 28px;
          border: 0;
        }

        .filter_keys_pop {
          position: absolute;
          left: 0;
          top: 28px;
          min-width: 115px;
          border: 1px solid @gray-04;
          z-index: 9;

          .key_item {
            width: 100%;
            height: 28px;
            background-color: rgba(255, 255, 255, 1);
            font-size: 12px;
            line-height: 28px;
            padding: 0 12px;

            &:hover {
              background-color: rgba(225, 247, 249, 1);
            }
          }
        }

        .filter_values_pop {
          position: absolute;
          left: 0;
          top: 28px;
          min-width: 200px;
          border: 1px solid rgba(160, 160, 160, 1);
          background-color: #fff;
          z-index: 9;

          .container {
            .pop-body {
              max-height: 300px;
              overflow-y: auto;
            }

            .radio-list {
              flex-direction: column;
              padding: 7px;

              .radio-item {
                white-space: nowrap;
                width: 100%;
                text-align: left;
                height: 48px;
                padding-left: 7px;

                label {
                  line-height: 20px;
                }
              }
            }

            .dy-checkbox {
              flex-direction: column;
              padding: 8px 7px;

              .checkbox-item {
                width: 100% !important;
                min-height: 48px;

                input {
                  height: unset;
                }
              }
            }

            .select_custom_input-section {
              position: relative;
              min-width: 370px;

              .custom_input_box {
                position: absolute;
                bottom: 16px;
                right: 7px;

                input {
                  width: 160px;
                  padding: 0 15px;
                  height: 32px;
                  border-radius: @default-border-radius;
                  background: rgba(242, 242, 242, 1);
                  border: 1px solid rgba(201, 201, 201, 1);
                }
              }
            }

            .filter_input-section {
              display: flex;
              align-items: center;
              padding: 8px 17px;
              min-width: 260px;

              input {
                height: 32px;
                border: 1px solid rgba(201, 201, 201, 1);
                background-color: #fff;
                border-radius: @default-border-radius;
                margin: 0 6px;
                padding: 0 15px;
              }
            }

            .bottom {
              margin-bottom: 10px;
              padding: 0 7px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            }
          }
        }

        .vergeOfEdge {
          left: unset !important;
          right: 0 !important;
        }
      }
    }
  }

</style>

<!-- 此处是全局样式 -->
<style lang="less">
  @import "~common/style/variable";

  .input-right {
    .el-input__inner {
      text-align: right;
    }
  }

  .el-slider__marks-text {
    white-space: nowrap;
  }

  .fuse-time {
    .move-box {
      margin-left: 8px;
      width: 93%;
      height: 60px;
      margin-top: 30px;
      margin-bottom: 40px;

      .slider-box {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;

        .default_circle {
          position: absolute;
          top: 13px;
          left: 0;
          width: 16px;
          height: 16px;
          border: 2px solid @turq-06;
          background-color: @turq-06;
          border-radius: 50%;
          opacity: 0.5;
        }

      }

      .format_width {
        width: 100%;
        height: 100%;
      }

      .p_end {
        position: absolute;
        top: 10.5px;
        right: -15px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #2AB06F;
      }

      .slider-left {
        position: absolute;
        top: 16px;
        left: 0;
        width: 0;
        height: 10px;
        background: @red-05;
      }

      .slider-right {
        position: absolute;
        top: 16px;
        right: 0;
        width: 0;
        height: 10px;
        background: #2AB06F;
      }

      .el-slider__bar {
        background: @warning-color;
      }
    }
  }

  .el-checkbox__label {
    color: #000 !important;
    font-weight: 400;
  }
</style>
