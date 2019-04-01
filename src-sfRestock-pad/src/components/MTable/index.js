import MTable from './MTable.vue'
import Vue from 'vue'

MTable.install = function (Vue) {
  Vue.component(MTable.name, MTable)
}

Vue.use(MTable)
