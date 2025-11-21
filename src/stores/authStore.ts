import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/services/auth.service'
import type { Models } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Models.AuthUser | null>(null)
  const token = ref<string | null>(authService.getToken())

  function setUser(u: Models.AuthUser | null) {
    user.value = u
  }

  function setToken(t: string | null) {
    token.value = t
    if (t) authService.setToken(t)
    else authService.clearToken()
  }

  async function init() {
    // gọi khi app start để khôi phục user nếu có token
    const t = authService.getToken()
    token.value = t
    if (t) {
      try {
        const u = await authService.fetchCurrentUser()
        user.value = u ?? null
      } catch {
        setToken(null)
        setUser(null)
      }
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // ignore
    }
    setUser(null)
    setToken(null)
  }

  return { user, token, setUser, setToken, init, logout }
})
