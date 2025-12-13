import type { User, AuthResponse, LoginRequest, RegisterRequest } from '~~/types/database'

export const useAuth = () => {
  const config = useRuntimeConfig()

  // Store current user and token in composable state (shared across the app)
  const currentUser = useState<User | null>('currentUser', () => null)
  const authToken = useState<string | null>('authToken', () => null)
  const isAuthenticated = computed(() => currentUser.value !== null && authToken.value !== null)

  // Set the current user and token (call this after login or on app init)
  const setUser = (user: User | null, token: string | null = null) => {
    currentUser.value = user
    authToken.value = token

    // Persist to localStorage for session management
    if (user && token) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
    }
  }

  /**
   * Get current user and token from localStorage on app init
   */
  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('currentUser')
      const storedToken = localStorage.getItem('authToken')

      if (storedUser && storedToken) {
        try {
          currentUser.value = JSON.parse(storedUser)
          authToken.value = storedToken
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('currentUser')
          localStorage.removeItem('authToken')
        }
      }
    }
  }

  /**
   * Login with username and password
   */
  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await $fetch<AuthResponse>(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        body: credentials
      })

      const user: User = {
        id: response.userId,
        username: response.username,
        role: response.role,
        userType: response.userType,
        createdAt: new Date().toISOString()
      }

      setUser(user, response.token)
      return { success: true }
    } catch (error: any) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: error.data?.message || 'Invalid username or password'
      }
    }
  }

  /**
   * Register a new user
   */
  const register = async (credentials: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await $fetch<AuthResponse>(`${config.public.apiBase}/api/auth/register`, {
        method: 'POST',
        body: credentials
      })

      const user: User = {
        id: response.userId,
        username: response.username,
        role: response.role,
        userType: response.userType,
        createdAt: new Date().toISOString()
      }

      setUser(user, response.token)
      return { success: true }
    } catch (error: any) {
      console.error('Registration failed:', error)
      return {
        success: false,
        error: error.data?.message || 'Registration failed. Username may already be taken.'
      }
    }
  }

  /**
   * Login as a guest user
   */
  const loginAsGuest = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await $fetch<AuthResponse>(`${config.public.apiBase}/api/auth/guest`, {
        method: 'POST'
      })

      const user: User = {
        id: response.userId,
        username: response.username,
        role: response.role,
        userType: response.userType,
        createdAt: new Date().toISOString()
      }

      setUser(user, response.token)
      return { success: true }
    } catch (error: any) {
      console.error('Guest login failed:', error)
      return {
        success: false,
        error: error.data?.message || 'Failed to create guest account'
      }
    }
  }

  /**
   * Logout current user
   * For guest users, also delete the account from the backend
   */
  const logout = async () => {
    // If user is a guest, delete their account
    if (currentUser.value?.userType === 'GUEST' && currentUser.value?.id && authToken.value) {
      try {
        await $fetch(`${config.public.apiBase}/api/auth/logout/${currentUser.value.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        })
      } catch (error) {
        console.error('Failed to delete guest account:', error)
        // Continue with logout even if deletion fails
      }
    }

    setUser(null, null)
  }

  return {
    currentUser: readonly(currentUser),
    authToken: readonly(authToken),
    isAuthenticated,
    setUser,
    initAuth,
    login,
    register,
    loginAsGuest,
    logout
  }
}
