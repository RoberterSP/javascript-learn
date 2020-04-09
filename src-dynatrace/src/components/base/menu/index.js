import Component from './DYLeftMenu'
import LeftMenuSecond from './DYLeftMenuSecond'

// 安装LeftMenuSecond
LeftMenuSecond.install = (Vue) => {
  Vue.component(LeftMenuSecond.name, LeftMenuSecond)
}

Component.install = (Vue) => {
  Vue.component(Component.name, Component)
}

export default Component
export {LeftMenuSecond}
