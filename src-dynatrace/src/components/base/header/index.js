import Component from './DYHeader'
import PageHeader from './DYPageHeader'

Component.install = (Vue) => {
  Vue.component(Component.name, Component)
}

// 安装pageHeader
PageHeader.install = (Vue) => {
  Vue.component(PageHeader.name, PageHeader)
}

export default Component

export {PageHeader}
