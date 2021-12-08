import type { DirectiveOptions, VNode } from 'vue'
import type { DirectiveBinding } from 'vue/types/options'
import { Binding, DataTableContainer, UserOption } from '@/lib/types'
import { setIsDebug } from '@/lib/constants'
import {
  isDataTableElement,
  isMobile,
  isDataTablePropsChanged,
  isDataTableReady,
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
    showMessage('info', `Environment: ${process.env}`, false)
    showMessage('info', 'Inserted', false)

    if (!isDataTableElement(el)) {
      showMessage('error', 'Directive should be applied to the v-data-table component', true)
      return
    }

    if (isMobile(el)) {
      showMessage('error', 'Directive is for desktop only', false)
      return
    }

    if (isDataTableReady(<DataTableContainer>el, vnode)) {
      drawColumnDividers(<DataTableContainer>el, <Binding>binding, vnode)
    }
  },

  update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void {
    const userOption: UserOption = binding.value
    const component = <any>vnode.context
    showMessage(
      'info',
      `VNode updated ${
        userOption && userOption !== 'debug' ? `with user option: ${userOption}` : ''
      }`,
      false
    )

    if (isMobile(el)) {
      removeDividersContainer(<DataTableContainer>el)
      removeListeners(<DataTableContainer>el)
      return
    }

    if (userOption === 'redraw') {
      drawColumnDividers(<DataTableContainer>el, <Binding>binding, vnode)
      const propertyName = <string>binding.expression
      component[propertyName] = null
      showMessage('info', 'User option reset')

      return
    }

    if (isDataTablePropsChanged(vnode, oldVnode)) {
      if (isDataTableReady(<DataTableContainer>el, vnode)) {
        showMessage('info', 'Data table props changed and data table is ready', false)
        drawColumnDividers(<DataTableContainer>el, <Binding>binding, vnode)
      } else {
        const observer: ResizeObserver = new ResizeObserver(
          resizeObserverHandler.bind(null, <Binding>binding, vnode)
        )
        showMessage('info', 'Observing started...', false)
        observer.observe(el)
      }
    }
  },

  unbind(el: HTMLElement): void {
    removeDividersContainer(<DataTableContainer>el)
    removeListeners(<DataTableContainer>el)
  },
}

export default directive
