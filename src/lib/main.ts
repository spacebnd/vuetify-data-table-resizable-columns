import type { VueConstructor } from '@/lib/types/vue2/vue'
import type { DirectiveOptions as DirectiveOptionsVue2 } from '@/lib/types/vue2/index'
import type { ObjectDirective as DirectiveOptionsVue3, App } from '@/lib/types/vue3/runtime-core'
import { setVueVersion } from '@/lib/constants'
import directive from '@/lib/directive'
import { isVue3 } from '@/lib/functions'

function install(Vue: VueConstructor | App): void {
  setVueVersion(Vue.version)

  if (isVue3(Vue.version)) {
    (Vue as App).directive('resizable-columns', <DirectiveOptionsVue3>directive)
  } else {
    (Vue as VueConstructor).directive('resizable-columns', <DirectiveOptionsVue2>directive)
  }
}

export default {
  install,
}
