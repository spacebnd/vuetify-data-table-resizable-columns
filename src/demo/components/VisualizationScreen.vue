<template>
  <div class="visualization-screen__container elevation-3">
    <MessagesBlock />
    <ComponentDataBlock />
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
  min-height: 40vh;
  max-height: 40vh;
  width: 100%;
}
</style>
