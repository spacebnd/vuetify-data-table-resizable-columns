import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import DemoApp from './DemoApp.vue'
import ResizableColumns from '@/lib/directive'

Vue.config.productionTip = false

Vue.directive('resizable-columns', ResizableColumns)

new Vue({
  vuetify,
  render: (h) => h(DemoApp),
}).$mount('#app')
