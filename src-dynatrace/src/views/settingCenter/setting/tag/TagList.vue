<template>
  <div class="tag-container p10">
      <h2 class="mb30">标签</h2>

      <div class="add-content addPanel" v-if="isAdd">
        <addTag
          :isAdd="true"
          :clientDetails="tagForm"
          @cancelForm="cancelForm"
          @saveForm="saveForm"></addTag>
      </div>

    <div v-else class="mb30">
      <el-button type="primary" @click="isAdd = true" v-permission="'settingCenter_tagList_add'">添加标签</el-button>
    </div>

      <div class="select-content">
        <el-input
          class="search"
          @change="searchTable"
          v-model.trim="search"
          placeholder="请输入标签名称"
          suffix-icon="el-icon-search"></el-input>
      </div>
    <div class="table-content">
      <nt-table
        :tableData="tableData"
        :columns="columns"
        :tableSet="tableSet"
        :componentsName="'addTag'"
        @deleteOne="deleteOne"
        @componentSaveContent="updateRowInof"></nt-table>
    </div>
  </div>
</template>

<script>
import ntTable from 'components/ntTable/ntTable.vue'
import addTag from '@/views/settingCenter/setting/tag/addTag.vue'
import {
  NXMC_SETTING_TAG_LIST_GET, // 查
  NXMC_SETTING_TAG_DELETE_POST, // 删
  NXMC_SETTING_TAG_UPLOAD_POST, // 改
  NXMC_SETTING_TAG_UPDATE_POST // 增
} from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  name: 'tag',
  data () {
    return {
      isAdd: false, // 是否展示行详情
      search: '', // 搜索关键字
      addName: '', // 添加的标签名
      nodeType: 'all', // 节点类型
      nodeState: 'all', // 节点状态
      tableSet: {
        showOpenInfo: true,
        // edit: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      nodeTypeList: [
        {
          id: '0',
          label: '所有类型',
          value: 'all'
        },
        {
          id: '1',
          label: '节点',
          value: 'node'
        }
      ],
      nodeStateList: [
        {
          id: '0',
          label: '全部',
          value: 'all'
        },
        {
          id: '1',
          label: '已关联',
          value: 'already'
        },
        {
          id: '2',
          label: '未关联',
          value: 'not'
        }
      ],
      tableData: [],
      columns: [
        {
          name: '名称', // 表头名
          code: 'name', // 表身
          type: 'text'
        },
        {
          name: '标识', // 表头名字
          code: 'code', // 表身显示值
          type: 'text'
        },
        {
          name: '已添加对象', // 表头名字
          code: 'relation_object_num', // 表身显示值
          type: 'text',
          textAlign: 'center',
          width: 110,
          hasSort: true, // 排序
          sortAbled: true,
          sortOrder: 'none' // 排序
        },
        {
          name: '删除',
          code: '',
          type: 'delete',
          disable: false,
          textAlign: 'right',
          showDel: true, // 删除
          width: 50
        }
      ],
      tagForm: {}
    }
  },
  methods: {
    // 获取 单点登录白名单列表
    getTagList (search, orderBy) {
      let data = {
        page_size: PAGESIZE,
        page: 1,
        name: search,
        order_by: orderBy || 'asc'
      }
      NXMC_SETTING_TAG_LIST_GET(data).then(res => {
        if (res.code === 0) {
          if (!this.$_accessRoutes('settingCenter_tagList_delete')) {
            this.$set(this.columns[3], 'disable', true)
          }
          this.tableData = res.data.tags
          this.tableSet.paginationConfig.total = res.data.total
          this.$forceUpdate()
        }
      })
      // console.log(this.tableData, '-=-=-=')
    },
    // 新增-保存方法
    saveForm (params) {
      const data = {
        name: params.name,
        code: params.code,
        info: params.info
      }
      console.log(data, '+_+_+_')
      NXMC_SETTING_TAG_UPLOAD_POST(data).then(res => {
        if (res.code === 0) {
          this.getTagList()
          this.isAdd = false
        }
      })
    },
    // 更新
    updateRowInof (params) {
      const data = {
        tag_id: params.id,
        name: params.name,
        code: params.code,
        info: params.info
      }
      NXMC_SETTING_TAG_UPDATE_POST(data).then(res => {
        if (res.code === 0) {
          // this.$message({message: res.data.result, type: 'success'})
          bus.$emit('openMessage', {
            message: res.data.result,
            type: 'success'
          })
          this.getTagList()
        }
      })
    },
    // 删除
    deleteOne (row, index) {
      let arr = []
      this.tableData.forEach(item => arr.push(item.id))
      arr.splice(arr.indexOf(row.id), 1)
      let data = {
        tag_id: row.id
      }
      NXMC_SETTING_TAG_DELETE_POST(data).then(res => {
        // this.$message({message: res.data.result, type: 'success'})
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
        this.getTagList()
      })
    },
    // 搜索
    searchTable () {
      this.tableSet.paginationConfig.currentPage = 1
      this.getTagList(this.search)
    },
    // 新增-取消方法
    cancelForm () {
      this.isAdd = false
    }
  },
  created () {
    this.getTagList()
  },
  components: {
    ntTable,
    addTag
  }
}
</script>

<style lang="less" scoped>
@import "~common/style/variable";

.tag-container {

  .add-content {
    .el-input {
      width: 300px;
    }
  }
  .select-content {
    margin-top: 32px;
    margin-bottom: 20px;
    .el-input {
      width: 80%;
    }
    .label {
      font-size: 13px;
      height: 18px;
      line-height: 18px;
    }
    .mb7 {
      margin-bottom: 7px;
    }
  }
  .table-content {
    margin-top: 22px;
  }
}

</style>
