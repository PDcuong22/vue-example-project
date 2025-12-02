<template>
  <div>
    <!-- Toolbar -->
    <div
      class="list-toolbar"
      style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px"
    >
      <div style="display: flex; gap: 12px; align-items: center">
        <el-input
          v-model="filters.q"
          placeholder="Search name/email"
          clearable
          @clear="onSearch"
          @keyup.enter="onSearch"
          style="max-width: 260px"
        />

        <el-select
          v-model="filters.role_id"
          placeholder="Role"
          clearable
          style="width: 160px"
          @change="onFilterChange"
        >
          <el-option v-for="r in userStore.roles" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>

        <el-button type="primary" @click="openCreate">Create User</el-button>
      </div>
    </div>

    <el-table :data="userStore.users" stripe border v-loading="userStore.loading" row-key="id">
      <el-table-column type="index" label="#" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Role" />
      <el-table-column label="Created At">
        <template #default="scoped">
          {{ formatDate(scoped.row.created_at) }}
        </template>
      </el-table-column>

      <el-table-column label="Actions">
        <template #default="scoped">
          <el-button size="small" @click="openEdit(scoped.row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteUser(scoped.row)"> Delete </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 12px; display: flex; justify-content: flex-end">
      <el-pagination
        background
        :total="userStore.pagination.total"
        :page-size="userStore.pagination.size"
        :current-page="userStore.pagination.page"
        layout="prev, pager, next, sizes, total"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
    <user-form
      v-model="dialogVisible"
      :initial-data="selectedUser"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUsersStore } from '@/stores/useUsersStore'
import UserForm from '@/components/forms/UserForm.vue'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User } from '@/types/models'
import UserService from '@/services/user.service'

const userStore = useUsersStore()

const filters = ref({
  q: '',
  role_id: null,
})

const dialogVisible = ref(false)
const selectedUser = ref<UpdateUserDto>()

function openCreate() {
  selectedUser.value = undefined
  dialogVisible.value = true
}

function openEdit(user: User) {
  const role = userStore.roles.find((r) => r.name === user.role)
  selectedUser.value = { ...user, role_id: role ? role.id : undefined }
  dialogVisible.value = true
}

async function handleSubmit(formData: CreateUserDto) {
  if (formData.password || formData.password_confirmation) {
    if (formData.password !== formData.password_confirmation) {
      ElMessage.error('Password and confirm password do not match')
      return
    }
    try {
      await userStore.addUser(formData)
      ElMessage.success('User created successfully')
    } catch {
      ElMessage.error('Create user failed')
    }
  } else {
    try {
      if (!selectedUser.value?.id) return
      await userStore.updateUser(selectedUser.value.id, formData as UpdateUserDto)
      ElMessage.success('User updated successfully')
    } catch {
      ElMessage.error('Update user failed')
    }
  }

  dialogVisible.value = false
}

function handleCancel() {
  dialogVisible.value = false
}

const fetchUsers = async () =>
  await userStore.fetchUsers({
    q: filters.value.q || undefined,
    role_id: filters.value.role_id || undefined,
  })

function onSearch() {
  userStore.pagination.page = 1
  fetchUsers()
}

function onFilterChange() {
  userStore.pagination.page = 1
  fetchUsers()
}

function onPageChange(page: number) {
  userStore.pagination.page = page
  fetchUsers()
}

function onSizeChange(size: number) {
  userStore.pagination.size = size
  userStore.pagination.page = 1
  fetchUsers()
}

async function deleteUser(row: User) {
  ElMessageBox.confirm(`Delete ticket "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(async () => {
      try {
        await UserService.remove(row.id)
        ElMessage.success('Deleted')
        if (userStore.users.length === 1 && userStore.pagination.page > 1)
          userStore.pagination.page--
        fetchUsers()
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Delete failed'
        ElMessage.error(msg)
      }
    })
    .catch(() => {})
}

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('vi-VN')

onMounted(async () => {
  await Promise.all([userStore.fetchRoles(), fetchUsers()])
})
</script>
