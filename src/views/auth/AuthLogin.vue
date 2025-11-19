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
import * as userService from '@/services/userService'
import * as authService from '@/services/authService'

const router = useRouter()
const form = ref({ email: '', password: '' })

async function onSubmit() {
  try {
    const user = await userService.login(form.value.email)
    // mock token — replace with real token from API
    authService.setToken('mock-token:' + String(user?.id ?? ''))
    ElMessage.success('Logged in')
    router.push({ name: 'home' }).catch(() => {})
  } catch (e) {
    ElMessage.error('Login failed' + (e instanceof Error ? `: ${e.message}` : ''))
  }
}

function toRegister() {
  router.push({ name: 'auth.register' }).catch(() => {})
}
</script>
