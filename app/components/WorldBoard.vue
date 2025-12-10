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

const currentPlayerId = ref<String>('Saitty');
const isResetting = ref(false);
const resetError = ref('');
const squares = ref<Square[]>(props.boardData);

// Create a map for quick square lookup
const squareMap = computed(() => {
  const map = new Map<string, Square>();
  squares.value.forEach(square => {
    map.set(`${square.x},${square.y}`, square);
  });
  return map;
});

// Get square color based on owner
function getSquareColor(x: number, y: number): string {
  const square = squareMap.value.get(`${x},${y}`);

  if (!square || !square.ownerId) {
    return 'white';  // Empty square
  }

  // Different colors for different players
  const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightyellow', 'lightpink'];
  const hash = square.ownerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Handle square click - capture it!
const isProcessing = ref(false);
const errorMessage = ref('');

async function handleSquareClick(x: number, y: number) {
  const square = squareMap.value.get(`${x},${y}`);

  // Check if already owned
  if (square?.ownerId) {
    errorMessage.value = `Square already owned by ${square.ownerId}`;
    setTimeout(() => errorMessage.value = '', 2000);
    return;
  }

  isProcessing.value = true;
  errorMessage.value = '';

  try {
    // Call backend to capture square
    const response = await $fetch<Square>(`/api/worlds/${props.worldData.slug}/actions/capture`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: {
        x: x,
        y: y,
        playerId: currentPlayerId.value
      }
    });

    // Update local state with new square data
    const index = squares.value.findIndex(s => s.x === x && s.y === y);
    if (index !== -1) {
      squares.value[index] = response;
    }

    console.log('Square captured!', response);
  } catch (error: any) {
    console.error('Failed to capture square:', error);
    errorMessage.value = error.data?.message || 'Failed to capture square';
  } finally {
    isProcessing.value = false;
  }
}

// Get stats
const stats = computed(() => ({
  total: squares.value.length,
  owned: squares.value.filter(s => s.ownerId).length,
  empty: squares.value.filter(s => !s.ownerId).length,
  mineCount: squares.value.filter(s => s.ownerId === currentPlayerId.value).length,
}));

async function resetBoard() {
  if (!confirm('Are you sure you want to reset the board? All progress will be lost!')) {
    return;
  }

  isResetting.value = true;
  resetError.value = '';

  try {
    await $fetch(`/api/worlds/${props.worldData.slug}/reset`, {
      method: 'POST',
      baseURL: config.public.apiBase
    });

    const updatedBoard = await $fetch<Square[]>(`/api/worlds/${props.worldData.slug}/board`, {
      baseURL: config.public.apiBase
    });

    squares.value = updatedBoard;
  } catch (error: any) {
    console.error('Failed to reset board:', error);
    resetError.value = 'Failed to reset board. Please try again.';
  } finally {
    isResetting.value = false;
  }
}
</script>

<template>
  <div>
    <h1>{{ worldData.name }}</h1>
    <p>Player:</p>
    <input v-model="currentPlayerId" placeholder="Enter your player ID" />

    <!-- Error message -->
    <div v-if="errorMessage" style="color: red; margin: 10px 0;">
      {{ errorMessage }}
    </div>

    <!-- Board -->
    <div style="position: relative;">
      <svg :width="worldData.boardSize * 50" :height="worldData.boardSize * 50">
        <template v-for="x in worldData.boardSize" :key="x">
          <rect
              v-for="y in worldData.boardSize"
              :key="y"
              :x="(x - 1) * 50"
              :y="(y - 1) * 50"
              width="50"
              height="50"
              stroke="black"
              :fill="getSquareColor(x - 1, y - 1)"
              @click="handleSquareClick(x - 1, y - 1)"
              :style="{
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.5 : 1
            }"
          />
        </template>
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

    <!-- Stats -->
    <div style="margin-top: 20px;">
      <h3>Board Stats</h3>
      <p>Total Squares: {{ stats.total }}</p>
      <p>Your Squares: {{ stats.mineCount }}</p>
      <p>Owned by Others: {{ stats.owned - stats.mineCount }}</p>
      <p>Empty Squares: {{ stats.empty }}</p>
    </div>

    <div v-if="resetError" style="color: red; margin: 10px 0;">
      {{ resetError }}
    </div>

    <button
      @click="resetBoard"
      :disabled="isResetting || isProcessing"
      style="
      padding: 10px 20px;
      background-color: #ff4444;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      "
      :style="{
        opacity: (isResetting || isProcessing) ? 0.5 : 1,
        cursor: (isResetting || isProcessing) ? 'not-allowed' : 'pointer'
      }"
    >
      {{ isResetting ? 'Resetting...' : 'Reset Board' }}
    </button>
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

button:hover:not(:disabled) {
  background-color: #cc0000;
}
</style>