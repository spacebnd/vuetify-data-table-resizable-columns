import {
  CLASSES,
  DEFAULT_HEADER_MIN_WIDTH,
  INDENT_TO_NATIVE_VUETIFY_DIVIDER,
  IS_DEBUG,
} from '@/lib/constants'
import type { VNode } from 'vue'
import type {
  Binding,
  Controller,
  ControllerInstance,
  DataTableContainer,
  DataTableHeader,
  DataTableProps,
  Divider,
  MessageType,
} from '@/lib/types'

// controller
const generateController = (): ControllerInstance => {
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
  showMessage('info', `Resize detected`, false)

  if (isDataTableReady(el)) {
    drawColumnDividers(el, <Binding>binding, vnode)
    observer.disconnect()
    showMessage('info', 'Observing finished', false)
  }
}

const generateAdditionalDataTableProps = (
  vnode: VNode,
  binding: Binding,
  controller: ControllerInstance
): void => {
  try {
    const thsArray = <HTMLTableHeaderCellElement[]>controller.get('thsArray')
    const dataTableHeaders = <DataTableHeader[]>controller.get('dataTableHeaders')

    dataTableHeaders.forEach((header: DataTableHeader, index: number) => {
      if (!header.width) {
        header.width = thsArray[index].offsetWidth
      } else if (typeof header.width === 'string' && header.class !== CLASSES.EMPTY_COLUMN) {
        header.width = +header.width
      }

      if (!header.minWidth) {
        header.minWidth = DEFAULT_HEADER_MIN_WIDTH
      } else if (typeof header.minWidth === 'string') {
        header.minWidth = +header.minWidth
      }

      if (index === dataTableHeaders.length - 1) header.divider = false
    })

    const emptyColumnIndex: number = dataTableHeaders.findIndex(
      (header) => header.class === CLASSES.EMPTY_COLUMN
    )
    if (emptyColumnIndex === -1) {
      dataTableHeaders.push({
        class: CLASSES.EMPTY_COLUMN,
        text: '',
        value: '',
        width: 'auto',
        sortable: false,
        divider: false,
      })
      showMessage('info', 'Empty helper column added to array of headers', false)
    }
  } catch (error) {
    showMessage('error', `generateAdditionalDataTableProps: ${error}`, false)
  }
}

export const drawColumnDividers = (
  dataTableContainer: DataTableContainer,
  binding: Binding,
  vnode: VNode
): void => {
  showMessage('info', 'Drawing of dividers started...', false)

  try {
    removeDividersContainer(dataTableContainer)
    removeListeners(dataTableContainer)

    const tableWrapper = <HTMLDivElement>(
      dataTableContainer.querySelector(`.${CLASSES.DATA_TABLE_WRAPPER}`)
    )
    const table = <HTMLTableElement>tableWrapper.querySelector('table')
    const thead = <HTMLTableSectionElement>(
      dataTableContainer.querySelector(`.${CLASSES.DATA_TABLE_HEADER}`)
    )
    const thsCollection: HTMLCollectionOf<HTMLTableHeaderCellElement> =
      thead.getElementsByTagName('th')
    const thsArray: HTMLTableHeaderCellElement[] = Array.from(thsCollection)
    const dividersContainer: HTMLDivElement = document.createElement('div')

    table.setAttribute('style', getTableStyles())
    dividersContainer.classList.add(CLASSES.DIVIDERS_CONTAINER)
    dividersContainer.setAttribute('style', getDividersContainerStyles(dataTableContainer))
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

    const isEmptyColumnExist: boolean = Array.from(
      thsArray[thsArray.length - 1].classList
    ).includes(CLASSES.EMPTY_COLUMN)

    for (let index = 0; index < thsArray.length - 1; index++) {
      setEllipsisStyles([thsArray[index]])

      if (index === thsArray.length - 2 && isEmptyColumnExist) {
        continue
      }

      const nextTh: HTMLTableHeaderCellElement = thsArray[index + 1]
      const divider: Divider = document.createElement('div')
      divider.classList.add(CLASSES.DIVIDER)
      const dividerBackgroundBox: HTMLDivElement = document.createElement('div')

      divider.setAttribute('style', getDividerStyles(dataTableContainer, thead, nextTh))
      dividerBackgroundBox.setAttribute('style', getDividerBackgroundBoxStyles())

      divider.dividerMouseDownHandler = mouseDownHandler.bind(null, index, controller)
      divider.addEventListener('mousedown', divider.dividerMouseDownHandler)
      divider.append(dividerBackgroundBox)
      dividersContainer.append(divider)
    }

    const tdsList: NodeListOf<HTMLTableDataCellElement> = dataTableContainer.querySelectorAll('td')
    setEllipsisStyles(Array.from(tdsList))

    const dividersList: NodeListOf<HTMLDivElement> = dividersContainer.querySelectorAll(
      '.resizable-columns-divider'
    )
    const dividersArray: HTMLDivElement[] = Array.from(dividersList)
    controller.set('dividersArray', dividersArray)

    showMessage('info', 'Adding listeners...', false)
    dataTableContainer.dataTableMouseUpHandler = mouseUpHandler.bind(null, controller)
    dataTableContainer.dataTableResizeHandler = resizeHandler.bind(null, controller)
    document.addEventListener('mouseup', dataTableContainer.dataTableMouseUpHandler)
    dividersContainer.addEventListener('mousemove', dataTableContainer.dataTableResizeHandler)
    dataTableContainer.addEventListener('mousemove', dataTableContainer.dataTableResizeHandler)

    showMessage('info', 'Drawing of dividers finished', false)
  } catch (error) {
    showMessage('error', `drawColumnDividers: ${error}`, false)
  }
}

export const removeDividersContainer = (dataTableContainer: DataTableContainer): void => {
  const previousDividersContainer: HTMLDivElement | null = dataTableContainer.querySelector(
    '.resizable-columns-dividers-container'
  )
  previousDividersContainer?.remove()
}

// event handlers
const mouseDownHandler = (
  index: number,
  controller: ControllerInstance,
  event: MouseEvent
): void => {
  try {
    const thsArray = <HTMLTableHeaderCellElement[]>controller.get('thsArray')

    controller.set('isMoving', true)
    controller.set('movingDividerIndex', index)
    controller.set('startPageXPosition', event.pageX)
    controller.set('movingTh', thsArray[index])
    controller.set('nextTh', thsArray[index + 1])
    controller.set('startMovingThWidth', thsArray[index] ? thsArray[index].offsetWidth : 0)
    controller.set('nextThWidth', thsArray[index + 1] ? thsArray[index + 1].offsetWidth : 0)

    toggleMovingStyles(true, controller)
  } catch (error) {
    showMessage('error', `mouseDownHandler: ${error}`, false)
  }
}

const mouseUpHandler = (controller: ControllerInstance): void => {
  try {
    if (!controller.get('isMoving')) return
    controller.set('isMoving', false)

    drawColumnDividers(
      <DataTableContainer>controller.get('dataTableContainer'),
      <Binding>controller.get('binding'),
      <VNode>controller.get('vnode')
    )
    toggleMovingStyles(false, controller)

    const dataTableHeaders = <DataTableHeader[]>controller.get('dataTableHeaders')
    const thsArray = <HTMLTableHeaderCellElement[]>controller.get('thsArray')
    dataTableHeaders.forEach((header, index) => {
      if (header.class !== CLASSES.EMPTY_COLUMN) {
        header.width = thsArray[index].offsetWidth
      }
    })
    showMessage('info', 'Updated array of headers in the component', false)
  } catch (error) {
    showMessage('error', `mouseUpHandler: ${error}` + error, false)
  }
}

const resizeHandler = (controller: ControllerInstance, event: MouseEvent): void => {
  try {
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
        movingTh.style.minWidth = 'auto'
        dataTableHeaders[movingDividerIndex].width = movingThNewWidth

        showMessage('info', `Changed width for <th> with index ${movingDividerIndex}`, false)
      }
    }
  } catch (error) {
    showMessage('error', `resizeHandler: ${error}`, false)
  }
}

export const removeListeners = (dataTableContainer: DataTableContainer): void => {
  showMessage('info', 'Removing listeners...', false)

  try {
    document.removeEventListener(
      'mouseup',
      <EventListener>dataTableContainer.dataTableMouseUpHandler
    )

    dataTableContainer.removeEventListener(
      'mousemove',
      <EventListener>dataTableContainer.dataTableResizeHandler
    )

    const dividersContainer: HTMLDivElement | null = dataTableContainer.querySelector(
      '.resizable-columns-dividers-container'
    )
    dividersContainer?.removeEventListener(
      'mousemove',
      <EventListener>dataTableContainer.dataTableResizeHandler
    )

    const dividers = <NodeListOf<Divider>>(
      dataTableContainer.querySelectorAll('.resizable-columns-divider')
    )
    dividers.forEach((divider) => {
      divider.removeEventListener('mousedown', <EventListener>divider.dividerMouseDownHandler)
    })
  } catch (error) {
    showMessage('error', `removeListeners: ${error}`, false)
  }
}

// checks
export const isDataTableElement = (element: HTMLElement): boolean => {
  return Array.from(element.classList).includes(CLASSES.DATA_TABLE)
}

const isFixedHeadersActive = (element: HTMLElement): boolean => {
  return Array.from(element.classList).includes(CLASSES.DATA_TABLE_FIXED_HEADER)
}

const isDataTableReady = (element: HTMLElement): boolean => {
  const tableBody = <HTMLTableSectionElement>element.querySelector('tbody')
  const tableHeadRow = <HTMLTableRowElement>element.querySelector('tr')

  return (
    !tableBody.children[0]?.className.includes(CLASSES.DATA_TABLE_EMPTY_WRAPPER) &&
    tableHeadRow.children?.length > 1
  )
}

export const isMobile = (element: HTMLElement): boolean => {
  return element.className.includes(CLASSES.DATA_TABLE_MOBILE)
}

// styles
const toggleMovingStyles = (isMoving: boolean, controller: ControllerInstance): void => {
  try {
    const movingTh = <HTMLTableHeaderCellElement>controller.get('movingTh')
    const nextTh = <HTMLTableHeaderCellElement>controller.get('nextTh')
    const dividersArray = <HTMLDivElement[]>controller.get('dividersArray')

    document.body.style.userSelect = isMoving ? 'none' : ''
    if (movingTh) movingTh.style.cursor = isMoving ? 'col-resize' : ''
    if (nextTh) nextTh.style.cursor = isMoving ? 'col-resize' : ''

    for (const divider of dividersArray) {
      divider.style.opacity = isMoving ? '0' : '1'
    }
  } catch (error) {
    showMessage('error', `toggleMovingStyles: ${error}`, false)
  }
}

const getTableStyles = (): string => {
  return 'position: relative; table-layout: fixed;'
}

const setEllipsisStyles = (payload: HTMLElement | HTMLElement[]): void => {
  if (Array.isArray(payload)) {
    payload.forEach((element) => {
      element.style.overflow = 'hidden'
      element.style.textOverflow = 'ellipsis'
    })
  } else {
    payload.style.overflow = 'hidden'
    payload.style.textOverflow = 'ellipsis'
  }
}

const getDividersContainerStyles = (dataTableContainer: DataTableContainer): string => {
  return `${
    isFixedHeadersActive(dataTableContainer)
      ? 'position: sticky; top: 0; z-index: 3;'
      : 'position: relative;'
  } width: ${dataTableContainer.offsetWidth}px; `
}

const getDividerStyles = (
  dataTableContainer: DataTableContainer,
  thead: HTMLTableSectionElement,
  nextTh: HTMLTableHeaderCellElement
) => {
  const dividerHeight = thead.offsetHeight + 'px'
  const dividerStep = nextTh.offsetLeft - INDENT_TO_NATIVE_VUETIFY_DIVIDER + 'px'
  const positionStyles = `position: absolute; top: 0; left: ${dividerStep}; height: ${dividerHeight};`

  return `${positionStyles} width: 20px; display: flex; justify-content: center; cursor: col-resize; z-index: ${
    isFixedHeadersActive(dataTableContainer) ? '3' : '1'
  };`
}

const getDividerBackgroundBoxStyles = () => {
  return `width: 1px; height: 100%; background-color: rgba(128, 128, 128, 0.3)`
}

// logs
export const showMessage = (type: MessageType, text: string, visibleForUser = true): void => {
  if (!visibleForUser && !IS_DEBUG) return

  const message = `[v-resizable-columns]: ${text}`
  if (type === 'info') {
    console.log(message)
  } else if (type === 'error') {
    console.error(message)
  }
}
