<template>
  <div class="flex-between dy-header" :class="{'no-gap': noGap, 'dy-header--small': type === 'small' }">
    <div class="dy-header-title flex-start">
      <DYIcon :type="icon" size="50" v-if="icon" class="dy-header-icon"></DYIcon>

      <div class="dy-header-title-box">
        <div v-if="!editMode" class="flex-between">
          <div class="title-content">
            <h1 v-if="type === 'default'" class="ellipsis title-name">{{title}}</h1>
            <h2 v-else class="ellipsis title-name">{{title}}</h2>

            <span @click="edit" v-if="editIcon" class="icon-edit cursor-pointer" v-permission="editPermission">
              <DYIcon type="edit" size="24"></DYIcon>
            </span>
          </div>

          <span class="ml30" v-if="$slots.actions">
            <slot name="actions"></slot>
          </span>
        </div>

        <div class="nt-input" v-else>
          <nt-input
            ref="name"
            :value="title"
            @delete="editMode = false"
            @save="save"
          ></nt-input>
        </div>

        <div class="title-bottom" v-if="subTitle">
          {{subTitle}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ntInput from 'components/base/input.vue'

export default {
  name: 'DYHeader',
  components: {
    ntInput
  },
  data () {
    return {
      editMode: false
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    icon: String,
    editIcon: Boolean,
    editPermission: String,
    actionsWidth: String | Number,

    // 在一些地方可能不需要边距， 完全由外部控制，比如 card 中
    noGap: {
      type: Boolean,
      default: false
    },

    // 类型， 如果是small， 用小一号的字体
    type: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    edit () {
      this.editMode = true
      this.$nextTick(() => {
        this.$refs.name.focus()
        this.$refs.name.select()
      })
    },
    save (value) {
      this.editMode = false
      this.$emit('save', value)
    }
  }
}
</script>

<style scoped lang="less">
  @import "~common/style/variable";

  .nt-input {
    width: 400px;
  }

  .icon-edit {
    color: @turq-06;
  }

  .dy-header:not(.no-gap) {
    padding: 16px;
  }

  .dy-header-icon {
    margin: 0 7px 0 5px;
  }

  .dy-header-title {
    width: 100%;

    .dy-header-title-box {
      width: 100%;

      .title-content {
        flex: 1;
        width: 0;
        display: flex;
        align-items: center;
      }

      .title-name {
        display: inline-block;
      }

      .title-bottom {
        display: block;
        color: #454646;
      }
    }
  }

</style>
