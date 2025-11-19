<template>
  <div>
    <div
      class="list-toolbar"
      style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px"
    >
      <el-input
        v-model="filter.q"
        placeholder="Search"
        clearable
        @clear="onSearch"
        @keyup.enter="onSearch"
        style="max-width: 360px"
      />
      <div>
        <el-button type="primary" @click="create">New</el-button>
      </div>
    </div>

    <el-table :data="items" stripe style="width: 100%" :loading="loading" row-key="id">
      <el-table-column prop="id" label="#" width="60" />
      <el-table-column prop="createdAt" label="Date" width="140" />
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="assignee" label="Assignee" width="140" />
      <el-table-column prop="status" label="Status" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="220">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="viewTicket(row)">View</el-button>
          <el-button type="primary" size="small" @click="editTicket(row)">Edit</el-button>
          <el-button type="danger" size="small" @click="confirmDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 12px; display: flex; justify-content: flex-end">
      <el-pagination
        background
        :total="total"
        :page-size="pagination.size"
        :current-page="pagination.page"
        layout="prev, pager, next, sizes, total"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as ticketService from '@/services/ticketService'
import type { Ticket } from '@/models'
const router = useRouter()

const items = ref<Ticket[]>([])
const total = ref(0)
const loading = ref(false)

const pagination = reactive({ page: 1, size: 10 })
const filter = reactive({ q: '' })

async function fetchList() {
  loading.value = true
  try {
    const res = await ticketService.listTickets({
      page: pagination.page,
      size: pagination.size,
      q: filter.q,
    })
    items.value = res.items as Ticket[]
    total.value = res.total
  } catch (err) {
    ElMessage.error('Failed to load tickets' + (err instanceof Error ? `: ${err.message}` : ''))
  } finally {
    loading.value = false
  }
}

function onPageChange(page: number) {
  pagination.page = page
  fetchList()
}
function onSizeChange(size: number) {
  pagination.size = size
  pagination.page = 1
  fetchList()
}
function onSearch() {
  pagination.page = 1
  fetchList()
}

function create() {
  router.push({ name: 'tickets.create' }).catch(() => {})
}
function viewTicket(row: Ticket) {
  router.push({ name: 'tickets.detail', params: { id: row.id } }).catch(() => {})
}
function editTicket(row: Ticket) {
  router.push({ name: 'tickets.edit', params: { id: row.id } }).catch(() => {})
}
function confirmDelete(row: Ticket) {
  ElMessageBox.confirm(`Delete ticket "${row.title}"?`, 'Confirm', { type: 'warning' })
    .then(async () => {
      await ticketService.deleteTicket(row.id)
      ElMessage.success('Deleted')
      // if current page became empty, move to previous page if possible
      if (items.value.length === 1 && pagination.page > 1) pagination.page--
      fetchList()
    })
    .catch(() => {})
}

function statusType(status?: string) {
  if (status === 'open') return 'success'
  if (status === 'progress') return 'warning'
  if (status === 'closed') return 'info'
  return ''
}

onMounted(fetchList)
</script>

<style scoped>
.list-toolbar {
  display: flex;
  align-items: center;
}
</style>
