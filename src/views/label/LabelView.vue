<template>
  <div>
    <el-button type="primary" @click="openCreate">Create Label</el-button>

    <el-table :data="labels">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Actions" width="180" align="right">
        <template #default="scope">
          <el-button type="text" @click="openEdit(scope.row)">Edit</el-button>
          <el-button type="text" class="text-red-600" @click="confirmDelete(scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="editing?.id ? 'Edit Category' : 'Create Category'"
      v-model="dialogVisible"
      width="420px"
      @close="resetForm"
    >
      <label-form ref="childRef" :model="editing" />
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="loading" form="category-form" @click="submitForm"
          >Save</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '@/api/axios'
import LabelForm from '@/components/forms/LabelForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Meta } from '@/types/models'

const labels = ref([])
const dialogVisible = ref(false)
const editing = ref()
const loading = ref(false)
const childRef = ref()

const load = async () => {
  try {
    const res = await axios.get('/labels')
    labels.value = res.data.data ?? res.data
  } catch {
    ElMessage.error('Load labels failed')
  }
}

const openCreate = () => {
  editing.value = {}
  dialogVisible.value = true
}

const openEdit = (row: Meta) => {
  editing.value = { id: row.id, name: row.name }
  dialogVisible.value = true
}

const resetForm = () => {
  editing.value = {}
}

const onSaved = () => {
  dialogVisible.value = false
  load()
  ElMessage.success('Saved')
}

const submitForm = async () => {
  if(loading.value) return
  loading.value = true
  try {
    const valid = await childRef.value.validateForm()
    if (!valid) return
    const payload = childRef.value.getFormData()
    if (payload.id) {
      await axios.put(`/labels/${payload.id}`, { name: payload.name })
    } else {
      await axios.post('/labels', { name: payload.name })
    }

    onSaved()
  } catch {
    ElMessage.error('Save failed')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (row: Meta) => {
  ElMessageBox.confirm(`Delete label: "${row.name}"?`, 'Confirm', { type: 'warning' })
    .then(async () => {
      try {
        await axios.delete(`/labels/${row.id}`)
        ElMessage.success('Deleted')
        load()
      } catch {
        ElMessage.error('Delete failed')
      }
    })
    .catch(() => {})
}

onMounted(load)
</script>
