<template>
  <div>
    <stepper :stepper="stepper" theme="blue"></stepper>
    <div class="banner">
      <div class="head_title_l">
        <div class="bannericon iconfont iconApplicationhealth"></div>
        <div class="title">配置检查</div>
      </div>
      <el-button class="btn" type="primary" @click="startConfigCheck" v-permission="'serviceCenter_configCheckList_startConfigCheck'">开始检查</el-button>
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
        <h2>{{total}}次配置检查</h2>
        <nt-table
          class="scopeTable"
          ref="table"
          :tableData="tableData"
          :columns="columns"
          :tableSet="tableSet"
          @deleteOne="deleteOne"
          @readDetail="readDetail"
        ></nt-table>
      </div>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { CONFIG_CHECK_LIST_POST, CONFIG_CHECK_DELETE_POST, CONFIG_PATCH_CHECK_POST } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      query: '',
      total: 0,
      stepper: [{ name: '配置检查', routerTo: 'configCheckList' }],
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
          name: '操作用户', // 表头名
          code: 'create_username', // 表身
          type: 'edit',
          showicon: 'iconfont',
          icon_url: 'iconApplicationhealth'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text',
          width: 320
        },
        {
          name: '检查节点数量', // 表头名字
          code: 'total_node_num', // 表身显示值
          type: 'text',
          sortAbled: true,
          textAlign: 'center',
          width: 120,
          sortOrder: 'none'
        },
        {
          name: '检查时间', // 表头名字
          code: 'created_at', // 表身显示值
          type: 'text'
        },
        {
          name: '删除',
          code: '',
          type: 'delete',
          disable: false,
          textAlign: 'right',
          width: 50,
          showDel: true
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
      this.check_history_list_get(data)
    },
    startConfigCheck () {
      let params = {}
      CONFIG_PATCH_CHECK_POST(params).then(res => {
        bus.$emit('openMessage', {
          message: '配置检查提交成功',
          type: 'success'
        })
        let data = {
          page: 1,
          page_size: PAGESIZE
        }
        this.check_history_list_get(data)
      })
    },
    readDetail (row) {
      this.$router.push({ name: 'configCheckDetail', params: {configCheckDetail: row} })
    },
    check_history_list_get (data) {
      CONFIG_CHECK_LIST_POST(data).then(res => {
        if (data.page === 1) {
          this.tableSet.paginationConfig.currentPage = 1
        }
        if (!this.$_accessRoutes('serviceCenter_configCheckList_delete')) {
          this.$set(this.columns[4], 'disable', true)
        }
        if (!this.$_hasRoute('configCheckDetail')) {
          this.$set(this.columns[0], 'type', 'text')
        }
        this.tableData = res.data.history_list
        this.tableSet.paginationConfig.total = res.data.total
        this.total = res.data.total
      })
    },
    // 删除
    deleteOne (row, index) {
      let arr = []
      this.tableData.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let data = {
        history_id: row.id
      }
      CONFIG_CHECK_DELETE_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        let data = {
          page: 1,
          page_size: PAGESIZE
        }
        this.check_history_list_get(data)
      })
    }
  },
  mounted () {},
  created () {
    let data = {
      page: 1,
      page_size: PAGESIZE
    }
    this.check_history_list_get(data)
  },
  components: {
    stepper,
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
  border-bottom: 1px solid @blue-14;
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
