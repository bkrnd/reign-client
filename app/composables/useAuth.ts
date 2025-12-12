import type { User } from '~~/types/database'

export const useAuth = () => {
  // Store current user in a composable state (shared across the app)
  const currentUser = useState<User | null>('currentUser', () => null)
  const isAuthenticated = computed(() => currentUser.value !== null)

  // Set the current user (call this after login or on app init)
  const setUser = (user: User | null) => {
    currentUser.value = user

    // Persist to localStorage for session management
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }

  /**
   * Get current user from localStorage on app init
   */
  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        try {
          currentUser.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('currentUser')
        }
      }
    }
  }

  /**
   * Logout current user
   */
  const logout = () => {
    setUser(null)
  }

  /**
   * Mock login (replace with real API call later)
   * For now, creates a temporary user for testing
   */
  const mockLogin = (username: string) => {
    const user: User = {
      id: `user_${Date.now()}`,
      username,
      createdAt: new Date().toISOString()
    }
    setUser(user)
    return user
  }

  return {
    currentUser: readonly(currentUser),
    isAuthenticated,
    setUser,
    initAuth,
    logout,
    mockLogin
  }
}
