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
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="description" label="Description" width="140" />

      <!-- categories column -->
      <el-table-column label="Categories" width="180">
        <template #default="{ row }">
          <div class="tags-cell">
            <template v-for="(c) in (row.categories || []).slice(0, 2)" :key="`cat-${c.id}`">
              <el-tag size="small" type="info" class="tag-item">{{ c.name }}</el-tag>
            </template>

            <template v-if="(row.categories || []).length > 2">
              <el-popover placement="top" width="220" trigger="hover">
                <div class="pop-list">
                  <el-tag
                    v-for="c in (row.categories || []).slice(2)"
                    :key="`cat-more-${c.id}`"
                    size="small"
                    class="pop-tag"
                  >
                    {{ c.name }}
                  </el-tag>
                </div>
                <template #reference>
                  <el-tag size="small" class="more-tag"
                    >+{{ (row.categories || []).length - 2 }}</el-tag
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
            <template v-for="(l) in (row.labels || []).slice(0, 2)" :key="`lab-${l.id}`">
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

      <el-table-column prop="assigned_to.name" label="Assigned To" width="140" />
      <el-table-column prop="status.name" label="Status" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status?.name?.toLowerCase())">{{
            row.status?.name
          }}</el-tag>
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
import ticketService from '@/services/ticket.service'
import type { Models } from '@/types'
const router = useRouter()

const items = ref<Models.Ticket[]>([])
const total = ref(0)
const loading = ref(false)

const pagination = reactive({ page: 1, size: 10 })
const filter = reactive({ q: '' })

async function fetchList() {
  loading.value = true
  try {
    const res = await ticketService.list()
    items.value = res.data
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
