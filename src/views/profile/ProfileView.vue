<template>
  <div class="p-4">
    <!-- Profile Card -->
    <el-card class="mb-4">
      <div class="flex items-center">
        <img :src="authStore.user?.avatar_url" class="w-20 h-20 rounded-full mr-4" />
        <div>
          <h2 class="text-xl font-bold">{{ authStore.user?.name }}</h2>
          <p>{{ authStore.user?.email }}</p>
          <p>Role: {{ authStore.user?.role }}</p>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Edit Profile" name="edit">
        <profile-form ref="profileFormRef" :initialData="authStore.user ?? undefined" />
      </el-tab-pane>
      <el-tab-pane label="Change Password" name="password">
        <change-password ref="passwordFormRef" />
      </el-tab-pane>
    </el-tabs>

    <div class="mt-4 flex justify-end gap-2">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" :loading="loading" @click="onSave">Save</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileForm from './ProfileForm.vue'
import ChangePassword from './ChangePassword.vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/useAuthStore'
import authService from '@/services/auth.service'

const authStore = useAuthStore()
const profileFormRef = ref()
const passwordFormRef = ref()
const loading = ref(false)
const activeTab = ref('edit')

const cancel = () => {
  profileFormRef.value?.resetForm()
  passwordFormRef.value?.resetForm()
}

const onSave = async () => {
  if (loading.value) return
  loading.value = true

  try {
    if (activeTab.value === 'edit') {
      const valid = await profileFormRef.value?.validateForm()
      if (!valid) return
      const payload = profileFormRef.value.getFormData()
      const res = await authService.updateProfile(payload)
      authStore.setUser(res)
      ElMessage.success('Profile updated successfully!')
    } else if (activeTab.value === 'password') {
      const valid = await passwordFormRef.value.validateForm()
      if (!valid) return
      const payload = passwordFormRef.value.getFormData()
      await authService.updatePassword(payload)
      ElMessage.success('Password changed successfully!')
      passwordFormRef.value.resetForm()
    }
  } catch {
    ElMessage.error('Operation failed')
  } finally {
    loading.value = false
  }
}
</script>
