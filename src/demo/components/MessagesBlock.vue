<template>
  <div class="messages-block__container elevation-1"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class MessagesScreen extends Vue {}
</script>

<style>
.messages-block__container {
  flex-basis: 50%;
}
</style>
