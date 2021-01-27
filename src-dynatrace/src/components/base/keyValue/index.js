import Component from './KeyValue'

Component.install = (Vue) => {
  Vue.component(Component.name, Component)
}

export default Component
