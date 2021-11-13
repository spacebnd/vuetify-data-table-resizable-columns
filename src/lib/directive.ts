import type { DirectiveOptions, VNode } from 'vue'
import type { DirectiveBinding } from 'vue/types/options'
import { Binding, DataTableContainer, UserOption } from '@/lib/types'
import { setIsDebug } from '@/lib/constants'
import {
  isDataTableElement,
  isMobile,
  resizeObserverHandler,
  drawColumnDividers,
  removeDividersContainer,
  removeListeners,
  showMessage,
} from '@/lib/functions'

const directive: DirectiveOptions = {
  inserted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    const userOption: UserOption = binding.value

    if (userOption === 'debug') {
      setIsDebug(true)
    }

    showMessage('info', 'Inserted', false)

    if (!isDataTableElement(el)) {
      showMessage('error', 'Directive should be applied to the v-data-table component', true)
    } else if (isMobile(el)) {
      showMessage('error', 'Directive is for desktop only', false)
    } else {
      const observer: ResizeObserver = new ResizeObserver(
        resizeObserverHandler.bind(null, <Binding>binding, vnode)
      )
      showMessage('info', 'Observing started...', false)
      observer.observe(el)
    }
  },

  update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode): void {
    const userOption: UserOption = binding.value

    if (userOption === 'redraw') {
      if (isMobile(el)) {
        removeDividersContainer(<DataTableContainer>el)
        removeListeners(<DataTableContainer>el)
      } else {
        drawColumnDividers(<DataTableContainer>el, <Binding>binding, vnode)
      }

      const propertyName = <string>binding.expression
      const component = <any>vnode.context
      component[propertyName] = null
    }
  },

  unbind(el: HTMLElement): void {
    removeDividersContainer(<DataTableContainer>el)
    removeListeners(<DataTableContainer>el)
  },
}

export default directive
