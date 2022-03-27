export const CLASSES = {
  DATA_TABLE_WRAPPER: 'v-data-table__wrapper',
  DATA_TABLE: 'v-data-table',
  DATA_TABLE_HEADER: 'v-data-table-header',
  DATA_TABLE_FIXED_HEADER: 'v-data-table--fixed-header',
  DATA_TABLE_DARK_THEME: 'theme--dark',
  DATA_TABLE_MOBILE: 'v-data-table--mobile',
  DIVIDERS_CONTAINER: 'resizable-columns-dividers-container',
  DIVIDER: 'resizable-columns-divider',
  EMPTY_COLUMN: 'v-resizable-columns_empty-column',
}
export const DEFAULT_HEADER_MIN_WIDTH = 80 // px
export const INDENT_TO_NATIVE_VUETIFY_DIVIDER = 11 // px
export const ADDITIONAL_COLUMN_WIDTH = 58 // px
export let IS_DEBUG = false

export const setIsDebug = (value: boolean): void => {
  IS_DEBUG = value
}
