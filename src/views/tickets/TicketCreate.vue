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

    <ticket-form
      @submit="onSubmit"
      @cancel="onCancel"
      :all-categories="categories"
      :all-labels="labels"
      :priorities="priorities"
      :statuses="statuses"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import TicketForm from '@/components/forms/TicketForm.vue'
import ticketService from '@/services/ticket.service'
import { ref, onMounted } from 'vue'
import {getAllMeta} from '@/services/meta.service'
import type { Meta } from '@/types/models'
import type { CreateTicketDto } from '@/types/dto'
import { useTicketsStore } from '@/stores/useTicketsStore'

const router = useRouter()
const loading = ref(true)
const labels = ref<Meta[]>([])
const categories = ref<Meta[]>([])
const priorities = ref<Meta[]>([])
const statuses = ref<Meta[]>([])
const ticketsStore = useTicketsStore()

onMounted(async () => {
  loading.value = true
  try {
    const res = await getAllMeta()
    labels.value = res.labels
    categories.value = res.categories
    priorities.value = res.priorities
    statuses.value = res.statuses
  } catch (e) {
    console.error(e)
    ElMessage.error('Không thể tải dữ liệu mock')
  } finally {
    loading.value = false
  }
})

async function onSubmit(payload: CreateTicketDto, files?: File[]) {
  try {
    let createdTicket
    if (!files || files.length === 0) {
      createdTicket = await ticketService.create(payload)
    } else {
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v))
        else fd.append(k, String(v))
      })
      files.forEach((f) => fd.append('attachments[]', f))
      console.log('FormData entries:', Array.from(fd.entries()))
      // createdTicket = await ticketService.create(fd)
    }

    // ticketsStore.addTicket(createdTicket)
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
