<script setup lang="ts">
const config = useRuntimeConfig()

const { data } = await useFetch('/api/users', {
  baseURL: config.public.apiBase
})
</script>

<template>
  <div>
    <h1>User index</h1>
    {{ data }}
  </div>
</template>

<style scoped>

</style>