import Component from './DYCard'
import MiniCard from './DYMiniCard'

Component.install = (Vue) => {
  Vue.component(Component.name, Component)
}

MiniCard.install = (Vue) => {
  Vue.component(MiniCard.name, MiniCard)
}

export default Component

export {MiniCard}