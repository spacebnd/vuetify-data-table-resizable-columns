<template>
  <div class="messages-block__container elevation-1">
    <h1 class="messages-block__header">debug logs</h1>
    <div class="messages">
      <p class="message" v-for="(message, index) of messages" :key="index + message">
        <span>{{ index === 0 ? '>' : '&nbsp;' }}</span> {{ message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { messages } from '@/lib/functions'
import { Message, Messages } from '@/demo/types'

@Component({})
export default class MessagesScreen extends Vue {
  messages: Messages = messages

  @Watch('messages')
  watchHeadersUpdate(messages: Message): void {
    if (messages[0].toLowerCase().includes('updated array of headers')) {
      this.$root.$emit('headers-changed')
    }
  }
}
</script>

<style>
.messages-block__container {
  width: 45%;
  padding: 10px;
}

.messages {
  max-height: 90%;
  overflow: hidden;
}

p.message {
  margin-bottom: 5px;
  font-size: 12px;
  font-family: Courier, monospace;
  text-align: left;
}

p.message span {
  font-weight: bold;
}
</style>
