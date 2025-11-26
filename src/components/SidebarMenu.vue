<template>
  <el-menu :default-active="currentActive" router class="app-menu" @select="onSelect">
    <MenuDashboard />
    <MenuTickets />
    <MenuUsers v-if="authStore.isAdmin" />
    <MenuTicketLogs v-if="authStore.isAdmin" />
    <MenuCategories v-if="authStore.isAdmin" />
    <MenuLabels v-if="authStore.isAdmin" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import MenuDashboard from './menu-items/MenuDashboard.vue'
import MenuTickets from './menu-items/MenuTickets.vue'
import MenuUsers from './menu-items/MenuUsers.vue'
import MenuTicketLogs from './menu-items/MenuTicketLogs.vue'
import MenuCategories from './menu-items/MenuCategories.vue'
import MenuLabels from './menu-items/MenuLabels.vue'
import { defineEmits } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'



const emit = defineEmits<{
  (e: 'update:title', title: string): void
}>()

const route = useRoute()
const authStore = useAuthStore()

const currentActive = computed(() => {
  const seg = route.path.split('/').filter(Boolean)[0]
  return seg ? `${seg}` : 'dashboard'
})

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  tickets: 'Tickets',
  'ticket-logs': 'Ticket Logs',
  categories: 'Categories',
  labels: 'Labels',
  users: 'Users',
}

function onSelect(index: string) {
  const t = titles[index] || ''
  if (t) emit('update:title', t)
}

// <-- new: emit title when route/currentActive changes (includes reload)
watch(
  currentActive,
  (v) => {
    const t = titles[v] || ''
    if (t) emit('update:title', t)
  },
  { immediate: true },
)
</script>

<style scoped>
.app-menu {
  border-right: none;
}
.el-menu-item,
.el-sub-menu__title {
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 22px;
  font-weight: 600;
}
.el-menu-item .el-icon,
.el-sub-menu__title .el-icon {
  margin-right: 14px;
  font-size: 20px;
  color: #222;
}
.label {
  font-size: 18px;
}
</style>
