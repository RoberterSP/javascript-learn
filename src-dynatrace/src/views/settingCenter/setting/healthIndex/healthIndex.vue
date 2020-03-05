<template>
  <div class="health-index p10">
    <h2>健康水平</h2>
    <div class="default-label">在指定时间内根据健康规则判定的满意度样本来计算健康指数，计算公式为:</div>
    <div class="default-label">
      健康指数 =  ( 满意样本数量 + 0.5 * 容忍数量 ) / 总样本数 *100
    </div>

    <!-- <split-title class="title" :title="'健康水平'"></split-title> -->
    <div class="desc default-label">根据健康指数来划分健康水平等级</div>
    <div class="move-box" ref="moveBoxNode">
      <div class="slider-box">
        <ntSlider
          v-model="health_index_arr"
          sliderType="wraning"
          range
          show-tooltip
          :resident-tooltip="true"
          :min="0"
          :max="100"
          :marks="{0: '0分', 100: ''}"
          :format-tooltip="v => v + ' 分'"
          :tooltip-class="'custom-tooltip'"
          @change="sliderInput"
          class="format_width">
        </ntSlider>
        <div class="slider-left" v-bind:style="{'width': slider_arr[0]}"></div>
        <div class="slider-right" v-bind:style="{'width': slider_arr[1]}"></div>
        <div class="p_end"></div>

      </div>
    </div>
    <div class="table_list">
      <el-table
        :data="health_index_configs"
        style="width: 100%">
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :align="column.align"
          :width="column.width">
          <template slot="header" slot-scope="scope">
            <div class="flex header-style">
              <div class="split" v-if="index > 0"></div>
              <div class="tab-title default-label">{{column.name}}</div>
              <div class="split" v-if="index === 0"></div>
            </div>
          </template>

          <template slot-scope="scope">
            <div class="tab-title tab-first default-label" v-if="index === 0">
              <i class="iconfont iconmanyi green" v-if="scope.row.code === 'health_index_normal'"></i>
              <i class="iconfont iconyiban yellow" v-else-if="scope.row.code === 'health_index_warn'"></i>
              <i class="iconfont iconshiwang red" v-else></i>
              {{scope.row.name}}
            </div>
            <div class="tab-title default-label" v-if="index === 1 && scope.row.code !== 'health_index_error'">
              <div class="input_handle">
                <el-input v-model="scope.row.min_value" placeholder="请输入内容" class="input_width"
                          @input="inputVal(scope.row)"
                          onkeyup="if(! /^\d+$/.test(this.value)){this.value='';};if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};"
                          onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};"
                          @blur="invalidData(scope.row)"
                ></el-input>
                <span class="pl8">分</span>
              </div>
            </div>
            <div class="tab-title default-label" v-if="index === 1 && scope.row.code === 'health_index_error'">
              {{scope.row.min_value}}分
            </div>
            <div class="tab-title default-label" v-if="index === 2">&lt; {{scope.row.max_value}}<span
              class="pl8">分</span></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="unit-time default-label">单位响应时间</div>
    <div class="unit-time-content default-label">
      <div v-if="!globalEdit">1T = {{global_setting_info.apdex}}ms
        <div class="iconfont iconedit2" @click="editGlobal"></div>
      </div>
      <div v-else>1T=
        <el-input class="uc-input" id="uc_input" v-model="global_setting_info.apdex" align="right"></el-input>
        ms
      </div>
    </div> -->
    <div class="footer" v-permission="'settingCenter_healthIndex_edit'">
      <el-button type="primary" @click="saveForm" :disabled="!isEdit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import splitTitle from 'components/splitTitle/splitTitle.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import ntSlider from 'components/base/slider/slider.vue'
import {
  GET_GLOBAL_SETTING,
  NXDF_SETTING_GLOBAL_SETTING_UPDATE_GET,
  NXDF_SETTING_HEALTH_INDEX_INFO_GET,
  NXDF_SETTING_HEALTH_INDEX_UPDATE_GET
} from '@/api'
//
// const DEFAULT_VALUE = {
//   START: 70,
//   END: 85
// }

export default {
  data () {
    return {
      loaded: false,
      unit_time: 3,
      health_index_configs: [],
      health_index_arr: [0, 0],
      health_index_arrBk: [0, 0],
      // defaultValue: {
      //   pointStart: DEFAULT_VALUE.START,
      //   boxStart: DEFAULT_VALUE.START,
      //   pointEnd: DEFAULT_VALUE.END,
      //   boxEnd: DEFAULT_VALUE.END,
      //   ...DEFAULT_VALUE
      // },
      columns: [
        {
          name: '健康水平等级', // 表头名
          code: 'name',
          type: 'text'
        }, {
          name: '健康指数从', // 表头名字
          code: 'min_value', // 表身显示值
          type: 'text'
        }, {
          name: '至', // 表头名字
          code: 'max_value', // 表身显示值
          type: 'text'
        }
      ],
      global_setting_info: false,
      global_setting_infoBk: false,
      isEdit: false,
      globalEdit: false
    }
  },
  methods: {
    cancel () {
      this.isEdit = false
      this.globalEdit = false
      this.global_setting_info = JSON.parse(JSON.stringify(this.global_setting_infoBk))
      this.health_index_arr = JSON.parse(JSON.stringify(this.health_index_arrBk))
    },
    readHealthIndexs () {
      NXDF_SETTING_HEALTH_INDEX_INFO_GET().then(res => {
        let healthIndexConfigs = res.data.health_index_configs
        healthIndexConfigs = healthIndexConfigs.sort((a, b) => {
          return b.max_value - a.max_value
        })
        this.health_index_arr = healthIndexConfigs.map(x => x.min_value)
        this.health_index_arrBk = JSON.parse(JSON.stringify(this.health_index_arr))
        this.health_index_configs = healthIndexConfigs
        this.health_index_configs_temp = JSON.parse(JSON.stringify(healthIndexConfigs))
        this.loaded = true
      })
    },
    readGlobalSetting () {
      GET_GLOBAL_SETTING({
        code: 'apdex'
      }).then(res => {
        this.global_setting_info = res.data.global_setting_info
        this.global_setting_infoBk = JSON.parse(JSON.stringify(this.global_setting_info))
      })
    },
    inputVal (data) {
      this.isEdit = true
      if (data.code === 'health_index_warn') {
        this.health_index_configs.forEach(x => {
          if (x.code === 'health_index_error') {
            x.max_value = data.min_value
          }
        })
      } else if (data.code === 'health_index_normal') {
        this.health_index_configs.forEach(x => {
          if (x.code === 'health_index_warn') {
            x.max_value = data.min_value
          }
        })
      }
      this.health_index_arr = this.health_index_configs.map(x => x.min_value)
    },
    invalidData (data) {
      if (data.code === 'health_index_warn') {
        this.health_index_configs.forEach(x => {
          if (x.code === 'health_index_error') {
            x.max_value = data.min_value
          }
        })
      } else if (data.code === 'health_index_normal') {
        this.health_index_configs.forEach(x => {
          if (x.code === 'health_index_warn') {
            x.max_value = data.min_value
          }
        })
      }
    },
    saveForm () {
      for (let x in this.health_index_configs) {
        if (this.health_index_configs[x].min_value < 0) {
          return
        }
        if (this.health_index_configs[x].max_value > 100) {
          return
        }
      }
      this.health_index_configs.forEach(x => {
        let data = {
          code: x.code,
          name: x.name,
          health_index_id: x.id,
          min_value: parseInt(x.min_value),
          max_value: parseInt(x.max_value)
        }
        NXDF_SETTING_HEALTH_INDEX_UPDATE_GET(data).then(res => {
          this.readHealthIndexs()
        })
      })
      NXDF_SETTING_GLOBAL_SETTING_UPDATE_GET({
        global_setting_info: {
          apdex: this.global_setting_info.apdex
        }
      }).then(res => {
        this.readGlobalSetting()
      })
      this.isEdit = false
      this.globalEdit = false
    },
    editGlobal () {
      this.isEdit = true
      this.globalEdit = true
    },
    sliderInput () {
      if (this.loaded) this.isEdit = true
    }
  },
  computed: {
    slider_arr () {
      if (this.health_index_arr.length > 0) {
        this.health_index_configs.forEach(x => {
          if (x.code === 'health_index_error') {
            x.max_value = this.health_index_arr[0]
          }
          if (x.code === 'health_index_warn') {
            x.max_value = this.health_index_arr[1]
            x.min_value = this.health_index_arr[0]
          }
          if (x.code === 'health_index_normal') {
            x.min_value = this.health_index_arr[1]
          }
        })
        return [this.health_index_arr[0] + '%', (100 - this.health_index_arr[1]) + '%']
      }
      return [0, 0]
    }
  },
  mounted () {
    // const {START, END} = this.defaultValue
    // const totalWidth = this.$refs.moveBoxNode.offsetWidth
    //
    // this.defaultValue.boxStart = totalWidth * START / 100 - this.$refs.startBoxNode.offsetWidth / 2
    // this.defaultValue.pointStart = totalWidth * START / 100 - this.$refs.startPointNode.offsetWidth / 2
    // this.defaultValue.boxEnd = totalWidth * END / 100 - this.$refs.endBoxNode.offsetWidth / 2
    // this.defaultValue.pointEnd = totalWidth * END / 100 - this.$refs.endPointNode.offsetWidth / 2
  },
  created () {
    this.readHealthIndexs()
    this.readGlobalSetting()
  },
  components: {
    splitTitle,
    ntSlider,
    ntTable
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .health-index {
    .desc {
      margin-top: 9px;
      width: 50%;
      line-height: 20px;
    }

    .desc-two {
      margin-top: 12px;
      width: 50%;
      line-height: 20px;
    }

    .title {
      margin-top: 55px;
    }

    .unit-time {
      margin: 47px 0 0 16px;
      line-height: 14px;
    }

    .ratio {
      display: flex;
      align-items: center;
      height: 134px;
    }

    .unit-time-content {
      margin: 10px 0 0 16px;
      line-height: 14px;

      .uc-input {
        width: 122px;
        border-radius: 3px;

        > input {
          text-align: right;
        }
      }

      .iconedit2 {
        margin: 2px 5px;
        display: inline-block;
        color: @theme-color
      }
    }

    .footer {
      margin: 24px 0 20px;

      button:not(:first-child) {
        margin-left: 24px;
      }
    }

    .header-style {
      display: flex !important;
      align-items: center;
      // margin-left: -20px;
      .tab-title {
        font-size: 14px;
        line-height: 16px;
      }

      .split {
        border-bottom: 1px solid #E6E6E6;
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        padding: initial !important;
        margin-bottom: 2px;
      }
    }

    .table_list {
      .el-table td, .el-table th.is-leaf {
        border-bottom: none !important;
        text-align: right;
      }

      .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        padding-left: initial !important;
      }

      .el-input__inner {
        text-align: right;
      }
    }

    .input_handle {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .input_width {
      width: 100px;
    }
  }
</style>
<style lang="less" scoped>
  @import "~common/style/variable";

  #uc_input {
    text-align: right;
  }

  .move-box {
    margin: 38px 0 30px 28px;
    width: 93%;
    height: 60px;

    .slider-box {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;

      .default_circle{
        position: absolute;
        top: 11px;
        left: 0;
        width: 16px;
        height: 16px;
        border: 2px solid #00A1B2;
        background-color: #00A1B2;
        border-radius: 50%;
        opacity: 0.5;
      }
      .default_value{
        position: absolute;
        top: -35px;
        padding: 0 5px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        color: #fff;
        background: #00A1B2;
        border-radius: 12%;
        opacity: 0.7;
        min-width: 50px;
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
      border-left: 10px solid @slider-color-success;
    }

    .slider-left {
      position: absolute;
      top: 16px;
      left: 0;
      width: 0;
      height: 10px;
      background: @slider-color-error;
    }

    .slider-right {
      position: absolute;
      top: 16px;
      right: 0;
      width: 0;
      height: 10px;
      background: @slider-color-success;
    }
  }

  .table_list {
    .el-table th > .cell {
      padding-right: 0;

      > div {
        padding-right: 0;
      }
    }
  }

  .tab-title {
    padding: 0 10px;
    text-align: right;

    .iconfont {
      font-size: 20px;
      flex-basis: 25px;
    }
  }

  .tab-first {
    text-align: left;
    display: flex;
  }
</style>
