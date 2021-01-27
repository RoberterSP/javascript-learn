import Component from './DYTag'

Component.install = (Vue) => {
  Vue.component(Component.name, Component)
}

export default Component
