import Button, {DYButtonGroup} from './button/index'
import Icon from './icon'
import Alert from './alert'
import Card, {MiniCard} from './card'
import Header, {PageHeader} from './header'
import LeftMenu, {LeftMenuSecond} from './menu'
import SplitTitle from './splitTitle'
import KeyValue from './keyValue'
import Layout from './layout'
import List from './list'
import Tag from './tag'
import Tabs from './tabs'
import ConfirmationDialog, {MiniConfirmationDialog} from './dialog'
import Popover from './popover'
import Filter from './filter'

// 指令形式的
import Toast from './toast'

const components = {
  Button,
  DYButtonGroup,
  Icon,
  Alert,
  Header,
  PageHeader,
  Filter,
  Popover,

  // 这两个应该属于业务组件， 他们抽象出来的 menu 才属于基础组件
  LeftMenuSecond,
  LeftMenu,
  //

  Card,
  SplitTitle,
  KeyValue,
  Layout,
  MiniCard,
  List,
  Tag,
  Tabs,
  ConfirmationDialog,
  MiniConfirmationDialog
}

const install = function (Vue) {
  // 安装组件
  Object.values(components).forEach(component => {
    Vue.component(component.name, component)
  })

  // 安装插件
  Vue.use(Toast)
}

export default {
  install,
  ...components
}
