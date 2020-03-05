<template>
  <div class="strategy p10">
    <h2 class="mb30">资源列表</h2>

    <source-content @refresh="auth_source_list_get" :create="true" v-if="showContent" @close="showContent = false"
                    class="sourceContent"></source-content>

    <el-button v-else class="mb30" @click="showContent = true" type="primary" v-permission="'settingCenter_sourceList_add'">添加资源</el-button>

    <div class="tableDiv">
      <transition name="slide-fade">

        <div class="editPanel" v-show="panelShow" :class="{panelShow: panelShow}">
          <source-content @refresh="auth_source_list_get" ref="editPanel" @close="panelShow = false"></source-content>
        </div>
      </transition>
      <el-table
        :height="tableHeight"
        class="init_table"
        :row-class-name="tableRowClassName"
        :data="tableData"
        row-key="id"
        default-expand-all
      >
        <el-table-column align="left" prop="label" label="名称"></el-table-column>
        <!-- <el-table-column align="left" prop="code" label="标识"></el-table-column> -->
        <el-table-column width="100" align="left" prop="type" label="类型"
                         :formatter="typeTableFormatter"></el-table-column>
        <el-table-column width="100" align="left" prop="sort" label="排序"></el-table-column>
        <el-table-column width="100" align="left" prop="state" label="状态">
          <template slot-scope="scope">
            <nt-switch v-if="$_accessRoutes('settingCenter_sourceList_changeStatus')" :value="scope.row.state" @dyClick="statusUpdate(scope.row)"></nt-switch>
            <nt-switch v-else :value="scope.row.state"></nt-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" width="50" label="删除">
          <template slot-scope="scope">
            <div class="title deleteBox">
              <img src="@/assets/image/icon-delete.svg" v-if="$_accessRoutes('settingCenter_sourceList_delete')" class="deleteType" alt="" @click="deleteShow(scope.row)" v-show="!!!scope.row.showDelete">
              <img src="@/assets/image/Icon-delete-desable.svg" v-else class="deleteType" alt="">
              <div class="title flex-end deleteText" v-show="!!scope.row.showDelete">
                <div class="alert-text">确定删除?</div>
                <el-button type="primary" size="mini" @click="deleteOne(scope.row)">是</el-button>
                <el-button size="mini" @click="scope.row.showDelete=false">否</el-button>
              </div>
            </div>
            <div class="title"  v-show="!!!scope.row.deleteShow && scope.row.type === 'default'" >
              <img src="@/assets/image/Icon-delete-desable.svg" class="deleteType" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="50" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editMenu(scope.row)" v-if="$_accessRoutes('settingCenter_sourceList_add')">编辑</el-button>
            <el-button type="text" v-else class="disable" >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import ntTable from 'components/ntTable/ntTable.vue'
import sourceContent from 'views/settingCenter/setting/sourceList/sourceListContent.vue'
import {AUTH_SOURCE_LIST_GET, NXMC_AUTH_RESOURCE_DELETE, NXMC_AUTH_RESOURCE_STATUS_UPDATE} from '@/api'
// import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      panelShow: false,
      showContent: false,
      tableHeight: 0,
      tableData: [],
      menu_type: [
        {
          value: 'menu',
          label: '菜单'
        },
        {
          value: 'page',
          label: '页面'
        },
        {
          value: 'operation',
          label: '操作'
        }
        // {
        //   value: 'tab',
        //   label: '选项卡'
        // }
      ]
    }
  },
  props: {},
  computed: {},
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === 0) {
        return ''
      } else if (rowIndex % 2 === 1) {
        return 'second-row'
      } else {
        return 'first-row'
      }
    },
    deleteShow (row, index) {
      this.$set(row, 'showDelete', true)
    },
    statusUpdate (row) {
      NXMC_AUTH_RESOURCE_STATUS_UPDATE({resource_id: row.id, state: !row.state}).then(res => {
        bus.$emit('openMessage', {
          message: '资源状态更新成功!',
          type: 'success'
        })
        this.auth_source_list_get()
      })
    },
    deleteOne (row) {
      NXMC_AUTH_RESOURCE_DELETE({resource_id: row.id}).then(res => {
        bus.$emit('openMessage', {
          message: '删除成功！',
          type: 'success'
        })
        this.auth_source_list_get()
      })
    },
    typeTableFormatter (row, column) {
      for (let key in this.menu_type) {
        if (row.type === this.menu_type[key].value) {
          return this.menu_type[key].label
        }
      }
    },
    auth_source_list_get () {
      this.panelShow = false
      this.showContent = false
      AUTH_SOURCE_LIST_GET({}).then(res => {
        this.tableData = res.data.resource_list
      })
    },
    editMenu (row) {
      console.log(row)
      this.$refs.editPanel.setData(row)
      this.panelShow = true
    }
  },
  created () {
    this.auth_source_list_get()
    // this.tableHeight = document.documentElement.clientHeight - 370
    this.tableHeight = document.documentElement.clientHeight
  },
  components: {
    ntTable,
    ntSwitch,
    sourceContent
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";
.disable {
  color: #E4E7ED !important;
}
.deleteBox {
  width: 20px;
  height: auto;
  .deleteText {
    background: #fff;
    position: absolute;
    right: 0;
    top: 6px;
    height: 50px;
    width: 200px;
  }
}
.deleteType {
  padding-right: 8px;
}
  /* #51007 */
  .content {
    overflow-x: hidden;
  }

  .w425 {
    width: 42.5%;
  }

  .w45 {
    width: 45%;
  }

  .strategy {
    .sourceContent {
      margin-bottom: 20px;
      padding: 21px 0 46px 12px;
      background-color: @default-gray;
    }
  }

  .tableDiv {
    position: relative;

    .editPanel {
      background-color: @default-gray;
      position: absolute;
      right: -60%;
      top: 0;
      bottom: 0;
      width: 50%;
      z-index: 1;
      /*transition: all 0.2s;*/
      /*-moz-transition: all 0.2s;*/
      /*-webkit-transition: all 0.2s;*/
      /*-o-transition: all 0.2s;*/
      overflow: scroll;
    }
  }

  .panelShow {
    right: 0 !important;
  }

  .slide-fade-enter-active {
    transition: all .2s ease;
  }

  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(60%);
    opacity: 0;
  }
  .el-table--enable-row-hover{
    .el-table__body tr{
      &:hover{
        .deleteBox {
          .deleteText {
            background-color: #F5F7FA !important
          }
        }
      }
    }
  }
  .alert-text {
    margin-right: 10px;
    font-size: 7px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: #454646;
    line-height: 10px;
  }
</style>
