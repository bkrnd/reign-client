import type { Square, World } from '~~/types/database'

export const useGameApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  const { authToken } = useAuth()

  /**
   * Get authorization headers with JWT token
   */
  const getHeaders = () => {
    const headers: Record<string, string> = {}
    if (authToken.value) {
      headers['Authorization'] = `Bearer ${authToken.value}`
    }
    return headers
  }

  /**
   * Capture a square on the game board
   */
  const captureSquare = async (
    worldSlug: string,
    x: number,
    y: number,
    playerId: string,
  ): Promise<Square> => {
    return await $fetch<Square>(`/api/worlds/${worldSlug}/actions/capture`, {
      baseURL,
      method: 'POST',
      headers: getHeaders(),
      body: { x, y, playerId }
    })
  }

  /**
   * Defend a square on the game board
   */
  const defendSquare = async (
    worldSlug: string,
    x: number,
    y: number,
    playerId: string
  ): Promise<Square> => {
    return await $fetch<Square>(`/api/worlds/${worldSlug}/actions/defend`, {
      baseURL,
      method: 'POST',
      headers: getHeaders(),
      body: { x, y, playerId }
    })
  }

  /**
   * Fetch world metadata
   */
  const getWorld = async (slug: string): Promise<World> => {
    return await $fetch<World>(`/api/worlds/${slug}`, {
      baseURL,
      headers: getHeaders()
    })
  }

  /**
   * Fetch board squares for a world
   */
  const getBoardSquares = async (slug: string): Promise<Square[]> => {
    return await $fetch<Square[]>(`/api/worlds/${slug}/board`, {
      baseURL,
      headers: getHeaders()
    })
  }

  /**
   * Reset world state
   */
  const resetWorld = async (slug: string, playerId: string): Promise<World> => {
    return await $fetch<World>(`/api/worlds/${slug}/reset`, {
      baseURL,
      method: 'POST',
      headers: getHeaders(),
      body: { playerId }
    })
  }

  return {
    captureSquare,
    defendSquare,
    getWorld,
    getBoardSquares,
    resetWorld
  }
}
