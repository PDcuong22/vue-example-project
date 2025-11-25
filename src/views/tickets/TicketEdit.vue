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
import TicketForm from '@/components/forms/TicketForm.vue'
import ticketService from '@/services/ticket.service'
import type { Ticket } from '@/types/models'
import type { UpdateTicketDto } from '@/types/dto'
import { useTicketsStore } from '@/stores/useTicketsStore'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const ticketsStore = useTicketsStore()

const ticket = ref<Ticket | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const fromStore = ticketsStore.getById(id)
    if (fromStore) {
      ticket.value = fromStore
    } else if (typeof ticketService.get === 'function') {
      ticket.value = await ticketService.get(id)
      console.log('Loaded ticket', ticket.value)
    } else {
      const all = await ticketService.list({ page: 1, size: 10 })
      ticket.value = all.data.find((t: Ticket) => t.id === id) ?? null
    }
  } finally {
    loading.value = false
  }
}

async function onSubmit(payload: UpdateTicketDto) {
  try {
    await ticketService.update(id, payload)
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
</style>
