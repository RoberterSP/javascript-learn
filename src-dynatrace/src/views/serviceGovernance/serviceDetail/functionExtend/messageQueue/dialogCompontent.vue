<template>
  <DYPopover :show.sync="_visible" width="320">

    <slot name="reference" slot="reference"></slot>

    <div class="pb10">
      <div class="popper-title mb20">
        <span>标签队列</span>
      </div>

      <el-form ref="form" :model="editTagsForm" label-width="120px" size="small">
        <div class="items flex-center tags-title">
          <span class="pl10 tag-left">标签名称</span>
          <span class="tag-right">最大进程数</span>
        </div>
        <div class="items items-list flex-center" v-for="(item,index) in _list" :key="index">
          <span class="pl10 tag-left">{{item.tag_name}}</span>
          <span class="tag-right">
            <el-input-number v-if="isEdit" v-model="item.process_num" :min="0" size="small"></el-input-number>
            <template v-else>{{item.process_num}}</template>
          </span>
        </div>
      </el-form>

      <div v-if="isEdit" class="popper-footer">
        <el-divider></el-divider>
        <div class="flex-end">
          <DYButtonGroup>
            <DYButton theme="dark" type="primary" @click="save">确定</DYButton>
            <DYButton theme="dark" @click="cancel">取消</DYButton>
          </DYButtonGroup>
        </div>
      </div>
    </div>
  </DYPopover>

</template>
<script>

export default {
  components: {},
  props: ['isEdit', 'workerProcessTagList', 'dialogFormTagsVisible'],
  data () {
    return {
      editTagsForm: {}
    }
  },
  computed: {
    _visible: {
      get () {
        return this.dialogFormTagsVisible
      },
      set (val) {
        // 通知父级
        this.$emit('update:dialogFormTagsVisible', val)
      }
    },
    _list: {
      get () {
        return this.workerProcessTagList
      }
    }
  },
  methods: {
    // 编辑标签
    cancel () {
      this.editTagsForm = {}
      this._visible = false
    },
    // 保存标签
    save () {
      this.$emit('save', this._list)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "~common/style/variable";

  .popper-title {
    padding: 9px 0;
  }

  .popper-footer {
    text-align: right;
  }

  .items {
    margin-bottom: 9px;

    .tag-left {
      flex: 1;
    }

    .tag-right {
      flex: 1;
      text-align: center;
    }

    &-list {
      padding: 9px 0;
    }

    &-list:nth-child(2n+1) {
      background-color: @default-font-color;
    }
  }

  .tags-title {
    padding-top: 5px;
  }

  /*}*/
</style>
