<template>
  <div class="out-con">
    <div class="row-con">
      <div class="pdtImg">
        <img v-if="productImg" :src="productImg">
        <img v-else src="../../assets/images/goods-default.png" />
      </div>
      <div class="right">
        <div class="name">{{productName}}</div>
        <div class="code">{{productCode}}</div>
        <div class="sub-con">
          <!-- <div class='stock' v-show="stockCount !== '' && stockCount !== undefined && stockCount !== null">库存：{{stockCount}}{{uomName}}</div> -->
          <div class="price">{{showPrice | currency}}</div>
        </div>
      </div>
    </div>
    <div class="mid">
      <span class="lab">数量</span>
      <div class="row-lab">
        <img @click="count(0)" class="btn" src="../../assets/images/icon_minus.png">
        <span class="val">
          <input type="text" v-model.trim="num" @input="handleInput">
        </span>
        <img @click="count(1)" class="btn" src="../../assets/images/icon_plus.png">
      </div>
    </div>
    <div class="sku-con" :style="{height: skuConHeight}">
      <!--规格选择框-->
      <div class="sku-group" v-for="(specificationItem, idx) in typeList" :key="idx">
        <div class="group-tit">{{specificationItem.type_name}}</div>
        <div class="label-list">
          <div
            :class="{'label-item': true, isSelected: selectedType[idx] === skuItem.variant_code, isDisabled: skuItem.isDisabled}"
            v-for="(skuItem, ind) in specificationItem.lines"
            :key="ind"
            @click="chooseType(skuItem, ind, idx)"
          >{{skuItem.variant_name}}</div>
        </div>
      </div>
      <!--单位选择框-->
      <div v-show="productCode">
        <div class="sku-group">
          <div class="group-tit">单位</div>
          <div class="label-list">
            <div class="label-item"
                 :class="{isSelected: index === uomTag}"
                 @click="chooseUom(index)"
                 v-for="(uom, index) in uomList"
                 :key="'uom' + index">
              {{uom.uom_name}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_edit">
      <div @click="back" class="back"><span>取消</span></div>
      <div @click="addCar" class="add"><span>确认</span></div>
    </div>
  </div>
</template>

<script>
import { PRODUCT_DETAIL_GET, PRODUCT_VARIANTINFO_GET, PRODUCT_UOM_GET } from '../../api/index.js'
export default {
  props: {
    initData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 业务分类 例如：盘点 inventory  调拨出库 shop_pick_out
    category: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      productId: -1,
      parentProductCode: '', // 父商品编码
      productCode: '', // 商品编码
      productName: '', // 商品名称
      productImg: '',
      price: 0, // 商品单价
      industry: '', // 所属行业: catering: 餐饮 | clothing: 服装 | cosmetics: 化妆品
      type: '', // 商品类型: product: 普通商品 | variant: 多规格商品
      num: 1, // 数量
      numBackup: 1, // 备份
      products: [], // 商品组合列表(每项有BOM信息)
      productMap: {}, // 商品组合 key-value映射(无BOM，有预览图)
      typeList: [], // 多规格sku列表
      selectedType: [], // 已选中的规格
      skuConHeight: 0,
      stockCount: '', // 库存数量
      uomId: '', // 商品计量单位id
      uomName: '', // 商品计量单位名称
      isSonProduct: false,
      colorName: '',
      sizeName: '',
      uomList: [], // 单位列表
      uomTag: -1
    }
  },
  mounted () {
    this.setHeight()
    this.getDetailCb(this.initData)
  },
  computed: {
    showPrice () {
      return this.price
    }
  },
  filters: {
    currency (price = 0) {
      return price.toFixed(2)
    }
  },
  methods: {
    // 选择单位
    chooseUom (index) {
      this.uomTag = index
      this.uomName = this.uomList[index].uom_name
      this.uomId = this.uomList[index].uom_id
      this.price = this.uomList[index].sale_price
      this.productId = this.uomList[index].product_id
    },
    setHeight () {
      let html = document.documentElement || document.getElementsByTagName('html')[0]
      let rootFontSize = parseFloat(html.style.fontSize)
      let top = 160
      let bottom = rootFontSize * 0.7
      let containerHeight = html.clientHeight - rootFontSize * 0.8
      let skuConHeight = parseInt(containerHeight - top - bottom)
      this.skuConHeight = skuConHeight + 'px'
      // this.skuConHeight = '3.8rem'
      // console.log(containerHeight, top, bottom, skuConHeight, html.style.fontSize)
    },
    getDetailCb (detail) {
      let {
        productId,
        parentProductCode = '',
        productCode = '',
        productName = '',
        thumbnailUrl,
        industry,
        type,
        price = 0,
        num = 1,
        selectedType = []
      } = detail
      this.isSonProduct = !!decodeURIComponent(productCode)
      this.parentProductCode = decodeURIComponent(parentProductCode)
      this.productCode = decodeURIComponent(productCode)
      this.productName = decodeURIComponent(productName)
      this.industry = industry
      this.type = type
      this.price = price
      this.num = num
      this.numBackup = num
      this.selectedType = selectedType
      this.productId = productId
      this.productImg = thumbnailUrl
      // thumbnailUrl && (this.productImg = thumbnailUrl)
      this.getProducts()

      if (this.category === 'stock_scrap') {
        this.num = this.numBackup = -1
      }

      if (type === 'variant') {
        this.getVariant()
      }
      this.getUom()
    },
    async getUom () {
      // 获取单位
      if (this.productCode) {
        let { data } = await PRODUCT_UOM_GET({ product_codes: [this.productCode] })
        if (data) {
          this.uomList = data.product_uoms[this.productCode] || []
          data.product_uoms[this.productCode].map((item, index) => {
            if (item.uom_type === 'sale') {
              this.uomTag = index
              this.uomName = this.uomList[index].uom_name
              this.uomId = this.uomList[index].uom_id
              this.price = this.uomList[index].sale_price
              this.productId = this.uomList[index].product_id
            }
          })
        }
      }
    },
    async getProducts () {
      try {
        let { data } = await PRODUCT_DETAIL_GET({ parent_product_code: this.parentProductCode })
        if (data) {
          console.log('eee', data)
          let { product } = data
          let {
            // uom_id: uomId,
            // uom_name: uomName,
            variant_products: products = []
          } = product
          // if (uomId) {
          //   this.uomId = uomId
          // }
          // if (uomName) {
          //   this.uomName = uomName
          // }
          this.products = products
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getVariant () {
      try {
        let params = { product_code: this.parentProductCode }
        let { data } = await PRODUCT_VARIANTINFO_GET(params)
        if (data) {
          let productMap = {}
          let productList = data.product_list
          let typeList = data.type_list
          productList.forEach(prd => (productMap[prd.variant_codes] = prd))
          this.productMap = productMap
          this.typeList = typeList

          let selectedType = []
          this.selectedType.forEach((selected, idx) => {
            if (idx === 0) {
              this.colorName = selected.name
            }
            if (idx === 1) {
              this.sizeName = selected.name
            }
            typeList.forEach((type, idx) => {
              let index = type.lines.findIndex(opt => opt.variant_id === selected.id)
              if (index > -1) {
                selectedType[idx] = type.lines[index].variant_code
              }
            })
          })
          this.selectedType = selectedType
          this.checkItem()
        }
      } catch (e) {
        console.log(e)
      }
    },
    chooseType (skuItem, labelIndex, typeIndex) {
      if (this.isSonProduct) {
        return
      }
      let variantCode = skuItem.variant_code
      if (variantCode !== this.selectedType[typeIndex]) {
        this.selectedType[typeIndex] = variantCode
      } else {
        this.selectedType[typeIndex] = ''
      }
      this.checkItem()
    },
    checkItem () {
      let typeList = this.typeList
      let result = [] // 定义数组存储被选中的值
      for (let i in typeList) {
        result[i] = this.selectedType[i] ? this.selectedType[i] : ''
      }
      for (let i in typeList) {
        let str = result[i] // 把选中的值存放到字符串last去
        for (let k in typeList[i].lines) {
          result[i] = typeList[i].lines[k].variant_code // 赋值，存在直接覆盖，不存在往里面添加variant_code值
          typeList[i].lines[k].isDisabled = this.isDisabled(result) // 在数据里面添加字段isDisabled来判断是否可以选择
        }
        result[i] = str // 还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
      }
      this.typeCheckCb(result)
      this.$forceUpdate() // 重绘
    },
    isDisabled (result) {
      for (let i in result) {
        if (result[i] === '') {
          return false // 如果数组里有为空的值，那直接返回false
        }
      }
      return !this.productMap[result.join('_')] // 匹配选中的数据的库存，若不为空返回false反之返回true
    },
    typeCheckCb (result) {
      console.log(result)
      // 如果是多规格商品，并且规格都选中了
      if (this.type === 'variant' && result.length && result.indexOf('') === -1) {
        let productMap = this.productMap
        let key = result.join('_')
        console.log(productMap[key])

        this.productName = productMap[key].product_name
        this.productCode = productMap[key].product_code
        this.getUom()
        this.productImg = productMap[key].image_url ? productMap[key].image_url : ''
        this.price = productMap[key].product_price || 0

        // 拿到多规格商品的精确子商品
        let curProduct = this.products.find(item => item.product_code === this.productCode)
        if (curProduct) {
          // 记录多规格商品的父商品编码
          this.parentProductCode = curProduct.parent_product_code
          this.stockCount = curProduct.stock_count
          this.uomName = curProduct.uom_name
          this.uomId = curProduct.uom_id
        }
      }
    },
    count (tag) {
      if (tag) {
        this.num += 1
        this.numBackup += 1
      } else {
        if (this.num === 1) return
        this.num -= 1
        this.numBackup -= 1
      }
    },
    handleInput (ev) {
      let val = ev.target.value
      if (isNaN(val)) {
        this.num = this.numBackup
        return
      }
      if (val < 1) {
        clearTimeout(this.$timer)
        this.$timer = setTimeout(() => {
          if (this.category !== 'stock_scrap') {
            this.num = 1
            this.numBackup = 1
          }
        }, 1000)
      } else {
        clearTimeout(this.$timer)
        this.num = Number(val)
        this.numBackup = Number(val)
      }
    },
    back () {
      this.$emit('close')
    },
    // 加入购物车
    addCar () {
      let notNonSelected = []
      this.selectedType.forEach(item => {
        if (item) {
          notNonSelected.push(item)
        }
      })
      if (notNonSelected.length < this.typeList.length) {
        // return this.$toast('要选择好规格喔~')
        this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('要选择好规格喔~'), title: encodeURIComponent('提示') })
        return
      }
      if (this.parentProductCode && !this.productCode && !this.uomId) {
        // return this.$toast('父商品无法加入~')
        this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('父商品无法加入~'), title: encodeURIComponent('提示') })
        return
      }
      let row = {
        product_id: this.productId,
        product_code: this.productCode,
        product_name: this.productName,
        image_url: this.productImg,
        color_name: this.colorName,
        size_name: this.sizeName,
        uom_id: this.uomId,
        uom_name: this.uomName,
        unit_price: this.price
      }
      row.product_code = row.product_code || this.parentProductCode

      console.log('this.uomId', row.uom_id, this.uomId)

      switch (this.category) {
        case 'distribution_return':
          row.pick_line_id = 0
          row.apply_qty = this.num
          row.transfer_qty = this.num
          break
        case 'distribution_receive':
          row.parent_product_code = this.parentProductCode
          row.confirm_qty = this.num
          break
        case 'inventory':
          row.rack_line_qty = this.num
          row.sale_price = this.price
          break
        case 'shop_pick_out':
          row.pick_line_id = 0
          row.transfer_qty = this.num
          row.prod_shop_qty = 0
          break
        case 'shop_pick_in':
          row.pick_line_id = 0
          row.confirm_qty = this.num
          break
        case 'refund':
          row.pick_line_id = 0
          row.apply_qty = this.num
          row.confirm_qty = this.num
          break
        case 'delivery_out':
          row.pick_line_id = 0
          row.apply_qty = this.num
          break
        case 'stock_scrap':
          row.scrap_line_id = 0
          row.prod_shop_qty = 0
          row.scrap_qty = this.num
          break
        case 'cloud_send':
          row.transfer_qty = this.num
          break
        case 'reload_apply':
          row.line_id = 0
          row.apply_qty = this.num
          break
        case 'reload_approve':
          row.line_id = 0
          row.approve_qty = this.num
          break
      }

      console.log(this.category)
      console.log(row)
      this.$emit('commit', row)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../assets/css/mixin.styl"

  .out-con
    position relative
    width 100%
    height 100%
    background-color #fff
    box-shadow -.025rem 0 .15rem 0 rgba(0, 0, 0, .2)

  .row-con
    display flex
    padding 22px 20px 0
    width 100%

  .pdtImg
    height 138px
    width 138px
    overflow hidden
    img
      width 100%
      height 100%
      object-fit cover

  .right
    width calc(100% - 138px)
    padding-left 24px
    height 138px
    .name
      font-size 24px
      color #34495E
      multiline(2)
      margin-bottom 5px
    .code
      opacity 0.6
      font-size 18px
      color #34495E
    .price
      font-size 24px
      color #DA1E24
      margin-top 20px

  .sku-con
    width 100%
    padding .2rem .24rem .7rem
    overflow-y auto
    .sku-group
      width 100%
      .group-tit
        display flex
        width 100%
        font-size 16px
        color #748292
        margin-bottom 5px
      .label-list
        display flex
        flex-wrap nowrap
        width 100%
        .label-item
          display flex
          align-items center
          height 34px
          padding 0 21px
          border 1px solid #A4ADB7
          border-radius 4px
          margin-right 20px
          font-size 16px
          color #34495E
          margin-bottom 24px
          extend-click()
          &last-child
            margin-right 0
          &.isSelected
            border 1px solid #1296DB
            background-color #1296DB
            color #fff
          &.isDisabled
            background-color #7a7a7a
            border 1px solid #7a7a7a
            color #fff
            cursor not-allowed
            &after
              content none

  .bottom_edit
    display flex
    align-items center
    justify-content space-between
    padding 0 .24rem
    background-color #F7F8FA
    width 100%
    height 0.7rem
    position absolute
    left 0
    bottom 0
    z-index 1100
    .back
      display flex
      align-items center
      justify-content center
      background #FFFFFF
      border 1px solid #1296DB
      border-radius .04rem
      width 1.6rem
      height .4rem
      span
        font-size .18rem
        color #1296DB
        font-weight 300
        line-height 1
    .add
      display flex
      align-items center
      justify-content center
      background #1296DB
      border 1px solid #1296DB
      border-radius .04rem
      width 1.6rem
      height .4rem
      span
        font-size .18rem
        color #fff
        font-weight 300
        line-height 1

  .sub-con {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .stock {
      opacity: 0.6;
      font-size: 18px;
      color: #34495E;
      line-height: 1;
    }
    .price {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      font-size: 24px;
      color: #DA1E24;
      margin-top: 15px;
      line-height: 1;
    }
  }

  .mid {
    display: flex;
    justify-content space-between
    width: 100%;
    padding: 22px 35px 0 24px;
    .lab {
      font-size: 16px;
      color: #748292;
    }
    .row-lab {
      display flex
    }
    .val {
      display flex
      align-items center
      justify-content center
      width: 68px;
      text-align: center;
      font-size: 24px;
      color: #34495E;
      input {
        width: 100%
        height 100%
        text-align center
        outline none
        ont-size: 24px;
        color: #34495E;
      }
    }
    .btn {
      height: 34px;
      width: 34px;
    }
  }
</style>
