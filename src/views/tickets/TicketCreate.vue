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
      <h2>New Ticket</h2>
    </div>

    <ticket-form @submit="onSubmit" @cancel="onCancel" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import TicketForm from '@/components/forms/ticket.vue'
import * as ticketService from '@/services/ticketService'
import type { Ticket } from '@/models'

const router = useRouter()

async function onSubmit(payload: Ticket) {
  try {
    await ticketService.createTicket(payload)
    ElMessage.success('Ticket created')
    router.push({ name: 'tickets.list' }).catch(() => {})
  } catch (e) {
    ElMessage.error('Create failed' + (e instanceof Error ? `: ${e.message}` : ''))
  }
}

function onCancel() {
  router.back()
}
</script>

<style scoped>
/* optional styles */
</style>
