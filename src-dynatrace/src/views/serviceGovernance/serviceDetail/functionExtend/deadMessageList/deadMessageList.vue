<template>
  <div class="page p10">
    <div class="">
      <div class="flex head-title">
        <h2 class="h2-title">死信队列</h2>
        <el-button class="head-btn" type="primary" @click="showBatchSend"
                   v-permission="'serviceCenter_serviceDetail_deadMessageList_patchRetry'">批量发送
        </el-button>
        <el-button class="head-btn" type="primary" @click="showBatchDel"
                   v-permission="'serviceCenter_serviceDetail_deadMessageList_patchDelete'">批量删除
        </el-button>
        <div class="popup" v-if="confirmBatchSend">
          <div class="popup-title default-label">确认批量发送？</div>
          <el-button type="primary" @click="sureBatchSend()" :disabled="chooseList && !chooseList.length">确认</el-button>
          <el-button @click="cancelSure()">取消</el-button>
        </div>
        <div class="popup" v-if="confirmBatchDel">
          <div class="popup-title default-label">确认批量删除？</div>
          <el-button type="primary" @click="sureBatchDel()" :disabled="chooseList && !chooseList.length">确认</el-button>
          <el-button @click="cancelSure()">取消</el-button>
        </div>
      </div>
      <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->

      <div class="m20">
        <!-- <input type="text" placeholder="过滤条件"/> -->
        <tags-input ref="tagsInput"
                    :userInputQuery="true"
                    :filterKeys="filterKeys"
                    :keysValue="keysValue"
                    @returnFilterFunc="returnFilterFunc"></tags-input>
      </div>
      <!--      <el-input class="search" suffix-icon="el-icon-search" v-model="select_name" placeholder="请输入名称" clearable @change="readDeadQueueList()"></el-input>-->

      <nt-table class="table-list"
                :tableData="dead_queues||[]"
                :columns="columns"
                :tableSet="tableSet"
                :componentsName="'deadMessageContent'"
                @deleteOne="deleteOne"
                @checkAll="checkAll"
                @checkOne="checkOne"
                @iconClick="iconClick"
                @changePage="changePage"
                @readDetail="readDetail"
                @componentSaveContent="saveContent"
      ></nt-table>
    </div>
  </div>
</template>

<script>
import {
  DELETE_DEAD_QUEUE_INFO,
  GET_DEAD_QUEUE_INFO,
  GET_DEAD_QUEUE_LIST,
  RETRY_DEAD_QUEUE_INFO,
  UPDATE_DEAD_QUEUE_INFO
} from '@/api/index.js'
import ntTable from 'components/ntTable/ntTable.vue'
import tagsInput from '@/components/tagsInput/tagsInput.vue'

export default {
  data () {
    return {
      lise_count: 0,
      dead_queues: false,
      keysValue: ['code', 'name'],
      filterKeys: [
        //   {
        //   name: '名称',
        //   code: 'name',
        //   type: 'input'
        // },
        {
          name: '首次调用时间范围',
          code: 'createTimeObj',
          type: 'time'
        }, {
          name: '首次最后重试时间范围',
          code: 'retryTimeObj',
          type: 'time'
        }, {
          name: '状态',
          code: 'state',
          list: [{
            label: '新建',
            value: 'new'
          }, {
            label: '成功',
            value: 'success'
          }, {
            label: '失败',
            value: 'fail'
          }, {
            label: '重试中',
            value: 'processing'
          }],
          type: 'select_obj'
        }],
      columns: [
        {
          name: '名称', // 表头名
          code: 'message_name', // 表身
          showicon: 'iconfont',
          icon_url: 'icondeadmessage',
          type: 'text',
          width: 300
        }, {
          name: '重试次数', // 表头名字
          code: 'retry', // 表身显示值
          type: 'text'
        }, {
          name: '首次调用', // 表头名字
          code: 'created_at', // 表身显示值
          type: 'text'
        }, {
          name: '最后重试', // 表头名字
          code: 'retry_at', // 表身显示值
          type: 'text'
        }, {
          name: '状态', // 表头名字
          code: 'state_str', // 表身显示值
          type: 'text'
        }, {
          name: '发送', // 表头名字
          code: '', // 表身显示值
          type: 'icon',
          icon_url: 'iconsubmit service-upload',
          width: 50,
          disable: false
        }, {
          name: '删除', // 表头名字
          code: '', // 表身显示值
          type: 'delete',
          textAlign: 'right',
          width: 50,
          disable: false
        }, {
          name: '全选', // 表头名字
          code: 'check', // 表身显示值
          type: 'checkbox',
          textAlign: 'right',
          width: 80,
          disable: false
        }
      ],
      confirmBatchSend: false,
      confirmBatchDel: false,
      chooseList: [],
      tableSet: {
        hidePagination: true,
        truePage: true,
        showOpenInfo: true,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        allCheck: false
      },
      filterModelValues: {}
    }
  },
  computed: {},
  methods: {
    returnFilterFunc (data) {
      console.log('过滤条件回传', data)

      // 合并data
      this.filterModelValues = data.map(item => {
        if (item.code === 'createTimeObj') {
          return {
            created_start_at: item.value.startTime,
            created_end_at: item.value.endTime
          }
        } else if (item.code === 'retryTimeObj') {
          return {
            retry_start_at: item.value.startTime,
            retry_end_at: item.value.endTime
          }
        } else {
          return {
            [item.code]: item.value
          }
        }
      }).reduce((p, v) => Object.assign({}, p, v), {})

      this.readDeadQueueList()
    },

    changePage (page) {
      this.tableSet.paginationConfig.currentPage = page
      this.readDeadQueueList(page)
    },
    readDeadQueueList (page) {
      const meshCode = this.detailData ? this.detailData.code : ''
      let data = {
        page: page || 1,
        page_size: this.tableSet.paginationConfig.pageSize,
        mesh_code: meshCode
      }

      Object.assign(data, this.filterModelValues)

      GET_DEAD_QUEUE_LIST(data).then(res => {
        if (!this.$_accessRoutes('serviceCenter_serviceDetail_deadMessageList_retry')) {
          this.$set(this.columns[5], 'disable', true)
        }
        if (!this.$_accessRoutes('serviceCenter_serviceDetail_deadMessageList_delete')) {
          this.$set(this.columns[6], 'disable', true)
        }
        let deadQueues = res.data.dead_queues
        this.lise_count = res.data.total || 0
        this.$set(this.tableSet.paginationConfig, 'total', res.data.total || 0)
        this.dead_queues = deadQueues
        this.dead_queues.forEach(x => {
          let stateStr = '新建'
          if (x.state === 'new') {
            stateStr = '新建'
          }
          if (x.state === 'processing') {
            stateStr = '重试中'
          }
          if (x.state === 'fail') {
            stateStr = '失败'
          }
          if (x.state === 'success') {
            stateStr = '成功'
          }
          this.$set(x, 'state_str', stateStr)
          this.$set(x, 'check', false)

          GET_DEAD_QUEUE_INFO({
            message_id: x.id,
            mesh_code: meshCode
          }).then(res => {
            let deadQueueInfo = res.data
            this.$set(x, 'retry_user', deadQueueInfo.retry_user)
            this.$set(x, 'error_data', deadQueueInfo.error_data)
            this.$set(x, 'error_msg', deadQueueInfo.error_msg)
          })
        })
      })
    },
    showBatchSend () {
      this.confirmBatchSend = true
      this.confirmBatchDel = false
    },
    showBatchDel () {
      this.confirmBatchSend = false
      this.confirmBatchDel = true
    },
    cancelSure () {
      this.confirmBatchSend = false
      this.confirmBatchDel = false
    },
    sureBatchSend () {
      var meshCode = this.detailData.code
      var ids = this.chooseList.map(x => x.id)
      RETRY_DEAD_QUEUE_INFO({
        message_ids: ids,
        mesh_code: meshCode
      }).then(res => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    sureBatchDel () {
      var meshCode = this.detailData.code
      var ids = this.chooseList.map(x => x.id)
      DELETE_DEAD_QUEUE_INFO({
        message_ids: ids,
        mesh_code: meshCode
      }).then(res => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    readDetail (row) {
      console.log(row)

      // const meshCode = this.detailData ? this.detailData.code : ''
      //
      // GET_DEAD_QUEUE_INFO({
      //   message_id: row.id,
      //   mesh_code: meshCode
      // }).then(res => {
      //   let deadQueueInfo = res.data
      //   this.$set(row, 'retry_user', deadQueueInfo.retry_user)
      //   this.$set(row, 'error_data', deadQueueInfo.error_data)
      //   this.$set(row, 'error_msg', deadQueueInfo.error_msg)
      // })
    },
    checkAll (list) {
      this.chooseList = list
      console.log('checkAll', list)
    },
    checkOne (list, notList) {
      this.chooseList = list
      console.log('checkOne', list, notList)
    },
    // 删除
    deleteOne (row, index) {
      var meshCode = this.detailData.code
      DELETE_DEAD_QUEUE_INFO({
        message_ids: [row.id],
        mesh_code: meshCode
      }).then(res => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    iconClick (row) {
      var meshCode = this.detailData.code
      RETRY_DEAD_QUEUE_INFO({
        message_ids: [row.id],
        mesh_code: meshCode
      }).then(res => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    saveContent (ruleForm, row) {
      var meshCode = this.detailData.code
      UPDATE_DEAD_QUEUE_INFO({
        message_id: row.id,
        mesh_code: meshCode,
        error_data: ruleForm.error_data
      }).then(res => {
        this.readDeadQueueList()
      })
    }
  },
  mounted () {
  },
  created () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.meshCode = this.detailData.code
      this.readDeadQueueList()
    }
  },
  components: {
    ntTable,
    tagsInput
  }
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .page {
    .head-title {
      position: relative;
      justify-content: flex-end;

      .h2-title {
        margin-right: auto;
      }

      .popup {
        position: absolute;
        top: -10px;
        right: 80px;
        padding: 20px;
        width: 344px;
        background: rgba(69, 70, 70, 1);
        border-radius: 3px;
        z-index: 10;

        .popup-title {
          margin-bottom: 11px;
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
        }
      }
    }

    /*.desc {*/
    /*  margin-top: 8px;*/
    /*  width: 50%;*/
    /*  line-height: 20px;*/
    /*}*/
    // .table-list {
    //   margin-top: 20px;
    // }
    /*.search {*/
    /*  width: 80%;*/
    /*  margin-top: 32px;*/
    /*  margin-bottom: 20px;*/
    /*}*/
  }
</style>
