<template>
  <div class="my-table custom" :class="{'table_height': (!tableSet.paginationConfig.defaultPage || tableSet.paginationConfig.defaultPage === 10) && !tableSet.hidePagination, 'table_height_5': (tableSet.paginationConfig.defaultPage && tableSet.paginationConfig.defaultPage === 5) && !tableSet.hidePagination}">
    <el-table
      :data="tableSource"
      ref="refTable"
      :row-class-name="tableRowClassName"
      @expand-change="expandChange"
      @row-click="rowClick"
      :cell-style="cellStyle"
      style="width: 100%">
      <el-table-column
        v-for="(column, index) in tableColumns"
        :key="index"
        :width="flexColumnWidth(column)"
      >
        <!-- 表头信息 -->
        <template slot="header" slot-scope="scope">
          <!-- 删除 -->
          <!-- 勾选框 -->
          <div v-if="column.type === 'checkbox'" class="flex header-style">
            <div class="flex header-style" v-if="column.textAlign && column.textAlign ==='right'">
              <div class="split align_right"></div>
              <div class="checkDiv flex-center" @click.stop="checkAll">
                <div class="title">
                  全选
                  <img class="checkImg" :src="tableSet.allCheck ? require('@/assets/image/checkboxon.svg') : require('@/assets/image/checkboxoff.svg')">
                </div>
              </div>
            </div>
            <div class="flex header-style" v-else>
              <div class="checkDiv flex-center" @click.stop="checkAll">
                <div class="title">
                  全选
                  <img class="checkImg" :src="tableSet.allCheck ? require('@/assets/image/checkboxon.svg') : require('@/assets/image/checkboxoff.svg')">
                </div>
              </div>
              <div class="split"></div>
            </div>
          </div>

           <!-- 删除 -->
          <div v-if="column.type === 'delete'" class="flex header-style">
            <div class="flex header-style" v-if="column.textAlign && column.textAlign ==='right'">
              <div class="split align_right"></div>
              <div class="title">{{column.name}}</div>
            </div>
            <div class="flex header-style" v-else>
              <div class="title">{{column.name}}</div>
              <div class="split"></div>
            </div>
          </div>

          <!-- text -->
          <div v-if="column.type === 'text' || column.type === 'html'" class="flex header-style">
            <div class="flex header-style" v-if="column.textAlign && column.textAlign ==='right'">
              <div class="split align_right"></div>
              <div class="title">
                {{column.name}}
                <span class="caret-wrapper" @click.stop="changeOrder(column)" v-if="!!column.sortAbled">
                  <img class="sort_icon" src="~@/assets/image/icon_rank.svg" title="" v-if="column.sortOrder === 'none'||!column.sortOrder"/>
                  <img class="sort_icon" src="~@/assets/image/icon_rank_up.svg" title="" v-if="column.sortOrder === 'asc'" />
                  <img class="sort_icon" src="~@/assets/image/icon_rank_down.svg" title="" v-if="column.sortOrder === 'desc'"/>
                </span>
              </div>
            </div>
            <div class="flex header-style" v-else>
              <div class="title">
                {{column.name}}
                <span class="caret-wrapper" @click.stop="changeOrder(column)" v-if="!!column.sortAbled">
                  <img class="sort_icon" src="~@/assets/image/icon_rank.svg" title="" v-if="column.sortOrder === 'none'||!column.sortOrder"/>
                  <img class="sort_icon" src="~@/assets/image/icon_rank_up.svg" title="" v-if="column.sortOrder === 'asc'" />
                  <img class="sort_icon" src="~@/assets/image/icon_rank_down.svg" title="" v-if="column.sortOrder === 'desc'"/>
                </span>
              </div>
              <div class="split"></div>
            </div>
          </div>

          <!-- tags -->
          <div v-if="column.type === 'tags'" class="flex header-style">
            <div class="flex header-style" v-if="column.textAlign && column.textAlign ==='right'">
              <div class="split align_right"></div>
              <div class="title">
                {{column.name}}
              </div>
            </div>
            <div class="flex header-style" v-else>
              <div class="title">
                {{column.name}}
              </div>
              <div class="split"></div>
            </div>
          </div>

          <!-- edit || add -->
          <div v-if="column.type === 'edit' || column.type === 'add' || column.type === 'icon' || column.type === 'idxIcon' || column.type === 'switch' || column.type === 'select' || column.type === 'handInput'" class="flex header-style">
            <div class="flex header-style" v-if="column.textAlign && column.textAlign ==='right'">
              <div class="split align_right"></div>
              <div class="title">{{column.name}}</div>
            </div>
            <div class="flex header-style" v-else>
              <div class="title">{{column.name}}</div>
              <div class="split"></div>
            </div>
          </div>
        </template>

        <!-- 表身信息 -->
        <template slot-scope="scope">
          <!-- 添加 -->
          <div class="flex header-style" :class="{'flex-end': column.textAlign === 'right'}" v-if="column.type === 'add'">
            <div class="title">
              <div class="iconfont iconadd theme-icon deleteType" v-if="!column.disable" @click="addColumn(scope.row)"></div>
              <div class="iconfont iconadd theme-icon deleteType disableColor" v-else></div>
            </div>
          </div>
          <!-- 删除 -->
          <div class="flex header-style" v-if="column.type === 'delete'" :class="{'flex-end': column.textAlign === 'right'}">
            <div class="title deleteBox">
              <img src="@/assets/image/icon-delete.svg" class="deleteType" alt="" @click="deleteShow(scope.row, column)" v-show="!!!scope.row.deleteShow && scope.row.type !== 'default' && !column.disable">
              <img src="@/assets/image/Icon-delete-desable.svg" class="deleteType" alt="" v-show="!!!scope.row.deleteShow && scope.row.type !== 'default' && column.disable">
              <div class="title flex-end deleteText" v-show="!!scope.row.deleteShow">
                <div class="alert-text">确定删除?</div>
                <el-button type="primary" size="mini" @click="deleteOne(scope.row, scope.$index, column)">是</el-button>
                <el-button size="mini" @click="deleteCancel(scope.row, column)">否</el-button>
              </div>
            </div>
            <div class="title"  v-show="!!!scope.row.deleteShow && scope.row.type === 'default'" >
              <img src="@/assets/image/Icon-delete-desable.svg" class="deleteType" alt="">
            </div>
          </div>

          <!-- 查看 -->
          <div :class="{'flex-end': column.textAlign === 'right'}" class="flex header-style"  v-if="column.type === 'edit'">
            <div class="title">
              <i class="column-icon iconfont" :class="setClass('icon' + (scope.row.lang || column.default_icon))" v-if="column.icon_url==='bylang'"></i>
              <i class="column-icon iconfont" :class="setClass(column.icon_url)" v-else></i>
              <a @click="readDetail(scope.row)" class="link_label cursor_pointer">{{scope.row[column.code]}}</a>
            </div>
            <!-- <el-button @click="readDetail(scope.row)" type="text" size="small">{{scope.row.name}}</el-button> -->
          </div>

          <!-- switch -->
          <div class="flex header-style" :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center',}" v-if="column.type === 'switch'">
            <div class="title" v-if="!column.disable"  @click="changeSwitch(column.code, scope.row, scope.row[column.code])"><dy-switch :value="scope.row[column.code]"></dy-switch></div>
            <div class="title" v-else><dy-switch :value="scope.row[column.code]"></dy-switch></div>
          </div>

          <!-- text -->
          <div v-if="column.type === 'text'">
            <div :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center',}" class="flex header-style" >
              <div class="title">
                <i class="column-icon iconfont" :class="setClass(column.icon_url)" v-if="column.icon_url" @click="readDetail(scope)"></i>
                <p style="white-space: pre-wrap;" v-if="scope.row[column.code] === '' || scope.row[column.code] === null">-</p>
                <p style="white-space: pre-wrap;" v-else>{{scope.row[column.code]}}</p>
              </div>
            </div>
          </div>

          <!-- icon -->
          <div v-if="column.type === 'icon'">
            <div class="flex header-style" >
              <div class="title" v-if="!column.disable">
                <div class="column-icon iconfont" :class="setClass(column.icon_url)" v-if="column.icon_url" @click="iconClick(scope.row)"></div>
                <img v-else :src="column.src" alt="" class="img_icon" @click="iconClick(scope.row)">
              </div>
              <div class="title" v-else>
                <div class="column-icon iconfont disableColor" :class="setClass(column.icon_url)" v-if="column.icon_url"></div>
                <img v-else :src="column.src" alt="" class="img_icon">
              </div>
            </div>
          </div>

          <!-- tags -->
          <div v-if="column.type === 'tags'">
            <div class="tag-box">
              <div class="tag-item" v-if="scope.row[column.code] && scope.row[column.code].length > 0" v-for="(tag, index) in scope.row[column.code]" :key="index">
                <div class="default-label tag-name">{{tag[column.tag_name] || tag}}</div>
              </div>
              <div v-else class="flex-center">-</div>
            </div>
          </div>

          <!-- checkbox -->
          <div v-if="column.type === 'checkbox'" class="flex header-style">
            <div class="flex header-style" :class="{'flex-end': column.textAlign === 'right'}">
              <div class="checkDiv title flex-center" @click.stop="checkOne(scope.$index)">
                <img class="checkImg" :src="scope.row.check ? require('@/assets/image/checkboxon.svg') : require('@/assets/image/checkboxoff.svg')">
              </div>
            </div>
          </div>

          <!-- idxIcon -->
          <div v-if="column.type === 'idxIcon'">
            <div class="flex header-style" :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center',}">
              <div class="title">
                <div class="column-icon iconfont" :class="setClass(column.icon_urls[scope.row.idxIcon])" v-if="column.icon_urls"></div>
                <img v-else :src="column.src" alt="">
              </div>
            </div>
          </div>
          <!-- 下拉选择 -->
          <div v-if="column.type === 'select'" class="flex header-style">
            <div class="flex header-style">
              <el-select v-model="scope.row.priority" placeholder="请选择" size="small" @change="selectValue(scope.row, scope.$index)">
                <el-option
                  v-for="(item,index) in tableSet.messageTags"
                  :key="index"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- input加减数 -->
          <div v-if="column.type === 'handInput'" class="flex header-style">
            <div class="flex header-style">
              <el-input-number v-model="scope.row.priority_num"  :min="1" :max="255" size="small" @change="changeValue(scope.row, scope.$index)"></el-input-number>
            </div>
          </div>
          <!-- html -->
          <div v-if="column.type === 'html'">
            <div :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center',}" class="flex header-style" >
              <div class="title">
                <div class="column-icon iconfont" :class="setClass(column.icon_url)" v-if="column.icon_url" @click="readDetail(scope)"></div>
                <p style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap;"
                   v-html="(scope.row[column.code] === '' || scope.row[column.code] === null || scope.row[column.code] === undefined) ? '-' : scope.row[column.code]"
                ></p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 展开 -->
      <el-table-column
        v-if="!!tableSet.showOpenInfo"
        :label="tableSet.openInfoLabel ? tableSet.openInfoLabel : '展开'"
        type="expand"
        class="expand"
        align="right">
        <template slot-scope="props">
          <component class="componentStyle"
                     v-bind:is="componentsName"
                     v-bind="componentProps"
                     @refresh="refresh"  @cancelContent="cancelContent(props.row)"
                     @saveContent="saveContent"
                     :clientDetails="props.row"></component>
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="flex-center empty">
          <div class="column-icon iconfont records ">
            <icon type="records"></icon>
          </div>
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <div class="flex-center pagination" v-if="tableSet.paginationConfig.total > (tableSet.paginationConfig.defaultPage ? tableSet.paginationConfig.defaultPage : 10) && !tableSet.hidePagination">
      <el-pagination
        :layout="tableSet.paginationConfig.layout"
        @current-change="handleCurrentPageChange"
        :current-page.sync="tableSet.paginationConfig.currentPage"
        :page-size="tableSet.paginationConfig.pageSize"
        :total="tableSet.paginationConfig.total">
      </el-pagination>
    </div>
    <div class="flex-center pagination" v-if="tableSet.paginationConfig.total > (tableSet.paginationConfig.defaultPage ? tableSet.paginationConfig.defaultPage : 10) && tableSet.truePage">
      <el-pagination
        :layout="tableSet.paginationConfig.layout"
        @current-change="truePageChange"
        :current-page.sync="tableSet.paginationConfig.currentPage"
        :page-size="tableSet.paginationConfig.pageSize"
        :total="tableSet.paginationConfig.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import './index.less'
import { arraySortByName } from '@/common/util/common.js'
import apiFilterContent from 'views/gatewayCenter/app/appdetail/apiFilter/apiFilterContent.vue'
import dySwitch from 'components/base/switch.vue'
import eventSubscribeContent from '@/views/gatewayCenter/app/appdetail/eventSubscribe/eventSubscribeContent.vue'
import addRouteRule from '@/views/gatewayCenter/api/apiDetail/routeRule/addRouteRule.vue'
import strategyContent from 'views/settingCenter/setting/warningStrategy/addRule.vue'
import addFormContainer from '@/views/settingCenter/setting/singleSignOn/addForm.vue'
import addRole from 'views/settingCenter/setting/userPower/addRole.vue'
import editRoles from 'views/settingCenter/setting/userPermissions/editRoles.vue'
import addLogSetting from 'views/settingCenter/setting/logSetting/addLogSetting.vue'
import addTag from 'views/settingCenter/setting/tag/addTag.vue'
import addFuseGroupRule from 'views/settingCenter/setting/fuseGroup/addFuseGroupRule.vue'
import addHealthRule from 'views/settingCenter/setting/healthRule/addHealthRule.vue'
import addTemplate from 'views/settingCenter/setting/configTemplate/addTemplate.vue'
import addThirdPartyForm from '@/views/settingCenter/setting/serviceProvider/addForm.vue'
import addUserForm from '@/views/settingCenter/setting/userList/addForm.vue'
import addNameSpace from 'views/settingCenter/setting/nameSpace/addNameSpace.vue'
import addRouterRulesForm from 'views/serviceGovernance/serviceDetail/serviceDetailGovernance/routerRules/addForm.vue'
import addFaultInjection from 'views/serviceGovernance/serviceDetail/serviceDetailGovernance/faultInjection/addFaultInjection'
import deployGroupsContent from 'views/serviceGovernance/serviceDetail/resourceInfo/serviceApi/deployGroupsContent'
import authenticationContent from '@/views/serviceGovernance/serviceDetail/serviceDetailGovernance/authentication/authenticationContent.vue'
import taskListContent from '@/views/serviceGovernance/serviceDetail/functionExtend/taskList/taskListContent.vue'
import deadMessageContent from '@/views/serviceGovernance/serviceDetail/functionExtend/deadMessageList/deadMessageContent.vue'
import addServiceConfig from '@/views/serviceGovernance/serviceConfigure/addServiceConfig.vue'
import tagsContent from '@/views/serviceGovernance/deployGroupList/deployGroupDetail/tagsContent.vue'
import addConfigList from '@/views/serviceGovernance/serviceConfigure/addConfigList.vue'
import logDetail from '@/views/analysisWarning/logQuery/logDetail.vue'
import editVersion from '@/views/serviceGovernance/serviceConfigure/appDistribute/editVersion.vue'
import icon from '@/components/base/icon'

export default {
  data () {
    return {}
  },
  computed: {
    tableSource: {
      get: function () {
        if (this.tableSet.paginationConfig && !this.tableSet.truePage) {
          let pageSize = this.tableSet.paginationConfig.pageSize ? this.tableSet.paginationConfig.pageSize : 10
          return this.tableData.slice(this.tableSet.paginationConfig.currentPage * pageSize - pageSize, this.tableSet.paginationConfig.currentPage * pageSize)
        } else {
          return this.tableData
        }
      },
      set: function () {}
    },
    tableColumns: {
      get: function () {
        return this.columns
      },
      set: function () {}
    }
  },
  watch: {
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableSet: {
      type: Object,
      default: () => {
        return {
          showPagination: false,
          showOpenInfo: false,
          paginationConfig: {
            defaultPage: 10,
            layout: 'prev, pager, next',
            currentPage: 1,
            pageSize: 10,
            total: 5000
          },
          allCheck: false,
          data: []
        }
      }
    },
    componentsName: {
      type: String,
      default: ''
    },

    // 组件属性
    componentProps: Object
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === 0) {
        return ''
      } else if (rowIndex % 2 === 1) {
        return 'second-row'
      } else {
        return 'first-row'
      }
    },
    cellStyle (data) {
    },
    flexColumnWidth (row) {
      if (row.width) {
        return row.width + 'px'
      }
      if (row.type === 'switch' || row.type === 'idxIcon') {
        return 103 + 'px'
      } else if (row.type === 'add') {
        return 43 + 'px'
      } else if (row.type === 'delete') {
        return 60 + 'px'
      }
    },
    // 自定义排序 asc: 升序   desc: 降序  none: 不排序
    changeOrder (column) {
      let destOrder = column.sortOrder === 'none' ? 'asc' : column.sortOrder === 'asc' ? 'desc' : column.sortOrder === 'desc' ? 'asc' : 'none'
      this.tableSource = arraySortByName(this.tableData, [column.code], destOrder)
      // eslint-disable-next-line no-return-assign
      this.columns.forEach(column => column.sortOrder = 'none')
      column.sortOrder = destOrder
    },
    // 点击下一页
    handleCurrentPageChange (val) {
      this.tableSet.paginationConfig.currentPage = val
      let total = this.tableSet.paginationConfig.total
      let size = this.tableSet.paginationConfig.pageSize
      let listTotal = this.tableData.length
      if (listTotal < total && val * size > listTotal) {
        this.$emit('getMoreData')
      }
    },
    truePageChange (val) {
      this.tableSet.paginationConfig.currentPage = val
      this.$emit('changePage', val)
    },
    // 是否展开
    expandChange (data, expandedRows) {
      // if (expandedRows && expandedRows.length > 0) {
      //   this.$set(data, 'deleteShow', false)
      // }
    },
    saveContent (params, row) {
      this.$emit('componentSaveContent', params, row)
    },
    cancelContent (row) {
      this.$refs.refTable.toggleRowExpansion(row, false)
    },
    rowClick (row, index, e) {
      this.$emit('rowClick', row, index)
      // this.$refs.refTable.toggleRowExpansion(row)
    },
    changeSwitch (code, row, val) {
      this.$emit('changeSwitch', code, row, val)
    },
    readDetail (row) {
      this.$emit('readDetail', row)
    },
    iconClick (row) {
      this.$emit('iconClick', row)
    },
    // 展示删除信息
    deleteShow (row, column) {
      // this.$set(column, 'width', '200px')
      this.$set(row, 'deleteShow', true)
    },
    // 删除一个
    deleteOne (row, index, column) {
      // this.$set(column, 'width', '60px')
      this.$set(row, 'deleteShow', false)
      this.$emit('deleteOne', row, index)
    },
    addColumn (row) {
      this.$emit('addColumn', row)
    },
    // 取消删除信息
    deleteCancel (row, column) {
      this.$set(row, 'deleteShow', false)
      let findDelete = this.tableSource.findIndex(item => item.deleteShow)
      if (findDelete === -1) {
        // this.$set(column, 'width', '60px')
      }
    },
    setClass (name) {
      let obj = {}
      obj[name] = true
      return obj
    },
    checkAll () {
      let _this = this
      this.tableSet.allCheck = !this.tableSet.allCheck
      this.tableData.map(function (item) {
        item.check = _this.tableSet.allCheck
      })
      this.tableSource.map(function (item) {
        item.check = _this.tableSet.allCheck
      })
      this.tableSource = JSON.parse(JSON.stringify(this.tableSource))
      this.$forceUpdate()
      let list = this.tableSet.allCheck ? this.tableData : []
      this.$emit('checkAll', list)
    },
    checkOne (index) {
      let _this = this
      // 本地记录 check 了哪一行
      let size = this.tableSet.paginationConfig.pageSize
      let currentPage = this.tableSet.paginationConfig.currentPage
      let tag = (currentPage - 1) * size + index
      let bol = !_this.tableData[tag].check
      _this.tableData[tag].check = bol
      _this.tableSource[index].check = bol
      // 强制刷新 dom
      _this.$forceUpdate()
      // 判断是不是把全部都勾选上了，并且区分出选中和未选中的
      let list = []
      let notList = []
      this.tableData.map(function (item) {
        if (item.check) {
          list.push(item)
        } else {
          notList.push(item)
        }
      })
      this.tableSet.allCheck = list.length === this.tableData.length
      this.$emit('checkOne', list, notList)
    },
    selectValue (row, index) {
      this.$emit('selectValue', row, index)
    },
    changeValue (row, index) {
      this.$emit('changeValue', row, index)
    }
  },
  components: {
    icon,
    dySwitch,
    apiFilterContent,
    eventSubscribeContent,
    addLogSetting,
    addRouteRule,
    addRole,
    editRoles,
    strategyContent,
    addFormContainer,
    addTag,
    addHealthRule,
    addFuseGroupRule,
    addTemplate,
    addThirdPartyForm,
    addUserForm,
    addNameSpace,
    addRouterRulesForm,
    addFaultInjection,
    deployGroupsContent,
    deadMessageContent,
    authenticationContent,
    taskListContent,
    addServiceConfig,
    tagsContent,
    addConfigList,
    editVersion,
    logDetail
  },
  created () {
    // 设置初始值
    if (!this.tableSet || !this.tableSet.paginationConfig) {
      this.tableSet.paginationConfig = {
        layout: 'prev, pager, next',
        currentPage: 1,
        pageSize: 10,
        total: 5000
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";
.theme-icon {
  color: @theme-color;
  cursor: pointer;
}
.deleteBox {
  width: 20px;
  height: auto;
  .deleteText {
    position: absolute;
    right: 0;
    height: 50px;
    width: 200px;
  }
}
.tag-box {
  margin-left: 5px;
  margin-right: 5px;
  overflow: scroll;
  .tag-item {
    display: inline-block;
    display: inline-flex;
    align-items: center;
    min-width: 30px;
    max-width: 350px;
    margin: 1px 2px;
    padding: 2px 8px;
    height: 24px;
    line-height: 24px;
    text-decoration: none;
    outline: 0;
    border: 1px solid #f2f2f2;
    background-color: #f2f2f2;
    border-radius: 12px;
    .tag-name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

</style>
<style lang="less">
.my-table{
  position: relative;
  padding-bottom: 50px;
  .isHighlight{
    background-color: #FFEE7C;
  }

  // tag 12px
  .tag-item .tag-name {
    font-size: 12px;
  }
}
.deleteType {
  padding-right: 8px;
}
.table_height{
  min-height: 530px;
}
.table_height_5 {
  min-height: 230px;
}
</style>
