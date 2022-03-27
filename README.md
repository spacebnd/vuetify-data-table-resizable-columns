# vuetify-data-table-resizable-columns

Resizable columns Vue directive for [Vuetify](https://github.com/vuetifyjs/vuetify) v-data-table

#### [Online Demo](https://spacebnd.github.io/vuetify-data-table-resizable-columns/)

--- 

### Install
```shell
npm install @spacebnd/vuetify-data-table-resizable-columns
```
### Registration
```javascript
// main.js

import vuetify from '@/plugins/vuetify'
import ResizableColumns from '@spacebnd/vuetify-data-table-resizable-columns'

Vue.use(ResizableColumns)

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
```
---

### Usage
```vue
<template>
  <v-data-table 
    v-resizable-columns 
    :headers="headersArr" 
    :items="itemsArr"
  >
  </v-data-table>
</template>
```
### Options
Expects: `string`  
Available values: `'debug'` `'redraw'`

#### Examples
```vue
# debug

<template>
  <v-data-table 
    v-resizable-columns="option" 
    :headers="headersArr" 
    :items="itemsArr"
  >
  </v-data-table>
</template>

<script>
export default {
  data () {
    return {
      option: 'debug'
    }
  }
}
// debug messages will be shown to the console
</script>

```

```vue
# redraw

<template>
  <v-data-table 
    v-resizable-columns="option" 
    :headers="headersArr" 
    :items="itemsArr"
  >
  </v-data-table>
</template>

<script>
  export default {
    data () {
      return {
        option: null
      }
    },
    watch: {
      someProperty: function (val) {
        if (val > someConditionRequiringRedrawing) {
          this.$nextTick(() => {
            this.option = 'redraw'
          })
          // after redrawing, the 'option' property will be automatically assigned 'null', 
          // which makes it possible to use it an unlimited number of times
        }
      },
    }
  }
</script>
```

> **NOTE:**  Possible incorrect behavior when using props that change the table structure

---

### License

[MIT](https://github.com/spacebnd/vuetify-data-table-resizable-columns/blob/main/LICENSE.md)
