import { DataTableHeader } from 'vuetify'

declare module 'vue/types/vue' {
  interface Vue {
    headersArr: DataTableHeader[]
    itemsArr: DesertItem[]
  }
}

export interface DesertItem {
  name: string
  calories: number
  fat: number
  carbs: number
  protein: number
  iron: string
}

export type Message = string
export type Messages = Message[]
