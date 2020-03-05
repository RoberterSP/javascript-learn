<template>
  <div class="json-editor">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
var isJSON = require('is-json')
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
/* eslint-disable */
export default {
  name: 'jsonEditor',
  data() {
    return {
      jsonEditor: false
    }
  },
  props: ['value'],
  watch: {
    value(value) {
      const editor_value = this.jsonEditor.getValue()
      if (value !== editor_value) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      matchBrackets: true,
      styleActiveLine: true,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true,
      matchBrackets: true,//匹配括号
      autoRefresh: true
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      console.log('tag', isJSON((cm.getValue(),true)))
      let str = JSON.stringify(cm.getValue())
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style scoped>
.json-editor{
  height: 100%;
  position: relative;
  max-height: 500px;
  overflow-y: auto;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}
.json-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
