<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

import type { World, Square } from '~~/types/database';

const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : (route.params.slug ?? '')

// Fetch world metadata
const { data: worldData, error: worldError } = await useFetch<World>('/api/worlds/' + slug, {
  baseURL: config.public.apiBase
})

// Fetch board squares
const { data: boardData, error: boardError } = await useFetch<Square[]>('/api/worlds/' + slug + '/board', {
  baseURL: config.public.apiBase
})
</script>

<template>
  <div v-if="worldData && boardData">
    <WorldBoard :worldData="worldData" :boardData="boardData" />
  </div>
  <div v-else-if="worldError || boardError">
    <h1>Error loading world</h1>
  </div>
  <div v-else>
    Loading...
  </div>
</template>