import Vue from 'vue'
import Main from './DYToast.vue'
import {clone, has, isFunction, isString} from 'lodash'

export const TYPES = ['success', 'warning', 'info', 'error']

export function isVNode (node) {
  return node !== null && typeof node === 'object' && has(node, 'componentOptions')
}

let MessageConstructor = Vue.extend(Main)

const gap = 24
let instance
let instances = []
let seed = 1
let zIndex = 999

const Message = (options) => {
  let myOptions = clone(options) || {}

  if (isString(options)) {
    myOptions = {
      message: myOptions
    }
  }
  let userOnClose = myOptions.onClose

  let id = 'toast_' + seed++

  myOptions.onClose = () => {
    Message.close(id, userOnClose)
  }

  instance = new MessageConstructor({
    data: myOptions
  })

  instance.id = id

  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }

  instance.$mount()

  document.body.appendChild(instance.$el)

  let verticalOffset = myOptions.offset || gap

  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + gap
  })
  instance.verticalOffset = verticalOffset
  instance.visible = true

  instance.$el.style.zIndex = zIndex++

  instances.push(instance)

  return instance
}

TYPES.forEach(type => {
  Message[type] = options => {
    let myOptions = clone(options)

    if (isString(myOptions)) {
      myOptions = {
        message: myOptions
      }
    }
    myOptions.type = type
    return Message(myOptions)
  }
})

Message.close = (id, userOnClose) => {
  let len = instances.length
  let index = -1
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      index = i
      if (isFunction(userOnClose)) {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return
  const removedHeight = instances[index].$el.offsetHeight
  for (let i = index; i < len - 1; i++) {
    let dom = instances[i].$el

    dom.style.bottom = parseInt(dom.style.bottom, 10) - removedHeight - gap + 'px'
  }
}

Message.closeAll = () => {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default {
  install () {
    Vue.prototype.$toast = Message
  }
}
