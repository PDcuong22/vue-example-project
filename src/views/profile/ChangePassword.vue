<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="Old Password" prop="oldPassword">
      <el-input v-model="form.oldPassword" type="password" />
    </el-form-item>

    <el-form-item label="New Password" prop="newPassword">
      <el-input v-model="form.newPassword" type="password" />
    </el-form-item>

    <el-form-item label="Confirm" prop="newPassword_confirmation">
      <el-input v-model="form.newPassword_confirmation" type="password" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';

const formRef = ref<FormInstance | null>(null);
const form = ref({ oldPassword: '', newPassword: '', newPassword_confirmation: '' });

const rules = {
  oldPassword: [{ required: true, message: 'Old password is required', trigger: 'blur' }],
  newPassword: [{ required: true, message: 'New password is required', trigger: 'blur' }],
  newPassword_confirmation: [
    { required: true, message: 'Confirm password is required', trigger: 'blur' },
    {
      validator: (rule: unknown, value: string) => value === form.value.newPassword,
      message: 'Passwords do not match',
      trigger: 'blur'
    }
  ]
};

function validateForm() {
  return formRef.value?.validate();
}

function getFormData() {
  return { ...form.value };
}

function resetForm() {
  formRef.value?.resetFields();
}

defineExpose({ validateForm, getFormData, resetForm });
</script>
