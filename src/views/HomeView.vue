<template>
  <div class="page-content">
    <div class="cards-grid">
      <el-card
        v-for="card in visibleCards"
        :key="card.key"
        class="stat-card clickable"
        shadow="hover"
        @click="goToList(card.key)"
      >
        <div class="card-inner">
          <div class="icon-wrap" :style="{ background: card.bg }">
            <el-icon :style="{ color: card.color }">
              <Ticket />
            </el-icon>
          </div>

          <div class="meta">
            <div class="title">{{ card.title }}</div>
            <div class="number" v-if="!loading">{{ card.count }}</div>
            <el-skeleton :loading="loading" animated :rows="1" v-else>
              <template #template>
                <div class="skeleton-number"></div>
              </template>
            </el-skeleton>
            <div class="subtitle" v-if="card.subtitle">{{ card.subtitle }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Ticket } from '@element-plus/icons-vue'
import ticketService from '@/services/ticket.service'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const loading = ref(false)
const stats = ref({ total: 0, open: 0, closed: 0 })
const authStore = useAuthStore()

async function loadStats() {
  loading.value = true
  try {
    const res = await ticketService.stats()
    stats.value = {
      total: Number(res.total ?? 0),
      open: Number(res.open ?? 0),
      closed: Number(res.closed ?? 0),
    }
  } catch (e) {
    console.error('Failed to load ticket stats', e)
  } finally {
    loading.value = false
  }
}

function goToList(key: string) {
  if (key === 'total') {
    router.push({ name: 'tickets.list', query: {} }).catch(() => {})
  } else {
    router.push({ name: 'tickets.list', query: { status: key } }).catch(() => {})
  }
}

onMounted(loadStats)

const statCards = computed(() => [
  {
    key: 'total',
    title: 'Total tickets',
    count: stats.value.total,
    bg: 'linear-gradient(135deg,#fff3e0,#fff0ea)',
    color: '#ff6a3d',
    subtitle: '',
  },
  {
    key: 'Open',
    title: 'Open tickets',
    count: stats.value.open,
    bg: 'linear-gradient(135deg,#ecfdf5,#e6fff2)',
    color: '#10b981',
    subtitle: '',
  },
  {
    key: 'Closed',
    title: 'Closed tickets',
    count: stats.value.closed,
    bg: 'linear-gradient(135deg,#eef2ff,#f7f8ff)',
    color: '#6366f1',
    subtitle: '',
  },
])

const visibleCards = computed(() => (authStore.isAdmin ? statCards.value : statCards.value.filter((c) => c.key === 'total')))
</script>

<style scoped>
.page-content {
  padding: 20px 28px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  align-items: start;
  max-width: 1100px;
}

.stat-card {
  padding: 12px;
  border-radius: 12px;
  transition:
    transform 0.14s ease,
    box-shadow 0.14s ease;
  background: #fff;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.card-inner {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(12, 20, 40, 0.04);
}

.icon-wrap .el-icon {
  font-size: 26px;
  line-height: 1;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.title {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.number {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.skeleton-number {
  height: 34px;
  width: 90px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f3f4f6, #eceff1);
}

.subtitle {
  font-size: 12px;
  color: #9ca3af;
}

.stat-card.clickable {
  cursor: pointer;
}
</style>
