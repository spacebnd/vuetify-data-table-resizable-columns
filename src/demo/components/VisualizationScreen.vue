<template>
  <div class="visualization-screen__container elevation-3">
    <ComponentDataBlock />
    <MessagesBlock />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MessagesBlock from '@/demo/components/MessagesBlock.vue'
import ComponentDataBlock from '@/demo/components/ComponentDataBlock.vue'

@Component({
  components: { MessagesBlock, ComponentDataBlock },
})
export default class VisualizationScreen extends Vue {}
</script>

<style>
.visualization-screen__container {
  display: flex;
  flex: 1;
  width: 100%;
}
</style>
