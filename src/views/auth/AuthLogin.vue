<template>
  <div style="max-width: 420px; margin: 24px auto">
    <el-card>
      <h3>Login</h3>
      <el-form @submit.prevent="onSubmit" :model="form" label-width="0">
        <el-form-item>
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="Password" />
        </el-form-item>
        <div style="display: flex; gap: 8px; justify-content: flex-end">
          <el-button @click="toRegister">Register</el-button>
          <el-button type="primary" @click="onSubmit">Login</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import authService from '@/services/auth.service'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Dto } from '@/types'

const authStore = useAuthStore()
const router = useRouter()
const form = ref<Dto.LoginDto>({
  email: '',
  password: '',
})
async function onSubmit() {
  try {
    const res = await authService.login(form.value)
    console.log('login res:', res)

    // 1) persist token first
    if (res.access_token) {
      authStore.setToken(res.access_token)
    }

    // 2) ensure we have current user BEFORE navigating
    if (res.user) {
      authStore.setUser(res.user)
      console.log('Set current user after login:', res.user)
    } else {
      // backend didn't return user -> fetch it using token
      try {
        const me = await authService.fetchCurrentUser()
        authStore.setUser(me)
      } catch (err) {
        // nếu fetch user thất bại, clear token và báo lỗi
        authStore.setToken(null)
        console.error('Failed to fetch current user after login:', err)
        return
      }
    }

    // 3) now navigate
    await router.push({ name: 'home' })
  } catch (e) {
    ElMessage.error('Login failed' + (e instanceof Error ? `: ${e.message}` : ''))
  }
}

function toRegister() {
  router.push({ name: 'auth.register' }).catch(() => {})
}
</script>
