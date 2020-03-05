<template>
<div class="wrapper">
    <div class="app-list">
      <stepper :stepper="stepper" @goRouter="cancel"></stepper>
      <div class="content">
        <div class="message_container">
          <div class="flex-between">
            <div style="flex: 1;">
              <h2>批量编辑</h2>
              <div class="desc default-label">这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的说明这里写的</div>
            </div>
            <div class="flex-end">
              <el-button @click="cancel" class="mr10">取消</el-button>

              <dialogCompontent :isEdit ="true" :workerProcessTagList="workerProcessTagList" :dialogFormTagsVisible.sync="dialogFormTagsVisible" @save="save">
                <el-button @click="saveEdit" type="primary" slot="reference">下一步</el-button>
              </dialogCompontent>

            </div>
          </div>
          <div class="user_list">
            <nt-table :tableData="dialogTableConfigData" :columns="columns" :tableSet="tableSet" @selectValue="selectValue" @changeValue="changeValue" @changeSwitch="changeSwitch"></nt-table>
          </div>
        </div>
      </div>
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
      default: function () {
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
          myCoutomRouter: true
        },
        {
          name: '消息队列',
          routerTo: 'functionExtend',
          step: 4,
          myCoutomRouter: true
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
      messageTags: []
    }
  },
  computed: {
  },
  methods: {
    saveEdit () {
      this.getEnableList()
      // 如果 后端返回为空， 就初始化为 0

      // 过滤重复的tag_name
      this.queue_list = arrUnique(this.queue_list, 'priority')

      // 过滤出启用的条目
      this.workerProcessTagList = this.queue_list.filter(item => item.enable).map(item => {
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
      // let _copy = []
      // _copy = JSON.parse(JSON.stringify(this.dialogTableConfigData))
      // let arr = _copy.filter(item => item.enable)
      // this.workerProcessTagList = this.getEditData(arr, this.messageTags)
      const list = []
      this.dialogTableConfigData.map((item) => {
        let _obj = {}
        _obj.code = item.code
        _obj.enable = item.enable
        _obj.priority = item.priority
        _obj.priority_num = Number(item.priority_num)
        list.push(_obj)
      })
      this.queue_list = list
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
      // this.$router.push({name: 'messageQueueList', params: {detailData: this.serviceDetail, showComponent: {name: '消息队列', code: 'messageQueueList'}}})
    },

    save (list) {
      this.dialogFormTagsVisible = false
      let params = {
        mesh_code: this.serviceDetail.code,
        queue_list: this.queue_list,
        worker_process_tag_list: list
      }
      NXMC_MESSAGE_QUEUE_EDIT_POST(params).then(res => {
        window.sessionStorage.removeItem('messageQueueChooseList')
        window.sessionStorage.removeItem('serviceDetail')
        // this.$message({
        //   message: '编辑更改成功!',
        //   type: 'success',
        //   onClose: () => {
        //     this.$router.push({name: 'messageQueueList', params: {detailData: this.serviceDetail, showComponent: {name: '消息队列', code: 'messageQueueList'}}})
        //   }
        // })
        bus.$emit('openMessage', {
          message: '编辑更改成功！',
          type: 'success',
          onClose: () => {
            this.$router.push({name: 'messageQueueList', params: {detailData: this.serviceDetail, showComponent: {name: '消息队列', code: 'messageQueueList'}}})
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
          res.data.message_process_tag_resource.map((item) => {
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
      width: 100%;
      min-height: 744px;
      padding: 20px;
      background: #ffffff;
    }
  }
}
.message_container {

  .desc {
    margin-top: 8px;
    width: 50%;
    line-height: 20px;
  }

  .user_list{
    margin-top: 44px;
  }
}
</style>
