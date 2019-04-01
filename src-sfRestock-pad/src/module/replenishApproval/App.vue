<template>
    <div>
      <div class="replenishApprovalPage flex">
        <div class="deliverypage_l">
          <div class="delivery_l_content">
            <div class="bg_70"></div>
            <div :style="{maxHeight: minheight + 'px', height: minheight + 'px'}" id="testPaper" @scroll="paperScroll()">
            <mt-loadmore v-if="isChange" :top-method="loadTop" :top-distance="0" :bottom-all-loaded="false" ref="loadmore">
              <div
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="isMoreLoading"
                infinite-scroll-distance="10">
                <div class="item" v-for="(item,index) in reload_lists" :key="index">
                  <div class="time_tit" v-show="item.show_title" :class="[index===0 ? 'noborderTop' : '']">{{item.apply_date.split('-')[0] + '-' + item.apply_date.split('-')[1]}}</div>
                  <div class="whiteBg">
                    <div class="box" :class="{'bluebg': activeIndex===index, 'last': index===reload_lists.length-1}"
                    @click="selectMan(item, index)">
                      <div class="flex-between">
                        <span>{{item.apply_date}}</span>
                        <span class="changeColor" :class="{'color1': item.state==='approve'||item.state==='waiting', 'color2': item.state==='done', 'color3': item.state==='confirm', 'color4': item.state==='reject', 'color6': item.state==='cancel'}">{{cloud_picks_status_text[item.state]}}</span>
                      </div>
                      <div class="cen">
                        <span>{{item.source_shop_code}} </span>
                        <span>{{item.reload_no}}</span>
                      </div>
                      <div class="flex-between">
                        <span>数量：{{item.total_qty}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="page-infinite-loading" v-if="isLoading" >
                    <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
                    <span class="loading-more-txt">加载中...</span>
                </div>
                <div class="loading_finished-text" v-if="noMore">没有更多了~</div>
              </div>
            </mt-loadmore>
            <div class="no-data" v-show="!reload_lists.length&&!isLoading">
              <img src="../../assets/images/empty.svg" alt="">
            </div>
            </div>
            <!--  -->
            <mt-popup v-model="selectStatePopupShow" overlay-class="selectState" class="selectStatePopup" pop-transition="popup-fade">
              <div class="hahha"></div>
              <div class="opts">
                <div class="flex-between" v-for="(item,index) in stateLists" :key="index"
                @click="selectStateClick(item, index)">
                  {{item.state}}
                  <img v-if="stateActiveIndex===index" class="top_icon" src="../../assets/images/gou.svg" style="width:18px;height:12px;">
                </div>
              </div>
            </mt-popup>
            <!--  -->
            <div class="header flex-center" ref="header">
              <div class="top_icon_l flex-center" @click="switchPage">
                <img class="switch_icon" src="../../assets/images/switch_icon.svg">
              </div>
              <div @click="selectStatePopupShow=true">
                <div class="flex-center stateLabel">
                  {{stateLists[stateActiveIndex].state}}
                  <img src="../../assets/images/xiala.svg" style="width:14px;height:8px;margin-left:14px;">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="deliverypage_r" >
          <div class="header flex-start">
            <div>
              <span>补货审批</span>
              <span>|</span>
              <span v-if="detailData.reload_no" class="no">{{detailData.reload_no}}</span>
              <span v-else class="no">--</span>
            </div>
          </div>
          <div class="cloudSheetInfo" :style="{height: height + 'px'}">
            <div v-if="detailData.reject_reason_name" class="rejectDiv flex-between" >
              <div>{{detailData.reject_reason_name}}</div>
            </div>
            <div class="headInfo whiteBg">
              <div v-show="detailData.state==='draft'" class="self_button edit" @click="editMaintenance(true, detailData)">编辑</div>
              <div class="lineItem ">
                <div class="line_l">
                  <label>申请日期：</label>
                  <div v-if="detailData.apply_date" class="ele_item">{{detailData.apply_date}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
              </div>
              <div class="lineItem">
                <div class="line_l">
                  <label>发货门店：</label>
                  <div v-if="detailData.source_org_name" class="ele_item textOverflow" style="max-width:4rem;">{{detailData.source_org_name}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
              </div>
              <div class="lineItem">
                <div class="line_l">
                  <label>申请门店：</label>
                  <div v-if="detailData.target_org_name" class="ele_item">{{detailData.target_org_name}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
              </div>
              <div class="lineItem">
                <div class="line_l">
                  <label>申请数量：</label>
                  <div v-if="detailData.apply_total_qty" class="ele_item">{{detailData.apply_total_qty}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
                <div class="line_l cell_link">
                  <div class="flex-start">
                    <label>审批数量：</label>
                    <div v-if="detailData.approve_total_qty" class="ele_item address">{{detailData.approve_total_qty}}</div>
                    <div v-else class="ele_item">--</div>
                  </div>
                  <div style="padding:0px 10px " class="arrow_img_div" @click="isOpen=!isOpen"><img class="arrow_img" :class="{'roate': !isOpen}" src="../../assets/images/arrow.svg" /></div>
                </div>
              </div>
              <div class="toggleInfo whiteBg" v-show="isOpen">
                <div class="lineItem ">
                  <div class="line_l">
                    <label>操作人：</label>
                    <div v-if="detailData.operator" class="ele_item">{{detailData.operator}}</div>
                    <div v-else class="ele_item">--</div>
                  </div>
                </div>
                <div class="lineItem">
                  <div class="line_l">
                    <label>备注：</label>
                  <div v-if="detailData.notes" class="ele_item">{{detailData.notes}}</div>
                    <div v-else class="ele_item">--</div>
                  </div>
                </div>
                <div class="lineItem">
                  <div class="line_l">
                    <label>关联单据：</label>
                    <div v-if="detailData.rel_pick_no" class="ele_item blueLink" @click="goWarehouseOrStore">{{detailData.rel_pick_no}}</div>
                    <div v-else class="ele_item">--</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="goodsDetail whiteBg">
              <div class="flex-between selftable_title">
                <span class="">商品明细</span>
                <div class="self_button" @click="lookDetail" style="margin-top: -8px;" v-show="(detailData.reload_no != '')&& doHaveRight">查看明细</div>
              </div>
              <table class="selftable" :style="{maxHeight: isOpen ? '220px' : '329px'}">
                <tr class="">
                  <th></th>
                  <th><div class="cell">商品编码</div></th>
                  <th><div class="cell">尺码</div></th>
                  <th><div class="cell">颜色</div></th>
                  <th><div class="cell">单价</div></th>
                  <th><div class="cell">数量</div></th>
                </tr>
                <tr v-for="(item,index) in detailData.lines" :key="index">
                  <td>
                    <img v-if="item.image_url" :src="item.image_url">
                    <img v-else src="../../assets/images/bitmap.svg" />
                  </td>
                  <td><div class="cell setLine">{{item.product_code || '--'}}</div></td>
                  <td><div class="cell">{{item.size_name || '--'}}</div></td>
                  <td><div class="cell">{{item.color_name || '--'}}</div></td>
                  <!-- <td><div class="cell textOverflow" style="width: 150px;">{{item.color_name}}</div></td> -->
                  <td><div class="cell">{{item.unit_price | currency}}</div></td>
                  <td><div class="cell">{{item.apply_qty  || '--'}}</div></td>
                </tr>
                <tr v-if="!detailData.lines||detailData.lines.length<=0">
                  <td colspan="6"><div class="cell empty">暂无商品明细信息</div></td>
                </tr>
              </table>
            </div>
          </div>
          <div class="fool" v-if="detailData.state==='approve'||detailData.state==='waiting'">
            <div v-if="detailData.state==='approve'&&doHaveSubmit" class="reject_btn" @click="rejectReasonPopupshow=true;" style="max-width: 190px;">拒绝发货</div>
            <div v-if="detailData.state==='approve'&&doHaveSubmit" class="fahuo_btn mix" style="max-width: 190px;" @click="agreeBtnClick">同意发货</div>
            <div v-if="detailData.state==='waiting'&&doHaveSubmit" class="fahuo_btn mix" style="max-width: 190px;" @click="goWarehouseOrStore">发货</div>
          </div>
        </div>
        <mt-popup v-model="agreeDeliveryVisible" class="agreeDeliveryPop rejectReason" :closeOnClickModal="false">
          <div class="content">
            <div>同意向对方补货</div>
            <div>并立即生成调拨出库单</div>
            <div class="min">
              <span>申请: {{detailData.apply_total_qty?detailData.apply_total_qty:0}}</span>
              <span>审批: {{detailData.approve_total_qty?detailData.approve_total_qty:0}}</span>
              <span :class="[((detailData.approve_total_qty?detailData.approve_total_qty:0) - (detailData.apply_total_qty?detailData.apply_total_qty:0)) !== 0 ? 'redFont': '' ]">差异: {{(detailData.approve_total_qty?detailData.approve_total_qty:0) - (detailData.apply_total_qty?detailData.apply_total_qty:0)}}</span>
            </div>
          </div>
          <div class="flex-center foo">
            <div class="foo_l" @click="agreeDeliveryVisible=false;">取消</div>
            <div class="foo_r" @click="agreeDeliverySure">确认</div>
          </div>
        </mt-popup>
        <!-- 请选择拒绝原因popup -->
        <mt-popup v-model="rejectReasonPopupshow" class="rejectReason" :closeOnClickModal="false">
          <div class="title">请选择拒绝原因</div>
          <div class="reasonOptions">
            <div class="radio-group" >
              <div class="option_item flex-start" v-for="(item, index) in reasonOptions" :key="index"
              :class="{'selected': reject_reason_obj.reason_id&&reject_reason_obj.reason_id===item.reason_id}" @click="reject_reason_obj=item">
                <img class="radio_icn" v-if="reject_reason_obj.reason_id&&reject_reason_obj.reason_id===item.reason_id" src="../../assets/images/radio_selected.svg">
                <img class="radio_icn" v-else src="../../assets/images/radio.svg">
                <div class="option_item_r flex-start">{{item.reason_name}}</div>
              </div>
            </div >
            <div v-if="!reasonOptions||(reasonOptions&&!reasonOptions.length)" class=" flex-center">
              <img src="../../assets/images/no-search-result.png" style="width:150px;height:168px;" />
            </div>
          </div>
          <div class="flex-center foo">
            <div class="foo_l" @click="rejectReasonPopupshow=false;reject_reason_obj = {}">取消</div>
            <div class="foo_r" @click="rejectSureClick">确认</div>
          </div>
        </mt-popup>
      <!--  -->
      </div>
    </div>
</template>

<script>
/* eslint-disable */ 
import './replenishApproval.less'
import { MessageBox } from 'mint-ui'
import {
  RELOAD_LIST_GET,
  RELOAD_DETAIL_GET,
  RELOAD_REJECT_POST,
  CLOUD_REJECT_REASON_GET,
  RELOAD_APPROVE_POST
} from '@/api/index.js'
import { setTimeout } from 'timers';
// import {
//   getUrlParameter
// } from '@/api/util.js'
export default {
  data () {
    return {
      // 提交
      doHaveSubmit: false,
      // 权限控制
      doHaveRight: false,      
      // 加载更多中
      isMoreLoading: false,
      isLoading: false,
      noMore: false,
      isOpen: false,
      height: window.innerHeight - 70,
      minheight: window.innerHeight - 70,
      activeIndex: 0,
      rejectReasonPopupshow: false,
      reasonOptions: [],
      agreeDeliveryVisible: false,
      // 选择的拒绝原因
      reject_reason_obj: {},
      // 选择状态
      selectStatePopupShow: false,
      stateActiveIndex: 0,
      isChange: false,
      stateLists: [{
        state: '全部状态',
        code: ''
      }, {
        state: '待审批',
        code: 'approve'
      }, {
        state: '待发货',
        code: 'waiting'
      }, {
        state: '待签收',
        code: 'confirm'
      }, {
        state: '已完成',
        code: 'done'
      }, {
        state: '已拒绝',
        code: 'reject'
      }],
      // 订单list
      reload_lists: [],
      // 时间数组
      timeArr: [],
      // 右侧的订单详情
      detailData: {},
      cloud_picks_status_text: {
        'approve': '待审批',
        'waiting': '待发货',
        'confirm': '待签收',
        'done': '已完成',
        'reject': '已拒绝'
      },
      currentPage: 0,
      limit: 20,
      scroll: null
    }
  },
  activated () {
    if (this.scroll && this.scroll > 0) {
      document.querySelector('.delivery_l_content').scrollTo(0, this.scroll)
      this.scroll = null
    }
  },
  methods: {
    goWarehouseOrStore () {
      this.$bridge.callhandler('webviewWarehouseOrStorePageCallback', {flag: 'approval', type: this.detailData.type, reload_no: this.detailData.rel_pick_no}, function (data) {})
    },    
    loadMore () {
      console.log('触发加载')
      this.isMoreLoading = true
      this.isLoading = true
      this.noMore = false
      setTimeout(() => {
        this.getOrderList()
      }, 100)
    },
    loadTop () {
      setTimeout(() => {
        this.isMoreLoading = false
        this.isLoading = false
        this.noMore = false
        this.isChange = false
        this.timeArr = []
        this.currentPage = 0
        this.activeIndex = 0
        this.reload_lists = []
        this.detailData = {}
        setTimeout(() => {
          this.isChange = true
        })
      }, 0)
      console.log('下拉刷新')
      // 下拉刷新
      this.$refs.loadmore.onTopLoaded()
    },
    // 选择状态
    selectStateClick (item, index) {
      let oldCode = this.state
      if (oldCode !== item.code) {
        // document.querySelector('.delivery_l_content').scrollTo(0, 10)
        this.isChange = false
        this.isMoreLoading = false
        this.isLoading = false
        this.noMore = false
        this.timeArr = []
        this.stateActiveIndex = index
        this.activeIndex = 0
        this.state = item.code
        this.currentPage = 0
        this.reload_lists = []
        this.detailData = {}

        this.$nextTick(() => {
          this.selectStatePopupShow = false
        })
        setTimeout(() => {
          this.isChange = true
          // document.querySelector('.delivery_l_content').scrollTo(0, 0)
        }, 0)
      } else {
        this.selectStatePopupShow = false
      }
    },
    // 切换到菜单栏的birdge方法
    switchPage () {
      this.$bridge.callhandler('webviewSwitchPageCallback', {}, function (data) {})
    },
    // 选择左侧
    selectMan (item, index) {
      this.activeIndex = index
      setTimeout(() => {
        this.$refs.header.style.zIndex = 999
      })      
      this.get_order_detail(item.reload_no)
    },
    // 获取拒绝原因
    getRejectReason () {
      CLOUD_REJECT_REASON_GET({type: 'RELOAD_REJECT'}).then(res => {
        if (res.code === 0) {
          this.reasonOptions = res.data.reason_list
        }
      })
    },
    check (val) {
      console.log(val)
    },
    // 选择拒绝原因
    rejectSureClick () {
      if (this.reject_reason_obj.reason_id != null && this.reject_reason_obj.reason_id !== undefined) {
        this.rejectReasonPopupshow = false
          // on confirm
        let pickRejectClickData = {
          reload_no: this.detailData.reload_no,
          reason_id: this.reject_reason_obj.reason_id
        }
        console.log('测试', pickRejectClickData)
        RELOAD_REJECT_POST(pickRejectClickData).then(res => {
          console.log('缺货拒绝 res', res)
          if (res.code === 0) {
            this.$toast({
              message: '拒绝发货成功',
              iconClass: 'icon icon-success',
              className: 'successClass'
            })
            this.reject_reason_obj = {}
            this.isChange = false
            this.currentPage = 0
            this.isLoading = false
            this.isMoreLoading = false
            this.noMore = false
            this.activeIndex = 0
            this.reload_lists = []
            this.detailData = {}
            document.querySelector('.delivery_l_content').scrollTo(0, 0)
            this.rejectReasonPopupshow = false
            setTimeout(() => {
              this.isChange = true
            })
          }
        })
      } else {
        this.$toast('请选择拒绝原因')
      }
    },
    agreeBtnClick () {
      this.agreeDeliveryVisible = true
    },
    // 同意发货 click
    agreeDeliverySure () {
      this.agreeDeliveryVisible = false
      RELOAD_APPROVE_POST({reload_no: this.detailData.reload_no}).then(res => {
        if (res.code === 0) {
          this.reload_lists[this.activeIndex].state = 'waiting'
          this.$nextTick(() => {
            this.$toast({
              message: '操作成功',
              iconClass: 'icon icon-success',
              className: 'successClass'
            })
          })
          this.get_order_detail(this.detailData.reload_no)
        }
      })
    },
    // 查看明细
    lookDetail () {
      let anchorPointInfo = {
        scroll: document.querySelector('.delivery_l_content').scrollTop,
        state: this.state,
        activeIndex: this.activeIndex,
        stateActiveIndex: this.stateActiveIndex,
        currentPage: this.currentPage
      }
      window.localStorage.setItem('anchorPointInfo', JSON.stringify(anchorPointInfo))
      window.location.href = 'pad-reload-approve.html?token=' + window.localStorage.getItem('token') + '&reload_id=' + this.detailData.reload_id + '&reload_no=' +this.detailData.reload_no
    },
    // 去原生发货页面
    goDeliveryPage (detailData) {
      this.$bridge.callhandler('webCloudSkipToOrderListCallback', { reload_no: detailData.reload_no }, function (data) {})
    },
    paperScroll () {
      // var offsetTop = document.querySelector('.delivery_l_content').scrollTop
    },
    //  获取订单 [(‘1’, ‘已取消’), (‘2’, ‘已下单’), (‘3’, ‘已分配’), (‘4’, ‘已发货’), (‘8’, ‘部分发货’), (‘9’, ‘云仓无货’)]
    getOrderList () {
      var postData = {
        limit: this.limit,
        offset: this.currentPage * this.limit,
        // type: 'reload_apply'
        type: 'reload_approve'
      }
      if (this.state) {
        postData.state = this.state
      }
      RELOAD_LIST_GET(postData).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          res.data.reload_lists.forEach((data, index) => {
            let str = data.apply_date.split('-')[0] + data.apply_date.split('-')[1]
            if (this.timeArr.indexOf(str) < 0) {
              this.timeArr.push(str)
              data.show_title = true
            }
          })
          this.$nextTick(() => {
            this.reload_lists = this.reload_lists.concat(res.data.reload_lists)
            if (this.currentPage <= 0 && res.data.reload_lists && res.data.reload_lists.length > 0) {
              this.get_order_detail(res.data.reload_lists[0].reload_no)
            }
            // 加载状态结束
            this.isMoreLoading = false
            this.isLoading = false
            this.noMore = false

            // 数据全部加载完成
            if (res.data.reload_lists.length < this.limit) {
              this.isMoreLoading = true
              this.noMore = true
              this.isLoading = false
              console.log('没数据了', this.currentPage++)
            }
            this.currentPage++
          })
        }
      })
    },
    // 获取订单明细
    get_order_detail (reloadNo) {
      let postdetailData = {
        reload_no: reloadNo
      }
      RELOAD_DETAIL_GET(postdetailData).then(res => {
        console.log('订单详情', res)
        if (res.code === 0) {
          this.detailData = res.data
        }
      })
    }
  },
  mounted () {
    let _this = this
    // 获取移动端传过来的数据
    _this.doHaveRight = false
    _this.doHaveSubmit = false
    try{
      let permission = sessionStorage.getItem('permission');
      if(permission) {
        let _permission = JSON.parse(permission);
        if (_permission.permissionList.indexOf('pad_version_shop_reload_approve_view') > -1) {
          _this.doHaveRight = true
        }
        if (_permission.permissionList.indexOf('pad_version_shop_reload_approve_reject') > -1) {
          _this.doHaveSubmit = true
        }      
      }
    }catch(err) {}
    this.$bridge.registerhandler('webviewGetPermissionListCallRegister', function (data) {
      console.log('原生请求到的权限数据', data)
      sessionStorage.setItem('permission',JSON.stringify(data))
      if (data.permissionList.indexOf('pad_version_shop_reload_approve_view') > -1) {
        _this.doHaveRight = true
      }
      if (data.permissionList.indexOf('pad_version_shop_reload_approve_reject') > -1) {
        _this.doHaveSubmit = true
      }
    })
  },
  created () {
    this.isChange = true
    this.state = this.stateLists[0].code
    this.getRejectReason()
    // 获取用户权限 查看
    let _this = this
    // 获取用户权限 查看
    _this.doHaveRight = false
    _this.doHaveSubmit = false
    // 重新获取
    try{
      let permission = sessionStorage.getItem('permission');
      if(permission) {
        let _permission = JSON.parse(permission);
        if (_permission.permissionList.indexOf('pad_version_shop_reload_approve_view') > -1) {
          _this.doHaveRight = true
        }
        if (_permission.permissionList.indexOf('pad_version_shop_reload_approve_reject') > -1) {
          _this.doHaveSubmit = true
        }      
      }
    }catch(err) {}

    this.$bridge.callhandler('webviewSFAppPermissionListCallback', {}, function (data) {
      console.log('原生请求到的权限数据', data)
      sessionStorage.setItem('permission',JSON.stringify(data))
      if (data.permissionList.indexOf('pad_version_shop_reload_approve_view') > -1) {
        _this.doHaveRight = true
      }
      if (data.permissionList.indexOf('pad_version_shop_reload_approve_reject') > -1) {
        _this.doHaveSubmit = true
      }
    })
  },
  components: {
  }
}
</script>

<style scoped>
</style>