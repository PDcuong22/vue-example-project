<template>
  <div style="max-width: 420px; margin: 24px auto">
    <el-card>
      <h3>Register</h3>
      <el-form @submit.prevent="onSubmit" :model="form" label-width="0">
        <el-form-item>
          <el-input v-model="form.name" placeholder="Name" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="Password" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm password" />
        </el-form-item>

        <div style="display: flex; gap: 8px; justify-content: flex-end">
          <el-button @click="toLogin">Back to login</el-button>
          <el-button type="primary" @click="onSubmit">Register</el-button>
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

const router = useRouter()
const form = ref({ name: '', email: '', password: '', confirmPassword: '' })

async function onSubmit() {
  if (!form.value.name || !form.value.email || !form.value.password) {
    ElMessage.error('Please fill name, email and password')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    ElMessage.error('Password and confirm password do not match')
    return
  }

  try {
    await authService.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword,
    })
    ElMessage.success('Account created — please login')
    router.push({ name: 'auth.login' }).catch(() => {})
  } catch {
    ElMessage.error('Register failed')
  }
}

function toLogin() {
  router.push({ name: 'auth.login' }).catch(() => {})
}
</script>
