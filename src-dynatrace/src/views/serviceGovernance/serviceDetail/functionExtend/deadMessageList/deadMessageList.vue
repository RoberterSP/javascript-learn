<template>
  <div class="page">
    <div class="">
      <DYHeader class="row-title head-title" title="死信队列" type="small" no-gap>
        <div slot="actions">
          <DYButtonGroup>

            <DYPopover
              :show.sync="confirmBatchSend"
              type="small"
            >
              <DYButton type="primary" slot="reference" @click="showBatchSend"
                        v-permission="'serviceCenter_serviceDetail_deadMessageList_patchRetry'">批量发送
              </DYButton>

              <div>
                <p class="no-warp text-center mb10">确认批量发送？</p>

                <DYButtonGroup>
                  <DYButton theme="dark" type="primary" @click="sureBatchSend()"
                            :disabled="chooseList && !chooseList.length">确认
                  </DYButton>
                  <DYButton theme="dark" @click="cancelSure()">取消</DYButton>
                </DYButtonGroup>
              </div>
            </DYPopover>

            <DYPopover
              :show.sync="confirmBatchDel"
              type="small"
            >
              <DYButton @click="showBatchDel" slot="reference"
                        v-permission="'serviceCenter_serviceDetail_deadMessageList_patchDelete'">批量删除
              </DYButton>

              <div>
                <p class="no-warp text-center mb10">确认批量删除？</p>

                <DYButtonGroup>
                  <DYButton theme="dark" type="primary" @click="sureBatchDel()"
                            :disabled="chooseList && !chooseList.length">确认
                  </DYButton>
                  <DYButton theme="dark" @click="cancelSure()">取消</DYButton>
                </DYButtonGroup>
              </div>
            </DYPopover>
          </DYButtonGroup>

        </div>
      </DYHeader>
      <!-- <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明</div> -->

      <div class="row-action">
        <DYFilter
          class="input-filter"
          :filterKeys="filterKeys"
          :quickSearch="false"
          @returnFilterFunc="returnFilterFunc"
        />
      </div>

      <nt-table class="row-content"
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
import moment from 'moment'

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
          name: '最后重试时间范围',
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
          icon_url: 'deadmessage',
          type: 'text',
          width: 300
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
          name: '重试次数', // 表头名字
          code: 'retry', // 表身显示值
          type: 'text',
          textAlign: 'right'
        }, {
          name: '发送', // 表头名字
          code: '', // 表身显示值
          type: 'icon',
          icon_action: true,
          icon_url: 'submit',
          width: 60,
          textAlign: 'center',
          disable: false
        }, {
          name: '删除', // 表头名字
          code: '', // 表身显示值
          type: 'delete',
          textAlign: 'center',
          width: 60,
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
      const dataFormat = 'YYYY-MM-DD HH:mm:ss'

      // 合并data
      this.filterModelValues = data.map(item => {
        if (item.code === 'createTimeObj') {
          return {
            created_start_at: moment(item.value.startTime).format(dataFormat),
            created_end_at: moment(item.value.endTime).format(dataFormat)
          }
        } else if (item.code === 'retryTimeObj') {
          return {
            retry_start_at: moment(item.value.startTime).format(dataFormat),
            retry_end_at: moment(item.value.endTime).format(dataFormat)
          }
        }
        return {
          [item.code]: item.value
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
      let meshCode = this.detailData.code
      let ids = this.chooseList.map(x => x.id)
      RETRY_DEAD_QUEUE_INFO({
        message_ids: ids,
        mesh_code: meshCode
      }).then(() => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    sureBatchDel () {
      let meshCode = this.detailData.code
      let ids = this.chooseList.map(x => x.id)
      DELETE_DEAD_QUEUE_INFO({
        message_ids: ids,
        mesh_code: meshCode
      }).then(() => {
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
    deleteOne (row) {
      let meshCode = this.detailData.code
      DELETE_DEAD_QUEUE_INFO({
        message_ids: [row.id],
        mesh_code: meshCode
      }).then(() => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    iconClick (row) {
      let meshCode = this.detailData.code
      RETRY_DEAD_QUEUE_INFO({
        message_ids: [row.id],
        mesh_code: meshCode
      }).then(() => {
        this.confirmBatchSend = false
        this.confirmBatchDel = false
        this.readDeadQueueList()
      })
    },
    saveContent (ruleForm, row) {
      const meshCode = this.detailData.code

      UPDATE_DEAD_QUEUE_INFO({
        message_id: row.id,
        mesh_code: meshCode,
        error_data: ruleForm.error_data
      }).then(() => {
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
    ntTable
  }
}
</script>
