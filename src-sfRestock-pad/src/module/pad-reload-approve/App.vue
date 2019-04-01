<template>
  <div class="wrapper">
    <Navbar>
      <div class="icon-back" slot="left" @click="closeWebview">
        <img src="../../assets/images/icon-back.png" alt="<">
      </div>
      <div class="title-text" slot="mid">补货审批明细</div>
      <div id="searchCon" :class="{'search-con': true, hasStr: searchStr.length}" slot="right"
           v-show="shouldShowInputCon"  @click="getBlur($event)">
      <!-- <div id="searchCon" :class="['search-con', searchStr.length?'hasStr':'', shouldShowInputCon?'':'no_opacity']" slot="right" @click="getBlur($event)"> -->
        <div class="icon-bar">
          <img src="../../assets/images/icon-search.png"/>
        </div>
        <div class="input-bar">
          <input class="input-item" type="text" placeholder="搜索条件" v-model.trim="searchStr"
                 @input="handleInput">
          <div class="icon-delete" v-show="searchStr.length" @click="clearSearchStr"></div>
        </div>
        <!-- <div @click="getBlur($event)" style="width: 100%;display: flex;"><div class="icon-bar">
          <img src="../../assets/images/icon-search.png"/>
        </div>
        <div class="input-bar">
          <input class="input-item" type="text" placeholder="搜索条件" v-model.trim="searchStr"
                 @input="handleInput">
          <div class="icon-delete" v-show="searchStr.length" @click="clearSearchStr"></div>
        </div></div>  ref="searchInput" -->
        <transition name="slide-fade">
          <div class="result-list" v-show="shouldShowSearchResult">
            <div class="result-item" v-for="(item, idx) in screenedData" :key="idx" @click="chooseSearchItem(item)">
              {{searchResult(item)}}
            </div>
          </div>
        </transition>
      </div>
      <div id="searchIcon" class="icon-search-blue" slot="right" v-show="!shouldShowInputCon" @click="showSearchInput">
        <img src="../../assets/images/icon-search_blue.png"/>
      </div>
    </Navbar>

    <div class="main" :style="{height: mainHeight}">
      <!--操作栏-->
      <div class="toolbar">
        <div class="left">
          <div class="btn-view-diff" :class="{focus: isOnlyOutOfStock}" @click="toggleFilter" v-if="!pageIsHalf">只看差异</div>
        </div>
        <div class="right">
          <div class="before-focus" v-if="state === 'approve'&&!pageIsHalf">
            <div class="btn-item" v-for="(btnItem, idx) in 3" :key="idx" @click="sendNativeInput(idx)"></div>
            <el-popover
              v-model="shouldShowViewMore"
              placement="bottom"
              width="90"
              trigger="click"
            >
              <div :class="{'btn-more': true, focus: shouldShowViewMore}" slot="reference"></div>
              <div class="sub-btn-list">
                <div class="sub-btn-item" @click="clearAllData">
                  <div class="icon icon-rubbish"></div>
                  <div class="text">清空列表</div>
                </div>
                <!-- <div class="sub-btn-item">
                  <div class="icon icon-refresh"></div>
                  <div class="text">预留位置</div>
                </div> -->
              </div>
            </el-popover>
          </div>
        </div>
        <div class="close-btn-bar" @click="closeNativeModule" v-show="shouldShowCloseNativeBtn">
          <div class="btn-close-native"></div>
        </div>
      </div>

      <!--表格-->
      <div class="table" :style="{width: pageIsHalf ? '50%' : '100%', height: tableHeight}">
        <el-table
          v-if="isChange"
          ref="mTable"
          style="width: 100%;"
          :height="tableHeight"
          :data="screenedData"
          :row-class-name="tableRowClassName"
          @row-click="handleRowClick"
        >
          <el-table-column label="商品" align="left" width="330">
            <template slot-scope="scope">
              <div class="product-con">
                <div class="thumbnail">
                  <img v-if="scope.row.image_url" :src="scope.row.image_url"/>
                  <img v-else src="../../assets/images/goods-default.png"/>
                  <div class="mask" @click="showImage(scope.row.image_url, $event)"></div>
                </div>
                <div class="content">
                  <div class="code">{{ scope.row.product_code }}</div>
                  <div class="name">{{ scope.row.product_name }}</div>
                  <div class="sku">
                    <span v-if="scope.row.color_name">{{ scope.row.color_name + '；' }}</span>
                    <span v-if="scope.row.size_name">{{ scope.row.size_name }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="申请数量" align="center" v-if="!pageIsHalf">
            <template slot-scope="scope">
              <div class="num-con">
                <div class="num">{{ scope.row.apply_qty}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审批数量" align="center" v-if="!pageIsHalf">
            <template slot-scope="scope">
              <div class="num-con">
                <div class="num">{{ scope.row.approve_qty ? scope.row.approve_qty : 0 }}</div>
                <div class="icon-edit paddFa" @click="editCount(scope.row, scope.$index, $event)" v-if="state === 'approve'"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="差异数量" align="center" v-if="!pageIsHalf">
            <template slot-scope="scope">
              <div class="num-con">
                <div class="num" :class="{colorRed: isShowDiff(scope.row)}">{{ diffCount(scope.row) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" v-if="!pageIsHalf">
            <template slot-scope="scope">
              {{ scope.row.uom_name }}
            </template>
          </el-table-column>
          <el-table-column label="单价" align="center" v-if="!pageIsHalf">
            <template slot-scope="scope">
              {{ scope.row.unit_price | currency }}
            </template>
          </el-table-column>
          <el-table-column label="审批/申请数量" align="center" v-if="pageIsHalf">
            <template slot-scope="scope">
              <div class="simple-con">
                <span class="son" :class="{colorRed: isShowDiff(scope.row)}">{{scope.row.approve_qty}}</span>
                <span>/</span>
                <span class="father">{{scope.row.apply_qty}}</span>
                <span class="unit-name">（{{scope.row.uom_name}}）</span>
              </div>
            </template>
          </el-table-column>

          <!--没搜索结果占位符-->
          <div slot="empty" class="icon-no-search-result"></div>
        </el-table>
        <div v-else class="no-data">
          <img src="../../assets/images/nodata-placeholder.svg" />
        </div>
      </div>
      <!--选择商品sku属性-->
      <div class="edit-product" v-if="shouldShowSkuCon" :style="{height: editPropHeight}">
        <EditProperties
          :init-data="echoSkuData"
          :category="category"
          @close="shouldShowSkuCon = false; shouldShowCloseNativeBtn = false; pageIsHalf = false"
          @commit="addRowToTable"
        ></EditProperties>
      </div>
    </div>
    <!--底部栏-->
    <div class="bottom-bar" :style="{width: pageIsHalf ? 'calc(50% - 0.1rem)' : '100%'}">
      <div class="left">
        <div class="total-info" v-popover:popover>
          <div class="col-item">
            <div class="num">{{totalApplyCount}}</div>
            <div class="txt">申请数量</div>
          </div>
          <div class="col-item" v-if="!pageIsHalf">
            <div class="num">{{totalApplyPrice | currency}}</div>
            <div class="txt">申请金额</div>
          </div>
          <div class="col-item">
            <div class="num">{{totalApproveCount}}</div>
            <div class="txt">审批数量</div>
          </div>
          <div class="col-item" v-if="!pageIsHalf">
            <div class="num">{{totalApprovePrice | currency}}</div>
            <div class="txt">审批金额</div>
          </div>
          <div class="col-item">
            <div class="num" :class="{colorRed: totalDiffCount !== 0}">{{totalDiffCount}}</div>
            <div class="txt">差异数量</div>
          </div>
          <div class="col-item" v-if="!pageIsHalf">
            <div class="num" :class="{colorRed: totalDiffPrice !== 0}">{{totalDiffPrice | currency }}</div>
            <div class="txt">差异金额</div>
          </div>
        </div>
      </div>
      <div class="right" v-show="!pageIsHalf">
        <div class="btn-save" @click="save" v-show="state === 'approve'&&!isSaving">保存</div>
        <div class="btn-save disabled" v-show="state === 'approve'&&isSaving">保存</div>
      </div>
    </div>

    <!--录入数量的软键盘-->
    <SoftKeyboard
      :visible="shouldShowKeyboard"
      :init-count="currentRowInitCount"
      :event-source="keyboardEventSource"
      :allow-negative-num="true"
      @close="shouldShowKeyboard = false"
      @commit-num="chooseCount"
      @change-init-count="changeInitCountHandler"
    />
    <!--数量提示文案-->
    <el-popover
      ref="popover"
      placement="top"
      width="330"
      trigger="click"
    >
      <div class="text-con">
        <div class="tit">取值说明</div>
        <div class="sub-item">
          <div class="sub-tit">申请数量：</div>
          <div class="sub-desc">单据明细行，申请数量合计</div>
        </div>
        <div class="sub-item" v-if="!pageIsHalf">
          <div class="sub-tit">申请金额：</div>
          <div class="sub-desc">单据明细行，申请金额合计</div>
        </div>
        <div class="sub-item">
          <div class="sub-tit">审批数量：</div>
          <div class="sub-desc">单据明细行，审批数量合计</div>
        </div>
        <div class="sub-item" v-if="!pageIsHalf">
          <div class="sub-tit">审批金额：</div>
          <div class="sub-desc">单据明细行，审批金额合计</div>
        </div>
        <div class="sub-item">
          <div class="sub-tit">差异数量：</div>
          <div class="sub-desc">单据明细行，申请和审批的差异数量合计</div>
        </div>
        <div class="sub-item" v-if="!pageIsHalf">
          <div class="sub-tit">差异金额：</div>
          <div class="sub-desc">单据明细行，申请和审批的差异金额合计</div>
        </div>
      </div>
    </el-popover>
    <!--图片预览-->
    <PreviewImage
      v-if="shouldShowImagePreview"
      :image-src="currentImageSrc"
      :event-source="previewImageEventSource"
      @close="shouldShowImagePreview = false"
    />
  </div>
</template>

<script>
import SetHeight from '../../mixins/setHeight'
import ShowImage from '../../mixins/showImage'
import BlurSearch from '../../mixins/blurSearch'
import SendNative from '../../mixins/sendNative'
import EditSoftKeyboard from '../../mixins/editSoftKeyboard'
import EditProperties from '../../components/EditProperties/EditProperties'
import SetHighlight from '../../mixins/setHighlight'
import IsNeedAdd from '../../mixins/isNeedAdd'
import Navbar from '../../components/Navbar/Navbar.vue'
import { getUrlParameter, uuid, getDefaultUoms } from '../../api/util'
import { RELOAD_DETAIL_GET, RELOAD_DETAIL_GET_NOLOADING, RELOAD_UPDATE_POST } from '../../api'

export default {
  mixins: [SetHeight, ShowImage, BlurSearch, SendNative, EditSoftKeyboard, SetHighlight, IsNeedAdd],
  data () {
    return {
      isSaving: false,
      commonParams: {
        reload_id: parseInt(getUrlParameter()['reload_id']),
        reload_no: getUrlParameter()['reload_no'] || ''
      },
      tableDataFilter: [],
      countKeyName: 'approve_qty', // 需要软键盘组件修改数量的那个字段名
      isOnlyOutOfStock: false, // 是否只看缺货
      reloadId: '', // 补货单id
      reloadNo: '', // 补货单no
      state: '', // 补货状态
      shouldShowSkuCon: false, // 是否展示右边选择子商品模块
      category: 'reload_approve', // 业务类型 inventory: 盘点 shop_pick_out：调拨出库
      importType: '', // 批量导入类型：追加：add 替换：replace
      totalApplyCount: 0,
      totalApproveCount: 0,
      totalApplyPrice: 0,
      totalApprovePrice: 0,
      totalDiffCount: 0,
      totalDiffPrice: 0,
      isChange: true,
      isNotInsert: false, // 批量导入是否有不能导入的商品
      tableDataReplace: [],
      isInsertSuccess: false // 标记导入采集 替换当前时 是否有数据 成功导入
    }
  },
  computed: {
    diffCount () {
      return row => {
        let applyQty = row.apply_qty || 0
        let approveQty = row.approve_qty || 0
        return approveQty - applyQty
      }
    },
    isShowDiff () {
      return row => {
        let flag = this.diffCount(row) !== 0
        return flag
      }
    }
  },
  watch: {
    tableData: {
      handler (data) {
        this.caculator(data)
      },
      deep: true,
      immediate: true
    },
    pageIsHalf: {
      handler (data) {
        this.isChange = false
        setTimeout(() => {
          this.isChange = true
        })
      },
      deep: true,
      immediate: true
    },
    isOnlyOutOfStock (val) {
      if (val) {
        this.tableDataFilter = JSON.parse(JSON.stringify(this.tableData))
        let tableData = this.tableData.filter(item => {
          return this.isShowDiff(item)
        })
        this.tableData = tableData
      } else {
        this.tableData = this.tableDataFilter
      }
    }
  },
  created () {
    if (getUrlParameter()['reload_id'] && getUrlParameter()['reload_no']) {
      this.getList()
    }
  },
  mounted () {
    this.registNativeCallBack()
  },
  methods: {
    // 左上角 返回
    closeWebview () {
      let addAndModified = this.tableData.filter(item => {
        return item.isModified
      })
      this.closeNativeModule()
      if (addAndModified.length) {
        this.$message.confirm('是否保存该页面的操作?').then(action => {
          console.log(action)
          this.save()
        }).catch(cacel => {
          // this.$bridge.callhandler('webviewPageCloseCallback', {})
          window.location.href = 'replenishApproval.html?token=' + (getUrlParameter()['token'])
        })
      } else {
        // this.$bridge.callhandler('webviewPageCloseCallback', {})
        window.location.href = 'replenishApproval.html?token=' + (getUrlParameter()['token'])
      }
    },
    tableRowClassName ({row, rowIndex}) {
      if (this.isShowDiff(row)) {
        return 'yellow'
      }
      return ''
    },
    async getList () {
      try {
        let { data } = await RELOAD_DETAIL_GET(this.commonParams)
        if (data) {
          let {
            lines,
            state,
            reload_id: reloadId,
            reload_no: reloadNo
          } = data

          let tableData = lines.map(item => {
            item[this.countKeyName] = item[this.countKeyName] ? item[this.countKeyName] : 0
            item.uuid = uuid()
            return item
          })
          this.reloadId = reloadId
          this.reloadNo = reloadNo
          this.state = state
          this.tableData = tableData
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getListNoloading () {
      try {
        let { data, message } = await RELOAD_DETAIL_GET_NOLOADING(this.commonParams)
        if (data) {
          let {
            lines,
            state,
            reload_id: reloadId,
            reload_no: reloadNo
          } = data

          let tableData = lines.map(item => {
            item[this.countKeyName] = item[this.countKeyName] ? item[this.countKeyName] : 0
            item.uuid = uuid()
            return item
          })
          this.reloadId = reloadId
          this.reloadNo = reloadNo
          this.state = state
          this.tableData = tableData
        } else {
          this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent(message), title: encodeURIComponent('提示') })
        }
        this.isSaving = false
      } catch (e) {
        console.log(e)
        this.isSaving = false
      }
    },
    caculator (data) {
      let totalApplyCount = 0
      let totalApproveCount = 0
      let totalApplyPrice = 0
      let totalApprovePrice = 0
      let totalDiffCount = 0
      let totalDiffPrice = 0
      data.forEach(item => {
        let applyQty = item.apply_qty || 0
        let approveQty = item.approve_qty || 0
        let unitPrice = item.unit_price || 0
        totalApplyCount += applyQty
        totalApproveCount += approveQty
        totalApplyPrice += applyQty * unitPrice
        totalApprovePrice += approveQty * unitPrice
        totalDiffCount += this.diffCount(item)
        totalDiffPrice += this.diffCount(item) * unitPrice
      })
      this.totalApplyCount = totalApplyCount
      this.totalApproveCount = totalApproveCount
      this.totalApplyPrice = totalApplyPrice
      this.totalApprovePrice = totalApprovePrice
      this.totalDiffCount = totalDiffCount
      this.totalDiffPrice = totalDiffPrice
    },
    toggleFilter () {
      this.isOnlyOutOfStock = !this.isOnlyOutOfStock
    },
    chooseCount (num) {
      let rowIndex = this.tableData.findIndex(item => item.uuid === this.currentRowUUID)
      let filterRowIndex = this.tableDataFilter.findIndex(item => item.uuid === this.currentRowUUID)

      if (rowIndex > -1) {
        this.tableData[rowIndex][this.countKeyName] = num
        if (this.tableData[rowIndex].line_id > 0) {
          this.tableData[rowIndex].isModified = true
        }
      }
      if (filterRowIndex > -1) {
        this.tableDataFilter[filterRowIndex][this.countKeyName] = num
        if (this.tableDataFilter[filterRowIndex].line_id > 0) {
          this.tableDataFilter[filterRowIndex].isModified = true
        }
      }
      this.shouldShowKeyboard = false
    },
    registNativeCallBack () {
      this.$bridge.registerhandler('webviewGetProductAddInfoCallRegister', this.nativeCallback)
    },
    nativeCallback (res) {
      let { type, importType, detail } = res
      if (type === 0 || type === 1) {
        // this.showSkuAndInitData(detail)
        this.newgetDetailCb(detail, this.category, type)
        // this.$bridge.callhandler('webviewHideProductAddCallHandler', { type })
      }
      if (type === 2) {
        this.importType = importType
        if (importType === 'add') {
          this.importProducts(detail, importType)
        }
        if (importType === 'replace') {
          // 标记是否有数据 成功导入
          this.isInsertSuccess = false
          // 现将tableData 数据存一份 以防万一 导入采集 替换当前 数据不成功
          this.tableDataReplace = JSON.parse(JSON.stringify(this.tableData))
          this.tableData = this.tableData.map(item => {
            item[this.countKeyName] = 0
            item.isModified = true
            return item
          })
          this.importProducts(detail, importType)
        }
        // this.$bridge.callhandler('webviewHideProductAddCallHandler', { type })
      }
    },
    async importProducts (detail = []) {
      let productCodeList = detail.map(item => item.productCode)
      let uomMap = await getDefaultUoms(productCodeList, true)
      let addLines = detail.map(item => {
        let colorName = ''
        let sizeName = ''
        if (Array.isArray(item.selectedType) && item.selectedType.length === 2) {
          colorName = item.selectedType[0].name
          sizeName = item.selectedType[1].name
        }
        let rowItem = {
          line_id: 0,
          image_url: item.thumbnailUrl,
          product_id: item.productId,
          product_code: item.productCode,
          product_name: item.productName,
          color_name: colorName,
          size_name: sizeName,
          [this.countKeyName]: item.num,
          uom_name: uomMap[item.productCode].uom_name,
          uom_id: uomMap[item.productCode].uom_id,
          unit_price: uomMap[item.productCode].unit_price
        }
        return rowItem
      })
      console.log(addLines)
      let total = 0
      addLines.forEach(item => {
        this.continueAddRowToTable(item, ++total, addLines.length)
      })
    },
    continueAddRowToTable (row, count, totalLength) {
      let index = this.tableData.findIndex(rowItem => (rowItem.product_code === row.product_code && rowItem.uom_id === row.uom_id))
      if (index > -1) {
        let curRow = this.tableData[index]
        if ((curRow[this.countKeyName] + row[this.countKeyName]) <= curRow.apply_qty) {
          this.tableData[index][this.countKeyName] += [this.countKeyName]
          this.tableData[index].isModified = true
          this.isInsertSuccess = true
        } else {
          // this.$toast('审批数量不能大于申请数量')
          this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('审批数量不能大于申请数量'), title: encodeURIComponent('提示') })
        }
      } else {
        this.isNotInsert = true
        console.log('不能添加现有列表中没有的商品', row.product_name)
      }
      if (count === totalLength) {
        // this.shouldShowCloseNativeBtn = false
        // this.pageIsHalf = false
        if (!this.isInsertSuccess && this.importType === 'replace') {
          // 没有数据成功 导入  还原tableData
          this.tableData = JSON.parse(JSON.stringify(this.tableDataReplace))
        }
        if (this.isNotInsert) {
          // this.$toast('不能添加现有列表中没有的商品')
          this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('不能添加现有列表中没有的商品'), title: encodeURIComponent('提示') })
          this.isNotInsert = false
        }
      }
    },
    showSkuAndInitData (res) {
      this.echoSkuData = res
      this.shouldShowSkuCon = true
      console.log('显示商品属性选择框...')
    },
    addRowToTable (row) {
      let index = this.tableData.findIndex(rowItem => (rowItem.product_code === row.product_code && rowItem.uom_id === row.uom_id))
      if (index > -1) {
        let curRow = this.tableData[index]
        if ((curRow[this.countKeyName] + row[this.countKeyName]) <= curRow.apply_qty) {
          this.tableData[index][this.countKeyName] += [this.countKeyName]
          this.tableData[index].isModified = true
        } else {
          // this.$toast('审批数量不能大于申请数量')
          this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('审批数量不能大于申请数量'), title: encodeURIComponent('提示') })
        }
      } else {
        // this.$toast('发货单中没有该商品')
        this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('发货单中没有该商品'), title: encodeURIComponent('提示') })
      }
      // this.shouldShowCloseNativeBtn = false
      // this.shouldShowSkuCon = false
      // this.pageIsHalf = false
      if (this.shouldShowSkuCon) {
        this.shouldShowSkuCon = false
        this.pageIsHalf = false
      }
    },
    clearAllData () {
      this.$message.confirm('确认清空列表？').then(action => {
        let tableData = this.tableData.map(item => {
          item[this.countKeyName] = 0
          item.isModified = true
          return item
        })
        this.tableData = tableData
        this.shouldShowViewMore = false
      })
    },
    handleRowClick (row, column, event) {
      this.reSetRowHighLight()
      if (event.target.className === 'code') {
        this.jumpToGoodsDetail(row)
      }
    },
    reSetRowHighLight () {
      clearTimeout(this.$timer)
      this.$timer = setTimeout(() => {
        this.$refs.mTable.setCurrentRow()
      }, 750)
    },
    async save () {
      this.isSaving = true
      try {
        this.isOnlyOutOfStock = false
        let allowedKeys = ['line_id', 'apply_qty', 'approve_qty', 'product_id', 'uom_id', 'unit_price']
        let params = {
          reload_id: this.reloadId,
          reload_no: this.reloadNo,
          lines: []
        }

        let addAndModified = this.tableData.filter(item => {
          return item.isModified
        })
        let postLines = addAndModified.map(item => {
          let newItem = {}
          allowedKeys.forEach(key => {
            newItem[key] = item[key]
          })
          return newItem
        })

        params.lines = postLines

        let { data, message } = await RELOAD_UPDATE_POST(params)
        if (data) {
          this.getListNoloading()
          this.$bridge.callhandler('alertSuccessCallback', { msg: encodeURIComponent('保存成功') })
        } else {
          this.isSaving = false
          this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent(message), title: encodeURIComponent('提示') })
        }
      } catch (e) {
        console.log(e)
        this.isSaving = false
      }
    },
    jumpToGoodsDetail (row) {
      let params = {
        product_code: row.product_code,
        product_id: row.product_id
      }
      this.$bridge.callhandler('webviewJumpToProductStockDetailCallHandler', params)
    }
  },
  components: {
    Navbar,
    EditProperties
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/css/mixin.styl"

  .icon-back
    height .24rem
    img
      height 100%

  .title-text
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    font-size .19rem
    font-weight bold

  .icon-search-blue
    width .24rem
    height .24rem
    img
      width 100%
      height 100%
  .search-con
    position relative
    display flex
    width 2.64rem
    height .38rem
    border 1px solid #f2f2f5
    border-radius .04rem
    background-color #f2f2f5
    &.hasStr
      border 1px solid #1296DB
      background-color #fff
    .icon-bar
      display flex
      align-items center
      justify-content center
      width .38rem
      height .38rem
      img
        width .24rem
        height .24rem
    .input-bar
      position relative
      display flex
      flex 1
      height 100%
      .input-item
        width 100%
        height 100%
        background-color transparent
        border none
        outline none
        font-size .16rem
        color #34495E
        padding-right .2rem
        overflow-x auto
      .icon-delete
        position absolute
        right .1rem
        top .11rem
        width .15rem
        height .15rem
        background-repeat no-repeat
        background-size .15rem .15rem
        background-position center
        background-image url('../../assets/images/input-delete.png')
        extend-click()
    .result-list
      position absolute
      width 2.6rem
      left .02rem
      top .45rem
      max-height 2rem
      overflow-y auto
      box-shadow 0 .05rem .15rem rgba(0, 0, 0, .2)
      padding-left .1rem
      background-color #fff
      z-index 20
      .result-item
        line-height .4rem
        padding 0 .2rem 0 .1rem
        width 2.6rem
        height .4rem
        border-bottom 1px solid #e4e4e5
        font-size .16rem
        color #34495E
        no-wrap()
        &:last-child
          border-bottom none

  .bottom-bar
    position absolute
    left 0
    bottom 0
    display flex
    width 100%
    height .7rem
    background-color #fff
    .left
      display flex
      flex 2
      padding .12rem 0 .035rem .1rem
      .total-info
        display flex
        background-image url("../../assets/images/icon-total-info.png")
        background-size .26rem .26rem
        background-position left bottom
        background-repeat no-repeat
        height 100%
        padding-left .41rem
        .col-item
          display flex
          flex-direction column
          align-items center
          justify-content center
          margin-right .26rem
          .num
            font-size .16rem
            color #34495E
            font-weight bold
            margin-bottom .03rem
          .txt
            font-size .12rem
            color #34495E
    .right
      display flex
      align-items center
      justify-content flex-end
      flex 1
      padding-right .1rem
      .btn-save
        display flex
        align-items center
        justify-content center
        line-height 1
        width 1.4rem
        height .4rem
        background-color #1296db
        color #fff
        font-size .16rem
        font-weight 300
        border-radius .04rem

  .main
    position relative
    width 100%
    .toolbar
      position relative
      display flex
      align-items center
      width 100%
      height 0.64rem
      padding 0 .1rem
      .left
        display flex
        flex 1
        height .48rem
        padding-left .15rem
        .btn-view-diff
          width 1.1rem
          height .34rem
          background-image url("../../assets/images/zhikanchayi.png")
          background-repeat no-repeat
          background-position center
          background-size 1.1rem .34rem
          margin-right .21rem
          font-size .12rem
          font-weight 500
          color #34495E
          line-height .34rem
          padding-left .39rem
          &.focus
            background-image url("../../assets/images/zhikanchayi-focus.png")
            color #fff
      .right
        display flex
        height .48rem
        .before-focus
          display flex
          align-items center
          justify-content flex-end
          width 100%
          height 100%
          .btn-item
            width .9rem
            height .4rem
            background-repeat no-repeat
            background-position center
            background-size .9rem .4rem
            margin-right .3rem
            &:nth-child(1)
              background-image url('../../assets/images/shougongtianjia.svg')
            &:nth-child(2)
              background-image url('../../assets/images/saomatianjia.svg')
            &:nth-child(3)
              background-image url('../../assets/images/daorucaiji.svg')
          .btn-more
            width .9rem
            height .4rem
            background-repeat no-repeat
            background-position center
            background-size .9rem .4rem
            margin-right .3rem
            background-image url('../../assets/images/gengduo.svg')
            margin-right .25rem
            &.focus
              background-image url('../../assets/images/gengduo-focus.svg')

  .close-btn-bar
    position absolute
    top 0
    right 0
    width 50%
    height 100%
    padding-right .25rem
    display flex
    align-items center
    justify-content flex-end
    background-color #f6f7fa
    .btn-close-native
      width .23rem
      height .23rem
      background-repeat no-repeat
      background-position center
      background-size .23rem .23rem
      background-image url('../../assets/images/icon-close-native.png')

  .table
    padding 0 .1rem

  .no-data
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    img
      width 1.963rem
      height 2.184rem

  .icon-no-search-result
    display inline-block
    width 1.51rem
    height 1.68rem
    background-position center
    background-repeat no-repeat
    background-size 1.51rem 1.68rem
    background-image url('../../assets/images/no-search-result.png')

  .product-con
    display flex
    .thumbnail
      position relative
      width .48rem
      height .48rem
      margin-right .1rem
      img
        width 100%
        height 100%
        object-fit cover
      .mask
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color rgba(255, 255, 255, .5)
    .content
      display flex
      flex 1
      flex-direction column
      .code
        font-size .16rem
        color #1296DB
        text-decoration underline
      .name, .sku
        font-size .14rem
        color #A7AAB2

  .num-con
    display flex
    align-items center
    justify-content center
    .num
      font-size .16rem
      color #34495E
      line-height 1
      margin-right .24rem
    .icon-edit
      width .15rem
      height .15rem
      background-image url('../../assets/images/icon-edit.png')
      background-repeat no-repeat
      background-position center
      background-size .15rem .15rem

  .control-bar
    display flex
    justify-content center
    .btn-delete
      width .18rem
      height .18rem
      background-image url('../../assets/images/icon-del-row.png')
      background-repeat no-repeat
      background-position center
      background-size .18rem .18rem

  .simple-con
    display flex
    justify-content center
    span
      color #A7AAB2
      &.son
        color #34495E
      &.father
        margin-right 10px

  .colorRed
    color #FF0008 !important

  .edit-product
    position fixed
    width 50%
    top .8rem
    right 0
    z-index 10

  .slide-fade-enter-active
    transition: all .3s ease;
  .slide-fade-leave-active
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  .slide-fade-enter, .slide-fade-leave-to
    transform: translateY(10px)
    opacity: 0
</style>
