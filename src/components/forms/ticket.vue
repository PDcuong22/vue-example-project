<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
    <el-form-item label="Title" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>

    <el-form-item label="Assignee" prop="assignee">
      <el-input v-model="form.assignee" />
    </el-form-item>

    <el-form-item label="Status" prop="status">
      <el-select v-model="form.status" placeholder="Select">
        <el-option label="Open" value="open" />
        <el-option label="In Progress" value="progress" />
        <el-option label="Closed" value="closed" />
      </el-select>
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input v-model="form.description" type="textarea" rows="4" />
    </el-form-item>

    <div class="form-actions" style="text-align: right">
      <el-button @click="$emit('cancel')">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">Save</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  initial: { type: Object as () => any, default: null },
})
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref()
const form = reactive({
  id: null as number | null,
  title: '',
  assignee: '',
  status: 'open',
  description: '',
})

const rules = {
  title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
}

watch(
  () => props.initial,
  (v) => {
    if (v) {
      form.id = v.id ?? null
      form.title = v.title ?? ''
      form.assignee = v.assignee ?? ''
      form.status = v.status ?? 'open'
      form.description = v.description ?? ''
    } else {
      form.id = null
      form.title = ''
      form.assignee = ''
      form.status = 'open'
      form.description = ''
    }
  },
  { immediate: true },
)

function onSubmit() {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    emit('submit', { ...form })
  })
}
</script>

<style scoped>
.form-actions {
  margin-top: 12px;
}
</style>
