<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <Head>
    <title>Reign - Multiplayer Territory Conquest</title>
  </Head>
  <main class="container px-4 py-8 md:py-12 lg:py-16">
    <!-- Hero Section -->
    <div class="text-center mb-12 md:mb-16">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-foreground">
        Welcome to <span class="text-primary">Reign</span>
      </h1>
      <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        A real-time multiplayer strategy game where you compete to capture and defend territory on a shared world board.
      </p>
      <NuxtLink to="/worlds">
        <UiBaseButton>
          Browse Worlds
        </UiBaseButton>
      </NuxtLink>
    </div>

    <!-- Preview Image -->
    <div class="mb-12 md:mb-16 max-w-4xl mx-auto rounded-md border border-border">
        <img
          :src="colorMode.value === 'dark' ? '/images/board-preview.png' : '/images/board-preview-light.png'"
          alt="Reign game board preview showing territory control"
          class="w-full h-auto"
        >
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
      <UiCard class="text-center p-6">
        <Icon name="mdi:sword-cross" size="32" class="mb-3" />
        <h3 class="text-xl font-semibold mb-2 text-card-foreground">Capture Territory</h3>
        <p class="text-muted-foreground">
          Click squares to expand your empire and claim new territory on the board.
        </p>
      </UiCard>

      <UiCard class="text-center p-6">
        <Icon name="mdi:shield-outline" size="32" class="mb-3" />
        <h3 class="text-xl font-semibold mb-2 text-card-foreground">Defend Your Lands</h3>
        <p class="text-muted-foreground">
          Strengthen your squares with defense bonuses to protect against enemy capture.
        </p>
      </UiCard>

      <UiCard class="text-center p-6">
        <Icon name="mdi:strategy" size="32" class="mb-3" />
        <h3 class="text-xl font-semibold mb-2 text-card-foreground">Real-time Strategy</h3>
        <p class="text-muted-foreground">
          See moves as they happen with live WebSocket updates across all players.
        </p>
      </UiCard>
    </div>

    <!-- How to Play Section -->
    <div class="mt-12 md:mt-16 max-w-4xl mx-auto">
      <UiCard class="p-6 md:p-8">
        <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center text-card-foreground">How to Play</h2>
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <NuxtLink to="/worlds">
                <h4 class="font-semibold mb-1 text-card-foreground underline">Join or Create a World</h4>
              </NuxtLink>
              <p class="text-muted-foreground">Browse available worlds or create your own game board.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 class="font-semibold mb-1 text-card-foreground">Capture Squares</h4>
              <p class="text-muted-foreground">Click unclaimed or enemy squares to capture them for your empire.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 class="font-semibold mb-1 text-card-foreground">Defend and Expand</h4>
              <p class="text-muted-foreground">Fortify your territory and compete to control the most squares!</p>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
  </main>
</template>