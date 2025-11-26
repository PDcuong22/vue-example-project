import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'
import type { Models } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Models.AuthUser | null>(null)
  const token = ref<string | null>(authService.getToken())
  const isAdmin = computed(() => !!user.value && user.value.role === 'Admin')
  const isAgent = computed(() => !!user.value && user.value.role === 'Support Agent')

  function setUser(u: Models.AuthUser | null) {
    user.value = u
  }

  function setToken(t: string | null) {
    token.value = t
    if (t) authService.setToken(t)
    else authService.clearToken()
  }

  const hydrated = ref(false)
  async function init() {
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
    hydrated.value = true
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



  return { user, token, hydrated, isAdmin, isAgent, setUser, setToken, init, logout }
})
