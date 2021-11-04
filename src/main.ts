import { VueConstructor } from 'vue'
import resizableColumns from '@/lib/resizable-columns-directive'

function install(Vue: VueConstructor): void {
  Vue.directive('resizable-columns', resizableColumns)
}

export default {
  install,
}
