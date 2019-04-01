export default {
  data () {
    return {
      shouldShowInputCon: false, // 模糊搜索 icon/输入框
      searchStr: '', // 搜索的文字
      shouldShowSearchResult: false, // 是否显示搜索结果列表
      tableData: []
    }
  },
  computed: {
    screenedData () {
      let res = this.tableData.filter(data => {
        let searchStr = this.searchStr.toLocaleLowerCase()
        if (!searchStr.trim().length) {
          return true
        }
        return data.product_code.toLocaleLowerCase().includes(searchStr) ||
          data.product_name.toLocaleLowerCase().includes(searchStr)
      })
      return res
    },
    searchResult () {
      return function (item) {
        let searchStr = this.searchStr.toLocaleLowerCase()
        let productCode = item.product_code.toLocaleLowerCase()
        let productName = item.product_name.toLocaleLowerCase()
        if (productCode.includes(searchStr) && productName.includes(searchStr)) {
          return item.product_code
        }
        if (productCode.includes(searchStr)) {
          return item.product_code
        }
        if (productName.includes(searchStr)) {
          return item.product_name
        }
      }
    }
  },
  mounted () {
    document.body.addEventListener('click', this.handleBodyClick, false)
  },
  methods: {
    getBlur (event) {
      if (!this.shouldShowInputCon) {
        this.shouldShowInputCon = true
      }
      this.nameIsFocus = false
      console.log(event.currentTarget)
      try {
        event.currentTarget.querySelector('input').focus()
      } catch (err) {
        console.log(err)
      }
    },
    showSearchInput () {
      this.shouldShowInputCon = true
      // this.$nextTick(() => {
      //   let searchCon = document.documentElement.querySelector('#searchCon') || document.getElementsByTagName('html')[0].querySelector('#searchCon')
      //   try {
      //     if (searchCon) {
      //       searchCon.querySelector('input').focus()
      //     }
      //   } catch (err) {
      //     console.log(err)
      //   }
      // })
      // this.$nextTick(() => {
      //   this.$refs.searchInput.focus()
      // })
    },
    handleInput () {
      this.shouldShowSearchResult = !!this.searchStr.length
    },
    clearSearchStr () {
      this.searchStr = ''
      this.$refs.mTable.setCurrentRow()
    },
    chooseSearchItem (item) {
      this.searchStr = this.searchResult(item)
      this.shouldShowSearchResult = false
    },
    handleBodyClick (ev) {
      let isInput = this.closest(ev.target, '#searchCon')
      let isIcon = this.closest(ev.target, '#searchIcon')
      if (this.shouldShowInputCon && !isIcon && !isInput && !this.searchStr.length) {
        this.shouldShowInputCon = false
      }
    },
    closest (el, selector) {
      let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector

      while (el) {
        if (matchesSelector.call(el, selector)) {
          break
        }
        el = el.parentElement
      }
      return el
    },
    closeWebview () {
      console.log('blurSearch 的返回')
      this.$bridge.callhandler('webviewPageCloseCallback', {})
    }
  }
}
