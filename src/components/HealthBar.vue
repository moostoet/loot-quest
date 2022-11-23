<template>
  <div class="w-full bg-gray-200 rounded-full h-5">
    <div
      class="transition-all duration-500 ease-out bg-green-600 text-xs h-5 font-bold text-blue-100 text-center p-0.5 leading-none rounded-full"
      :class="{ 'bg-yellow-600': totalHP < 50, 'bg-red-600': totalHP < 25 }"
      :style="{ width: `${totalHP}%` }"
    >
      {{ entity?.stats.currentHealth }} / {{ entity?.stats.maxHealth }} HP
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Player } from '../typings/interfaces/player'

const props = defineProps({
  entity: {
    type: Object,
    required: true
  },
  totalHP: {
    type: Number,
    required: true
  }
})
</script>
