<template>
  <div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" theme="blue" @goRouter="cancel"></stepper>
      <DYCard class="content">
        <div class="message_container">
          <div class="flex-between">
            <div style="flex: 1;">
              <DYHeader class="row-title" title="批量编辑" type="small" no-gap/>
              <div class="row-desc">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div>
            </div>
            <div class="flex-end">
              <DYButton @click="cancel" class="mr10">取消</DYButton>
              <dialogCompontent :isEdit="true" :workerProcessTagList="workerProcessTagList"
                                :dialogFormTagsVisible.sync="dialogFormTagsVisible" @save="save">
                <DYButton slot="reference" type="primary" @click="saveEdit">下一步</DYButton>
              </dialogCompontent>

            </div>
          </div>
          <div class="row-content">
            <nt-table :tableData="dialogTableConfigData" :columns="columns" :tableSet="tableSet"
                      @selectValue="selectValue" @changeValue="changeValue" @changeSwitch="changeSwitch"></nt-table>
          </div>
        </div>
      </DYCard>
    </div>
  </div>
</template>

<script>
import stepper from 'components/stepper/stepper.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import dialogCompontent from './dialogCompontent'
import {MESSAGE_PROCESS_TAG_LIST, NXMC_MESSAGE_PROCESS_TAG_RESOURCE, NXMC_MESSAGE_QUEUE_EDIT_POST} from '@/api'
import {PAGESIZE} from '@/common/util/common.js'
import bus from '@/assets/eventBus.js'

let ImmutabilityList = []

function arrUnique (arr, name) {
  let hash = {}
  return arr.reduce(function (item, next) {
    // eslint-disable-next-line no-unused-expressions
    hash[next[name]] ? '' : hash[next[name]] = true && item.push(next)
    return item
  }, [])
}

export default {
  props: {
    detailData: {
      type: Object,
      default () {
        return {
          meshCode: 'nxmc'
        }
      }
    }
  },
  data () {
    return {
      stepper: [
        {
          name: '服务列表',
          routerTo: 'serviceList',
          step: 1
        }, {
          name: '',
          routerTo: 'serviceDetail',
          step: 2
        }, {
          name: '功能扩展',
          routerTo: 'functionExtend',
          step: 3,
          myCustomRouter: true
        },
        {
          name: '消息队列',
          routerTo: 'functionExtend',
          step: 4,
          myCustomRouter: true
        },
        {
          name: '批量编辑',
          routerTo: '',
          step: 5
        }
      ],
      columns: [{
        name: '名称', // 表头名
        code: 'name',
        type: 'text'
      },
      {
        name: '消息队列标签', // 表头名
        code: 'priority',
        type: 'select'
      },
      {
        name: '消息优先级最大值', // 表头名
        code: 'priority_num',
        type: 'handInput'
      },
      {
        name: '启用消费', // 表头名
        code: 'enable',
        type: 'switch'
      }],
      tableSet: { // 角色列表分页设置
        showOpenInfo: false, // 是否显示展开按钮
        messageTags: [],
        paginationConfig: {
          layout: 'prev, pager, next',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      workerProcessTagList: [], // 标签资源分配
      dialogFormTagsVisible: false,
      dialogTableConfigData: [],
      serviceDetail: {},
      queue_list: [],
      messageTags: [],
      messageList: []
    }
  },
  computed: {},
  methods: {
    saveEdit () {
      let enableTagList = this.getEnableList().filter(item => item.enable)

      // 过滤重复的tag_name
      enableTagList = arrUnique(enableTagList, 'priority')

      // 处理数据
      this.workerProcessTagList = enableTagList.map(item => {
        // 通过value 查找对应的标签 id 和 name
        const priorityItem = this.messageTags.find(v => v.code === item.priority) || {}

        let processNumber = 0

        if (ImmutabilityList.length) {
          // 查找原始数据
          const processTagItem = ImmutabilityList.find(v => v.tag_code === item.priority) || {}

          processNumber = processTagItem.process_num || 0
        }

        return {
          tag_name: priorityItem.name,
          tag_id: priorityItem.id,
          tag_code: priorityItem.code,
          process_num: processNumber
        }
      })

      this.dialogFormTagsVisible = true
    },
    getEnableList () {
      this.queue_list = this.dialogTableConfigData.map((item) => {
        let _obj = {}
        _obj.code = item.code
        _obj.enable = item.enable
        _obj.priority = item.priority
        _obj.priority_num = Number(item.priority_num)

        return _obj
      })

      return this.messageList.concat(this.queue_list)
    },

    cancel () {
      this.$router.push({
        name: 'messageQueueList',
        params: {
          detailData: this.serviceDetail,
          showComponent: {
            name: '消息队列',
            code: 'messageQueueList',
            fcExt: this.fcExt,
            serGo: this.serGo
          }
        }
      })
    },

    save (list) {
      let params = {
        mesh_code: this.serviceDetail.code,
        queue_list: this.queue_list,
        worker_process_tag_list: list
      }
      NXMC_MESSAGE_QUEUE_EDIT_POST(params).then(res => {
        window.sessionStorage.removeItem('messageQueueChooseList')
        window.sessionStorage.removeItem('serviceDetail')

        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success',
          onClose: () => {
            this.$router.push({
              name: 'messageQueueList',
              params: {detailData: this.serviceDetail, showComponent: {name: '消息队列', code: 'messageQueueList'}}
            })
          }
        })
      })
    },
    selectValue (row, index) {
      this.$set(this.dialogTableConfigData[index], 'priority', row.priority)
    },
    changeValue (row, index) {
      this.$set(this.dialogTableConfigData[index], 'priority_num', row.priority_num)
    },
    // 资源分配
    async resourcesAllocation () {
      await NXMC_MESSAGE_PROCESS_TAG_RESOURCE({mesh_code: this.serviceDetail.code}).then(res => {
        if (res.code === 0) {
          res.data.message_process_tag_resource.forEach((item) => {
            item.process_num = item.worker_process_num
          })
          this.workerProcessTagList = res.data.message_process_tag_resource
          ImmutabilityList = res.data.message_process_tag_resource
        }
      })
    },
    changeSwitch (code, row, val) {
      this.dialogTableConfigData.forEach(item => {
        if (item.id === row.id) {
          item.enable = !item.enable
        }
      })
    },
    messageProcessTagList () {
      this.messageTags = []
      let data = {
        page_size: PAGESIZE,
        page: 1
      }
      this.tableSet.messageTags = []
      MESSAGE_PROCESS_TAG_LIST(data).then(res => {
        this.messageTags = res.data.message_process_tags.filter(item => item.state)
        this.messageTags.forEach(item => {
          this.tableSet.messageTags.push({
            name: item.name,
            code: item.code,
            id: item.id
          })
        })
      })
    }
  },
  mounted () {
    this.dialogFormTagsVisible = false
    this.dialogTableConfigData = (window.sessionStorage.getItem('messageQueueChooseList') && JSON.parse(window.sessionStorage.getItem('messageQueueChooseList'))) || []
    this.serviceDetail = (window.sessionStorage.getItem('serviceDetail') && JSON.parse(window.sessionStorage.getItem('serviceDetail'))) || {}
    this.tableSet.paginationConfig.total = this.dialogTableConfigData.length
    this.$set(this.stepper[1], 'name', this.serviceDetail.name)
    this.resourcesAllocation()
    this.messageProcessTagList()

    if (this.serviceDetail.standard && this.serviceDetail.code !== 'nxgw') this.fcExt = true
    if (this.serviceDetail.standard || (!this.serviceDetail.standard && !this.serviceDetail.component)) this.serGo = true

    // 拿到上一级的全部启用标签
    if (this.$route.params) {
      const {messageList} = this.$route.params

      this.messageList = messageList || []
    }
  },
  created () {
  },
  components: {
    ntTable,
    dialogCompontent,
    stepper
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .wrapper {
    .app-list {
      min-height: 744px;

      .content {
        min-height: 744px;
      }
    }
  }
</style>
