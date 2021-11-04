import { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

const resizableColumns: DirectiveOptions = {
  inserted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    console.log('inserted', el, binding, vnode)
  },

  update(el: HTMLElement, binding: DirectiveBinding): void {
    console.log('update', el, binding)
  },

  unbind(el: HTMLElement, binding: DirectiveBinding): void {
    console.log('unbind', el, binding)
  },
}

export default resizableColumns
