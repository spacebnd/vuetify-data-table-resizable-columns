import { DEFAULT_HEADER_MIN_WIDTH, INDENT_TO_NATIVE_VUETIFY_DIVIDER } from '@/lib/constants'
import type { VNode } from 'vue'
import type {
  Binding,
  Controller,
  ControllerInstance,
  DataTableContainer,
  DataTableHeader,
  DataTableProps,
  Divider,
} from '@/lib/types'

// controller
export const generateController = (): ControllerInstance => {
  const template: Controller = {
    binding: null,
    vnode: null,
    dataTableContainer: null,
    dataTableHeaders: null,
    thsArray: null,
    dividersArray: null,
    isMoving: false,
    movingDividerIndex: 0,
    startPageXPosition: 0,
    movingTh: null,
    nextTh: null,
    startMovingThWidth: 0,
    nextThWidth: 0,
  }

  return new Map(Object.entries(template))
}

// core
export const resizeObserverHandler = (
  binding: Binding,
  vnode: VNode,
  entries: ResizeObserverEntry[],
  observer: ResizeObserver
): void => {
  const el = <DataTableContainer>entries[0].target

  if (isDataTableReady(el)) {
    drawColumnDividers(el, <Binding>binding, vnode)
    observer.disconnect()
  }
}

const generateAdditionalDataTableProps = (
  vnode: VNode,
  binding: Binding,
  controller: ControllerInstance
): void => {
  const thsArray = <HTMLTableHeaderCellElement[]>controller.get('thsArray')
  const dataTableHeaders = <DataTableHeader[]>controller.get('dataTableHeaders')

  const emptyColumnIndex: number = dataTableHeaders.findIndex(
    (header) => header.type === `${binding.rawName}_empty-column`
  )
  if (emptyColumnIndex !== -1) {
    dataTableHeaders.splice(emptyColumnIndex, 1)
  }

  dataTableHeaders.forEach((header: DataTableHeader, index: number) => {
    if (!header.width) {
      header.width = thsArray[index].offsetWidth
    } else if (typeof header.width === 'string') {
      header.width = +header.width
    }

    if (!header.minWidth) {
      header.minWidth = DEFAULT_HEADER_MIN_WIDTH
    } else if (typeof header.minWidth === 'string') {
      header.minWidth = +header.minWidth
    }

    if (typeof header.divider !== 'boolean') {
      header.divider = true
    }
  })

  dataTableHeaders.push({
    type: `${binding.rawName}_empty-column`,
    text: '',
    value: '',
    width: 'auto',
    sortable: false,
    divider: false,
  })
}

export const drawColumnDividers = (
  dataTableContainer: DataTableContainer,
  binding: Binding,
  vnode: VNode
): void => {
  removeDividersContainer(dataTableContainer)

  const tableWrapper = <HTMLDivElement>dataTableContainer.querySelector('.v-data-table__wrapper')
  const table = <HTMLTableElement>tableWrapper.querySelector('table')
  const thead = <HTMLTableSectionElement>dataTableContainer.querySelector('.v-data-table-header')
  const thsCollection: HTMLCollectionOf<HTMLTableHeaderCellElement> = thead.getElementsByTagName('th')
  const thsArray: HTMLTableHeaderCellElement[] = Array.from(thsCollection)
  const dividersContainer: HTMLDivElement = document.createElement('div')

  table.setAttribute('style', `position: relative; table-layout: fixed;`)
  dividersContainer.classList.add('resizable-columns-dividers-container')
  dividersContainer.setAttribute('style', `position: relative; width: ${dataTableContainer.offsetWidth}px;`)
  tableWrapper?.prepend(dividersContainer)

  const dataTableProps = <DataTableProps>vnode.componentOptions?.propsData
  const dataTableHeaders = <DataTableHeader[]>dataTableProps.headers

  const controller: ControllerInstance = generateController()
  controller.set('binding', binding)
  controller.set('vnode', vnode)
  controller.set('dataTableContainer', dataTableContainer)
  controller.set('dataTableHeaders', dataTableHeaders)
  controller.set('thsArray', thsArray)

  generateAdditionalDataTableProps(vnode, binding, controller)

  for (let index = 0; index < thsArray.length - 1; index++) {
    const nextTh: HTMLTableHeaderCellElement = thsArray[index + 1]
    const divider: Divider = document.createElement('div')
    divider.classList.add('resizable-columns-divider')
    const dividerBackgroundBox: HTMLDivElement = document.createElement('div')

    const dividerHeight = thead.offsetHeight + 'px'
    const dividerStep = nextTh.offsetLeft - INDENT_TO_NATIVE_VUETIFY_DIVIDER + 'px'
    divider.setAttribute(
      'style',
      `position: absolute; top: 0; left: ${dividerStep}; height: ${dividerHeight}; width: 20px; display: flex; justify-content: center; cursor: col-resize; z-index: 1;`
    )
    dividerBackgroundBox.setAttribute(
      'style',
      `width: 1px; height: 100%; background-color: rgba(128, 128, 128, 0.3)`
    )

    divider.dividerMouseDownHandler = mouseDownHandler.bind(null, index, controller)
    divider.addEventListener('mousedown', divider.dividerMouseDownHandler)
    divider.append(dividerBackgroundBox)
    dividersContainer.append(divider)
  }

  const dividersList: NodeListOf<HTMLDivElement> = dividersContainer.querySelectorAll(
    '.resizable-columns-divider'
  )
  const dividersArray: HTMLDivElement[] = Array.from(dividersList)
  controller.set('dividersArray', dividersArray)

  dataTableContainer.dataTableMouseUpHandler = mouseUpHandler.bind(null, controller)
  dataTableContainer.dataTableResizeHandler = resizeHandler.bind(null, controller)
  document.addEventListener('mouseup', dataTableContainer.dataTableMouseUpHandler)
  dividersContainer.addEventListener('mousemove', dataTableContainer.dataTableResizeHandler)
  dataTableContainer.addEventListener('mousemove', dataTableContainer.dataTableResizeHandler)
}

export const removeDividersContainer = (dataTableContainer: DataTableContainer): void => {
  const previousDividersContainer: HTMLDivElement | null = dataTableContainer.querySelector(
    '.resizable-columns-dividers-container'
  )
  previousDividersContainer?.remove()
}

// event handlers
export const mouseDownHandler = (
  index: number,
  controller: ControllerInstance,
  event: MouseEvent
): void => {
  const thsArray = <HTMLTableHeaderCellElement[]>controller.get('thsArray')

  controller.set('isMoving', true)
  controller.set('movingDividerIndex', index)
  controller.set('startPageXPosition', event.pageX)
  controller.set('movingTh', thsArray[index])
  controller.set('nextTh', thsArray[index + 1])
  controller.set('startMovingThWidth', thsArray[index] ? thsArray[index].offsetWidth : 0)
  controller.set('nextThWidth', thsArray[index + 1] ? thsArray[index + 1].offsetWidth : 0)

  toggleMovingStyles(true, controller)
}

export const mouseUpHandler = (controller: ControllerInstance): void => {
  if (!controller.get('isMoving')) return
  controller.set('isMoving', false)

  drawColumnDividers(
    <DataTableContainer>controller.get('dataTableContainer'),
    <Binding>controller.get('binding'),
    <VNode>controller.get('vnode')
  )
  toggleMovingStyles(false, controller)
}

export const resizeHandler = (controller: ControllerInstance, event: MouseEvent): void => {
  if (controller.get('isMoving')) {
    const startPageXPosition = <number>controller.get('startPageXPosition')
    const startMovingThWidth = <number>controller.get('startMovingThWidth')
    const movingTh = <HTMLTableHeaderCellElement>controller.get('movingTh')
    const movingDividerIndex = <number>controller.get('movingDividerIndex')
    const dataTableHeaders = <DataTableHeader[]>controller.get('dataTableHeaders')

    const differenceFromStartPageXPosition: number = event.pageX - startPageXPosition
    const movingThNewWidth: number = startMovingThWidth + differenceFromStartPageXPosition
    const movingHeaderMinWidth = <number>dataTableHeaders[movingDividerIndex]?.minWidth

    if (differenceFromStartPageXPosition && movingThNewWidth >= movingHeaderMinWidth) {
      movingTh.style.width = movingThNewWidth + 'px'
      dataTableHeaders[movingDividerIndex].width = movingThNewWidth
    }
  }
}

export const removeListeners = (dataTableContainer: DataTableContainer): void => {
  document.removeEventListener('mouseup', <EventListener>dataTableContainer.dataTableMouseUpHandler)

  dataTableContainer.removeEventListener('mousemove', <EventListener>dataTableContainer.dataTableResizeHandler)

  const dividersContainer: HTMLDivElement | null = dataTableContainer.querySelector('.resizable-columns-dividers-container')
  dividersContainer?.removeEventListener('mousemove', <EventListener>dataTableContainer.dataTableResizeHandler)

  const dividers = <NodeListOf<Divider>>(dataTableContainer.querySelectorAll('.resizable-columns-divider'))
  dividers.forEach((divider) => {
    divider.removeEventListener('mousedown', <EventListener>divider.dividerMouseDownHandler)
  })
}

// checks
export const isDataTableElement = (element: HTMLElement): boolean => {
  return Array.from(element.classList).includes('v-data-table')
}

export const isDataTableReady = (element: HTMLElement): boolean => {
  const tableBody = <HTMLTableSectionElement>element.querySelector('tbody')
  const tableHeadRow = <HTMLTableRowElement>element.querySelector('tr')

  return (
    !tableBody.children[0].className.includes('v-data-table__empty-wrapper') &&
    tableHeadRow.children.length > 1
  )
}

export const isMobile = (element: HTMLElement): boolean => {
  return element.className.includes('v-data-table--mobile')
}

// styles
export const toggleMovingStyles = (isMoving: boolean, controller: ControllerInstance): void => {
  const movingTh = <HTMLTableHeaderCellElement>controller.get('movingTh')
  const nextTh = <HTMLTableHeaderCellElement>controller.get('nextTh')
  const dividersArray = <HTMLDivElement[]>controller.get('dividersArray')

  document.body.style.userSelect = isMoving ? 'none' : ''
  if (movingTh) movingTh.style.cursor = isMoving ? 'col-resize' : ''
  if (nextTh) nextTh.style.cursor = isMoving ? 'col-resize' : ''

  for (const divider of dividersArray) {
    divider.style.opacity = isMoving ? '0' : '1'
  }
}