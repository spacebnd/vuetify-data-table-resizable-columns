import type { DirectiveOptions, VNode } from 'vue'
import type { DirectiveBinding } from 'vue/types/options'
import { Binding, DataTableContainer } from '@/lib/types'
import {
  drawColumnDividers,
  isDataTableElement,
  isMobile,
  removeDividersContainer,
  removeListeners,
  resizeObserverHandler,
} from '@/lib/functions'

const directive: DirectiveOptions = {
  inserted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (!isDataTableElement(el)) {
      console.error('no v-data-table')
    } else if (isMobile(el)) {
      console.error('mobile')
    } else {
      const observer: ResizeObserver = new ResizeObserver(
        resizeObserverHandler.bind(null, <Binding>binding, vnode)
      )
      observer.observe(el)
    }
  },

  update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void {
    if (binding.value === true) {
      if (isMobile(el)) {
        removeDividersContainer(<DataTableContainer>el)
        removeListeners(<DataTableContainer>el)
      } else {
        drawColumnDividers(<DataTableContainer>el, <Binding>binding, vnode)
      }

      const propertyName = <string>binding.expression
      const component = <any>vnode.context
      component[propertyName] = false
    }
  },

  unbind(el: HTMLElement): void {
    removeDividersContainer(<DataTableContainer>el)
    removeListeners(<DataTableContainer>el)
  },
}

export default directive
