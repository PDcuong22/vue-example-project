import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import activityService from '@/services/activity.service'
import type { Activity } from '@/types/models'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const loading = ref(false)
  const pagination = reactive({
    page: 1, size: 10, total: 0
  })
  const events = [
    { id: 1, name: 'created' },
    { id: 2, name: 'updated' },
    { id: 3, name: 'deleted' },
  ]

  const lastFilters = ref<Record<string, unknown> | null>(null)

  async function fetchActivities(filters?: {
    q?: string
    event?: string
    page?: number
    size?: number
  }) {
    if (loading.value) return
    loading.value = true
    try {
      const params = {
        page: filters?.page ?? pagination.page,
        size: filters?.size ?? pagination.size,
        q: filters?.q,
        event: filters?.event
      }
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
      )

      lastFilters.value = cleanParams
      const res = await activityService.getAllActivities(params)
      const list = res.data ?? []
      activities.value = list
      pagination.total = res.meta.total
    } finally {
      loading.value = false
    }
  }

  return { activities, loading, pagination, events, fetchActivities }
})
