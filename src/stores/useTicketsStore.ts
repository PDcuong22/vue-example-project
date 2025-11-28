import { defineStore } from 'pinia'
import { ref } from 'vue'
import ticketService from '@/services/ticket.service'
import type { Models } from '@/types'
import { getAllMeta } from '@/services/meta.service'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Models.Ticket[]>([])
  const total = ref(0)
  const loading = ref(false)

  const statuses = ref<Models.Meta[]>([])
  const priorities = ref<Models.Meta[]>([])
  const categories = ref<Models.Meta[]>([])

  const page = ref(1)
  const size = ref(10)
  const lastFilters = ref<Record<string, unknown> | null>(null)

  async function fetchTickets(filters?: {
    q?: string
    status_id?: number
    priority_id?: number
    category_id?: number
    page?: number
    size?: number
  }) {
    loading.value = true
    try {
      const params = {
        page: filters?.page ?? page.value,
        size: filters?.size ?? size.value,
        q: filters?.q,
        status_id: filters?.status_id,
        priority_id: filters?.priority_id,
        category_id: filters?.category_id,
      }
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
      )

      lastFilters.value = cleanParams

      const res = await ticketService.list(cleanParams)

      tickets.value = res.data ?? res
      total.value = res.meta?.total ?? (Array.isArray(res) ? res.length : tickets.value.length)

      page.value = Number(cleanParams['page'] ?? page.value)
      size.value = Number(cleanParams['size'] ?? size.value)

      return res
    } finally {
      loading.value = false
    }
  }

  function refresh() {
    return fetchTickets(lastFilters.value ?? { page: page.value, size: size.value })
  }

  function addTicket(t: Models.Ticket) {
    tickets.value.unshift(t)
    total.value += 1
  }

  function getById(id: number) {
    return tickets.value.find((t) => t.id === id) || null
  }

  function updateTicket(id: number, updated: Models.Ticket) {
    const index = tickets.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tickets.value[index] = updated
    }
  }

  async function loadMeta() {
  try {
    const res = await getAllMeta()
    statuses.value = res.statuses || []
    priorities.value = res.priorities || []
    categories.value = res.categories || []
  } catch (e) {
    console.error('Failed to load meta', e)
  }
}

  return {
    tickets,
    loading,
    total,
    page,
    size,
    statuses,
    categories,
    priorities,
    fetchTickets,
    refresh,
    addTicket,
    getById,
    updateTicket,
    loadMeta
  }
})
