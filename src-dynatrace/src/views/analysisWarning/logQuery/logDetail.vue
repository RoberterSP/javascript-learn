<template>
  <div class="log_detail">
    <div class="item">
      <div class="file_item" v-for="item in formData" :key="item.key">
        <div class="file_key">{{item.key}}</div>
        <div class="file_value" v-html="item.value"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    clientDetails: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      formData: []
    }
  },
  computed: {},
  methods: {},
  mounted () {
    Object.keys(this.clientDetails).forEach(key => {
      if (key !== 'log_content') {
        this.formData.push({
          key,
          value: this.clientDetails[key]
        })
      }
    })
  },
  created () {
  },
  components: {}
}
</script>
<style scoped lang="less">
  @import "~common/style/variable";

  .log_detail {
    background: rgba(255, 255, 255, 1);

    .item {
      .file_item {
        display: flex;
        align-items: center;
        padding: 6px 0 6px 12px;

        .file_key {
          width: 230px;
        }

        .file_value {
          word-break: break-word;
          flex: 1;
          word-break: break-word;
        }
      }
    }
  }
</style>
