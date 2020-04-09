<template>
  <div class="editPanel" :class="{create:!ruleForm.id}">
    <!-- 表单 -->
    <el-form class="default-width" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>

      <el-form-item label="标识" prop="code">
        <el-input v-model="ruleForm.code" :disabled="!!ruleForm.id" placeholder="请输入标识"></el-input>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-input type="number" v-model="ruleForm.priority" min=0 placeholder="请输入优先级"></el-input>
      </el-form-item>

      <el-form-item label="流量过滤">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.match_type"
          placeholder="请选择过滤类型" clearable>
          <el-option
            v-for="item in match_types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="moreDiv pl10 pr10 mb16" v-if="ruleForm.match_type==='headers'">
        <div class="headLine flex-start">
          <div class="line_l">键</div>
          <div class="line_r">值</div>
        </div>
        <div class="bodyLine">
          <div class="line_l">
            <el-form-item prop="match_tag_name">
              <el-input v-model="ruleForm.match_tag_name" placeholder="请输入键"></el-input>
            </el-form-item>
          </div>
          <div class="line_r">
            <el-form-item prop="match_value">
              <el-input v-model="ruleForm.match_value" placeholder="请输入值"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item label="流量分配">
        <el-select
          style="width: 100%;"
          v-model="ruleForm.route_type"
          placeholder="请选择分配类型">
          <el-option
            v-for="item in route_types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="moreDiv pl10 pr10 mb16" v-if="ruleForm.route_type==='mesh_code'">
        <div class="headLine flex-start">
          <div class="line_l">服务</div>
        </div>
        <div class="bodyLine">
          <div class="line_l">
            <el-form-item prop="route_type" :class="[isSubmit&&!ruleForm.mesh_code?'is-error':'']">
              <el-select class="mesh-list" v-model="ruleForm.mesh_code" placeholder="请选择服务" >
                <el-option v-for="(item, index) in meshList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="moreDiv pl10 pr10 mb16 threeLine" v-if="ruleForm.route_type==='weight'">
        <div class="headLine flex-start">
          <div class="line_l">权重</div>
          <div class="line_r">服务</div>
        </div>
        <div class="bodyLine" style="flex-direction:column">
          <div class="flex-center item_line" v-for="(item, index) in ruleForm.weights" :key="index" >
            <div class="line_l flex-center">
              <span>将</span>
              <el-form-item>
                <div class="el-input">
                  <input type="text" class="el-input__inner" v-model="item.weight">
                </div>
              </el-form-item>
              <span style="white-space: nowrap;">%流量分配到</span>
              <el-form-item prop="route_type">
                <el-select v-model="item.mesh_code" placeholder="请选择服务" >
                  <el-option v-for="(item, index) in meshList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item>
              <DYButton :class="[index===0?'no_visible':'']" type="primary" @click="delDestinationKind(index)">
                 <DYIcon type="delete" size="14"></DYIcon>
              </DYButton>
            </el-form-item>
          </div>
          <div class="add-kind">
            <DYButton @click="addDestinationKind">添加</DYButton>
          </div>
        </div>
      </div>
      <div class="switch_form_item"><nt-switch :title="'激活路由规则'" v-model="ruleForm.state" @dyClick="switchChange"></nt-switch></div>
      <div class="btns" v-permission="'gatewayCenter_apiDetail_routeRule_add'" v-if="ruleForm.id">
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="resetForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
      <div class="btns" v-permission="'gatewayCenter_apiDetail_routeRule_edit'" v-else>
        <DYButtonGroup>
          <DYButton type="primary" @click="submitForm('ruleForm')">保存</DYButton>
          <DYButton @click="resetForm('ruleForm')">取消</DYButton>
        </DYButtonGroup>
      </div>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'

export default {
  data () {
    return {
      selectData: [],
      match_types: [{label: 'HTTP Header', value: 'headers'}],
      route_types: [{label: '按服务', value: 'mesh_code'}, {label: '按权重', value: 'weight'}],
      ruleForm: {
        name: '',
        code: '',
        priority: 10,
        state: false,
        match_type: '',
        route_type: 'mesh_code',
        weights: []
      },
      rules: {
        name: [
          { required: true, message: '路由名称不能为空！', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '路由标识不能为空！', trigger: 'blur' }
        ],
        match_tag_name: [
          { required: true, message: '键不能为空！', trigger: 'blur' }
        ],
        match_value: [
          { required: true, message: '值不能为空！', trigger: 'blur' }
        ]
      },
      isSubmit: false
    }
  },
  props: {
    a: String,
    editMode: {
      type: Boolean,
      default: false
    },
    clientDetails: {
      type: Object,
      default: () => {}
    },
    meshList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
  },
  methods: {
    switchChange () {
      this.ruleForm.state = !this.ruleForm.state
    },
    submitForm (formName) {
      this.isSubmit = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('saveContent', this.ruleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('cancelContent')
    },
    addDestinationKind () {
      this.ruleForm.weights.push({
        weight: '',
        mesh_code: ''
      })
    },
    delDestinationKind (idx) {
      this.ruleForm.weights.splice(idx, 1)
    }
  },
  mounted () {
    console.log('clientDetails', this.clientDetails)
    if (this.clientDetails) {
      this.ruleForm = JSON.parse(JSON.stringify(this.clientDetails))
    }
  },
  created () {
  },
  components: {
    ntSwitch
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.editPanel {
  &.create {
    background: rgba(242, 242, 242, 1);
  }
  .tilte {
    margin-bottom: 10px;
  }
  .eventTitle {
    font-size: 20px;
    font-weight: 500;
    line-height: 29px;
    margin-bottom: 26px;
  }
  .select {
    margin-bottom: 30px;
    width: @default-width;
  }
}

.moreDiv{
  // margin-bottom: 22px;
  // padding: 0 10px;
  user-select: none;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  background: #ffffff;
  .headLine{
    height:40px;
    background-color: @gray-01;
    display: flex;
    margin-top: 10px;
    .el-form-item__content{
      margin-left: 0 !important;
    }
    .line_l{
      width: 300px;
      padding-left: 30px;
    }
    .line_r{
      flex: 1;
    }
  }
  .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .bodyLine{
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    .el-form-item{
      margin-bottom: 0;
      &.flex-item{
        .el-form-item__content{
          display: flex;
        }
      }
    }
    .el-form-item__content{
      margin-left: 0 !important;
    }
    .line_l{
      flex: 1;
      margin-right: 10px;
      .el-form-item__content {
        display: flex;
      }
    }
    .line_r{
      flex: 1;
      margin-left: 10px;
    }
    .mesh-list {
      width: 225px;
    }
    .add-kind {
      margin-top: 10px;
    }
  }
  &.threeLine{
    .el-form-item .el-form-item__content{
      .el-input,.el-select{
        min-width: 60px;
      }
    }
    .headLine{
      .line_l,.line_c,.line_r{
        flex: 1;
        margin-right: 10px;
      }
    }
    .bodyLine{
      border: 0;
      margin-top: 0;
      .item_line {
        padding: 5px;
      }
      .line_l{
        .el-form-item .el-form-item__content{
          display: flex;
          .el-input{
            padding: 0 5px;
          }
        }
      }
      .line_l,.line_c,.line_r{
        flex: 1;
        margin-right: 10px;
      }
    }
  }
}
</style>

<style lang="less">
  .line_l{
    .el-form-item__content {
      display: flex;
    }
  }
</style>
