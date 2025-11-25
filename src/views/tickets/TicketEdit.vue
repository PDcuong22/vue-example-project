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
    } else {
      const all = await ticketService.list({ page: 1, size: 10 })
      ticket.value = all.data.find((t: Ticket) => t.id === id) ?? null
    }
  } finally {
    loading.value = false
  }
}

async function onSubmit(data: {
  payload: UpdateTicketDto
  files?: File[]
  attachmentsToRemove?: number[]
}) {
  const { payload, files = [], attachmentsToRemove = [] } = data
  try {
    let updated
    const needsFormData = files.length > 0 || attachmentsToRemove.length > 0
    if (!needsFormData) {
      updated = await ticketService.update(id, payload)
    } else {
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        if (Array.isArray(v)) {
          v.forEach((item) => fd.append(`${k}[]`, String(item)))
        } else {
          fd.append(k, String(v))
        }
      })
      attachmentsToRemove.forEach((attId) => fd.append('attachments_to_remove[]', String(attId)))
      files.forEach((f) => fd.append('attachments[]', f))
      updated = await ticketService.update(id, fd)
    }

    if (updated) {
      ticketsStore.updateTicket(id, updated)
    }
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

<style scoped></style>
