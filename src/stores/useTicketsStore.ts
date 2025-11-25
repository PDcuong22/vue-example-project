import { defineStore } from 'pinia'
import { ref } from 'vue'
import ticketService from '@/services/ticket.service'
import type { Models } from '@/types'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Models.Ticket[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function fetchTickets() {
    loading.value = true
    try {
      const res = await ticketService.list()
      tickets.value = res.data
      total.value = res.meta?.total ?? res.data.length
    } finally {
      loading.value = false
    }
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
  return { tickets, loading, total, fetchTickets, addTicket, getById, updateTicket }
})
