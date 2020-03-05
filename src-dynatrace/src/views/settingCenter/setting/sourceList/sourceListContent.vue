<template>
  <div class="strategyContent ptb16 pl12 pr16">
    <el-form
      class="default-width"
      ref="diagform"
      :rules="rules"
      label-position="top"
      :model="menu_info">
      <el-form-item label="上级">
        <el-cascader
          class="default-width"
          v-model="menu_info.superiorItem"
          :options="tableListData"
          @change="handleChange"
          :props="{ checkStrictly: true, value: 'id', label: 'label',emitPath: false }"
          :show-all-levels="false"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item v-if="create" class="mt37" label="标识" prop="code">
        <el-input v-model.trim="menu_info.code" placeholder="请输入标识" :disabled="menu_info.id !== -1" clearable validate-event></el-input>
      </el-form-item>
      <el-form-item v-else class="mt37" label="标识" prop="code">
        <el-input v-model.trim="menu_info.code" placeholder="请输入标识" clearable></el-input>
      </el-form-item>
      <el-form-item class="mt37" label="标题" prop="label">
        <el-input v-model.trim="menu_info.label" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item class="mt37" label="路由标识" v-if="menu_info.type==='page' || menu_info.type === 'menu'" prop="name">
        <el-input v-model.trim="menu_info.name" placeholder="请输入路由标识" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item class="mt37" label="组件"  v-if="menu_info.type==='page' || menu_info.type === 'menu'">
        <el-input v-model.trim="menu_info.component" placeholder="请输入组件" clearable></el-input>
      </el-form-item>
      <el-form-item class="mt37" label="组件路径"  v-if="menu_info.type==='page' || menu_info.type === 'menu'">
        <el-input v-model.trim="menu_info.component_path" placeholder="请输入组件路径" clearable></el-input>
      </el-form-item> -->
      <el-form-item class="mt37" label="类型" prop="type">
        <el-select v-model="menu_info.type" placeholder="请选择类型" @change="menuInfoTypeChange">
          <el-option
            v-for="item in menu_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-show="create" label="是否显示" prop="state">
        <el-select v-model="menu_info.state" placeholder="请选择是否显示">
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="排序" prop="sort">
        <el-input-number :min="1" v-model="menu_info.sort" step-strictly></el-input-number>
      </el-form-item>
      <el-button type="primary" @click="saveMenu('diagform')">确 定</el-button>
      <el-button @click="resetForm('diagform')">取 消</el-button>
    </el-form>
  </div>
</template>

<script>
import ntSwitch from 'components/base/switch.vue'
import { AUTH_SOURCE_LIST_GET, NXMC_AUTH_RESOURCE_UPLOAD, NXMC_AUTH_RESOURCE_UPDATE } from '@/api'
// import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'
export default {
  data () {
    return {
      tableListData: [],
      menu_info: {
        id: -1,
        code: '',
        name: '',
        label: '',
        // component: '',
        // component_path: '',
        sort: 10,
        type: 'page',
        state: true,
        superiorItem: [] // 添加编辑时，上级对应数据
      },
      stateList: [{
        value: true,
        label: '显示'
      },
      {
        value: false,
        label: '不显示'
      }],
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
      ],
      rules: {
        label: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        code: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入路由标识', trigger: 'blur' }],
        // component: [{ required: true, message: '请输入组件', trigger: 'blur' }],
        // component_path: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ]
        // state: [{required: true, message: '请选择是否显示', trigger: 'change'}]
      }
    }
  },
  props: {
    create: {
      type: Boolean,
      default: false
    },
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  methods: {
    setData (item) {
      // this.menu_info = JSON.parse(JSON.stringify(row))
      this.menu_info = JSON.parse(JSON.stringify(item))
      if (item.type === 'page' || item.type === 'menu') {
        this.rules.name = { required: true, message: '请输入路由标识', trigger: 'blur' }
        // this.rules.component = { required: true, message: '请输入组件', trigger: 'blur' }
        // this.rules.component_path = { required: true, message: '请输入组件路径', trigger: 'blur' }
      } else {
        // delete this.rules.component_path
        // delete this.rules.component
        delete this.rules.name
      }
      this.menu_info.superiorItem = this.findParents(
        this.tableListData,
        item.id
      )
    },
    findParents (array, id) {
      let stack = []
      let going = true

      let walker = (array, id) => {
        array.forEach(item => {
          if (!going) return
          stack.push(item.id)
          if (item.id === id) {
            going = false
          } else if (item['children']) {
            walker(item['children'], id)
          } else {
            stack.pop()
          }
        })
        if (going) stack.pop()
      }
      walker(array, id)
      stack.pop()
      console.log(stack)
      return stack
    },
    // 资源标签类型 change
    menuInfoTypeChange (val) {
      if (val === 'page' || val === 'menu') {
        this.rules.name = { required: true, message: '请输入路由标识', trigger: 'blur' }
        // this.rules.component = { required: true, message: '请输入组件', trigger: 'blur' }
        // this.rules.component_path = { required: true, message: '请输入组件路径', trigger: 'blur' }
      } else {
        // delete this.rules.component_path
        // delete this.rules.component
        delete this.rules.name
      }
    },
    handleChange (value) {
      let _value = value || 0
      console.log('value', value)
      console.log(this.tableListData)
      this.menu_info.superiorItem = [_value]
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('close')
    },
    saveMenu (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            parent_id: this.menu_info.superiorItem[this.menu_info.superiorItem.length - 1] || 0,
            title: this.menu_info.label,
            code: this.menu_info.code,
            type: this.menu_info.type,
            state: this.menu_info.state,
            // component: this.menu_info.component,
            // component_path: this.menu_info.component_path,
            sort: parseInt(this.menu_info.sort)
          }
          if (this.menu_info.type === 'page' || this.menu_info.type === 'menu') {
            data.name = this.menu_info.name
          }
          if (this.menu_info.id === -1) {
            NXMC_AUTH_RESOURCE_UPLOAD(data).then(res => {
              if (res.code === 0) {
                this.$emit('refresh')
                // this.$message({
                //   showClose: true,
                //   offset: 70,
                //   type: 'success',
                //   message: '添加成功!'
                // })
                bus.$emit('openMessage', {
                  message: '添加成功！',
                  type: 'success'
                })
              }
            })
          } else {
            data.resource_id = this.menu_info.id
            NXMC_AUTH_RESOURCE_UPDATE(data).then(res => {
              if (res.code === 0) {
                this.$emit('refresh')
                // this.$message({message: '编辑成功!'})
                bus.$emit('openMessage', {
                  message: '编辑成功！',
                  type: 'success'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 接口调用方法
    resource_list_get () {
      var data = {}
      AUTH_SOURCE_LIST_GET(data).then(res => {
        if (res.code === 0) {
          this.tableListData = res.data.resource_list
        }
      })
    }
  },
  mounted () {
  },
  created () {
    this.resource_list_get()
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

.w425 {
  width: 42.5%;
}
.w45 {
  width: 45%;
}
// .mt37 {
//   margin-top: 37px;
// }
</style>
