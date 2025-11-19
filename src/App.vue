<template>
  <div>
    <template v-if="showLayout">
      <el-container class="layout-root">
        <el-aside width="220px" class="sidebar">
          <div class="brand">MyApp</div>
          <SidebarMenu @update:title="pageTitle = $event" />
        </el-aside>

        <el-container>
          <el-header class="app-header">
            <h3 class="page-title">{{ pageTitle }}</h3>
            <div class="header-controls">
              <Profile :user="currentUser" @command="handleCommand" />
            </div>
          </el-header>

          <el-main class="app-main">
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </template>

    <template v-else>
      <!-- minimal wrapper for auth pages (centered) -->
      <div class="auth-wrapper">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SidebarMenu from './components/SidebarMenu.vue'
import Profile from './components/ProfileUser.vue'
import * as userService from '@/services/userService'
import * as authService from '@/services/authService'

const router = useRouter()
const route = useRoute()
const pageTitle = ref('Dashboard')

// const user = reactive({ name: 'admin', avatar: '' })

function logout() {
  console.log('User logged out')
  localStorage.removeItem('authToken')
  router.push({ name: 'auth.login' }).catch(() => router.push('/'))
}

function handleCommand(command: string) {
  if (command === 'logout') logout()
  else if (command === 'profile') router.push({ name: 'profile' }).catch(() => {})
}

const currentUser = ref()
onMounted(async () => {
  if (authService.isAuthenticated()) {
    currentUser.value = await userService.getCurrentUser()
    console.log('Current user:', currentUser.value)
  }
})

// hide layout when route.meta.hideLayout === true
const showLayout = computed(() => !(route.meta && route.meta.hideLayout))
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

/* HEADER */
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

/* MAIN / CARDS */
.app-main {
  padding: 28px 32px;
}

/* AUTH PAGES */
.auth-wrapper {
  min-height: calc(100vh - 0px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f7f8fa;
}
</style>
