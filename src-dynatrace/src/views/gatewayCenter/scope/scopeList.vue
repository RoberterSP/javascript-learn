<template>
  <div>
    <stepper :stepper="stepper" theme="purple"></stepper>
    <div v-if="total > 0 || query">
      <div class="banner">
        <div class="head_title_l">
          <div class="bannericon iconfont iconAPIgroup1"></div>
          <div class="title">接口组</div>
        </div>
        <el-button class="btn" type="primary" @click="createScope"  v-permission= "'gatewayCenter_scopeList_add'">创建</el-button>
      </div>
      <div class="down plr20 pt19">
        <el-input
          style="width: 80%"
          @change="queryTable"
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
          v-model="query">
        </el-input>
        <div class="content p15">
          <h2>{{total}}个接口组</h2>
          <nt-table
          :tableData="tableData"
          :columns="columns"
          :tableSet="tableSet"
          @readDetail="readDetail">
          </nt-table>
        </div>
      </div>
    </div>
    <blank v-if="total <= 0 && !query"
      @createScope="createScope"
      :blankData="blankData"
    ></blank>
  </div>
</template>

<script>
import blank from 'components/base/blank.vue'
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { SCOPE_LIST_GET } from '@/api'
import { PAGESIZE } from 'common/util/common.js'

export default {
  data () {
    return {
      query: '',
      total: 0,
      blankData: {
        title: '创建接口组',
        subtitle: '创建接口组，并通过分配接口的方式规范能访问的接口',
        img_num: 2,
        img_1: require('@/assets/image/scope_list_img1.png'),
        img_1_title: '服务中心注册服务接口到网关',
        img_2: require('@/assets/image/scope_list_img2.png'),
        img_2_title: '通过设置接口路由方式规范接口流量的去向',
        btn_text: '创建接口组'
      },
      stepper: [{ name: '接口组', routerTo: 'scopeList' }],
      tableData: [],
      tableSet: {
        showPagination: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'iconAPIgroup1'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '接口数量', // 表头名字
          code: 'endpoint_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          textAlign: 'center',
          width: 84,
          sortOrder: 'none'
        }
      ]
    }
  },
  computed: {},
  methods: {
    queryTable (val) {
      let data = {
        page: 1,
        page_size: PAGESIZE,
        name: val
      }
      this.scope_list_get(data)
    },
    createScope () {
      this.$router.push({
        name: 'scopeCreate',
        params: {
          detailData: false,
          showComponent: {
            code: 'scopeBaseInfo',
            name: '基本信息'
          }
        }
      })
    },
    readDetail (row) {
      this.$router.push({ name: 'scopeDetail', params: row })
    },
    scope_list_get (data) {
      SCOPE_LIST_GET(data).then(res => {
        console.log('获取接口组信息', res)
        if (data.page === 1) {
          this.tableSet.paginationConfig.currentPage = 1
        }
        this.tableData = res.data.scope_list
        // 判断是否有路由跳转权限
        if (!this.$_hasRoute('scopeDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        this.tableSet.paginationConfig.total = res.data.total
        this.total = res.data.total
      })
    }
  },
  mounted () {
    let data = {
      page: 1,
      page_size: PAGESIZE
    }
    this.scope_list_get(data)
  },
  created () {
  },
  components: {
    stepper,
    blank,
    ntTable
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";
.banner {
  position: relative;
  padding: 18px 32px 19px 16px;
  width: 100%;
  height: 73px;
  background: rgba(255,255,255,1);
  border-bottom: 1px solid @purple-12;
  .head_title_l {
    display: flex;
    align-items: center;
    height: 40px;
    .bannericon {
      width: 36px;
      height: 40px;
      font-size: 36px;
      line-height: 40px;
    }
    .title {
      margin-left: 11px;
      height: 40px;
      font-size: 28px;
      line-height: 40px;
      font-weight: 500;
    }
  }
  .btn {
    position: absolute;
    top: 16px;
    right: 32px;
  }
}

.down {
  background-color: @default-gray;
  // .scopeTable {
  //   margin-top: 27px;
  // }
  .content {
    width: 100%;
    background-color: #fff;
    margin-top: 20px;
  }
}
</style>
