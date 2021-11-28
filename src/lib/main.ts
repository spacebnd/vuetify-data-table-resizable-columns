import { VueConstructor } from 'vue'
import directive from '@/lib/directive'

function install(Vue: VueConstructor): void {
  Vue.directive('resizable-columns', directive)
}

export default {
  install,
}
