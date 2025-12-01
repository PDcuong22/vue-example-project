<template>
  <el-dialog v-model="visible" :title="isEdit ? 'Edit User' : 'Create User'" width="600px" @closed="onClosed">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" placeholder="Enter name" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="Enter email" />
      </el-form-item>

      <el-form-item v-if="!isEdit" label="Password" prop="password">
        <el-input v-model="form.password" type="password" placeholder="Password" />
      </el-form-item >
      <el-form-item v-if="!isEdit" label="Confirm" prop="password_confirmation">
        <el-input v-model="form.password_confirmation" type="password" placeholder="Confirm password" />
      </el-form-item>

      <el-form-item label="Role" prop="role">
        <el-select v-model="form.role_id" placeholder="Select role">
          <el-option v-for="r in usersStore.roles" :key="r.id" :label="r.name" :value="r.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('cancel')">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">{{ isEdit ? 'Update' : 'Create' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref, watch, computed, type PropType, onMounted } from 'vue'
import { useUsersStore } from '@/stores/useUsersStore'
import type { UpdateUserDto } from '@/types/dto'

const props = defineProps({
  modelValue: Boolean,
  initialData: {
    type: Object as PropType<UpdateUserDto>,
    default: () => ({}),
  },
})

const emits = defineEmits(['update:modelValue', 'submit', 'cancel'])

const visible = ref(props.modelValue)

const usersStore = useUsersStore()
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
)

watch(visible, (val) => {
  emits('update:modelValue', val)
})

const formRef = ref<FormInstance | null>(null)
const form = ref()
const isEdit = computed(() => !!props.initialData?.email)

watch(
  () => props.initialData,
  (val) => {
    form.value = { ...val }
  },
  { immediate: true },
)

const rules = {
  name: [{ required: true, message: 'Name required', trigger: 'blur' }],
  email: [{ required: true, message: 'Email required', trigger: 'blur' }],
  password: [{ required: !isEdit.value, message: 'Password required', trigger: 'blur' }],
  password_confirmation: [{ required: !isEdit.value, message: 'Confirm password required', trigger: 'blur' }],
}

function onSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emits('submit', form.value)
    }
  })
}

function onClosed() {
  formRef.value?.resetFields()
  form.value = {}
}

onMounted(() => {
  if (usersStore.roles.length === 0) usersStore.fetchRoles()
})
</script>
