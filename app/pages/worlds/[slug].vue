<script setup lang="ts">
import type { World, Square } from '~~/types/database';

const config = useRuntimeConfig()
const route = useRoute()
const auth = useAuth()
const gameState = useGameState()

const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : (route.params.slug ?? '')

// Initialize auth on mount
onMounted(() => {
  auth.initAuth()

  // Auto-login for testing if no user
  if (!auth.currentUser.value) {
    auth.mockLogin(`Player${Math.floor(Math.random() * 1000)}`)
  }
})

// Fetch world metadata
const { data: worldData, error: worldError } = await useFetch<World>('/api/worlds/' + slug, {
  baseURL: config.public.apiBase
})

// Fetch board squares
const { data: boardData, error: boardError } = await useFetch<Square[]>('/api/worlds/' + slug + '/board', {
  baseURL: config.public.apiBase
})

// Initialize game state when data loads
watchEffect(() => {
  if (worldData.value && boardData.value) {
    gameState.initGame(worldData.value, boardData.value)
  }
})

// Handle square click
function handleSquareClick(square: Square) {
  if ( square.ownerId === auth.currentUser.value?.id ) {
    // Upgrade defense bonus if owned by current user
    gameState.defendSquare(square)
  } else {
    // Try to capture square
    gameState.captureSquare(square)
  }
}
</script>

<template>
  <Head>
    <title v-if="worldData">{{ worldData.name }} - World | Reign</title>
    <title v-else>Loading World... | Reign</title>
  </Head>
  <div class="container mt-4">
    <!-- User Info -->
    <div v-if="auth.currentUser.value" class="mb-4 p-4 bg-gray-100 rounded">
      <p class="text-sm">Playing as: <strong>{{ auth.currentUser.value.username }}</strong></p>
    </div>

    <!-- World Info -->
    <div v-if="worldData" class="mb-4">
      <h1 class="text-3xl font-bold mb-2">{{ worldData.name }}</h1>
      <p class="text-gray-600">Board Size: {{ worldData.boardSize }}x{{ worldData.boardSize }} | Max Players: {{ worldData.maxPlayers }}</p>
    </div>

    <!-- Game Board -->
    <div v-if="gameState.worldData.value && gameState.squares.value.length > 0">
      <GameWorldBoard
        :worldData="gameState.worldData.value"
        :squares="gameState.squares.value"
        :isProcessing="gameState.isProcessing.value"
        :errorMessage="gameState.errorMessage.value"
        @square-click="handleSquareClick"
      />
    </div>

    <!-- Error States -->
    <div v-else-if="worldError || boardError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <h1 class="font-bold">Error loading world</h1>
      <p>{{ worldError || boardError }}</p>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center p-8">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading world...</p>
      </div>
    </div>
  </div>
</template>