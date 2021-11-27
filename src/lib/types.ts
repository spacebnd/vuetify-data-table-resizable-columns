import { VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'

export interface Binding extends DirectiveBinding {
  rawName: string
  value: UserOption
}

export type UserOption = 'redraw' | 'debug' | null

export interface Controller {
  binding: Binding | null
  vnode: VNode | null
  dataTableContainer: HTMLDivElement | null
  dataTableHeaders: DataTableHeader[] | null
  thsArray: HTMLTableHeaderCellElement[] | null
  dividersArray: HTMLDivElement[] | null
  isMoving: boolean
  movingDividerIndex: number
  startPageXPosition: number
  movingTh: HTMLTableHeaderCellElement | null
  nextTh: HTMLTableHeaderCellElement | null
  startMovingThWidth: number
  nextThWidth: number
}

export type ControllerInstance = Map<string, Controller[keyof Controller]>

export interface DataTableContainer extends HTMLDivElement {
  dataTableMouseUpHandler?: (event: MouseEvent) => void
  dataTableResizeHandler?: (event: MouseEvent) => void
}

export interface Divider extends HTMLDivElement {
  dividerMouseDownHandler?: (event: MouseEvent) => void
}

export interface DataTableProps {
  headers: DataTableHeader[]
  items: any[]
}

export interface DataTableHeader<T extends any = any> {
  text: string
  value: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  filterable?: boolean
  groupable?: boolean
  divider?: boolean
  class?: string | string[]
  cellClass?: string | string[]
  width?: string | number
  minWidth?: string | number
  type?: string
  filter?: (value: any, search: string | null, item: any) => boolean
  sort?: DataTableCompareFunction<T>
}

type DataTableCompareFunction<T = any> = (a: T, b: T) => number

export type MessageType = 'info' | 'error'

// types.d.ts are temporarily not supplied with the library
// https://stackoverflow.com/questions/69942209/typescript-declaration-files-d-ts-not-found-is-not-a-module
