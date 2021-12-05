<template>
  <div class="component-data-block__container elevation-1">
    <h1 class="component-data-block__header">data table parent component</h1>
    <div class="component-headers">
      <div class="component-headers__subheader">headersArr = [</div>
      <div
        class="component-header"
        v-for="(header, index) of headersArr"
        :key="header.value"
        v-html="getHeaderLayout(header, index)"
      />
      <div class="component-headers__subheader">]</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DataTableHeader } from 'vuetify'

@Component({})
export default class ComponentDataBlock extends Vue {
  headersArr: DataTableHeader[] = []

  mounted() {
    this.headersArr = this.$parent.$parent.$children[0].headersArr
    this.$root.$on('headers-changed', () => {
      // reactivity in depth is not available
      this.$forceUpdate()
    })
  }

  destroyed() {
    this.$root.$off('headers-changed')
  }

  getHeaderLayout(header: DataTableHeader, index: number): string {
    const headerString = JSON.stringify(header)

    let updatedHeaderString
    if (index === this.headersArr.length - 1) {
      updatedHeaderString = `<p class="highlight">${headerString}</p>`
    } else {
      const regexp = /"width.+?(?=,)/
      updatedHeaderString =
        headerString.replace(
          new RegExp(regexp, 'gi'),
          (match) => `<span class="highlight">${match}</span>`
        ) + ','
    }
    return `<p>${updatedHeaderString}</p>`
  }
}
</script>

<style>
.component-data-block__container {
  width: 55%;
  padding: 10px;
  overflow: hidden;
}

.component-headers {
  max-height: 90%;
  overflow: hidden;
}

.component-headers__subheader {
  font-size: 13px;
  font-weight: bold;
  text-align: left;
}

.component-header {
  padding-left: 20px;
  font-size: 13px;
  text-align: left;
}

.component-header p {
  margin: 10px 0;
  font-size: 12px;
  font-family: Courier, monospace;
  text-align: left;
  word-break: break-all;
}

.highlight {
  font-weight: bold;
  color: #cc4848;
}
</style>
