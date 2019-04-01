<template>
    <div>
      <div class="replenishApprovalPage flex">
        <div class="deliverypage_l">
          <div class="delivery_l_content">
            <div class="bg_70"></div>
            <div :style="{maxHeight: minHeight + 'px', height: minHeight + 'px'}" id="testPaper" @scroll="paperScroll()">
            <mt-loadmore v-if="isChange" :top-method="loadTop" :top-distance="0" :bottom-all-loaded="false" ref="loadmore">
              <div
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="isMoreLoading"
                infinite-scroll-distance="10">
                <div class="item" v-for="(item,index) in reload_lists" :key="index">
                  <div class="time_tit" v-show="item.show_title" :class="[index===0 ? 'noborderTop' : '']">{{item.apply_date.split('-')[0] + '-' + item.apply_date.split('-')[1]}}</div>
                  <div class="whiteBg">
                    <div class="box" :class="{'bluebg': activeIndex===index}"
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
              <div class="top_icon_r flex-center" @click="addPage" v-show="doHaveEdit">
                <img src="../../assets/images/top_add.svg" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="deliverypage_r" >
          <div class="header flex-start">
            <div>
              <span>补货申请</span>
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
              <div v-show="detailData.state==='draft'&&doHaveEdit" class="self_button edit" @click="editMaintenance(true, detailData)">编辑</div>
              <div class="lineItem ">
                <div class="line_l">
                  <label>申请日期：</label>
                  <div v-if="detailData.apply_date" class="ele_item">{{detailData.apply_date}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
              </div>
              <div class="lineItem">
                <div class="line_l">
                  <label>发货店仓：</label>
                  <div v-if="detailData.source_org_name" class="ele_item textOverflow" style="max-width:4rem;">{{detailData.source_org_name}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
              </div>
              <div class="lineItem">
                <div class="line_l">
                  <label>申请店仓：</label>
                  <div v-if="detailData.target_org_name" class="ele_item">{{detailData.target_org_name}}</div>
                  <div v-else class="ele_item">--</div>
                </div>
              </div>
              <div class="lineItem">
                <div class="line_l cell_link">
                  <div class="flex-start">
                    <label>申请数量：</label>
                  <div v-if="detailData.apply_total_qty" class="ele_item address">{{detailData.apply_total_qty}}</div>
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
                <div class="self_button" @click="lookDetail(detailData)" style="margin-top: -8px;" v-show="(detailData.reload_no != '')&& doHaveRight ">查看明细</div>
              </div>
              <table>
                <thead>
                  <tr class="">
                    <th></th>
                    <th><div class="cell">商品编码</div></th>
                    <th><div class="cell">尺寸</div></th>
                    <th><div class="cell">颜色</div></th>
                    <th><div class="cell">单价</div></th>
                    <th><div class="cell">数量</div></th>
                  </tr>
                </thead>
                <tbody class="selftable" :style="{maxHeight: isOpen ? '220px' : '329px'}">
                  <tr v-for="(item,index) in detailData.lines" :key="index">
                    <td>
                      <div class="cell">
                        <img v-if="item.image_url" :src="item.image_url">
                        <img v-else src="../../assets/images/bitmap.svg" />
                      </div>
                    </td>
                    <td><div class="cell setLine">{{item.product_code || '--'}}</div></td>
                    <td><div class="cell">{{item.size_name || '--'}}</div></td>
                    <td><div class="cell textOverflow" style="width: 150px;">{{item.color_name || '--'}}</div></td>
                    <td><div class="cell">{{item.unit_price | currency}}</div></td>
                    <td><div class="cell">{{item.apply_qty || '--'}}</div></td>
                  </tr>
                  <tr v-if="!detailData.lines||detailData.lines.length<=0">
                    <td colspan="6"><div class="cell empty">暂无商品明细信息</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="fool" v-if="detailData.state==='draft' || detailData.state==='reject'">
            <div v-show="(detailData.state==='draft' || detailData.state==='reject')&&doHaveSubmit" class="reject_btn" @click="cancelApply">取消申请</div>
            <div v-show="(detailData.state==='draft' || detailData.state==='reject')&&doHaveSubmit" class="fahuo_btn mix" style="max-width: 320px;" @click="submit()">提交申请</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import './index.less'
import {
  RELOAD_LIST_GET,
  RELOAD_DETAIL_GET,
  RELOAD_SUBMIT_GET,
  RELOAD_CANCEL_GET
} from '@/api/index.js'
import { getUrlParameter } from '../../api/util'
// import { setTimeout } from 'timers';
export default {
  data () {
    return {
      // 编辑
      doHaveEdit: false,
      // 提交
      doHaveSubmit: false,
      // 权限控制
      doHaveRight: false,
      // 选中左侧的商品
      leftItems: {},
      // 商品列表的高度
      maxListHeight: 0,
      // 加载更多中
      isMoreLoading: false,
      isLoading: false,
      noMore: false,
      // 是否 有草稿的单子
      isHaveDraftBol: false,
      isOpen: false,
      pullRefreshDis: false,
      height: window.innerHeight - 70,
      minHeight: window.innerHeight - 70,
      activeIndex: 0,
      // 选择状态
      selectStatePopupShow: false,
      stateActiveIndex: 0,
      isChange: false,
      stateLists: [{
        state: '全部状态',
        code: ''
      }, {
        state: '草稿',
        code: 'draft'
      }, {
        state: '待审批',
        code: 'approve'
      }, {
        state: '待收货',
        code: 'confirm'
      }, {
        state: '已完成',
        code: 'done'
      }, {
        state: '已拒绝',
        code: 'reject'
      }, {
        state: '已取消',
        code: 'cancel'
      }],
      // 订单list
      reload_lists: [],
      // 时间数组
      timeArr: [],
      // 右侧的订单详情
      detailData: {},
      cloud_picks_status_text: {
        'approve': '待审批',
        'draft': '草稿',
        'cancel': '已取消',
        'waiting': '待发货',
        'confirm': '待收货',
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
      this.$bridge.callhandler('webviewWarehouseOrStorePageCallback', {flag: 'apply', type: this.detailData.type, reload_no: this.detailData.rel_pick_no}, function (data) {})
    },
    loadMore () {
      this.isMoreLoading = true
      this.isLoading = true
      this.noMore = false
      setTimeout(() => {
        this.getOrderList()
      }, 0)
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
      // 下拉刷新
      this.$refs.loadmore.onTopLoaded()
    },
    getBlur (event) {
      try {
        event.currentTarget.querySelector('input').focus()
      } catch (err) {
        console.log(err)
      }
    },
    // 选择状态
    selectStateClick (item, index) {
      let oldCode = this.state
      if (oldCode !== item.code) {
        this.isMoreLoading = false
        this.isLoading = false
        this.noMore = false
        this.isChange = false
        this.timeArr = []
        this.currentPage = 0
        this.activeIndex = 0
        this.stateActiveIndex = index
        this.state = item.code
        this.reload_lists = []
        this.detailData = {}

        this.$nextTick(() => {
          this.selectStatePopupShow = false
        })
        setTimeout(() => {
          this.isChange = true
        }, 0)
      } else {
        this.selectStatePopupShow = false
      }
    },
    // 提交申请
    submit () {
      if (this.detailData.lines.length === 0) {
        this.$toast({
          message: '商品明细不能为空',
          iconClass: 'icon icon-warning'
        })
        return false
      }
      this.$message.confirm('确认提交补货申请?').then(action => {
        let _data = {
          reload_no: this.detailData.reload_no,
          reload_id: this.detailData.reload_id
        }
        RELOAD_SUBMIT_GET(_data).then(res => {
          this.loadTop()
        })
      })
    },
    // 切换到菜单栏的birdge方法
    switchPage () {
      this.$bridge.callhandler('webviewSwitchPageCallback', {}, function (data) {})
    },
    // 新建一个申请补货单
    addPage () {
      window.location.href = 'replenishApplyEdit.html?shop_id=' + parseInt(getUrlParameter()['shop_id'])
      window.localStorage.removeItem('applyDetailData')
      window.localStorage.setItem('org_id', parseInt(getUrlParameter()['org_id']) || parseInt(window.localStorage.getItem('org_id')))
    },
    // 选择左侧
    selectMan (item, index) {
      this.leftItems = item
      this.activeIndex = index
      this.$refs.header.style.zIndex = 99
      setTimeout(() => {
        this.$refs.header.style.zIndex = 999
      })
      this.get_order_detail(item.reload_no)
    },
    // 查看明细
    lookDetail (detailData) {
      window.location.href = 'pad-reload-apply.html?reload_no=' + this.detailData.reload_no + '&reload_id=' + this.detailData.reload_id + '&shop_id=' + (getUrlParameter()['shop_id']) + '&org_id=' + (getUrlParameter()['org_id'])
      window.localStorage.setItem('applyDetailData', JSON.stringify(detailData))
    },
    // 去查询订单页面
    goWebCloudSkipToOrder (saleOrderNo) {
      this.$bridge.callhandler('webCloudSkipToOrderListCallback', { cloud_order_no: saleOrderNo }, function (data) {})
    },
    // 去云仓商品
    goClondInfoPage (cloudPickNo, shippingStatus) {
      this.scroll = document.querySelector('.delivery_l_content').scrollTop
      this.$router.push({
        name: 'cloudDeliveryInfo',
        params: {
          cloud_pick_no: cloudPickNo,
          cloud_order_no: this.detailData.cloud_order_no
        }
      })
    },
    paperScroll () {
      var offsetTop = document.querySelector('.delivery_l_content').scrollTop
      if (offsetTop <= 45) {
        this.pullRefreshDis = false
      } else {
        this.pullRefreshDis = true
      }
    },
    // 编辑
    editMaintenance (flag, detailData) {
      window.location.href = 'replenishApplyEdit.html?shop_id=' + (getUrlParameter()['shop_id']) + '&org_id=' + (getUrlParameter()['org_id']) || parseInt(window.localStorage.getItem('org_id'))
      window.localStorage.setItem('applyDetailData', JSON.stringify(detailData))
    },
    getOrderList () {
      var postData = {
        limit: this.limit,
        offset: this.currentPage * this.limit,
        type: 'reload_apply'
      }
      if (this.state) {
        postData.state = this.state
      }
      RELOAD_LIST_GET(postData).then(res => {
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
              this.leftItems = res.data.reload_lists[0]
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
            }
            this.currentPage++
          })
        }
      })
    },
    // 取消申请
    cancelApply () {
      this.$message.confirm('是否取消申请?').then(action => {
        let _data = {
          reload_no: this.detailData.reload_no,
          reload_id: this.detailData.reload_id
        }
        RELOAD_CANCEL_GET(_data).then(res => {
          this.loadTop()
        })
      })
    },
    // 获取订单明细
    get_order_detail (reloadNo) {
      let postdetailData = {
        reload_no: reloadNo
      }
      RELOAD_DETAIL_GET(postdetailData).then(res => {
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
    _this.doHaveEdit = false
    try {
      let permission = sessionStorage.getItem('permission')
      if (permission) {
        let _permission = JSON.parse(permission)
        if (_permission.permissionList.indexOf('pad_version_shop_reload_apply_view') > -1) {
          _this.doHaveRight = true
        }
        if (_permission.permissionList.indexOf('pad_version_shop_reload_submit_cancel') > -1) {
          _this.doHaveSubmit = true
        }
        if (_permission.permissionList.indexOf('pad_version_shop_reload_create_edit') > -1) {
          _this.doHaveEdit = true
        }
      }
    } catch (err) {}
    this.$bridge.registerhandler('webviewGetPermissionListCallRegister', function (data) {
      console.log('安卓给到的权限数据', data)
      sessionStorage.setItem('permission', JSON.stringify(data))
      if (data.permissionList.indexOf('pad_version_shop_reload_apply_view') > -1) {
        _this.doHaveRight = true
      }
      if (data.permissionList.indexOf('pad_version_shop_reload_submit_cancel') > -1) {
        _this.doHaveSubmit = true
      }
      if (data.permissionList.indexOf('pad_version_shop_reload_create_edit') > -1) {
        _this.doHaveEdit = true
      }
    })
  },
  created () {
    this.isChange = true
    this.state = this.stateLists[0].code
    // 获取用户权限 查看
    let _this = this
    // 获取用户权限 查看
    _this.doHaveRight = false
    _this.doHaveSubmit = false
    _this.doHaveEdit = false
    try {
      let permission = sessionStorage.getItem('permission')
      if (permission) {
        let _permission = JSON.parse(permission)
        if (_permission.permissionList.indexOf('pad_version_shop_reload_apply_view') > -1) {
          _this.doHaveRight = true
        }
        if (_permission.permissionList.indexOf('pad_version_shop_reload_submit_cancel') > -1) {
          _this.doHaveSubmit = true
        }
        if (_permission.permissionList.indexOf('pad_version_shop_reload_create_edit') > -1) {
          _this.doHaveEdit = true
        }
      }
    } catch (err) {}
    this.$bridge.callhandler('webviewSFAppPermissionListCallback', {}, function (data) {
      console.log('原生请求到的权限数据', data)
      sessionStorage.setItem('permission', JSON.stringify(data))
      if (data.permissionList.indexOf('pad_version_shop_reload_apply_view') > -1) {
        _this.doHaveRight = true
      }
      if (data.permissionList.indexOf('pad_version_shop_reload_submit_cancel') > -1) {
        _this.doHaveSubmit = true
      }
      if (data.permissionList.indexOf('pad_version_shop_reload_create_edit') > -1) {
        _this.doHaveEdit = true
      }
    })
  },
  components: {
  }
}
</script>

<style scoped>
</style>