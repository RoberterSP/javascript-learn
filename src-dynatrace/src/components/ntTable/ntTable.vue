<template>
  <div class="my-table custom" :class="{'table_height': (!tableSet.paginationConfig.defaultPage || tableSet.paginationConfig.defaultPage === 10) && !tableSet.hidePagination, 'table_height_5': (tableSet.paginationConfig.defaultPage && tableSet.paginationConfig.defaultPage === 5) && !tableSet.hidePagination}">
    <el-table
      :data="tableSource"
      ref="refTable"
      :row-class-name="tableRowClassName"
      @expand-change="expandChange"
      @row-click="rowClick"
      :cell-style="cellStyle"
      style="width: 100%; min-height: inherit; display: flex; flex-direction: column">
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
            <div class="flex header-style">
              <div class="split" v-if="column.textAlign && (column.textAlign ==='right' || column.textAlign ==='center')"></div>
              <div class="title">{{column.name}}</div>
              <div class="split" v-if="column.textAlign !=='right'"></div>
            </div>
          </div>

          <!-- text -->
          <div v-if="column.type === 'text' || column.type === 'html'" class="flex header-style">
            <div class="flex header-style">
              <div class="split" v-if="column.textAlign && (column.textAlign ==='right' || column.textAlign ==='center')"></div>
              <div class="title">
                <span>{{column.name}}</span>
                <span class="caret-wrapper" @click.stop="changeOrder(column)" v-if="!!column.sortAbled">
                  <img class="sort_icon" src="~@/assets/image/icon_rank.svg" title="" v-if="column.sortOrder === 'none'||!column.sortOrder"/>
                  <img class="sort_icon" src="~@/assets/image/icon_rank_up.svg" title="" v-if="column.sortOrder === 'asc'" />
                  <img class="sort_icon" src="~@/assets/image/icon_rank_down.svg" title="" v-if="column.sortOrder === 'desc'"/>
                </span>
              </div>
              <div class="split" v-if="column.textAlign !=='right'"></div>
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
            <div class="flex header-style">
              <div class="split" v-if="column.textAlign && (column.textAlign ==='right' || column.textAlign ==='center')"></div>
              <div class="title">{{column.name}}</div>
              <div class="split" v-if="column.textAlign !=='right'"></div>
            </div>
          </div>
        </template>

        <!-- 表身信息 -->
        <template slot-scope="scope">
          <!-- 添加 -->
          <div v-if="column.type === 'add'">
            <div :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center'}" class="flex header-style" >
              <div class="title">
                <div class="iconfont theme-icon" v-if="!column.disable" @click="addColumn(scope.row)"><DYIcon type="add"></DYIcon></div>
                <div class="iconfont theme-icon disableColor" v-else><DYIcon type="add" /></div>
              </div>
            </div>
          </div>
          <!-- 删除 -->
          <div v-if="column.type === 'delete'">
            <div :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center'}" class="flex header-style" >
              <div class="title deleteBox" v-if="scope.row.type !== 'default'">
                <DYIcon type="delete" actions class="delete-icon" @click="deleteShow(scope.row, column)" :disabled="column.disable" />
                <DYMiniConfirmationDialog
                  class="delete-background"
                  message="确定删除？"
                  :show="!!scope.row.deleteShow"
                  @onOk="deleteOne(scope.row, scope.$index, column)"
                  @onCancel="deleteCancel(scope.row, column)"
                />
              </div>
              <div class="title"  v-show="scope.row.type === 'default'" >
                <DYIcon type="delete" disabled class="delete-icon mr8" />
              </div>
            </div>
          </div>
          <!-- 查看 -->
          <div :class="{'flex-end': column.textAlign === 'right'}" class="flex header-style"  v-if="column.type === 'edit'">
            <div class="title">
              <div class="column-icon iconfont" v-if="column.icon_url==='bylang'"><DYIcon :type="scope.row.lang || column.default_icon"></DYIcon></div>
              <div class="column-icon iconfont" v-else ><DYIcon :type="column.icon_url" :actions="!!column.icon_action"></DYIcon></div>
              <a @click="readDetail(scope.row)" class="no-decoration cursor-pointer">{{scope.row[column.code]}}</a>
            </div>
          </div>

          <!-- switch -->
          <div class="flex header-style" :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center',}" v-if="column.type === 'switch'">
            <div class="title" v-if="!column.disable">
              <dy-switch @dyClick="changeSwitch(column.code, scope.row, isObject(scope.row[column.code]) ? scope.row[column.code].value : scope.row[column.code])" :value="isObject(scope.row[column.code]) ? scope.row[column.code].value : scope.row[column.code]" :disabled="!!scope.row[column.code].disabled" />
            </div>
            <div class="title" v-else>
              <!-- 如果 scope.row[column.code] 是一个对象， 那么就取对象里的 value -->
              <dy-switch :disabled="column.disable" :value="isObject(scope.row[column.code]) ? scope.row[column.code].value : scope.row[column.code]" />
            </div>
          </div>

          <!-- text -->
          <div v-if="column.type === 'text'">
            <div :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center','align-width-word': column.textAiignWithoutIcon}" class="flex header-style" >
              <div class="title">
                <div class="column-icon iconfont" @click="readDetail(scope)" v-if="column.icon_url"><DYIcon :type="column.icon_url" :actions="!!column.icon_action"></DYIcon></div>
                <p style="white-space: pre-wrap;" v-if="scope.row[column.code] === '' || scope.row[column.code] === null">-</p>
                <p style="white-space: pre-wrap;" v-else>{{scope.row[column.code]}}</p>
              </div>
            </div>
          </div>

          <!-- icon -->
          <div v-if="column.type === 'icon'">
            <div :class="{'flex-end': column.textAlign === 'right','flex-center': column.textAlign === 'center'}" class="flex header-style" >
              <div class="title" v-if="!column.disable">
                <div class="column-icon iconfont" v-if="column.icon_url" @click="iconClick(scope.row)"><DYIcon :type="column.icon_url" :actions="!!column.icon_action"></DYIcon></div>
                <img v-else :src="column.src" alt="" class="img_icon" @click="iconClick(scope.row)">
              </div>
              <div class="title" v-else>
                <div class="column-icon iconfont disableColor" v-if="column.icon_url"><DYIcon :type="column.icon_url" :actions="!!column.icon_action"></DYIcon></div>
                <img v-else :src="column.src" alt="" class="img_icon">
              </div>
            </div>
          </div>

          <!-- tags -->
          <div v-if="column.type === 'tags'">
            <div class="tag-box">
              <template v-if="scope.row[column.code] && scope.row[column.code].length > 0">
                <DYTag
                  v-for="(tag, index) in scope.row[column.code]" :key="index"
                >{{tag[column.tag_name] || tag}}</DYTag>
              </template>

                <div v-else style="padding: 0 4px">-</div>
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
                <div class="column-icon iconfont" v-if="column.icon_urls"><DYIcon :type="column.icon_urls[scope.row.idxIcon]"></DYIcon></div>
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
                <div class="column-icon iconfont" v-if="column.icon_url" @click="readDetail(scope)"><DYIcon :type="column.icon_url" :actions="!!column.icon_action"></DYIcon></div>
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
            <DYIcon type="records"></DYIcon>
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

import {isObject} from 'lodash'

export default {
  data () {
    return {
      isObject
    }
  },
  computed: {
    tableSource: {
      get () {
        if (this.tableSet.paginationConfig && !this.tableSet.truePage) {
          let pageSize = this.tableSet.paginationConfig.pageSize ? this.tableSet.paginationConfig.pageSize : 10
          return this.tableData.slice(this.tableSet.paginationConfig.currentPage * pageSize - pageSize, this.tableSet.paginationConfig.currentPage * pageSize)
        }
        return this.tableData
      },
      set () {}
    },
    tableColumns: {
      get () {
        return this.columns
      },
      set () {}
    }
  },
  watch: {
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableSet: {
      type: Object,
      default: () => ({
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
      })
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
        return 'first-row'
      } else if (rowIndex % 2 === 1) {
        return 'second-row'
      }
      return 'first-row'
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
      this.columns.forEach(item => item.sortOrder = 'none')
      column.sortOrder = destOrder
    },
    // 点击下一页
    handleCurrentPageChange (val) {
      this.tableSet.paginationConfig.currentPage = val
      let {total} = this.tableSet.paginationConfig
      let size = this.tableSet.paginationConfig.pageSize
      let listTotal = this.tableData.length
      if (listTotal < total && val * size > listTotal) {
        this.$emit('getMoreData')
      }

      this.$emit('onFalsePageChange', val)
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
      // console.log(code, row, val)
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
      this.tableSet.allCheck = !this.tableSet.allCheck
      this.tableData.forEach(item => {
        item.check = this.tableSet.allCheck
      })
      this.tableSource.forEach(item => {
        item.check = this.tableSet.allCheck
      })
      this.tableSource = JSON.parse(JSON.stringify(this.tableSource))
      this.$forceUpdate()
      let list = this.tableSet.allCheck ? this.tableData : []
      this.$emit('checkAll', list)
    },
    checkOne (index) {
      // 本地记录 check 了哪一行
      let size = this.tableSet.paginationConfig.pageSize
      let {currentPage} = this.tableSet.paginationConfig
      let tag = (currentPage - 1) * size + index
      let bol = !this.tableData[tag].check
      this.tableData[tag].check = bol
      this.tableSource[index].check = bol
      // 强制刷新 dom
      this.$forceUpdate()
      // 判断是不是把全部都勾选上了，并且区分出选中和未选中的
      let list = []
      let notList = []

      this.tableData.forEach(item => {
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
  color: @turq-06;
  cursor: pointer;
}
.deleteBox {
  width: 20px;
  height: auto;
}
.tag-box {
  margin-left: 5px;
  margin-right: 5px;
  overflow: auto;
}

.delete-icon {
  font-size: 22px;
}

</style>
<style lang="less">
.my-table{
  position: relative;
  padding-bottom: 50px;
  .isHighlight{
    background-color: #FFEE7C;
  }
}

.table_height{
  min-height: 530px;
  /deep/ .el-table__body-wrapper {
    flex: 1;
    .el-table__empty-block {
      position: absolute;
    }
  }
}
.table_height_5 {
  min-height: 230px;
}
</style>
