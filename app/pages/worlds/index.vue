<script setup lang="ts">
const config = useRuntimeConfig()

import type { World } from '~~/types/database';

const { data, error } = await useFetch<World[]>('/api/worlds', {
  baseURL: config.public.apiBase
})
</script>

<template>
  <div>
    <h1>User index</h1>
    <div v-for="world in data" :key="world.id">
      <NuxtLink :to="`/worlds/${world.slug}`">
        <h2>{{ world.name }}</h2>
      </NuxtLink>
      <p>Slug: {{ world.slug }}</p>
      <p>Owner ID: {{ world.ownerId }}</p>
      <p>Board Size: {{ world.boardSize }}</p>
      <p>Max Players: {{ world.maxPlayers }}</p>
      <p>Created At: {{ world.createdAt }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>