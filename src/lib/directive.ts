import type { DirectiveOptions as DirectiveOptionsVue2 } from '@/lib/types/vue2/index'
import type { VNode as VNodeVue2 } from '@/lib/types/vue2/vnode'
import type {
  DirectiveBinding as DirectiveBindingVue3,
  ObjectDirective as DirectiveOptionsVue3,
  VNode as VNodeVue3,
} from '@/lib/types/vue3/runtime-core'
import type { DataTableContainer, DirectiveBindingVue2, UserOption } from '@/lib/types/common'
import { setIsDebug, VUE_VERSION } from '@/lib/constants'
import {
  drawColumnDividers,
  getComponentInstance,
  getDirectiveHookNames,
  getUserOptionPropertyName,
  getUserOptionValue,
  isDataTableElement,
  isDataTablePropsChanged,
  isDataTableReady,
  isMobile,
  removeDividersContainer,
  removeListeners,
  resizeObserverHandler,
  showMessage,
} from '@/lib/functions'

const hookNames = getDirectiveHookNames()

const directive: DirectiveOptionsVue2 | DirectiveOptionsVue3 = {
  [hookNames.mounted](
    el: HTMLElement,
    binding: DirectiveBindingVue2 | DirectiveBindingVue3,
    vnode: VNodeVue2 | VNodeVue3
  ) {
    const userOption: UserOption = getUserOptionValue(binding)
    if (userOption === 'debug') {
      setIsDebug(true)
    }

    showMessage(
      'info',
      `Environment: ${JSON.stringify(process.env)}. Vue version: ${VUE_VERSION}`,
      false
    )
    showMessage('info', hookNames.mounted, false)

    if (!isDataTableElement(el)) {
      showMessage('error', 'Directive should be applied to the v-data-table component', true)
      return
    }

    if (isMobile(el)) {
      showMessage('error', 'Directive is for desktop only', false)
      return
    }

    if (isDataTableReady(<DataTableContainer>el, vnode)) {
      drawColumnDividers(
        <DataTableContainer>el,
        <DirectiveBindingVue2 | DirectiveBindingVue3>binding,
        vnode
      )
    }
  },

  [hookNames.updated](
    el: HTMLElement,
    binding: DirectiveBindingVue2 | DirectiveBindingVue3,
    vnode: VNodeVue2 | VNodeVue3,
    oldVnode: VNodeVue2 | VNodeVue3
  ): void {
    const userOption: UserOption = getUserOptionValue(binding)
    const component = getComponentInstance(binding, vnode)
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
      drawColumnDividers(
        <DataTableContainer>el,
        <DirectiveBindingVue2 | DirectiveBindingVue3>binding,
        vnode
      )
      const propertyName = <string>getUserOptionPropertyName(binding)
      component[propertyName] = null
      showMessage('info', 'User option reset')

      return
    }

    if (isDataTablePropsChanged(vnode, oldVnode)) {
      if (isDataTableReady(<DataTableContainer>el, vnode)) {
        showMessage('info', 'Data table props changed and data table is ready', false)
        drawColumnDividers(
          <DataTableContainer>el,
          <DirectiveBindingVue2 | DirectiveBindingVue3>binding,
          vnode
        )
      } else {
        const observer: ResizeObserver = new ResizeObserver(
          resizeObserverHandler.bind(
            null,
            <DirectiveBindingVue2 | DirectiveBindingVue3>binding,
            vnode
          )
        )
        showMessage('info', 'Observing started...', false)
        observer.observe(el)
      }
    }
  },

  [hookNames.unmounted](el: HTMLElement): void {
    removeDividersContainer(<DataTableContainer>el)
    removeListeners(<DataTableContainer>el)
  },
}

export default directive
