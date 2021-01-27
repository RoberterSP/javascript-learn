<template>
  <div class="wrapper configCheckList">
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="apiList" >
      <div class="header_div m20 p16">
        <div class="head_title_b mt20">
          <div class="panelRow fresh flex-start" style="align-items: flex-start;">
            <div class="progress-box ml24">
              <div class="progress-per flex-start">
                <ntSlider
                  v-model="percent"
                  :show-tooltip="false"
                  disabled
                  :show-input-controls="false"
                  :tooltip-class="'custom-tooltip'"
                  class="format_width">
                </ntSlider>
              </div>
              <div class="progress-text progress-num">{{percent + '%'}}</div>
              <div class="progress-text">已进行</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="check_result_div ml20 mr20 p16">
      <div class="dwr-b">
        <div class="dwr-p">
          <!-- 当有config_check_info 才有header头 -->
          <div class="dwr-g">
            <div>
              <div class="dwr-k">
                <span class="gwt-InlineLabel" >对象</span>
                <span class="dwr-t"></span>
              </div>
              <div class="dwr-e">
                <span class="dwr-i"></span>
                <span class="gwt-InlineLabel">CDS</span>
              </div>
              <div class="dwr-e">
                <span class="dwr-i"></span>
                <span class="gwt-InlineLabel">RDS</span>
              </div>
              <div class="dwr-e">
                <span class="dwr-i"></span>
                <span class="gwt-InlineLabel">LDS</span>
              </div>
              <div class="dwr-f">
                <span class="dwr-i"></span>
                <span class="gwt-InlineLabel">状态</span>
              </div>
            </div>
          </div>
          <div class="gwt-parentsPanel">
            <div class="checkCar">
              <div class="car_item" v-for="(item, index) in meshList" :key="index" :title="item.info" v-show="meshList.length > 0">
                <div class="car-header flex dVz-r" :class="[item.grayRow?'dVz-g':'']">
                  <div class="dwr-k flex">
                    <div class="k_l flex">
                      <div class="flex-start" @click="isShowLabel(item, index, meshList)"
                      :style="{opacity: item.node_check_info && item.node_check_info.length ? 1 : 0}">
                        <DYIcon type="arrowdown" class="iconfont icon_arrowdown" v-if="!!item.isShow"></DYIcon>
                        <DYIcon type="arrowup" class="iconfont icon_arrowup" v-else></DYIcon>
                      </div>
                      <div class="flex-center">
                        <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="nodeState[item.state].iconUrl==='Loading'" />
                        <DYIcon :type="nodeState[item.state].iconUrl" class="iconfont" :class="[`icon_${nodeState[item.state].iconUrl}`]" v-else></DYIcon>
                      </div>
                    </div>
                    <div class="k_r flex-start" style="margin-left: 15px;">
                      <!-- <img class="icon icon-merge-default" :src=nodeState[items.state].img alt="open"> -->
                      <DYIcon type="Appliance" class="iconfont icon_Appliance" style="margin-right: 10px;"></DYIcon>
                      <span class="right-text">{{item.name}}</span>
                      <!-- <div class="right-status-box">
                        <span v-for="(info, ind) in item.config_check_info" :key="ind" :title="info.info" :class="configState[info.state].color">{{info.config_type}}</span>
                      </div> -->
                    </div>
                  </div>
                  <div class="dwr-e">
                    <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="item.CDS_state === 'checking'" />
                    <DYIcon type="clock" class="iconfont icon_clock" v-if="item.CDS_state === 'wait'"></DYIcon>
                    <DYIcon type="checkOK" class="iconfont icon_checkOK" v-if="item.CDS_state === 'success'"></DYIcon>
                    <DYIcon type="delete" class="iconfont icon_delete" v-if="item.CDS_state === 'fail'"></DYIcon>
                  </div>
                  <div class="dwr-e">
                    <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="item.RDS_state === 'checking'" />
                    <DYIcon type="clock" class="iconfont icon_clock" v-if="item.RDS_state === 'wait'"></DYIcon>
                    <DYIcon type="checkOK" class="iconfont icon_checkOK" v-if="item.RDS_state === 'success'"></DYIcon>
                    <DYIcon type="delete" class="iconfont icon_delete" v-if="item.RDS_state === 'fail'"></DYIcon>
                  </div>
                  <div class="dwr-e">
                    <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="item.LDS_state === 'checking'" />
                    <DYIcon type="clock" class="iconfont icon_clock" v-if="item.LDS_state === 'wait'"></DYIcon>
                    <DYIcon type="checkOK" class="iconfont icon_checkOK" v-if="item.LDS_state === 'success'"></DYIcon>
                    <DYIcon type="delete" class="iconfont icon_delete" v-if="item.LDS_state === 'fail'"></DYIcon>
                  </div>
                  <div class="dwr-f">
                    <span class="car-header-left-text" :class="[nodeState[item.state].color, item.state==='fail'?'pointer':'']" @click="reCheckClick(item)">{{nodeState[item.state].text}}</span>
                  </div>
                </div>
                <div class="car-header flex dVz-r" v-for="(items, indexs) in item.node_check_info" :title="items.info" :key="indexs" :class="[items.grayRow?'dVz-g':'']" v-if="item.isShow" >
                  <div class="dwr-k flex">
                    <!-- 只是占位 start -->
                    <div class="k_l flex" style="opacity: 0">
                      <div class="flex-start">
                        <DYIcon type="arrowup" class="iconfont icon_arrowup"></DYIcon>
                      </div>
                      <div class="flex-center">
                        <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="nodeState[items.state].iconUrl==='Loading'" />
                        <DYIcon :type="nodeState[items.state].iconUrl" class="iconfont" :class="[`icon_${nodeState[items.state].iconUrl}`]" v-else></DYIcon>
                      </div>
                    </div>
                    <!-- 只是占位 end -->
                    <div class="k_r flex-start" style="margin-left: 15px;">
                      <div class="flex-center" style="margin-right: 15px;">
                        <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="nodeState[items.state].iconUrl==='Loading'" />
                        <DYIcon :type="nodeState[items.state].iconUrl" class="iconfont" :class="[`icon_${nodeState[items.state].iconUrl}`]" v-else></DYIcon>
                      </div>
                      <DYIcon type="urlc" class="iconfont icon_urlc" style="margin-right: 10px;"></DYIcon>
                      <span class="right-text">{{items.ip}}</span>
                    </div>
                  </div>
                  <div class="dwr-e">
                    <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="items.CDS_state === 'checking'" />
                    <DYIcon type="clock" class="iconfont icon_clock" v-if="item.CDS_state === 'wait'"></DYIcon>
                    <DYIcon type="checkOK" class="iconfont icon_checkOK" v-if="item.CDS_state === 'success'"></DYIcon>
                    <DYIcon type="delete" class="iconfont icon_delete" v-if="item.CDS_state === 'fail'"></DYIcon>
                  </div>
                  <div class="dwr-e">
                    <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="items.RDS_state === 'checking'" />
                    <DYIcon type="clock" class="iconfont icon_clock" v-if="item.RDS_state === 'wait'"></DYIcon>
                    <DYIcon type="checkOK" class="iconfont icon_checkOK" v-if="item.RDS_state === 'success'"></DYIcon>
                    <DYIcon type="delete" class="iconfont icon_delete" v-if="item.RDS_state === 'fail'"></DYIcon>
                  </div>
                  <div class="dwr-e">
                    <img class="icon-loading" src="~@/assets/image/icon-loading.png" title="" v-if="items.LDS_state === 'checking'" />
                    <DYIcon type="clock" class="iconfont icon_clock" v-if="item.LDS_state === 'wait'"></DYIcon>
                    <DYIcon type="checkOK" class="iconfont icon_checkOK" v-if="item.LDS_state === 'success'"></DYIcon>
                    <DYIcon type="delete" class="iconfont icon_delete" v-if="item.LDS_state === 'fail'"></DYIcon>
                  </div>
                  <div class="dwr-f">
                    <!--  v-if="nodeState[items.state]==='fail'" -->
                    <span class="car-header-left-text" :class="[nodeState[items.state].color, items.state==='fail'?'pointer':'']" @click="reCheckClick(items)">{{nodeState[items.state].text}}</span>
                  </div>
                </div>
              </div>
              <div v-show="meshList.length === 0" class="flex-center empty">
                <!-- <img src="~@/assets/image/empty.svg" alt="empty"> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './configCheckDetail.less'
import stepper from 'components/stepper/stepper.vue'
import myTable from 'components/ntTable/ntTable.vue'
import ntSlider from 'components/base/slider/slider.vue'
import {
  CONFIG_PATCH_STATUS_GET,
  CONFIG_PATCH_CHECK_POST
} from '@/api'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      percent: 0,
      isChecking: false,
      configCheckInfo: false,
      stepper: [
        {
          name: '配置检查',
          routerTo: 'configCheckList'
        },
        {
          name: '配置检查详情'
        }
      ],
      configState: {
        success: {
          text: '已完成',
          color: 'success'
        },
        running: {
          text: '正在检查',
          color: 'running'
        },
        wait: {
          text: '等待检查',
          color: 'wait'
        },
        fail: {
          text: '重新检查',
          color: 'fail'
        }
      },
      nodeState: {
        done: {
          text: '已完成',
          color: 'done',
          iconUrl: 'OK'
        },
        wait: {
          text: '等待检查',
          color: 'wait',
          iconUrl: 'clock'
        },
        checking: {
          text: '检查中',
          color: 'checking',
          iconUrl: 'Loading'
        },
        fail: {
          text: '重新检查',
          color: 'fail',
          iconUrl: 'alert'
        }
      },
      meshList: []
      // /* eslint-disable */
      // meshList: [
      //   {
      //     'info': '',
      //     'code': 'nxgw',
      //     'name': 'Nexttao Api Gateway',
      //     state: 'done',
      //     'config_check_info': [
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'CDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'LDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'RDS'
      //       }
      //     ],
      //     'node_check_info': [
      //       {
      //           'info': '',
      //           'ip': '192.168.10.15',
      //           'state': 'done',
      //           'config_check_info': [
      //               {
      //                   'info': '1',
      //                   'state': 'success',
      //                   'config_type': 'CDS'
      //               },
      //               {
      //                   'info': '2',
      //                   'state': 'wait',
      //                   'config_type': 'LDS'
      //               },
      //               {
      //                   'info': '3',
      //                   'state': 'fail',
      //                   'config_type': 'RDS'
      //               }
      //           ]
      //       },
      //       {
      //           'info': '',
      //           'ip': '1925',
      //           'state': 'checking',
      //           'config_check_info': [
      //               {
      //                   'info': '1',
      //                   'state': 'success',
      //                   'config_type': 'CDS'
      //               },
      //               {
      //                   'info': '2',
      //                   'state': 'fail',
      //                   'config_type': 'LDS'
      //               },
      //               {
      //                   'info': '3',
      //                   'state': 'fail',
      //                   'config_type': 'RDS'
      //               }
      //           ]
      //       },
      //       {
      //           'info': '',
      //           'ip': '192.168.10.15',
      //           'state': 'fail',
      //           'config_check_info': [
      //               {
      //                   'info': '1',
      //                   'state': 'success',
      //                   'config_type': 'CDS'
      //               },
      //               {
      //                   'info': '2',
      //                   'state': 'success',
      //                   'config_type': 'LDS'
      //               },
      //               {
      //                   'info': '3',
      //                   'state': 'success',
      //                   'config_type': 'RDS'
      //               }
      //           ]
      //       }
      //     ]
      //   },
      //   {
      //     'info': '',
      //     'code': 'nxss',
      //     'name': 'Nexttao Subscribe Center',
      //     state: 'wait',
      //     'config_check_info': [
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'CDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'LDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'RDS'
      //       }
      //     ],
      //     'node_check_info': [{
      //       'info': '',
      //       'ip': '192.168.10.2',
      //       'state': 'checking',
      //       'config_check_info': [{
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'CDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'LDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'RDS'
      //       }]
      //     }]
      //   },
      //   {
      //     'info': '',
      //     'code': 'nxuser',
      //     'name': 'Nexttao User Center',
      //     state: 'done',
      //     'config_check_info': [
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'CDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'LDS'
      //       },
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'RDS'
      //       }
      //     ],
      //     'node_check_info': [
      //       {
      //         'info': '',
      //         'ip': '192.168.10.14',
      //         'state': 'wait',
      //         'config_check_info': [
      //           {
      //             'info': '',
      //             'state': 'success',
      //             'config_type': 'CDS'
      //           },
      //           {
      //             'info': '',
      //             'state': 'success',
      //             'config_type': 'LDS'
      //           },
      //           {
      //             'info': '',
      //             'state': 'success',
      //             'config_type': 'RDS'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     'info': '',
      //     'code': 'nxmc',
      //     'name': 'Nexttao Manager Console',
      //     state: 'done',
      //     'config_check_info': [
      //       {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'CDS'
      //       }, {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'LDS'
      //       }, {
      //         'info': '',
      //         'state': 'success',
      //         'config_type': 'RDS'
      //       }
      //     ],
      //     'node_check_info': [
      //       {
      //         'info': '',
      //         'ip': '192.168.10.12',
      //         'state': 'fail',
      //         'config_check_info': [
      //           {
      //             'info': '',
      //             'state': 'success',
      //             'config_type': 'CDS'
      //           },
      //           {
      //             'info': '',
      //             'state': 'success',
      //             'config_type': 'LDS'
      //           }, {
      //             'info': '',
      //             'state': 'success',
      //             'config_type': 'RDS'
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ]
    }
  },
  computed: {},
  watch: {
    // 'filterKeys': {
    //   handler: function () {
    //     this.showOptTooltip = true
    //   },
    //   deep: true
    // }
  },
  methods: {
    isShowLabel (item, index, meshList) {
      item.isShow = !item.isShow
      this.handleRowColor()
      this.$forceUpdate()
    },
    handleRowColor () {
      this.meshList.forEach((data, index1) => {
        if (index1 === 0) {
          data.grayRow = false
          if (data.isShow && data.node_check_info && data.node_check_info.length) {
            let bol = false
            data.node_check_info.forEach((ele, sonIndex) => {
              if (sonIndex % 2 !== 0) {
                ele.grayRow = bol
              } else {
                ele.grayRow = !bol
              }
            })
          }
        } else {
          if (this.meshList[index1 - 1].isShow) {
            // 如果上级展开了子
            console.log(this.meshList[index1 - 1].node_check_info)
            data.grayRow = !this.meshList[index1 - 1].node_check_info[this.meshList[index1 - 1].node_check_info.length - 1].grayRow
          } else {
            data.grayRow = !this.meshList[index1 - 1].grayRow
          }
          if (data.isShow && data.node_check_info && data.node_check_info.length) {
            let bol = data.grayRow
            data.node_check_info.forEach((ele, sonIndex) => {
              if (sonIndex % 2 !== 0) {
                ele.grayRow = bol
              } else {
                ele.grayRow = !bol
              }
            })
          }
        }
      })
      // console.log('meshList', this.meshList)
    },
    // 重新检查 点击
    reCheckClick (item = null) {
    //   console.log('item', item)
    //   if (!item) {
    //     // 全局的检查按钮触发 需要禁用
    //     this.isChecking = true
    //   }
      if (!this.$_accessRoutes('serviceCenter_configCheckDetail_reCheck')) return
      let params = {history_id: this.configCheckInfo.id}
      if (item && item.mesh_id) {
        // 服务
        params.mesh_id = item.mesh_id
      } else {
        // ip
        params.node_id = item.node_id
      }
      CONFIG_PATCH_CHECK_POST(params).then(res => {
        // this.isChecking = false
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.config_check_list_get()
      })
    },
    // 接口调用方法
    config_check_list_get () {
      // this.meshList.forEach(data => {
      //   data.CDS_state = ''
      //   data.CDS_state = ''
      //   data.CDS_state = ''
      //   data.node_check_info = this.node_check_info_func(data.node_check_info)
      //   data.config_check_info.forEach(el => {
      //     if (el.config_type === 'CDS') {
      //       el.CDS_state = el.state
      //     }
      //     if (el.config_type === 'RDS') {
      //       el.RDS_state = el.state
      //     }
      //     if (el.config_type === 'LDS') {
      //       el.LDS_state = el.state
      //     }
      //   })
      // })
      CONFIG_PATCH_STATUS_GET({history_id: this.configCheckInfo.id}).then(res => {
        res.data.mesh_list.forEach(data => {
          data.CDS_state = ''
          data.RDS_state = ''
          data.LDS_state = ''
          data.node_check_info = this.node_check_info_func(data.node_check_info)
          data.config_check_info.forEach(el => {
            if (el.config_type === 'CDS') {
              data.CDS_state = el.state
            }
            if (el.config_type === 'RDS') {
              data.RDS_state = el.state
            }
            if (el.config_type === 'LDS') {
              data.LDS_state = el.state
            }
          })
        })
        this.meshList = res.data.mesh_list
        this.handleRowColor()
        // console.log('meshList', this.meshList)
        this.percent = res.data.percent
      })
    },
    node_check_info_func (list) {
      let arr = list
      arr.forEach(data => {
        data.CDS_state = ''
        data.RDS_state = ''
        data.LDS_state = ''
        data.config_check_info.forEach(el => {
          if (el.config_type === 'CDS') {
            data.CDS_state = el.state
          }
          if (el.config_type === 'RDS') {
            data.RDS_state = el.state
          }
          if (el.config_type === 'LDS') {
            data.LDS_state = el.state
          }
        })
      })
      return arr
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.configCheckDetail) {
      this.configCheckInfo = this.$route.params.configCheckDetail
      this.config_check_list_get()
    } else {
      this.$router.push({ name: 'configCheckList' })
    }
  },
  created () {},
  components: {
    stepper,
    myTable,
    ntSlider
  }
}
</script>
<style scoped lang="less">
</style>
