<template>
  <div class="component-data-block__container elevation-1"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class ComponentDataBlock extends Vue {}
</script>

<style>
.component-data-block__container {
  flex-basis: 50%;
}
</style>
