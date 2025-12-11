<script setup lang="ts">
import type { Square } from '~~/types/database';

const config = useRuntimeConfig()

const props = defineProps<{
  worldData: {
    name: string;
    slug: string;
    boardSize: number;
    maxPlayers: number;
  };
  boardData: Square[];
}>()

const emit = defineEmits<{
  'square-click': [square: Square];
}>();

const squares = ref<Square[]>(props.boardData);

// Get square color based on owner
function getSquareColor(square: Square): string {

  if (!square || !square.ownerId) {
    return 'white';  // Empty square
  }

  // Different colors for different players
  const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightyellow', 'lightpink'];
  const hash = square.ownerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length] ?? 'white';
}

// Handle square click - capture it!
const isProcessing = ref(false);
const errorMessage = ref('');

function handleSquareClick(square: Square){
  emit('square-click', square);
}
</script>

<template>
  <div>
    <!-- Error message -->
    <div v-if="errorMessage" style="color: red; margin: 10px 0;">
      {{ errorMessage }}
    </div>

    <!-- Board -->
    <div style="position: relative;">
      <svg :width="worldData.boardSize * 50" :height="worldData.boardSize * 50">
        <rect
          v-for="square in squares"
          :key="square.id"
          :x="(square.x - 1) * 50"
          :y="(square.y - 1) * 50"
          width="50"
          height="50"
          stroke="black"
          :fill="getSquareColor(square)"
          @click="handleSquareClick(square)"
          :style="{
            cursor: isProcessing ? 'wait' : 'pointer',
            opacity: isProcessing ? 0.5 : 1
          }"
        />
      </svg>

      <!-- Loading overlay -->
      <div v-if="isProcessing" style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.7);
      ">
        Processing...
      </div>
    </div>
    
  </div>
</template>

<style scoped>
svg {
  border: 2px solid black;
}

rect:hover {
  stroke-width: 3;
  stroke: #ff6b6b;
}
</style>