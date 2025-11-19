<template>
  <div class="ticket-detail" style="max-width: 920px">
    <div
      class="page-header"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <h2>Ticket #{{ ticket?.id }}</h2>
      <div>
        <el-button size="small" @click="goEdit">Edit</el-button>
        <el-button size="small" type="danger" @click="confirmDelete">Delete</el-button>
      </div>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="ticket">
      <el-card>
        <p><strong>Title:</strong> {{ ticket.title }}</p>
        <p><strong>Assignee:</strong> {{ ticket.assignee }}</p>
        <p>
          <strong>Status:</strong>
          <el-tag :type="statusType(ticket.status)">{{ ticket.status }}</el-tag>
        </p>
        <p><strong>Created:</strong> {{ ticket.createdAt }}</p>
        <p><strong>Description:</strong></p>
        <p style="white-space: pre-wrap">{{ ticket.description }}</p>
      </el-card>
    </div>
    <div v-else>
      <el-empty description="Ticket not found" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
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

function statusType(s?: string) {
  if (s === 'open') return 'success'
  if (s === 'progress') return 'warning'
  if (s === 'closed') return 'info'
  return ''
}

function goEdit() {
  router.push({ name: 'tickets.edit', params: { id } }).catch(() => {})
}

function confirmDelete() {
  ElMessageBox.confirm('Delete this ticket?', 'Confirm', { type: 'warning' })
    .then(async () => {
      await ticketService.deleteTicket(id)
      ElMessage.success('Deleted')
      router.push({ name: 'tickets.list' }).catch(() => {})
    })
    .catch(() => {})
}

onMounted(load)
</script>

<style scoped>
/* optional */
</style>
