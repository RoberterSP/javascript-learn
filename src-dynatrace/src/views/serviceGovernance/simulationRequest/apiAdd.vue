<template>
  <div class="message_container">
    <stepper :stepper="stepper"></stepper>
    <div class="pl20 pr20 pt20 message_container">
      <DYHeader no-gap title="添加接口" type="small">
        <div slot="actions">
          <DYButton @click="cancel">取消</DYButton>
          <DYButton @click="save" type="primary">确认</DYButton>
        </div>
      </DYHeader>
      <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div>
      <div class="search">
        <el-input
          placeholder="请输入名称"
          v-model.trim="query" @change="searchData">
          <i slot="suffix" class="el-input__icon" @click="searchData"><DYIcon type="search"></DYIcon></i>
        </el-input>
      </div>
      <div class="user_list pb20">
        <nt-table :tableData="endpointListAdd" :columns="columnsAdd" @deleteOne="deleteOne"></nt-table>
      </div>
      <div class="user_list pb20">
        <nt-table :tableData="endpointList" :columns="columns" :tableSet="apiListTableSet" @addColumn="addColumn"></nt-table>
      </div>
    </div>
  </div>
</template>
<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import { MESH_ENDPOINT_LIST } from '@/api'
import { PAGESIZE } from '@/common/util/common.js'
export default {
  data () {
    return {
      detailData: {},
      stepper: [
        {
          name: '模拟请求',
          routerTo: 'simulationRequest'
        },
        {
          name: 'apidemo'
        },
        {
          name: '添加接口'
        }
      ],
      columns: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'text'
        }, {
          name: '名称', // 表头名字
          code: 'name', // 表身显示值
          type: 'text'
        },
        {
          name: '添加', // 表头名字
          code: '', // 表身显示值
          width: 80,
          textAlign: 'right',
          type: 'add'
        }],
      columnsAdd: [
        {
          name: '接口', // 表头名
          code: 'endpoint', // 表身
          type: 'text'
        }, {
          name: '名称', // 表头名字
          code: 'name', // 表身显示值
          type: 'text'
        },
        {
          name: '删除', // 表头名字
          code: '', // 表身显示值
          textAlign: 'right',
          type: 'delete'
        }
      ],
      endpointListAdd: [],
      endpointListCurAdd: [],
      editData: {},
      endpointList: [], // 角色列表
      page: 1, // 第几页
      apiListTableSet: { // 角色列表分页设置
        showOpenInfo: false, // 是否显示展开按钮
        allCheck: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      query: '' // 搜索内容
    }
  },
  computed: {
  },
  methods: {
    addColumn (row) {
      let findIndex = this.endpointListAdd.findIndex(item => item.id === row.id)
      let findCurIndex = this.endpointList.findIndex(item => item.id === row.id)
      if (findIndex === -1) {
        this.endpointListAdd.push(row)
        this.endpointList.splice(findCurIndex, 1)
      }
    },
    deleteOne (row, index) {
      this.endpointListAdd.splice(index, 1)
      this.endpointList.push(row)
    },
    // 点击取消
    cancel () {
      let detailData = {
        endpointListAdd: this.endpointListCurAdd,
        detailData: this.detailData,
        editData: this.editData
      }
      this.$router.push({name: 'simulationRequest', params: { detailData }})
    },
    // 资源分配
    save () {
      let detailData = {
        endpointListAdd: this.endpointListAdd,
        detailData: this.detailData,
        editData: this.editData
      }
      this.$router.push({name: 'simulationRequest', params: { detailData }})
    },
    searchData () {
      this.readMeshEndpointList()
    },
    readMeshEndpointList () {
      let data = {
        page: 1,
        page_size: PAGESIZE,
        mesh_code: 'nx-product'
      }
      if (this.query) {
        data.endpoint = this.query
      }
      MESH_ENDPOINT_LIST(data).then(res => {
        this.endpointList = res.data.endpoints
        this.$set(this.apiListTableSet.paginationConfig, 'total', res.data.total)
      })
    }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.endpointListCurAdd = this.$route.params.endpointListAdd
      this.endpointListAdd = this.$route.params.endpointListAdd
      this.editData = this.$route.params.editData
      this.$set(this.stepper[1], 'name', this.detailData.code)
      this.readMeshEndpointList()
    }
  },
  created () {
  },
  components: {
    ntTable,
    stepper
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "~common/style/variable";
.message_container {
  position: relative;
  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
  }
  .search{
    width: 80%;
    margin-top: 57px;
  }
  .user_list{
    margin-top: 44px;
    background: #ffffff
  }
}
</style>
