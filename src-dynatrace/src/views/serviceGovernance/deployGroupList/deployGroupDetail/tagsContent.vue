<template>
  <div class="editPanel">
    <p class="default-label mb10">添加标签</p>
    <div  v-permission= "'serviceCenter_deployGroupDetail_nodeDetail_tagAdd'">
    <el-select @change="change" v-model="tags" multiple placeholder="请选择">
      <el-option
        v-for="item in tagList"
        :key="'taglist' + item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button @click="add" type="primary">添加</el-button>
    </div>
    <p class="default-label mt20">已添加标签</p>
    <div class="mt10">
      <el-tag
        @close="close(tag, index)"
        v-for="(tag, index) in addedTags"
        :key="'tag' + index"
        closable
        type="info">
        {{tag.name}}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { NXMC_SETTING_TAG_LIST_GET, NODE_TAG_POST } from '@/api'
import { PAGESIZE } from 'common/util/common.js'
import bus from '@/assets/eventBus.js'

export default {
  data () {
    return {
      tagList: [],
      addedTags: [],
      tags: [],
      wholeList: [],
      choosed: []
    }
  },
  props: {
    clientDetails: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  methods: {
    change (item) {
      this.choosed = []
      item.map(id => {
        this.tagList.map(tag => {
          if (tag.id === id) {
            this.choosed.push(tag)
          }
        })
      })
    },
    add () {
      let data = {
        tags: [],
        node_id: this.clientDetails.id,
        deploy_group_code: this.$route.params.code
      }
      this.addedTags.map(item => {
        data.tags.push(item.id)
      })
      data.tags = [...data.tags, ...this.tags]
      this.node_tag_post(data)
    },
    close (val, index) {
      this.addedTags.splice(index, 1)
      this.add()
    },
    tag_list_get () {
      NXMC_SETTING_TAG_LIST_GET({page_size: PAGESIZE, page: 1}).then(res => {
        this.wholeList = res.data.tags
        this.dealTags()
      })
    },
    dealTags () {
      this.tagList = []
      this.wholeList.map(resTag => {
        let shouldPush = true
        this.addedTags.map(item => {
          if (item.id === resTag.id) shouldPush = false
        })
        if (shouldPush) {
          this.tagList.push(resTag)
        }
      })
    },
    node_tag_post (data) {
      NODE_TAG_POST(data).then(res => {
        this.addedTags = [...this.addedTags, ...this.choosed]
        this.tags = []
        this.choosed = []
        this.dealTags()
        let data = {
          list: this.addedTags,
          id: this.clientDetails.id
        }
        bus.$emit('refreshNodeList', data)
      })
    }
  },
  mounted () {},
  created () {
    this.addedTags = this.clientDetails.tags
    this.tag_list_get()
  },
  components: {
  }
}
</script>

<style scoped lang="less">
@import "~common/style/variable";

@default-width: 425px;
.default-width {
  width: @default-width;
}

.mt-23 {
  margin-top: 23px;
}
.mt-47 {
  margin-top: 47px;
}
.mb-37 {
  margin-bottom: 37px;
}
.mb-30 {
  margin-bottom: 30px;
}

.editPanel {
  .tilte {
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
    margin-bottom: 10px;
  }
  .eventTitle {
    font-family: @default-font;
    font-size: 20px;
    color: @default-font-color;
    font-weight: 500;
    line-height: 29px;
    margin-bottom: 26px;
  }
  .eventSubTitle {
    font-family: @default-font;
    font-size: @default-font-size;
    color: @default-font-color;
    font-weight: @default-font-weight;
    line-height: @default-line-height;
    margin-bottom: 28px;
  }
  .headerList {
    margin-bottom: 42px;
    .header {
      margin-bottom: 4px;
      .headTitle {
        width: 107px;
      }
      .headmid {
        width: 14px;
        margin-left: 17px;
        margin-right: 9px;
      }
      .headBody {
        width: 238px;
      }
      img {
        width: 12px;
        height: 12px;
        margin-left: 14px;
        cursor: pointer;
      }
    }
  }
  .select {
    margin-bottom: 30px;
    width: @default-width;
  }
}
</style>
