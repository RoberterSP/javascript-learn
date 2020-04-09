<template>
  <div class="simulationRequest">
    <stepper :stepper="stepper" @goRouter="goRouter"></stepper>

    <div class="p20">
      <DYCard class="margin-card">
        <div class="down">
          <DYHeader
            class="row-title"
            icon="request"
            no-gap
            title="模拟请求"
            sub-title="通过选择服务接口，并发送携带固定请求Header的请求，对于应用功能本身不会产生实际调用。通过请求的返回结果，判断服务路由规则是否生效以及配置正确。"
          />

          <el-form ref="ruleForm" label-position="top">
            <div>
              <div class="el-form-item__label">已添加接口</div>

              <div>
                <DYTag v-for="(item, index) in endpointListAdd" :key="index" class="mr8">
                  <span class="tag_val" v-if="item || item === 0">{{item.name}}</span>
                  <span class="tags_remove" v-if="item || item ===0" @click="remove(index)">
                    <DYIcon type="delete" actions class="iconClose" size="14"></DYIcon>
                  </span>
                </DYTag>
              </div>

            </div>
            <div class="el-button-form-item">
              <DYButton @click="addEndponit">继续添加</DYButton>
            </div>
            <el-form-item label="发送方式">
              <el-select
                style="width: 150px"
                v-model="editData.send_type"
                placeholder="请选择">
                <el-option
                  v-for="item in sendType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发送数量(100条为一级)" v-if="editData.send_type === 'batch'">
              <div class="progress-per">
                <ntSlider
                  v-model="editData.send_num"
                  :max="500"
                  :step="100"
                  show-tooltip
                  :show-input-controls="false"
                  :marks="marks1"
                  :format-tooltip="formatTooltip"
                  class="format_width"
                  :resident-tooltip="true"
                  start-tooltip="bottom"
                  :tooltip-class="'custom-tooltip'"
                >
                </ntSlider>
              </div>
            </el-form-item>
            <el-form-item label="路由标签匹配">
              <div class="mb12 sign">
                以key:value形式创建，key/value规则：长度1-63之间，支持字母，连字符(‘-’)，下划线（‘_’），点号（‘.’）数字。以字母开头,，以字母或数字结尾
              </div>
              <div class="flex-start">
                <el-select
                  style="width: 150px"
                  v-model="editData.match_type"
                  @change="selChangeType"
                  placeholder="请选择">
                  <el-option
                    v-for="item in matchType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div class="sf-tagsinput" v-if="editData.match_type">
                  <div class="tagsinput_values">
                  <span class="tag_item" v-for="(item, index) in editData.match_value" :key="index">
                    <span class="tag_val" v-if="item||item==0">{{item.key}}: {{item.value}}</span>
                    <span class="tags_remove" v-if="item||item==0" @click="removeTag(index)">
                      <DYIcon type="delete" class="iconClose" size="14"></DYIcon>
                    </span>
                  </span>
                    <div class="tagsinput_input">
                      <input ref="tags_input" class="tags_input" type="text" placeholder="请输入标签以回车键结束"
                             @keyup.enter="tagsInputkeyupEnter($event)">
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <DYButton type="primary" @click="send('single')">发送</DYButton>
          </el-form>
        </div>
        <div class="down pl20 pr20 pt20 content-bottom" v-show="deploy_groups.length > 0">
          <div class="title flex"><span>平均响应时间</span> <span class="time">{{response_time_avg}}ms</span></div>
          <div class="flex">
            <div class="flex-left">
              <div class="table-head">
                <span class="td-first">部署组</span>
                <span class="td-second">数量</span>
                <span class="td-third">百分比</span>
              </div>
              <div v-for="(item,index) in deploy_groups" :key="index" class="table-head"
                   :style="{background: index%2 === 1 ? getLessColor('@gray-01') :''}">
              <span class="td-first flex-start">
                <div class="zhengfangxing" :style="{background: colors[index%3]}"></div>
                <div>{{item.group_name}}</div>
              </span>
                <span class="td-second">{{item.request_num}}</span>
                <span class="td-third">{{item.percent}}%</span>
              </div>
              <div class="flex-center empty" v-if="deploy_groups.length === 0">
                <DYIcon type="records" size="80" class="mt30"></DYIcon>
                <span>暂无数据</span>
              </div>
            </div>
            <div class="flex-right">
              <X-chart
                :chartId="'1'"
                ref='chartsOption'
                :option="chartsOption"
              ></X-chart>
            </div>
          </div>
        </div>
      </DYCard>
    </div>
  </div>
</template>
<script>
import XChart from 'components/charts/charts.vue'
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import ntSlider from 'components/base/slider/slider'

import './index.less'
import {ENDPOINT_MOCK_POST, NXMC_MESH_LIST_GET} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import {getLessColor} from 'common/util/util'

export default {
  data () {
    return {
      getLessColor,
      marks1: {0: '0条', 500: '500条', 'max': 500},
      response_time_avg: '',
      endpointListAdd: [],
      colors: ['#7C38A1', '#FFE11C', '#4FD5E0'],
      todetailData: {}, // 返回的其它的页面,存储的数据
      chartsOption: {
        title: {
          text: ''
        },
        tooltip: {
          enabled: false
        },
        colors: ['#7C38A1', '#FFE11C', '#4FD5E0'],
        credits: {
          enabled: false
        },
        chart: {
          skipClone: true,
          zoomType: 'x',
          height: 410,
          width: 210,
          style: {
            overflow: 'visible'
          },
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0]
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: '#454646',
                fontSize: '14px',
                fontFamily: 'SourceHanSansSC-Regular, SourceHanSansSC',
                colorByPoint: false
              }
            }
          }
        },
        series: [{
          type: 'pie',
          innerSize: '70%',
          data: []
        }]
      },
      deploy_groups: [],
      editData: {
        mesh_code: '',
        send_type: 'single',
        match_type: 'headers',
        match_value: []
      },
      selectData: [],
      matchType: [
        {
          label: 'HTTP Header',
          value: 'headers'
        },
        {
          label: 'HTTP Query Parameters',
          value: 'query_parameters'
        }
      ],
      sendType: [
        {
          label: '单次发送',
          value: 'single'
        },
        {
          label: '批量发送',
          value: 'batch'
        }
      ],
      stepper: [
        {
          name: '模拟请求',
          routerTo: 'simulationRequest'
        }
      ]
    }
  },
  computed: {
    menuState () {
      return this.$store.state.openMenu
    }
  },
  watch: {
    menuState (newVal) {
      // 菜单变化  echart图表自适应
      let that = this
      this.$nextTick(() => {
        that.$refs.chartsOption.drawChart(that.chartsOption)
      })
    }
  },
  methods: {
    formatTooltip (val) {
      return `${val}条`
    },
    random (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
    goRouter (item) {
      if (item.routerTo === 'serviceApi') {
        this.$router.push({
          name: 'serviceApi',
          params: {
            showComponent: {name: '服务接口', code: 'serviceApi', serGo: true, fcExt: true},
            stepper: this.$route.params.stepper,
            detailData: this.todetailData,
            endpointList: this.endpointListAdd
          }
        })
      } else {
        this.$router.push({name: 'serviceDetail', params: this.todetailData})
      }
    },
    // 添加接口
    addEndponit () {
      this.$router.push({
        name: 'serviceApi',
        params: {
          showComponent: {name: '服务接口', code: 'serviceApi', serGo: true, fcExt: true},
          stepper: this.$route.params.stepper,
          detailData: this.todetailData,
          endpointList: this.endpointListAdd
        }
      })
    },
    tagsInputkeyupEnter (event) {
      let values = event.target.value
      if (values.indexOf(':') > -1) {
        if (values.split(':').length === 2) {
          let findIndex = this.editData.match_value.findIndex(item => item.key === values.split(':')[0])
          if (findIndex === -1) {
            this.editData.match_value.push(
              {
                key: values.split(':')[0],
                value: values.split(':')[1]
              }
            )
            event.target.value = ''
          }
        }
      }
    },
    // 发送
    send () {
      let that = this
      let endpoint = []
      this.endpointListAdd.forEach(item => {
        endpoint.push(item.endpoint)
      })
      let params = {
        mesh_code: this.todetailData.code,
        endpoint,
        mock_type: this.editData.send_type,
        match_type: this.editData.match_type,
        match_value: this.editData.match_value
      }
      if (this.editData.send_type === 'batch') {
        params.send_num = this.editData.send_num
      }

      ENDPOINT_MOCK_POST(params).then(res => {
        let arr = []
        that.deploy_groups = res.data.deploy_groups
        that.chartsOption.series[0].data = []
        that.deploy_groups.forEach(items => {
          // eslint-disable-next-line no-unused-var
          let groupName = items.group_name
          let {percent} = items
          let obj = []
          obj.push(groupName)
          obj.push(percent)
          arr.push(obj)
          that.chartsOption.series[0].data = arr
        })
        that.$refs.chartsOption.drawChart(that.chartsOption)
        that.response_time_avg = res.data.response_time_avg
      })
    },
    removeTag (index) {
      this.editData.match_value.splice(index, 1)
    },
    remove (index) {
      this.endpointListAdd.splice(index, 1)
    },
    // 获取服务列表
    nxmc_mesh_list_get () {
      let data = {
        page: 1,
        page_size: PAGESIZE
      }
      NXMC_MESH_LIST_GET(data).then(res => {
        res.data.mesh_list.forEach(item => {
          item.label = item.name
          item.value = item.code
        })
        this.selectData = res.data.mesh_list
      })
    },
    // 选择服务列表
    selChange (value) {
      this.detailData = this.selectData.find(item => item.value === value)
      this.endpointListAdd = []
    },
    selChangeType () {
      this.editData.match_value = []
    }
  },
  mounted () {
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData.detailData
      this.endpointListAdd = this.$route.params.detailData.endpointListAdd
      this.editData = this.$route.params.detailData.editData
    }
    if (this.$route.params && this.$route.params.apiData) {
      this.endpointListAdd = this.$route.params.apiData
      this.todetailData = this.$route.params.todetailData
      this.stepper = [...this.$route.params.stepper, ...this.stepper]
      this.$set(this.stepper[3], 'type', 'edit')
    }
    this.nxmc_mesh_list_get()
  },
  components: {
    ntTable,
    stepper,
    ntSlider,
    XChart
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .head_title_l {
    display: flex;

    .icon_request {
      width: 50px;
      height: 50px;
      font-size: 50px;
    }

    .title {
      .h1 {
        font-size: 28px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 5px;
      }

      .h2 {
        font-size: 14px;
        font-weight: 400;
        color: rgba(69, 70, 70, 1);
        line-height: 16px;
      }

    }

  }

  .progress-per {
    width: 700px;
    margin-bottom: 29px;
    padding-left: 10px;
  }

  .conteniu {
    border-color: @turq-06 !important;
    color: @turq-06 !important;
    background-color: #fff !important;
    // margin-top: 32px;
    // margin-bottom: 41px;
  }

  .simulationRequest {
    background: @gray-02;

    .default-width {
      width: @default-form-width
    }

    .banner {
      width: 100%;
      height: 92px;
      position: relative;
      border-bottom: 1px solid @purple-06;

      .iconfont {
        font-size: 52px;
      }

      .bannericon {
        width: 52px;
        height: 52px;
        position: absolute;
        left: 35px;
        top: 18px;
      }

      .title {
        position: absolute;
        left: 93px;
        top: 23px;
        font-size: 28px;
        line-height: 40px;
      }

      .btn {
        position: absolute;
        top: 10px;
        right: 20px;
      }

      .mt32 {
        margin-top: 32px;
      }
    }

    .filter_div {
      margin-top: 38px;
      margin-bottom: 42px;
    }

    .down {
      background-color: #fff;

      .role_container {
        position: relative;
        background-color: #fff;

        .desc {
          margin-top: 8px;
          width: 50%;
          line-height: 20px;
        }

        .user_list {
          margin-top: 44px;
        }
      }
    }
  }

  .sf-tagsinput {
    margin-left: -2px;
    width: 80%;
    display: flex;
    align-items: center;
    min-height: 32px;
    border: 1px solid @gray-04;
    border-radius: @default-border-radius;
    background-color: #fff;
    padding-bottom: 0;
    flex-wrap: nowrap;
    padding-left: 15px;

    .tagsinput_values {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
    }
  }

  .tag_item_reset {
    display: inline-block !important;
    line-height: 26px !important;
    margin-bottom: 8px;
    margin-right: 5px;
  }

  .tag_item {
    display: flex;
    align-items: center;
    height: 25px;
    border-radius: @default-border-radius;
    border: 1px solid rgba(230, 230, 230, 1);
    background-color: @gray-02;
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

  .empty {
    span {
      margin-left: 10px;
      font-size: 18px;
      font-weight: 500;
      color: rgba(69, 70, 70, 1);
      line-height: 26px;
    }
  }

</style>
