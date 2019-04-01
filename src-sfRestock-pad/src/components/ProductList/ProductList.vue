<template>
  <div class="out-con">
    <div class="top">
      <div class="close" @click="pageClose">
        <img src="../../assets/images/close-productlist.svg">
        <span class="lab">关闭</span>
      </div>
      <div>
        <!-- 暂时先用饿了的控件 -->
        <el-autocomplete
          class="searchInp"
          v-model.trim="searchData"
          :fetch-suggestions="querySearchAsync"
          :autofocus="false"
          :trigger-on-focus="false"
          placeholder="请输入商品名称、编码搜索"
          clearable
          @select="search"
        ></el-autocomplete>
      </div>
      <span class="searchBtn" @click="search">搜索</span>
    </div>
    <div class="classify" ref="classify">
      <div class="labs" ref="labs">
        <div :class="{ activeBlue: subCategoryIndex === index }"
              class="lab"
              v-for="(lab, index) in subCategoryList"
              :key="index"
              @click="subCategoryClick(lab, index)">
          {{lab.name}}
        </div>
      </div>
    </div>
    <div class="productList" ref="productList" id="productList">
      <div class="product"
           v-for="(pdt, index) in productList"
           :key="index">
        <div class="panel" @click="goShop(pdt)">
          <div class="product-img">
            <img v-if="pdt.thumbnail_url" :src="pdt.thumbnail_url">
            <img v-else src="../../assets/images/icon-default-2.png">
          </div>
          <div class="bottomRow">
            <p class="name">{{pdt.product_name}}</p>
            <p class="code">{{pdt.product_code}}</p>
            <div class="price-con">
              <span class="price">{{pdt.sale_price | currency}}</span>
              <!--<img class="car" src="static/img/car.svg">-->
            </div>
          </div>
        </div>
      </div>
      <load-more
        @needData="getProductList"
        :no-more="productListOpts.noMore"
        :is-loading="productListOpts.isLoading"
        :list-elem="'productList'"
        v-if="productList.length"
      >
        <span class="tips" slot="tips">{{productListOpts.noMore ? '暂无更多' : '加载中'}}</span>
      </load-more>
      <div v-show="!productList.length" class="noMoreData" :style="{height: mainHeight + 'px'}" style="width:100%;display:flex;justify-content:center;align-items:center;z-index:10">
        <img style="width:1.96rem;" src="../../assets/images/noMoreData.svg">
      </div>
    </div>
    <div class="bottom">
      <div ref="categoryList" class="bottomRow">
        <div
          @click="categoryClick(index)"
          :class="{activeBlue: categoryIndex===index}"
          class="bigClass"
          v-for="(lab, index) in categoryList"
          :key="'lab' + index"
          :style="{minWidth: '100px', maxWidth: '164px'}"
        >
          <span class="lab">{{lab.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PRODUCT_LIST_GET, PRODUCT_CATEGORY_GET } from '../../api'
import LoadMore from '../../components/LoadMore/LoadMore'
import { getUrlParameter } from '../../api/util.js'

export default {
  data () {
    return {
      searchData: '',
      categoryList: [],
      subCategoryList: [],
      categoryIndex: 0,
      subCategoryIndex: 0,
      productListOpts: {
        noMore: false,
        isLoading: false,
        start_date: '2017-01-01 00:00:00',
        end_date: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        category_ids: [],
        fuzzy_input: '',
        page: 0,
        pagesize: 45,
        org_id: parseInt(getUrlParameter()['org_id'])
      },
      productList: [],
      copyCategoryIds: [],
      isEmpty: false,
      mainHeight: ''
    }
  },
  mounted () {
    // let screabHeight = document.documentElement.clientHeight
    // this.$refs.productList.style.height = (screabHeight - 213) + 'px'
    let html = document.documentElement || document.getElementsByTagName('html')[0]
    let rootFontSize = parseFloat(html.style.fontSize)
    let top = rootFontSize * (0.8 + 0.8 + 0.7 + 0.63)
    let docHeight = html.clientHeight
    let mainHeight = parseInt(docHeight - top)
    this.mainHeight = mainHeight
    this.$refs.productList.style.height = mainHeight + 'px'

    this.getCategoryList()
  },
  filters: {
    currency (price = 0) {
      return price.toFixed(2)
    }
  },
  methods: {
    async getCategoryList () {
      try {
        let { data } = await PRODUCT_CATEGORY_GET()
        if (data) {
          let categoryList = data.category_list || []
          this.categoryList = categoryList
          this.setCategoryListWidth()
          let copy = JSON.parse(JSON.stringify(categoryList))
          this.setSubCategoryList(copy, this.categoryIndex)
        }
      } catch (e) {
        // this.$toast(e)
        this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent(e), title: encodeURIComponent('提示') })
      }
    },
    async getProductList () {
      try {
        if (this.productListOpts.noMore) return
        this.productListOpts.page++

        let params = {
          ...this.productListOpts
        }
        delete params.noMore
        delete params.isLoading
        if (!params.org_id) {
          delete params.org_id
        }

        this.productListOpts.isLoading = true
        let { data } = await PRODUCT_LIST_GET(params)
        if (data) {
          let { products = [] } = data
          this.productListOpts.noMore = products.length < this.productListOpts.pagesize
          // products = products.filter(item => item.type === 'variant')
          this.productList = [ ...this.productList, ...products ]
        }
        this.productListOpts.isLoading = false
        if (this.productList.length <= 0) {
          this.isEmpty = true
        }
        // !this.productList.length && this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent('暂无商品'), title: encodeURIComponent('提示') })
      } catch (e) {
        this.$bridge.callhandler('alertErrCallback', { msg: encodeURIComponent(e), title: encodeURIComponent('提示') })
      }
    },
    setSubCategoryList (categoryList, categoryIndex) {
      if (categoryList.length) {
        let subCategoryList = []
        if (categoryList[categoryIndex].subcategory_list && categoryList[categoryIndex].subcategory_list.length) {
          subCategoryList = categoryList[categoryIndex].subcategory_list
        }

        let initIds = [ ...categoryList[categoryIndex].child_ids ]
        let all = {
          name: '全部',
          child_ids: initIds
        }
        subCategoryList.unshift(all)
        this.subCategoryList = subCategoryList
        this.setSubCategoryListWidth()
        this.resetOpts(() => {
          this.copyCategoryIds = initIds
          this.productListOpts.category_ids = initIds
          this.getProductList()
        })
      }
    },
    setCategoryListWidth () {
      this.$refs.categoryList.style.width = (this.categoryList.length * 150) + 'px'
    },
    setSubCategoryListWidth () {
      this.$refs.labs.style.width = this.subCategoryList.length * 103 + 'px'
    },
    categoryClick (index) {
      if (index !== this.categoryIndex) {
        let copy = JSON.parse(JSON.stringify(this.categoryList))
        this.categoryIndex = index
        this.subCategoryIndex = 0
        this.$refs.classify.scrollTo && this.$refs.classify.scrollTo(0, 0)
        this.setSubCategoryList(copy, index)
      }
    },
    subCategoryClick (item, index) {
      this.subCategoryIndex = index
      this.resetOpts(() => {
        this.copyCategoryIds = item.child_ids
        this.productListOpts.category_ids = item.child_ids
        this.getProductList()
      })
    },
    resetOpts (cb) {
      this.productList = []
      this.productListOpts = {
        noMore: false,
        isLoading: false,
        start_date: '2017-01-01 00:00:00',
        end_date: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        category_ids: [],
        fuzzy_input: '',
        page: 0,
        pagesize: 45,
        org_id: parseInt(getUrlParameter()['org_id'])
      }
      cb && cb()
    },
    goShop (product) {
      let detail = {
        type: product.type,
        parentProductCode: product.product_code,
        productName: product.product_name,
        thumbnailUrl: product.thumbnail_url,
        price: product.sale_price
      }
      if (product.type !== 'variant') {
        detail.productCode = product.product_code
      }
      this.$emit('close')
      this.$emit('navigateToSku', detail)
    },
    querySearchAsync (queryString, cb) {
      console.log(queryString)
      let defaultList = []
      if (queryString === '') {
        typeof cb === 'function' && cb(defaultList)
        return
      }

      typeof cb === 'function' && cb(defaultList)
      let _params = {
        start_date: '2017-01-01 00:00:00',
        end_date: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        category_ids: this.copyCategoryIds,
        fuzzy_input: this.searchData,
        page: 1,
        pagesize: 15,
        org_id: parseInt(getUrlParameter()['org_id'])
      }
      !_params.org_id && (delete _params.org_id)
      PRODUCT_LIST_GET(_params).then(res => {
        if (res.data.code) {
          document.getElementsByTagName('input')[0].blur()
          return false
        }
        for (let i of res.data.products) {
          i.value = i.product_name
        }
        let results = res.data.products.slice(0, 10)
        cb(results)
      })
    },
    search () {
      this.resetOpts(() => {
        this.productListOpts.category_ids = this.copyCategoryIds
        this.productListOpts.fuzzy_input = this.searchData
        this.getProductList()
      })
    },
    pageClose () {
      this.$emit('close', true)
    },
    dateFormat (date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  },
  components: {
    LoadMore
  }
}
</script>

<style lang="stylus" scoped>
@import "../../assets/css/mixin.styl"

#app {
  height: 100%;
  background-color: #E0E4E8;
}

.out-con {
  width: 100%;
  box-shadow -0.025rem 0 0.15rem 0 rgba(0,0,0,0.2)
}

.top {
  display flex
  align-items center
  justify-content space-around
  height: .8rem;
  width: 100%;
  background: #FFFFFF;
}

.top .close {
  display flex
  align-items center
  extend-click()
}

.top .close img {
  width: 20px;
  height: 20px;
}

.top .close .lab {
  font-size: 18px;
  color: #34495E;
  line-height: 20px;
  margin-left: 11px;
}

.searchInp {
  position: relative;
  opacity: 0.6;
  background: #E0E4E8;
  width: 309px;
  height: 40px;
  border: none;
  font-size: 18px;
  outline: none;
}

.searchBtn {
  font-size: 19px;
  color: #1296DB;
  extend-click()
}

.classify {
  background: #FAFAFA;
  height: .63rem;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling touch !important
}

.classify .labs {
  display flex
  align-items center
  height: 63px;
}

.classify .lab {
  width: 80px;
  height: 34px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 20px;
  background-color: #fff;
  color: #34495E;
  border: 1px solid #A4ADB7;
  extend-click()
  no-wrap()
}

.activePurple {
  background-color: #B16BCE !important;
  color: #fff !important;
  border-color: #B16BCE !important;
}
.activePurple .lab {
  color: #fff !important;
}

.activeRed {
  background-color: #E97F7F !important;
  color: #fff !important;
  border-color: #E97F7F !important;
}
.activeRed .lab {
  color: #fff !important;
}

.activeBlue {
  background-color: #50B7E3 !important;
  color: #fff !important;
  border-color: #50B7E3 !important;
}
.activeBlue .lab {
  color: #fff !important;
}

.activeOrange {
  background-color: #F3A63D !important;
  color: #fff !important;
  border-color: #F3A63D !important;
}
.activeOrange .lab {
  color: #fff !important;
}

.bottom {
  width 100%
  position absolute
  left 0
  bottom 0
  height 70px
  background-color: #fff;
  overflow-x auto
  -webkit-overflow-scrolling touch !important
  .bottomRow {
    display flex
    align-items center
    height .7rem
  }
}

.bottom .bigClass {
  display flex
  align-items center
  justify-content center
  height: 40px;
  background-color: #E0E4E8;
  border-radius: 5px;
  margin-left: 20px;
  no-wrap()
  padding: 0 30px;
}

.bottom .bigClass .lab {
  color: #858687;
  font-size: 16px;
}

.productList {
  display: flex;
  flex-wrap wrap
  width: 100%;
  overflow-y: scroll;
  background-color: #f7f8fa;
  // padding-bottom 82px
  -webkit-overflow-scrolling touch !important
}

.productList .product {
  width: 33.33%;
  height: 232px;
  background-color: #f7f8fa;
  padding: 6px 6px 12px;
}

.productList .product .panel {
  overflow: hidden;
  height: 213px;
  background-color: #fff;
  border-radius: 4px;
}

.productList .product .panel .product-img {
  width: 100%;
  height: 134px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.productList .product .panel .name {
  font-size: 14px;
  color: #34495E;
  width: 100%;
  text-align: center;
  no-wrap()
}

.productList .product .panel .code {
  font-size: 12px;
  width: 100%;
  text-align: center;
  opacity: 0.6;
  color: #34495E;
  no-wrap()
}
.productList .product .panel .bottomRow {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 79px;
  padding: 9px 18px 6px;
}
.productList .product .panel .price-con {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
}
.productList .product .panel .price {
  font-size: 18px;
  color: #34495E;
  letter-spacing: 0;
  line-height: 1;
}

.productList .product .panel .car {
  width: 23px;
}

.tips {
  font-size: 12px;
  color: #a5a5a5;
}

.noMoreData{
  width 100%
  height 95%
  img {
    // width 1.92rem
    // height 2rem
  }
}
</style>
