import ConfirmationDialog from './DYConfirmationDialog'

import MiniConfirmationDialog from './DYMiniConfirmationDialog'

ConfirmationDialog.install = (Vue) => {
  Vue.component(ConfirmationDialog.name, ConfirmationDialog)
}

MiniConfirmationDialog.install = (Vue) => {
  Vue.component(MiniConfirmationDialog.name, MiniConfirmationDialog)
}

export default ConfirmationDialog

export {
  MiniConfirmationDialog
}
