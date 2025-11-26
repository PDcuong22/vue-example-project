<template>
  <el-container class="layout-root">
    <el-aside width="220px" class="sidebar">
      <div class="brand">MyApp</div>
      <SidebarMenu @update:title="pageTitle = $event" />
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <h3 class="page-title">{{ pageTitle }}</h3>
        <div class="header-controls">
          <Profile :user="authStore.user" @command="handleCommand" />
        </div>
      </el-header>

      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SidebarMenu from '@/components/SidebarMenu.vue'
import Profile from '@/components/ProfileUser.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const pageTitle = ref('Dashboard')

function logout() {
  authStore.logout()
  router.push({ name: 'auth.login' }).catch(() => router.push('/'))
}

function handleCommand(command: string) {
  if (command === 'logout') logout()
  else if (command === 'profile') router.push({ name: 'profile' }).catch(() => {})
}
</script>

<style scoped>
.layout-root {
  height: 100vh;
  background: #f7f8fa;
  color: #222;
}

/* SIDEBAR */
.sidebar {
  background: #ffffff;
  border-right: 1px solid #edf0f3;
  padding-top: 28px;
}
.brand {
  font-weight: 700;
  font-size: 20px;
  padding: 0 20px 20px;
}
.app-menu {
  border-right: none;
}
.el-menu-item {
  height: 64px;
  align-items: center;
  padding-left: 22px;
  font-weight: 600;
}
.el-menu-item .el-icon {
  margin-right: 14px;
  font-size: 20px;
  color: #222;
}
.label {
  font-size: 18px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  padding: 28px 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}
.page-title {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: #111827;
}

.header-controls .logout-btn {
  color: #374151;
}

.app-main {
  padding: 28px 32px;
}
</style>
