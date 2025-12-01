import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import userService from '@/services/user.service'
import type { AuthUser, Meta, User } from '@/types/models'
import roleService from '@/services/role.service'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const agents = ref<AuthUser[]>([])
  const loading = ref(false)
  const roles = ref<Meta[]>([])

  const pagination = reactive({
    page: 1,
    size: 10,
    total: 0,
  })

  async function fetchUsers(filters?: {
    q?: string
    role_id?: number
    page?: number
    size?: number
  }) {
    if (loading.value) return
    loading.value = true
    try {
      const params = {
        page: filters?.page ?? pagination.page,
        size: filters?.size ?? pagination.size,
        q: filters?.q,
        role_id: filters?.role_id,
      }
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
      )

      const listUser = await userService.fetchAll(cleanParams)
      users.value = listUser?.data ?? listUser ?? []
      pagination.total = listUser.meta?.total ?? users.value.length
    } finally {
      loading.value = false
    }
  }

  async function fetchAllAgents(force = false) {
    if (!force && agents.value.length > 0) return agents.value
    if (loading.value) return
    loading.value = true
    try {
      const res = await userService.listAgents()
      const list = res ?? []
      agents.value = list
    } finally {
      loading.value = false
    }
  }

  async function fetchRoles() {
    const listRole = await roleService.getAllRoles()
    roles.value = listRole?.data ?? listRole ?? []
  }

  function getById(id: number) {
    return users.value.find((u) => u.id === id) ?? null
  }

  async function addUser(u: CreateUserDto) {
    if (loading.value) return
    loading.value = true
    try {
      const user = await userService.create(u)
      users.value.unshift(user)
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: number, u: UpdateUserDto) {
    if (loading.value) return
    loading.value = true
    try {
      const updatedUser = await userService.update(id, u)
      const index = users.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
    } finally {
      loading.value = false
    }
  }

  function filterByRole(role: string) {
    return users.value.filter((u) => u.role === role)
  }

  return {
    users,
    agents,
    loading,
    pagination,
    roles,
    fetchUsers,
    fetchAllAgents,
    fetchRoles,
    getById,
    addUser,
    updateUser,
    filterByRole,
  }
})
