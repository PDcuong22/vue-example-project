import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/models'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('authToken'))

  function setUser(u: User | null) {
    user.value = u
  }
  function setToken(t: string | null) {
    token.value = t
    if (t) localStorage.setItem('authToken', t)
    else localStorage.removeItem('authToken')
  }

  return { user, token, setUser, setToken }
})
