<template>
  <div>
    <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px">
      <div style="display: flex; gap: 12px; align-items: center">
        <el-input
          v-model="filters.q"
          placeholder="Search"
          clearable
          @clear="onSearch"
          @keyup.enter="onSearch"
          style="max-width: 360px"
        />

        <el-select
          v-model="filters.event"
          placeholder="Event"
          clearable
          style="width: 160px"
          @change="onFilterChange"
        >
          <el-option
            v-for="e in activityStore.events"
            :key="e.id"
            :label="e.name"
            :value="e.name"
          />
        </el-select>
      </div>
    </div>

    <el-table
      :data="activityStore.activities"
      stripe
      v-loading="activityStore.loading"
      row-key="id"
      @row-click="onRowClick"
      :row-class-name="rowClassName"
    >
      <el-table-column prop="id" label="#" />
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="event" label="Event" />
      <el-table-column prop="causer" label="Causer" />
      <el-table-column label="Created At">
        <template #default="scoped">
          {{ formatDate(scoped.row.created_at) }}
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 12px; display: flex; justify-content: flex-end">
      <el-pagination
        background
        :total="activityStore.pagination.total"
        :page-size="activityStore.pagination.size"
        :current-page="activityStore.pagination.page"
        layout="prev, pager, next, sizes, total"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="Activity Detail" width="600px">
    <div class="bg-gray-100 p-3 rounded">
      <template v-if="propertyChanges.length">
        <div v-for="change in propertyChanges" :key="change.key" style="margin-bottom: 12px">
          <div style="font-weight: 600">{{ change.key }}</div>
          <div style="display: flex; gap: 8px; align-items: flex-start">
            <pre style="margin: 0; background: transparent; padding: 0">{{
              formatValue(change.oldValue)
            }}</pre>
            <div style="min-width: 24px; text-align: center">→</div>
            <pre style="margin: 0; background: transparent; padding: 0">{{
              formatValue(change.newValue)
            }}</pre>
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/models'
import { reactive, ref, computed } from 'vue'
import { useActivityStore } from '@/stores/useActivityStore'

const activityStore = useActivityStore()
const dialogVisible = ref(false)
const selectedActivity = ref<Activity | null>(null)

const filters = reactive({
  q: '',
  event: '',
})

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('vi-VN')

const fetchActivities = async () => {
  await activityStore.fetchActivities({
    q: filters.q || undefined,
    event: filters.event || undefined,
  })
}

function onRowClick(row: Activity) {
  selectedActivity.value = row
  dialogVisible.value = true
}

function rowClassName({ row }: { row: Activity }) {
  return row ? 'clickable-row' : ''
}

function onPageChange(page: number) {
  activityStore.pagination.page = page
  fetchActivities()
}
function onSizeChange(size: number) {
  activityStore.pagination.size = size
  activityStore.pagination.page = 1
  fetchActivities()
}
function onSearch() {
  activityStore.pagination.page = 1
  fetchActivities()
}
function onFilterChange() {
  activityStore.pagination.page = 1
  fetchActivities()
}

type PropertyChange = { key: string; oldValue: unknown; newValue: unknown }

function compare(a:unknown, b:unknown) {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return a === b
  }
}

const propertyChanges = computed<PropertyChange[]>(() => {
  const activity = selectedActivity.value
  if (!activity) return []
  const attributes = activity.properties.attributes ?? {}
  const old = activity.properties.old ?? {}

  const keys = Array.from(new Set([...Object.keys(attributes), ...Object.keys(old)]))
  const changes: PropertyChange[] = []

  for (const key of keys) {
    const newValue = attributes[key]
    const oldValue = old[key]
    if (compare(newValue, oldValue)) continue
    changes.push({ key, oldValue, newValue })
  }
  return changes
})

function formatValue(v: unknown) {
  if (v === null || v === undefined) return String(v)
  if (typeof v === 'object') return JSON.stringify(v, null, 2)
  return String(v)
}

fetchActivities()
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
.clickable-row {
  cursor: pointer;
}
</style>
