<script setup lang="ts">
const { register, isAuthenticated } = useAuth()
const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    router.push('/worlds')
  }
})

const handleRegister = async () => {
  // Validation
  if (!username.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (username.value.length < 3 || username.value.length > 50) {
    errorMessage.value = 'Username must be between 3 and 50 characters'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  const result = await register({
    username: username.value,
    password: password.value
  })

  isLoading.value = false

  if (result.success) {
    router.push('/worlds')
  } else {
    errorMessage.value = result.error || 'Registration failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UiCard class="w-full max-w-md">
      <div class="p-6 space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-primary">Create Account</h1>
          <p class="text-muted-foreground mt-2">Join the battle for world domination</p>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium mb-2">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Choose a username (3-50 characters)"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Choose a password (min 6 characters)"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm your password"
              :disabled="isLoading"
            />
          </div>

          <UiBaseButton
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="isLoading"
            :loading="isLoading"
          >
            Create Account
          </UiBaseButton>
        </form>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Already have an account?</span>
          <NuxtLink to="/login" class="text-primary hover:underline ml-1">
            Sign in
          </NuxtLink>
        </div>
      </div>
    </UiCard>
  </div>
</template>
