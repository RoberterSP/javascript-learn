<template>
  <div class="leftmenu">
    <div class="head"><h1>{{leftMenu.name}}</h1></div>
    <div v-if="!item.hide" class="side-nav" v-for="(item, parindex) in leftMenu.menuList" :key="parindex" :class="[parIndex===parindex?'is_par_active':'']">
      <div class="sn_present" @click="presentClick(parindex)" v-if="!!!item.isHide">
        <div class="sn_left">
          <div class="snl_name default-label">{{item.name}}</div>
        </div>
        <div class="sn_right iconfont iconarrowup" v-if="item.open"></div>
        <div class="sn_right iconfont iconarrowdown" v-if="!item.open"></div>
      </div>
      <div class="sn_children" v-for="(child, index) in item.children" :key="index" v-if="item.children && item.open && !child.isHide" @click="childClick(child, parindex, index)"
      :class="[childCode=== child.code?'is_active':'']">
        {{child.name}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      childCode: null,
      parIndex: null
    }
  },
  props: {
    leftMenu: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    '$route.name': {
      handler: function () {
        this.setHighlightMenu(this.$route.name)
      },
      deep: true
    }
  },
  methods: {
    presentClick (index) {
      // let open = this.leftMenu.menuList[index].open
      // this.leftMenu.menuList.forEach(x => {
      //   x.open = false
      // })
      // if (!open) {
      this.leftMenu.menuList[index].open = !this.leftMenu.menuList[index].open
      // }
    },
    childClick (child, parindex, index) {
      this.$emit('currentPage', child.code)
      this.childCode = child.code
      this.parIndex = parindex
    },
    initMenu (idx, pidx, code) {
      if (pidx) {
        this.presentClick(pidx)
      }
      this.childCode = code
      this.parIndex = pidx
    },
    setHighlightMenu (routerName) {
      let menuList = this.leftMenu.menuList
      menuList.forEach((data, parIndex) => {
        // data.open = false
        data.children.forEach((el, index) => {
          if (el.code === routerName) {
            this.childCode = el.code
            this.parIndex = parIndex
            data.open = true
          }
        })
      })
    }
  },
  mounted () {
    if (this.$route.name === 'roleList') {
      this.setHighlightMenu('roleList')
    }
  },
  created () {
    // 设置初始打开菜单
    if (this.$route.params.router_code) {
      this.setHighlightMenu(this.$route.params.router_code)
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";

.leftmenu {
  width: 238px;
  .head {
    padding: 20px 0 20px 24px;
    h1 {
      line-height: 33px;
    }
  }
  .side-nav {
    position: relative;
    &::before{
      content: " ";
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      border-top: 1px solid rgba(0,0,0,0);
    }
    &::after{
      content: " ";
      display: inline-block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-bottom: 1px solid #F2F2F2;
    }
    &.is_par_active{
      &::before{
        border-top: 1px solid #00A1B2;
      }
      &::after{
        border-bottom: 1px solid #00A1B2;
      }
    }
    .sn_present {
      display: flex;
      width: 238px;
      height: 46px;
      background-color:rgba(236,236,236,1);
      .sn_left {
        padding-left: 24px;
        .snl_name {
          margin-top: 11px;
          font-size: 15px;
          line-height: 21px;
        }
        .snl_des {
          margin-top: 8px;
          font-size:12px;
          color:rgba(137,137,137,1);
          line-height:17px;
        }
      }
      .sn_right {
        margin-left: auto;
        padding: 16px 8px 28px;
        font-size: 20px;
        color: @theme-color;
      }
    }
    .sn_children {
      padding: 18px 18px 0 24px;
      width: 238px;
      height: 56px;
      cursor: pointer;
      text-indent: 12px;
      background-color:rgba(242,242,242,1);
      &:hover{
        color:rgba(0,161,178,1);
        font-weight:500;
      }
      &.is_active{
        color:rgba(0,161,178,1);
        font-weight:500;
        cursor: pointer;
      }
    }
  }
}
</style>
