<template>
  <div class="p10">
    <DYHeader title="Sidecar配置调试" type="small" no-gap />
    <div class="flex-between mid">
      <div>
        <span class="server">配置类型:</span>
        <el-select @change="util_envoy_config_info" class="time" v-model="config.config_type" style="margin-left: 25px;width: 100px;" placeholder="请选择">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <DYButton @click="update" type="primary" class="ml10">刷新全部</DYButton>
      </div>
      <div>
        <span class="server">服务:</span>
        <el-select @change="util_envoy_config_info" v-model="config.mesh_code" placeholder="请选择">
          <el-option
            v-for="item in meshList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        <DYButton @click="save" class="mr10" type="primary" :disabled="saveBtnDisabled">保存</DYButton>
      </div>
    </div>
    <div class="sideContain">
      <el-form ref="diagform" :model="envoy_config" label-width="100px" size="small" label-position='left'>
        <!-- <el-form-item style="width: 425px;" label="配置版本: " prop="version" :rules="[{ required: true, message: '配置版本不能为空'}]">
          <el-input v-model="envoy_config.version" @input="saveBtnDisabled = false"></el-input>
        </el-form-item> -->
        <el-form-item label="配置详情: " style="min-height: 300px;max-height:600px;overflow-y:auto;" :rules="[{ required: true, message: '配置详情不能为空'}]">
          <div class="editor-container" style="width: 100%;">
            <json-editor ref="jsonEditor" v-model="envoy_config.config"  @changed="onJsonCodeChange"/>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { NXMC_MESH_LIST_GET, UTIL_ENVOY_CONFIG_INFO, ENVOY_CONFIG_EDIT, ENVOY_CONFIG_UPDATE } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import JsonEditor from '@/components/JsonEditor'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      // 保存按钮 默认置灰
      saveBtnDisabled: true,
      isFirst: true,
      init_envoy_config: {},
      meshList: [],
      config: {
        mesh_code: '',
        config_type: 'LDS'
      },
      yaml: '',
      timeOptions: [{
        label: 'LDS',
        value: 'LDS'
      }, {
        label: 'CDS',
        value: 'CDS'
      }, {
        label: 'EDS',
        value: 'EDS'
      }, {
        label: 'RDS',
        value: 'RDS'
      }],
      optionsMesh: [],
      app_id: '',
      envoy_config: {
        version: '',
        config: ''
      },
      type: 'text',
      copyVal: {
        version: '',
        config: ''
      }
    }
  },
  computed: {},
  methods: {
    update () {
      this.envoy_config_update({config_type: this.config.config_type})
    },
    save () {
      let data = {
        version: this.envoy_config.version,
        config: JSON.parse(this.envoy_config.config),
        mesh_code: this.config.mesh_code,
        config_type: this.config.config_type
      }
      this.envoy_config_edit(data)
    },
    mesh_list_get (data) {
      NXMC_MESH_LIST_GET(data).then(res => {
        this.meshList = res.data.mesh_list
        this.config.mesh_code = this.meshList[0].code
        this.util_envoy_config_info(true)
      })
    },
    onJsonCodeChange (str) {
      if (!this.isFirst) {
        this.saveBtnDisabled = false
      }
      this.isFirst = false
      if (typeof str === 'string') {
        try {
          // var obj = JSON.parse(str)
          this.yaml = ''
          return true
        } catch (error) {
          this.yaml = error.message
        }
      }
    },
    util_envoy_config_info (isInit) {
      UTIL_ENVOY_CONFIG_INFO(this.config).then(res => {
        this.envoy_config = res.data.envoy_config
        this.envoy_config.config = JSON.parse(res.data.envoy_config.config)
        if (!isInit) {
          this.saveBtnDisabled = false
        }
      })
    },
    envoy_config_edit (data) {
      ENVOY_CONFIG_EDIT(data).then(res => {
        // this.$message({ message: '成功!' })
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    },
    envoy_config_update (data) {
      ENVOY_CONFIG_UPDATE(data).then(res => {
        // this.$message({ message: '成功!' })
        bus.$emit('openMessage', {
          message: res.data.result,
          type: 'success'
        })
      })
    }
  },
  mounted () {},
  created () {
    this.mesh_list_get({
      page: 1,
      page_size: PAGESIZE
    })
  },
  components: {
    JsonEditor
  }
}
</script>
<style scoped lang="less">
@import "~common/style/variable";

.mid {
  margin-top: 27px;
  .server {
    margin-right: 10px;
  }
  .time {
    margin-right: 10px;
  }
}
.sideContain {
  margin-top: 40px;
}
</style>
