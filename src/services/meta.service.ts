import api from '@/api/axios' // <-- dùng instance thay vì axios raw
import type { Meta } from '@/types/models'

export interface MetaData {
  labels: Meta[]
  priorities: Meta[]
  categories: Meta[]
  statuses: Meta[]
}

const ENDPOINTS = {
  labels: '/labels',
  priorities: '/priorities',
  categories: '/categories',
  statuses: '/statuses',
}

const CACHE_TTL = 1000 * 60 * 5 // 5 phút
let cache: { data: MetaData; expiresAt: number } | null = null

async function fetchResource<T>(url: string): Promise<T[]> {
  try {
    const res = await api.get(url)
    const payload = res.data?.data ?? res.data
    if (!payload) return []
    return Array.isArray(payload)
      ? (payload as T[])
      : ((payload.items ?? payload.data ?? []) as T[])
  } catch (err) {
    console.error('fetchResource error', err)
    return []
  }
}

export async function getLabels(): Promise<Meta[]> {
  return fetchResource<Meta>(ENDPOINTS.labels)
}

export async function getPriorities(): Promise<Meta[]> {
  return fetchResource<Meta>(ENDPOINTS.priorities)
}

export async function getCategories(): Promise<Meta[]> {
  return fetchResource<Meta>(ENDPOINTS.categories)
}

export async function getStatuses(): Promise<Meta[]> {
  return fetchResource<Meta>(ENDPOINTS.statuses)
}

export async function getAllMeta(forceRefresh = false): Promise<MetaData> {
  const now = Date.now()
  if (!forceRefresh && cache && cache.expiresAt > now) {
    return cache.data
  }

  const [labels, priorities, categories, statuses] = await Promise.all([
    getLabels(),
    getPriorities(),
    getCategories(),
    getStatuses(),
  ])

  const data: MetaData = { labels, priorities, categories, statuses }
  cache = { data, expiresAt: now + CACHE_TTL }
  return data
}

export default {
  getLabels,
  getPriorities,
  getCategories,
  getStatuses,
  getAllMeta,
}
