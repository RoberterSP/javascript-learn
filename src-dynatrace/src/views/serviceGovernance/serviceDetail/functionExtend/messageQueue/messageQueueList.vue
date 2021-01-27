<template>
  <div class="message_container">
    <DYHeader class="row-title" title="消息队列" type="small" no-gap>
      <div slot="actions">
        <DYButtonGroup>
          <DYButton type="primary" @click="batchEdit" v-if="isShowEle('batchEditMessageQueue')">批量编辑</DYButton>
          <dialogCompontent :isEdit="isEdit" :workerProcessTagList="workerProcessTagList"
                            :dialogFormTagsVisible.sync="dialogFormTagsVisible">
            <DYButton slot="reference" @click="resourcesAllocation"
                      v-permission="'serviceCenter_serviceDetail_messageQueueShowResource'">资源分配
            </DYButton>
          </dialogCompontent>
        </DYButtonGroup>

      </div>
    </DYHeader>
    <div class="search row-action">
      <el-input
        placeholder="请输入名称"
        v-model.trim="query" @change="searchData">
        <i slot="suffix" class="el-input__icon" @click="searchData">
          <DYIcon type="search" />
        </i>
      </el-input>
    </div>

    <nt-table
      class="row-content"
      :tableData="messageList"
      :columns="columns"
      :tableSet="messageListTableSet"
      @changeSwitch="changeSwitch"
      @checkAll="checkAll"
      @checkOne="checkOne"/>

  </div>
</template>
<script>
import ntTable from 'components/ntTable/ntTable.vue'
import {MESSAGE_QUEUE_LIST, NXMC_MESSAGE_PROCESS_TAG_RESOURCE} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'
import dialogCompontent from './dialogCompontent'

export default {
  data () {
    return {
      columns: [{
        name: '名称', // 表头名
        code: 'name',
        showicon: 'iconfont',
        icon_url: 'messagequeue',
        type: 'text',
        width: 300
      },
      {
        name: '标识', // 表头名
        code: 'code',
        type: 'text',
        width: 300
      },
      {
        name: '手动重试', // 表头名
        code: 'enable_dlq_bak',
        // width: 100,
        type: 'text'
      },
      {
        name: '队列标签', // 表头名
        code: 'priority',
        type: 'text'
      },
        // {
        //   name: '消息优先级最大值', // 表头名
        //   width: 150,
        //   code: 'priority_num',
        //   type: 'text'
        // },
      {
        name: '优先级队列', // 表头名
        code: 'enable_priority_queue_bak',
        type: 'text',
        width: 100
      },
      {
        name: '启用消费', // 表头名
        code: 'enable',
        type: 'switch',
        disable: true,
        textAlign: 'right'
      },
      {
        name: '全选', // 表头名字
        code: 'checked', // 表身显示值
        width: 80,
        textAlign: 'right',
        type: 'checkbox'
      }],
      messageList: [], // 角色列表
      page: 1, // 第几页
      messageListTableSet: { // 角色列表分页设置
        showOpenInfo: false, // 是否显示展开按钮
        allCheck: false,
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      meshCode: '',
      query: '', // 搜索内容
      chooseList: [], // 被选中的列表
      isEdit: true, // 是否是编辑模式
      workerProcessTagList: [], // 标签资源分配
      dialogFormTagsVisible: false
    }
  },
  computed: {
    isShowEle () {
      return key => this.$_hasRoute(key)
    }
  },
  methods: {
    // 点击确认按钮
    batchEdit () {
      if (this.chooseList.length === 0) {
        // this.$message({
        //   message: '请选择要编辑的消息队列!',
        //   type: 'warning'
        // })
        bus.$emit('openMessage', {
          message: '请选择要编辑的消息队列！',
          type: 'warning'
        })
      } else {
        window.sessionStorage.setItem('messageQueueChooseList', JSON.stringify(this.chooseList))
        window.sessionStorage.setItem('serviceDetail', JSON.stringify(this.detailData))

        // 传入未选择的 messageList
        this.$router.push({
          name: 'batchEditMessageQueue',
          params: {
            messageList: this.messageList.filter(item => !item.check)
          }
        })
      }
    },
    // 资源分配
    resourcesAllocation () {
      this.isEdit = false
      this.workerProcessTagList = []
      NXMC_MESSAGE_PROCESS_TAG_RESOURCE({mesh_code: this.meshCode}).then(res => {
        if (res.code === 0) {
          res.data.message_process_tag_resource.forEach((item) => {
            item.process_num = item.worker_process_num
          })
          this.workerProcessTagList = res.data.message_process_tag_resource
          this.dialogFormTagsVisible = true
        }
      })
    },
    // 获取消息队列列表
    getMessageQueue () {
      const params = {
        page: this.page,
        page_size: PAGESIZE,
        mesh_code: this.meshCode
      }
      if (this.query) params.name = this.query
      MESSAGE_QUEUE_LIST(params).then(res => {
        if (res.code === 0) {
          res.data.message_queues.forEach(item => {
            item.check = false
            item.enable_dlq_bak = item.enable_dlq ? '启用' : '禁用'
            item.enable_priority_queue_bak = item.enable_priority_queue ? '是' : '否'
          })
          this.messageList = res.data.message_queues
          this.chooseList = []
          this.messageListTableSet.allCheck = false
          this.messageListTableSet.paginationConfig.total = res.data.total
          this.$forceUpdate()
        }
      })
    },
    searchData () {
      this.messageListTableSet.paginationConfig.currentPage = 1
      this.getMessageQueue()
    },
    changeSwitch (code, row, val) {
    },
    checkAll (list) {
      this.chooseList = list
    },
    checkOne (list, notList) {
      this.chooseList = list
    }
    // close () {
    //   this.dialogFormTagsVisible = false
    // }
  },
  mounted () {
    if (this.$route.params && this.$route.params.detailData) {
      this.detailData = this.$route.params.detailData
      this.meshCode = this.detailData.code
      this.getMessageQueue()
      this.dialogFormTagsVisible = false
    }
  },
  created () {
  },
  components: {
    ntTable,
    dialogCompontent
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .message_container {
    position: relative;

    .search {
      width: 80%;
    }
  }
</style>
