<template>
  <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent>
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import type { FormInstance } from 'element-plus';

const props = defineProps({
  model: { type: Object, required: true }
});

const formRef = ref<FormInstance | null>(null);
const form = ref();

const rules = {
  name: [{ required: true, message: 'Name required', trigger: 'blur' }]
};

watch(() => props.model, (v) => {
  form.value = {...v}
}, { immediate: true });

function validateForm(){
  return formRef.value?.validate();
}

function getFormData(){
  return {...form.value}
}

defineExpose({validateForm, getFormData})
</script>
