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

const router = useRouter()
const loading = ref(true)
const labels = ref<Meta[]>([])
const categories = ref<Meta[]>([])
const priorities = ref<Meta[]>([])
const statuses = ref<Meta[]>([])
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

async function onSubmit(payload: CreateTicketDto) {
  try {
    await ticketService.create(payload)
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
