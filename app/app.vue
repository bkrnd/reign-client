<script setup lang="ts">
const { initAuth } = useAuth()

// Initialize authentication on app mount
onMounted(() => {
  initAuth()
})

useHead({
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon.svg"
    }
  ],
  bodyAttrs: {
    class: 'bg-background text-foreground'
  }
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
