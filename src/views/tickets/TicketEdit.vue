<template>
  <div class="ticket-page" style="max-width: 920px">
    <div
      class="page-header"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <h2>Edit Ticket</h2>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else>
      <ticket-form :initial="ticket" @submit="onSubmit" @cancel="onCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import TicketForm from '@/components/forms/ticket.vue'
import * as ticketService from '@/services/ticketService'
import type { Ticket } from '@/models'
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const ticket = ref<Ticket | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    // try getTicket, fallback to list search if not available
    if (typeof ticketService.getTicket === 'function') {
      ticket.value = await ticketService.getTicket(id)
    } else {
      const all = await ticketService.listTickets({ page: 1, size: 1000 })
      ticket.value = all.items.find((t: Ticket) => t.id === id) ?? null
    }
  } finally {
    loading.value = false
  }
}

async function onSubmit(payload: Ticket) {
  try {
    await ticketService.updateTicket(id, payload)
    ElMessage.success('Ticket updated')
    router.push({ name: 'tickets.list' }).catch(() => {})
  } catch {
    ElMessage.error('Update failed')
  }
}

function onCancel() {
  router.back()
}

onMounted(load)
</script>

<style scoped>
/* optional */
</style>
