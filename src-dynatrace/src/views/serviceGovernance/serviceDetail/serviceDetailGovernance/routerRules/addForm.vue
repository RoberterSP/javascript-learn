<template>
  <div class="add-router-rule-container">
    <el-form label-position="top" label-width="80px" ref="addForm" :model="editRouterRuleData" :rules="addFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="editRouterRuleData.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="code">
        <el-input v-model="editRouterRuleData.code" placeholder="请输入标识" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="优先级">
        <!-- <el-input v-model="editRouterRuleData.priority" v-onlyNumber></el-input> -->
        <input class="el-input__inner" type="number" v-model="editRouterRuleData.priority" min=0 placeholder="请输入优先级">
      </el-form-item>
      <el-form-item label="路由流量过滤" prop="match_type">
        <el-select v-model="editRouterRuleData.match_type" placeholder="请选择路由流量过滤类型" @change="matchTypeChange">
          <el-option v-for="(item, index) in streamPlaceList" :key="index" :label="item.label"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前缀" prop="match_value" ref="match_value" v-if="editRouterRuleData.match_type === 'prefix'"
                    :rules="[{ required: true, message: '请输入前缀', trigger: 'blur' }]">
        <el-input v-model="editRouterRuleData.match_value"></el-input>
      </el-form-item>
      <el-form-item label="API接口" prop="match_endpoint" ref="match_endpoint"
                    v-if="editRouterRuleData.match_type === 'endpoint'"
                    :rules="[{ required: true, message: '请选择API接口', trigger: 'change' }]">
        <el-select v-model="editRouterRuleData.match_endpoint" placeholder="请选择" multiple>
          <el-option v-for="(item, index) in apiList" :key="index" :label="item.endpoint"
                     :value="item.endpoint"></el-option>
        </el-select>
      </el-form-item>

      <!-- 不是必填 -->
      <el-form-item label="高级过滤" prop="match_tag_type">
        <el-select v-model="editRouterRuleData.match_tag_type" clearable placeholder="请选择高级过滤类型" @change="matchTagTypeChange">
          <el-option v-for="(item, index) in originPlaceList" :key="index" :label="item.label"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>

      <div class="moreDiv" v-if="editRouterRuleData.match_tag_type" style="margin-bottom: 20px;">
        <div v-if="originPlaceObj[editRouterRuleData.match_tag_type] && !!editRouterRuleData.match_tag.length"
             style="line-height:20px;">{{editRouterRuleData.match_tag_type.replace(/^\S/, s => s.toUpperCase())
          }}
        </div>
        <div class="line-item" v-for="(item, index) in editRouterRuleData.match_tag" :key="index">
          <div class="line_l">
            <el-form-item label="">
              <el-input v-model="item.key" placeholder="键"></el-input>
            </el-form-item>
          </div>
          <div class="line_c">
            <el-form-item label="">&nbsp;：</el-form-item>
          </div>
          <div class="line_r">
            <el-form-item label="">
              <el-input v-model="item.value" placeholder="值"></el-input>
            </el-form-item>
          </div>
          <div class="ml10 title">
            <el-form-item label="">
              <img src="@/assets/image/icon-delete.svg" alt="" @click="delMatchTag(index)">
            </el-form-item>
          </div>
        </div>
        <el-button type="primary" @click="addMatchTag">添加</el-button>
      </div>

      <!--  -->
      <el-form-item label="路由流量分配" prop="destination">
        <el-select v-model="editRouterRuleData.destination" placeholder="请选择路由流量分配类型" @change="destinationChange">
          <el-option v-for="(item, index) in destinationList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <div class="moreDiv flex" v-if="editRouterRuleData.destination==='1'">
        <div class="line-item" style="align-items: flex-start;">
          <div class="line_l" style="margin-right: 20px;">
            <el-form-item label="" prop="route_type"
                          :class="[isSubmit&&!editRouterRuleData.route_type&&editRouterRuleData.destination==='1'?'is-error':'']">
              <el-select v-model="editRouterRuleData.route_type" placeholder="请选择标签类型" @input="updateChangeChangeTag">
                <el-option v-for="(item, index) in destination_deploy_group_code" :key="index" :label="item.name"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="line_r" v-if="destination_deploy_group_code_tag === 'deploy_group_code'">
            <el-form-item label="" ref="deploy_group_codeNode" prop="route_value"
                          :class="[isSubmit&&!editRouterRuleData.route_value&&editRouterRuleData.destination==='1'?'is-error':'']">
              <el-select v-model="editRouterRuleData.route_value" placeholder="请选择部署组" clearable
                         @input="updateChange">
                <span v-for="(item, index) in deploy_groups" :key="index">
                  <el-option :label="item.name" :value="item.code"
                             v-if="item.code !== editRouterRuleData.mirror_cluster_value  || !editRouterRuleData.mirror_enable_status"></el-option>
                </span>
              </el-select>
            </el-form-item>
          </div>
          <div class="line_r" v-if="destination_deploy_group_code_tag === 'tag_code'">
            <el-form-item label="" ref="tag_codeNode" prop="route_value"
                          :class="[isSubmit&&!editRouterRuleData.route_value&&editRouterRuleData.destination==='1'?'is-error':'']">
              <el-select v-model="editRouterRuleData.route_value" placeholder="请选择节点标签" clearable @input="updateChange">
                <span v-for="(item, index) in node_tags" :key="index">
                  <el-option :label="item.name" :value="item.code"
                             v-if="item.code !== editRouterRuleData.mirror_cluster_value"></el-option>
                </span>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="moreDiv" v-if="editRouterRuleData.destination==='0'">
        <!-- 按权重 -->
        <el-form-item label="类别值" prop="weightTags" :rules="[{ required: true, message: '请选择类别值', trigger: 'change' }]">
          <el-select v-model="editRouterRuleData.weightTags" placeholder="请选择类别值" clearable @input="weightTagsChange"
                     multiple>
            <span v-for="(item, index) in deploy_groups" :key="index">
              <el-option :label="item.name" :value="item.code"
                         v-if="item.code !== editRouterRuleData.mirror_cluster_value  || !editRouterRuleData.mirror_enable_status"></el-option>
            </span>
          </el-select>
          <div class="weight_item_div">
            <div class="threshold-head flex" v-if="weights.length">
              <div>类别值</div>
              <div>权重</div>
            </div>
            <div class="el-form-item" style="margin-top: -8px;margin-bottom: 20px;" v-if="weightErrorLabel">
              <div class="el-form-item__content">
                <div class="el-form-item__error">
                  {{weightErrorLabel}}
                </div>
              </div>
            </div>
            <div class="weight_item" v-for="(item, index) in weights" :key="index">
              <div class="move-box2">
                <div class="left-box">{{item.route_value}}</div>
                <div class="progress-per">
                  <ntSlider
                    v-model="item.weight"
                    show-input
                    :show-input-controls="false"
                    :marks="marks2"
                    :format-tooltip="formatTooltip2"
                    start-tooltip="bottom"
                    :resident-tooltip="true"
                    :tooltip-class="'custom-tooltip'"
                    demonstration="%"
                  >
                  </ntSlider>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="超时时间" prop="timeout">
        <div class="move-box2" style="min-height: 70px;">
          <div class="progress-per">
            <ntSlider
              v-model="editRouterRuleData.timeout"
              show-input
              :max="marks1.max"
              :show-input-controls="false"
              :marks="marks1"
              :format-tooltip="formatTooltip1"
              start-tooltip="bottom"
              :resident-tooltip="true"
              :tooltip-class="'custom-tooltip'"
              demonstration="秒"
            >
            </ntSlider>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="">
        <nt-switch :title="'启用自动重试'" v-model="editRouterRuleData.retry_enable_status"
                   @dyClick="editRouterRuleData.retry_enable_status=!editRouterRuleData.retry_enable_status"></nt-switch>
      </el-form-item>
      <div class="moreDiv" v-show="editRouterRuleData.retry_enable_status">
        <el-form-item label="重试依据" v-show="editRouterRuleData.retry_enable_status">
          <div class="dy-checkbox">
            <div class="checkbox-item" v-for="(item, index) in retry_enable_arr" v-bind:key="index">
              <label :for="item.value">
                <span class="sf-checkbox__input" :class="[item.checked?'is-checked':'']">
                  <span class="sf-checkbox__inner">
                    <img src="~@/assets/image/dynatrace/icon_checkbox__inner_checked.svg" alt="" v-if="item.checked"/>
                    <img src="~@/assets/image/dynatrace/icon_checkbox__inner.svg" alt="" v-else/>
                  </span>
                  <input type="checkbox" v-model="item.checked" :id="item.value" @change="retry_enable_checkboxChange"/>
                </span>
                <span class="sf-checkbox__label">{{item.label}}</span>
              </label>
              <!-- 只有 retriable-status-codes 才有-->
              <el-form-item label="" prop="retriable_status_codes" ref="retriable_status_codes"
                            v-if="item.value === 'retriable-status-codes' && item.checked"
                            :rules="[{ required: true, message: '请输入指定状态码' }]" style="padding-left: 35px;">
                <div class="sim" style="margin-bottom: 7px;">
                  <div style="line-height:25px;">指定状态码</div>
                  <div class="sf-tagsinput">
                    <div class="tagsinput_values">
                    <span class="tag_item" v-for="(item, index) in editRouterRuleData.retriable_status_codes"
                          :key="index">
                      <span class="tag_val" v-if="item||item==0">{{item}}</span>
                      <span class="tags_remove" v-if="item||item==0" @click="removeTag(index)"><i
                        class="el-icon-close"></i></span>
                    </span>
                      <div class="tagsinput_input">
                        <input ref="tags_input" class="tags_input" type="text" placeholder="请输入状态码回车结束" size="11"
                               @keyup.enter="tagsInputkeyupEnter($event)" v-onlyNumber>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="重试次数">
          <div class="move-box2" style="min-height: 70px;">
            <div class="progress-per">
              <ntSlider
                v-model="editRouterRuleData.retry_nums"
                show-input
                :max="marks3.max"
                :show-input-controls="false"
                :marks="marks3"
                :format-tooltip="formatTooltip3"
                class="format_width"
                start-tooltip="bottom"
                :resident-tooltip="true"
                :tooltip-class="'custom-tooltip'"
                demonstration="次"
              >
              </ntSlider>

            </div>
          </div>
        </el-form-item>
        <el-form-item label="单次超时时间">
          <div class="move-box2" style="min-height: 70px;">
            <div class="progress-per">
              <ntSlider
                v-model="editRouterRuleData.per_try_timeout"
                show-input
                :max="marks1.max"
                :show-input-controls="false"
                :marks="marks1"
                :format-tooltip="formatTooltip1"
                class="format_width"
                start-tooltip="bottom"
                :resident-tooltip="true"
                :tooltip-class="'custom-tooltip'"
                demonstration="秒"
              >
              </ntSlider>
            </div>
          </div>
        </el-form-item>
      </div>

      <el-form-item label="">
        <nt-switch :title="'启用流量镜像'" v-model="editRouterRuleData.mirror_enable_status"
                   @dyClick="editRouterRuleData.mirror_enable_status=!editRouterRuleData.mirror_enable_status"></nt-switch>
      </el-form-item>
      <el-form-item label="镜像目的地" v-if="editRouterRuleData.mirror_enable_status">
        <div class="moreDiv" v-if="editRouterRuleData.mirror_enable_status">
          <div class="line-item" style="align-items: flex-start;">
            <div class="line_l" style="margin-right: 20px;">
              <el-form-item label="" prop="mirror_cluster_type"
                            :rules="[{ required: true, message: '请选择镜像目的地类型', trigger: 'change' }]">
                <el-select v-model="editRouterRuleData.mirror_cluster_type" placeholder="请选择镜像目的地类型"
                           @input="updateChangeChangeTagMirror">
                  <el-option v-for="(item, index) in destination_deploy_group_code" :key="index" :label="item.name"
                             :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="line_r" v-if="destination_deploy_group_code_tag_mirror === 'deploy_group_code'">
              <el-form-item label="" prop="mirror_cluster_value" ref="deploy_group_code_cluster_value"
                            :rules="[{ required: true, message: '请选择部署组', trigger: 'change' }]">
                <el-select v-model="editRouterRuleData.mirror_cluster_value" placeholder="请选择部署组" clearable
                           @input="updateChangeMirror">
                  <span v-for="(item, index) in deploy_groups" :key="index">
                    <el-option :label="item.name" :value="item.code"
                               v-if="item.code !== editRouterRuleData.route_value"></el-option>
                  </span>
                </el-select>
              </el-form-item>
            </div>
            <div class="line_r" v-if="destination_deploy_group_code_tag_mirror === 'tag_code'">
              <el-form-item label="" prop="mirror_cluster_value" ref="tag_code_cluster_value"
                            :rules="[{ required: true, message: '请选择节点标签', trigger: 'change' }]">
                <el-select v-model="editRouterRuleData.mirror_cluster_value" placeholder="请选择节点标签" clearable
                           @input="updateChangeMirror">
                  <span v-for="(item, index) in node_tags" :key="index">
                    <el-option :label="item.name" :value="item.code"
                               v-if="item.code !== editRouterRuleData.route_value"></el-option>
                  </span>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="镜像百分比" prop="mirror_percentage" v-if="editRouterRuleData.mirror_enable_status">
        <div class="move-box2" style="min-height: 70px;">
          <div class="progress-per">
            <ntSlider
              v-model="editRouterRuleData.mirror_percentage"
              show-input
              :max="marks2.max"
              :show-input-controls="false"
              :marks="marks2"
              :format-tooltip="formatTooltip2"
              class="format_width"
              start-tooltip="bottom"
              :resident-tooltip="true"
              :tooltip-class="'custom-tooltip'"
              demonstration="%"
            >
            </ntSlider>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="请求头添加规则">
        <div class="moreDiv">
          <div class="line-item" v-for="(item, index) in editRouterRuleData.request_headers_to_add" :key="index">
            <div class="line_l">
              <el-form-item label="">
                <el-input v-model="item.key" placeholder="键"></el-input>
              </el-form-item>
            </div>
            <div class="line_c">
              <el-form-item label="">&nbsp;：</el-form-item>
            </div>
            <div class="line_r">
              <el-form-item label="">
                <el-input v-model="item.value" placeholder="值"></el-input>
              </el-form-item>
            </div>
            <div class="title" style="padding: 0 10px">
              <img src="@/assets/image/icon-delete.svg" alt="" @click="deleteLine(index, 'request_headers_to_add')">
            </div>
          </div>
          <el-button type="primary" @click="addRequestHeaders">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item label="返回头添加规则">
        <div class="moreDiv">
          <div class="line-item" v-for="(item, index) in editRouterRuleData.response_headers_to_add" :key="index">
            <div class="line_l">
              <el-form-item label="">
                <el-input v-model="item.key" placeholder="键"></el-input>
              </el-form-item>
            </div>
            <div class="line_c">
              <el-form-item label="">&nbsp;：</el-form-item>
            </div>
            <div class="line_r">
              <el-form-item label="">
                <el-input v-model="item.value" placeholder="值"></el-input>
              </el-form-item>
            </div>
            <div class="title" style="padding: 0 10px">
              <img src="@/assets/image/icon-delete.svg" alt="" @click="deleteLine(index, 'response_headers_to_add')">
            </div>
          </div>
          <el-button type="primary" @click="addResponseHeaders">添加</el-button>
        </div>
      </el-form-item>

      <el-form-item label="">
        <nt-switch :title="'激活路由规则'" v-model="editRouterRuleData.state"
                   @dyClick="editRouterRuleData.state=!editRouterRuleData.state"></nt-switch>
        <!-- <div class="desc default-label">这里是说明文字说明文字文字说明文字说明文字说明文字说明文字说明文字说明文字说明文字</div> -->
      </el-form-item>
      <div v-permission="'serviceCenter_serviceDetail_routeRuleList_edit'">
        <!--  :disabled="!clientDetails.name || !clientDetails.service_name || !clientDetails.domain_name" -->
        <el-button
          type="primary"
          @click="saveForm('addForm')">保存
        </el-button>
        <el-button @click="cancelForm('addForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import ntSwitch from 'components/base/switch.vue'
import ntSlider from 'components/base/slider/slider.vue'

  import {MESH_DEPLOY_GROUP_LIST, MESH_ENDPOINT_LIST, NODE_TAG_LIST} from '@/api'
  import {PAGESIZE} from '@/common/util/common.js'

  export default {
    name: 'addRouterRulesForm',
    props: {
      isAdd: {
        required: false,
        type: Boolean,
        default: false
      },
      clientDetails: {
        required: true,
        type: Object,
        default: () => {
          return {
            name: '',
            service_name: '',
            domain_name: ''
          }
        }
      }
    },
    data () {
      return {
        weightErrorLabel: false,
        editRouterRuleData: {
          name: '',
          code: '',
          originPlace: '', // 路由标签
          match_type: 'prefix', // 路由来源地流量类型
          match_endpoint: [], // 可以添加多个API路由
          match_value: '/',
          match_tag_type: 'headers', // 路由来源地标签类型
          match_tag: [{
            key: '',
            value: ''
          }],
          state: false,
          weightTags: [],
          mirror_cluster_value: '',
          destination: null,
          route_type: '',
          route_value: '',
          timeout: 0, // 超时时间
          mirror_percentage: 0,
          retry_enable_status: true, // 自动重试
          mirror_enable_status: false, // 镜像路由
          retry_on: [], // 重试依据
          retriable_status_codes: [], // 指定状态码
          retry_nums: 0, // 重试次数
          per_try_timeout: 0, // 单次超时时间
          request_headers_to_add: [], // 请求头添加规则
          response_headers_to_add: [] // 返回头添加规则
        },
        addFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入标识', trigger: 'blur'},
            {pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: '以字母开头,只能输入字母,数字或者空格'}
          ],
          destination: [
            {required: true, message: '请选择路由流量分配类型', trigger: 'change'}
          ],
          match_type: [
            {required: true, message: '请选择路由流量过滤类型', trigger: 'change'}
          ],
          weight: [
            {required: true, message: '请输入权重', trigger: 'blur'}
          ],
          route_type: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          route_value: [
            {required: true, message: '请选择部署组', trigger: 'change'}
          ],
          timeout: [
            {required: true, message: '请输入超时时间', trigger: 'change'},
            {pattern: /^[0-9]*$/, message: '只能输入正整数'}
          ]
        },
        // apiList
        apiList: [],
        // 路由目的地 list（按权重）
        weights: [],
        // 部署组列表
        deploy_groups: [],
        // 节点组列表
        node_tags: [],
        // 路由来源地流量类型 match_type
        streamPlaceList: [{
          label: '按前缀',
          code: 'prefix'
        }, {
          label: '按接口',
          code: 'endpoint'
        }],
        retry_enable_arr: [{
          label: 'retriable-status-codes',
          value: 'retriable-status-codes',
          checked: false
        }, {
          label: 'refused-stream',
          value: 'refused-stream',
          checked: false
        }, {
          label: 'retriable-4xx',
          value: 'rretriable-4xx',
          checked: false
        }, {
          label: 'connect-failure',
          value: 'connect-failure',
          checked: false
        }, {
          label: 'gateway-error',
          value: 'gateway-error',
          checked: false
        }, {
          label: '5xx',
          value: '5xx',
          checked: false
        }],
        // 高级过滤 (路由来源地标签) match_tag_type
        originPlaceObj: {
          'headers': 'HTTP Header',
          'query_parameters': 'HTTP Query Parameters'
        },
        originPlaceList: [{
          label: 'HTTP Header',
          code: 'headers'
        }, {
          label: 'HTTP Query Parameters',
          code: 'query_parameters'
        }],
        destination_deploy_group_code: [{
          code: 'deploy_group_code',
          name: '部署组'
        }, {
          code: 'tag_code',
          name: '节点标签'
        }],
        destination_deploy_group_code_tag: 'deploy_group_code',
        destination_deploy_group_code_tag_mirror: 'deploy_group_code',
        destinationList: [{
          label: '按权重',
          value: '0'
        }, {
          label: '按类型',
          value: '1'
        }],
        isSubmit: false,
        marks1: {0: '0秒', 120: '120秒', 'max': 120},
        marks2: {0: '0%', 100: '100%', 'max': 100},
        marks3: {0: '0次', 10: '10次', 'max': 10}
      }
    },
    methods: {
      formatTooltip1 (val) {
        return `${val}秒`
      },
      formatTooltip2 (val) {
        return `${val}%`
      },
      formatTooltip3 (val) {
        return `${val}次`
      },
      // 数字input的change事件
      numberInputChange (val, index, type) {
        let that = this
        switch (type) {
          case 'timeout':
            that.editRouterRuleData.timeout = that.editRouterRuleData.timeout.replace(/[^\d]/g, '')
            if (that.editRouterRuleData.timeout > 120) {
              that.editRouterRuleData.timeout = 120
            }
            break
          case 'mirror_percentage':
            that.editRouterRuleData.mirror_percentage = that.editRouterRuleData.mirror_percentage.replace(/[^\d]/g, '')
            if (that.editRouterRuleData.mirror_percentage > 100) {
              that.editRouterRuleData.mirror_percentage = 100
            }
            break
          case 'weight':
            that.weights[index].weight = that.weights[index].weight.replace(/[^\d]/g, '')
            if (that.weights[index].weight > 100) {
              that.weights[index].weight = 100
            }
            break
          case 'retry_nums':
            that.editRouterRuleData.retry_nums = that.editRouterRuleData.retry_nums.replace(/[^\d]/g, '')
            if (that.editRouterRuleData.retry_nums > 10) {
              that.editRouterRuleData.retry_nums = 10
            }
            break
          case 'per_try_timeout':
            that.editRouterRuleData.per_try_timeout = that.editRouterRuleData.per_try_timeout.replace(/[^\d]/g, '')
            if (that.editRouterRuleData.per_try_timeout > 120) {
              that.editRouterRuleData.per_try_timeout = 120
            }
            break
        }
      },
      // 路由目的地为 按权重时 weight   部署组不可重复 isRepeat
      checkWeightGroupFunc () {
        let bol = true
        let conpareArr = JSON.parse(JSON.stringify(this.weights))
        this.weights.forEach((data1, index1) => {
          conpareArr.forEach((data2, index2) => {
            if (data1.route_value === data2.route_value && index1 !== index2) {
              data1.isRepeat = true
              bol = false
              this.$forceUpdate()
            }
          })
        })
        if (!bol) {
          this.weightErrorLabel = '权重类型的部署组不可重复选择，是唯一的'
          // this.$message({
          //   message: '权重类型的部署组不可重复选择，是唯一的',
          //   type: 'error'
          // })
        }
        return bol
      },
      check_submit () {
        // 判断来源地 有没有写
        let bol = this.editRouterRuleData.destination
        let result = true
        switch (bol) {
          case '0':
            // 权重
            if (this.checkWeightGroupFunc()) {
              if (this.weights.length) {
                let weight_total = 0
                this.weights.forEach(data => {
                  weight_total = Number(data.weight) + weight_total
                  if ((!data.weight && data.weight !== 0) || !data.route_type || !data.route_value) {
                    result = false
                  }
                })
                // console.log('weight_total', weight_total)
                if (weight_total !== 100) {
                  result = false
                  this.weightErrorLabel = '权重总和应为100'
                  // this.$message({
                  //   message: '权重总和应为100',
                  //   type: 'error'
                  // })
                  return
                }
              } else {
                result = false
              }
            } else {
              result = false
              return
            }
            break
          case '1':
            // // 系统标签
            // if (!this.editRouterRuleData.route_type || !this.editRouterRuleData.route_value) {
            //   result = false
            // }
            break
        }
        if (!result) {
          // this.$message({
          //   message: '请填写页面必要信息',
          //   type: 'error'
          // })
        }
        return result
      },
      // 新增 保存
      saveForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.check_submit()) {
            let postData = {
              name: this.editRouterRuleData.name,
              code: this.editRouterRuleData.code,
              mesh_code: this.editRouterRuleData.mesh_code
            }
            if (this.editRouterRuleData.destination === '0') {
              // 按权重
              if (this.weights.length) {
                postData.weights = this.weights
                postData.route_type = 'weight'
                postData.weights.forEach(data => {
                  delete data.isRepeat
                })
                delete postData.route_value
              }
            } else if (this.editRouterRuleData.destination === '1') {
              postData.route_type = this.editRouterRuleData.route_type
              postData.route_value = this.editRouterRuleData.route_value
              postData.weights = this.weights
              postData.weights[0].route_value = postData.route_value
            }
            postData.weights.forEach(data => {
              data.weight = parseFloat(data.weight)
            })
            postData.priority = Number(this.editRouterRuleData.priority)
            postData.match_type = this.editRouterRuleData.match_type
            if (this.editRouterRuleData.match_type === 'prefix') {
              postData.match_value = this.editRouterRuleData.match_value
            } else if (this.editRouterRuleData.match_type === 'endpoint') {
              postData.match_endpoint = this.editRouterRuleData.match_endpoint
            }
            if (this.editRouterRuleData.match_tag_type) {
              postData.match_tag_type = this.editRouterRuleData.match_tag_type
              postData.match_tag = this.editRouterRuleData.match_tag
            }

            // 镜像路由
            postData.mirror_enable_status = this.editRouterRuleData.mirror_enable_status
            if (postData.mirror_enable_status) {
              postData.mirror_cluster_type = this.editRouterRuleData.mirror_cluster_type
              postData.mirror_cluster_value = this.editRouterRuleData.mirror_cluster_value
              postData.mirror_percentage = Number(this.editRouterRuleData.mirror_percentage)
              // if (!this.editRouterRuleData.mirror_cluster_type) {
              //   this.$message({
              //     message: '请填写路由镜像',
              //     type: 'error'
              //   })
              //   return false
              // }
            }
            // 超时时间
            postData.timeout = this.editRouterRuleData.timeout
            postData.retry_enable_status = this.editRouterRuleData.retry_enable_status
            if (this.editRouterRuleData.retry_enable_status) {
              postData.retry_on = this.editRouterRuleData.retry_on
              postData.retriable_status_codes = this.editRouterRuleData.retriable_status_codes
              // if (this.editRouterRuleData.retry_on.indexOf('retriable-status-codes') > -1) {
              //   if (!this.editRouterRuleData.retriable_status_codes.length) {
              //     this.$message({
              //       message: '请填写指定状态码',
              //       type: 'error'
              //     })
              //     return false
              //   }
              // }
              postData.retry_nums = this.editRouterRuleData.retry_nums
              postData.per_try_timeout = this.editRouterRuleData.per_try_timeout
            }
            // 激活路由规则
            postData.state = this.editRouterRuleData.state
            // 请求头添加规则
            if (this.editRouterRuleData.request_headers_to_add) {
              postData.request_headers_to_add = this.editRouterRuleData.request_headers_to_add
            }
            // 返回头添加规则
            if (this.editRouterRuleData.response_headers_to_add) {
              postData.response_headers_to_add = this.editRouterRuleData.response_headers_to_add
            }
            console.log('postData', postData)
            if (this.isAdd) { // 是新增
              this.$emit('saveForm', postData)
            } else {
              postData.route_rule_id = this.editRouterRuleData.id
              this.$emit('saveContent', postData)
            }
            this.$refs[formName].resetFields()
          } else {
            return false
          }
        })
      },
      cancelForm (formName) {
        this.$emit('cancelForm')
        this.$refs[formName].resetFields()
        this.retry_enable_arr.forEach(ele => {
          ele.checked = false
        })
        if (!this.isAdd) {
          this.$emit('cancelContent')
        }
      },
      // 路由流量过滤 select change 事件   match_type
      matchTypeChange (val) {
        this.editRouterRuleData.match_endpoint = []
        this.editRouterRuleData.match_value = '/'
        // setTimeout(() => {
        this.$refs['match_value'] && this.$refs['match_value'].resetField()
        this.$refs['match_endpoint'] && this.$refs['match_endpoint'].resetField()
        // }, 300)
        this.$forceUpdate()
      },
      // 高级过滤 select change 事件  （match_tag_type）
      matchTagTypeChange (val) {
        this.editRouterRuleData.match_tag = [{
          key: '',
          value: ''
        }]
        this.$forceUpdate()
      },
      // 添加系统标签
      addMatchTag () {
        // 如果目前标签都有值，才可以添加新的标签
        this.editRouterRuleData.match_tag.every(item => !!item.key && !!item.value) && this.editRouterRuleData.match_tag.push({
          key: '',
          value: ''
        })
      },
      // 删除某项系统标签
      delMatchTag (index) {
        this.editRouterRuleData.match_tag.splice(index, 1)
      },
      // 路源目的地 select change事件
      destinationChange (val) {
        this.isSubmit = false
        // this.editRouterRuleData.destination = val
        // console.log('cdsjk', val, this.editRouterRuleData.destination)
        switch (val) {
          case '0':
            this.editRouterRuleData.route_type = 'weight'
            this.destination_deploy_group_code_tag = 'deploy_group_code'
            this.weights = []

            break
          case '1':
            this.editRouterRuleData.route_type = this.destination_deploy_group_code[0].code
            this.editRouterRuleData.route_value = ''
            this.destination_deploy_group_code_tag = 'deploy_group_code'
            this.weights = [
              {
                route_type: this.destination_deploy_group_code[0].code,
                route_value: '',
                weight: 100
              }
            ]
            break
          default:
            this.editRouterRuleData.route_type = ''
            this.editRouterRuleData.route_value = ''
            this.destination_deploy_group_code_tag = ''
            this.weights = []
        }

        this.$forceUpdate()

        // this.weights = [{
        //   route_type: 'deploy_group_code',
        //   route_value: 'df-product-dev',
        //   weight: 30
        // }, {
        //   route_type: 'deploy_group_code',
        //   route_value: 'df-product-dev',
        //   weight: 50
        // }]
      },
      updateChange (val) {
      },
      // 此处是被覆盖的代码
      // updateChangeChange (val) {
      //   if (this.destination_deploy_group_code_tag !== val) {
      //     this.destination_deploy_group_code_tag = val
      //     this.weights.map((item) => {
      //       item.route_type = val
      //       item.route_value = ''
      //     })
      //     this.$forceUpdate()
      //   }
      // },
      // ee
      updateChangeChangeTag (val) {
        this.destination_deploy_group_code_tag = val
        this.weights.map((item) => {
          item.route_type = val
        })
        this.editRouterRuleData.route_value = ''

        this.$refs.deploy_group_codeNode && this.$refs.deploy_group_codeNode.clearValidate()
        this.$refs.tag_codeNode && this.$refs.tag_codeNode.clearValidate()

        this.$forceUpdate()
      },
      // 权重 input change
      weightTagsChange (val) {
        let weights = []
        this.editRouterRuleData.weightTags.forEach(ele => {
          let findObj = this.weights.find(row => ele === row.route_value)
          if (findObj) {
            weights.push(findObj)
          } else {
            weights.push({
              route_type: 'deploy_group_code',
              route_value: ele,
              weight: 0
            })
          }
        })
        this.weights = weights
      },
      // 自动重试 switch
      dySwitchClick () {
      },
      retry_enable_checkboxChange (val) {
        this.editRouterRuleData.retry_on = []
        this.retry_enable_arr.forEach(ele => {
          if (ele.checked) {
            this.editRouterRuleData.retry_on.push(ele.value)
          }
        })
      },
      // 状态码tagsInput
      tagsInputkeyupEnter (event) {
        let value = JSON.parse(JSON.stringify(event.target.value))
        if (!this.editRouterRuleData.retriable_status_codes.length) {
          this.$refs['retriable_status_codes'][0].resetField()
        }
        event.target.value = ''
        if (value && this.editRouterRuleData.retriable_status_codes.indexOf(value) < 0) {
          this.editRouterRuleData.retriable_status_codes.push(value)
        }
      },
      removeTag (index) {
        this.editRouterRuleData.retriable_status_codes.splice(index, 1)
      },
      // 更新镜像
      updateChangeChangeTagMirror (val) {
        this.destination_deploy_group_code_tag_mirror = val
        this.editRouterRuleData.mirror_cluster_value = ''

        // clearValidate 即可， 不用restFiled ，restField 函数处理逻辑较多
        this.$refs['deploy_group_code_cluster_value'] && this.$refs['deploy_group_code_cluster_value'].clearValidate()
        this.$refs['tag_code_cluster_value'] && this.$refs['tag_code_cluster_value'].clearValidate()
        // setTimeout(() => {
        //
        // }, 300)

        this.$forceUpdate()
      },
      updateChangeMirror (val) {
        if (val) {
          this.editRouterRuleData.mirror_cluster_value = val
        }
      },
      // 请求头、返回头规则 的删除
      deleteLine (index, type) {
        this.editRouterRuleData[type].splice(index, 1)
      },
      // 添加请求头
      addRequestHeaders () {
        this.editRouterRuleData.request_headers_to_add.every(item => item.key && item.value) && this.editRouterRuleData.request_headers_to_add.push({
          key: '',
          value: ''
        })
      },
      // 添加返回头
      addResponseHeaders () {
        this.editRouterRuleData.response_headers_to_add.every(item => item.key && item.value) && this.editRouterRuleData.response_headers_to_add.push({
          key: '',
          value: ''
        })
      },
      // api接口
      api_list () {
        let _data = {
          mesh_code: this.editRouterRuleData.mesh_code,
          page: 1,
          page_size: PAGESIZE
        }
        MESH_ENDPOINT_LIST(_data).then(res => {
          if (res.code === 0) {
            this.apiList = res.data.endpoints
          }
        })
      },
      // 获取节点列表
      node_tag_list () {
        let _data = {
          mesh_code: this.editRouterRuleData.mesh_code,
          page: 1,
          page_size: PAGESIZE
        }
        NODE_TAG_LIST(_data).then(res => {
          if (res.code === 0) {
            this.node_tags = res.data.node_tags
          }
        })
      },
      // 获取部署组列表
      mesh_deploy_list_get () {
        let _data = {
          mesh_code: this.editRouterRuleData.mesh_code,
          page: 1,
          page_size: PAGESIZE
        }
        MESH_DEPLOY_GROUP_LIST(_data).then(res => {
          if (res.code === 0) {
            this.deploy_groups = res.data.deploy_groups
          }
        })
      }
    },
    mounted () {
    },
    created () {
      let editRouterRuleData = JSON.parse(JSON.stringify(this.clientDetails))
      // 重试依据 重置
      this.retry_enable_arr.forEach(ele => {
        ele.checked = false
      })
      editRouterRuleData.weightTags = []
      if (this.isAdd) {
        this.weights = []
      } else {
        editRouterRuleData.match_values = []
        this.weights = editRouterRuleData.weights
        if (this.weights.length) {
          this.weights.forEach(ele => {
            editRouterRuleData.weightTags.push(ele.route_value)
          })
        }
        if (editRouterRuleData.match_type === 'endpoint') {
          if (editRouterRuleData.match_value) {
            let arr = editRouterRuleData.match_value.split(',')
            if (arr && arr.length > 0) {
              editRouterRuleData.match_values = []
              arr.forEach((item) => {
                editRouterRuleData.match_values.push({value: item})
              })
            }
          }
        }
        if (editRouterRuleData.retry_on && editRouterRuleData.retry_on.length) {
          this.retry_enable_arr.forEach(ele => {
            if (editRouterRuleData.retry_on.indexOf(ele.value) > -1) {
              ele.checked = true
            } else {
              ele.checked = false
            }
          })
        }
        // if (editRouterRuleData.match_tag_type === 'headers') { // 路由来源地 -- 系统标签
        //   editRouterRuleData.originPlace = 'system'
        // } else if (editRouterRuleData.match_tag_type === 'query_parameters') { // 路由来源地 -- 自定义标签
        //   editRouterRuleData.originPlace = 'custom'
        // }
        if (editRouterRuleData.route_type === 'weight') {
          // 按权重
          editRouterRuleData.destination = '0'
        } else {
          editRouterRuleData.destination = '1'
        }
      }
      this.destination_deploy_group_code_tag = (editRouterRuleData.weights && editRouterRuleData.weights.length && editRouterRuleData.weights[0].route_type) || 'deploy_group_code'
      this.editRouterRuleData = editRouterRuleData
      console.log('this.editRouterRuleData', this.editRouterRuleData)

      this.api_list()
      // 获取该部署组列表 下拉框
      this.mesh_deploy_list_get()
      // 获取节点组列表 下拉框
      this.node_tag_list()
    },
    watch: {
      'weights': {
        handler: function () {
          this.weightErrorLabel = ''
        },
        deep: true
      }
    },
    components: {
      ntSwitch,
      ntSlider
    }
  }
</script>
<style lang="less" scoped>
  @import "~common/style/variable";

  .line-minus {
    cursor: pointer;
    color: @theme-color;
  }

  .add-router-rule-container {
    .el-form {
      max-width: 600px;

      .el-select {
        width: 100%;
      }

      .moreDiv {
        .line_l, .line_r {
          flex: 1;
          max-width: 195px;
        }

        .line-item {
          width: 100%;
          display: flex;
          align-items: center;
        }
      }
    }

    .el-form-item.is-error {
      margin-bottom: 37px;
    }

    .input-right.el-input__inner {
      text-align: right;
    }

    .threshold-head {
      div {
        &:nth-child(1) {
          min-width: 150px;
        }

        &:nth-child(2) {
          flex: 1;
          margin-left: 10px;
        }
      }
    }
  }
</style>
