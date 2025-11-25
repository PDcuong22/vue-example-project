import { defineStore } from 'pinia'
import { ref } from 'vue'
import userService from '@/services/user.service'
import type { AuthUser } from '@/types/models'

export const useUsersStore = defineStore('users', () => {
  const users = ref<AuthUser[]>([])
  const agents = ref<AuthUser[]>([])
  const loading = ref(false)

  async function fetchUsers(params: Record<string, unknown> = {}) {
    if (loading.value) return
    loading.value = true
    try {
      const res = await userService.fetchAll(params)
      const list = res?.data ?? res ?? []
      users.value = list
    } finally {
      loading.value = false
    }
  }

  async function fetchAllAgents(force = false) {
    if(!force && agents.value.length > 0) return agents.value
    if (loading.value) return
    loading.value = true
    try {
      const res = await userService.fetchAll({ role: 'Support Agent' })
      const list = res?.data ?? res ?? []
      agents.value = list
    } finally {
      loading.value = false
    }
  }
  function getById(id: number) {
    return users.value.find((u) => u.id === id) ?? null
  }

  function addUser(u: AuthUser) {
    if (!users.value.find((x) => x.id === u.id)) users.value.unshift(u)
  }

  function updateUser(u: AuthUser) {
    const i = users.value.findIndex((x) => x.id === u.id)
    if (i > -1) users.value.splice(i, 1, u)
  }

  function filterByRole(role: string) {
    return users.value.filter((u) => u.role === role)
  }

  return { users, agents, loading, fetchUsers, fetchAllAgents, getById, addUser, updateUser, filterByRole }
})
