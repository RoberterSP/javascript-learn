import Component from './DYButton'
import DYButtonGroup from './DYButtonGroup'

Component.install = (Vue) => {
  Vue.component(Component.name, Component)
}

DYButtonGroup.install = (Vue) => {
  Vue.component(DYButtonGroup.name, DYButtonGroup)
}

export default Component

export {DYButtonGroup}
