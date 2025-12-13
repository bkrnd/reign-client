<script setup lang="ts">
const { login, loginAsGuest, isAuthenticated } = useAuth()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const isGuestLoading = ref(false)

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    router.push('/worlds')
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please enter username and password'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  const result = await login({
    username: username.value,
    password: password.value
  })

  isLoading.value = false

  if (result.success) {
    router.push('/worlds')
  } else {
    errorMessage.value = result.error || 'Login failed'
  }
}

const handleGuestLogin = async () => {
  errorMessage.value = ''
  isGuestLoading.value = true

  const result = await loginAsGuest()

  isGuestLoading.value = false

  if (result.success) {
    router.push('/worlds')
  } else {
    errorMessage.value = result.error || 'Failed to create guest account'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UiCard class="w-full max-w-md">
      <div class="p-6 space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-primary">Welcome to Reign</h1>
          <p class="text-muted-foreground mt-2">Sign in to start conquering worlds</p>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium mb-2">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your username"
              :disabled="isLoading || isGuestLoading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              :disabled="isLoading || isGuestLoading"
            />
          </div>

          <UiBaseButton
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="isLoading || isGuestLoading"
            :loading="isLoading"
          >
            Sign In
          </UiBaseButton>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <UiBaseButton
          variant="outline"
          class="w-full"
          :disabled="isLoading || isGuestLoading"
          :loading="isGuestLoading"
          @click="handleGuestLogin"
        >
          Continue as Guest
        </UiBaseButton>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Don't have an account?</span>
          <NuxtLink to="/register" class="text-primary hover:underline ml-1">
            Create one
          </NuxtLink>
        </div>
      </div>
    </UiCard>
  </div>
</template>
