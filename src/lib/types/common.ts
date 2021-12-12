import type {
  VNodeDirective as VNodeDirectiveVue2,
  VNode as VNodeVue2,
} from '@/lib/types/vue2/vnode'
import type {
  DirectiveBinding as DirectiveBindingVue3,
  VNode as VNodeVue3,
} from '@/lib/types/vue3/runtime-core'

// directive
export interface DirectiveHookNames {
  mounted: 'mounted' | 'inserted'
  updated: 'updated' | 'update'
  unmounted: 'unmounted' | 'unbind'
}
export type UserOption = 'redraw' | 'debug' | null
export interface Controller {
  binding: DirectiveBindingVue2 | DirectiveBindingVue3 | null
  vnode: VNodeVue2 | VNodeVue3 | null
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
export type MessageType = 'info' | 'error'

// dom
export interface DataTableContainer extends HTMLDivElement {
  dataTableMouseUpHandler?: (event: MouseEvent) => void
  dataTableResizeHandler?: (event: MouseEvent) => void
}
export interface Divider extends HTMLDivElement {
  dividerMouseDownHandler?: (event: MouseEvent) => void
}

// vue
export interface DirectiveBindingVue2 extends VNodeDirectiveVue2 {
  rawName: string
  value: UserOption
}

// vuetify
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

// types.d.ts are temporarily not supplied with the library
// https://stackoverflow.com/questions/69942209/typescript-declaration-files-d-ts-not-found-is-not-a-module
