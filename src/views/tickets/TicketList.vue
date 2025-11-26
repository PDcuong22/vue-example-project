<template>
  <div>
    <div
      class="list-toolbar"
      style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px"
    >
      <div style="display: flex; gap: 12px; align-items: center">
        <el-input
          v-model="filter.q"
          placeholder="Search"
          clearable
          @clear="onSearch"
          @keyup.enter="onSearch"
          style="max-width: 360px"
        />
        <el-select
          v-model="filter.status"
          placeholder="Status"
          clearable
          style="width: 180px"
          @change="onFilterChange"
        >
          <el-option v-for="s in statuses" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>

        <el-select
          v-model="filter.priority"
          placeholder="Priority"
          clearable
          style="width: 160px"
          @change="onFilterChange"
        >
          <el-option v-for="p in priorities" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>

        <el-select
          v-model="filter.category"
          placeholder="Category"
          clearable
          style="width: 160px"
          @change="onFilterChange"
        >
          <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </div>

      <div>
        <el-button type="primary" @click="create" v-if="!authStore.isAgent">New</el-button>
      </div>
    </div>

    <el-table
      :data="ticketsStore.tickets"
      :style="{ width: '100%' }"
      stripe
      v-loading="loading"
      row-key="id"
    >
      <el-table-column prop="id" label="#" width="60" />

      <!-- Title column -->
      <el-table-column label="Title">
        <template #default="{ row }">
          <el-link @click="openComments(row)" underline>{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" width="140" />

      <!-- categories column -->
      <el-table-column label="Categories" width="180">
        <template #default="{ row }">
          <div class="tags-cell">
            <template v-for="c in (row.categories || []).slice(0, 1)" :key="`cat-${c.id}`">
              <el-tag size="small" type="info" class="tag-item">{{ c.name }}</el-tag>
            </template>

            <template v-if="(row.categories || []).length > 1">
              <el-popover placement="top" width="220" trigger="hover">
                <div class="pop-list">
                  <el-tag
                    v-for="c in (row.categories || []).slice(0, 1)"
                    :key="`cat-more-${c.id}`"
                    size="small"
                    class="pop-tag"
                  >
                    {{ c.name }}
                  </el-tag>
                </div>
                <template #reference>
                  <el-tag size="small" class="more-tag"
                    >+{{ (row.categories || []).length - 1 }}</el-tag
                  >
                </template>
              </el-popover>
            </template>
          </div>
        </template>
      </el-table-column>

      <!-- labels column -->
      <el-table-column label="Labels" width="180">
        <template #default="{ row }">
          <div class="tags-cell">
            <template v-for="l in (row.labels || []).slice(0, 2)" :key="`lab-${l.id}`">
              <el-tag size="small" type="warning" class="tag-item">{{ l.name }}</el-tag>
            </template>

            <template v-if="(row.labels || []).length > 2">
              <el-popover placement="top" width="220" trigger="hover">
                <div class="pop-list">
                  <el-tag
                    v-for="l in (row.labels || []).slice(2)"
                    :key="`lab-more-${l.id}`"
                    size="small"
                    class="pop-tag"
                  >
                    {{ l.name }}
                  </el-tag>
                </div>
                <template #reference>
                  <el-tag size="small" class="more-tag"
                    >+{{ (row.labels || []).length - 2 }}</el-tag
                  >
                </template>
              </el-popover>
            </template>
          </div>
        </template>
      </el-table-column>

      <!-- Status column -->
      <el-table-column prop="status.name" label="Status" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status?.name?.toLowerCase())">{{
            row.status?.name
          }}</el-tag>
        </template>
      </el-table-column>

      <!-- Assignee column -->
      <el-table-column
        prop="assigned_to.name"
        label="Assigned To"
        width="140"
        v-if="authStore.isAdmin"
      />

      <!-- Actions column -->
      <el-table-column
        label="Actions"
        header-align="center"
        align="center"
        width="220"
        v-if="authStore.isAgent || authStore.isAdmin"
      >
        <template #default="{ row }">
          <el-button type="text" size="small" @click="viewTicket(row)">View</el-button>
          <el-button type="primary" size="small" @click="editTicket(row)">Edit</el-button>
          <el-button type="danger" size="small" @click="confirmDelete(row)" v-if="authStore.isAdmin"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 12px; display: flex; justify-content: flex-end">
      <el-pagination
        background
        :total="ticketsStore.total"
        :page-size="pagination.size"
        :current-page="pagination.page"
        layout="prev, pager, next, sizes, total"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
  <TicketCommentsDialog v-model="showCommentsDialog" :ticket="selectedTicket" />
</template>

<script setup lang="ts">
import TicketCommentsDialog from '@/components/TicketCommentsDialog.vue'
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ticketService from '@/services/ticket.service'
import { getAllMeta } from '@/services/meta.service'
import type { Models } from '@/types'
import { useTicketsStore } from '@/stores/useTicketsStore'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const ticketsStore = useTicketsStore()
const authStore = useAuthStore()

const loading = ticketsStore.loading

const pagination = reactive({ page: 1, size: 10 })
const filter = reactive({
  q: '',
  status: null as number | null,
  priority: null as number | null,
  category: null as number | null,
})

const showCommentsDialog = ref(false)
const selectedTicket = ref<Models.Ticket | null>(null)

function openComments(ticket: Models.Ticket) {
  selectedTicket.value = ticket
  showCommentsDialog.value = true
}

const statuses = ref<Models.Meta[]>([])
const priorities = ref<Models.Meta[]>([])
const categories = ref<Models.Meta[]>([])

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

async function fetchList() {
  // pass filters + pagination to store fetch function
  await ticketsStore.fetchTickets({
    q: filter.q || undefined,
    status_id: filter.status || undefined,
    priority_id: filter.priority || undefined,
    category_id: filter.category || undefined,
    page: pagination.page,
    size: pagination.size,
  })
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
function onFilterChange() {
  pagination.page = 1
  fetchList()
}

function create() {
  router.push({ name: 'tickets.create' }).catch(() => {})
}
function viewTicket(row: Models.Ticket) {
  router.push({ name: 'tickets.detail', params: { id: row.id } }).catch(() => {})
}
function editTicket(row: Models.Ticket) {
  router.push({ name: 'tickets.edit', params: { id: row.id } }).catch(() => {})
}
function confirmDelete(row: Models.Ticket) {
  ElMessageBox.confirm(`Delete ticket "${row.title}"?`, 'Confirm', { type: 'warning' })
    .then(async () => {
      await ticketService.delete(row.id)
      ElMessage.success('Deleted')
      if (ticketsStore.tickets.length === 1 && pagination.page > 1) pagination.page--
      fetchList()
    })
    .catch(() => {})
}

function statusType(status?: string) {
  if (status === 'open') return 'success'
  if (status === 'progress') return 'warning'
  if (status === 'closed') return 'info'
  return 'info'
}

onMounted(async () => {
  await loadMeta()
  await fetchList()
})
</script>

<style scoped>
.list-toolbar {
  display: flex;
  align-items: center;
}

.tags-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.tag-item {
  margin: 0 2px;
}

.more-tag {
  background: #f0f2f5;
  cursor: pointer;
}

.pop-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pop-tag {
  margin: 2px 0;
}
</style>
