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
import * as userService from '@/services/userService'

const router = useRouter()
const form = ref({ name: '', email: '', password: '' })

async function onSubmit() {
  try {
    await userService.createUser({ name: form.value.name, email: form.value.email })
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
