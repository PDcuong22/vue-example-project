<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ref, watch } from 'vue';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) }
});
const formRef = ref<FormInstance | null>(null);
const form = ref({ name: '', email: ''});

watch(() => props.initialData, (val) => {
  form.value = { name: val.name || '', email: val.email || ''};
}, { immediate: true });

const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
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
