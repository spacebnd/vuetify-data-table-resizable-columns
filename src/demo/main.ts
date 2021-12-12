import type { DirectiveOptions as DirectiveOptionsVue2 } from '@/lib/types/vue2/index'
import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import DemoApp from './DemoApp.vue'
import ResizableColumns from '@/lib/directive'

Vue.config.productionTip = false

// @ts-ignore
Vue.directive('resizable-columns', <DirectiveOptionsVue2>ResizableColumns)

new Vue({
  vuetify,
  render: (h) => h(DemoApp),
}).$mount('#app')
