import { PRODUCT_DETAIL_GET, PRODUCT_VARIANTINFO_GET, PRODUCT_UOM_GET } from '../api/index.js'

export default {
  data () {
    return {
      newproductId: -1,
      newparentProductCode: '', // 父商品编码
      newproductCode: '', // 商品编码
      newproductName: '', // 商品名称
      newproductImg: '',
      newprice: 0, // 商品单价
      newindustry: '', // 所属行业: catering: 餐饮 | clothing: 服装 | cosmetics: 化妆品
      newtype: '', // 商品类型: product: 普通商品 | variant: 多规格商品
      newnum: 1, // 数量
      newnumBackup: 1, // 备份
      newproducts: [], // 商品组合列表(每项有BOM信息)
      newproductMap: {}, // 商品组合 key-value映射(无BOM，有预览图)
      newtypeList: [], // 多规格sku列表
      newselectedType: [], // 已选中的规格
      newskuConHeight: 0,
      newstockCount: '', // 库存数量
      newuomId: '', // 商品计量单位id
      newuomName: '', // 商品计量单位名称
      newisSonProduct: false,
      newcolorName: '',
      newsizeName: '',
      newuomList: [], // 单位列表
      newuomTag: -1,
      newcategory: '',
      newdetail: {},
      closeType: null
    }
  },
  mounted () {
  },
  methods: {
    async newgetDetailCb (detail, category, closeType) {
      this.newdetail = detail
      this.newcategory = category
      this.closeType = closeType || 0
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
      this.newisSonProduct = !!decodeURIComponent(productCode)
      this.newparentProductCode = decodeURIComponent(parentProductCode)
      this.newproductCode = decodeURIComponent(productCode)
      this.newproductName = decodeURIComponent(productName)
      this.newindustry = industry
      this.newtype = type
      this.newprice = price
      this.newnum = num
      this.newnumBackup = num
      this.newselectedType = selectedType
      this.newproductId = productId
      this.newproductImg = thumbnailUrl
      // thumbnailUrl && (this.newproductImg = thumbnailUrl)

      if (this.newcategory === 'stock_scrap') {
        this.newnum = this.newnumBackup = -1
      }
      if (type === 'variant') {
        this.newgetProducts()
      } else {
        // 如果是子规格商品
        // 先获取单位 是否只有一种单位， 如果多种单位 打开sku弹出框 ；如果只有一种 则直接加入列表
        this.newgetUom()
      }
    },
    async newgetUom () {
      // 获取单位
      if (this.newproductCode) {
        let { data } = await PRODUCT_UOM_GET({ product_codes: [this.newproductCode] })
        if (data) {
          // console.log('测试单位', data)
          this.newuomList = data.product_uoms[this.newproductCode] || []
          // this.newuomList = [{}, {}]
          if (this.newuomList.length === 1) {
            // 如果单位只有一种
            this.newuomTag = 0
            this.newuomName = this.newuomList[0].uom_name
            this.newuomId = this.newuomList[0].uom_id
            this.newprice = this.newuomList[0].sale_price
            this.newproductId = this.newuomList[0].product_id
            this.newaddCar()
          } else {
            if (this.newuomList.length > 1) {
              this.$bridge.callhandler('webviewHideProductAddCallHandler', { type: this.closeType })
              this.shouldShowCloseNativeBtn = false
              // 多单位 就打开 sku弹出框
              this.showSkuAndInitData(this.newdetail)
            } else {
              // 此商品 无计量单位可选择或默认
              this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('此商品无法加入~'), title: encodeURIComponent('提示') })
            }
          }
        }
      } else {
        // 此商品 不是多规格 也没有子商品code 拿不到计量单位
        this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('此商品无法加入~'), title: encodeURIComponent('提示') })
      }
    },
    async newgetProducts () {
      try {
        let { data } = await PRODUCT_DETAIL_GET({ parent_product_code: this.newparentProductCode })
        if (data) {
          console.log('eee', data)
          let { product } = data
          let {
            // uom_id: uomId,
            // uom_name: uomName,
            variant_products: products = []
          } = product
          this.newproducts = products
          // 多规格商品
          this.newgetVariant()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async newgetVariant () {
      try {
        let params = { product_code: this.newparentProductCode }
        let { data } = await PRODUCT_VARIANTINFO_GET(params)
        console.log('获取到的多规格', data)
        if (data) {
          let productMap = {}
          let productList = data.product_list
          let typeList = data.type_list || []
          productList.forEach(prd => (productMap[prd.variant_codes] = prd))
          this.newproductMap = productMap
          this.newtypeList = typeList

          let selectedType = []
          this.newselectedType.forEach((selected, idx) => {
            if (idx === 0) {
              this.newcolorName = selected.name
            }
            if (idx === 1) {
              this.newsizeName = selected.name
            }
            typeList.forEach((type, idx) => {
              let index = type.lines.findIndex(opt => opt.variant_id === selected.id)
              if (index > -1) {
                selectedType[idx] = type.lines[index].variant_code
              }
            })
          })
          this.newselectedType = selectedType
          // 判断规格 每个type是否大于一种 可选
          let isNeedAdd = true
          if (this.newtypeList.length > 0) {
            let selectArr = []
            this.newtypeList.forEach(data => {
              if (data.lines && data.lines.length === 1) {
                selectArr.push(data.lines[0].variant_code)
              } else if (data.lines) {
                isNeedAdd = false
              }
            })
            if (isNeedAdd) {
              // 每种type 只有一种可选择
              console.log('每种type 只有一种可选择')
              this.newtypeCheckCb(selectArr)
            } else {
              this.$bridge.callhandler('webviewHideProductAddCallHandler', { type: this.closeType })
              this.shouldShowCloseNativeBtn = false
              selectArr = []
              // 多type 就打开 sku弹出框
              console.log('多type 就打开 sku弹出框')
              this.showSkuAndInitData(this.newdetail)
            }
          } else {
            this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('此商品无法加入~'), title: encodeURIComponent('提示') })
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    newtypeCheckCb (result) {
      console.log(result)
      // 如果是多规格商品，并且规格都选中了
      if (this.newtype === 'variant' && result.length && result.indexOf('') === -1) {
        let productMap = this.newproductMap
        let key = result.join('_')
        console.log(productMap[key])

        if (productMap[key]) {
          this.newproductName = productMap[key].product_name
          this.newproductCode = productMap[key].product_code
          this.newproductImg = productMap[key].image_url ? productMap[key].image_url : ''
          this.newprice = productMap[key].product_price || 0
          // 拿到多规格商品的精确子商品
          let curProduct = this.newproducts.find(item => item.product_code === this.newproductCode)
          if (curProduct) {
            // 记录多规格商品的父商品编码
            this.newparentProductCode = curProduct.parent_product_code
            this.newstockCount = curProduct.stock_count
            this.newuomName = curProduct.uom_name
            this.newuomId = curProduct.uom_id
            this.newgetUom()
          } else {
            // 没有对应的子商品
            this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('此商品无法加入~'), title: encodeURIComponent('提示') })
          }
        } else {
          // 没有对应的子商品
          this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('此商品无法加入~'), title: encodeURIComponent('提示') })
        }
      }
    },
    // 加入购物车
    newaddCar () {
      let row = {
        product_id: this.newproductId,
        product_code: this.newproductCode,
        product_name: this.newproductName,
        image_url: this.newproductImg,
        color_name: this.newcolorName,
        size_name: this.newsizeName,
        uom_id: this.newuomId,
        uom_name: this.newuomName,
        unit_price: this.newprice
      }
      row.product_code = row.product_code || this.newparentProductCode

      switch (this.newcategory) {
        case 'distribution_return':
          row.pick_line_id = 0
          row.apply_qty = this.newnum
          row.transfer_qty = this.newnum
          break
        case 'distribution_receive':
          row.parent_product_code = this.newparentProductCode
          row.confirm_qty = this.newnum
          break
        case 'inventory':
          row.rack_line_qty = this.newnum
          row.sale_price = this.newprice
          break
        case 'shop_pick_out':
          row.pick_line_id = 0
          row.transfer_qty = this.newnum
          row.prod_shop_qty = 0
          break
        case 'shop_pick_in':
          row.pick_line_id = 0
          row.confirm_qty = this.newnum
          break
        case 'refund':
          row.pick_line_id = 0
          row.apply_qty = this.newnum
          row.confirm_qty = this.newnum
          break
        case 'delivery_out':
          row.pick_line_id = 0
          row.apply_qty = this.newnum
          break
        case 'stock_scrap':
          row.scrap_line_id = 0
          row.prod_shop_qty = 0
          row.scrap_qty = this.newnum
          break
        case 'cloud_send':
          row.transfer_qty = this.newnum
          break
        case 'reload_apply':
          row.line_id = 0
          row.apply_qty = this.newnum
          break
        case 'reload_approve':
          row.line_id = 0
          row.approve_qty = this.newnum
          break
      }
      console.log('直接加入', row)
      this.addRowToTable(row)
    }
  }
}
